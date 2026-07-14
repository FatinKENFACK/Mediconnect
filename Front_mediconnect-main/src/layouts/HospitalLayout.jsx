import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import GlobalSearchBar from '../components/GlobalSearchBar';
import {
  HomeIcon, BuildingOfficeIcon, UserGroupIcon,
  StarIcon, CreditCardIcon, CalendarIcon, FolderIcon,
  ChatBubbleLeftRightIcon, ClockIcon, ChartBarIcon,
  VideoCameraIcon, BellIcon, MagnifyingGlassIcon,
  Bars3Icon, XMarkIcon, ChevronDownIcon,
  ArrowRightOnRectangleIcon, HeartIcon,
  QrCodeIcon,
} from '@heroicons/react/24/outline';
import api from '../services/api';

const HospitalLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  // Données réelles
  const [hospitalProfile, setHospitalProfile] = useState(null);
  const [stats, setStats] = useState({
    total_doctors: 0,
    pending_appointments: 0,
    today_appointments: 0,
  });

  const isMobile = useMediaQuery({ maxWidth: 768 });

  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  // Chargement profil hôpital + stats
  useEffect(() => {
    api.getHospitalProfile()
      .then(data => setHospitalProfile(data))
      .catch(() => { });

    api.getHospitalStats()
      .then(data => setStats(data))
      .catch(() => { });
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notificationRef.current && !notificationRef.current.contains(e.target))
        setShowNotifications(false);
      if (profileRef.current && !profileRef.current.contains(e.target))
        setShowProfile(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path + '/');

  // Nom affiché : nom de l'hôpital depuis le profil, sinon depuis user
  const hospitalName = hospitalProfile?.name || user?.first_name || 'Hôpital';
  const hospitalCity = hospitalProfile?.city || '';

  const navigation = [
    {
      name: 'Tableau de bord',
      href: '/hopital/tableau-de-bord',
      icon: HomeIcon,
      current: isActive('/hopital/tableau-de-bord'),
    },
    {
      name: 'Profil',
      href: '/hopital/profil',
      icon: BuildingOfficeIcon,
      current: isActive('/hopital/profil'),
    },
    {
      name: 'Médecins',
      href: '/hopital/medecins',
      icon: UserGroupIcon,
      current: isActive('/hopital/medecins'),
      // Badge dynamique : nombre réel de médecins
      badge: stats.total_doctors > 0 ? String(stats.total_doctors) : null,
    },
    {
      name: 'Services',
      href: '/hopital/services',
      icon: HeartIcon,
      current: isActive('/hopital/services'),
    },
    {
      name: 'Rendez-vous',
      href: '/hopital/rendez-vous',
      icon: CalendarIcon,
      current: isActive('/hopital/rendez-vous'),
      // Badge dynamique : RDV en attente
      badge: stats.pending_appointments > 0 ? String(stats.pending_appointments) : null,
    },
    {
      name: 'Vérification arrivée',        // ← nouvelle entrée
      href: '/hopital/verification-arrivee',
      icon: QrCodeIcon,
      current: isActive('/hopital/verification-arrivee'),
    },
    {
      name: 'Dossiers patients',
      href: '/hopital/dossiers-patients',
      icon: FolderIcon,
      current: isActive('/hopital/dossiers-patients'),
    },
    {
      name: 'Messagerie',
      href: '/hopital/messagerie',
      icon: ChatBubbleLeftRightIcon,
      current: isActive('/hopital/messagerie'),
    },
    {
      name: 'Avis',
      href: '/hopital/avis',
      icon: StarIcon,
      current: isActive('/hopital/avis'),
    },
    {
      name: 'Disponibilités',
      href: '/hopital/disponibilites',
      icon: ClockIcon,
      current: isActive('/hopital/disponibilites'),
    },
    {
      name: 'Consultations vidéo',
      href: '/hopital/consultations-video',
      icon: VideoCameraIcon,
      current: isActive('/hopital/consultations-video'),
    },
    {
      name: 'Statistiques',
      href: '/hopital/statistiques',
      icon: ChartBarIcon,
      current: isActive('/hopital/statistiques'),
    },
    {
      name: 'Abonnement',
      href: '/hopital/abonnement',
      icon: CreditCardIcon,
      current: isActive('/hopital/abonnement'),
    },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!collapsed && (
          <div className="flex items-center min-w-0">
            <BuildingOfficeIcon className="h-8 w-8 text-blue-600 flex-shrink-0" />
            <div className="ml-2 min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate">{hospitalName}</p>
              {hospitalCity && (
                <p className="text-xs text-gray-500 truncate">{hospitalCity}</p>
              )}
            </div>
          </div>
        )}
        {!isMobile && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded-md hover:bg-gray-100 flex-shrink-0"
          >
            <Bars3Icon className="h-5 w-5 text-gray-500" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            onClick={() => isMobile && setSidebarOpen(false)}
            className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-all duration-200 ${item.current
              ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              } ${collapsed && !isMobile ? 'justify-center' : ''}`}
          >
            <item.icon
              className={`flex-shrink-0 h-5 w-5 ${item.current ? 'text-blue-700' : 'text-gray-400 group-hover:text-gray-500'
                }`}
            />
            {!collapsed && (
              <>
                <span className="ml-3 flex-1">{item.name}</span>
                {item.badge && (
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {item.badge}
                  </span>
                )}
              </>
            )}
          </Link>
        ))}
      </nav>

      {/* Déconnexion */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={logout}
          className={`w-full flex items-center ${collapsed ? 'justify-center' : ''} px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-red-600 transition-colors`}
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5 text-gray-400" />
          {!collapsed && <span className="ml-3">Déconnexion</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Sidebar mobile */}
      {isMobile && sidebarOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-75"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative flex flex-col max-w-xs w-full bg-white z-10">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                onClick={() => setSidebarOpen(false)}
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-white"
              >
                <XMarkIcon className="h-6 w-6 text-white" />
              </button>
            </div>
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Sidebar desktop */}
      {!isMobile && (
        <div className={`fixed inset-y-0 left-0 z-40 bg-white border-r border-gray-200 transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}>
          <SidebarContent />
        </div>
      )}

      {/* Contenu principal */}
      <div className={`${!isMobile ? (collapsed ? 'ml-16' : 'ml-64') : ''} transition-all duration-300`}>

        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center flex-1">
                {isMobile && (
                  <button
                    onClick={() => setSidebarOpen(true)}
                    className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                  >
                    <Bars3Icon className="h-6 w-6" />
                  </button>
                )}
                <div className="flex-1 max-w-lg mx-4">
                  <GlobalSearchBar role="hospital" placeholder="Rechercher un médecin, un RDV..." />
                </div>
              </div>

              <div className="flex items-center space-x-4">
                {/* Notifications */}
                <div className="relative" ref={notificationRef}>
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-2 rounded-full hover:bg-gray-100 relative"
                  >
                    <BellIcon className="h-6 w-6 text-gray-600" />
                    {stats.pending_appointments > 0 && (
                      <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {stats.pending_appointments > 9 ? '9+' : stats.pending_appointments}
                      </span>
                    )}
                  </button>

                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                      <div className="p-4 border-b border-gray-200">
                        <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
                      </div>
                      <div className="p-4 text-center text-sm text-gray-500">
                        {stats.pending_appointments > 0
                          ? `${stats.pending_appointments} rendez-vous en attente de confirmation`
                          : 'Aucune notification'}
                      </div>
                      <div className="p-4 border-t border-gray-200">
                        <Link
                          to="/hopital/rendez-vous"
                          className="text-sm text-blue-600 hover:text-blue-800"
                          onClick={() => setShowNotifications(false)}
                        >
                          Voir les rendez-vous →
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                {/* Profil */}
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setShowProfile(!showProfile)}
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100"
                  >
                    <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm font-medium">
                        {hospitalName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    {!isMobile && (
                      <div className="text-left">
                        <p className="text-sm font-medium text-gray-900 truncate max-w-32">
                          {hospitalName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {hospitalProfile?.is_verified ? '✓ Vérifié' : '⏳ En attente'}
                        </p>
                      </div>
                    )}
                    <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                  </button>

                  {showProfile && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                      <div className="p-4 border-b border-gray-200">
                        <p className="text-sm font-medium text-gray-900 truncate">{hospitalName}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                      </div>
                      <div className="py-2">
                        <Link
                          to="/hopital/profil"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setShowProfile(false)}
                        >
                          Mon profil
                        </Link>
                        <button
                          onClick={logout}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          Déconnexion
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default HospitalLayout;