import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  // Liens rapides
  const quickLinks = [
    { name: 'Accueil', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Tarifs', path: '/tarifs' },
    { name: 'À propos', path: '/a-propos' },
    { name: 'Contact', path: '/contact' },
    { name: 'Connexion', path: '/connexion' },
  ];

  // Services
  const services = [
    { name: 'Assurance maladie', path: '/services' },
    { name: 'Médecine préventive', path: '/services' },
    { name: 'Médecine générale', path: '/services' },
    { name: 'Spécialistes', path: '/services' },
    { name: 'Bilans de santé', path: '/services' },
    { name: 'Urgence 24/7', path: '/services' },
  ];

  // Réseaux sociaux avec des liens pertinents
  const socialLinks = [
    { 
      icon: <FaFacebook className="h-5 w-5" aria-label="Facebook" />, 
      url: 'https://www.facebook.com/AssurSante',
      name: 'Facebook'
    },
    { 
      icon: <FaTwitter className="h-5 w-5" aria-label="Twitter" />, 
      url: 'https://twitter.com/AssurSante',
      name: 'Twitter'
    },
    { 
      icon: <FaLinkedin className="h-5 w-5" aria-label="LinkedIn" />, 
      url: 'https://www.linkedin.com/company/assursante',
      name: 'LinkedIn'
    },
    { 
      icon: <FaInstagram className="h-5 w-5" aria-label="Instagram" />, 
      url: 'https://www.instagram.com/assursante',
      name: 'Instagram'
    },
  ];

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Colonne 1 - À propos */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">AssurSanté</h3>
            <p className="text-gray-400">
              Votre partenaire de confiance pour des soins de santé accessibles et de qualité, où que vous soyez.
            </p>
            <div className="flex space-x-4 pt-2">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  <span className="sr-only">{social.icon.type.name}</span>
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Colonne 2 - Liens rapides */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Liens rapides</h3>
            
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.path}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Colonne 3 - Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Nos services</h3>
            <ul className="space-y-2">
              {services.map((service) => (
                <li key={service.name}>
                  <Link 
                    to={service.path}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Colonne 4 - Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contactez-nous</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <FaMapMarkerAlt className="h-5 w-5 text-primary-500 mt-1 flex-shrink-0" />
                <p className="ml-3 text-gray-400">
                  123 Rue de la Santé<br />
                  75000 Paris, France
                </p>
              </div>
              <div className="flex items-center">
                <FaPhone className="h-5 w-5 text-primary-500 flex-shrink-0" />
                <a href="tel:+33123456789" className="ml-3 text-gray-400 hover:text-white transition-colors duration-200">
                  +33 1 23 45 67 89
                </a>
              </div>
              <div className="flex items-center">
                <FaEnvelope className="h-5 w-5 text-primary-500 flex-shrink-0" />
                <a href="mailto:contact@assursante.fr" className="ml-3 text-gray-400 hover:text-white transition-colors duration-200">
                  contact@assursante.fr
                </a>
              </div>
              <div className="flex items-start">
                <FaClock className="h-5 w-5 text-primary-500 mt-1 flex-shrink-0" />
                <p className="ml-3 text-gray-400">
                  Lun - Ven: 8h00 - 20h00<br />
                  Sam: 9h00 - 18h00
                </p>
              </div>

              <ul className="space-x-3 flex items-center">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors duration-200 "
                  aria-label={`Suivez-nous sur ${social.name}`}
                >
                  {social.icon}
                </a>
              ))}
            </ul>
            </div>
          </div>
        </div>

        {/* Ligne de séparation */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              &copy; {currentYear} AssurSanté. Tous droits réservés.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/mentions-legales" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
                Mentions légales
              </Link>
              <Link to="/politique-confidentialite" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
                Politique de confidentialité
              </Link>
              <Link to="/conditions-utilisation" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
                Conditions d'utilisation
              </Link>
            </div>
          </div>
          
          <div className="mt-4 text-center md:text-right">
            <p className="text-xs text-gray-500">
              Ce site est conforme aux normes de santé en vigueur et protège vos données de santé conformément au RGPD.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
