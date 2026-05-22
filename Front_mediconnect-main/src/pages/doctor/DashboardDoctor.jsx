import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  CalendarIcon,
  VideoCameraIcon,
  FolderIcon,
  DocumentTextIcon,
  BellIcon,
  ChatBubbleLeftRightIcon,
  ChartBarIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
  UserGroupIcon,
  ClipboardDocumentListIcon,
  ClockIcon,
  ClipboardDocumentCheckIcon,
  DocumentArrowDownIcon,
  ChartPieIcon
} from '@heroicons/react/24/outline';

const DashboardDoctor = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const navigation = [
    { name: 'Disponibilités', href: '/medecin/disponibilites', icon: ClockIcon, current: location.pathname.includes('disponibilites') },
    { name: 'Tableau de bord', href: '/medecin', icon: ChartBarIcon, current: location.pathname === '/medecin' },
    { name: 'Agenda', href: '/medecin/agenda', icon: CalendarIcon, current: location.pathname.includes('agenda') },
    { name: 'Consultations', href: '/medecin/consultations', icon: VideoCameraIcon, current: location.pathname.includes('consultations') },
    { name: 'Dossiers patients', href: '/medecin/dossiers', icon: FolderIcon, current: location.pathname.includes('dossiers') },
    { name: 'Comptes-rendus', href: '/medecin/comptes-rendus', icon: DocumentTextIcon, current: location.pathname.includes('comptes-rendus') },
    { name: 'Prescriptions', href: '/medecin/prescriptions', icon: ClipboardDocumentCheckIcon, current: location.pathname.includes('prescriptions') },
    { name: 'Messagerie', href: '/medecin/messagerie', icon: ChatBubbleLeftRightIcon, current: location.pathname.includes('messagerie') },
    { name: 'Statistiques', href: '/medecin/statistiques', icon: ChartPieIcon, current: location.pathname.includes('statistiques') },
  ];

  const stats = [
    { name: 'RDV aujourd\'hui', value: '8', change: '+12%', changeType: 'increase', icon: CalendarIcon },
    { name: 'Patients en attente', value: '3', change: '+2', changeType: 'neutral', icon: UserGroupIcon },
    { name: 'Messages non lus', value: '5', change: '+3', changeType: 'increase', icon: ChatBubbleLeftRightIcon },
    { name: 'Taux de remplissage', value: '78%', change: '+5%', changeType: 'increase', icon: ChartBarIcon },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 z-30 w-64 bg-white shadow-lg transition duration-200 ease-in-out`}>
        <div className="flex flex-col h-full">
          {/* Logo et titre */}
          <div className="flex items-center justify-between h-16 px-4 bg-blue-600 text-white">
            <div className="flex items-center">
              <UserGroupIcon className="h-8 w-8 mr-2" />
              <span className="text-xl font-semibold">Docteur</span>
            </div>
            <button
              className="md:hidden text-white"
              onClick={() => setSidebarOpen(false)}
            >
              <ArrowLeftOnRectangleIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors duration-200 ${item.current
                    ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
              >
                <item.icon
                  className={`mr-3 flex-shrink-0 h-5 w-5 ${item.current ? 'text-blue-500' : 'text-gray-400'
                    }`}
                  aria-hidden="true"
                />
                {item.name}
                {item.name === 'Messagerie' && (
                  <span className="ml-auto inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                    5
                  </span>
                )}
              </Link>
            ))}
          </nav>

          {/* Profil */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserCircleIcon className="h-10 w-10 text-gray-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">Dr. Dupont</p>
                <p className="text-xs text-gray-500">Cardiologue</p>
              </div>
              <div className="ml-auto">
                <button className="text-gray-400 hover:text-gray-500">
                  <Cog6ToothIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-20 bg-white shadow-sm">
        <div className="flex items-center justify-between h-16 px-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-500 hover:text-gray-600"
          >
            <span className="sr-only">Ouvrir le menu</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="text-lg font-semibold text-gray-900">Tableau de bord</div>
          <div className="w-6"></div> {/* Pour l'alignement */}
        </div>
      </div>

      {/* Main content */}
      <div className=" pt-16 md:pt-0">
        <main className="p-4 md:p-8">
          {/* En-tête */}
          <div className="pb-5 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
                <p className="mt-1 text-sm text-gray-500">Bienvenue, Dr. Dupont. Voici un aperçu de votre activité.</p>
              </div>
              <div className="flex space-x-3">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <VideoCameraIcon className="-ml-1 mr-2 h-4 w-4" />
                  Nouvelle consultation
                </button>
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <CalendarIcon className="-ml-1 mr-2 h-4 w-4" />
                  Nouveau RDV
                </button>
              </div>
            </div>
          </div>

          {/* Statistiques */}
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <stat.icon className="h-6 w-6 text-gray-400" aria-hidden="true" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                        <dd>
                          <div className="text-lg font-medium text-gray-900">{stat.value}</div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-5 py-3">
                  <div className="text-sm">
                    <span className={`font-medium ${stat.changeType === 'increase' ? 'text-green-600' :
                        stat.changeType === 'decrease' ? 'text-red-600' : 'text-gray-500'
                      }`}>
                      {stat.change}
                    </span>{' '}
                    <span className="text-gray-500">vs hier</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Prochains RDV */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">Prochains rendez-vous</h2>
              <Link to="/medecin/agenda" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                Voir tout
              </Link>
            </div>
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {[1, 2, 3].map((appointment) => (
                  <li key={appointment} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <UserCircleIcon className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">Jean Martin</div>
                          <div className="text-sm text-gray-500">Consultation de suivi</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">10:30 - 11:00</div>
                        <div className="text-sm text-gray-500">Aujourd'hui</div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <VideoCameraIcon className="h-3 w-3 mr-1" />
                          Démarrer
                        </button>
                        <button
                          type="button"
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <DocumentTextIcon className="h-3 w-3 mr-1" />
                          Dossier
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Derniers messages */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">Derniers messages</h2>
              <Link to="/medecin/messagerie" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                Voir tout
              </Link>
            </div>
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {[1, 2].map((message) => (
                  <li key={message} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <UserCircleIcon className="h-6 w-6 text-gray-400" />
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-medium text-gray-900">Marie Dubois</h3>
                          <span className="text-xs text-gray-500">Il y a 2h</span>
                        </div>
                        <p className="text-sm text-gray-500 truncate">
                          Bonjour Docteur, je voulais vous remercier pour la consultation d'hier. Je me sens déjà mieux...
                        </p>
                      </div>
                      <div className="ml-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Nouveau
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contenu dynamique */}
          <div className="mt-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardDoctor;
