import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  UserCircleIcon,
  LockClosedIcon,
  BellIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

// Import des composants d'onglets
import ProfilTab from './settings/ProfilTab';
import SecuriteTab from './settings/SecuriteTab';
import NotificationsTab from './settings/NotificationsTab';
import FacturationTab from './settings/FacturationTab';

const ParametresDoctor = () => {
  const [activeTab, setActiveTab] = useState('profil');
  const [userData, setUserData] = useState({
    firstName: 'Jean',
    lastName: 'Dupont',
    email: 'jean.dupont@example.com',
    phone: '+33 6 12 34 56 78',
    speciality: 'Médecin généraliste',
    bio: 'Médecin généraliste avec plus de 10 ans d\'expérience.',
    address: '123 Rue de la République',
    city: 'Paris',
    postalCode: '75001',
    country: 'France',
    rpps: '12345678901',
    adeli: '123456789'
  });

  const updateUserData = (newData) => {
    setUserData(prev => ({
      ...prev,
      ...newData
    }));
    // Ici, vous pourriez ajouter un appel API pour mettre à jour les données
  };

  const navigate = useNavigate();
  
  const tabs = [
    { id: 'profil', name: 'Profil', icon: <UserCircleIcon className="h-5 w-5" /> },
    { id: 'securite', name: 'Sécurité', icon: <ShieldCheckIcon className="h-5 w-5" /> },
    { id: 'notifications', name: 'Notifications', icon: <BellIcon className="h-5 w-5" /> },
    { id: 'facturation', name: 'Facturation', icon: <CreditCardIcon className="h-5 w-5" /> }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profil':
        return <ProfilTab userData={userData} onUpdate={updateUserData} />;
      case 'securite':
        return <SecuriteTab />;
      case 'notifications':
        return <NotificationsTab />;
      case 'facturation':
        return <FacturationTab />;
      default:
        return <ProfilTab userData={userData} onUpdate={updateUserData} />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="lg:grid lg:grid-cols-12 lg:gap-x-8">
        {/* Sidebar navigation */}
        <aside className="lg:col-span-3">
          <nav className="space-y-4">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Paramètres du compte</h2>
            <ul className="space-y-2">
              {tabs.map((tab, index) => {
                const isActive = activeTab === tab.id;
                return (
                  <li key={tab.id}>
                    <button
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full group flex items-center p-3 rounded-lg transition-colors ${
                        isActive 
                          ? 'bg-blue-50 text-blue-700' 
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span className={`flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full mr-3 ${
                        isActive 
                          ? 'bg-blue-100 text-blue-600' 
                          : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200'
                      }`}>
                        {tab.icon}
                      </span>
                      <div className="flex-1 text-left">
                        <div className="text-sm font-medium">{tab.name}</div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          {tab.id === 'profil' && 'Informations personnelles'}
                          {tab.id === 'securite' && 'Sécurité du compte'}
                          {tab.id === 'notifications' && 'Préférences de notifications'}
                          {tab.id === 'facturation' && 'Paiements et factures'}
                        </div>
                      </div>
                      {isActive && (
                        <span className="h-2 w-2 bg-blue-600 rounded-full ml-2"></span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
            
            {/* Déconnexion */}
            {/* <button
              className="border-transparent text-gray-900 hover:bg-gray-50 hover:text-gray-900 group border-l-4 px-3 py-2 flex items-center text-sm font-medium w-full text-left mt-8"
            >
              <ArrowRightOnRectangleIcon className="text-gray-400 group-hover:text-gray-500 mr-3 h-5 w-5" />
              <span className="truncate">Déconnexion</span>
            </button> */}
          </nav>
        </aside>

        {/* Main content */}
        <div className="lg:col-span-9">
          <div className="bg-white shadow overflow-hidden rounded-lg border border-gray-200">
            {/* En-tête avec titre et boutons d'action */}
            <div className="px-6 py-5 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {tabs.find(tab => tab.id === activeTab)?.name || 'Paramètres'}
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    {activeTab === 'profil' && 'Gérez les informations de votre profil professionnel'}
                    {activeTab === 'securite' && 'Protégez votre compte avec des paramètres de sécurité avancés'}
                    {activeTab === 'notifications' && 'Contrôlez comment et quand vous recevez des notifications'}
                    {activeTab === 'facturation' && 'Consultez et gérez votre abonnement et vos factures'}
                  </p>
                </div>
                <div className="flex space-x-3">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    onClick={() => window.history.back()}
                  >
                    Retour
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    onClick={() => {
                      // Logique de sauvegarde ici
                      const activeTabName = tabs.find(tab => tab.id === activeTab)?.name;
                      alert(`Modifications ${activeTabName ? 'de ' + activeTabName : ''} enregistrées avec succès`);
                    }}
                  >
                    Enregistrer les modifications
                  </button>
                </div>
              </div>
            </div>
            
            {/* Contenu de l'onglet */}
            <div className="px-6 py-6 bg-gray-50">
              <div className="space-y-6">
                {renderTabContent()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParametresDoctor;
