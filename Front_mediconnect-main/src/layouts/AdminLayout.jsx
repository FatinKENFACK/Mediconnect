import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import GlobalSearchBar from '../components/GlobalSearchBar';
import {
  HomeIcon,
  BuildingOfficeIcon,
  CreditCardIcon,
  DocumentTextIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  ArrowRightOnRectangleIcon,
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
  UserIcon,
  BellIcon,
  Cog6ToothIcon,
  FolderIcon,
  CurrencyDollarIcon,
  ServerIcon,
  LockClosedIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  ChatBubbleLeftRightIcon,
  QuestionMarkCircleIcon,
  StarIcon,
} from '@heroicons/react/24/outline';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const notificationsRef = useRef(null);
  const profileRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const navigation = [
    {
      name: 'Tableau de bord',
      href: '/admin/tableau-de-bord',
      icon: HomeIcon,
      current: location.pathname === '/admin/tableau-de-bord'
    },
    {
      name: 'Hôpitaux',
      href: '/admin/hopitaux',
      icon: BuildingOfficeIcon,
      current: location.pathname === '/admin/hopitaux'
    },
    {
      name: 'Abonnements',
      href: '/admin/abonnements',
      icon: CreditCardIcon,
      current: location.pathname === '/admin/abonnements'
    },
    {
      name: 'Paiements',
      href: '/admin/paiements',
      icon: CurrencyDollarIcon,
      current: location.pathname === '/admin/paiements'
    },
    {
      name: 'Avis',                             
      href: '/admin/avis',
      icon: StarIcon,
      current: location.pathname === '/admin/avis'
    },
    {
      name: 'Rapports',
      href: '/admin/rapports',
      icon: ChartBarIcon,
      current: location.pathname === '/admin/rapports'
    },
    {
      name: 'Sauvegardes',
      href: '/admin/sauvegardes',
      icon: ServerIcon,
      current: location.pathname === '/admin/sauvegardes'
    },
    {
      name: 'Confidentialité',
      href: '/admin/confidentialite',
      icon: LockClosedIcon,
      current: location.pathname === '/admin/confidentialite'
    },
    {
      name: 'Paramètres',
      href: '/admin/parametres',
      icon: Cog6ToothIcon,
      current: location.pathname === '/admin/parametres'
    }
  ];

  const notifications = [
    { id: 1, title: 'Nouvel hôpital inscrit', message: 'Clinique Saint-Jean a rejoint la plateforme', time: 'Il y a 5 min', type: 'info' },
    { id: 2, title: 'Paiement reçu', message: 'Hôpital Dalal Jamm - Abonnement Professional', time: 'Il y a 1 heure', type: 'success' },
    { id: 3, title: 'Alerte système', message: 'Sauvegarde automatique échouée', time: 'Il y a 2 heures', type: 'warning' }
  ];

  // Gestion du redimensionnement de la fenêtre
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setCollapsed(false);
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fermer la sidebar sur mobile lors du changement de route
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  const toggleSidebar = () => {
    if (isMobile) {
      setSidebarOpen(!sidebarOpen);
    } else {
      setCollapsed(!collapsed);
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 flex z-40 lg:hidden">
          <div className="fixed inset-0">
            <div
              className="absolute inset-0 bg-gray-600 bg-opacity-75"
              onClick={() => setSidebarOpen(false)}
            />
          </div>
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                type="button"
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setSidebarOpen(false)}
              >
                <span className="sr-only">Fermer le menu</span>
                <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
              </button>
            </div>
            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              <div className="flex-shrink-0 flex items-center px-4">
                <h1 className="text-xl font-bold text-blue-600">Admin Panel</h1>
              </div>
              <nav className="mt-5 px-2 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${item.current
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon
                      className={`mr-3 h-6 w-6 flex-shrink-0 ${item.current ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                        }`}
                      aria-hidden="true"
                    />
                    <span className="flex-1">{item.name}</span>
                  </Link>
                ))}
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
              <div className="flex items-center">
                <div>
                  <UserCircleIcon className="h-10 w-10 text-gray-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700">Admin</p>
                  <button
                    type="button"
                    className="text-xs font-medium text-gray-500 hover:text-gray-700"
                    onClick={() => {
                      navigate('/admin/parametres');
                      setSidebarOpen(false);
                    }}
                  >
                    Voir le profil
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-shrink-0 w-14">
            {/* Force sidebar to shrink to fit close icon */}
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className={`hidden lg:flex lg:flex-shrink-0 transition-all duration-300 ease-in-out ${collapsed ? 'w-20' : 'w-64'
        }`}>
        <div className="flex flex-col w-full border-r border-gray-200 bg-white">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center justify-between px-4">
              {!collapsed && (
                <h1 className="text-xl font-bold text-blue-600">Admin Panel</h1>
              )}
              <button
                onClick={toggleSidebar}
                className="p-1 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <span className="sr-only">Réduire le menu</span>
                {collapsed ? (
                  <ChevronRightIcon className="h-6 w-6" />
                ) : (
                  <ChevronLeftIcon className="h-6 w-6" />
                )}
              </button>
            </div>
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${item.current
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                >
                  <item.icon
                    className={`mr-3 h-6 w-6 flex-shrink-0 ${item.current ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                      }`}
                    aria-hidden="true"
                  />
                  {!collapsed && (
                    <span className="flex-1">{item.name}</span>
                  )}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <div className="flex items-center w-full">
              <div>
                <UserCircleIcon className="h-10 w-10 text-gray-400" aria-hidden="true" />
              </div>
              {!collapsed && (
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700 truncate">Admin</p>
                  <button
                    type="button"
                    className="text-xs font-medium text-gray-500 hover:text-gray-700"
                    onClick={() => navigate('/admin/parametres')}
                  >
                    Voir le profil
                  </button>
                </div>
              )}
              <button
                type="button"
                className={`ml-auto flex-shrink-0 p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${collapsed ? 'mx-auto' : ''
                  }`}
                onClick={handleLogout}
                title="Déconnexion"
              >
                <ArrowRightOnRectangleIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow">
          <button
            type="button"
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Ouvrir le menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>

          {/* Bouton de bascule pour la version desktop */}
          <button
            type="button"
            className="hidden md:block px-4 border-r border-gray-200 text-gray-500 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            onClick={() => setCollapsed(!collapsed)}
          >
            <span className="sr-only">Réduire/Étendre le menu</span>
            {collapsed ? (
              <ChevronRightIcon className="h-6 w-6" />
            ) : (
              <ChevronLeftIcon className="h-6 w-6" />
            )}
          </button>

          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex">
              <div className="w-full flex md:ml-0">
                <GlobalSearchBar role="admin" placeholder="Rechercher hôpitaux, médecins, patients..." />
              </div>
            </div>

            <div className="ml-4 flex items-center md:ml-6 space-x-3">
              {/* <Link
                to="/admin/messages"
                className="p-1.5 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 relative"
                title="Messages"
              >
                <span className="sr-only">Voir les messages</span>
                <ChatBubbleLeftRightIcon className="h-6 w-6" />
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
                  3
                </span>
              </Link> */}

              <div className="relative" ref={notificationsRef}>
                <button
                  type="button"
                  onClick={() => {
                    setShowNotifications(!showNotifications);
                    setShowProfile(false);
                  }}
                  className="p-1.5 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 relative"
                  title="Notifications"
                >
                  <span className="sr-only">Voir les notifications</span>
                  <BellIcon className="h-6 w-6" aria-hidden="true" />
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
                    {notifications.length}
                  </span>
                </button>

                {/* Dropdown Notifications */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-10 ring-1 ring-black ring-opacity-5">
                    <div className="p-4 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
                        <button
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          Tout marquer comme lu
                        </button>
                      </div>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length > 0 ? (
                        <div className="divide-y divide-gray-100">
                          {notifications.map((notification) => (
                            <div
                              key={notification.id}
                              className="p-4 hover:bg-gray-50 cursor-pointer"
                              onClick={() => {
                                setShowNotifications(false);
                              }}
                            >
                              <div className="flex">
                                <div className={`flex-shrink-0 h-10 w-10 rounded-full ${notification.type === 'success' ? 'bg-green-100' :
                                  notification.type === 'warning' ? 'bg-yellow-100' : 'bg-blue-100'
                                  } flex items-center justify-center`}>
                                  <BellIcon className={`h-5 w-5 ${notification.type === 'success' ? 'text-green-600' :
                                    notification.type === 'warning' ? 'text-yellow-600' : 'text-blue-600'
                                    }`} aria-hidden="true" />
                                </div>
                                <div className="ml-3 flex-1">
                                  <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                                  <p className="text-sm text-gray-500">{notification.message}</p>
                                  <div className="mt-1 text-xs text-gray-500">{notification.time}</div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 text-center text-gray-500">
                          Aucune notification
                        </div>
                      )}
                    </div>
                    <div className="bg-gray-50 px-4 py-3 text-center border-t border-gray-200">
                      <button
                        className="text-sm font-medium text-blue-600 hover:text-blue-800"
                        onClick={() => {
                          setShowNotifications(false);
                        }}
                      >
                        Voir toutes les notifications
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Menu Profil */}
              <div className="relative ml-3" ref={profileRef}>
                <div>
                  <button
                    type="button"
                    className="flex items-center max-w-xs rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    id="user-menu"
                    aria-expanded="false"
                    aria-haspopup="true"
                    onClick={() => {
                      setShowProfile(!showProfile);
                      setShowNotifications(false);
                    }}
                  >
                    <span className="sr-only">Ouvrir le menu utilisateur</span>
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <UserIcon className="h-5 w-5 text-gray-600" />
                    </div>
                    <ChevronDownIcon
                      className={`ml-1 h-4 w-4 text-gray-500 transition-transform duration-200 ${showProfile ? 'transform rotate-180' : ''}`}
                      aria-hidden="true"
                    />
                  </button>
                </div>

                {/* Dropdown Profil */}
                {showProfile && (
                  <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                    <div className="py-1" role="none">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{user?.first_name} {user?.last_name}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                      </div>
                      <Link
                        to="/admin/parametres"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowProfile(false)}
                      >
                        <UserIcon className="mr-3 h-5 w-5 text-gray-400" />
                        Mon profil
                      </Link>
                      <Link
                        to="/admin/aide"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowProfile(false)}
                      >
                        <QuestionMarkCircleIcon className="mr-3 h-5 w-5 text-gray-400" />
                        Aide & Support
                      </Link>
                      <div className="border-t border-gray-100 my-1"></div>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <ArrowLeftOnRectangleIcon className="mr-3 h-5 w-5 text-red-500" />
                        Déconnexion
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <main className="flex-1 relative overflow-y-auto focus:outline-none bg-gray-50">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;