import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaEnvelope } from 'react-icons/fa';
import Button from '../../components/common/Button';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h1 className="text-9xl font-extrabold text-primary-600">404</h1>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Page non trouvée</h2>
          <p className="mt-4 text-lg text-gray-600">
            Désolé, nous n'avons pas trouvé la page que vous recherchez.
          </p>
        </div>
        
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/" className="w-full sm:w-auto">
            <Button fullWidth>
              <FaHome className="inline-block mr-2" />
              Retour à l'accueil
            </Button>
          </Link>
          
          <a 
            href="mailto:support@assursante.fr" 
            className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <FaEnvelope className="inline-block mr-2" />
            Contacter le support
          </a>
        </div>
        
        <div className="mt-12">
          <p className="text-sm text-gray-500">
            Code d'erreur: 404 | Page non trouvée
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
