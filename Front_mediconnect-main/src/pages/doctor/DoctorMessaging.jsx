import React, { useState, useEffect } from 'react';
import { 
  ChatBubbleLeftRightIcon,
  MagnifyingGlassIcon,
  PaperAirplaneIcon,
  PaperClipIcon,
  PhoneIcon,
  VideoCameraIcon,
  UserGroupIcon,
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  BellIcon,
  XMarkIcon,
  UserIcon,
  EnvelopeIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

export default function DoctorMessaging() {
  const [conversations, setConversations] = useState([
    {
      id: 1,
      patientName: 'Marie Kengne',
      patientEmail: 'marie.kengne@email.com',
      lastMessage: 'Merci pour la consultation d\'aujourd\'hui',
      time: '10:30',
      unread: 2,
      avatar: 'MK',
      status: 'online',
      appointmentId: 'APT-001',
      lastActivity: new Date()
    },
    {
      id: 2,
      patientName: 'Jean Mballa',
      patientEmail: 'jean.mballa@email.com',
      lastMessage: 'Puis-je décaler mon rendez-vous de demain?',
      time: '09:15',
      unread: 1,
      avatar: 'JM',
      status: 'offline',
      appointmentId: 'APT-002',
      lastActivity: new Date(Date.now() - 3600000)
    },
    {
      id: 3,
      patientName: 'Sophie Ngo',
      patientEmail: 'sophie.ngo@email.com',
      lastMessage: 'Les médicaments fonctionnent bien',
      time: 'Hier',
      unread: 0,
      avatar: 'SN',
      status: 'online',
      appointmentId: 'APT-003',
      lastActivity: new Date(Date.now() - 86400000)
    }
  ]);

  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showQuickReplies, setShowQuickReplies] = useState(false);

  const quickReplies = [
    'Merci pour votre message.',
    'Je vais vérifier cela et vous répondre.',
    'Veuillez prendre rendez-vous pour une consultation.',
    'Les résultats sont normaux.',
    'N\'hésitez pas si vous avez d\'autres questions.',
    'Je vous envoie l\'ordonnance par email.'
  ];

  useEffect(() => {
    if (selectedConversation) {
      // Charger les messages de la conversation sélectionnée
      const mockMessages = [
        {
          id: 1,
          sender: 'patient',
          content: 'Bonjour Docteur, j\'ai des questions sur mon traitement',
          time: '09:00',
          type: 'text'
        },
        {
          id: 2,
          sender: 'doctor',
          content: 'Bonjour Marie, je suis là pour répondre à vos questions.',
          time: '09:05',
          type: 'text'
        },
        {
          id: 3,
          sender: 'patient',
          content: 'Merci pour la consultation d\'aujourd\'hui',
          time: '10:30',
          type: 'text'
        }
      ];
      setMessages(mockMessages);
    }
  }, [selectedConversation]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const newMsg = {
      id: messages.length + 1,
      sender: 'doctor',
      content: newMessage,
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      type: 'text'
    };

    setMessages([...messages, newMsg]);
    setNewMessage('');
    setShowQuickReplies(false);

    // Mettre à jour la conversation
    setConversations(prev => 
      prev.map(conv => 
        conv.id === selectedConversation.id 
          ? { ...conv, lastMessage: newMessage, time: 'Maintenant', unread: 0 }
          : conv
      )
    );
  };

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    // Marquer comme lu
    setConversations(prev => 
      prev.map(conv => 
        conv.id === conversation.id 
          ? { ...conv, unread: 0 }
          : conv
      )
    );
  };

  const handleQuickReply = (reply) => {
    setNewMessage(reply);
    setShowQuickReplies(false);
  };

  const handleStartVideoCall = () => {
    // Lancer une visioconférence
    alert('Lancement de la visioconférence...');
  };

  const filteredConversations = conversations.filter(conv =>
    conv.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.patientEmail.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Messagerie</h1>
          <p className="text-gray-600 mt-2">Communiquez avec vos patients en toute sécurité</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-[600px]">
          <div className="flex h-full">
            {/* Conversations List */}
            <div className="w-80 border-r border-gray-200 flex flex-col">
              {/* Search */}
              <div className="p-4 border-b border-gray-200">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher une conversation..."
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Conversations */}
              <div className="flex-1 overflow-y-auto">
                {filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => handleSelectConversation(conversation)}
                    className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                      selectedConversation?.id === conversation.id ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-600">{conversation.avatar}</span>
                        </div>
                      </div>
                      <div className="ml-3 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900">{conversation.patientName}</p>
                          <span className="text-xs text-gray-500">{conversation.time}</span>
                        </div>
                        <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                        <div className="flex items-center mt-1">
                          <div className={`w-2 h-2 rounded-full mr-2 ${
                            conversation.status === 'online' ? 'bg-green-400' : 'bg-gray-300'
                          }`}></div>
                          <span className="text-xs text-gray-500">
                            {conversation.status === 'online' ? 'En ligne' : 'Hors ligne'}
                          </span>
                        </div>
                      </div>
                      {conversation.unread > 0 && (
                        <div className="ml-2">
                          <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-medium bg-blue-600 text-white rounded-full">
                            {conversation.unread}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
              {selectedConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-200 bg-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-600">{selectedConversation.avatar}</span>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">{selectedConversation.patientName}</p>
                          <p className="text-xs text-gray-500">{selectedConversation.patientEmail}</p>
                        </div>
                        <div className={`w-2 h-2 rounded-full ml-2 ${
                          selectedConversation.status === 'online' ? 'bg-green-400' : 'bg-gray-300'
                        }`}></div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={handleStartVideoCall}
                          className="p-2 text-gray-500 hover:text-gray-700"
                        >
                          <VideoCameraIcon className="h-5 w-5" />
                        </button>
                        <button className="p-2 text-gray-500 hover:text-gray-700">
                          <PhoneIcon className="h-5 w-5" />
                        </button>
                        <button className="p-2 text-gray-500 hover:text-gray-700">
                          <CalendarIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === 'doctor' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.sender === 'doctor'
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p className={`text-xs mt-1 ${
                            message.sender === 'doctor' ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            {message.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Quick Replies */}
                  {showQuickReplies && (
                    <div className="p-4 border-t border-gray-200 bg-gray-50">
                      <div className="grid grid-cols-2 gap-2">
                        {quickReplies.map((reply, index) => (
                          <button
                            key={index}
                            onClick={() => handleQuickReply(reply)}
                            className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-100 text-left"
                          >
                            {reply}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-500 hover:text-gray-700">
                        <PaperClipIcon className="h-5 w-5" />
                      </button>
                      <div className="flex-1">
                        <input
                          type="text"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                          placeholder="Tapez votre message..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <button
                        onClick={() => setShowQuickReplies(!showQuickReplies)}
                        className="p-2 text-gray-500 hover:text-gray-700"
                      >
                        <DocumentTextIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={handleSendMessage}
                        className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        <PaperAirplaneIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <ChatBubbleLeftRightIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Sélectionnez une conversation</h3>
                    <p className="text-gray-600">Choisissez une conversation pour commencer à discuter</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <BellIcon className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
            <div>
              <h3 className="font-medium text-blue-900 mb-1">Conseils de messagerie</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>Répondez aux messages dans les 24 heures pour un meilleur service</li>
                <li>Utilisez les réponses rapides pour gagner du temps</li>
                <li>Ne partagez jamais d'informations médicales sensibles par messagerie</li>
                <li>Les messages sont cryptés pour garantir la confidentialité</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
