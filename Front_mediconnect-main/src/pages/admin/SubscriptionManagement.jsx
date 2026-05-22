import React, { useState, useEffect } from 'react';
import {
  CreditCardIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

const SubscriptionManagement = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPlan, setFilterPlan] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState(null);

  useEffect(() => {
    // Simuler le chargement des abonnements
    setSubscriptions([
      {
        id: 1,
        hospitalId: 1,
        hospitalName: 'Clinique Saint-Jean',
        hospitalEmail: 'contact@clinique-saintjean.com',
        plan: 'Professional',
        status: 'active',
        startDate: '2024-01-15',
        endDate: '2024-04-15',
        price: 150000,
        billingCycle: 'monthly',
        autoRenew: true,
        doctorsUsed: 15,
        doctorsLimit: 20,
        consultationsUsed: 342,
        consultationsLimit: 500,
        nextBillingDate: '2024-04-15',
        paymentMethod: 'credit_card',
        lastPaymentDate: '2024-03-15',
        totalPaid: 450000,
        revenue: 150000
      },
      {
        id: 2,
        hospitalId: 2,
        hospitalName: 'Hôpital Principal de Dakar',
        hospitalEmail: 'info@hopitalprincipal.sn',
        plan: 'Enterprise',
        status: 'active',
        startDate: '2023-06-20',
        endDate: '2024-06-20',
        price: 500000,
        billingCycle: 'monthly',
        autoRenew: true,
        doctorsUsed: 45,
        doctorsLimit: -1, // Illimité
        consultationsUsed: 1240,
        consultationsLimit: -1, // Illimité
        nextBillingDate: '2024-04-20',
        paymentMethod: 'bank_transfer',
        lastPaymentDate: '2024-03-20',
        totalPaid: 6000000,
        revenue: 500000
      },
      {
        id: 3,
        hospitalId: 3,
        hospitalName: 'Polyclininique du Sénégal',
        hospitalEmail: 'contact@polyclinique.sn',
        plan: 'Basic',
        status: 'suspended',
        startDate: '2023-11-10',
        endDate: '2024-03-10',
        price: 50000,
        billingCycle: 'monthly',
        autoRenew: false,
        doctorsUsed: 8,
        doctorsLimit: 5,
        consultationsUsed: 89,
        consultationsLimit: 100,
        nextBillingDate: null,
        paymentMethod: 'mobile_money',
        lastPaymentDate: '2024-02-10',
        totalPaid: 200000,
        revenue: 0
      },
      {
        id: 4,
        hospitalId: 4,
        hospitalName: 'Centre Médical Dalal Jamm',
        hospitalEmail: 'dalaljamm@medic.sn',
        plan: 'Basic',
        status: 'pending',
        startDate: null,
        endDate: null,
        price: 50000,
        billingCycle: 'monthly',
        autoRenew: false,
        doctorsUsed: 3,
        doctorsLimit: 5,
        consultationsUsed: 0,
        consultationsLimit: 100,
        nextBillingDate: null,
        paymentMethod: null,
        lastPaymentDate: null,
        totalPaid: 0,
        revenue: 0
      }
    ]);
  }, []);

  const getStatusBadge = (status) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      suspended: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-gray-100 text-gray-800',
      expired: 'bg-orange-100 text-orange-800'
    };
    const labels = {
      active: 'Actif',
      suspended: 'Suspendu',
      pending: 'En attente',
      cancelled: 'Annulé',
      expired: 'Expiré'
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const getPlanBadge = (plan) => {
    const styles = {
      Basic: 'bg-gray-100 text-gray-800',
      Professional: 'bg-blue-100 text-blue-800',
      Enterprise: 'bg-purple-100 text-purple-800'
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[plan]}`}>
        {plan}
      </span>
    );
  };

  const getUsagePercentage = (used, limit) => {
    if (limit === -1) return 0; // Illimité
    return Math.min((used / limit) * 100, 100);
  };

  const getUsageColor = (percentage) => {
    if (percentage >= 90) return 'red';
    if (percentage >= 70) return 'yellow';
    return 'green';
  };

  const filteredSubscriptions = subscriptions.filter(subscription => {
    const matchesSearch = subscription.hospitalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         subscription.hospitalEmail.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || subscription.status === filterStatus;
    const matchesPlan = filterPlan === 'all' || subscription.plan === filterPlan;
    
    return matchesSearch && matchesStatus && matchesPlan;
  });

  const stats = {
    total: subscriptions.length,
    active: subscriptions.filter(s => s.status === 'active').length,
    suspended: subscriptions.filter(s => s.status === 'suspended').length,
    pending: subscriptions.filter(s => s.status === 'pending').length,
    totalRevenue: subscriptions.reduce((sum, s) => sum + s.revenue, 0),
    monthlyRevenue: subscriptions.filter(s => s.status === 'active' && s.billingCycle === 'monthly').reduce((sum, s) => sum + s.price, 0)
  };

  const StatCard = ({ title, value, change, changeType, icon: Icon, color }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          {change && (
            <div className={`flex items-center mt-2 text-sm ${
              changeType === 'positive' ? 'text-green-600' : 'text-red-600'
            }`}>
              {changeType === 'positive' ? (
                <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
              ) : (
                <ArrowTrendingDownIcon className="h-4 w-4 mr-1" />
              )}
              {change}
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg bg-${color}-100`}>
          <Icon className={`h-6 w-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des abonnements</h1>
          <p className="text-gray-600 mt-2">Consultez et gérez les abonnements des hôpitaux</p>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="month">Ce mois</option>
            <option value="quarter">Ce trimestre</option>
            <option value="year">Cette année</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total abonnements"
          value={stats.total}
          change="+12 ce mois"
          changeType="positive"
          icon={CreditCardIcon}
          color="blue"
        />
        <StatCard
          title="Abonnements actifs"
          value={stats.active}
          change="+8 ce mois"
          changeType="positive"
          icon={CheckCircleIcon}
          color="green"
        />
        <StatCard
          title="Revenu mensuel"
          value={`${(stats.monthlyRevenue / 1000000).toFixed(1)}M FCFA`}
          change="+15% vs mois dernier"
          changeType="positive"
          icon={CurrencyDollarIcon}
          color="yellow"
        />
        <StatCard
          title="Revenu total"
          value={`${(stats.totalRevenue / 1000000).toFixed(1)}M FCFA`}
          change="+25% cette année"
          changeType="positive"
          icon={ArrowTrendingUpIcon}
          color="purple"
        />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un hôpital..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tous les statuts</option>
              <option value="active">Actifs</option>
              <option value="suspended">Suspendus</option>
              <option value="pending">En attente</option>
              <option value="cancelled">Annulés</option>
              <option value="expired">Expirés</option>
            </select>
            <select
              value={filterPlan}
              onChange={(e) => setFilterPlan(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tous les plans</option>
              <option value="Basic">Basic</option>
              <option value="Professional">Professional</option>
              <option value="Enterprise">Enterprise</option>
            </select>
          </div>
        </div>
      </div>

      {/* Subscriptions List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hôpital
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Utilisation
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prochaine facturation
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenu
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSubscriptions.map((subscription) => (
                <tr key={subscription.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{subscription.hospitalName}</div>
                      <div className="text-sm text-gray-500">{subscription.hospitalEmail}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getPlanBadge(subscription.plan)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(subscription.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">Médecins</span>
                        <span className="text-xs text-gray-900">
                          {subscription.doctorsLimit === -1 ? 'Illimité' : `${subscription.doctorsUsed}/${subscription.doctorsLimit}`}
                        </span>
                      </div>
                      {subscription.doctorsLimit !== -1 && (
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div 
                            className={`bg-${getUsageColor(getUsagePercentage(subscription.doctorsUsed, subscription.doctorsLimit))}-500 h-1.5 rounded-full`}
                            style={{ width: `${getUsagePercentage(subscription.doctorsUsed, subscription.doctorsLimit)}%` }}
                          />
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">Consultations</span>
                        <span className="text-xs text-gray-900">
                          {subscription.consultationsLimit === -1 ? 'Illimité' : `${subscription.consultationsUsed}/${subscription.consultationsLimit}`}
                        </span>
                      </div>
                      {subscription.consultationsLimit !== -1 && (
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div 
                            className={`bg-${getUsageColor(getUsagePercentage(subscription.consultationsUsed, subscription.consultationsLimit))}-500 h-1.5 rounded-full`}
                            style={{ width: `${getUsagePercentage(subscription.consultationsUsed, subscription.consultationsLimit)}%` }}
                          />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {subscription.nextBillingDate || '-'}
                    </div>
                    {subscription.autoRenew && subscription.nextBillingDate && (
                      <div className="text-xs text-green-600">Auto-renouvellement</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {subscription.price.toLocaleString()} FCFA
                    </div>
                    <div className="text-xs text-gray-500">
                      {subscription.billingCycle === 'monthly' ? 'Mensuel' : 'Annuel'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedSubscription(subscription);
                          setShowDetailsModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-800"
                        title="Voir les détails"
                      >
                        <CalendarIcon className="h-5 w-5" />
                      </button>
                      {subscription.status === 'active' && (
                        <button
                          className="text-yellow-600 hover:text-yellow-800"
                          title="Suspendre"
                        >
                          <XCircleIcon className="h-5 w-5" />
                        </button>
                      )}
                      {subscription.status === 'suspended' && (
                        <button
                          className="text-green-600 hover:text-green-800"
                          title="Réactiver"
                        >
                          <CheckCircleIcon className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedSubscription && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 shadow-lg rounded-lg bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Détails de l'abonnement</h3>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircleIcon className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Hospital Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Hôpital</p>
                  <p className="text-sm text-gray-900">{selectedSubscription.hospitalName}</p>
                  <p className="text-sm text-gray-500">{selectedSubscription.hospitalEmail}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Plan</p>
                  <div className="flex items-center space-x-2 mt-1">
                    {getPlanBadge(selectedSubscription.plan)}
                    <span className="text-sm text-gray-900">
                      {selectedSubscription.price.toLocaleString()} FCFA/{selectedSubscription.billingCycle === 'monthly' ? 'mois' : 'an'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Usage Stats */}
              <div className="border-t pt-4">
                <h4 className="text-md font-medium text-gray-900 mb-4">Utilisation des ressources</h4>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Médecins</span>
                      <span className="text-sm text-gray-600">
                        {selectedSubscription.doctorsLimit === -1 ? 'Illimité' : `${selectedSubscription.doctorsUsed}/${selectedSubscription.doctorsLimit}`}
                      </span>
                    </div>
                    {selectedSubscription.doctorsLimit !== -1 && (
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`bg-${getUsageColor(getUsagePercentage(selectedSubscription.doctorsUsed, selectedSubscription.doctorsLimit))}-500 h-2 rounded-full`}
                          style={{ width: `${getUsagePercentage(selectedSubscription.doctorsUsed, selectedSubscription.doctorsLimit)}%` }}
                        />
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Consultations</span>
                      <span className="text-sm text-gray-600">
                        {selectedSubscription.consultationsLimit === -1 ? 'Illimité' : `${selectedSubscription.consultationsUsed}/${selectedSubscription.consultationsLimit}`}
                      </span>
                    </div>
                    {selectedSubscription.consultationsLimit !== -1 && (
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`bg-${getUsageColor(getUsagePercentage(selectedSubscription.consultationsUsed, selectedSubscription.consultationsLimit))}-500 h-2 rounded-full`}
                          style={{ width: `${getUsagePercentage(selectedSubscription.consultationsUsed, selectedSubscription.consultationsLimit)}%` }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Billing Info */}
              <div className="border-t pt-4">
                <h4 className="text-md font-medium text-gray-900 mb-4">Informations de facturation</h4>
                <div className="flex items-center">
                  <ArrowTrendingUpIcon className="h-6 w-6 text-blue-600 mb-2" />
                  <p className="text-lg font-semibold text-gray-900">Total abonnements</p>
                  <p className="text-sm text-gray-600 mt-2">{stats.total}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Date de début</p>
                    <p className="text-sm text-gray-900">{selectedSubscription.startDate || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Date de fin</p>
                    <p className="text-sm text-gray-900">{selectedSubscription.endDate || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Prochaine facturation</p>
                    <p className="text-sm text-gray-900">{selectedSubscription.nextBillingDate || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Auto-renouvellement</p>
                    <p className="text-sm text-gray-900">{selectedSubscription.autoRenew ? 'Oui' : 'Non'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Méthode de paiement</p>
                    <p className="text-sm text-gray-900">{selectedSubscription.paymentMethod || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Dernier paiement</p>
                    <p className="text-sm text-gray-900">{selectedSubscription.lastPaymentDate || '-'}</p>
                  </div>
                </div>
              </div>

              {/* Revenue Summary */}
              <div className="border-t pt-4">
                <h4 className="text-md font-medium text-gray-900 mb-4">Résumé des revenus</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-900">{(selectedSubscription.price / 1000).toFixed(0)}K</p>
                    <p className="text-sm text-blue-700">Prix mensuel</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-900">{(selectedSubscription.totalPaid / 1000000).toFixed(1)}M</p>
                    <p className="text-sm text-green-700">Total payé</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <p className="text-2xl font-bold text-purple-900">{(selectedSubscription.revenue / 1000).toFixed(0)}K</p>
                    <p className="text-sm text-purple-700">Revenu ce mois</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionManagement;
