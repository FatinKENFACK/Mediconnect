import React, { useState } from 'react';
import {
  UserCircleIcon, ShieldCheckIcon, BellIcon, CreditCardIcon,
} from '@heroicons/react/24/outline';

import ProfilTab from './settings/ProfilTab';
import SecuriteTab from './settings/SecuriteTab';
import NotificationsTab from './settings/NotificationsTab';
import FacturationTab from './settings/FacturationTab';

const ParametresDoctor = () => {
  const [activeTab, setActiveTab] = useState('profil');

  const tabs = [
    { id: 'profil',        name: 'Profil',        icon: <UserCircleIcon className="h-5 w-5" /> },
    { id: 'securite',      name: 'Sécurité',      icon: <ShieldCheckIcon className="h-5 w-5" /> },
    { id: 'notifications', name: 'Notifications', icon: <BellIcon className="h-5 w-5" /> },
    { id: 'facturation',   name: 'Facturation',   icon: <CreditCardIcon className="h-5 w-5" /> },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profil':        return <ProfilTab />;
      case 'securite':      return <SecuriteTab />;
      case 'notifications': return <NotificationsTab />;
      case 'facturation':   return <FacturationTab />;
      default:              return <ProfilTab />;
    }
  };

  const tabDescriptions = {
    profil:        'Gérez les informations de votre profil professionnel',
    securite:      'Protégez votre compte avec des paramètres de sécurité',
    notifications: 'Aperçu de vos préférences de notifications',
    facturation:   'Informations sur votre établissement de rattachement',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="lg:grid lg:grid-cols-12 lg:gap-x-8">

        {/* Sidebar navigation */}
        <aside className="lg:col-span-3">
          <nav className="space-y-4">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Paramètres du compte</h2>
            <ul className="space-y-2">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <li key={tab.id}>
                    <button
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full group flex items-center p-3 rounded-lg transition-colors ${
                        isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span className={`flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full mr-3 ${
                        isActive ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200'
                      }`}>
                        {tab.icon}
                      </span>
                      <div className="flex-1 text-left">
                        <div className="text-sm font-medium">{tab.name}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{tabDescriptions[tab.id]}</div>
                      </div>
                      {isActive && <span className="h-2 w-2 bg-blue-600 rounded-full ml-2"></span>}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        {/* Main content */}
        <div className="lg:col-span-9">
          <div className="bg-white shadow overflow-hidden rounded-lg border border-gray-200">
            <div className="px-6 py-5 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {tabs.find(tab => tab.id === activeTab)?.name || 'Paramètres'}
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                {tabDescriptions[activeTab]}
              </p>
            </div>

            <div className="px-6 py-6 bg-gray-50">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParametresDoctor;