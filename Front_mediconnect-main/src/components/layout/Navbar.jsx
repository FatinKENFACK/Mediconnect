import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FiMenu,
  FiX,
  FiUser,
  FiLogOut,
  FiBell,
  FiMessageSquare,
} from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../common/Button';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => setIsOpen(false), [location]);

  const handleLogout = async () => {
    await logout();
    navigate('/connexion');
  };

  const navLinks = [
    { name: 'Accueil', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Tarifs', path: '/tarifs' },
    { name: 'À propos', path: '/a-propos' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <>
      {/* NAVBAR */}
      <nav
        className={`
          fixed top-0 inset-x-0 z-50 transition-all duration-300
          ${scrolled
            ? 'bg-white/70 backdrop-blur-lg shadow-sm'
            : 'bg-transparent'}
        `}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link
              to="/"
              className="text-xl font-bold text-primary-600 tracking-tight"
            >
              AssurSanté
            </Link>

            {/* Desktop nav */}
            <ul className="hidden md:flex items-center space-x-6">
              {navLinks.map((link) => {
                const active = location.pathname === link.path;
                return (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className={`
                        relative px-4 py-2 rounded-xl text-sm font-medium
                        transition-all duration-300
                        ${
                          active
                            ? 'text-primary-600'
                            : 'text-gray-600 hover:text-primary-600'
                        }
                        hover:bg-white/40 hover:backdrop-blur-md
                      `}
                    >
                      {link.name}
                      {active && (
                        <span className="absolute inset-x-3 -bottom-1 h-0.5 bg-primary-600 rounded-full" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Desktop actions */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <>
                  <Link
                    to="/notifications"
                    className="p-2 rounded-full hover:bg-white/40 backdrop-blur-md transition"
                  >
                    <FiBell className="h-5 w-5 text-gray-600" />
                  </Link>

                  <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="
                      h-9 w-9 rounded-full bg-primary-100
                      flex items-center justify-center
                      text-primary-700 font-semibold
                      ring-2 ring-transparent hover:ring-primary-300
                      transition
                    "
                  >
                    {user.displayName?.[0] || user.email[0]}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/connexion"
                    className="text-sm font-medium text-gray-600 hover:text-primary-600"
                  >
                    Se connecter
                  </Link>
                  <Link to="/inscription">
                    <Button size="sm">S’inscrire</Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile button */}
            <button
              onClick={() => setIsOpen(true)}
              className="md:hidden p-2 rounded-lg hover:bg-white/40 backdrop-blur-md transition"
            >
              <FiMenu size={22} />
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE OVERLAY */}
      <div
        className={`
          fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity
          ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}
        onClick={() => setIsOpen(false)}
      />

      {/* MOBILE MENU (SLIDE LEFT → RIGHT) */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-72
          bg-white/70 backdrop-blur-xl
          shadow-xl
          transform transition-transform duration-300 ease-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex items-center justify-between px-4 h-16">
          <span className="text-lg font-bold text-primary-600">
            Menu
          </span>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-lg hover:bg-white/40 transition"
          >
            <FiX size={22} />
          </button>
        </div>

        {/* Mobile links */}
        <div className="px-4 py-6 space-y-3">
          {navLinks.map((link) => {
            const active = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`
                  block px-4 py-3 rounded-xl text-sm font-medium
                  transition-all duration-300
                  ${
                    active
                      ? 'bg-primary-500/10 text-primary-600'
                      : 'text-gray-700 hover:bg-white/40'
                  }
                  backdrop-blur-md
                `}
              >
                {link.name}
              </Link>
            );
          })}
        </div>
      </aside>
    </>
  );
};

export default Navbar;
