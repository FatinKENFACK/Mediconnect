// src/components/messaging/NewConversationModal.jsx

import React, { useState, useEffect } from 'react';
import {
  XMarkIcon, MagnifyingGlassIcon,
  UserGroupIcon, PlusCircleIcon,
} from '@heroicons/react/24/outline';
import api from '../../services/api';

// ============================================================
// HELPER : initiales
// ============================================================
const initials = (name) =>
  (name || '?').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

// ============================================================
// COMPOSANT : Modal Nouvelle Conversation
// Props :
//   onClose()            → ferme la modal
//   onConversationCreated(conv) → appelé avec la conversation créée
// ============================================================
const NewConversationModal = ({ onClose, onConversationCreated }) => {
  const [contacts, setContacts]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [creating, setCreating]   = useState(false);
  const [error, setError]         = useState(null);

  // ============================================================
  // Charger les contacts disponibles
  // ============================================================
  useEffect(() => {
    const load = async () => {
      try {
        const data = await api.getAvailableContacts();
        setContacts(Array.isArray(data) ? data : []);
      } catch (err) {
        setError('Impossible de charger les contacts.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // ============================================================
  // Démarrer une conversation avec un contact
  // ============================================================
  const handleStartConversation = async (contact) => {
    setCreating(true);
    setError(null);
    try {
      // Déterminer le type de conversation selon les rôles
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const myRole      = user.role;
      const otherRole   = contact.role;

      let convType = 'patient_medecin';
      if (myRole === 'patient' && otherRole === 'doctor')    convType = 'patient_medecin';
      if (myRole === 'doctor'  && otherRole === 'patient')   convType = 'patient_medecin';
      if (myRole === 'doctor'  && otherRole === 'hospital')  convType = 'medecin_hopital';
      if (myRole === 'hospital' && otherRole === 'doctor')   convType = 'medecin_hopital';
      if (myRole === 'patient' && otherRole === 'hospital')  convType = 'patient_hopital';
      if (myRole === 'hospital' && otherRole === 'patient')  convType = 'patient_hopital';

      const conversation = await api.createConversation({
        type:          convType,
        other_user_id: contact.id,
      });

      onConversationCreated(conversation);
      onClose();
    } catch (err) {
      setError(err.message || 'Erreur lors de la création de la conversation.');
    } finally {
      setCreating(false);
    }
  };

  // ============================================================
  // Filtrage
  // ============================================================
  const filtered = contacts.filter(c =>
    (c.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (c.specialty || '').toLowerCase().includes(search.toLowerCase())
  );

  const roleLabel = (role) => {
    const map = { doctor: 'Médecin', patient: 'Patient', hospital: 'Hôpital' };
    return map[role] || role;
  };

  const roleColor = (role) => {
    const map = {
      doctor:   'bg-blue-100 text-blue-700',
      patient:  'bg-teal-100 text-teal-700',
      hospital: 'bg-purple-100 text-purple-700',
    };
    return map[role] || 'bg-gray-100 text-gray-700';
  };

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <PlusCircleIcon className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Nouvelle conversation</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Recherche */}
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un contact..."
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
            />
          </div>
        </div>

        {/* Liste contacts */}
        <div className="flex-1 overflow-y-auto p-2">
          {loading ? (
            <div className="space-y-2 p-2 animate-pulse">
              {[1,2,3].map(i => (
                <div key={i} className="flex items-center gap-3 p-3">
                  <div className="h-10 w-10 bg-gray-200 rounded-full flex-shrink-0"></div>
                  <div className="flex-1">
                    <div className="h-3 bg-gray-200 rounded w-32 mb-2"></div>
                    <div className="h-3 bg-gray-100 rounded w-20"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="p-6 text-center text-sm text-red-600">{error}</div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center">
              <UserGroupIcon className="mx-auto h-10 w-10 text-gray-300 mb-2" />
              <p className="text-sm text-gray-500">
                {contacts.length === 0
                  ? 'Aucun contact disponible pour le moment.'
                  : 'Aucun contact ne correspond à votre recherche.'}
              </p>
              {contacts.length === 0 && (
                <p className="text-xs text-gray-400 mt-1">
                  Les contacts apparaissent une fois que vous avez des rendez-vous en commun.
                </p>
              )}
            </div>
          ) : (
            <ul className="space-y-1">
              {filtered.map((contact) => (
                <li key={contact.id}>
                  <button
                    onClick={() => handleStartConversation(contact)}
                    disabled={creating}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left disabled:opacity-50"
                  >
                    {/* Avatar */}
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {contact.avatar ? (
                        <img src={contact.avatar} className="h-10 w-10 object-cover" alt="" />
                      ) : (
                        <span className="text-blue-700 font-semibold text-sm">
                          {initials(contact.name)}
                        </span>
                      )}
                    </div>

                    {/* Infos */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {contact.name}
                      </p>
                      {contact.specialty && (
                        <p className="text-xs text-gray-500 truncate">{contact.specialty}</p>
                      )}
                    </div>

                    {/* Badge rôle */}
                    <span className={`flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-medium ${roleColor(contact.role)}`}>
                      {roleLabel(contact.role)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Erreur création */}
        {error && !loading && (
          <div className="px-4 pb-2">
            <p className="text-xs text-red-600 text-center">{error}</p>
          </div>
        )}

        {/* Footer */}
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="w-full py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
          >
            Annuler
          </button>
        </div>

      </div>
    </div>
  );
};

export default NewConversationModal;