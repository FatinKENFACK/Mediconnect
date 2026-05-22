import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  VideoCameraIcon,
  MicrophoneIcon,
  VideoCameraSlashIcon,
  PhoneXMarkIcon,
  PhoneIcon,
  UserCircleIcon,
  PaperClipIcon,
  FaceSmileIcon,
  PaperAirplaneIcon,
  XMarkIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  ClockIcon,
  CheckCircleIcon,
  EllipsisVerticalIcon,
  ShieldCheckIcon,
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
  InformationCircleIcon,
  BellIcon
} from '@heroicons/react/24/outline';

// Alias pour la compatibilité
const MicrophoneSlashIcon = SpeakerXMarkIcon;
const SignalIcon = BellIcon;

// Données factices pour l'historique des appels
const callHistory = [
  {
    id: 1,
    doctor: 'Dr. Martin Dupont',
    date: '2023-11-15',
    time: '14:30',
    duration: '24:35',
    type: 'video',
    status: 'completed',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
  },
  {
    id: 2,
    doctor: 'Dr. Sophie Martin',
    date: '2023-11-10',
    time: '10:15',
    duration: '15:42',
    type: 'audio',
    status: 'completed',
    avatar: 'https://randomuser.me/api/portraits/women/1.jpg'
  },
  {
    id: 3,
    doctor: 'Dr. Jean Lefebvre',
    date: '2023-11-05',
    time: '16:45',
    duration: '32:18',
    type: 'video',
    status: 'missed',
    avatar: 'https://randomuser.me/api/portraits/men/2.jpg'
  },
  {
    id: 4,
    doctor: 'Dr. Marie Laurent',
    date: '2023-11-01',
    time: '09:20',
    duration: '18:12',
    type: 'video',
    status: 'completed',
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg'
  },
];

// Composant de bouton amélioré pour l'interface
const ControlButton = ({ 
  icon: Icon, 
  onClick, 
  isActive = false, 
  color = 'default', 
  size = 'medium',
  badge,
  ...props 
}) => {
  const sizeClasses = {
    small: 'p-2',
    medium: 'p-3',
    large: 'p-4'
  };
  
  const colorClasses = {
    default: 'bg-gray-800/70 hover:bg-gray-700/90 text-white',
    red: 'bg-red-600 hover:bg-red-700 text-white',
    green: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    blue: 'bg-blue-600 hover:bg-blue-700 text-white',
    muted: 'bg-white/10 hover:bg-white/20 text-white'
  };
  
  return (
    <button
      onClick={onClick}
      className={`
        ${sizeClasses[size]} 
        ${colorClasses[color]} 
        ${isActive ? 'ring-2 ring-offset-2 ring-offset-gray-900 ring-white/50' : ''}
        rounded-full backdrop-blur-sm transition-all duration-200
        flex items-center justify-center relative
        hover:scale-105 active:scale-95
      `}
      {...props}
    >
      <Icon className={`${size === 'large' ? 'h-6 w-6' : 'h-5 w-5'}`} />
      {badge && (
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center">
          {badge}
        </span>
      )}
    </button>
  );
};

