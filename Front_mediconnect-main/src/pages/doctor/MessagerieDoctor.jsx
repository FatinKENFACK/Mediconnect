import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  EnvelopeIcon,
  PaperAirplaneIcon,
  PaperClipIcon,
  UserCircleIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  ClockIcon,
  XMarkIcon,
  PencilIcon,
  TrashIcon,
  StarIcon as StarIconOutline,
  ArchiveBoxIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

// Données de démonstration pour les conversations
const conversations = [
  {
    id: 1,
    patientId: 1,
    patientName: 'Jean Martin',
    lastMessage: 'Bonjour Docteur, je voulais vous remercier pour la consultation...',
    time: '10:30',
    date: '2023-06-15',
    unread: true,
    starred: true,
    avatar: null
  },
  {
    id: 2,
    patientId: 2,
    patientName: 'Marie Dubois',
    lastMessage: 'Pourriez-vous me renouveler mon ordonnance s\'il vous plaît ?',
    time: '09:15',
    date: '2023-06-15',
    unread: false,
    starred: false,
    avatar: null
  },
  {
    id: 3,
    patientId: 3,
    patientName: 'Pierre Durand',
    lastMessage: 'Je ressens toujours ces douleurs au niveau...',
    time: 'Hier',
    date: '2023-06-14',
    unread: true,
    starred: false,
    avatar: null
  },
  {
    id: 4,
    patientId: 4,
    patientName: 'Sophie Lambert',
    lastMessage: 'Les résultats de mes analyses sont-ils disponibles ?',
    time: 'Hier',
    date: '2023-06-14',
    unread: false,
    starred: true,
    avatar: null
  },
  {
    id: 5,
    patientId: 5,
    patientName: 'Thomas Leroy',
    lastMessage: 'Je vous recontacte pour le rendez-vous de la semaine prochaine...',
    time: '12/06/2023',
    date: '2023-06-12',
    unread: false,
    starred: false,
    avatar: null
  }
];

// Données de démonstration pour les messages d'une conversation
const messages = [
  {
    id: 1,
    sender: 'patient',
    content: 'Bonjour Docteur, je voulais vous remercier pour la consultation de ce matin.',
    time: '10:30',
    read: true
  },
  {
    id: 2,
    sender: 'patient',
    content: 'Les médicaments que vous m\'avez prescrits semblent déjà faire effet.',
    time: '10:31',
    read: true
  },
  {
    id: 3,
    sender: 'me',
    content: 'Bonjour Jean, je suis ravi d\'entendre que le traitement vous convient bien. N\'hésitez pas à me contacter si vous avez des questions.',
    time: '11:15',
    read: true
  },
  {
    id: 4,
    sender: 'patient',
    content: 'Merci beaucoup Docteur. Je vous tiendrai au courant de mon évolution.',
    time: '11:45',
    read: true
  },
  {
    id: 5,
    sender: 'me',
    content: 'Parfait. N\'oubliez pas votre prochain rendez-vous le 25 juin à 14h30.',
    time: '11:46',
    read: true
  }
];

