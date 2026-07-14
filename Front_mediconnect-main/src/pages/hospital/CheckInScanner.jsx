import React, { useState, useRef, useEffect } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import {
  QrCodeIcon, CheckCircleIcon, XCircleIcon, UserCircleIcon,
  ClockIcon, CalendarIcon, ArrowPathIcon, CameraIcon,
} from '@heroicons/react/24/outline';
import api from '../../services/api';

const SCANNER_ELEMENT_ID = 'qr-reader';

const CheckInScanner = () => {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);       // détails du RDV vérifié
  const [error, setError] = useState('');
  const [checkingIn, setCheckingIn] = useState(false);
  const [checkedIn, setCheckedIn] = useState(false);
  const scannerRef = useRef(null);

  const startScanning = async () => {
    setError('');
    setResult(null);
    setCheckedIn(false);
    setScanning(true);

    try {
      const scanner = new Html5Qrcode(SCANNER_ELEMENT_ID);
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        async (decodedText) => {
          await handleScanSuccess(decodedText);
        },
        () => {
          // erreur de frame individuelle — ignorée silencieusement (scan continu)
        }
      );
    } catch (err) {
      console.error('Erreur démarrage caméra:', err);
      setError("Impossible d'accéder à la caméra. Vérifiez les autorisations de votre navigateur.");
      setScanning(false);
    }
  };

  const stopScanning = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch (err) {
        // déjà arrêté, on ignore
      }
    }
    setScanning(false);
  };

  const handleScanSuccess = async (token) => {
    await stopScanning();
    try {
      const data = await api.verifyAppointmentToken(token);
      setResult({ ...data, token });
    } catch (err) {
      setError(err.message || 'Code invalide ou rendez-vous introuvable.');
    }
  };

  const handleCheckIn = async () => {
    if (!result?.token) return;
    setCheckingIn(true);
    try {
      await api.checkInAppointment(result.token);
      setCheckedIn(true);
    } catch (err) {
      setError(err.message || "Erreur lors de la confirmation d'arrivée.");
    } finally {
      setCheckingIn(false);
    }
  };

  const reset = () => {
    setResult(null);
    setError('');
    setCheckedIn(false);
  };

  useEffect(() => {
    return () => {
      // Nettoyage propre de la caméra si le composant est démonté en plein scan
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, []);

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Vérification à l'arrivée</h1>
        <p className="mt-1 text-sm text-gray-500">
          Scannez le QR code présenté par le patient pour confirmer son rendez-vous.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center justify-between">
          {error}
          <button onClick={reset} className="text-red-700 underline text-sm">Réessayer</button>
        </div>
      )}

      {/* Zone de scan */}
      {!result && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div
            id={SCANNER_ELEMENT_ID}
            className={`rounded-xl overflow-hidden ${scanning ? 'block' : 'hidden'}`}
          />

          {!scanning && (
            <div className="flex flex-col items-center py-12">
              <div className="h-20 w-20 rounded-full bg-teal-50 flex items-center justify-center mb-4">
                <QrCodeIcon className="h-10 w-10 text-teal-600" />
              </div>
              <button
                onClick={startScanning}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 text-white rounded-xl font-medium hover:bg-teal-700"
              >
                <CameraIcon className="h-5 w-5" />
                Démarrer le scan
              </button>
            </div>
          )}

          {scanning && (
            <button
              onClick={stopScanning}
              className="mt-4 w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 text-sm hover:bg-gray-50"
            >
              Arrêter la caméra
            </button>
          )}
        </div>
      )}

      {/* Résultat de la vérification */}
      {result && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className={`p-4 flex items-center gap-2 ${checkedIn ? 'bg-emerald-50' : 'bg-blue-50'}`}>
            {checkedIn ? (
              <>
                <CheckCircleIcon className="h-6 w-6 text-emerald-600" />
                <span className="font-medium text-emerald-800">Arrivée confirmée</span>
              </>
            ) : result.already_checked_in ? (
              <>
                <XCircleIcon className="h-6 w-6 text-amber-600" />
                <span className="font-medium text-amber-800">Ce patient est déjà arrivé</span>
              </>
            ) : (
              <>
                <UserCircleIcon className="h-6 w-6 text-blue-600" />
                <span className="font-medium text-blue-800">Rendez-vous vérifié</span>
              </>
            )}
          </div>

          <div className="p-6 space-y-4">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide">Patient</p>
              <p className="text-lg font-semibold text-gray-900">{result.patient_name}</p>
              {result.patient_phone && (
                <p className="text-sm text-gray-500">{result.patient_phone}</p>
              )}
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <UserCircleIcon className="h-4 w-4 text-gray-400" />
              {result.doctor_name}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <CalendarIcon className="h-4 w-4 text-gray-400" />
              {new Date(result.date).toLocaleDateString('fr-FR', {
                weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
              })}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <ClockIcon className="h-4 w-4 text-gray-400" />
              {result.time?.slice(0, 5)}
            </div>
            {result.reason && (
              <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-700">
                <span className="font-medium">Motif : </span>{result.reason}
              </div>
            )}

            <div className="pt-4 border-t border-gray-100 flex gap-3">
              {!checkedIn && !result.already_checked_in && (
                <button
                  onClick={handleCheckIn}
                  disabled={checkingIn}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 disabled:opacity-50"
                >
                  {checkingIn ? (
                    <div className="animate-spin h-4 w-4 border-b-2 border-white rounded-full" />
                  ) : (
                    <CheckCircleIcon className="h-5 w-5" />
                  )}
                  Confirmer l'arrivée
                </button>
              )}
              <button
                onClick={reset}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50"
              >
                <ArrowPathIcon className="h-5 w-5" />
                Scanner un autre patient
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckInScanner;