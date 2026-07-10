import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import {
  VideoCameraIcon,
  MicrophoneIcon,
  VideoCameraSlashIcon,
  PhoneXMarkIcon,
  UserCircleIcon,
  ClockIcon,
  ShieldCheckIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  BellIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

const MicrophoneSlashIcon = SpeakerXMarkIcon;
const SignalIcon = BellIcon;

// ============================================================
// Bouton de contrôle (identique à la charte existante)
// ============================================================
const ControlButton = ({ icon: Icon, onClick, isActive = false, color = 'default', size = 'medium', title }) => {
  const sizeClasses = { small: 'p-2', medium: 'p-3', large: 'p-4' };
  const colorClasses = {
    default: 'bg-gray-800/70 hover:bg-gray-700/90 text-white',
    red: 'bg-red-600 hover:bg-red-700 text-white',
    green: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    muted: 'bg-white/10 hover:bg-white/20 text-white',
  };
  return (
    <button
      onClick={onClick}
      title={title}
      className={`${sizeClasses[size]} ${colorClasses[color]} ${isActive ? 'ring-2 ring-offset-2 ring-offset-gray-900 ring-white/50' : ''}
        rounded-full backdrop-blur-sm transition-all duration-200 flex items-center justify-center
        hover:scale-105 active:scale-95`}
    >
      <Icon className={size === 'large' ? 'h-6 w-6' : 'h-5 w-5'} />
    </button>
  );
};

// ============================================================
// Chargement dynamique du script Jitsi (une seule fois)
// ============================================================
const loadJitsiScript = () => {
  return new Promise((resolve, reject) => {
    if (window.JitsiMeetExternalAPI) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://meet.jit.si/external_api.js';
    script.async = true;
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
  });
};

const CallRoom = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isDoctor } = useAuth();

  // 'waiting' | 'ongoing' | 'ended' | 'error'
  const [callStatus, setCallStatus] = useState('waiting');
  const [callType, setCallType] = useState(location.state?.callType || 'video');
  const [roomName, setRoomName] = useState(location.state?.roomName || null);
  const [otherPartyName, setOtherPartyName] = useState(
    location.state?.otherPartyName || (isDoctor ? 'Patient' : 'Médecin')
  );

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(callType === 'audio');
  const [connectionQuality, setConnectionQuality] = useState('good');
  const [time, setTime] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const jitsiContainerRef = useRef(null);
  const jitsiApiRef = useRef(null);
  const wsRef = useRef(null);
  const timerRef = useRef(null);

  // ------------------------------------------------------------
  // 1. Récupérer les infos du RDV si on arrive sans state
  //    (rechargement de page, lien direct, ou côté patient)
  // ------------------------------------------------------------
  useEffect(() => {
    const loadAppointmentInfo = async () => {
      try {
        const list = isDoctor
          ? await api.getDoctorAppointments()
          : await api.getAppointments();
        const found = list.find((a) => String(a.id) === String(appointmentId));
        if (found) {
          setOtherPartyName(isDoctor ? found.patient_name : (found.doctor_full_name || found.doctor_name));
        }
      } catch (err) {
        console.error('Erreur chargement infos RDV:', err);
      }
    };

    if (!location.state?.otherPartyName) {
      loadAppointmentInfo();
    }
  }, [appointmentId, isDoctor]);

  // ------------------------------------------------------------
  // 2. Déterminer l'état initial de l'appel
  //    - Médecin qui vient de cliquer "Démarrer" -> room déjà connue (state)
  //    - Patient (ou rechargement) -> on vérifie le statut côté serveur
  // ------------------------------------------------------------
  useEffect(() => {
    if (roomName) {
      setCallStatus('ongoing');
      return;
    }

    const checkStatus = async () => {
      try {
        const data = await api.getCallStatus(appointmentId);
        if (data.call_status === 'ongoing' && data.room_name) {
          setRoomName(data.room_name);
          setCallType(data.call_type || 'video');
          setCallStatus('ongoing');
        } else if (data.call_status === 'ended') {
          setCallStatus('ended');
        } else {
          setCallStatus('waiting');
        }
      } catch (err) {
        console.error('Erreur vérification statut appel:', err);
      }
    };
    checkStatus();
  }, [appointmentId]); // eslint-disable-line react-hooks/exhaustive-deps

  // ------------------------------------------------------------
  // 3. WebSocket de notification — écoute "call_started" / "call_ended"
  //    (le patient attend ici tant que le médecin n'a pas démarré)
  // ------------------------------------------------------------
  useEffect(() => {
    const wsUrl = api.getNotificationSocketUrl();
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (String(data.appointment_id) !== String(appointmentId)) return;

        if (data.event === 'call_started') {
          setRoomName(data.room_name);
          setCallType(data.call_type);
          if (data.doctor_name) setOtherPartyName(data.doctor_name);
          setCallStatus('ongoing');
        } else if (data.event === 'call_ended') {
          setCallStatus('ended');
        }
      } catch (err) {
        console.error('Erreur parsing notification:', err);
      }
    };

    return () => ws.close();
  }, [appointmentId]);

  // ------------------------------------------------------------
  // 4. Initialiser Jitsi une fois qu'on a une room
  // ------------------------------------------------------------
  useEffect(() => {
    if (callStatus !== 'ongoing' || !roomName) return;

    let disposed = false;

    loadJitsiScript().then(() => {
      if (disposed || !jitsiContainerRef.current) return;

      const displayName = `${user?.first_name || ''} ${user?.last_name || ''}`.trim() || 'Utilisateur';

      const api_ = new window.JitsiMeetExternalAPI('meet.jit.si', {
        roomName,
        parentNode: jitsiContainerRef.current,
        width: '100%',
        height: '100%',
        userInfo: { displayName },
        configOverwrite: {
          startWithVideoMuted: callType === 'audio',
          startAudioOnly: callType === 'audio',
          prejoinPageEnabled: false,
          disableDeepLinking: true,
        },
        interfaceConfigOverwrite: {
          TOOLBAR_BUTTONS: [], // on utilise nos propres contrôles (charte existante)
          SHOW_JITSI_WATERMARK: false,
          SHOW_WATERMARK_FOR_GUESTS: false,
        },
      });

      jitsiApiRef.current = api_;

      api_.addEventListener('videoConferenceJoined', () => {
        timerRef.current = setInterval(() => setTime((t) => t + 1), 1000);
      });

      api_.addEventListener('audioMuteStatusChanged', ({ muted }) => setIsMuted(muted));
      api_.addEventListener('videoMuteStatusChanged', ({ muted }) => setIsVideoOff(muted));

      api_.addEventListener('connectionQualityChanged', ({ quality }) => {
        if (quality > 70) setConnectionQuality('good');
        else if (quality > 35) setConnectionQuality('average');
        else setConnectionQuality('poor');
      });

      api_.addEventListener('videoConferenceLeft', () => {
        handleEndCall(false); // l'utilisateur a fermé Jitsi directement
      });
    });

    return () => {
      disposed = true;
      if (jitsiApiRef.current) {
        jitsiApiRef.current.dispose();
        jitsiApiRef.current = null;
      }
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [callStatus, roomName, callType]); // eslint-disable-line react-hooks/exhaustive-deps

  // ------------------------------------------------------------
  // Actions
  // ------------------------------------------------------------
  const toggleMute = () => jitsiApiRef.current?.executeCommand('toggleAudio');
  const toggleVideo = () => jitsiApiRef.current?.executeCommand('toggleVideo');
  const toggleFullscreen = () => setIsFullscreen((f) => !f);

  const handleEndCall = useCallback(async (notifyServer = true) => {
    if (notifyServer) {
      try {
        await api.endCall(appointmentId);
      } catch (err) {
        console.error('Erreur fin d\'appel:', err);
      }
    }
    setCallStatus('ended');
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeout(() => {
      navigate(isDoctor ? '/medecin/consultations' : '/patient/rendez-vous');
    }, 2000);
  }, [appointmentId, isDoctor, navigate]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // ============================================================
  // RENDER : salle d'attente
  // ============================================================
  if (callStatus === 'waiting') {
    return (
      <div className="h-full min-h-[70vh] flex flex-col items-center justify-center space-y-8 bg-white">
        <div className="relative">
          <div className="w-40 h-40 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center animate-pulse">
            <UserCircleIcon className="h-24 w-24 text-blue-400" />
          </div>
          <div className="absolute -top-2 -right-2 w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center animate-bounce">
            <div className="w-4 h-4 bg-white rounded-full"></div>
          </div>
        </div>
        <div className="text-center space-y-3">
          <h3 className="text-xl font-semibold text-gray-900">
            {isDoctor ? 'Préparation de la consultation' : 'En attente du médecin'}
          </h3>
          <p className="text-3xl font-bold text-gray-900">{otherPartyName}</p>
          <div className="flex items-center justify-center space-x-2 text-gray-500">
            <div className="flex space-x-1">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
              ))}
            </div>
            <p>{isDoctor ? 'Initialisation...' : 'Le médecin va bientôt démarrer l\'appel...'}</p>
          </div>
        </div>
        <ControlButton icon={PhoneXMarkIcon} onClick={() => navigate(-1)} color="red" size="medium" title="Quitter" />
      </div>
    );
  }

  // ============================================================
  // RENDER : appel terminé
  // ============================================================
  if (callStatus === 'ended') {
    return (
      <div className="h-full min-h-[70vh] flex flex-col items-center justify-center space-y-6 p-8 text-center bg-white">
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-emerald-100 to-green-100 flex items-center justify-center">
          <PhoneXMarkIcon className="h-16 w-16 text-emerald-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Consultation terminée</h2>
        <p className="text-gray-600">Durée de l'appel : <span className="font-semibold">{formatTime(time)}</span></p>
        <p className="text-sm text-gray-400">Redirection en cours...</p>
      </div>
    );
  }

  // ============================================================
  // RENDER : appel en cours
  // ============================================================
  return (
    <div className={`flex flex-col bg-gray-900 ${isFullscreen ? 'fixed inset-0 z-50' : 'h-[85vh] rounded-xl overflow-hidden'}`}>
      {/* En-tête */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-4 flex justify-between items-center flex-shrink-0">
        <div>
          <p className="font-semibold text-lg">Consultation avec {otherPartyName}</p>
          <div className="flex items-center space-x-4 text-sm">
            <span className="flex items-center text-white/70">
              <ClockIcon className="h-4 w-4 mr-1" />
              {formatTime(time)}
            </span>
            <span className="flex items-center space-x-2">
              <SignalIcon className={`h-4 w-4 ${connectionQuality === 'good' ? 'text-emerald-400' : connectionQuality === 'average' ? 'text-amber-400' : 'text-red-400'}`} />
              <span className="text-white/80">
                Connexion {connectionQuality === 'good' ? 'bonne' : connectionQuality === 'average' ? 'moyenne' : 'faible'}
              </span>
              <ShieldCheckIcon className="h-4 w-4 text-emerald-400" />
              <span className="text-white/80">Sécurisée</span>
            </span>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-600 text-white">
          {callType === 'audio' ? 'Appel audio' : 'Appel vidéo'}
        </span>
      </div>

      {/* Zone Jitsi */}
      <div ref={jitsiContainerRef} className="flex-1 relative bg-black" />

      {/* Contrôles */}
      <div className="bg-gradient-to-t from-black via-black/90 to-transparent p-6 flex-shrink-0">
        <div className="flex justify-center items-center space-x-6">
          <ControlButton
            icon={isMuted ? MicrophoneSlashIcon : MicrophoneIcon}
            onClick={toggleMute}
            isActive={isMuted}
            color={isMuted ? 'red' : 'default'}
            size="large"
            title={isMuted ? 'Activer le micro' : 'Désactiver le micro'}
          />
          {callType === 'video' && (
            <ControlButton
              icon={isVideoOff ? VideoCameraSlashIcon : VideoCameraIcon}
              onClick={toggleVideo}
              isActive={isVideoOff}
              color={isVideoOff ? 'red' : 'default'}
              size="large"
              title={isVideoOff ? 'Activer la caméra' : 'Désactiver la caméra'}
            />
          )}
          <ControlButton icon={PhoneXMarkIcon} onClick={() => handleEndCall(true)} color="red" size="large" title="Terminer l'appel" />
        </div>
      </div>
    </div>
  );
};

export default CallRoom;