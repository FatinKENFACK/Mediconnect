import React, { useState, useEffect } from 'react';
import {
  VideoCameraIcon,
  PhoneIcon,
  MicrophoneIcon,
  SpeakerXMarkIcon,
  SpeakerWaveIcon,
  ComputerDesktopIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  UserCircleIcon,
  CalendarIcon,
  PlayIcon,
  PauseIcon
} from '@heroicons/react/24/outline';
import { VideoCameraIcon as VideoCameraSolid } from '@heroicons/react/24/solid';

const HospitalVideoConsultation = () => {
  const [consultations, setConsultations] = useState([]);
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isSpeakerEnabled, setIsSpeakerEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [consultationStatus, setConsultationStatus] = useState('waiting'); // waiting, active, ended
  const [elapsedTime, setElapsedTime] = useState(0);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    const mockConsultations = [
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
        scheduledTime: '2024-01-15 14:30',
        duration: 30,
        status: 'scheduled',
        type: 'video',
        notes: 'Suivi post-opératoire',
        emergency: false,
        link: 'https://video.mediconnet.com/consultation/123456',
        recordingEnabled: true
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
        scheduledTime: '2024-01-15 15:00',
        duration: 45,
        status: 'in_progress',
        type: 'video',
        notes: 'Consultation pédiatrique de routine',
        emergency: false,
        link: 'https://video.mediconnet.com/consultation/123457',
        recordingEnabled: true
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
        scheduledTime: '2024-01-15 16:00',
        duration: 20,
        status: 'completed',
        type: 'video',
        notes: 'Analyse des résultats radiologiques',
        emergency: false,
        link: 'https://video.mediconnet.com/consultation/123458',
        recordingEnabled: false,
        actualDuration: 18,
        recordingUrl: 'https://recordings.mediconnet.com/consultation/123458'
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
        scheduledTime: '2024-01-15 17:00',
        duration: 30,
        status: 'cancelled',
        type: 'video',
        notes: 'Annulé par le patient',
        emergency: false,
        link: 'https://video.mediconnet.com/consultation/123459',
        recordingEnabled: true
      }
    ];
    setConsultations(mockConsultations);
  }, []);

  useEffect(() => {
    let interval;
    if (consultationStatus === 'active') {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [consultationStatus]);

  const filteredConsultations = consultations.filter(consultation => {
    return filterStatus === 'all' || consultation.status === filterStatus;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      scheduled: { color: 'bg-blue-100 text-blue-800', label: 'Programmé' },
      in_progress: { color: 'bg-green-100 text-green-800', label: 'En cours' },
      completed: { color: 'bg-gray-100 text-gray-800', label: 'Terminé' },
      cancelled: { color: 'bg-red-100 text-red-800', label: 'Annulé' }
    };
    
    const config = statusConfig[status] || statusConfig.scheduled;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startConsultation = (consultation) => {
    setSelectedConsultation(consultation);
    setShowVideoModal(true);
    setConsultationStatus('active');
    setElapsedTime(0);
  };

  const endConsultation = () => {
    setConsultationStatus('ended');
    setTimeout(() => {
      setShowVideoModal(false);
      setSelectedConsultation(null);
      setElapsedTime(0);
    }, 2000);
  };

  const toggleVideo = () => {
    setIsVideoEnabled(!isVideoEnabled);
  };

  const toggleAudio = () => {
    setIsAudioEnabled(!isAudioEnabled);
  };

  const toggleSpeaker = () => {
    setIsSpeakerEnabled(!isSpeakerEnabled);
  };

  const toggleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing);
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  const stats = {
    total: consultations.length,
    scheduled: consultations.filter(c => c.status === 'scheduled').length,
    inProgress: consultations.filter(c => c.status === 'in_progress').length,
    completed: consultations.filter(c => c.status === 'completed').length,
    cancelled: consultations.filter(c => c.status === 'cancelled').length
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Consultations vidéo</h1>
        <p className="text-gray-600 mt-2">Permettez aux médecins de réaliser des consultations en ligne</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-blue-500 p-3 rounded-lg">
              <VideoCameraIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-blue-500 p-3 rounded-lg">
              <CalendarIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Programmées</p>
              <p className="text-2xl font-bold text-gray-900">{stats.scheduled}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-green-500 p-3 rounded-lg">
              <PlayIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">En cours</p>
              <p className="text-2xl font-bold text-gray-900">{stats.inProgress}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-gray-500 p-3 rounded-lg">
              <CheckCircleIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Terminées</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-red-500 p-3 rounded-lg">
              <XCircleIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Annulées</p>
              <p className="text-2xl font-bold text-gray-900">{stats.cancelled}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Filtrer par statut:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Toutes</option>
            <option value="scheduled">Programmées</option>
            <option value="in_progress">En cours</option>
            <option value="completed">Terminées</option>
            <option value="cancelled">Annulées</option>
          </select>
        </div>
      </div>

      {/* Consultations List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Médecin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Heure prévue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durée
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredConsultations.map((consultation) => (
                <tr key={consultation.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center">
                        <UserCircleIcon className="h-8 w-8 text-gray-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{consultation.patient.name}</div>
                        <div className="text-sm text-gray-500">{consultation.patient.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {consultation.doctor}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {consultation.service}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {consultation.scheduledTime}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {consultation.duration} min
                    {consultation.actualDuration && (
                      <div className="text-xs text-gray-500">Réelle: {consultation.actualDuration} min</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(consultation.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      {consultation.status === 'scheduled' && (
                        <button
                          onClick={() => startConsultation(consultation)}
                          className="flex items-center px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                          <VideoCameraIcon className="h-4 w-4 mr-1" />
                          Démarrer
                        </button>
                      )}
                      {consultation.status === 'in_progress' && (
                        <button
                          onClick={() => startConsultation(consultation)}
                          className="flex items-center px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          <VideoCameraIcon className="h-4 w-4 mr-1" />
                          Rejoindre
                        </button>
                      )}
                      {consultation.status === 'completed' && consultation.recordingUrl && (
                        <button className="flex items-center px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700">
                          <PlayIcon className="h-4 w-4 mr-1" />
                          Voir l'enregistrement
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Video Consultation Modal */}
      {showVideoModal && selectedConsultation && (
        <div className="fixed inset-0 bg-black z-50">
          {/* Video Header */}
          <div className="absolute top-0 left-0 right-0 bg-gray-900 bg-opacity-90 p-4 z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={endConsultation}
                  className="p-2 text-white hover:bg-gray-800 rounded"
                >
                  <ArrowLeftIcon className="h-5 w-5" />
                </button>
                <div className="text-white">
                  <h3 className="font-medium">{selectedConsultation.patient.name}</h3>
                  <p className="text-sm text-gray-300">{selectedConsultation.service}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-white">
                  <div className="flex items-center space-x-2">
                    <ClockIcon className="h-4 w-4" />
                    <span>{formatTime(elapsedTime)}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    consultationStatus === 'active' 
                      ? 'bg-green-600 text-white' 
                      : consultationStatus === 'ended'
                      ? 'bg-gray-600 text-white'
                      : 'bg-yellow-600 text-white'
                  }`}>
                    {consultationStatus === 'active' ? 'En cours' : 
                     consultationStatus === 'ended' ? 'Terminée' : 'En attente'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Video Area */}
          <div className="flex h-full">
            {/* Patient Video */}
            <div className="flex-1 bg-gray-800 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <UserCircleIcon className="h-24 w-24 text-gray-600 mx-auto mb-4" />
                  <p className="text-white text-lg">{selectedConsultation.patient.name}</p>
                  {consultationStatus === 'waiting' && (
                    <p className="text-gray-400 mt-2">En attente de connexion...</p>
                  )}
                </div>
              </div>
              
              {/* Self Video */}
              <div className="absolute bottom-4 right-4 w-48 h-36 bg-gray-700 rounded-lg border-2 border-gray-600">
                <div className="h-full flex items-center justify-center">
                  {isVideoEnabled ? (
                    <VideoCameraIcon className="h-12 w-12 text-gray-400" />
                  ) : (
                    <div className="text-center">
                      <VideoCameraIcon className="h-12 w-12 text-red-400 mx-auto" />
                      <p className="text-red-400 text-xs mt-2">Caméra désactivée</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Side Panel */}
            <div className="w-80 bg-gray-900 p-4">
              {/* Controls */}
              <div className="space-y-4">
                <h4 className="text-white font-medium">Contrôles</h4>
                
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={toggleVideo}
                    className={`p-3 rounded-lg flex items-center justify-center ${
                      isVideoEnabled ? 'bg-gray-700 text-white' : 'bg-red-600 text-white'
                    }`}
                  >
                    <VideoCameraIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={toggleAudio}
                    className={`p-3 rounded-lg flex items-center justify-center ${
                      isAudioEnabled ? 'bg-gray-700 text-white' : 'bg-red-600 text-white'
                    }`}
                  >
                    <MicrophoneIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={toggleSpeaker}
                    className={`p-3 rounded-lg flex items-center justify-center ${
                      isSpeakerEnabled ? 'bg-gray-700 text-white' : 'bg-red-600 text-white'
                    }`}
                  >
                    {isSpeakerEnabled ? (
                      <SpeakerWaveIcon className="h-5 w-5" />
                    ) : (
                      <SpeakerXMarkIcon className="h-5 w-5" />
                    )}
                  </button>
                  <button
                    onClick={toggleScreenShare}
                    className={`p-3 rounded-lg flex items-center justify-center ${
                      isScreenSharing ? 'bg-blue-600 text-white' : 'bg-gray-700 text-white'
                    }`}
                  >
                    <ComputerDesktopIcon className="h-5 w-5" />
                  </button>
                </div>

                {/* Recording */}
                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">Enregistrement</span>
                  <button
                    onClick={toggleRecording}
                    className={`p-2 rounded-lg flex items-center ${
                      isRecording ? 'bg-red-600 text-white' : 'bg-gray-700 text-white'
                    }`}
                  >
                    {isRecording ? (
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                        <span className="text-xs">En cours</span>
                      </div>
                    ) : (
                      <span className="text-xs">Démarrer</span>
                    )}
                  </button>
                </div>

                {/* End Call */}
                <button
                  onClick={endConsultation}
                  className="w-full p-3 bg-red-600 text-white rounded-lg flex items-center justify-center hover:bg-red-700"
                >
                  <PhoneIcon className="h-5 w-5 mr-2" />
                  Terminer la consultation
                </button>
              </div>

              {/* Consultation Info */}
              <div className="mt-6 pt-6 border-t border-gray-700">
                <h4 className="text-white font-medium mb-3">Informations</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Patient:</span>
                    <span className="text-white">{selectedConsultation.patient.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Service:</span>
                    <span className="text-white">{selectedConsultation.service}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Durée prévue:</span>
                    <span className="text-white">{selectedConsultation.duration} min</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Notes:</span>
                    <span className="text-white text-xs">{selectedConsultation.notes}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HospitalVideoConsultation;