const MessagerieDoctor = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [activeTab, setActiveTab] = useState('tous');
  
  // Filtrer les conversations en fonction de la recherche et de l'onglet actif
  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         conv.lastMessage.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTab = activeTab === 'tous' || 
                      (activeTab === 'non-lus' && conv.unread) ||
                      (activeTab === 'favoris' && conv.starred);
    
    return matchesSearch && matchesTab;
  });

  // Formater la date pour l'affichage
  const formatDate = (dateString) => {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    if (dateString === today) return 'Aujourd\'hui';
    if (dateString === yesterdayStr) return 'Hier';
    
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short'
    });
  };

  // Gérer l'envoi d'un nouveau message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    // Ici, vous enverriez normalement le message au serveur
    console.log('Message envoyé :', newMessage);
    
    // Réinitialiser le champ de message
    setNewMessage('');
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-white rounded-lg shadow overflow-hidden">
      {/* Liste des conversations */}
      <div className="w-full md:w-1/3 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Messages</h2>
          <div className="mt-3 relative rounded-md shadow-sm">
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
            <button
              onClick={() => setActiveTab('tous')}
              className={`px-3 py-2 text-sm font-medium ${
                activeTab === 'tous' 
                  ? 'border-b-2 border-blue-500 text-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Tous
            </button>
            <button
              onClick={() => setActiveTab('non-lus')}
              className={`px-3 py-2 text-sm font-medium ${
                activeTab === 'non-lus' 
                  ? 'border-b-2 border-blue-500 text-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Non lus
            </button>
            <button
              onClick={() => setActiveTab('favoris')}
              className={`px-3 py-2 text-sm font-medium ${
                activeTab === 'favoris' 
                  ? 'border-b-2 border-blue-500 text-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Favoris
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {filteredConversations.map((conversation) => (
                <li 
                  key={conversation.id}
                  className={`hover:bg-gray-50 cursor-pointer ${
                    selectedConversation?.id === conversation.id ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => setSelectedConversation(conversation)}
                >
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {conversation.avatar ? (
                          <img 
                            className="h-10 w-10 rounded-full" 
                            src={conversation.avatar} 
                            alt={conversation.patientName} 
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <UserCircleIcon className="h-8 w-8 text-blue-600" />
                          </div>
                        )}
                        <div className="ml-3">
                          <div className="flex items-center">
                            <p className="text-sm font-medium text-gray-900">
                              {conversation.patientName}
                            </p>
                            {conversation.starred && (
                              <StarIconSolid className="ml-1 h-4 w-4 text-yellow-400" />
                            )}
                          </div>
                          <p className={`text-sm ${
                            conversation.unread ? 'font-semibold text-gray-900' : 'text-gray-500'
                          } truncate max-w-xs`}>
                            {conversation.lastMessage}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-xs text-gray-500">
                          {conversation.time}
                        </span>
                        {conversation.unread && (
                          <span className="mt-1 inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-600 text-white text-xs">
                            {1}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-12">
              <EnvelopeIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune conversation</h3>
              <p className="mt-1 text-sm text-gray-500">
                Aucune conversation ne correspond à votre recherche.
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Zone de messagerie */}
      {selectedConversation ? (
        <div className="hidden md:flex md:flex-col flex-1">
          {/* En-tête de la conversation */}
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center">
              {selectedConversation.avatar ? (
                <img 
                  className="h-10 w-10 rounded-full" 
                  src={selectedConversation.avatar} 
                  alt={selectedConversation.patientName} 
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <UserCircleIcon className="h-8 w-8 text-blue-600" />
                </div>
              )}
              <div className="ml-3">
                <div className="flex items-center">
                  <h3 className="text-base font-medium text-gray-900">
                    {selectedConversation.patientName}
                  </h3>
                  <button
                    type="button"
                    className="ml-2 text-gray-400 hover:text-yellow-500"
                    onClick={() => {
                      // Ici, vous mettriez à jour l'état de favori dans votre état ou votre store
                      console.log('Toggle favorite', selectedConversation.id);
                    }}
                  >
                    {selectedConversation.starred ? (
                      <StarIconSolid className="h-5 w-5 text-yellow-400" />
                    ) : (
                      <StarIconOutline className="h-5 w-5" />
                    )}
                  </button>
                </div>
                <p className="text-sm text-gray-500">
                  En ligne
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                type="button"
                className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <span className="sr-only">Archiver</span>
                <ArchiveBoxIcon className="h-5 w-5" />
              </button>
              <button
                type="button"
                className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <span className="sr-only">Supprimer</span>
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
            <div className="space-y-4">
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`flex ${
                    message.sender === 'me' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div 
                    className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl rounded-lg px-4 py-2 ${
                      message.sender === 'me' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-white text-gray-800 border border-gray-200'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <div className={`mt-1 text-xs flex items-center ${
                      message.sender === 'me' ? 'text-blue-100 justify-end' : 'text-gray-500'
                    }`}>
                      {message.time}
                      {message.sender === 'me' && (
                        <span className="ml-1">
                          {message.read ? (
                            <CheckCircleIcon className="h-3.5 w-3.5 text-blue-300" />
                          ) : (
                            <ClockIcon className="h-3.5 w-3.5 text-blue-300" />
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Zone de saisie */}
          <div className="p-4 border-t border-gray-200">
            <form onSubmit={handleSendMessage} className="flex items-center">
              <div className="flex-1">
                <label htmlFor="message" className="sr-only">
                  Votre message
                </label>
                <div className="relative rounded-md shadow-sm">
                  <input
                    type="text"
                    name="message"
                    id="message"
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pr-12 sm:text-sm border-gray-300 rounded-md"
                    placeholder="Écrivez votre message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                    <button
                      type="button"
                      className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <PaperClipIcon className="h-5 w-5" />
                      <span className="sr-only">Joindre un fichier</span>
                    </button>
                  </div>
                </div>
              </div>
              <div className="ml-3">
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <PaperAirplaneIcon className="-ml-1 mr-2 h-5 w-5" />
                  Envoyer
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="hidden md:flex flex-1 items-center justify-center bg-gray-50">
          <div className="text-center">
            <EnvelopeIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune conversation sélectionnée</h3>
            <p className="mt-1 text-sm text-gray-500">
              Sélectionnez une conversation ou créez-en une nouvelle.
            </p>
            <div className="mt-6">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <PencilIcon className="-ml-1 mr-2 h-5 w-5" />
                Nouveau message
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagerieDoctor;
