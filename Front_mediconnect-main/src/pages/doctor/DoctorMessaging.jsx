import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  EnvelopeIcon, PaperAirplaneIcon, PaperClipIcon, UserCircleIcon,
  MagnifyingGlassIcon, CheckCircleIcon, ClockIcon,
  TrashIcon, ArchiveBoxIcon, PlusCircleIcon,
} from '@heroicons/react/24/outline';
import api from '../../services/api';
import NewConversationModal from '../../components/messaging/NewConversationModal';

const formatDate = (iso) => {
  if (!iso) return '';
  const d = new Date(iso);
  const today = new Date();
  if (d.toDateString() === today.toDateString())
    return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return 'Hier';
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
};

const formatMsgTime = (iso) =>
  iso ? new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '';

const initials = (name) =>
  (name || '?').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

const MessagerieDoctor = () => {
  const [conversations, setConversations]           = useState([]);
  const [loadingList, setLoadingList]               = useState(true);
  const [searchTerm, setSearchTerm]                 = useState('');
  const [activeTab, setActiveTab]                   = useState('tous');
  const [selectedId, setSelectedId]                 = useState(null);
  const [activeConversation, setActiveConversation] = useState(null);
  const [loadingActive, setLoadingActive]           = useState(false);
  const [newMessage, setNewMessage]                 = useState('');
  const [wsConnected, setWsConnected]               = useState(false);
  const [otherTyping, setOtherTyping]               = useState(false);
  const [showNewModal, setShowNewModal]             = useState(false);

  const wsRef            = useRef(null);
  const typingTimeoutRef = useRef(null);
  const messagesEndRef   = useRef(null);

  const loadConversations = useCallback(async () => {
    setLoadingList(true);
    try {
      const data = await api.getConversations();
      setConversations(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      console.error('Erreur chargement conversations:', err);
    } finally {
      setLoadingList(false);
    }
  }, []);

  useEffect(() => { loadConversations(); }, [loadConversations]);

  useEffect(() => {
    if (!selectedId) { setActiveConversation(null); return; }
    const load = async () => {
      setLoadingActive(true);
      try {
        const data = await api.getConversation(selectedId);
        setActiveConversation(data);
      } catch { setActiveConversation(null); }
      finally { setLoadingActive(false); }
    };
    load();
  }, [selectedId]);

  useEffect(() => {
    if (!selectedId) return;
    const ws = new WebSocket(api.getChatSocketUrl(selectedId));
    wsRef.current = ws;
    ws.onopen = () => setWsConnected(true);
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'message') {
        setActiveConversation(prev => {
          if (!prev) return prev;
          if (prev.messages?.some(m => m.id === data.message.id)) return prev;
          return { ...prev, messages: [...(prev.messages || []), {
            id: data.message.id, content: data.message.content,
            created_at: data.message.created_at, is_mine: false,
            is_read: data.message.is_read,
          }]};
        });
        loadConversations();
      }
      if (data.type === 'typing') {
        setOtherTyping(data.is_typing);
        if (data.is_typing) {
          clearTimeout(typingTimeoutRef.current);
          typingTimeoutRef.current = setTimeout(() => setOtherTyping(false), 3000);
        }
      }
    };
    ws.onclose = () => setWsConnected(false);
    ws.onerror = () => setWsConnected(false);
    return () => { ws.close(); wsRef.current = null; };
  }, [selectedId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation?.messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const content = newMessage.trim();
    if (!content) return;
    setNewMessage('');
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'message', content }));
      setActiveConversation(prev => prev ? {
        ...prev, messages: [...(prev.messages || []), {
          id: `tmp-${Date.now()}`, content,
          created_at: new Date().toISOString(), is_mine: true, is_read: false,
        }],
      } : prev);
    } else {
      try {
        const sent = await api.sendMessage(selectedId, content);
        setActiveConversation(prev => prev ? {
          ...prev, messages: [...(prev.messages || []), sent],
        } : prev);
      } catch (err) { console.error('Erreur envoi:', err); }
    }
  };

  const handleTyping = (val) => {
    setNewMessage(val);
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN)
      wsRef.current.send(JSON.stringify({ type: 'typing', is_typing: val.length > 0 }));
  };

  // ✅ Quand une nouvelle conversation est créée, on l'ajoute et on la sélectionne
  const handleConversationCreated = (conv) => {
    setConversations(prev => {
      const exists = prev.some(c => c.id === conv.id);
      if (exists) return prev;
      return [conv, ...prev];
    });
    setSelectedId(conv.id);
  };

  const filteredConversations = conversations.filter(conv => {
    const name = (conv.other_participant_name || '').toLowerCase();
    const last = (conv.last_message_text || '').toLowerCase();
    const matchesSearch = name.includes(searchTerm.toLowerCase()) || last.includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'tous' || (activeTab === 'non-lus' && conv.unread_count > 0);
    return matchesSearch && matchesTab;
  });

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-white rounded-lg shadow overflow-hidden">

      {/* ====== LISTE ====== */}
      <div className="w-full md:w-1/3 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-medium text-gray-900">Messages</h2>
            {/* ✅ BOUTON NOUVELLE CONVERSATION */}
            <button
              onClick={() => setShowNewModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
              title="Nouvelle conversation"
            >
              <PlusCircleIcon className="h-4 w-4" />
              Nouveau
            </button>
          </div>

          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
              placeholder="Rechercher une conversation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="mt-3 flex space-x-1 border-b">
            {[{ key: 'tous', label: 'Tous' }, { key: 'non-lus', label: 'Non lus' }].map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                className={`px-3 py-2 text-sm font-medium ${
                  activeTab === tab.key ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'
                }`}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loadingList ? (
            <div className="p-4 space-y-4 animate-pulse">
              {[1,2,3].map(i => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-3 bg-gray-200 rounded w-28 mb-2"></div>
                    <div className="h-3 bg-gray-100 rounded w-40"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="text-center py-12">
              <EnvelopeIcon className="mx-auto h-12 w-12 text-gray-400 mb-3" />
              <h3 className="text-sm font-medium text-gray-900">Aucune conversation</h3>
              <button
                onClick={() => setShowNewModal(true)}
                className="mt-3 inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                <PlusCircleIcon className="h-4 w-4" />
                Démarrer une conversation
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {filteredConversations.map((conversation) => (
                <li key={conversation.id}
                  className={`hover:bg-gray-50 cursor-pointer ${selectedId === conversation.id ? 'bg-blue-50' : ''}`}
                  onClick={() => setSelectedId(conversation.id)}>
                  <div className="px-4 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0">
                          {conversation.other_participant_avatar ? (
                            <img className="h-10 w-10 rounded-full object-cover"
                              src={conversation.other_participant_avatar} alt="" />
                          ) : (
                            <span className="text-blue-700 font-semibold text-sm">
                              {initials(conversation.other_participant_name)}
                            </span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {conversation.other_participant_name}
                          </p>
                          <p className={`text-sm truncate max-w-xs ${
                            conversation.unread_count > 0 ? 'font-semibold text-gray-900' : 'text-gray-500'
                          }`}>
                            {conversation.last_message_text || 'Aucun message'}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end ml-2">
                        <span className="text-xs text-gray-500">{formatDate(conversation.last_message_time)}</span>
                        {conversation.unread_count > 0 && (
                          <span className="mt-1 inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-600 text-white text-xs">
                            {conversation.unread_count}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* ====== ZONE DE MESSAGERIE ====== */}
      {selectedId ? (
        loadingActive ? (
          <div className="hidden md:flex flex-1 items-center justify-center">
            <p className="text-sm text-gray-400">Chargement de la conversation...</p>
          </div>
        ) : activeConversation ? (
          <div className="hidden md:flex md:flex-col flex-1">
            {/* En-tête */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 overflow-hidden">
                  {activeConversation.other_participant_avatar ? (
                    <img className="h-10 w-10 rounded-full object-cover"
                      src={activeConversation.other_participant_avatar} alt="" />
                  ) : (
                    <span className="text-blue-700 font-semibold text-sm">
                      {initials(activeConversation.other_participant_name)}
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="text-base font-medium text-gray-900">
                    {activeConversation.other_participant_name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {otherTyping
                      ? <span className="text-blue-500">en train d'écrire...</span>
                      : wsConnected ? 'En ligne' : ''}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="p-1 rounded-full text-gray-400 hover:text-gray-500">
                  <ArchiveBoxIcon className="h-5 w-5" />
                </button>
                <button className="p-1 rounded-full text-gray-400 hover:text-gray-500">
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
              <div className="space-y-4">
                {activeConversation.messages?.length > 0 ? (
                  activeConversation.messages.map((message) => (
                    <div key={message.id} className={`flex ${message.is_mine ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs md:max-w-md lg:max-w-lg rounded-lg px-4 py-2 ${
                        message.is_mine ? 'bg-blue-600 text-white' : 'bg-white text-gray-800 border border-gray-200'
                      }`}>
                        <p className="text-sm">{message.content}</p>
                        <div className={`mt-1 text-xs flex items-center ${
                          message.is_mine ? 'text-blue-100 justify-end' : 'text-gray-500'
                        }`}>
                          {formatMsgTime(message.created_at)}
                          {message.is_mine && (
                            <span className="ml-1">
                              {message.is_read
                                ? <CheckCircleIcon className="h-3.5 w-3.5 text-blue-300" />
                                : <ClockIcon className="h-3.5 w-3.5 text-blue-300" />}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <EnvelopeIcon className="mx-auto h-12 w-12 text-gray-300 mb-2" />
                    <p className="text-sm text-gray-500">Aucun message pour le moment</p>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Saisie */}
            <div className="p-4 border-t border-gray-200">
              <form onSubmit={handleSendMessage} className="flex items-center">
                <div className="flex-1">
                  <div className="relative rounded-md shadow-sm">
                    <input type="text"
                      className="focus:ring-blue-500 focus:border-blue-500 block w-full pr-12 sm:text-sm border-gray-300 rounded-md"
                      placeholder="Écrivez votre message..."
                      value={newMessage}
                      onChange={(e) => handleTyping(e.target.value)}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                      <button type="button" className="p-1 rounded-full text-gray-400 hover:text-gray-500">
                        <PaperClipIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="ml-3">
                  <button type="submit" disabled={!newMessage.trim()}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50">
                    <PaperAirplaneIcon className="-ml-1 mr-2 h-5 w-5" />
                    Envoyer
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <div className="hidden md:flex flex-1 items-center justify-center bg-gray-50">
            <p className="text-sm text-gray-500">Conversation introuvable.</p>
          </div>
        )
      ) : (
        <div className="hidden md:flex flex-1 items-center justify-center bg-gray-50">
          <div className="text-center">
            <EnvelopeIcon className="mx-auto h-12 w-12 text-gray-400 mb-3" />
            <h3 className="text-sm font-medium text-gray-900">Aucune conversation sélectionnée</h3>
            <p className="mt-1 text-sm text-gray-500">Sélectionnez ou démarrez une conversation.</p>
            <button
              onClick={() => setShowNewModal(true)}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
            >
              <PlusCircleIcon className="h-4 w-4" />
              Nouvelle conversation
            </button>
          </div>
        </div>
      )}

      {/* ====== MODAL NOUVELLE CONVERSATION ====== */}
      {showNewModal && (
        <NewConversationModal
          onClose={() => setShowNewModal(false)}
          onConversationCreated={handleConversationCreated}
        />
      )}
    </div>
  );
};

export default MessagerieDoctor;