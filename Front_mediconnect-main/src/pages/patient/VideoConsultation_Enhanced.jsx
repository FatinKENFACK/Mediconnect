import React, { useState, useEffect, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  VideoCameraIcon,
  MicrophoneIcon,
  MicrophoneIcon as MicrophoneOffIcon,
  VideoCameraIcon as VideoCameraOffIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon,
  ShareIcon,
  UserGroupIcon,
  ClockIcon,
  MapPinIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
  SpeakerWaveIcon,
  SpeakerWaveIcon as SpeakerOffIcon,
  Cog6ToothIcon,
  DocumentTextIcon,
  HandRaisedIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

export default function VideoConsultation() {
  const location = useLocation();
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isSpeakerOff, setIsSpeakerOff] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [consultationTime, setConsultationTime] = useState(0);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [screenSharing, setScreenSharing] = useState(false);
  const [handRaised, setHandRaised] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('waiting');
  const videoRef = useRef(null);
  const chatRef = useRef(null);

  // Mock consultation data avec contexte camerounais
  const consultation = location.state?.consultation || {
    id: 'CONS-2024-001',
    doctor: {
      name: 'Dr. Martin Tchinda',
      specialty: 'Médecine générale',
      avatar: '/api/placeholder/100/100',
      phone: '+237 699 123 456',
      hospital: 'Hôpital Central Yaoundé',
      experience: '12 ans',
      languages: ['Français', 'Anglais']
    },
    patient: {
      name: 'Thomas Fotsing',
      age: 32,
      phone: '+237 677 888 999',
      email: 'thomas.fotsing@email.com'
    },
    date: '15 Décembre 2023',
    time: '14:30',
    duration: 30,
    type: 'En ligne',
    price: '5000 XAF',
    status: 'confirmed'
  };

  // Mock participants
  const participants = [
    {
      id: 1,
      name: consultation.doctor.name,
      role: 'doctor',
      isMuted: false,
      isVideoOff: false,
      speaking: false
    },
    {
      id: 2,
      name: consultation.patient.name,
      role: 'patient',
      isMuted: isMuted,
      isVideoOff: isVideoOff,
      speaking: false
    }
  ];

  useEffect(() => {
    let interval;
    if (isConnected) {
      interval = setInterval(() => {
        setConsultationTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isConnected]);

  useEffect(() => {
    // Simulate connection process
    setTimeout(() => {
      setConnectionStatus('connecting');
    }, 1000);
    
    setTimeout(() => {
      setConnectionStatus('connected');
      setIsConnected(true);
    }, 3000);
  }, []);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([
        ...messages,
        {
          id: Date.now(),
          sender: consultation.patient.name,
          content: newMessage,
          timestamp: new Date(),
          isOwn: true
        }
      ]);
      setNewMessage('');
      
      // Simulate doctor response
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          {
            id: Date.now(),
            sender: consultation.doctor.name,
            content: "Message reçu. Je vais répondre dans un instant.",
            timestamp: new Date(),
            isOwn: false
          }
        ]);
      }, 2000);
    }
  };

  const handleEndCall = () => {
    setIsConnected(false);
    // In a real app, this would handle the call termination logic
    window.location.href = '/patient/rendez-vous';
  };

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'waiting': return 'text-gray-500';
      case 'connecting': return 'text-yellow-500';
      case 'connected': return 'text-green-500';
      case 'error': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getConnectionStatusText = () => {
    switch (connectionStatus) {
      case 'waiting': return 'En attente de connexion...';
      case 'connecting': return 'Connexion en cours...';
      case 'connected': return 'Connecté';
      case 'error': return 'Erreur de connexion';
      default: return 'Inconnu';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              to="/patient/rendez-vous"
              className="text-gray-300 hover:text-white transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-white font-medium">Consultation avec {consultation.doctor.name}</h1>
              <div className="flex items-center space-x-3 text-sm text-gray-400">
                <span>{consultation.doctor.specialty}</span>
                <span>#{consultation.id}</span>
                <span className={getConnectionStatusColor()}>
                  {getConnectionStatusText()}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-300">
            <ClockIcon className="h-4 w-4" />
            <span>{formatTime(consultationTime)}</span>
            {isConnected && (
              <span className="ml-2 px-2 py-1 bg-green-600 text-white text-xs rounded-full">
                En direct
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Main Video Area */}
        <div className="flex-1 relative bg-black">
          {connectionStatus === 'waiting' && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                <p className="text-white">Préparation de la consultation...</p>
                <p className="text-gray-400 text-sm mt-2">Veuillez patienter</p>
              </div>
            </div>
          )}

          {connectionStatus === 'connecting' && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <VideoCameraIcon className="h-16 w-16 text-yellow-500 mx-auto mb-4 animate-pulse" />
                <p className="text-white">Connexion avec le Dr. {consultation.doctor.name}...</p>
                <p className="text-gray-400 text-sm mt-2">Établissement de la connexion sécurisée</p>
              </div>
            </div>
          )}

          {connectionStatus === 'connected' && (
            <>
              {/* Main Video */}
              <div className="relative h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-teal-900 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-32 h-32 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <UserGroupIcon className="h-16 w-16 text-gray-400" />
                    </div>
                    <p className="text-white text-lg">Consultation en cours</p>
                    <p className="text-gray-400 text-sm mt-2">Qualité HD</p>
                  </div>
                </div>

                {/* Self Video */}
                <div className="absolute bottom-4 right-4 w-48 h-36 bg-gray-800 rounded-lg border-2 border-gray-600 flex items-center justify-center">
                  {isVideoOff ? (
                    <VideoCameraOffIcon className="h-8 w-8 text-gray-500" />
                  ) : (
                    <div className="w-full h-full bg-gray-700 rounded-lg flex items-center justify-center">
                      <UserGroupIcon className="h-12 w-12 text-gray-500" />
                    </div>
                  )}
                </div>

                {/* Hand Raised Indicator */}
                {handRaised && (
                  <div className="absolute top-4 left-4 bg-yellow-600 text-white px-3 py-2 rounded-lg flex items-center">
                    <HandRaisedIcon className="h-4 w-4 mr-2" />
                    Main levée
                  </div>
                )}

                {/* Screen Sharing Indicator */}
                {screenSharing && (
                  <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center">
                    <ShareIcon className="h-4 w-4 mr-2" />
                    Partage d'écran
                  </div>
                )}
              </div>
            </>
          )}

          {/* Control Bar */}
          <div className="absolute bottom-0 left-0 right-0 bg-gray-800 bg-opacity-90 backdrop-blur-sm">
            <div className="flex items-center justify-center space-x-4 p-4">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`p-3 rounded-full transition-colors ${
                  isMuted ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-700 hover:bg-gray-600'
                }`}
                title={isMuted ? 'Activer le micro' : 'Désactiver le micro'}
              >
                {isMuted ? (
                  <MicrophoneOffIcon className="h-6 w-6 text-white" />
                ) : (
                  <MicrophoneIcon className="h-6 w-6 text-white" />
                )}
              </button>

              <button
                onClick={() => setIsVideoOff(!isVideoOff)}
                className={`p-3 rounded-full transition-colors ${
                  isVideoOff ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-700 hover:bg-gray-600'
                }`}
                title={isVideoOff ? 'Activer la vidéo' : 'Désactiver la vidéo'}
              >
                {isVideoOff ? (
                  <VideoCameraOffIcon className="h-6 w-6 text-white" />
                ) : (
                  <VideoCameraIcon className="h-6 w-6 text-white" />
                )}
              </button>

              <button
                onClick={() => setScreenSharing(!screenSharing)}
                className={`p-3 rounded-full transition-colors ${
                  screenSharing ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-700 hover:bg-gray-600'
                }`}
                title="Partager l'écran"
              >
                <ShareIcon className="h-6 w-6 text-white" />
              </button>

              <button
                onClick={() => setHandRaised(!handRaised)}
                className={`p-3 rounded-full transition-colors ${
                  handRaised ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-gray-700 hover:bg-gray-600'
                }`}
                title="Lever la main"
              >
                <HandRaisedIcon className="h-6 w-6 text-white" />
              </button>

              <button
                onClick={() => setShowParticipants(!showParticipants)}
                className={`p-3 rounded-full transition-colors ${
                  showParticipants ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-700 hover:bg-gray-600'
                }`}
                title="Participants"
              >
                <UserGroupIcon className="h-6 w-6 text-white" />
              </button>

              <button
                onClick={() => setShowChat(!showChat)}
                className={`p-3 rounded-full transition-colors relative ${
                  showChat ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-700 hover:bg-gray-600'
                }`}
                title="Chat"
              >
                <ChatBubbleLeftRightIcon className="h-6 w-6 text-white" />
                {messages.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {messages.length}
                  </span>
                )}
              </button>

              <button
                onClick={handleEndCall}
                className="p-3 bg-red-600 hover:bg-red-700 rounded-full transition-colors"
                title="Terminer l'appel"
              >
                <PhoneIcon className="h-6 w-6 text-white transform rotate-135" />
              </button>
            </div>
          </div>
        </div>

        {/* Side Panel */}
        <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
          {/* Tabs */}
          <div className="flex border-b border-gray-700">
            <button
              onClick={() => setShowChat(true)}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                showChat ? 'text-white bg-gray-700' : 'text-gray-400 hover:text-white'
              }`}
            >
              Chat
            </button>
            <button
              onClick={() => setShowChat(false)}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                !showChat ? 'text-white bg-gray-700' : 'text-gray-400 hover:text-white'
              }`}
            >
              Informations
            </button>
          </div>

          {/* Chat Panel */}
          {showChat && (
            <div className="flex-1 flex flex-col">
              <div className="flex-1 overflow-y-auto p-4 space-y-3" ref={chatRef}>
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <ChatBubbleLeftRightIcon className="h-12 w-12 mx-auto mb-3" />
                    <p>Aucun message</p>
                    <p className="text-sm">Soyez le premier à écrire</p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs px-3 py-2 rounded-lg ${
                          message.isOwn
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-700 text-gray-100'
                        }`}
                      >
                        {!message.isOwn && (
                          <p className="text-xs font-medium mb-1 opacity-75">{message.sender}</p>
                        )}
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs mt-1 opacity-75">
                          {message.timestamp.toLocaleTimeString('fr-FR', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="border-t border-gray-700 p-4">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Tapez votre message..."
                    className="flex-1 px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Envoyer
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Info Panel */}
          {!showChat && (
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {/* Doctor Info */}
              <div>
                <h3 className="text-white font-medium mb-3">Médecin</h3>
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center">
                      <UserGroupIcon className="h-8 w-8 text-gray-400" />
                    </div>
                    <div>
                      <div className="text-white font-medium">{consultation.doctor.name}</div>
                      <div className="text-gray-400 text-sm">{consultation.doctor.specialty}</div>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-gray-300">
                    <div className="flex items-center">
                      <MapPinIcon className="h-4 w-4 mr-2" />
                      {consultation.doctor.hospital}
                    </div>
                    <div className="flex items-center">
                      <PhoneIcon className="h-4 w-4 mr-2" />
                      {consultation.doctor.phone}
                    </div>
                    <div className="flex items-center">
                      <ClockIcon className="h-4 w-4 mr-2" />
                      {consultation.doctor.experience} d'expérience
                    </div>
                  </div>
                </div>
              </div>

              {/* Consultation Details */}
              <div>
                <h3 className="text-white font-medium mb-3">Détails de la consultation</h3>
                <div className="bg-gray-700 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Date</span>
                    <span className="text-white">{consultation.date}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Heure</span>
                    <span className="text-white">{consultation.time}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Durée</span>
                    <span className="text-white">{consultation.duration} minutes</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Tarif</span>
                    <span className="text-white">{consultation.price}</span>
                  </div>
                </div>
              </div>

              {/* Tips */}
              <div>
                <h3 className="text-white font-medium mb-3">Conseils pour une bonne consultation</h3>
                <div className="space-y-2">
                  <div className="flex items-start space-x-2 text-sm text-gray-300">
                    <CheckCircleIcon className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Assurez-vous d'avoir une connexion internet stable</span>
                  </div>
                  <div className="flex items-start space-x-2 text-sm text-gray-300">
                    <CheckCircleIcon className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Utilisez un navigateur à jour (Chrome, Firefox)</span>
                  </div>
                  <div className="flex items-start space-x-2 text-sm text-gray-300">
                    <CheckCircleIcon className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Testez votre caméra et microphone avant</span>
                  </div>
                  <div className="flex items-start space-x-2 text-sm text-gray-300">
                    <CheckCircleIcon className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Préparez vos documents médicaux à portée de main</span>
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="bg-red-900 bg-opacity-50 border border-red-700 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
                  <h4 className="text-red-400 font-medium">En cas de problème technique</h4>
                </div>
                <div className="text-sm text-red-300">
                  <p>Contactez notre support technique:</p>
                  <p>+237 242 000 123</p>
                  <p>support@mediconnet.cm</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
