// Types d'assurance disponibles
export const insuranceTypes = [
  {
    id: 'essentielle',
    name: 'Formule Essentielle',
    description: 'Couverture de base pour les soins courants',
    basePrice: 30,
    features: [
      'Remboursement consultations à 70%',
      'Hospitalisation partielle',
      'Médecine douce limitée'
    ]
  },
  {
    id: 'confort',
    name: 'Formule Confort',
    description: 'Une couverture complète pour toute la famille',
    basePrice: 50,
    features: [
      'Remboursement consultations à 100%',
      'Hospitalisation complète',
      'Médecine douce incluse',
      'Optique et dentaire partiels'
    ]
  },
  {
    id: 'premium',
    name: 'Formule Premium',
    description: 'La protection la plus complète avec des avantages exclusifs',
    basePrice: 80,
    features: [
      'Remboursement à 200% de la base',
      'Hospitalisation en chambre particulière',
      'Médecine douce illimitée',
      'Optique et dentaire complets',
      'Assistance rapatriement',
      'Médecine à l\'étranger'
    ]
  }
];

// Facteurs de majoration selon l'âge
export const ageRates = [
  { min: 0, max: 18, factor: 0.8 },
  { min: 19, max: 25, factor: 1 },
  { min: 26, max: 50, factor: 1.2 },
  { min: 51, max: 60, factor: 1.5 },
  { min: 61, max: 70, factor: 2 },
  { min: 71, max: 120, factor: 3 }
];

// Réductions familiales
export const familyDiscounts = {
  single: 0,
  couple: 0.1, // 10% de réduction pour un couple
  family: 0.15 // 15% de réduction pour une famille
};

// Suppléments optionnels
export const optionalCoverages = [
  {
    id: 'dental',
    name: 'Dentaire renforcé',
    description: 'Remboursement jusqu\'à 500€/an',
    price: 10
  },
  {
    id: 'optical',
    name: 'Optique renforcée',
    description: 'Remboursement jusqu\'à 400€/an',
    price: 8
  },
  {
    id: 'alternative',
    name: 'Médecines alternatives',
    description: 'Ostéopathie, acupuncture, etc.',
    price: 12
  },
  {
    id: 'hospital',
    name: 'Chambre particulière',
    description: 'Prise en charge des frais de chambre particulière',
    price: 15
  }
];

// Statuts de paiement
export const paymentStatuses = {
  PENDING: 'En attente',
  COMPLETED: 'Complété',
  FAILED: 'Échoué',
  REFUNDED: 'Remboursé'
};

// Types de documents acceptés
export const acceptedDocuments = [
  { type: 'identity', label: 'Pièce d\'identité', required: true },
  { type: 'proof_of_address', label: 'Justificatif de domicile', required: true },
  { type: 'tax_notice', label: 'Avis d\'imposition', required: false },
  { type: 'family_record', label: 'Livre de famille', required: false }
];
