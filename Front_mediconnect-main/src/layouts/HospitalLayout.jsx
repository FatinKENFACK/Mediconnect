import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import {
  HomeIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  ClipboardDocumentListIcon,
  StarIcon,
  CreditCardIcon,
  CalendarIcon,
  FolderIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  ChartBarIcon,
  VideoCameraIcon,
  UserCircleIcon,
  BellIcon,
  MagnifyingGlassIcon,
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  HeartIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { BellIcon as BellSolid } from '@heroicons/react/24/solid';

const HospitalLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [openSubmenus, setOpenSubmenus] = useState({});
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  const isMobile = useMediaQuery({ maxWidth: 768 });

  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleSubmenu = (menuName) => {
    setOpenSubmenus(prev => ({
      ...prev,
      [menuName]: !prev[menuName]
    }));
  };

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const notifications = [
    { id: 1, message: 'Nouveau rendez-vous pour Dr. Martin', time: 'Il y a 5 min', read: false },
    { id: 2, message: 'Avis laissé par Patient Jean Dupont', time: 'Il y a 1h', read: false },
    { id: 3, message: 'Mise à jour de l\'abonnement requise', time: 'Il y a 2h', read: true },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  const navigation = [
    {
      name: 'Tableau de bord',
      href: '/hopital/tableau-de-bord',
      icon: HomeIcon,
      current: isActive('/hopital/tableau-de-bord')
    },
    {
      name: 'Profil',
      href: '/hopital/profil',
      icon: BuildingOfficeIcon,
      current: isActive('/hopital/profil')
    },
    {
      name: 'Médecins',
      href: '/hopital/medecins',
      icon: UserGroupIcon,
      current: isActive('/hopital/medecins'),
      badge: '12'
    },
    {
      name: 'Services',
      href: '/hopital/services',
      icon: HeartIcon,
      current: isActive('/hopital/services')
    },
    {
      name: 'Rendez-vous',
      href: '/hopital/rendez-vous',
      icon: CalendarIcon,
      current: isActive('/hopital/rendez-vous'),
      badge: '8'
    },
    {
      name: 'Dossiers patients',
      href: '/hopital/dossiers-patients',
      icon: FolderIcon,
      current: isActive('/hopital/dossiers-patients')
    },
    {
      name: 'Messagerie',
      href: '/hopital/messagerie',
      icon: ChatBubbleLeftRightIcon,
      current: isActive('/hopital/messagerie'),
      badge: '3'
    },
    {
      name: 'Avis',
      href: '/hopital/avis',
      icon: StarIcon,
      current: isActive('/hopital/avis'),
      badge: '5'
    },
    {
      name: 'Disponibilités',
      href: '/hopital/disponibilites',
      icon: ClockIcon,
      current: isActive('/hopital/disponibilites')
    },
    {
      name: 'Consultations vidéo',
      href: '/hopital/consultations-video',
      icon: VideoCameraIcon,
      current: isActive('/hopital/consultations-video')
    },
    {
      name: 'Statistiques',
      href: '/hopital/statistiques',
      icon: ChartBarIcon,
      current: isActive('/hopital/statistiques')
    },
    {
      name: 'Abonnement',
      href: '/hopital/abonnement',
      icon: CreditCardIcon,
      current: isActive('/hopital/abonnement')
    },
  ];

  const renderNavItem = (item) => {
    const hasSubmenu = item.submenu && item.submenu.length > 0;
    const isSubmenuOpen = openSubmenus[item.name];

    return (
      <div key={item.name}>
        <Link
          to={item.href}
          className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-all duration-200 ${item.current
            ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            } ${collapsed && !isMobile ? 'justify-center' : ''}`}
          onClick={() => {
            if (hasSubmenu) {
              toggleSubmenu(item.name);
            }
            if (isMobile) {
              setSidebarOpen(false);
            }
          }}
        >
          <item.icon
            className={`flex-shrink-0 ${collapsed && !isMobile ? 'h-6 w-6' : 'h-5 w-5'} ${item.current ? 'text-blue-700' : 'text-gray-400 group-hover:text-gray-500'
              }`}
          />
          {!collapsed && (
            <>
              <span className="ml-3 flex-1">{item.name}</span>
              {item.badge && (
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {item.badge}
                </span>
              )}
              {hasSubmenu && (
                isSubmenuOpen ? (
                  <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                ) : (
                  <ChevronRightIcon className="h-4 w-4 text-gray-400" />
                )
              )}
            </>
          )}
        </Link>

        {hasSubmenu && isSubmenuOpen && !collapsed && (
          <div className="ml-8 mt-1 space-y-1">
            {item.submenu.map((subItem) => (
              <Link
                key={subItem.name}
                to={subItem.href}
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-all duration-200 ${subItem.current
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                onClick={() => isMobile && setSidebarOpen(false)}
              >
                <subItem.icon className="h-4 w-4 mr-3 text-gray-400 group-hover:text-gray-500" />
                {subItem.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar pour mobile */}
      {isMobile && sidebarOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                type="button"
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setSidebarOpen(false)}
              >
                <XMarkIcon className="h-6 w-6 text-white" />
              </button>
            </div>
            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              <div className="flex-shrink-0 flex items-center px-4">
                <BuildingOfficeIcon className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">Hôpital+</span>
              </div>
              <nav className="mt-8 px-2 space-y-1">
                {navigation.map((item) => renderNavItem(item))}
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar desktop */}
      {!isMobile && (
        <div className={`fixed inset-y-0 left-0 z-40 bg-white border-r border-gray-200 transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'
          }`}>
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              {!collapsed && (
                <div className="flex items-center">
                  <BuildingOfficeIcon className="h-8 w-8 text-blue-600" />
                  <span className="ml-2 text-xl font-bold text-gray-900">Hôpital+</span>
                </div>
              )}
              <button
                onClick={() => setCollapsed(!collapsed)}
                className="p-1 rounded-md hover:bg-gray-100 transition-colors"
              >
                <Bars3Icon className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
              {navigation.map((item) => renderNavItem(item))}
            </nav>

            <div className="p-4 border-t border-gray-200">
              <button
                onClick={handleLogout}
                className={`w-full flex items-center ${collapsed ? 'justify-center' : ''} px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900 transition-colors`}
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5 text-gray-400" />
                {!collapsed && <span className="ml-3">Déconnexion</span>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className={`${!isMobile ? (collapsed ? 'ml-16' : 'ml-64') : ''} transition-all duration-300`}>
        {/* Top navigation */}
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
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Rechercher..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
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
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                      <div className="p-4 border-b border-gray-200">
                        <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-4 hover:bg-gray-50 border-b border-gray-100 ${!notification.read ? 'bg-blue-50' : ''
                              }`}
                          >
                            <p className="text-sm text-gray-900">{notification.message}</p>
                            <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                          </div>
                        ))}
                      </div>
                      <div className="p-4 border-t border-gray-200">
                        <button className="text-sm text-blue-600 hover:text-blue-800">
                          Tout marquer comme lu
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile dropdown */}
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setShowProfile(!showProfile)}
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100"
                  >
                    <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {user?.first_name?.charAt(0) || 'H'}
                      </span>
                    </div>
                    {!isMobile && (
                      <div className="text-left">
                        <p className="text-sm font-medium text-gray-900">{user?.first_name || 'Hôpital'}</p>
                        <p className="text-xs text-gray-500">Administrateur</p>
                      </div>
                    )}
                    <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                  </button>

                  {showProfile && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                      <div className="p-4 border-b border-gray-200">
                        <p className="text-sm font-medium text-gray-900">{user?.first_name}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>
                      <div className="py-2">
                        <Link
                          to="/hopital/profil"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setShowProfile(false)}
                        >
                          Mon profil
                        </Link>
                        <Link
                          to="/hopital/parametres"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setShowProfile(false)}
                        >
                          Paramètres
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
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

        {/* Page content */}
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default HospitalLayout;