// Composant de carte d'historique
const HistoryCard = ({ call, onSelect }) => {
  const statusColors = {
    completed: 'text-emerald-600 bg-emerald-50',
    missed: 'text-red-600 bg-red-50',
    scheduled: 'text-blue-600 bg-blue-50'
  };
  
  const typeIcons = {
    video: VideoCameraIcon,
    audio: MicrophoneIcon
  };
  
  const TypeIcon = typeIcons[call.type] || VideoCameraIcon;
  
  return (
    <div 
      onClick={() => onSelect(call)}
      className="bg-white rounded-xl p-4 hover:shadow-lg transition-all duration-200 cursor-pointer group border border-gray-100 hover:border-blue-200"
    >
      <div className="flex items-start space-x-3">
        <div className="relative">
          <img 
            src={call.avatar} 
            alt={call.doctor}
            className="w-12 h-12 rounded-full object-cover ring-2 ring-white ring-offset-2 ring-offset-gray-50"
          />
          <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full">
            <TypeIcon className="h-4 w-4 text-gray-600" />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-gray-900 truncate group-hover:text-blue-600">
              {call.doctor}
            </h4>
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusColors[call.status]}`}>
              {call.status === 'completed' ? 'Terminé' : 'Manqué'}
            </span>
          </div>
          
          <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
            <span className="flex items-center">
              <ClockIcon className="h-4 w-4 mr-1" />
              {call.time}
            </span>
            <span>{call.date}</span>
            <span className="font-medium">{call.duration}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Composant de message de chat
const ChatMessage = ({ message }) => {
  const isOwn = message.sender === 'Moi';
  
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-xs lg:max-w-md ${isOwn ? 'ml-8' : 'mr-8'}`}>
        <div className={`rounded-2xl px-4 py-3 ${isOwn ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-bl-none'}`}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold opacity-90">
              {message.sender}
            </span>
            <span className="text-xs opacity-70">
              {message.time}
            </span>
          </div>
          <p className="text-sm">{message.text}</p>
        </div>
        {isOwn && message.status === 'read' && (
          <div className="text-xs text-gray-400 mt-1 text-right flex items-center justify-end">
            <CheckCircleIcon className="h-3 w-3 mr-1" />
            Lu
          </div>
        )}
      </div>
    </div>
  );
};

