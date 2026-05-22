import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  UserGroupIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  EnvelopeIcon,
  PhoneIcon,
  AcademicCapIcon,
  StarIcon,
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  UserCircleIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';

const HospitalDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSpecialty, setFilterSpecialty] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Simuler le chargement des données
    const mockDoctors = [
      {
        id: 1,
        name: 'Dr. Martin Laurent',
        email: 'martin.laurent@clinique.com',
        phone: '+221 77 123 45 67',
        specialty: 'Cardiologie',
        subSpecialty: 'Cardiologie interventionnelle',
        experience: 15,
        rating: 4.8,
        consultationCount: 1247,
        status: 'active',
        joinDate: '2020-03-15',
        availability: {
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: false,
          sunday: false
        },
        consultationFee: 25000,
        languages: ['Français', 'Anglais'],
        education: [
          'Université de Dakar - Doctorat en Médecine',
          'Hôpital Pitié-Salpêtrière - Spécialisation en Cardiologie'
        ],
        certifications: [
          'Certification ESC en Cardiologie',
          'ACLS Certified'
        ]
      },
      {
        id: 2,
        name: 'Dr. Sophie Bernard',
        email: 'sophie.bernard@clinique.com',
        phone: '+221 77 234 56 78',
        specialty: 'Pédiatrie',
        subSpecialty: 'Néonatalogie',
        experience: 12,
        rating: 4.9,
        consultationCount: 892,
        status: 'active',
        joinDate: '2021-06-20',
        availability: {
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: true,
          sunday: false
        },
        consultationFee: 20000,
        languages: ['Français', 'Anglais', 'Wolof'],
        education: [
          'Université Cheikh Anta Diop - Doctorat en Médecine',
          'Hôpital Necker - Spécialisation en Pédiatrie'
        ],
        certifications: [
          'Certification Française de Pédiatrie',
          'NRP Certified'
        ]
      },
      {
        id: 3,
        name: 'Dr. Pierre Dubois',
        email: 'pierre.dubois@clinique.com',
        phone: '+221 77 345 67 89',
        specialty: 'Radiologie',
        subSpecialty: 'Imagerie médicale',
        experience: 8,
        rating: 4.6,
        consultationCount: 456,
        status: 'inactive',
        joinDate: '2022-01-10',
        availability: {
          monday: false,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: false,
          sunday: false
        },
        consultationFee: 15000,
        languages: ['Français'],
        education: [
          'Université de Bordeaux - Doctorat en Médecine',
          'Hôpital Cochin - Spécialisation en Radiologie'
        ],
        certifications: [
          'Certification Européenne de Radiologie'
        ]
      },
      {
        id: 4,
        name: 'Dr. Marie Lefebvre',
        email: 'marie.lefebvre@clinique.com',
        phone: '+221 77 456 78 90',
        specialty: 'Gynécologie',
        subSpecialty: 'Obstétrique',
        experience: 18,
        rating: 4.7,
        consultationCount: 1567,
        status: 'active',
        joinDate: '2019-09-12',
        availability: {
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: false,
          sunday: false
        },
        consultationFee: 22000,
        languages: ['Français', 'Anglais'],
        education: [
          'Université de Lyon - Doctorat en Médecine',
          'Hôpital Saint-Antoine - Spécialisation en Gynécologie'
        ],
        certifications: [
          'Certification Française de Gynécologie',
          'BLS Certified'
        ]
      }
    ];
    setDoctors(mockDoctors);
  }, []);

  const specialties = ['Toutes', 'Cardiologie', 'Pédiatrie', 'Radiologie', 'Gynécologie', 'Chirurgie', 'Médecine interne', 'Dermatologie'];

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doctor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || doctor.status === filterStatus;
    const matchesSpecialty = filterSpecialty === 'all' || doctor.specialty === filterSpecialty;
    
    return matchesSearch && matchesStatus && matchesSpecialty;
  });

  const handleDeleteDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setIsLoading(true);
    setTimeout(() => {
      setDoctors(prev => prev.filter(d => d.id !== selectedDoctor.id));
      setIsLoading(false);
      setShowDeleteModal(false);
      setSelectedDoctor(null);
    }, 1500);
  };

  const toggleDoctorStatus = (doctorId) => {
    setDoctors(prev => prev.map(doctor => 
      doctor.id === doctorId 
        ? { ...doctor, status: doctor.status === 'active' ? 'inactive' : 'active' }
        : doctor
    ));
  };

  const stats = {
    total: doctors.length,
    active: doctors.filter(d => d.status === 'active').length,
    inactive: doctors.filter(d => d.status === 'inactive').length,
    totalConsultations: doctors.reduce((sum, d) => sum + d.consultationCount, 0)
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Médecins</h1>
            <p className="text-gray-600 mt-2">Gérez les médecins de votre établissement</p>
          </div>
          <Link
            to="/hopital/ajouter-medecin"
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Ajouter un médecin
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-blue-500 p-3 rounded-lg">
              <UserGroupIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total médecins</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-green-500 p-3 rounded-lg">
              <CheckCircleIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Médecins actifs</p>
              <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-yellow-500 p-3 rounded-lg">
              <XCircleIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Médecins inactifs</p>
              <p className="text-2xl font-bold text-gray-900">{stats.inactive}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-purple-500 p-3 rounded-lg">
              <CalendarIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total consultations</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalConsultations.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher un médecin..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tous les statuts</option>
            <option value="active">Actifs</option>
            <option value="inactive">Inactifs</option>
          </select>
          <select
            value={filterSpecialty}
            onChange={(e) => setFilterSpecialty(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {specialties.map(specialty => (
              <option key={specialty} value={specialty === 'Toutes' ? 'all' : specialty}>
                {specialty}
              </option>
            ))}
          </select>
          <button
            onClick={() => {
              setSearchQuery('');
              setFilterStatus('all');
              setFilterSpecialty('all');
            }}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Réinitialiser
          </button>
        </div>
      </div>

      {/* Doctors Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Médecin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Spécialité
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expérience
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Consultations
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDoctors.map((doctor) => (
                <tr key={doctor.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium">
                          {doctor.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{doctor.name}</div>
                        <div className="text-sm text-gray-500">{doctor.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{doctor.specialty}</div>
                    <div className="text-sm text-gray-500">{doctor.subSpecialty}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{doctor.experience} ans</div>
                    <div className="flex items-center mt-1">
                      <StarIcon className="h-4 w-4 text-yellow-400" />
                      <span className="text-sm text-gray-500 ml-1">{doctor.rating}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{doctor.consultationCount.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">{doctor.consultationFee.toLocaleString()} FCFA</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      doctor.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {doctor.status === 'active' ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleDoctorStatus(doctor.id)}
                        className={`p-1 rounded ${
                          doctor.status === 'active' 
                            ? 'text-yellow-600 hover:text-yellow-800' 
                            : 'text-green-600 hover:text-green-800'
                        }`}
                        title={doctor.status === 'active' ? 'Désactiver' : 'Activer'}
                      >
                        {doctor.status === 'active' ? (
                          <XCircleIcon className="h-5 w-5" />
                        ) : (
                          <CheckCircleIcon className="h-5 w-5" />
                        )}
                      </button>
                      <button className="p-1 text-blue-600 hover:text-blue-800">
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteDoctor(doctor)}
                        className="p-1 text-red-600 hover:text-red-800"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <div className="bg-red-100 p-3 rounded-full mr-4">
                <TrashIcon className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Supprimer le médecin</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Êtes-vous sûr de vouloir supprimer {selectedDoctor.name} ? Cette action est irréversible.
                </p>
              </div>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={confirmDelete}
                disabled={isLoading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Suppression...
                  </span>
                ) : (
                  'Supprimer'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Doctor Modal Placeholder */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Ajouter un nouveau médecin</h3>
            <p className="text-gray-600 mb-4">Cette fonctionnalité sera disponible prochainement.</p>
            <div className="flex justify-end">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HospitalDoctors;
