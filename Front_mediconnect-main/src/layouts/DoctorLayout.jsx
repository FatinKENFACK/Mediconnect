import React, { useState, useEffect, useRef, Fragment } from 'react';
import { useAuth } from '../contexts/AuthContext';
import GlobalSearchBar from '../components/GlobalSearchBar';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import {
  HomeIcon,
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
  ClipboardDocumentCheckIcon,
  ChartPieIcon,
  ClockIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  QuestionMarkCircleIcon,
  EnvelopeIcon,
  XMarkIcon,
  UserIcon,
  StarIcon,
  UserPlusIcon,
  Bars3Icon,
  EllipsisVerticalIcon,
  ArrowPathIcon,
  BuildingOfficeIcon,
  CreditCardIcon,
  MapPinIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

const DoctorLayout = () => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const notificationsRef = useRef(null);
  const profileRef = useRef(null);
  const [collapsed, setCollapsed] = useState(false);
  const [openSubmenus, setOpenSubmenus] = useState({});
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  // Données factices pour les notifications
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Nouvelle demande de consultation',
      message: 'M. Martin souhaite prendre rendez-vous',
      time: 'Il y a 5 minutes',
      read: false,
      icon: CalendarIcon,
      iconColor: 'text-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      id: 2,
      title: 'Message non lu',
      message: 'Vous avez un nouveau message du patient Dupont',
      time: 'Il y a 1 heure',
      read: true,
      icon: ChatBubbleLeftRightIcon,
      iconColor: 'text-green-500',
      bgColor: 'bg-green-50'
    },
    {
      id: 3,
      title: 'Document signé',
      message: 'Le patient Martin a signé son consentement',
      time: 'Il y a 1 jour',
      read: true,
      icon: DocumentTextIcon,
      iconColor: 'text-purple-500',
      bgColor: 'bg-purple-50'
    }
  ]);

  // Fermer les menus déroulants quand on clique à l'extérieur
  useEffect(() => {
    function handleClickOutside(event) {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id) => {
    setNotifications(notifications.map(notification =>
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({
      ...notification,
      read: true
    })));
  };

  // Fermer la sidebar sur mobile lors du changement de route
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  // Gestion du redimensionnement de la fenêtre
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCollapsed(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) {
      setSidebarOpen(!sidebarOpen);
    } else {
      setCollapsed(!collapsed);
    }
  };

  const toggleSubmenu = (menuName) => {
    setOpenSubmenus(prev => ({
      ...prev,
      [menuName]: !prev[menuName]
    }));
  };

  const navigation = [
    {
      name: 'Tableau de bord',
      href: '/medecin',
      icon: HomeIcon,
      exact: true
    },
    {
      name: 'Mon profil',
      href: '/medecin/profil',
      icon: UserCircleIcon,
      exact: true
    },
    {
      name: 'Disponibilités',
      href: '/medecin/disponibilites',
      icon: ClockIcon,
      exact: true
    },
    {
      name: 'Agenda',
      href: '/medecin/agenda',
      icon: CalendarIcon,
      exact: true
    },
    {
      name: 'Rendez-vous',
      href: '/medecin/rendez-vous',
      icon: CalendarIcon,
      exact: true
    },
    {
      name: 'Consultations',
      href: '/medecin/consultations',
      icon: VideoCameraIcon,
      subItems: [
        { name: 'Liste des consultations', href: '/medecin/consultations', icon: VideoCameraIcon },
        { name: 'Nouvelle consultation', href: '/medecin/consultations/nouvelle', icon: PlusIcon }
      ]
    },
    {
      name: 'Patients',
      href: '/medecin/dossiers',
      icon: UserGroupIcon,
      subItems: [
        { name: 'Dossiers patients', href: '/medecin/dossiers', icon: FolderIcon },
        { name: 'Créer patient', href: '/medecin/creer-patient', icon: UserPlusIcon }
      ]
    },

    {
      name: 'Prescriptions',
      href: '/medecin/prescriptions',
      icon: ClipboardDocumentCheckIcon,
      subItems: [
        { name: 'Liste des prescriptions', href: '/medecin/prescriptions', icon: DocumentTextIcon },
        { name: 'Nouvelle ordonnance', href: '/medecin/prescriptions/nouvelle', icon: PlusIcon }
      ]
    },
    {
      name: 'Comptes-rendus',                     // ← nouvelle entrée
      href: '/medecin/comptes-rendus',
      icon: DocumentTextIcon,
      subItems: [
        { name: 'Liste des comptes-rendus', href: '/medecin/comptes-rendus', icon: DocumentTextIcon },
        { name: 'Nouveau compte-rendu', href: '/medecin/comptes-rendus/nouveau', icon: PlusIcon }
      ]
    },
    {
      name: 'Avis patients',
      href: '/medecin/avis',
      icon: StarIcon,
      //badge: 3
    },
    {
      name: 'Messagerie',
      href: '/medecin/messagerie',
      icon: ChatBubbleLeftRightIcon,
      //badge: 5
    },
    {
      name: 'Historique',
      href: '/medecin/historique',
      icon: ChartBarIcon
    },
    {
      name: 'Statistiques',
      href: '/medecin/statistiques',
      icon: ChartPieIcon
    },
    {
      name: 'Paramètres',
      href: '/medecin/parametres',
      icon: Cog6ToothIcon
    }
  ];

  const isActive = (href, exact = false) => {
    if (exact) {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  const renderNavItem = (item) => {
    const hasSubItems = item.subItems && item.subItems.length > 0;
    const isItemActive = isActive(item.href, item.exact) ||
      (hasSubItems && item.subItems.some(subItem => isActive(subItem.href)));

    return (
      <li key={item.name}>
        {hasSubItems ? (
          <>
            <button
              onClick={() => toggleSubmenu(item.name)}
              className={`group flex items-center w-full px-2 py-2 text-sm font-medium rounded-md transition-colors ${isItemActive
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
            >
              <item.icon
                className={`mr-3 h-6 w-6 flex-shrink-0 transition-colors ${isItemActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                  }`}
                aria-hidden="true"
              />
              {!collapsed && (
                <>
                  <span className="flex-1 text-left">{item.name}</span>
                  {item.badge && (
                    <span className="ml-3 inline-block py-0.5 px-2.5 text-xs leading-4 rounded-full bg-blue-100 text-blue-800">
                      {item.badge}
                    </span>
                  )}
                  {openSubmenus[item.name] ? (
                    <ChevronDownIcon className="ml-2 h-4 w-4 text-gray-600" />
                  ) : (
                    <ChevronRightIcon className="ml-2 h-4 w-4" />
                  )}
                </>
              )}
            </button>

            {(!collapsed || isMobile) && (openSubmenus[item.name] || isItemActive) && (
              <ul className="mt-1 space-y-1 pl-4">
                {item.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      to={subItem.href}
                      className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${isActive(subItem.href, true)
                        ? 'bg-gray-100 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                    >
                      <subItem.icon
                        className={`mr-3 h-5 w-5 transition-colors ${isActive(subItem.href, true) ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                          }`}
                        aria-hidden="true"
                      />
                      {!collapsed && (
                        <span className="flex-1">{subItem.name}</span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </>
        ) : (
          <Link
            to={item.href}
            className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${isActive(item.href, item.exact)
              ? 'bg-blue-50 text-blue-600'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
          >
            <item.icon
              className={`mr-3 h-6 w-6 flex-shrink-0 transition-colors ${isActive(item.href, item.exact) ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                }`}
              aria-hidden="true"
            />
            {!collapsed && (
              <>
                <span className="flex-1">{item.name}</span>
                {item.badge && (
                  <span className="ml-auto inline-block py-0.5 px-2.5 text-xs leading-4 rounded-full bg-blue-100 text-blue-800">
                    {item.badge}
                  </span>
                )}
              </>
            )}
          </Link>
        )}
      </li>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 flex z-40 md:hidden">
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
                <h1 className="text-xl font-bold text-blue-600">MediconNet</h1>
              </div>
              <nav className="mt-5 px-2 space-y-1">
                {navigation.map(renderNavItem)}
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
              <div className="flex items-center">
                <div>
                  <UserCircleIcon className="h-10 w-10 text-gray-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700">Dr. {user?.first_name} {user?.last_name}</p>
                  <button
                    type="button"
                    className="text-xs font-medium text-gray-500 hover:text-gray-700"
                    onClick={() => {
                      navigate('/medecin/profil');
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
      <div className={`hidden md:flex md:flex-shrink-0 transition-all duration-300 ease-in-out ${collapsed ? 'w-20' : 'w-64'
        }`}>
        <div className="flex flex-col w-full border-r border-gray-200 bg-white">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center justify-between px-4">
              {!collapsed && (
                <h1 className="text-xl font-bold text-blue-600">MediconNet</h1>
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
              {navigation.map(renderNavItem)}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <div className="flex items-center w-full">
              <div>
                <UserCircleIcon className="h-10 w-10 text-gray-400" aria-hidden="true" />
              </div>
              {!collapsed && (
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700 truncate">Dr. {user?.first_name} {user?.last_name}</p>
                  <button
                    type="button"
                    className="text-xs font-medium text-gray-500 hover:text-gray-700"
                    onClick={() => navigate('/medecin/profil')}
                  >
                    Voir le profil
                  </button>
                </div>
              )}
              <button
                type="button"
                className={`ml-auto flex-shrink-0 p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${collapsed ? 'mx-auto' : ''
                  }`}
                onClick={() => logout()}
                title="Déconnexion"
              >
                <ArrowLeftOnRectangleIcon className="h-6 w-6" aria-hidden="true" />
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
                <GlobalSearchBar role="doctor" placeholder="Rechercher un patient, un RDV..." />
              </div>
            </div>

            <div className="ml-4 flex items-center md:ml-6 space-x-3">
              <Link
                to="/medecin/messagerie"
                className="p-1.5 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 relative"
                title="Messages"
              >
                <span className="sr-only">Voir les messages</span>
                <ChatBubbleLeftRightIcon className="h-6 w-6" aria-hidden="true" />
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
                  5
                </span>
              </Link>

              <div className="relative" ref={notificationsRef}>
                <button
                  type="button"
                  onClick={() => {
                    setNotificationsOpen(!notificationsOpen);
                    setProfileOpen(false);
                  }}
                  className="p-1.5 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 relative"
                  title="Notifications"
                >
                  <span className="sr-only">Voir les notifications</span>
                  <BellIcon className="h-6 w-6" aria-hidden="true" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Dropdown Notifications */}
                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-10 ring-1 ring-black ring-opacity-5">
                    <div className="p-4 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
                        <button
                          onClick={markAllAsRead}
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
                              className={`p-4 hover:bg-gray-50 cursor-pointer ${!notification.read ? 'bg-blue-50' : ''}`}
                              onClick={() => {
                                markAsRead(notification.id);
                                // Rediriger vers la page appropriée selon la notification
                                if (notification.title.includes('demande')) {
                                  navigate('/medecin/rendez-vous');
                                } else if (notification.title.includes('message')) {
                                  navigate('/medecin/messagerie');
                                } else if (notification.title.includes('Document')) {
                                  navigate('/medecin/prescriptions');
                                }
                                setNotificationsOpen(false);
                              }}
                            >
                              <div className="flex">
                                <div className={`flex-shrink-0 h-10 w-10 rounded-full ${notification.bgColor} flex items-center justify-center`}>
                                  <notification.icon className={`h-5 w-5 ${notification.iconColor}`} aria-hidden="true" />
                                </div>
                                <div className="ml-3 flex-1">
                                  <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                                  <p className="text-sm text-gray-500">{notification.message}</p>
                                  <div className="mt-1 text-xs text-gray-500">{notification.time}</div>
                                </div>
                                {!notification.read && (
                                  <div className="flex-shrink-0 ml-4">
                                    <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                                  </div>
                                )}
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
                      <a
                        href="#"
                        className="text-sm font-medium text-blue-600 hover:text-blue-800"
                        onClick={(e) => {
                          e.preventDefault();
                          navigate('/medecin/rendez-vous');
                          setNotificationsOpen(false);
                        }}
                      >
                        Voir toutes les notifications
                      </a>
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
                      setProfileOpen(!profileOpen);
                      setNotificationsOpen(false);
                    }}
                  >
                    <span className="sr-only">Ouvrir le menu utilisateur</span>
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <UserIcon className="h-5 w-5 text-gray-600" />
                    </div>
                    <ChevronDownIcon
                      className={`ml-1 h-4 w-4 text-gray-500 transition-transform duration-200 ${profileOpen ? 'transform rotate-180' : ''}`}
                      aria-hidden="true"
                    />
                  </button>
                </div>

                {/* Dropdown Profil */}
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                    <div className="py-1" role="none">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">Dr. {user?.first_name} {user?.last_name}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                      </div>
                      <Link
                        to="/medecin/profil"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setProfileOpen(false)}
                      >
                        <UserIcon className="mr-3 h-5 w-5 text-gray-400" />
                        Mon profil
                      </Link>
                      <Link
                        to="/medecin/parametres"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setProfileOpen(false)}
                      >
                        <Cog6ToothIcon className="mr-3 h-5 w-5 text-gray-400" />
                        Paramètres
                      </Link>
                      <div className="border-t border-gray-100 my-1"></div>
                      <button
                        onClick={() => logout()}
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

export default DoctorLayout;
