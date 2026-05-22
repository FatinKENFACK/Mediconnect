import React, { useState } from 'react';
import { 
  BellIcon,
  EnvelopeIcon,
  DevicePhoneMobileIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const NotificationsTab = () => {
  const [notificationSettings, setNotificationSettings] = useState({
    email: {
      newAppointment: true,
      appointmentReminder: true,
      newMessage: true,
      newsletter: false,
      promotions: false
    },
    push: {
      newAppointment: true,
      appointmentReminder: true,
      newMessage: true
    },
    sms: {
      appointmentReminder: false,
      importantAlerts: true
    }
  });

  const handleToggle = (type, key) => {
    setNotificationSettings(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [key]: !prev[type][key]
      }
    }));
  };

  const handleSave = () => {
    // Ici, vous enverriez les paramètres au serveur
    console.log('Paramètres de notification mis à jour :', notificationSettings);
    
    // Afficher un message de succès (vous pourriez utiliser un état pour gérer les messages)
    alert('Vos préférences de notification ont été enregistrées avec succès.');
  };

  const NotificationToggle = ({ id, label, description, checked, onChange }) => (
    <div className="flex items-start">
      <div className="flex items-center h-5">
        <input
          id={id}
          name={id}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
        />
      </div>
      <div className="ml-3 text-sm">
        <label htmlFor={id} className="font-medium text-gray-700">
          {label}
        </label>
        {description && <p className="text-gray-500">{description}</p>}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Préférences de notification
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Gérez comment vous recevez les notifications.
          </p>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <form className="space-y-8">
            {/* Notifications par email */}
            <div>
              <div className="flex items-center mb-4">
                <EnvelopeIcon className="h-5 w-5 text-gray-500 mr-2" />
                <h4 className="text-base font-medium text-gray-900">Notifications par email</h4>
              </div>
              <div className="space-y-4 pl-7">
                <NotificationToggle
                  id="email-new-appointment"
                  label="Nouveaux rendez-vous"
                  description="Recevoir un email lorsqu'un patient prend rendez-vous"
                  checked={notificationSettings.email.newAppointment}
                  onChange={() => handleToggle('email', 'newAppointment')}
                />
                <NotificationToggle
                  id="email-reminder"
                  label="Rappels de rendez-vous"
                  description="Recevoir des rappels pour les rendez-vous à venir"
                  checked={notificationSettings.email.appointmentReminder}
                  onChange={() => handleToggle('email', 'appointmentReminder')}
                />
                <NotificationToggle
                  id="email-new-message"
                  label="Nouveaux messages"
                  description="Recevoir un email pour chaque nouveau message reçu"
                  checked={notificationSettings.email.newMessage}
                  onChange={() => handleToggle('email', 'newMessage')}
                />
                <div className="border-t border-gray-200 pt-4">
                  <NotificationToggle
                    id="email-newsletter"
                    label="Newsletter"
                    description="Recevoir notre newsletter avec des conseils et des mises à jour"
                    checked={notificationSettings.email.newsletter}
                    onChange={() => handleToggle('email', 'newsletter')}
                  />
                </div>
                <NotificationToggle
                  id="email-promotions"
                  label="Offres spéciales et promotions"
                  description="Recevoir des offres spéciales et des promotions"
                  checked={notificationSettings.email.promotions}
                  onChange={() => handleToggle('email', 'promotions')}
                />
              </div>
            </div>

            {/* Notifications push */}
            <div>
              <div className="flex items-center mb-4">
                <BellIcon className="h-5 w-5 text-gray-500 mr-2" />
                <h4 className="text-base font-medium text-gray-900">Notifications push</h4>
              </div>
              <div className="space-y-4 pl-7">
                <NotificationToggle
                  id="push-new-appointment"
                  label="Nouveaux rendez-vous"
                  description="Recevoir une notification pour chaque nouveau rendez-vous"
                  checked={notificationSettings.push.newAppointment}
                  onChange={() => handleToggle('push', 'newAppointment')}
                />
                <NotificationToggle
                  id="push-reminder"
                  label="Rappels de rendez-vous"
                  description="Recevoir des rappels pour les rendez-vous à venir"
                  checked={notificationSettings.push.appointmentReminder}
                  onChange={() => handleToggle('push', 'appointmentReminder')}
                />
                <NotificationToggle
                  id="push-new-message"
                  label="Nouveaux messages"
                  description="Recevoir une notification pour chaque nouveau message"
                  checked={notificationSettings.push.newMessage}
                  onChange={() => handleToggle('push', 'newMessage')}
                />
              </div>
            </div>

            {/* Notifications SMS */}
            <div>
              <div className="flex items-center mb-4">
                <DevicePhoneMobileIcon className="h-5 w-5 text-gray-500 mr-2" />
                <h4 className="text-base font-medium text-gray-900">Notifications SMS</h4>
              </div>
              <div className="space-y-4 pl-7">
                <NotificationToggle
                  id="sms-reminder"
                  label="Rappels de rendez-vous"
                  description="Recevoir des rappels SMS pour les rendez-vous à venir"
                  checked={notificationSettings.sms.appointmentReminder}
                  onChange={() => handleToggle('sms', 'appointmentReminder')}
                />
                <NotificationToggle
                  id="sms-important"
                  label="Alertes importantes"
                  description="Recevoir des alertes SMS pour les notifications importantes"
                  checked={notificationSettings.sms.importantAlerts}
                  onChange={() => handleToggle('sms', 'importantAlerts')}
                />
              </div>
              <div className="mt-3 pl-7 text-sm text-gray-500">
                <p>Des frais de téléphonie mobile standards peuvent s'appliquer.</p>
              </div>
            </div>

            <div className="pt-5">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleSave}
                  className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <CheckCircleIcon className="-ml-1 mr-2 h-5 w-5" />
                  Enregistrer les préférences
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Heures silencieuses
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Configurez des périodes pendant lesquelles vous ne souhaitez pas recevoir de notifications.
          </p>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="quiet-hours-enabled"
                  name="quiet-hours-enabled"
                  type="checkbox"
                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="quiet-hours-enabled" className="font-medium text-gray-700">
                  Activer les heures silencieuses
                </label>
                <p className="text-gray-500">Les notifications seront désactivées pendant les heures que vous spécifiez.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6 pl-7">
              <div className="sm:col-span-3">
                <label htmlFor="quiet-hours-start" className="block text-sm font-medium text-gray-700">
                  De
                </label>
                <div className="mt-1">
                  <select
                    id="quiet-hours-start"
                    name="quiet-hours-start"
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    disabled
                  >
                    {Array.from({ length: 24 }, (_, i) => {
                      const hour = i % 12 || 12;
                      const ampm = i < 12 ? 'AM' : 'PM';
                      return (
                        <option key={i} value={i}>
                          {`${hour}:00 ${ampm}`}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="quiet-hours-end" className="block text-sm font-medium text-gray-700">
                  À
                </label>
                <div className="mt-1">
                  <select
                    id="quiet-hours-end"
                    name="quiet-hours-end"
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    disabled
                  >
                    {Array.from({ length: 24 }, (_, i) => {
                      const hour = i % 12 || 12;
                      const ampm = i < 12 ? 'AM' : 'PM';
                      return (
                        <option key={i} value={i}>
                          {`${hour}:00 ${ampm}`}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              <div className="sm:col-span-6">
                <fieldset>
                  <legend className="block text-sm font-medium text-gray-700 mb-1">
                    Jours de la semaine
                  </legend>
                  <div className="grid grid-cols-7 gap-2">
                    {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day, index) => (
                      <div key={day} className="flex items-center">
                        <input
                          id={`day-${index}`}
                          name="days"
                          type="checkbox"
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                          disabled
                        />
                        <label htmlFor={`day-${index}`} className="ml-2 block text-sm text-gray-700">
                          {day}
                        </label>
                      </div>
                    ))}
                  </div>
                </fieldset>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200 flex justify-end">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              disabled
            >
              Enregistrer les heures silencieuses
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsTab;
