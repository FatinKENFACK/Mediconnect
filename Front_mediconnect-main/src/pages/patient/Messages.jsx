import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeftIcon, PaperAirplaneIcon, PaperClipIcon, FaceSmileIcon,
  MagnifyingGlassIcon as SearchIcon, EllipsisVerticalIcon,
  PhoneIcon, VideoCameraIcon, CheckIcon, UserCircleIcon,
} from '@heroicons/react/24/outline';
import api from '../../services/api';

// ============================================================
// HELPERS
// ============================================================
const formatTime = (iso) => {
  if (!iso) return '';
  const d = new Date(iso);
  const today = new Date();
  const isToday = d.toDateString() === today.toDateString();
  if (isToday) return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return 'Hier';
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
};

const formatMsgTime = (iso) => {
  if (!iso) return '';
  return new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
};

const initials = (name) => (name || '?').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

// ============================================================
// COMPOSANT PRINCIPAL : Messages (Patient)
// ============================================================
const Messages = () => {
  const { conversationId } = useParams();
  const navigate = useNavigate();

  const [conversations, setConversations] = useState([]);
  const [loadingList, setLoadingList]      = useState(true);
  const [activeConversation, setActiveConversation] = useState(null);
  const [loadingActive, setLoadingActive]  = useState(false);
  const [message, setMessage]              = useState('');
  const [search, setSearch]                = useState('');
  const [otherTyping, setOtherTyping]       = useState(false);
  const [wsConnected, setWsConnected]       = useState(false);

  const messagesEndRef = useRef(null);
  const wsRef           = useRef(null);
  const typingTimeoutRef = useRef(null);

  // ============================================================
  // CHARGER LA LISTE DES CONVERSATIONS
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
  // CHARGER LA CONVERSATION ACTIVE (historique complet)
  // ============================================================
  useEffect(() => {
    if (!conversationId) {
      setActiveConversation(null);
      return;
    }

    const loadConversation = async () => {
      setLoadingActive(true);
      try {
        const data = await api.getConversation(conversationId);
        setActiveConversation(data);
      } catch (err) {
        console.error('Erreur chargement conversation:', err);
        setActiveConversation(null);
      } finally {
        setLoadingActive(false);
      }
    };
    loadConversation();
  }, [conversationId]);

  // ============================================================
  // CONNEXION WEBSOCKET
  // ============================================================
  useEffect(() => {
    if (!conversationId) return;

    const wsUrl = api.getChatSocketUrl(conversationId);
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => setWsConnected(true);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === 'message') {
        setActiveConversation(prev => {
          if (!prev) return prev;
          // Éviter les doublons
          if (prev.messages?.some(m => m.id === data.message.id)) return prev;
          return {
            ...prev,
            messages: [...(prev.messages || []), {
              id: data.message.id,
              content: data.message.content,
              created_at: data.message.created_at,
              is_mine: data.message.sender_id !== getOtherParticipantId(prev),
              sender_name: data.message.sender_name,
              is_read: data.message.is_read,
            }],
          };
        });
        // Mettre à jour la liste (dernier message + tri)
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

    return () => {
      ws.close();
      wsRef.current = null;
    };
  }, [conversationId]);

  // Helper : retrouve l'ID de l'autre participant (pour distinguer is_mine côté WS)
  const getOtherParticipantId = () => null; // is_mine déjà géré côté serveur via sender_id == request.user

  // ============================================================
  // SCROLL AUTO EN BAS
  // ============================================================
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation?.messages]);

  // ============================================================
  // ENVOI MESSAGE (via WebSocket, fallback REST si déconnecté)
  // ============================================================
  const handleSendMessage = async (e) => {
    e.preventDefault();
    const content = message.trim();
    if (!content) return;

    setMessage('');

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'message', content }));
    } else {
      // Fallback REST si le WebSocket n'est pas connecté
      try {
        const sent = await api.sendMessage(conversationId, content);
        setActiveConversation(prev => prev ? {
          ...prev,
          messages: [...(prev.messages || []), sent],
        } : prev);
      } catch (err) {
        console.error('Erreur envoi message:', err);
      }
    }
  };

  // ============================================================
  // INDICATEUR "EN TRAIN D'ÉCRIRE"
  // ============================================================
  const handleTyping = (val) => {
    setMessage(val);
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'typing', is_typing: val.length > 0 }));
    }
  };

  // ============================================================
  // FILTRAGE RECHERCHE
  // ============================================================
  const filteredConversations = conversations.filter(c =>
    (c.other_participant_name || '').toLowerCase().includes(search.toLowerCase())
  );

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="flex h-[calc(100vh-64px)] bg-white">

      {/* ====== LISTE DES CONVERSATIONS ====== */}
      <div className={`${conversationId ? 'hidden md:block' : 'block'} w-full md:w-1/3 border-r border-gray-200`}>
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">Messages</h1>
          <div className="relative mt-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Rechercher une conversation..."
            />
          </div>
        </div>

        <div className="overflow-y-auto h-[calc(100%-80px)]">
          {loadingList ? (
            <div className="p-4 space-y-4 animate-pulse">
              {[1,2,3].map(i => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-3 bg-gray-200 rounded w-28 mb-2"></div>
                    <div className="h-3 bg-gray-100 rounded w-40"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="p-8 text-center">
              <UserCircleIcon className="h-12 w-12 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Aucune conversation</p>
            </div>
          ) : (
            filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => navigate(`/patient/messages/${conversation.id}`)}
                className={`flex items-center p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                  conversationId === String(conversation.id) ? 'bg-blue-50' : ''
                }`}
              >
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0 overflow-hidden">
                  {conversation.other_participant_avatar ? (
                    <img src={conversation.other_participant_avatar} className="h-12 w-12 object-cover" alt="" />
                  ) : (
                    <span className="text-blue-700 font-semibold text-sm">
                      {initials(conversation.other_participant_name)}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <h2 className="text-sm font-medium text-gray-900 truncate">
                      {conversation.other_participant_name}
                    </h2>
                    <span className="text-xs text-gray-500">{formatTime(conversation.last_message_time)}</span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">{conversation.last_message_text || 'Aucun message'}</p>
                </div>
                {conversation.unread_count > 0 && (
                  <span className="ml-2 bg-blue-600 text-white text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0">
                    {conversation.unread_count}
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* ====== CONVERSATION ACTIVE ====== */}
      {conversationId ? (
        loadingActive ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-sm text-gray-400">Chargement de la conversation...</p>
          </div>
        ) : activeConversation ? (
          <div className="flex-1 flex flex-col">

            {/* En-tête */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center">
                <button onClick={() => navigate('/patient/messages')} className="md:hidden mr-4 text-gray-500 hover:text-gray-700">
                  <ArrowLeftIcon className="h-5 w-5" />
                </button>
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 overflow-hidden">
                  {activeConversation.other_participant_avatar ? (
                    <img src={activeConversation.other_participant_avatar} className="h-10 w-10 object-cover" alt="" />
                  ) : (
                    <span className="text-blue-700 font-semibold text-xs">
                      {initials(activeConversation.other_participant_name)}
                    </span>
                  )}
                </div>
                <div>
                  <h2 className="text-sm font-medium text-gray-900">
                    {activeConversation.other_participant_name}
                  </h2>
                  <p className="text-xs text-gray-500">
                    {otherTyping ? (
                      <span className="text-blue-500">en train d'écrire...</span>
                    ) : (
                      activeConversation.other_participant_specialty || (wsConnected ? 'En ligne' : '')
                    )}
                  </p>
                </div>
              </div>
              <div className="flex space-x-4">
                <button className="text-gray-500 hover:text-gray-700"><PhoneIcon className="h-5 w-5" /></button>
                <button className="text-gray-500 hover:text-gray-700"><VideoCameraIcon className="h-5 w-5" /></button>
                <button className="text-gray-500 hover:text-gray-700"><EllipsisVerticalIcon className="h-5 w-5" /></button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {activeConversation.messages?.length > 0 ? (
                activeConversation.messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.is_mine ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      msg.is_mine ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none shadow'
                    }`}>
                      <p className="text-sm">{msg.content}</p>
                      <div className="flex items-center justify-end mt-1 space-x-1">
                        <span className="text-xs opacity-70">{formatMsgTime(msg.created_at)}</span>
                        {msg.is_mine && (
                          <CheckIcon className={`h-3 w-3 ${msg.is_read ? 'text-blue-300' : 'text-gray-300'}`} />
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-6">
                  <UserCircleIcon className="h-16 w-16 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900">Aucun message</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Envoyez votre premier message à {activeConversation.other_participant_name}
                  </p>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Saisie */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <form onSubmit={handleSendMessage} className="flex items-center">
                <button type="button" className="p-2 text-gray-500 hover:text-gray-700">
                  <PaperClipIcon className="h-5 w-5" />
                </button>
                <button type="button" className="p-2 text-gray-500 hover:text-gray-700">
                  <FaceSmileIcon className="h-5 w-5" />
                </button>
                <input
                  type="text"
                  value={message}
                  onChange={(e) => handleTyping(e.target.value)}
                  className="flex-1 mx-2 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Écrivez votre message..."
                />
                <button type="submit" disabled={!message.trim()} className="p-2 text-blue-600 hover:text-blue-800 disabled:text-gray-400">
                  <PaperAirplaneIcon className="h-5 w-5" />
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-sm text-gray-500">Conversation introuvable.</p>
          </div>
        )
      ) : (
        <div className="hidden md:flex flex-1 items-center justify-center bg-gray-50">
          <div className="text-center p-6">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100">
              <UserCircleIcon className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">Sélectionnez une conversation</h3>
            <p className="mt-1 text-sm text-gray-500">
              Choisissez une conversation existante ou commencez-en une nouvelle.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;