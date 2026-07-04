import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  EnvelopeIcon, PaperAirplaneIcon, PaperClipIcon,
  MagnifyingGlassIcon, CheckCircleIcon, ClockIcon,
  TrashIcon, ArchiveBoxIcon, PlusCircleIcon,
  BuildingOfficeIcon,
} from '@heroicons/react/24/outline';
import api from '../../services/api';
import NewConversationModal from '../../components/messaging/NewConversationModal';

// ============================================================
// HELPERS
// ============================================================
const formatDate = (iso) => {
  if (!iso) return '';
  const d = new Date(iso);
  const today = new Date();
  if (d.toDateString() === today.toDateString())
    return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return 'Hier';
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
};

const formatMsgTime = (iso) =>
  iso ? new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '';

const initials = (name) =>
  (name || '?').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

// ============================================================
// COMPOSANT PRINCIPAL : HospitalMessaging
// ============================================================
const HospitalMessaging = () => {
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

  // ============================================================
  // CHARGEMENT CONVERSATIONS
  // ============================================================
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

  // ============================================================
  // CONVERSATION ACTIVE
  // ============================================================
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

  // ============================================================
  // WEBSOCKET
  // ============================================================
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
          return {
            ...prev,
            messages: [...(prev.messages || []), {
              id: data.message.id,
              content: data.message.content,
              created_at: data.message.created_at,
              is_mine: false,
              is_read: data.message.is_read,
            }],
          };
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

  // ============================================================
  // SCROLL AUTO
  // ============================================================
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation?.messages]);

  // ============================================================
  // ENVOI MESSAGE
  // ============================================================
  const handleSendMessage = async (e) => {
    e.preventDefault();
    const content = newMessage.trim();
    if (!content) return;
    setNewMessage('');

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'message', content }));
      // Affichage optimiste
      setActiveConversation(prev => prev ? {
        ...prev,
        messages: [...(prev.messages || []), {
          id: `tmp-${Date.now()}`,
          content,
          created_at: new Date().toISOString(),
          is_mine: true,
          is_read: false,
        }],
      } : prev);
    } else {
      try {
        const sent = await api.sendMessage(selectedId, content);
        setActiveConversation(prev => prev ? {
          ...prev,
          messages: [...(prev.messages || []), sent],
        } : prev);
      } catch (err) {
        console.error('Erreur envoi:', err);
      }
    }
  };

  const handleTyping = (val) => {
    setNewMessage(val);
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN)
      wsRef.current.send(JSON.stringify({ type: 'typing', is_typing: val.length > 0 }));
  };

  // ============================================================
  // NOUVELLE CONVERSATION CRÉÉE
  // ============================================================
  const handleConversationCreated = (conv) => {
    setConversations(prev => {
      const exists = prev.some(c => c.id === conv.id);
      if (exists) return prev;
      return [conv, ...prev];
    });
    setSelectedId(conv.id);
  };

  // ============================================================
  // FILTRAGE
  // ============================================================
  const filteredConversations = conversations.filter(conv => {
    const name = (conv.other_participant_name || '').toLowerCase();
    const last = (conv.last_message_text || '').toLowerCase();
    const matchSearch = name.includes(searchTerm.toLowerCase()) ||
                        last.includes(searchTerm.toLowerCase());
    const matchTab = activeTab === 'tous' ||
                     (activeTab === 'non-lus' && conv.unread_count > 0) ||
                     (activeTab === 'medecins' && conv.other_participant_role === 'doctor') ||
                     (activeTab === 'patients' && conv.other_participant_role === 'patient');
    return matchSearch && matchTab;
  });

  // ============================================================
  // BADGE RÔLE
  // ============================================================
  const roleBadge = (role) => {
    const map = {
      doctor:  { label: 'Médecin',  cls: 'bg-blue-100 text-blue-700' },
      patient: { label: 'Patient',  cls: 'bg-teal-100 text-teal-700' },
    };
    const r = map[role];
    if (!r) return null;
    return (
      <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${r.cls}`}>
        {r.label}
      </span>
    );
  };

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="flex h-[calc(100vh-8rem)] bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

      {/* ====== LISTE DES CONVERSATIONS ====== */}
      <div className="w-full md:w-1/3 border-r border-gray-200 flex flex-col">

        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <BuildingOfficeIcon className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Messagerie</h2>
            </div>
            {/* ✅ BOUTON NOUVELLE CONVERSATION */}
            <button
              onClick={() => setShowNewModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
            >
              <PlusCircleIcon className="h-4 w-4" />
              Nouveau
            </button>
          </div>

          {/* Recherche */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher..."
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Onglets filtre */}
          <div className="mt-3 flex space-x-1 border-b border-gray-100 overflow-x-auto">
            {[
              { key: 'tous',     label: 'Tous' },
              { key: 'medecins', label: 'Médecins' },
              { key: 'patients', label: 'Patients' },
              { key: 'non-lus',  label: 'Non lus' },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`whitespace-nowrap px-3 py-2 text-xs font-medium transition-colors ${
                  activeTab === tab.key
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Liste */}
        <div className="flex-1 overflow-y-auto">
          {loadingList ? (
            <div className="p-4 space-y-4 animate-pulse">
              {[1,2,3].map(i => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-gray-200 rounded-full flex-shrink-0"></div>
                  <div className="flex-1">
                    <div className="h-3 bg-gray-200 rounded w-28 mb-2"></div>
                    <div className="h-3 bg-gray-100 rounded w-40"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="text-center py-12 px-4">
              <EnvelopeIcon className="mx-auto h-12 w-12 text-gray-300 mb-3" />
              <p className="text-sm font-medium text-gray-900">Aucune conversation</p>
              <p className="text-xs text-gray-500 mt-1">
                {conversations.length === 0
                  ? 'Démarrez une conversation avec vos médecins ou patients.'
                  : 'Aucune conversation ne correspond aux filtres.'}
              </p>
              <button
                onClick={() => setShowNewModal(true)}
                className="mt-3 inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                <PlusCircleIcon className="h-4 w-4" />
                Démarrer une conversation
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {filteredConversations.map((conv) => (
                <li
                  key={conv.id}
                  onClick={() => setSelectedId(conv.id)}
                  className={`px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                    selectedId === conv.id ? 'bg-blue-50 border-l-2 border-blue-500' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {conv.other_participant_avatar ? (
                          <img src={conv.other_participant_avatar}
                            className="h-10 w-10 rounded-full object-cover" alt="" />
                        ) : (
                          <span className="text-blue-700 font-semibold text-sm">
                            {initials(conv.other_participant_name)}
                          </span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {conv.other_participant_name}
                          </p>
                          {roleBadge(conv.other_participant_role)}
                        </div>
                        <p className={`text-xs truncate ${
                          conv.unread_count > 0 ? 'font-semibold text-gray-900' : 'text-gray-500'
                        }`}>
                          {conv.last_message_text || 'Aucun message'}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end flex-shrink-0 ml-2">
                      <span className="text-xs text-gray-400">{formatDate(conv.last_message_time)}</span>
                      {conv.unread_count > 0 && (
                        <span className="mt-1 h-5 w-5 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center">
                          {conv.unread_count}
                        </span>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* ====== ZONE MESSAGERIE ====== */}
      {selectedId ? (
        loadingActive ? (
          <div className="hidden md:flex flex-1 items-center justify-center">
            <div className="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        ) : activeConversation ? (
          <div className="hidden md:flex md:flex-col flex-1">

            {/* En-tête conversation */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-white">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                  {activeConversation.other_participant_avatar ? (
                    <img src={activeConversation.other_participant_avatar}
                      className="h-10 w-10 object-cover" alt="" />
                  ) : (
                    <span className="text-blue-700 font-semibold text-sm">
                      {initials(activeConversation.other_participant_name)}
                    </span>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-semibold text-gray-900">
                      {activeConversation.other_participant_name}
                    </h3>
                    {roleBadge(activeConversation.other_participant_role)}
                  </div>
                  <p className="text-xs text-gray-500">
                    {otherTyping
                      ? <span className="text-blue-500">en train d'écrire...</span>
                      : activeConversation.other_participant_specialty || (wsConnected ? 'En ligne' : '')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100">
                  <ArchiveBoxIcon className="h-5 w-5" />
                </button>
                <button className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50">
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-6 overflow-y-auto bg-gray-50 space-y-3">
              {activeConversation.messages?.length > 0 ? (
                activeConversation.messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.is_mine ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs lg:max-w-md xl:max-w-lg rounded-xl px-4 py-2.5 ${
                      msg.is_mine
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none shadow-sm'
                    }`}>
                      <p className="text-sm leading-relaxed">{msg.content}</p>
                      <div className={`mt-1 flex items-center gap-1 ${
                        msg.is_mine ? 'justify-end text-blue-200' : 'text-gray-400'
                      }`}>
                        <span className="text-xs">{formatMsgTime(msg.created_at)}</span>
                        {msg.is_mine && (
                          msg.is_read
                            ? <CheckCircleIcon className="h-3 w-3" />
                            : <ClockIcon className="h-3 w-3" />
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-full py-16">
                  <EnvelopeIcon className="h-16 w-16 text-gray-200 mb-4" />
                  <p className="text-gray-500 text-sm">Aucun message</p>
                  <p className="text-gray-400 text-xs mt-1">
                    Envoyez votre premier message à {activeConversation.other_participant_name}
                  </p>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Saisie */}
            <div className="px-6 py-4 border-t border-gray-200 bg-white">
              <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                <button type="button" className="text-gray-400 hover:text-gray-600 flex-shrink-0">
                  <PaperClipIcon className="h-5 w-5" />
                </button>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => handleTyping(e.target.value)}
                  placeholder="Écrivez votre message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-full text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-full hover:bg-blue-700 disabled:opacity-50 transition-colors flex-shrink-0"
                >
                  <PaperAirplaneIcon className="h-4 w-4" />
                  Envoyer
                </button>
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
          <div className="text-center max-w-xs">
            <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
              <BuildingOfficeIcon className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Messagerie hôpital</h3>
            <p className="text-sm text-gray-500 mt-2">
              Communiquez avec vos médecins et patients depuis un seul endroit.
            </p>
            <button
              onClick={() => setShowNewModal(true)}
              className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
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

export default HospitalMessaging;