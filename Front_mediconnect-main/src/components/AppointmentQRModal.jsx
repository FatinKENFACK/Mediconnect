import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { XMarkIcon, ShieldCheckIcon, MapPinIcon, ClockIcon } from '@heroicons/react/24/outline';

// ============================================================
// Modal affichant le QR code d'accès pour un RDV présentiel confirmé.
// Le personnel de l'hôpital scanne ce code à l'accueil pour vérifier
// l'authenticité du rendez-vous avant l'entrée du patient.
// ============================================================
const AppointmentQRModal = ({ appointment, onClose }) => {
  if (!appointment) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Code d'accès</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 flex flex-col items-center">
          <div className="p-4 bg-white border-4 border-teal-100 rounded-2xl">
            <QRCodeSVG
              value={appointment.verification_token}
              size={200}
              level="M"
            />
          </div>

          <p className="mt-4 text-sm text-gray-500 text-center">
            Présentez ce code à l'accueil de l'hôpital lors de votre arrivée.
          </p>

          <div className="mt-5 w-full space-y-2 bg-gray-50 rounded-xl p-4 text-sm">
            <div className="flex items-center gap-2 text-gray-700">
              <ClockIcon className="h-4 w-4 text-gray-400" />
              {new Date(appointment.date).toLocaleDateString('fr-FR', {
                weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
              })} à {appointment.time?.slice(0, 5)}
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <MapPinIcon className="h-4 w-4 text-gray-400" />
              {appointment.doctor_full_name || appointment.doctor_name}
            </div>
          </div>

          <div className="mt-4 flex items-start gap-2 text-xs text-emerald-700 bg-emerald-50 p-3 rounded-lg w-full">
            <ShieldCheckIcon className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <p>Ce code est unique et vérifié par nos serveurs — il ne peut pas être falsifié.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentQRModal;