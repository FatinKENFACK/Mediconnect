import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MagnifyingGlassIcon, UserIcon, UserGroupIcon,
  BuildingOfficeIcon, CalendarIcon, DocumentTextIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import api from '../services/api';

// ============================================================
// CONFIG : icône + couleur par type de résultat
// ============================================================
const TYPE_CONFIG = {
  doctor:       { icon: UserGroupIcon,    label: 'Médecin',      color: 'text-blue-600 bg-blue-50' },
  patient:      { icon: UserIcon,         label: 'Patient',      color: 'text-teal-600 bg-teal-50' },
  hospital:     { icon: BuildingOfficeIcon, label: 'Hôpital',    color: 'text-purple-600 bg-purple-50' },
  appointment:  { icon: CalendarIcon,     label: 'Rendez-vous',  color: 'text-orange-600 bg-orange-50' },
  prescription: { icon: DocumentTextIcon, label: 'Prescription', color: 'text-indigo-600 bg-indigo-50' },
};

// ============================================================
// COMPOSANT : GlobalSearchBar
// Props:
//   - role: 'patient' | 'doctor' | 'hospital' | 'admin'
//   - placeholder: texte personnalisé (optionnel)
// ============================================================
const GlobalSearchBar = ({ role, placeholder }) => {
  const [query, setQuery]       = useState('');
  const [results, setResults]   = useState([]);
  const [loading, setLoading]   = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [error, setError]       = useState(null);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  // ---- Fermer dropdown au clic extérieur ----
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ---- Fonction de recherche selon le rôle ----
  const searchByRole = async (q) => {
    const fns = {
      patient:  api.searchPatient,
      doctor:   api.searchDoctor,
      hospital: api.searchHospital,
      admin:    api.searchAdmin,
    };
    const fn = fns[role];
    if (!fn) throw new Error('Rôle de recherche invalide.');
    return await fn(q);
  };

  // ---- Lancer la recherche (sur Entrée ou clic) ----
  const handleSearch = async () => {
    const q = query.trim();
    if (q.length < 2) {
      setError('Tapez au moins 2 caractères.');
      setShowDropdown(true);
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await searchByRole(q);
      setResults(data.results || []);
      setShowDropdown(true);
    } catch (err) {
      setError('Erreur lors de la recherche.');
      setResults([]);
      setShowDropdown(true);
    } finally {
      setLoading(false);
    }
  };

  // ---- Touche Entrée ----
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
    if (e.key === 'Escape') {
      setShowDropdown(false);
    }
  };

  // ---- Clic sur un résultat ----
  const handleResultClick = (result) => {
    navigate(result.link);
    setShowDropdown(false);
    setQuery('');
    setResults([]);
  };

  // ---- Effacer ----
  const handleClear = () => {
    setQuery('');
    setResults([]);
    setShowDropdown(false);
    setError(null);
  };

  // ---- Regrouper les résultats par type ----
  const groupedResults = results.reduce((acc, r) => {
    if (!acc[r.type]) acc[r.type] = [];
    acc[r.type].push(r);
    return acc;
  }, {});

  return (
    <div ref={containerRef} className="relative w-full max-w-lg">
      {/* Input de recherche */}
      <div className="relative flex items-center">
        <MagnifyingGlassIcon className="absolute left-3 h-5 w-5 text-gray-400 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => results.length > 0 && setShowDropdown(true)}
          placeholder={placeholder || 'Rechercher...'}
          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Dropdown résultats */}
      {showDropdown && (
        <div className="absolute mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-y-auto">

          {/* Chargement */}
          {loading && (
            <div className="p-6 flex justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            </div>
          )}

          {/* Erreur */}
          {!loading && error && (
            <div className="p-4 text-sm text-red-600">{error}</div>
          )}

          {/* Aucun résultat */}
          {!loading && !error && results.length === 0 && (
            <div className="p-6 text-center">
              <MagnifyingGlassIcon className="mx-auto h-8 w-8 text-gray-300 mb-2" />
              <p className="text-sm text-gray-500">Aucun résultat pour "{query}"</p>
            </div>
          )}

          {/* Résultats groupés par type */}
          {!loading && !error && results.length > 0 && (
            <div className="py-2">
              {Object.entries(groupedResults).map(([type, items]) => {
                const config = TYPE_CONFIG[type] || TYPE_CONFIG.patient;
                const Icon   = config.icon;
                return (
                  <div key={type} className="mb-1">
                    <p className="px-4 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                      {config.label}{items.length > 1 ? 's' : ''}
                    </p>
                    {items.map(item => (
                      <button
                        key={`${item.type}-${item.id}`}
                        onClick={() => handleResultClick(item)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left"
                      >
                        <div className={`p-2 rounded-lg flex-shrink-0 ${config.color}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
                          <p className="text-xs text-gray-500 truncate">{item.subtitle}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GlobalSearchBar;