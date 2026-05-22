import React, { useState } from 'react';
import { 
  ArrowLeftIcon,
  ChatBubbleLeftRightIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ClockIcon,
  ChevronDownIcon,
  CheckCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const HelpSupport = () => {
  const [activeFaq, setActiveFaq] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const faqs = [
    {
      question: "Comment puis-je mettre à jour mes informations personnelles ?",
      answer: "Vous pouvez mettre à jour vos informations personnelles en accédant à la section 'Profil' depuis le menu principal. Cliquez sur 'Modifier le profil' pour effectuer des modifications."
    },
    {
      question: "Comment contacter le service client ?",
      answer: "Notre service client est disponible du lundi au vendredi de 9h à 18h. Vous pouvez nous contacter par téléphone au 01 23 45 67 89 ou utiliser le formulaire de contact ci-dessous."
    },
    {
      question: "Comment puis-je annuler un rendez-vous ?",
      answer: "Pour annuler un rendez-vous, rendez-vous dans la section 'Mes rendez-vous', sélectionnez le rendez-vous concerné et cliquez sur 'Annuler le rendez-vous'."
    },
    {
      question: "Quels sont les modes de paiement acceptés ?",
      answer: "Nous acceptons les cartes bancaires (Visa, Mastercard), les virements bancaires et les chèques. Les paiements en ligne sont sécurisés par notre partenaire de paiement."
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Formulaire soumis :', formData);
    setIsSubmitted(true);
    
    setTimeout(() => {
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      setIsSubmitted(false);
    }, 5000);
  };

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center mb-8">
          <button
            onClick={() => window.history.back()}
            className="p-2 rounded-full hover:bg-gray-100 mr-4"
          >
            <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Aide & Support</h1>
        </div>

        {/* Section FAQ */}
        <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Questions fréquentes</h2>
            <p className="mt-1 text-sm text-gray-500">Trouvez des réponses aux questions les plus courantes</p>
          </div>
          
          <div className="divide-y divide-gray-200">
            {faqs.map((faq, index) => (
              <div key={index} className="px-6 py-4">
                <button
                  className="w-full flex justify-between items-center text-left"
                  onClick={() => toggleFaq(index)}
                >
                  <span className="font-medium text-gray-900">{faq.question}</span>
                  <ChevronDownIcon 
                    className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${
                      activeFaq === index ? 'transform rotate-180' : ''
                    }`} 
                  />
                </button>
                {activeFaq === index && (
                  <div className="mt-2 text-gray-600">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Section Contact */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Contactez-nous</h2>
            <p className="mt-1 text-sm text-gray-500">Notre équipe est là pour vous aider</p>
          </div>
          
          <div className="p-6">
            {isSubmitted ? (
              <div className="rounded-md bg-green-50 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <CheckCircleIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">Message envoyé avec succès</h3>
                    <div className="mt-2 text-sm text-green-700">
                      <p>Nous avons bien reçu votre message et vous répondrons dans les plus brefs délais.</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Nom complet <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                    Objet <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="subject"
                    id="subject"
                    required
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    required
                    value={formData.message}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Décrivez votre problème ou votre question en détail..."
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Envoyer le message
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Informations de contact */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                  <PhoneIcon className="h-6 w-6 text-blue-600" aria-hidden="true" />
                </div>
                <div className="ml-5">
                  <h3 className="text-lg font-medium text-gray-900">Téléphone</h3>
                  <p className="mt-1 text-sm text-gray-500">01 23 45 67 89</p>
                  <p className="mt-1 text-xs text-gray-400">Lun-Ven, 9h-18h</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                  <EnvelopeIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
                </div>
                <div className="ml-5">
                  <h3 className="text-lg font-medium text-gray-900">Email</h3>
                  <p className="mt-1 text-sm text-gray-500">support@assurance.fr</p>
                  <p className="mt-1 text-xs text-gray-400">Réponse sous 24h</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
                  <MapPinIcon className="h-6 w-6 text-purple-600" aria-hidden="true" />
                </div>
                <div className="ml-5">
                  <h3 className="text-lg font-medium text-gray-900">Bureau</h3>
                  <p className="mt-1 text-sm text-gray-500">123 Rue de l'Assurance</p>
                  <p className="mt-1 text-xs text-gray-400">75001 Paris, France</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpSupport;
