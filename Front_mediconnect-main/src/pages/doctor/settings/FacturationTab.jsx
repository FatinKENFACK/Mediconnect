import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import {
  BuildingOfficeIcon, CheckCircleIcon, InformationCircleIcon,
} from '@heroicons/react/24/outline';

// ============================================================
// COMPOSANT : FacturationTab — lecture seule
// Dans ce système, l'abonnement est géré au niveau de l'hôpital,
// pas du médecin individuellement. Ce tab affiche simplement
// l'établissement de rattachement du médecin.
// ============================================================
const FacturationTab = () => {
  const [doctor, setDoctor]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await api.getDoctorProfile();
        setDoctor(data);
      } catch {
        setError('Impossible de charger les informations.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return (
    <div className="space-y-4 animate-pulse">
      <div className="h-32 bg-gray-100 rounded-lg"></div>
    </div>
  );

  return (
    <div className="space-y-6">

      {/* Bannière explicative */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
        <InformationCircleIcon className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-blue-900">Facturation gérée par votre établissement</p>
          <p className="text-sm text-blue-800 mt-1">
            Sur MediConnect, l'abonnement et la facturation sont gérés au niveau de l'hôpital, et non individuellement par chaque médecin. Vous n'avez aucune action à effectuer ici.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
      )}

      {/* Établissement de rattachement */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Votre établissement
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Établissement auquel votre compte est rattaché.
          </p>
        </div>
        <div className="px-4 py-5 sm:p-6">
          {doctor?.hospital_name || doctor?.hospital ? (
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="p-3 bg-blue-100 rounded-lg">
                <BuildingOfficeIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {doctor.hospital_name || doctor.hospital}
                </p>
                <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                  <CheckCircleIcon className="h-3.5 w-3.5 text-green-500" />
                  Compte actif et rattaché
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              Aucun établissement de rattachement trouvé sur votre profil.
            </p>
          )}
        </div>
      </div>

      {/* Statut vérification */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Statut de votre compte</p>
              <p className="text-sm text-gray-500 mt-0.5">
                Détermine votre visibilité auprès des patients.
              </p>
            </div>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              doctor?.is_verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            }`}>
              {doctor?.is_verified ? '✓ Vérifié' : '⏳ En attente de vérification'}
            </span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default FacturationTab;