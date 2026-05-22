import React, { useState } from 'react';
import { 
  CreditCardIcon, 
  CheckCircleIcon, 
  ArrowDownTrayIcon, 
  ReceiptPercentIcon,
  DocumentTextIcon,
  ClockIcon,
  ReceiptRefundIcon
} from '@heroicons/react/24/outline';

const FacturationTab = () => {
  const [activeTab, setActiveTab] = useState('abonnement');
  const [paymentMethod, setPaymentMethod] = useState({
    type: 'visa',
    last4: '4242',
    expiry: '12/25',
    name: 'Dr. Jean Dupont'
  });
  const [billingAddress, setBillingAddress] = useState({
    name: 'Dr. Jean Dupont',
    company: 'Cabinet Médical',
    address: '123 Rue de la République',
    city: 'Paris',
    postalCode: '75001',
    country: 'France',
    vatNumber: 'FR12345678901'
  });
  const [invoices, setInvoices] = useState([
    { id: 'INV-2023-001', date: '15 juin 2023', amount: 49.99, status: 'payé', downloadUrl: '#' },
    { id: 'INV-2023-002', date: '15 mai 2023', amount: 49.99, status: 'payé', downloadUrl: '#' },
    { id: 'INV-2023-003', date: '15 avril 2023', amount: 49.99, status: 'payé', downloadUrl: '#' },
    { id: 'INV-2023-004', date: '15 mars 2023', amount: 49.99, status: 'payé', downloadUrl: '#' }
  ]);

  const handleInputChange = (e, section) => {
    const { name, value } = e.target;
    if (section === 'billing') {
      setBillingAddress(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleUpdateBilling = (e) => {
    e.preventDefault();
    // Ici, vous enverriez les données mises à jour au serveur
    alert('Informations de facturation mises à jour avec succès');
  };

  const renderSubscriptionTab = () => (
    <div className="space-y-8">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Votre abonnement
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Gérez votre abonnement et consultez les détails de facturation.
          </p>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <CheckCircleIcon className="h-5 w-5 text-blue-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  <span className="font-medium">Votre abonnement est actif.</span> La prochaine date de facturation est le <span className="font-medium">15 juillet 2023</span>.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Plan actuel</h4>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-lg font-medium text-gray-900">Professionnel</p>
                    <p className="text-sm text-gray-500">49,99 € / mois</p>
                    <p className="mt-2 text-sm text-gray-600">Accès complet à toutes les fonctionnalités</p>
                    <ul className="mt-2 text-sm text-gray-600 space-y-1">
                      <li className="flex items-center">
                        <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                        <span>Gestion illimitée des patients</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                        <span>Agenda en ligne</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                        <span>Support prioritaire</span>
                      </li>
                    </ul>
                  </div>
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Changer de plan
                  </button>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Historique des factures</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Facture
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Montant
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Statut
                        </th>
                        <th scope="col" className="relative px-6 py-3">
                          <span className="sr-only">Télécharger</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {invoices.map((invoice) => (
                        <tr key={invoice.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {invoice.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {invoice.date}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {invoice.amount.toFixed(2)} €
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              invoice.status === 'payé' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <a href={invoice.downloadUrl} className="text-blue-600 hover:text-blue-900">
                              <ArrowDownTrayIcon className="h-5 w-5" />
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPaymentMethodTab = () => (
    <div className="space-y-8">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Méthode de paiement
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Mettez à jour votre méthode de paiement.
          </p>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {paymentMethod.type === 'visa' && (
                  <div className="h-8 w-12 bg-white rounded flex items-center justify-center shadow-sm border border-gray-200">
                    <svg className="h-6 w-8" viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10.08 10.906C9.999 10.627 10.29 9.3 10.31 9.3s.17.1.26.3c.77 1.6 1.19 2.2 2.11 2.2h2.49c1.63 0 2.14-.9 2.3-1.2l.15-.3H24L21.69.8H18.1l-.76 3.9s-.13.6-.21.8c-.3.7-.9 1.1-1.5 1.1h-5.2l-.19.4 1.5 4.006h1.74z" fill="#1A1F71"/>
                      <path d="M9.6 6.6l-2.9-5.8H0l4.5 9.5 1.6-3.7c.3-.7 1-1.2 1.8-1.2.4-.1.7-.1 1.1 0z" fill="#1A1F71"/>
                      <path d="M9.6 6.6c.3-.6.8-1 1.4-1.2L8.2 0H4.5l-4.5 9.5 1.5 3.1 8.1-5z" fill="#FF5F00"/>
                    </svg>
                  </div>
                )}
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">
                    Carte {paymentMethod.type === 'visa' ? 'Visa' : 'Mastercard'} se terminant par {paymentMethod.last4}
                  </p>
                  <p className="text-sm text-gray-500">
                    Expire le {paymentMethod.expiry} • {paymentMethod.name}
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Modifier
              </button>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Ajouter une méthode de paiement</h4>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <button
                type="button"
                className="relative block w-full border-2 border-gray-300 border-dashed rounded-lg p-6 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
                <span className="mt-2 block text-sm font-medium text-gray-900">Nouvelle carte</span>
              </button>
              <button
                type="button"
                className="relative block w-full border-2 border-gray-300 border-dashed rounded-lg p-6 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="mt-2 block text-sm font-medium text-gray-900">PayPal</span>
              </button>
              <button
                type="button"
                className="relative block w-full border-2 border-gray-300 border-dashed rounded-lg p-6 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
                <span className="mt-2 block text-sm font-medium text-gray-900">Apple Pay</span>
              </button>
              <button
                type="button"
                className="relative block w-full border-2 border-gray-300 border-dashed rounded-lg p-6 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
                <span className="mt-2 block text-sm font-medium text-gray-900">Google Pay</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBillingInfoTab = () => (
    <div className="space-y-8">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Informations de facturation
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Mettez à jour vos informations de facturation.
          </p>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <form onSubmit={handleUpdateBilling} className="space-y-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-6">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Nom complet
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={billingAddress.name}
                    onChange={(e) => handleInputChange(e, 'billing')}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                  Société (facultatif)
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="company"
                    id="company"
                    value={billingAddress.company}
                    onChange={(e) => handleInputChange(e, 'billing')}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Adresse
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="address"
                    id="address"
                    value={billingAddress.address}
                    onChange={(e) => handleInputChange(e, 'billing')}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
                  Code postal
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="postalCode"
                    id="postalCode"
                    value={billingAddress.postalCode}
                    onChange={(e) => handleInputChange(e, 'billing')}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                  Ville
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="city"
                    id="city"
                    value={billingAddress.city}
                    onChange={(e) => handleInputChange(e, 'billing')}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                  Pays
                </label>
                <div className="mt-1">
                  <select
                    id="country"
                    name="country"
                    value={billingAddress.country}
                    onChange={(e) => handleInputChange(e, 'billing')}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  >
                    <option>France</option>
                    <option>Belgique</option>
                    <option>Suisse</option>
                    <option>Luxembourg</option>
                    <option>Canada</option>
                  </select>
                </div>
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="vatNumber" className="block text-sm font-medium text-gray-700">
                  Numéro de TVA intracommunautaire (facultatif)
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="vatNumber"
                    id="vatNumber"
                    value={billingAddress.vatNumber}
                    onChange={(e) => handleInputChange(e, 'billing')}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="FR12345678901"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Si vous êtes une entreprise, veuillez indiquer votre numéro de TVA intracommunautaire.
                </p>
              </div>
            </div>

            <div className="pt-5">
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Enregistrer les modifications
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'abonnement', name: 'Abonnement', icon: <DocumentTextIcon className="h-5 w-5 mr-2" /> },
    { id: 'paiement', name: 'Méthode de paiement', icon: <CreditCardIcon className="h-5 w-5 mr-2" /> },
    { id: 'facturation', name: 'Informations de facturation', icon: <ReceiptPercentIcon className="h-5 w-5 text-gray-400" /> },
    { id: 'historique', name: 'Historique des factures', icon: <ClockIcon className="h-5 w-5 mr-2" /> },
    { id: 'remboursements', name: 'Demandes de remboursement', icon: <ReceiptRefundIcon className="h-5 w-5 mr-2" /> }
  ];

  return (
    <div className="space-y-8">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                {tab.icon}
                {tab.name}
              </div>
            </button>
          ))}
        </nav>
      </div>

      {activeTab === 'abonnement' && renderSubscriptionTab()}
      {activeTab === 'paiement' && renderPaymentMethodTab()}
      {activeTab === 'facturation' && renderBillingInfoTab()}
      {activeTab === 'historique' && (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Historique des factures
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Consultez et téléchargez vos anciennes factures.
            </p>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Facture
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Montant
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Télécharger</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {invoices.map((invoice) => (
                    <tr key={invoice.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {invoice.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {invoice.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {invoice.amount.toFixed(2)} €
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          invoice.status === 'payé' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <a href={invoice.downloadUrl} className="text-blue-600 hover:text-blue-900">
                          <ArrowDownTrayIcon className="h-5 w-5" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-sm text-gray-500">
              <p>Vous pouvez consulter jusqu'à 24 mois d'historique de facturation.</p>
            </div>
          </div>
        </div>
      )}
      {activeTab === 'remboursements' && (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Demandes de remboursement
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Gérez vos demandes de remboursement.
            </p>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="text-center py-12">
              <ReceiptRefundIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune demande de remboursement</h3>
              <p className="mt-1 text-sm text-gray-500">
                Vous n'avez pas encore effectué de demande de remboursement.
              </p>
              <div className="mt-6">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <ReceiptRefundIcon className="-ml-1 mr-2 h-5 w-5" />
                  Nouvelle demande
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacturationTab;