const VideoConsultation = () => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      sender: 'Dr. Martin', 
      text: 'Bonjour, comment puis-je vous aider aujourd\'hui?', 
      time: '10:30',
      status: 'read'
    },
    { 
      id: 2, 
      sender: 'Moi', 
      text: 'Bonjour docteur, je ressens des maux de tête depuis quelques jours.', 
      time: '10:31',
      status: 'read'
    },
  ]);
  const [callStatus, setCallStatus] = useState('connecting');
  const [participants, setParticipants] = useState([
    { id: 1, name: 'Dr. Martin Dupont', role: 'Médecin', isVideoOn: true },
    { id: 2, name: 'Vous', role: 'Patient', isVideoOn: true },
  ]);
  const [time, setTime] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [connectionQuality, setConnectionQuality] = useState('good');
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [callType, setCallType] = useState('video'); // 'video' ou 'audio'
  
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const navigate = useNavigate();
  
  // Simuler la connexion à la consultation
  useEffect(() => {
    const timer = setTimeout(() => {
      setCallStatus('in-progress');
      startTimer();
    }, 2000);
    
    // Simuler la réception de messages
    const messageTimer = setInterval(() => {
      if (Math.random() > 0.7 && callStatus === 'in-progress') {
        const newMessage = {
          id: messages.length + 1,
          sender: 'Dr. Martin',
          text: 'Pouvez-vous me décrire plus en détail vos symptômes?',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'unread'
        };
        setMessages(prev => [...prev, newMessage]);
        if (!isChatOpen) {
          setUnreadMessages(prev => prev + 1);
        }
      }
    }, 10000);
    
    // Simuler la qualité de connexion
    const qualityTimer = setInterval(() => {
      const qualities = ['good', 'average', 'poor'];
      setConnectionQuality(qualities[Math.floor(Math.random() * 2)]);
    }, 15000);
    
    return () => {
      clearTimeout(timer);
      clearInterval(messageTimer);
      clearInterval(qualityTimer);
    };
  }, [callStatus, messages.length, isChatOpen]);
  
  const startTimer = () => {
    const timer = setInterval(() => {
      setTime(prevTime => prevTime + 1);
    }, 1000);
    
    return () => clearInterval(timer);
  };
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const handleEndCall = () => {
    setCallStatus('ended');
    setTimeout(() => {
      navigate('/patient/dashboard');
    }, 2000);
  };
  
  const toggleMute = () => setIsMuted(!isMuted);
  const toggleVideo = () => setIsVideoOff(!isVideoOff);
  
  const toggleChat = useCallback(() => {
    setIsChatOpen(!isChatOpen);
    if (!isChatOpen) {
      setUnreadMessages(0);
    }
  }, [isChatOpen]);
  
  const toggleHistory = () => setIsHistoryOpen(!isHistoryOpen);
  const toggleFullscreen = () => setIsFullscreen(!isFullscreen);
  
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim() === '') return;
    
    const newMessage = {
      id: messages.length + 1,
      sender: 'Moi',
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    };
    
    setMessages([...messages, newMessage]);
    setMessage('');
    
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };
  
  const renderConnectionStatus = () => {
    const statusColors = {
      good: 'text-emerald-400',
      average: 'text-amber-400',
      poor: 'text-red-400'
    };
    
    return (
      <div className="flex items-center space-x-2 text-sm">
        <div className="flex items-center">
          <SignalIcon className={`h-4 w-4 mr-1 ${statusColors[connectionQuality]}`} />
          <span className="text-white/80">Connexion {connectionQuality === 'good' ? 'bonne' : 'moyenne'}</span>
        </div>
        <ShieldCheckIcon className="h-4 w-4 text-emerald-400" />
        <span className="text-white/80">Sécurisée</span>
      </div>
    );
  };
  
  const renderCallContent = () => {
    if (callStatus === 'connecting') {
      return (
        <div className="flex flex-col items-center justify-center h-full space-y-8">
          <div className="relative">
            <div className="w-40 h-40 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center animate-pulse">
              <UserCircleIcon className="h-24 w-24 text-blue-400" />
            </div>
            <div className="absolute -top-2 -right-2 w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center animate-bounce">
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
          </div>
          <div className="text-center space-y-3">
            <h3 className="text-xl font-semibold text-gray-900">Appel en cours avec</h3>
            <p className="text-3xl font-bold text-gray-900">Dr. Martin Dupont</p>
            <div className="flex items-center justify-center space-x-2 text-gray-500">
              <div className="flex space-x-1">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                ))}
              </div>
              <p>Connexion en cours...</p>
            </div>
          </div>
          <div className="flex space-x-4">
            <ControlButton
              icon={PhoneXMarkIcon}
              onClick={handleEndCall}
              color="red"
              size="medium"
              title="Annuler l'appel"
            >
              Annuler
            </ControlButton>
          </div>
        </div>
      );
    } else if (callStatus === 'in-progress') {
      return (
        <div className="flex h-full bg-gray-900">
          {/* Panneau principal de la vidéo */}
          <div className={`flex-1 flex flex-col ${isHistoryOpen ? 'w-2/3' : 'w-full'}`}>
            {/* En-tête de l'appel */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-4 flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                    <UserGroupIcon className="h-6 w-6 text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-lg">Consultation avec Dr. Martin Dupont</p>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="flex items-center text-white/70">
                      <ClockIcon className="h-4 w-4 mr-1" />
                      {formatTime(time)}
                    </span>
                    {renderConnectionStatus()}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                {/* Choix du type d'appel */}
                <div className="flex bg-gray-800 rounded-lg p-1">
                  <button
                    onClick={() => setCallType('video')}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      callType === 'video' 
                        ? 'bg-blue-600 text-white' 
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    Vidéo
                  </button>
                  <button
                    onClick={() => setCallType('audio')}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      callType === 'audio' 
                        ? 'bg-blue-600 text-white' 
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    Audio
                  </button>
                </div>
                
                <ControlButton
                  icon={isChatOpen ? XMarkIcon : ChatBubbleLeftRightIcon}
                  onClick={toggleChat}
                  color="muted"
                  badge={unreadMessages > 0 ? unreadMessages : null}
                  title={isChatOpen ? 'Fermer le chat' : 'Ouvrir le chat'}
                />
                
                <ControlButton
                  icon={isRecording ? PhoneXMarkIcon : BellIcon}
                  onClick={() => setIsRecording(!isRecording)}
                  color={isRecording ? 'red' : 'muted'}
                  title={isRecording ? "Arrêter l'enregistrement" : "Démarrer l'enregistrement"}
                />
                
                <ControlButton
                  icon={isFullscreen ? ArrowsPointingInIcon : ArrowsPointingOutIcon}
                  onClick={toggleFullscreen}
                  color="muted"
                  title={isFullscreen ? 'Quitter le mode plein écran' : 'Mode plein écran'}
                />
                
                <ControlButton
                  icon={EllipsisVerticalIcon}
                  onClick={toggleHistory}
                  color="muted"
                  title="Historique des appels"
                />
              </div>
            </div>
            
            {/* Zone de vidéo principale */}
            <div className="flex-1 relative overflow-hidden bg-gradient-to-br from-gray-900 to-black">
              {/* Vidéo du médecin */}
              <div className="absolute inset-0 flex items-center justify-center">
                {participants[0].isVideoOn && callType === 'video' ? (
                  <div className="relative w-full h-full">
                    <video
                      ref={remoteVideoRef}
                      autoPlay
                      playsInline
                      className="h-full w-full object-cover"
                    />
                    {/* Overlay d'informations */}
                    <div className="absolute bottom-6 left-6 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full">
                      <p className="text-sm font-medium">Dr. Martin Dupont</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full w-full">
                    <div className="relative">
                      <UserCircleIcon className="h-48 w-48 text-gray-700" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        {callType === 'audio' ? (
                          <div className="animate-pulse">
                            <SpeakerWaveIcon className="h-24 w-24 text-blue-400" />
                          </div>
                        ) : (
                          <VideoCameraSlashIcon className="h-24 w-24 text-gray-500" />
                        )}
                      </div>
                    </div>
                    <p className="mt-6 text-2xl font-semibold text-gray-300">
                      {participants[0].name}
                    </p>
                    <p className="text-gray-500">
                      {callType === 'audio' ? 'Appel audio' : 'Vidéo désactivée'}
                    </p>
                  </div>
                )}
              </div>
              
              {/* Mini-vidéo locale */}
              <div className="absolute bottom-6 right-6 w-56 h-40 bg-black rounded-xl overflow-hidden shadow-2xl border-2 border-white/20">
                {!isVideoOff && callType === 'video' ? (
                  <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-gray-800 to-gray-900 flex flex-col items-center justify-center">
                    <UserCircleIcon className="h-12 w-12 text-gray-600" />
                    <p className="mt-2 text-sm text-gray-400">Vous</p>
                  </div>
                )}
                {/* Badge de statut local */}
                <div className="absolute top-2 left-2 flex space-x-1">
                  {isMuted && (
                    <div className="bg-red-600 text-white text-xs px-2 py-1 rounded-full">
                      Micro désactivé
                    </div>
                  )}
                  {isVideoOff && callType === 'video' && (
                    <div className="bg-red-600 text-white text-xs px-2 py-1 rounded-full">
                      Caméra désactivée
                    </div>
                  )}
                </div>
              </div>
              
              {/* Indicateur d'enregistrement */}
              {isRecording && (
                <div className="absolute top-6 left-6">
                  <div className="bg-gradient-to-r from-red-600 to-red-700 text-white text-sm font-medium px-4 py-2 rounded-full flex items-center space-x-2 animate-pulse">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                    <span>Enregistrement en cours</span>
                  </div>
                </div>
              )}
              
              {/* Contrôles de l'appel */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-6">
                <div className="flex justify-center items-center space-x-6">
                  <ControlButton
                    icon={isMuted ? MicrophoneSlashIcon : MicrophoneIcon}
                    onClick={toggleMute}
                    isActive={isMuted}
                    color={isMuted ? 'red' : 'default'}
                    size="large"
                    title={isMuted ? 'Activer le micro' : 'Désactiver le micro'}
                  />
                  
                  <ControlButton
                    icon={isVideoOff ? VideoCameraSlashIcon : VideoCameraIcon}
                    onClick={toggleVideo}
                    isActive={isVideoOff}
                    color={isVideoOff ? 'red' : 'default'}
                    size="large"
                    title={isVideoOff ? 'Activer la caméra' : 'Désactiver la caméra'}
                  />
                  
                  <ControlButton
                    icon={PhoneXMarkIcon}
                    onClick={handleEndCall}
                    color="red"
                    size="large"
                    className="scale-125"
                    title="Terminer l'appel"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Panneau de chat latéral */}
          {isChatOpen && (
            <div className="w-96 bg-white border-l border-gray-200 flex flex-col shadow-xl">
              <div className="p-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Chat de consultation</h3>
                    <p className="text-sm text-gray-500">Messages sécurisés et chiffrés</p>
                  </div>
                  <button
                    onClick={toggleChat}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    title="Fermer le chat"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              <div 
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto p-5 space-y-4 bg-gradient-to-b from-white to-gray-50"
              >
                {messages.map((msg) => (
                  <ChatMessage key={msg.id} message={msg} />
                ))}
                <div ref={messagesEndRef} />
              </div>
              
              <div className="p-5 border-t border-gray-200 bg-white">
                <form onSubmit={handleSendMessage} className="space-y-3">
                  <div className="relative">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tapez votre message..."
                      className="block w-full rounded-xl border-gray-300 bg-gray-50 py-3 px-4 pr-24 focus:border-blue-500 focus:ring-blue-500 text-sm transition-all duration-200 focus:bg-white"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 space-x-2">
                      <button
                        type="button"
                        className="text-gray-400 hover:text-blue-500 transition-colors"
                        title="Insérer une émotion"
                      >
                        <FaceSmileIcon className="h-5 w-5" />
                      </button>
                      <button
                        type="button"
                        className="text-gray-400 hover:text-blue-500 transition-colors"
                        title="Joindre un fichier"
                      >
                        <PaperClipIcon className="h-5 w-5" />
                      </button>
                      <button
                        type="submit"
                        className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
                        title="Envoyer le message"
                      >
                        <PaperAirplaneIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 text-center">
                    Messages sécurisés • Consultation confidentielle
                  </p>
                </form>
              </div>
            </div>
          )}
          
          {/* Panneau d'historique des appels */}
          {isHistoryOpen && (
            <div className="w-1/3 bg-gray-50 border-l border-gray-200 flex flex-col">
              <div className="p-5 border-b border-gray-200 bg-white">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Historique des appels</h3>
                    <p className="text-sm text-gray-500">{callHistory.length} consultations</p>
                  </div>
                  <button
                    onClick={toggleHistory}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    title="Fermer l'historique"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-5 space-y-3">
                {callHistory.map((call) => (
                  <HistoryCard 
                    key={call.id} 
                    call={call} 
                    onSelect={(selectedCall) => {
                      console.log('Appel sélectionné:', selectedCall);
                    }}
                  />
                ))}
              </div>
              
              <div className="p-5 border-t border-gray-200 bg-white">
                <button className="w-full text-center text-blue-600 hover:text-blue-700 font-medium text-sm py-2">
                  Voir tout l'historique →
                </button>
              </div>
            </div>
          )}
        </div>
      );
    } else if (callStatus === 'ended') {
      return (
        <div className="flex flex-col items-center justify-center h-full space-y-8 p-8 text-center">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-emerald-100 to-green-100 flex items-center justify-center">
              <CheckCircleIcon className="h-20 w-20 text-emerald-500" />
            </div>
            <div className="absolute -top-2 -right-2 animate-bounce">
              <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
                <ClockIcon className="h-5 w-5 text-white" />
              </div>
            </div>
          </div>
          
          <div className="space-y-3 max-w-md">
            <h2 className="text-3xl font-bold text-gray-900">Consultation terminée</h2>
            <p className="text-gray-600">
              Votre consultation avec le Dr. Martin Dupont a duré <span className="font-semibold text-gray-900">{formatTime(time)}</span>.
            </p>
            <div className="bg-blue-50 rounded-xl p-4 mt-4">
              <div className="flex items-center space-x-2 text-blue-700">
                <InformationCircleIcon className="h-5 w-5" />
                <p className="text-sm font-medium">
                  Un compte-rendu détaillé sera disponible dans votre dossier médical sous 24h.
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-4 pt-6">
            <button
              onClick={() => navigate('/patient/dashboard')}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Retour au tableau de bord
            </button>
            <button
              onClick={() => navigate('/patient/medical-records')}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all duration-200"
            >
              Voir le dossier médical
            </button>
          </div>
        </div>
      );
    }
  };

  return (
    <div className={`h-full ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {renderCallContent()}
    </div>
  );
};

export default VideoConsultation;