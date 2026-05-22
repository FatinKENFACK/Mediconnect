import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeftIcon,
  PaperAirplaneIcon,
  PaperClipIcon,
  FaceSmileIcon,
  MagnifyingGlassIcon as SearchIcon,
  EllipsisVerticalIcon,
  PhoneIcon,
  VideoCameraIcon,
  CheckIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';

// Données factices pour les conversations
const conversations = [
  {
    id: '1',
    doctor: 'Dr. Martin Dupont',
    specialty: 'Médecin généraliste',
    lastMessage: 'Bonjour, comment allez-vous depuis notre dernière consultation ?',
    time: '10:30',
    unread: 2,
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    messages: [
      { id: 1, sender: 'doctor', text: 'Bonjour, comment allez-vous depuis notre dernière consultation ?', time: '10:30', read: true },
      { id: 2, sender: 'me', text: 'Bonjour Docteur, je vais bien merci. Et vous ?', time: '10:32', read: true },
      { id: 3, sender: 'doctor', text: 'Très bien, merci. Avez-vous suivi le traitement que je vous ai prescrit ?', time: '10:33', read: false },
    ]
  },
  {
    id: '2',
    doctor: 'Dr. Sophie Martin',
    specialty: 'Cardiologue',
    lastMessage: 'Vos résultats d\'analyse sont disponibles.',
    time: 'Hier',
    unread: 0,
    avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
    messages: []
  },
  {
    id: '3',
    doctor: 'Dr. Jean Lefebvre',
    specialty: 'Dermatologue',
    lastMessage: 'N\'oubliez pas votre rendez-vous demain à 14h30.',
    time: 'Lun',
    unread: 0,
    avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
    messages: []
  },
];

const Messages = () => {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [activeConversation, setActiveConversation] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (conversationId) {
      const conversation = conversations.find(c => c.id === conversationId);
      setActiveConversation(conversation);
    } else {
      setActiveConversation(null);
    }
  }, [conversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [activeConversation]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim() === '') return;
    
    // Logique d'envoi de message
    console.log('Message envoyé:', message);
    setMessage('');
    
    // Faire défiler vers le bas après l'envoi
    setTimeout(scrollToBottom, 100);
  };

  return (
    <div className="flex h-[calc(100vh-64px)] bg-white">
      {/* Liste des conversations */}
      <div className={`${conversationId ? 'hidden md:block' : 'block'} w-full md:w-1/3 border-r border-gray-200`}>
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">Messages</h1>
          <div className="relative mt-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Rechercher une conversation..."
            />
          </div>
        </div>
        <div className="overflow-y-auto h-[calc(100%-80px)]">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => navigate(`/patient/messages/${conversation.id}`)}
              className={`flex items-center p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                conversationId === conversation.id ? 'bg-blue-50' : ''
              }`}
            >
              <img
                className="h-12 w-12 rounded-full object-cover mr-3"
                src={conversation.avatar}
                alt={conversation.doctor}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/48';
                }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <h2 className="text-sm font-medium text-gray-900 truncate">
                    {conversation.doctor}
                  </h2>
                  <span className="text-xs text-gray-500">{conversation.time}</span>
                </div>
                <p className="text-sm text-gray-500 truncate">{conversation.lastMessage}</p>
              </div>
              {conversation.unread > 0 && (
                <span className="ml-2 bg-blue-600 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                  {conversation.unread}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Conversation active */}
      {activeConversation ? (
        <div className="flex-1 flex flex-col">
          {/* En-tête de la conversation */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center">
              <button 
                onClick={() => navigate('/patient/messages')}
                className="md:hidden mr-4 text-gray-500 hover:text-gray-700"
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </button>
              <img
                className="h-10 w-10 rounded-full object-cover mr-3"
                src={activeConversation.avatar}
                alt={activeConversation.doctor}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/40';
                }}
              />
              <div>
                <h2 className="text-sm font-medium text-gray-900">
                  {activeConversation.doctor}
                </h2>
                <p className="text-xs text-gray-500">{activeConversation.specialty}</p>
              </div>
            </div>
            <div className="flex space-x-4">
              <button className="text-gray-500 hover:text-gray-700">
                <PhoneIcon className="h-5 w-5" />
              </button>
              <button className="text-gray-500 hover:text-gray-700">
                <VideoCameraIcon className="h-5 w-5" />
              </button>
              <button className="text-gray-500 hover:text-gray-700">
                <EllipsisVerticalIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {activeConversation.messages.length > 0 ? (
              activeConversation.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      msg.sender === 'me'
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-white text-gray-800 rounded-bl-none shadow'
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                    <div className="flex items-center justify-end mt-1 space-x-1">
                      <span className="text-xs opacity-70">
                        {msg.time}
                      </span>
                      {msg.sender === 'me' && (
                        <span className="text-xs">
                          {msg.read ? (
                            <CheckIcon className="h-3 w-3 text-blue-300" />
                          ) : (
                            <CheckIcon className="h-3 w-3 text-gray-400" />
                          )}
                        </span>
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
                  Envoyez votre premier message à {activeConversation.doctor}
                </p>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Zone de saisie */}
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
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1 mx-2 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Écrivez votre message..."
              />
              <button
                type="submit"
                disabled={!message.trim()}
                className="p-2 text-blue-600 hover:text-blue-800 disabled:text-gray-400"
              >
                <PaperAirplaneIcon className="h-5 w-5" />
              </button>
            </form>
          </div>
        </div>
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
