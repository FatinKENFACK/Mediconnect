import React, { useState, useEffect } from 'react';
import {
  ChatBubbleLeftRightIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
  PaperAirplaneIcon,
  PaperClipIcon,
  PhoneIcon,
  VideoCameraIcon,
  EllipsisHorizontalIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';

const HospitalMessaging = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const mockConversations = [
      {
        id: 1,
        patient: {
          name: 'Jean Dupont',
          email: 'jean.dupont@email.com',
          phone: '+221 77 123 45 67',
          avatar: null
        },
        doctor: 'Dr. Martin Laurent',
        service: 'Cardiologie',
        lastMessage: 'Merci pour la consultation d\'aujourd\'hui',
        lastMessageTime: '14:30',
        unreadCount: 2,
        status: 'active',
        priority: 'normal',
        appointmentId: 1
      },
      {
        id: 2,
        patient: {
          name: 'Marie Laurent',
          email: 'marie.laurent@email.com',
          phone: '+221 77 234 56 78',
          avatar: null
        },
        doctor: 'Dr. Sophie Bernard',
        service: 'Pédiatrie',
        lastMessage: 'Mon enfant a de la fièvre, que faire ?',
        lastMessageTime: '12:15',
        unreadCount: 1,
        status: 'pending',
        priority: 'high',
        appointmentId: 2
      },
      {
        id: 3,
        patient: {
          name: 'Pierre Dubois',
          email: 'pierre.dubois@email.com',
          phone: '+221 77 345 67 89',
          avatar: null
        },
        doctor: 'Dr. Pierre Dubois',
        service: 'Radiologie',
        lastMessage: 'Les résultats sont-ils disponibles ?',
        lastMessageTime: 'Hier',
        unreadCount: 0,
        status: 'resolved',
        priority: 'normal',
        appointmentId: 3
      },
      {
        id: 4,
        patient: {
          name: 'Sophie Martin',
          email: 'sophie.martin@email.com',
          phone: '+221 77 456 78 90',
          avatar: null
        },
        doctor: 'Dr. Marie Lefebvre',
        service: 'Gynécologie',
        lastMessage: 'Je souhaite prendre rendez-vous',
        lastMessageTime: '2 jours',
        unreadCount: 3,
        status: 'active',
        priority: 'normal',
        appointmentId: 4
      }
    ];
    setConversations(mockConversations);
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      // Charger les messages de la conversation sélectionnée
      const mockMessages = [
        {
          id: 1,
          sender: 'patient',
          content: 'Bonjour, j\'ai une question concernant mon traitement',
          timestamp: '2024-01-15 09:00',
          status: 'read'
        },
        {
          id: 2,
          sender: 'doctor',
          content: 'Bonjour Jean, je suis à votre disposition. Quelle est votre question ?',
          timestamp: '2024-01-15 09:15',
          status: 'read'
        },
        {
          id: 3,
          sender: 'patient',
          content: 'Je ressens des effets secondaires avec le nouveau médicament',
          timestamp: '2024-01-15 09:30',
          status: 'read'
        },
        {
          id: 4,
          sender: 'doctor',
          content: 'Quels sont les effets secondaires que vous ressentez ? Sont-ils graves ?',
          timestamp: '2024-01-15 10:00',
          status: 'read'
        },
        {
          id: 5,
          sender: 'patient',
          content: 'Merci pour la consultation d\'aujourd\'hui',
          timestamp: '2024-01-15 14:30',
          status: 'read'
        }
      ];
      setMessages(mockMessages);
    }
  }, [selectedConversation]);

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         conv.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         conv.service.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || conv.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'bg-blue-100 text-blue-800', label: 'Actif' },
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'En attente' },
      resolved: { color: 'bg-green-100 text-green-800', label: 'Résolu' }
    };
    
    const config = statusConfig[status] || statusConfig.active;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      normal: { color: 'bg-gray-100 text-gray-800', label: 'Normal' },
      high: { color: 'bg-red-100 text-red-800', label: 'Urgent' },
      low: { color: 'bg-blue-100 text-blue-800', label: 'Bas' }
    };
    
    const config = priorityConfig[priority] || priorityConfig.normal;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    setIsLoading(true);
    
    // Simuler l'envoi du message
    const newMsg = {
      id: messages.length + 1,
      sender: 'doctor',
      content: newMessage,
      timestamp: new Date().toLocaleString('fr-FR'),
      status: 'sent'
    };

    setMessages(prev => [...prev, newMsg]);
    setNewMessage('');
    
    // Mettre à jour la conversation
    setConversations(prev => prev.map(conv => 
      conv.id === selectedConversation.id 
        ? { ...conv, lastMessage: newMessage, lastMessageTime: 'Maintenant' }
        : conv
    ));
    
    setIsLoading(false);
  };

  const markAsRead = (conversationId) => {
    setConversations(prev => prev.map(conv => 
      conv.id === conversationId 
        ? { ...conv, unreadCount: 0 }
        : conv
    ));
  };

  const stats = {
    total: conversations.length,
    unread: conversations.reduce((sum, conv) => sum + conv.unreadCount, 0),
    active: conversations.filter(c => c.status === 'active').length,
    pending: conversations.filter(c => c.status === 'pending').length
  };

  return (
    <div className="p-6 h-full">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Messagerie</h1>
        <p className="text-gray-600 mt-2">Communiquez avec les patients</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-blue-500 p-3 rounded-lg">
              <ChatBubbleLeftRightIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total conversations</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-yellow-500 p-3 rounded-lg">
              <ExclamationCircleIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Messages non lus</p>
              <p className="text-2xl font-bold text-gray-900">{stats.unread}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-green-500 p-3 rounded-lg">
              <CheckCircleIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Actives</p>
              <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-orange-500 p-3 rounded-lg">
              <ClockIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">En attente</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-[calc(100vh-280px)]">
        <div className="flex h-full">
          {/* Conversations List */}
          <div className="w-1/3 border-r border-gray-200 flex flex-col">
            {/* Filters */}
            <div className="p-4 border-b border-gray-200">
              <div className="relative mb-3">
                <input
                  type="text"
                  placeholder="Rechercher une conversation..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tous les statuts</option>
                <option value="active">Actives</option>
                <option value="pending">En attente</option>
                <option value="resolved">Résolues</option>
              </select>
            </div>

            {/* Conversations */}
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => {
                    setSelectedConversation(conversation);
                    markAsRead(conversation.id);
                  }}
                  className={`p-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer ${
                    selectedConversation?.id === conversation.id ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                      <UserCircleIcon className="h-8 w-8 text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {conversation.patient.name}
                        </p>
                        <span className="text-xs text-gray-500">{conversation.lastMessageTime}</span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">{conversation.doctor}</p>
                      <p className="text-sm text-gray-500 truncate mt-1">{conversation.lastMessage}</p>
                      <div className="flex items-center justify-between mt-2">
                        {getStatusBadge(conversation.status)}
                        {getPriorityBadge(conversation.priority)}
                        {conversation.unreadCount > 0 && (
                          <span className="inline-flex items-center justify-center h-5 w-5 text-xs font-bold text-white bg-blue-600 rounded-full">
                            {conversation.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
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
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center">
                        <UserCircleIcon className="h-8 w-8 text-gray-600" />
                      </div>
                      <div>
                        <p className="text-lg font-medium text-gray-900">
                          {selectedConversation.patient.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {selectedConversation.doctor} - {selectedConversation.service}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-600 hover:text-gray-800">
                        <PhoneIcon className="h-5 w-5" />
                      </button>
                      <button className="p-2 text-gray-600 hover:text-gray-800">
                        <VideoCameraIcon className="h-5 w-5" />
                      </button>
                      <button className="p-2 text-gray-600 hover:text-gray-800">
                        <EllipsisHorizontalIcon className="h-5 w-5" />
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
                          {message.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200">
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-600 hover:text-gray-800">
                      <PaperClipIcon className="h-5 w-5" />
                    </button>
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder="Tapez votre message..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      onClick={sendMessage}
                      disabled={isLoading || !newMessage.trim()}
                      className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
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
                  <p className="text-gray-600">Sélectionnez une conversation pour commencer</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HospitalMessaging;
