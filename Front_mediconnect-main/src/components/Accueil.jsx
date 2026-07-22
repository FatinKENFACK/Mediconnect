import React from 'react';
import { EnvelopeIcon } from '@heroicons/react/24/outline';

const Accueil = () => {
  return (
    <div className="min-h-screen bg-red-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Bienvenue sur notre application de consultaion et prise de rendez-vous en ligne </h1>
        <p className="text-gray-600 mb-4">
          Cette application a été convertie pour utiliser des fichiers JSX pour une meilleure intégration avec React.
        </p>
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-3">Avantages de l'utilisation de JSX :</h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-600">
            <li>Syntaxe plus claire pour le rendu de composants React</li>
            <li>Meilleure intégration avec les outils de développement</li>
            <li>Validation de la syntaxe JSX dans les éditeurs de code</li>
            <li>Meilleure organisation du code avec la séparation des préoccupations</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Accueil;
