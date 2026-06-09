import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import {
  CurrencyDollarIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  CalendarIcon,
  BuildingOfficeIcon,
  CreditCardIcon,
  DevicePhoneMobileIcon,
  BanknotesIcon,
  ArrowDownTrayIcon,
  FunnelIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const PaymentManagement = () => {
  const [payments, setPayments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterMethod, setFilterMethod] = useState('all');
  const [filterPeriod, setFilterPeriod] = useState('month');
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  useEffect(() => {
    const loadPayments = async () => {
      try {
        const data = await api.getAdminPayments();
        setPayments(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Erreur chargement paiements:', err);
      }
    };
    loadPayments();
  }, []);

  const getStatusBadge = (status) => {
    const styles = {
      completed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800',
      refunded: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-orange-100 text-orange-800'
    };
    const labels = {
      completed: 'Complété',
      pending: 'En attente',
      failed: 'Échoué',
      refunded: 'Remboursé',
      cancelled: 'Annulé'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const getMethodIcon = (method) => {
    const icons = {
      credit_card: CreditCardIcon,
      mobile_money: DevicePhoneMobileIcon,
      bank_transfer: BanknotesIcon
    };
    return icons[method] || CreditCardIcon;
  };

  const getMethodBadge = (method) => {
    const styles = {
      credit_card: 'bg-blue-100 text-blue-800',
      mobile_money: 'bg-green-100 text-green-800',
      bank_transfer: 'bg-purple-100 text-purple-800'
    };
    const labels = {
      credit_card: 'Carte bancaire',
      mobile_money: 'Mobile Money',
      bank_transfer: 'Virement bancaire'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[method]}`}>
        {labels[method]}
      </span>
    );
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.hospitalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.hospitalEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.transactionId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.invoiceId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || payment.status === filterStatus;
    const matchesMethod = filterMethod === 'all' || payment.method === filterMethod;

    return matchesSearch && matchesStatus && matchesMethod;
  });

  const stats = {
    total: payments.length,
    completed: payments.filter(p => p.status === 'completed').length,
    pending: payments.filter(p => p.status === 'pending').length,
    failed: payments.filter(p => p.status === 'failed').length,
    refunded: payments.filter(p => p.status === 'refunded').length,
    totalAmount: payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.netAmount, 0),
    pendingAmount: payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0),
    failedAmount: payments.filter(p => p.status === 'failed').reduce((sum, p) => sum + p.amount, 0)
  };

  const handleExport = (format) => {
    // Logique d'exportation
    console.log(`Exporting payments in ${format} format`);
    setShowExportModal(false);
  };

  const StatCard = ({ title, value, change, changeType, icon: Icon, color }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          {change && (
            <div className={`flex items-center mt-2 text-sm ${changeType === 'positive' ? 'text-green-600' : 'text-red-600'
              }`}>
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
          <h1 className="text-3xl font-bold text-gray-900">Historique des paiements</h1>
          <p className="text-gray-600 mt-2">Consultez et gérez tous les paiements de la plateforme</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowExportModal(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
            Exporter
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total des paiements"
          value={`${(stats.totalAmount / 1000000).toFixed(1)}M FCFA`}
          change="+15% vs mois dernier"
          changeType="positive"
          icon={CurrencyDollarIcon}
          color="green"
        />
        <StatCard
          title="Paiements complétés"
          value={stats.completed}
          change="+12 cette semaine"
          changeType="positive"
          icon={CheckCircleIcon}
          color="blue"
        />
        <StatCard
          title="En attente"
          value={stats.pending}
          change={`${stats.pendingAmount.toLocaleString()} FCFA`}
          changeType="neutral"
          icon={ClockIcon}
          color="yellow"
        />
        <StatCard
          title="Paiements échoués"
          value={stats.failed}
          change={`${stats.failedAmount.toLocaleString()} FCFA`}
          changeType="negative"
          icon={XCircleIcon}
          color="red"
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
                placeholder="Rechercher un paiement..."
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
              <option value="completed">Complétés</option>
              <option value="pending">En attente</option>
              <option value="failed">Échoués</option>
              <option value="refunded">Remboursés</option>
              <option value="cancelled">Annulés</option>
            </select>
            <select
              value={filterMethod}
              onChange={(e) => setFilterMethod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Toutes les méthodes</option>
              <option value="credit_card">Carte bancaire</option>
              <option value="mobile_money">Mobile Money</option>
              <option value="bank_transfer">Virement bancaire</option>
            </select>
            <select
              value={filterPeriod}
              onChange={(e) => setFilterPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="today">Aujourd'hui</option>
              <option value="week">Cette semaine</option>
              <option value="month">Ce mois</option>
              <option value="quarter">Ce trimestre</option>
              <option value="year">Cette année</option>
            </select>
          </div>
        </div>
      </div>

      {/* Payments List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Paiement
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hôpital
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Montant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Méthode
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPayments.map((payment) => {
                const MethodIcon = getMethodIcon(payment.method);
                return (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{payment.id}</div>
                        <div className="text-sm text-gray-500">{payment.invoiceId}</div>
                        {payment.transactionId && (
                          <div className="text-xs text-gray-400">{payment.transactionId}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{payment.hospitalName}</div>
                        <div className="text-sm text-gray-500">{payment.hospitalEmail}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {payment.amount.toLocaleString()} {payment.currency}
                        </div>
                        {payment.processingFee > 0 && (
                          <div className="text-xs text-gray-500">
                            Frais: {payment.processingFee.toLocaleString()} {payment.currency}
                          </div>
                        )}
                        <div className="text-xs text-gray-500">
                          Net: {payment.netAmount.toLocaleString()} {payment.currency}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <MethodIcon className="h-4 w-4 text-gray-400 mr-2" />
                        {getMethodBadge(payment.method)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(payment.status)}
                      {payment.status === 'failed' && payment.failureReason && (
                        <div className="text-xs text-red-600 mt-1">{payment.failureReason}</div>
                      )}
                      {payment.status === 'refunded' && payment.refundDate && (
                        <div className="text-xs text-gray-500 mt-1">Remboursé le {payment.refundDate}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{payment.date}</div>
                      <div className="text-xs text-gray-500">{payment.time}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setSelectedPayment(payment);
                            setShowDetailsModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-800"
                          title="Voir les détails"
                        >
                          <CalendarIcon className="h-5 w-5" />
                        </button>
                        {payment.status === 'completed' && !payment.refunded && (
                          <button
                            onClick={async () => {
                              await api.updatePaymentStatus(payment.id, 'refund');
                              setPayments(prev =>
                                prev.map(p => p.id === payment.id
                                  ? { ...p, status: 'refunded', refunded: true }
                                  : p
                                )
                              );
                            }}
                            className="text-orange-600 hover:text-orange-800"
                            title="Rembourser"
                          >
                            <ArrowDownTrayIcon className="h-5 w-5" />
                          </button>
                        )}
                        {payment.status === 'pending' && (
                          <button
                            className="text-yellow-600 hover:text-yellow-800"
                            title="Vérifier"
                          >
                            <ClockIcon className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedPayment && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 shadow-lg rounded-lg bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Détails du paiement</h3>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircleIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Payment Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">ID du paiement</p>
                  <p className="text-sm text-gray-900">{selectedPayment.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">ID de facture</p>
                  <p className="text-sm text-gray-900">{selectedPayment.invoiceId}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">ID de transaction</p>
                  <p className="text-sm text-gray-900">{selectedPayment.transactionId || '-'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Statut</p>
                  <div className="mt-1">{getStatusBadge(selectedPayment.status)}</div>
                </div>
              </div>

              {/* Hospital Info */}
              <div className="border-t pt-4">
                <h4 className="text-md font-medium text-gray-900 mb-4">Informations de l'hôpital</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Nom</p>
                    <p className="text-sm text-gray-900">{selectedPayment.hospitalName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="text-sm text-gray-900">{selectedPayment.hospitalEmail}</p>
                  </div>
                </div>
              </div>

              {/* Amount Details */}
              <div className="border-t pt-4">
                <h4 className="text-md font-medium text-gray-900 mb-4">Détails du montant</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Montant total</span>
                    <span className="text-sm font-medium text-gray-900">{selectedPayment.amount.toLocaleString()} {selectedPayment.currency}</span>
                  </div>
                  {selectedPayment.processingFee > 0 && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Frais de traitement</span>
                      <span className="text-sm font-medium text-gray-900">{selectedPayment.processingFee.toLocaleString()} {selectedPayment.currency}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-medium">
                    <span className="text-sm text-gray-900">Montant net</span>
                    <span className="text-sm text-gray-900">{selectedPayment.netAmount.toLocaleString()} {selectedPayment.currency}</span>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="border-t pt-4">
                <h4 className="text-md font-medium text-gray-900 mb-4">Méthode de paiement</h4>
                <div className="space-y-2">
                  <div className="flex items-center">
                    {React.createElement(getMethodIcon(selectedPayment.method), { className: "h-5 w-5 text-gray-400 mr-2" })}
                    {getMethodBadge(selectedPayment.method)}
                  </div>
                  {selectedPayment.methodDetails && (
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      {Object.entries(selectedPayment.methodDetails).map(([key, value]) => (
                        <div key={key}>
                          <p className="text-xs text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                          <p className="text-sm text-gray-900">{value}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Subscription Info */}
              <div className="border-t pt-4">
                <h4 className="text-md font-medium text-gray-900 mb-4">Informations d'abonnement</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Type</p>
                    <p className="text-sm text-gray-900">{selectedPayment.type}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Plan</p>
                    <p className="text-sm text-gray-900">{selectedPayment.plan}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Cycle de facturation</p>
                    <p className="text-sm text-gray-900">{selectedPayment.billingCycle === 'monthly' ? 'Mensuel' : 'Annuel'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Description</p>
                    <p className="text-sm text-gray-900">{selectedPayment.description}</p>
                  </div>
                </div>
              </div>

              {/* Timestamps */}
              <div className="border-t pt-4">
                <h4 className="text-md font-medium text-gray-900 mb-4">Timestamps</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Date du paiement</p>
                    <p className="text-sm text-gray-900">{selectedPayment.date} à {selectedPayment.time}</p>
                  </div>
                  {selectedPayment.refundDate && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">Date de remboursement</p>
                      <p className="text-sm text-gray-900">{selectedPayment.refundDate}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="border-t pt-4">
                <div className="flex justify-end space-x-3">
                  {selectedPayment.status === 'completed' && selectedPayment.refundable && !selectedPayment.refunded && (
                    <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
                      Rembourser
                    </button>
                  )}
                  {selectedPayment.status === 'pending' && (
                    <button className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700">
                      Vérifier le paiement
                    </button>
                  )}
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/3 shadow-lg rounded-lg bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Exporter les paiements</h3>
              <button
                onClick={() => setShowExportModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircleIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-4">Choisissez le format d'exportation:</p>
                <div className="space-y-2">
                  <button
                    onClick={() => handleExport('csv')}
                    className="w-full p-3 border border-gray-300 rounded-lg hover:bg-gray-50 text-left"
                  >
                    <div className="font-medium text-gray-900">CSV</div>
                    <div className="text-sm text-gray-500">Format Excel compatible</div>
                  </button>
                  <button
                    onClick={() => handleExport('excel')}
                    className="w-full p-3 border border-gray-300 rounded-lg hover:bg-gray-50 text-left"
                  >
                    <div className="font-medium text-gray-900">Excel</div>
                    <div className="text-sm text-gray-500">Format .xlsx avec mise en forme</div>
                  </button>
                  <button
                    onClick={() => handleExport('pdf')}
                    className="w-full p-3 border border-gray-300 rounded-lg hover:bg-gray-50 text-left"
                  >
                    <div className="font-medium text-gray-900">PDF</div>
                    <div className="text-sm text-gray-500">Format document imprimable</div>
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setShowExportModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentManagement;
