import { useState, useEffect, createContext, useContext } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import {
  FaSearch,
  FaCalendarCheck,
  FaChartLine,
  FaMapMarkerAlt,
  FaUserMd,
  FaHandshake,
  FaShieldAlt,
  FaClock,
  FaArrowRight,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarker,
  FaTwitter,
  FaFacebook,
  FaLinkedin,
  FaInstagram,
  FaCheckCircle,
  FaBriefcase,
  FaUsers,
  FaGlobe,
  FaVideo,
  FaMobileAlt,
  FaCreditCard,
  FaRegCreditCard,
  FaHeadset,
  FaHospital,
  FaStethoscope,
  FaAmbulance,
  FaFileInvoice,
  FaCalendarAlt,
  FaWhatsapp,
  FaRobot,
  FaChartBar,
  FaCertificate,
  FaBuilding,
  FaHeartbeat,
  FaIdCard,
  FaMoneyBillWave,
  FaBookOpen,
  FaComments,
  FaRocket,
  FaSun,
  FaMoon,
  FaLanguage,
  FaUniversity,
  FaTimes,
  FaBars
} from 'react-icons/fa'
import heroImage from '../../assets/images/hero-medical.jpg'

// Context pour le thème et la langue
const ThemeContext = createContext()
const LanguageContext = createContext()

// Traductions
const translations = {
  fr: {
    // Navigation
    nav: {
      benefits: "Avantages",
      features: "Fonctionnalités",
      howItWorks: "Comment ça marche",
      pricing: "Tarifs",
      coverage: "Couverture",
      resources: "Ressources",
      faq: "FAQ",
      login: "Connexion",
      register: "Inscription gratuite"
    },
    // Hero
    hero: {
      badge: "⭐ Plus de 5 000 médecins nous font confiance au Cameroun",
      title1: "Médecin, plus jamais",
      title2: "sans remplacement.",
      description: "La première plateforme au Cameroun qui connecte les médecins remplaçants avec les hôpitaux, cliniques et cabinets médicaux en quelques clics.",
      cta1: "Commencer maintenant",
      cta2: "Découvrir la plateforme",
      missionCount: "+100 missions/jour",
      missionLabel: "Nouvelles opportunités",
      coverageCount: "10 régions",
      coverageLabel: "Couverture nationale"
    },
    // Stats
    stats: {
      doctors: "Médecins inscrits",
      partners: "Établissements partenaires",
      missions: "Missions pourvues",
      regions: "Régions couvertes",
      satisfaction: "Taux de satisfaction",
      support: "Support disponible"
    },
    // Benefits
    benefits: {
      badge: "Pourquoi nous choisir ?",
      title: "Médecin, laissez-nous gérer les contraintes !",
      subtitle: "Concentrez-vous uniquement sur vos missions et votre excellence médicale",
      items: [
        { title: "Demande gigantesque pour les médecins", description: "Des opportunités apparaissent quotidiennement pour les médecins remplaçants au Cameroun." },
        { title: "Connexion facile entre employeurs et médecins", description: "En quelques clics, vous trouvez votre prochain remplacement à Douala, Yaoundé ou ailleurs." },
        { title: "Gestion financière et organisation", description: "Suivez vos revenus en FCFA, gérez vos documents et organisez votre agenda." },
        { title: "Filtrage par spécialité et région", description: "Trouvez la mission parfaite selon votre spécialité et votre localisation au Cameroun." },
        { title: "Disponibilité en temps réel", description: "Recevez des notifications instantanées pour les missions urgentes." },
        { title: "Sécurité et conformité", description: "Tous les établissements sont vérifiés et certifiés par les autorités camerounaises." }
      ]
    },
    // Features
    features: {
      badge: "Technologie de pointe",
      title: "Tout pour réussir vos remplacements",
      subtitle: "Des outils innovants conçus spécialement pour les médecins remplaçants camerounais",
      items: [
        { title: "Téléconsultation intégrée", description: "Effectuez vos consultations à distance en toute sécurité." },
        { title: "Application mobile", description: "Gérez vos missions depuis votre smartphone." },
        { title: "Paiements en FCFA", description: "Recevez vos honoraires en FCFA rapidement et en toute sécurité." },
        { title: "Gestion des documents", description: "Centralisez tous vos documents professionnels." },
        { title: "Agenda intelligent", description: "Planifiez vos missions et évitez les conflits d'horaires." },
        { title: "Notifications WhatsApp", description: "Recevez les alertes de missions directement sur votre téléphone." },
        { title: "Matching intelligent", description: "Notre IA vous propose les missions les plus adaptées." },
        { title: "Tableau de bord analytique", description: "Visualisez vos performances et revenus en temps réel." }
      ]
    },
    // How it works
    howItWorks: {
      badge: "Processus simplifié",
      title: "Remplissez votre agenda en quelques clics",
      subtitle: "4 étapes simples pour trouver votre prochain remplacement au Cameroun",
      steps: [
        { title: "Inscription sur la plateforme", description: "Créez votre compte en moins de 3 minutes", duration: "3 min" },
        { title: "Validation de votre profil", description: "Vérification de vos documents et diplômes", duration: "24h" },
        { title: "Recherche par spécialité et région", description: "Filtrez les missions qui vous correspondent", duration: "30 sec" },
        { title: "Confirmation de votre mission", description: "Acceptez et commencez votre remplacement", duration: "1 clic" }
      ]
    },
    // Differentiators
    differentiators: {
      title: "Pourquoi MediConnect est différent ?",
      subtitle: "Des avantages exclusifs qui font la différence",
      items: [
        { title: "La première plateforme spécialisée pour médecins remplaçants au Cameroun", description: "Une solution unique conçue par des médecins pour des médecins camerounais." },
        { title: "Une équipe dédiée à trouver de nouvelles opportunités", description: "Notre équipe prospecte en continu pour vous apporter les meilleures missions." },
        { title: "Support premium et personnalisé", description: "Une assistance disponible 7j/7 pour vous accompagner dans votre parcours." }
      ]
    },
    // Pricing
    pricing: {
      badge: "Tarifs transparents",
      title: "Choisissez la formule qui vous correspond",
      subtitle: "Sans engagement, résiliable à tout moment",
      recommended: "Recommandé",
      plans: [
        { name: "Essentiel", price: "Gratuit", period: "toujours", description: "Pour débuter votre activité", features: ["Profil de base", "Accès aux missions", "Support par email", "3 candidatures par mois"], button: "Commencer gratuitement" },
        { name: "Professionnel", price: "15 000 FCFA", period: "/mois", description: "Pour les médecins actifs", features: ["Profil premium avec mise en avant", "Accès illimité aux missions", "Support prioritaire 24/7", "Candidatures illimitées", "Statistiques avancées", "Certification vérifiée"], button: "Choisir Professionnel" },
        { name: "Elite", price: "30 000 FCFA", period: "/mois", description: "Pour les experts", features: ["Tout du plan Professionnel", "Accès exclusif aux missions premium", "Gestionnaire de carrière dédié", "Formations incluses", "Assurance professionnelle", "Visibilité maximale"], button: "Choisir Elite" }
      ]
    },
    // Coverage
    coverage: {
      badge: "Présence nationale",
      title: "Nous sommes dans toutes les régions du Cameroun",
      description: "Une couverture complète pour vous permettre de trouver des missions partout où vous le souhaitez",
      regions: [
        { name: "Centre", cities: "Yaoundé, Mbalmayo, Ebolowa", count: "450+ missions" },
        { name: "Littoral", cities: "Douala, Edéa, Nkongsamba", count: "600+ missions" },
        { name: "Ouest", cities: "Bafoussam, Dschang, Mbouda", count: "350+ missions" },
        { name: "Nord-Ouest", cities: "Bamenda, Kumbo", count: "200+ missions" },
        { name: "Sud-Ouest", cities: "Buéa, Limbé, Kumba", count: "250+ missions" },
        { name: "Extrême-Nord", cities: "Maroua, Kousséri", count: "150+ missions" },
        { name: "Nord", cities: "Garoua, Ngaoundéré", count: "180+ missions" },
        { name: "Adamawa", cities: "Ngaoundéré, Tibati", count: "120+ missions" },
        { name: "Est", cities: "Bertoua, Yokadouma", count: "100+ missions" },
        { name: "Sud", cities: "Ebolowa, Ambam", count: "130+ missions" }
      ],
      activeMissions: "Missions en cours",
      viewAll: "Voir toutes les missions"
    },
    // Specialties
    specialties: {
      badge: "Toutes spécialités",
      title: "Des missions dans toutes les spécialités",
      subtitle: "Que vous soyez généraliste ou spécialiste, trouvez la mission qui vous correspond",
      list: ["Généraliste", "Cardiologie", "Pédiatrie", "Gynécologie", "Dermatologie", "Neurologie", "Orthopédie", "Psychiatrie", "Ophtalmologie", "Urgences", "Anesthésie", "Radiologie", "Oncologie", "Gériatrie", "Médecine du travail"]
    },
    // Partners
    partners: {
      badge: "Partenaires de confiance",
      title: "Ils nous font confiance",
      subtitle: "Rejoignez les meilleurs établissements de santé du Cameroun"
    },
    // Resources
    resources: {
      badge: "Ressources exclusives",
      title: "Accédez à nos ressources gratuites",
      subtitle: "Guides, webinaires et outils pour optimiser votre activité",
      items: [
        { title: "Guide du médecin remplaçant au Cameroun", type: "PDF", size: "2.5 MB" },
        { title: "Webinaire : Optimiser ses remplacements", type: "Vidéo", duration: "45 min" },
        { title: "Modèles de contrats (Cameroun)", type: "Document", size: "1.2 MB" },
        { title: "Barème des honoraires 2024 (FCFA)", type: "PDF", size: "1.8 MB" }
      ]
    },
    // FAQ
    faq: {
      badge: "Questions fréquentes",
      title: "Tout ce que vous devez savoir",
      subtitle: "Des réponses à vos questions les plus courantes",
      items: [
        { q: "Comment fonctionne l'inscription ?", a: "L'inscription est gratuite et se fait en moins de 3 minutes. Vous devez fournir vos informations personnelles, vos diplômes et votre numéro d'inscription à l'Ordre des Médecins du Cameroun. Notre équipe vérifie vos documents dans les 24 heures." },
        { q: "Quels types de missions proposez-vous au Cameroun ?", a: "Nous proposons tous types de missions : remplacements en clinique à Douala et Yaoundé, gardes à l'hôpital dans toutes les régions, consultations en cabinet, téléconsultations, et missions d'urgence. Les missions sont disponibles dans toutes les spécialités." },
        { q: "Comment sont réglés les paiements ?", a: "Les paiements sont automatisés et sécurisés. Vous recevez vos honoraires en FCFA directement sur votre compte bancaire ou Mobile Money (MTN Money, Orange Money) sous 48h après validation de la mission." },
        { q: "Puis-je choisir mes missions ?", a: "Absolument ! Vous avez un contrôle total sur les missions que vous acceptez. Vous pouvez filtrer par spécialité, région (Douala, Yaoundé, etc.), type d'établissement, horaires et rémunération." },
        { q: "Y a-t-il un engagement ?", a: "Aucun engagement. Vous êtes libre de prendre ou non les missions qui vous intéressent. Vous pouvez résilier votre abonnement à tout moment sans frais." },
        { q: "Comment sont vérifiés les établissements ?", a: "Nous vérifions rigoureusement tous les établissements partenaires : licences, certifications, agréments du Ministère de la Santé Publique du Cameroun, avis et historique. Votre sécurité et la qualité des soins sont notre priorité." }
      ]
    },
    // CTA
    cta: {
      title: "Prêt à ne plus jamais manquer de remplacement ?",
      subtitle: "Rejoignez la plus grande communauté de médecins remplaçants du Cameroun",
      button1: "Créer mon compte gratuitement",
      button2: "Parler à un conseiller",
      guarantee: "✅ Sans engagement • ✅ Inscription gratuite • ✅ Annulation à tout moment"
    },
    // Footer
    footer: {
      description: "La première plateforme spécialisée pour les médecins remplaçants au Cameroun.",
      quickLinks: "Liens rapides",
      support: "Support",
      contact: "Contact",
      rights: "Tous droits réservés.",
      tagline: "Une plateforme dédiée aux médecins remplaçants et aux établissements de santé du Cameroun"
    },
    paymentMethods: {
      title: "Moyens de paiement acceptés",
      mobileMoney: "Mobile Money",
      orangeMoney: "Orange Money",
      mtnMoney: "MTN Money",
      bankTransfer: "Virement bancaire",
      card: "Carte bancaire"
    }
  },
  en: {
    nav: {
      benefits: "Benefits",
      features: "Features",
      howItWorks: "How It Works",
      pricing: "Pricing",
      coverage: "Coverage",
      resources: "Resources",
      faq: "FAQ",
      login: "Login",
      register: "Free Sign Up"
    },
    hero: {
      badge: "⭐ Over 5,000 doctors trust us in Cameroon",
      title1: "Doctor, never again",
      title2: "without a replacement.",
      description: "The first platform in Cameroon connecting locum doctors with hospitals, clinics, and medical practices in just a few clicks.",
      cta1: "Start Now",
      cta2: "Discover the Platform",
      missionCount: "+100 missions/day",
      missionLabel: "New opportunities",
      coverageCount: "10 regions",
      coverageLabel: "National coverage"
    },
    stats: {
      doctors: "Registered Doctors",
      partners: "Partner Establishments",
      missions: "Missions Filled",
      regions: "Regions Covered",
      satisfaction: "Satisfaction Rate",
      support: "Support Available"
    },
    benefits: {
      badge: "Why Choose Us?",
      title: "Doctor, let us handle the headaches!",
      subtitle: "Focus only on your missions and medical excellence",
      items: [
        { title: "Huge demand for doctors", description: "Opportunities appear daily for locum doctors in Cameroon." },
        { title: "Easy connection between employers and doctors", description: "Find your next replacement in Douala, Yaoundé or elsewhere in just a few clicks." },
        { title: "Financial management and organization", description: "Track your income in FCFA, manage your documents and organize your schedule." },
        { title: "Filter by specialty and region", description: "Find the perfect mission based on your specialty and location in Cameroon." },
        { title: "Real-time availability", description: "Receive instant notifications for urgent missions." },
        { title: "Security and compliance", description: "All establishments are verified and certified by Cameroonian authorities." }
      ]
    },
    features: {
      badge: "Cutting-edge Technology",
      title: "Everything you need to succeed in your replacements",
      subtitle: "Innovative tools designed specifically for Cameroonian locum doctors",
      items: [
        { title: "Integrated Teleconsultation", description: "Conduct remote consultations securely." },
        { title: "Mobile App", description: "Manage your missions from your smartphone." },
        { title: "FCFA Payments", description: "Receive your fees in FCFA quickly and securely." },
        { title: "Document Management", description: "Centralize all your professional documents." },
        { title: "Smart Calendar", description: "Plan your missions and avoid schedule conflicts." },
        { title: "WhatsApp Notifications", description: "Receive mission alerts directly on your phone." },
        { title: "Smart Matching", description: "Our AI suggests the most suitable missions for you." },
        { title: "Analytics Dashboard", description: "View your performance and earnings in real-time." }
      ]
    },
    howItWorks: {
      badge: "Simplified Process",
      title: "Fill your schedule in a few clicks",
      subtitle: "4 simple steps to find your next replacement in Cameroon",
      steps: [
        { title: "Platform Registration", description: "Create your account in less than 3 minutes", duration: "3 min" },
        { title: "Profile Validation", description: "Verification of your documents and diplomas", duration: "24h" },
        { title: "Search by specialty and region", description: "Filter missions that match you", duration: "30 sec" },
        { title: "Confirm your mission", description: "Accept and start your replacement", duration: "1 click" }
      ]
    },
    differentiators: {
      title: "Why is MediConnect different?",
      subtitle: "Exclusive advantages that make the difference",
      items: [
        { title: "The first specialized platform for locum doctors in Cameroon", description: "A unique solution designed by doctors for Cameroonian doctors." },
        { title: "A dedicated team to find new opportunities", description: "Our team continuously prospects to bring you the best missions." },
        { title: "Premium and personalized support", description: "Assistance available 7 days a week to support you in your journey." }
      ]
    },
    pricing: {
      badge: "Transparent Pricing",
      title: "Choose the plan that suits you",
      subtitle: "No commitment, cancel anytime",
      recommended: "Recommended",
      plans: [
        { name: "Essential", price: "Free", period: "forever", description: "To start your activity", features: ["Basic profile", "Access to missions", "Email support", "3 applications per month"], button: "Start for free" },
        { name: "Professional", price: "15,000 FCFA", period: "/month", description: "For active doctors", features: ["Premium highlighted profile", "Unlimited access to missions", "Priority 24/7 support", "Unlimited applications", "Advanced statistics", "Verified certification"], button: "Choose Professional" },
        { name: "Elite", price: "30,000 FCFA", period: "/month", description: "For experts", features: ["Everything in Professional", "Exclusive access to premium missions", "Dedicated career manager", "Included training", "Professional insurance", "Maximum visibility"], button: "Choose Elite" }
      ]
    },
    coverage: {
      badge: "National Presence",
      title: "We are in all regions of Cameroon",
      description: "Complete coverage to find missions wherever you want",
      regions: [
        { name: "Centre", cities: "Yaoundé, Mbalmayo, Ebolowa", count: "450+ missions" },
        { name: "Littoral", cities: "Douala, Edéa, Nkongsamba", count: "600+ missions" },
        { name: "West", cities: "Bafoussam, Dschang, Mbouda", count: "350+ missions" },
        { name: "North-West", cities: "Bamenda, Kumbo", count: "200+ missions" },
        { name: "South-West", cities: "Buéa, Limbé, Kumba", count: "250+ missions" },
        { name: "Far North", cities: "Maroua, Kousséri", count: "150+ missions" },
        { name: "North", cities: "Garoua, Ngaoundéré", count: "180+ missions" },
        { name: "Adamawa", cities: "Ngaoundéré, Tibati", count: "120+ missions" },
        { name: "East", cities: "Bertoua, Yokadouma", count: "100+ missions" },
        { name: "South", cities: "Ebolowa, Ambam", count: "130+ missions" }
      ],
      activeMissions: "Active Missions",
      viewAll: "View all missions"
    },
    specialties: {
      badge: "All Specialties",
      title: "Missions in all specialties",
      subtitle: "Whether you're a general practitioner or specialist, find the mission that suits you",
      list: ["General Practitioner", "Cardiology", "Pediatrics", "Gynecology", "Dermatology", "Neurology", "Orthopedics", "Psychiatry", "Ophthalmology", "Emergency", "Anesthesiology", "Radiology", "Oncology", "Geriatrics", "Occupational Medicine"]
    },
    partners: {
      badge: "Trusted Partners",
      title: "They trust us",
      subtitle: "Join the best healthcare establishments in Cameroon"
    },
    resources: {
      badge: "Exclusive Resources",
      title: "Access our free resources",
      subtitle: "Guides, webinars and tools to optimize your activity",
      items: [
        { title: "Locum Doctor's Guide in Cameroon", type: "PDF", size: "2.5 MB" },
        { title: "Webinar: Optimize Your Replacements", type: "Video", duration: "45 min" },
        { title: "Contract Templates (Cameroon)", type: "Document", size: "1.2 MB" },
        { title: "2024 Fee Schedule (FCFA)", type: "PDF", size: "1.8 MB" }
      ]
    },
    faq: {
      badge: "Frequently Asked Questions",
      title: "Everything you need to know",
      subtitle: "Answers to your most common questions",
      items: [
        { q: "How does registration work?", a: "Registration is free and takes less than 3 minutes. You must provide your personal information, diplomas, and your registration number with the Cameroon Medical Council. Our team verifies your documents within 24 hours." },
        { q: "What types of missions do you offer in Cameroon?", a: "We offer all types of missions: clinic replacements in Douala and Yaoundé, hospital shifts in all regions, office consultations, teleconsultations, and emergency missions. Missions are available in all specialties." },
        { q: "How are payments made?", a: "Payments are automated and secure. You receive your fees in FCFA directly into your bank account or Mobile Money (MTN Money, Orange Money) within 48 hours after mission validation." },
        { q: "Can I choose my missions?", a: "Absolutely! You have full control over the missions you accept. You can filter by specialty, region (Douala, Yaoundé, etc.), type of establishment, hours, and compensation." },
        { q: "Is there a commitment?", a: "No commitment. You are free to take or not take the missions that interest you. You can cancel your subscription at any time without fees." },
        { q: "How are establishments verified?", a: "We rigorously verify all partner establishments: licenses, certifications, approvals from the Cameroon Ministry of Public Health, reviews and history. Your safety and quality of care are our priority." }
      ]
    },
    cta: {
      title: "Ready to never miss a replacement again?",
      subtitle: "Join the largest community of locum doctors in Cameroon",
      button1: "Create my free account",
      button2: "Talk to a consultant",
      guarantee: "✅ No commitment • ✅ Free registration • ✅ Cancel anytime"
    },
    footer: {
      description: "The first specialized platform for locum doctors in Cameroon.",
      quickLinks: "Quick Links",
      support: "Support",
      contact: "Contact",
      rights: "All rights reserved.",
      tagline: "A platform dedicated to locum doctors and healthcare establishments in Cameroon"
    },
    paymentMethods: {
      title: "Accepted Payment Methods",
      mobileMoney: "Mobile Money",
      orangeMoney: "Orange Money",
      mtnMoney: "MTN Money",
      bankTransfer: "Bank Transfer",
      card: "Credit Card"
    }
  }
}

// Composant principal
const LandingPage = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeFaq, setActiveFaq] = useState(null)
  const [darkMode, setDarkMode] = useState(false)
  const [language, setLanguage] = useState('fr')
  const { scrollYProgress } = useScroll()

  const t = translations[language]

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setIsMobileMenuOpen(false)
    }
  }

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index)
  }

  const toggleTheme = () => {
    setDarkMode(!darkMode)
  }

  const toggleLanguage = () => {
    setLanguage(language === 'fr' ? 'en' : 'fr')
  }

  const stats = [
    { value: "5 000+", label: t.stats.doctors, color: "text-blue-600 dark:text-blue-400", icon: FaUserMd },
    { value: "500+", label: t.stats.partners, color: "text-purple-600 dark:text-purple-400", icon: FaHospital },
    { value: "50 000+", label: t.stats.missions, color: "text-green-600 dark:text-green-400", icon: FaCalendarCheck },
    { value: "10", label: t.stats.regions, color: "text-orange-600 dark:text-orange-400", icon: FaGlobe },
    { value: "98%", label: t.stats.satisfaction, color: "text-red-600 dark:text-red-400", icon: FaHeartbeat },
    { value: "24/7", label: t.stats.support, color: "text-indigo-600 dark:text-indigo-400", icon: FaHeadset }
  ]

  const benefits = t.benefits.items.map((item, index) => ({
    icon: [FaUsers, FaHandshake, FaChartLine, FaMapMarkerAlt, FaClock, FaShieldAlt][index],
    title: item.title,
    description: item.description,
    color: ["from-blue-500 to-blue-600", "from-purple-500 to-purple-600", "from-green-500 to-green-600", "from-orange-500 to-orange-600", "from-red-500 to-red-600", "from-indigo-500 to-indigo-600"][index],
    delay: index * 0.1
  }))

  const features = t.features.items.map((item, index) => ({
    icon: [FaVideo, FaMobileAlt, FaCreditCard, FaRegCreditCard, FaMoneyBillWave, FaFileInvoice, FaCalendarAlt, FaWhatsapp, FaRobot, FaChartBar][index],
    title: item.title,
    description: item.description
  }))

  const steps = t.howItWorks.steps.map((step, index) => ({
    number: (index + 1).toString(),
    title: step.title,
    description: step.description,
    icon: [FaIdCard, FaCertificate, FaSearch, FaCalendarCheck][index],
    duration: step.duration
  }))

  const differentiators = t.differentiators.items.map((item, index) => ({
    number: (index + 1).toString(),
    title: item.title,
    description: item.description,
    icon: [FaRocket, FaUsers, FaHeadset][index]
  }))

  const pricingPlans = t.pricing.plans.map((plan, index) => ({
    name: plan.name,
    price: plan.price,
    period: plan.period,
    description: plan.description,
    features: plan.features,
    recommended: index === 1,
    buttonText: plan.button,
    color: index === 0 ? "from-gray-500 to-gray-600" : index === 1 ? "from-blue-600 to-purple-600" : "from-purple-600 to-pink-600"
  }))

  const regions = t.coverage.regions

  const specialties = t.specialties.list

  const resources = t.resources.items

  const faqs = t.faq.items

  const partners = [
    { name: "Hôpital Central de Yaoundé", type: "Hôpital public", city: "Yaoundé" },
    { name: "Clinique La Cathédrale", type: "Clinique privée", city: "Douala" },
    { name: "Hôpital Gynéco-Obstétrique", type: "Hôpital spécialisé", city: "Yaoundé" },
    { name: "Polyclinique de Bonanjo", type: "Polyclinique", city: "Douala" },
    { name: "Centre Médical de la CNPS", type: "Centre médical", city: "Yaoundé" },
    { name: "Clinique de l'Espoir", type: "Clinique privée", city: "Bafoussam" }
  ]

  // Menu mobile variants pour animation depuis la gauche
  const mobileMenuVariants = {
    hidden: {
      x: "-100%",
      opacity: 0,
      transition: {
        type: "tween",
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "tween",
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    exit: {
      x: "-100%",
      opacity: 0,
      transition: {
        type: "tween",
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  }

  // Overlay variants
  const overlayVariants = {
    hidden: {
      opacity: 0,
      transition: {
        duration: 0.2
      }
    },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.2
      }
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.2
      }
    }
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-blue-50'}`}>
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? (darkMode ? 'bg-gray-900/95 backdrop-blur-md shadow-lg' : 'bg-white/95 backdrop-blur-md shadow-lg') : 'bg-transparent'}`}>
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600 bg-clip-text text-transparent cursor-pointer"
              onClick={() => scrollToSection('hero')}
            >
              MediConnect
            </motion.div>

            <div className="hidden md:flex items-center space-x-6">
              {['benefits', 'features', 'how-it-works', 'pricing', 'coverage', 'resources', 'faq'].map((section) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className={`transition-colors font-medium text-sm ${darkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-600'}`}
                >
                  {t.nav[section === 'how-it-works' ? 'howItWorks' : section]}
                </button>
              ))}
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-colors ${darkMode ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                {darkMode ? <FaSun /> : <FaMoon />}
              </button>
              <button
                onClick={toggleLanguage}
                className={`p-2 rounded-lg transition-colors flex items-center space-x-1 ${darkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                <FaLanguage />
                <span className="text-sm">{language === 'fr' ? 'FR' : 'EN'}</span>
              </button>
              <Link
                to="/connexion"
                className={`px-4 py-2 rounded-lg transition-all font-medium ${darkMode ? 'text-blue-400 border-2 border-blue-400 hover:bg-blue-400/10' : 'text-blue-600 border-2 border-blue-600 hover:bg-blue-50'}`}
              >
                {t.nav.login}
              </Link>
              <Link
                to="/inscription"
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg hover:shadow-lg transition-all font-medium"
              >
                {t.nav.register}
              </Link>
            </div>

            {/* Mobile Menu Buttons */}
            <div className="flex items-center space-x-2 md:hidden">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-colors ${darkMode ? 'bg-gray-800 text-yellow-400' : 'bg-gray-100 text-gray-700'}`}
              >
                {darkMode ? <FaSun /> : <FaMoon />}
              </button>
              <button
                onClick={toggleLanguage}
                className={`p-2 rounded-lg transition-colors ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'}`}
              >
                <FaLanguage />
              </button>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`p-2 rounded-lg transition-colors ${darkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                {isMobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu - Animation depuis la gauche */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Menu Panel - Depuis la gauche */}
            <motion.div
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={`fixed top-0 left-0 w-4/5 max-w-sm h-full z-50 md:hidden shadow-2xl ${darkMode ? 'bg-gray-900' : 'bg-white'}`}
            >
              <div className="flex flex-col h-full">
                {/* Header du menu mobile */}
                <div className={`p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <div className="flex items-center justify-between">
                    <h2 className={`text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600 bg-clip-text text-transparent`}>
                      MediConnect
                    </h2>
                    <button
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
                    >
                      <FaTimes className={darkMode ? 'text-gray-400' : 'text-gray-600'} />
                    </button>
                  </div>
                  <p className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {t.footer.tagline}
                  </p>
                </div>

                {/* Navigation Links */}
                <div className="flex-1 overflow-y-auto py-4">
                  {['benefits', 'features', 'how-it-works', 'pricing', 'coverage', 'resources', 'faq'].map((section, index) => (
                    <motion.button
                      key={section}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => scrollToSection(section)}
                      className={`block w-full text-left px-6 py-4 transition-colors font-medium capitalize border-b ${darkMode ? 'text-gray-300 hover:text-blue-400 hover:bg-gray-800 border-gray-800' : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50 border-gray-100'}`}
                    >
                      {t.nav[section === 'how-it-works' ? 'howItWorks' : section]}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section id="hero" className="pt-28 pb-20 px-4 sm:px-6 overflow-hidden">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full ${darkMode ? 'bg-blue-900/30' : 'bg-blue-100'}`}
              >
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className={`font-medium ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>{t.hero.badge}</span>
              </motion.div>

              <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight ${darkMode ? 'text-white' : ''}`}>
                <span className="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600 bg-clip-text text-transparent">
                  {t.hero.title1}
                </span>
                <br />
                <span className={darkMode ? 'text-gray-200' : 'text-gray-800'}>{t.hero.title2}</span>
              </h1>

              <p className={`text-lg sm:text-xl leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {t.hero.description}
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/inscription"
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl font-semibold hover:shadow-xl transition-all flex items-center justify-center space-x-2 group"
                >
                  <span>{t.hero.cta1}</span>
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => scrollToSection('how-it-works')}
                  className={`px-8 py-4 border-2 rounded-xl font-semibold transition-all ${darkMode ? 'border-gray-600 text-gray-300 hover:border-blue-500 hover:bg-blue-500/10' : 'border-gray-300 text-gray-700 hover:border-blue-600 hover:bg-blue-50'}`}
                >
                  {t.hero.cta2}
                </motion.button>
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 pt-8 border-t border-gray-200 dark:border-gray-700">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.05 }}
                    className="text-center"
                  >
                    <div className={`text-xl sm:text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                    <div className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative z-10">
                <img
                  src={heroImage}
                  alt="Médecin remplaçant Cameroun"
                  className="rounded-2xl shadow-2xl w-full"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-blue-800/20 rounded-2xl"></div>
              </div>

              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className={`absolute -top-6 -right-6 p-4 rounded-xl shadow-xl z-20 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                    <FaCheckCircle className="text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <div className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{t.hero.missionCount}</div>
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{t.hero.missionLabel}</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                className={`absolute -bottom-6 -left-6 p-4 rounded-xl shadow-xl z-20 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <FaMapMarkerAlt className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <div className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{t.hero.coverageCount}</div>
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{t.hero.coverageLabel}</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className={`py-20 px-4 sm:px-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full mb-6 ${darkMode ? 'bg-blue-900/30' : 'bg-blue-100'}`}>
              <FaHeartbeat className={`${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              <span className={`font-medium ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>{t.benefits.badge}</span>
            </div>
            <h2 className={`text-3xl sm:text-4xl font-bold mb-4 ${darkMode ? 'text-white' : ''}`}>
              <span className="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600 bg-clip-text text-transparent">
                {t.benefits.title}
              </span>
            </h2>
            <p className={`text-lg sm:text-xl max-w-3xl mx-auto ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {t.benefits.subtitle}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: benefit.delay }}
                whileHover={{ y: -10 }}
                className="group"
              >
                <div className={`p-8 rounded-2xl transition-all duration-300 h-full ${darkMode ? 'bg-gray-700 border border-gray-600 hover:shadow-2xl' : 'bg-white border border-gray-100 hover:shadow-2xl'}`}>
                  <div className={`w-16 h-16 bg-gradient-to-r ${benefit.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <benefit.icon className="text-white text-2xl" />
                  </div>
                  <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>{benefit.title}</h3>
                  <p className={`leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{benefit.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className={`py-20 px-4 sm:px-6 ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-blue-100'}`}>
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full mb-6 ${darkMode ? 'bg-blue-900/30' : 'bg-blue-100'}`}>
              <FaRocket className={`${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              <span className={`font-medium ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>{t.features.badge}</span>
            </div>
            <h2 className={`text-3xl sm:text-4xl font-bold mb-4 ${darkMode ? 'text-white' : ''}`}>
              <span className="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600 bg-clip-text text-transparent">
                {t.features.title}
              </span>
            </h2>
            <p className={`text-lg sm:text-xl max-w-3xl mx-auto ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {t.features.subtitle}
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className={`p-6 rounded-xl transition-all ${darkMode ? 'bg-gray-800 hover:shadow-xl' : 'bg-white hover:shadow-xl'}`}
              >
                <feature.icon className={`text-3xl mb-4 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                <h3 className={`font-bold text-lg mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>{feature.title}</h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{feature.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Payment Methods Section */}
          <div className="mt-16">
            <h3 className={`text-xl font-bold text-center mb-8 ${darkMode ? 'text-white' : 'text-gray-800'}`}>{t.paymentMethods?.title || "Moyens de paiement acceptés"}</h3>
            <div className="flex flex-wrap justify-center gap-6">
              <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white shadow-md'}`}>
                <FaMobileAlt className="text-orange-500" />
                <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Orange Money</span>
              </div>
              <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white shadow-md'}`}>
                <FaMobileAlt className="text-yellow-500" />
                <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>MTN Money</span>
              </div>
              <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white shadow-md'}`}>
                <FaRegCreditCard className="text-blue-500" />
                <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Virement bancaire</span>
              </div>
              <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white shadow-md'}`}>
                <FaCreditCard className="text-green-500" />
                <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Carte bancaire</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className={`py-20 px-4 sm:px-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full mb-6 ${darkMode ? 'bg-blue-900/30' : 'bg-blue-100'}`}>
              <FaCalendarCheck className={`${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              <span className={`font-medium ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>{t.howItWorks.badge}</span>
            </div>
            <h2 className={`text-3xl sm:text-4xl font-bold mb-4 ${darkMode ? 'text-white' : ''}`}>
              <span className="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600 bg-clip-text text-transparent">
                {t.howItWorks.title}
              </span>
            </h2>
            <p className={`text-lg sm:text-xl max-w-3xl mx-auto ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {t.howItWorks.subtitle}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className={`p-6 rounded-2xl text-center transition-all h-full ${darkMode ? 'bg-gray-700' : 'bg-gradient-to-br from-blue-50 to-white'} hover:shadow-xl`}>
                  <div className="w-16 h-16 mx-auto bg-gradient-to-r from-blue-600 to-blue-800 rounded-full flex items-center justify-center text-2xl mb-4 shadow-lg">
                    <step.icon className="text-white" />
                  </div>
                  <div className="absolute -top-3 right-4 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {step.number}
                  </div>
                  <h3 className={`text-lg font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>{step.title}</h3>
                  <p className={`text-sm mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{step.description}</p>
                  <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">{step.duration}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                    <FaArrowRight className={`text-xl ${darkMode ? 'text-blue-400' : 'text-blue-300'}`} />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Differentiators Section */}
      <section className="py-20 px-4 sm:px-6 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">{t.differentiators.title}</h2>
            <p className="text-lg text-white/90 max-w-3xl mx-auto">{t.differentiators.subtitle}</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {differentiators.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/20 transition-all"
              >
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-blue-600 font-bold text-xl mb-4">
                  {item.number}
                </div>
                <item.icon className="text-white text-3xl mb-4" />
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-white/80">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className={`py-20 px-4 sm:px-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full mb-6 ${darkMode ? 'bg-blue-900/30' : 'bg-blue-100'}`}>
              <FaMoneyBillWave className={`${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              <span className={`font-medium ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>{t.pricing.badge}</span>
            </div>
            <h2 className={`text-3xl sm:text-4xl font-bold mb-4 ${darkMode ? 'text-white' : ''}`}>
              <span className="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600 bg-clip-text text-transparent">
                {t.pricing.title}
              </span>
            </h2>
            <p className={`text-lg sm:text-xl max-w-3xl mx-auto ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {t.pricing.subtitle}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className={`relative ${plan.recommended ? 'transform md:scale-105' : ''}`}
              >
                {plan.recommended && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold z-10">
                    {t.pricing.recommended}
                  </div>
                )}
                <div className={`rounded-2xl shadow-xl overflow-hidden border-2 ${plan.recommended ? 'border-blue-500' : (darkMode ? 'border-gray-600' : 'border-gray-100')} ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
                  <div className={`bg-gradient-to-r ${plan.color} p-6 text-white`}>
                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                    <div className="text-3xl font-bold">{plan.price}</div>
                    <div className="text-white/80 text-sm">{plan.period}</div>
                    <p className="mt-2 text-white/90 text-sm">{plan.description}</p>
                  </div>
                  <div className="p-6">
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center space-x-2">
                          <FaCheckCircle className="text-green-500 flex-shrink-0" />
                          <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Link
                      to="/inscription"
                      className={`w-full py-3 rounded-lg font-semibold transition-all ${plan.recommended ? 'bg-gradient-to-r from-blue-600 to-blue-800 text-white hover:shadow-lg' : (darkMode ? 'border-2 border-blue-400 text-blue-400 hover:bg-blue-400/10' : 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50')}`}
                    >
                      {plan.buttonText}
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Coverage Section */}
      <section id="coverage" className={`py-20 px-4 sm:px-6 ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-blue-100'}`}>
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full mb-6 ${darkMode ? 'bg-blue-900/30' : 'bg-blue-100'}`}>
                <FaGlobe className={`${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                <span className={`font-medium ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>{t.coverage.badge}</span>
              </div>
              <h2 className={`text-3xl sm:text-4xl font-bold mb-6 ${darkMode ? 'text-white' : ''}`}>
                <span className="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600 bg-clip-text text-transparent">
                  {t.coverage.title}
                </span>
              </h2>
              <p className={`text-lg mb-8 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {t.coverage.description}
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                {regions.slice(0, 8).map((region, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className={`rounded-xl p-4 shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
                  >
                    <div className={`font-bold text-lg ${darkMode ? 'text-blue-400' : 'text-blue-800'}`}>{region.name}</div>
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{region.cities}</div>
                    <div className="text-green-600 dark:text-green-400 text-sm font-semibold mt-1">{region.count}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className={`rounded-2xl shadow-xl p-8 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <h3 className={`text-2xl font-bold mb-6 text-center ${darkMode ? 'text-white' : 'text-gray-800'}`}>{t.coverage.activeMissions}</h3>
                <div className="space-y-4">
                  {[
                    { region: "Douala", specialty: "Cardiologie", urgent: true, reward: "85 000 FCFA" },
                    { region: "Yaoundé", specialty: "Pédiatrie", urgent: false, reward: "75 000 FCFA" },
                    { region: "Bafoussam", specialty: "Généraliste", urgent: true, reward: "65 000 FCFA" },
                    { region: "Garoua", specialty: "Urgences", urgent: false, reward: "90 000 FCFA" }
                  ].map((mission, i) => (
                    <div key={i} className={`flex items-center justify-between p-4 rounded-lg transition-all cursor-pointer ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-blue-50'}`}>
                      <div>
                        <div className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{mission.specialty}</div>
                        <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{mission.region}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-blue-600 dark:text-blue-400">{mission.reward}</div>
                        {mission.urgent && (
                          <span className="text-xs bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 px-2 py-1 rounded-full">Urgent</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <button className={`w-full mt-6 py-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg font-semibold hover:shadow-lg transition-all`}>
                  {t.coverage.viewAll}
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Specialties Section */}
      <section className={`py-20 px-4 sm:px-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full mb-6 ${darkMode ? 'bg-blue-900/30' : 'bg-blue-100'}`}>
              <FaStethoscope className={`${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              <span className={`font-medium ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>{t.specialties.badge}</span>
            </div>
            <h2 className={`text-3xl sm:text-4xl font-bold mb-4 ${darkMode ? 'text-white' : ''}`}>
              <span className="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600 bg-clip-text text-transparent">
                {t.specialties.title}
              </span>
            </h2>
            <p className={`text-lg max-w-3xl mx-auto ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {t.specialties.subtitle}
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-3">
            {specialties.map((specialty, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.01 }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${darkMode ? 'bg-blue-900/30 text-blue-300 hover:bg-blue-900/50' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'}`}
              >
                {specialty}
              </motion.span>
            ))}
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className={`py-20 px-4 sm:px-6 ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-blue-100'}`}>
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full mb-6 ${darkMode ? 'bg-blue-900/30' : 'bg-blue-100'}`}>
              <FaBuilding className={`${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              <span className={`font-medium ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>{t.partners.badge}</span>
            </div>
            <h2 className={`text-3xl sm:text-4xl font-bold mb-4 ${darkMode ? 'text-white' : ''}`}>
              <span className="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600 bg-clip-text text-transparent">
                {t.partners.title}
              </span>
            </h2>
            <p className={`text-lg max-w-3xl mx-auto ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {t.partners.subtitle}
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {partners.map((partner, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className={`rounded-xl p-4 text-center shadow-md transition-all ${darkMode ? 'bg-gray-800 hover:shadow-xl' : 'bg-white hover:shadow-xl'}`}
              >
                <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-2 ${darkMode ? 'bg-blue-900/30' : 'bg-blue-50'}`}>
                  <FaHospital className={`text-2xl ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                </div>
                <div className={`text-xs font-semibold mt-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>{partner.name}</div>
                <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{partner.type}</div>
                <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{partner.city}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section id="resources" className={`py-20 px-4 sm:px-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full mb-6 ${darkMode ? 'bg-blue-900/30' : 'bg-blue-100'}`}>
              <FaBookOpen className={`${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              <span className={`font-medium ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>{t.resources.badge}</span>
            </div>
            <h2 className={`text-3xl sm:text-4xl font-bold mb-4 ${darkMode ? 'text-white' : ''}`}>
              <span className="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600 bg-clip-text text-transparent">
                {t.resources.title}
              </span>
            </h2>
            <p className={`text-lg max-w-3xl mx-auto ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {t.resources.subtitle}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6">
            {resources.map((resource, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`rounded-xl p-6 transition-all cursor-pointer ${darkMode ? 'bg-gray-700 hover:shadow-xl' : 'bg-gradient-to-br from-blue-50 to-white hover:shadow-xl'}`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${darkMode ? 'bg-blue-900/30' : 'bg-blue-100'}`}>
                  {resource.type === "PDF" ? <FaFileInvoice className={`text-xl ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} /> : <FaVideo className={`text-xl ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />}
                </div>
                <h3 className={`font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>{resource.title}</h3>
                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {resource.type} • {resource.size || resource.duration}
                </div>
                <button className={`mt-4 text-sm font-semibold hover:underline ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                  Télécharger →
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className={`py-20 px-4 sm:px-6 ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-blue-100'}`}>
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full mb-6 ${darkMode ? 'bg-blue-900/30' : 'bg-blue-100'}`}>
              <FaComments className={`${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              <span className={`font-medium ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>{t.faq.badge}</span>
            </div>
            <h2 className={`text-3xl sm:text-4xl font-bold mb-4 ${darkMode ? 'text-white' : ''}`}>
              <span className="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600 bg-clip-text text-transparent">
                {t.faq.title}
              </span>
            </h2>
            <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {t.faq.subtitle}
            </p>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className={`rounded-xl shadow-md overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className={`w-full px-6 py-4 text-left flex justify-between items-center transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}
                >
                  <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{faq.q}</span>
                  <motion.span
                    animate={{ rotate: activeFaq === index ? 180 : 0 }}
                    className={darkMode ? 'text-blue-400' : 'text-blue-600'}
                  >
                    ▼
                  </motion.span>
                </button>
                {activeFaq === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className={`px-6 pb-4 border-t ${darkMode ? 'border-gray-700 text-gray-300' : 'border-gray-100 text-gray-600'}`}
                  >
                    {faq.a}
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8">
            <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Vous avez d'autres questions ?</p>
            <button className={`mt-2 font-semibold hover:underline ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
              Contactez notre équipe →
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">{t.cta.title}</h2>
            <p className="text-lg sm:text-xl text-white/90 mb-8">{t.cta.subtitle}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/inscription"
                className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:shadow-xl transition-all flex items-center justify-center space-x-2 group"
              >
                <span>{t.cta.button1}</span>
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 border-2 border-white text-white rounded-xl font-semibold hover:bg-white/10 transition-colors"
              >
                {t.cta.button2}
              </motion.button>
            </div>
            <p className="text-white/80 text-sm mt-6">{t.cta.guarantee}</p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`relative ${darkMode ? 'bg-gray-900' : 'bg-gray-900'} overflow-hidden`}>
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-purple-600/10"></div>
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          {/* Main Footer Content */}
          <div className="py-12 md:py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">

              {/* Column 1 - Brand & Description */}
              <div className="lg:col-span-2">
                <div className="mb-6">
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    MediConnect
                  </h3>
                  <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mt-2 rounded-full"></div>
                </div>
                <p className="text-gray-400 mb-6 leading-relaxed">
                  {t.footer.description}
                </p>
                <div className="flex space-x-4 mb-6">
                  <motion.a
                    whileHover={{ y: -3, scale: 1.05 }}
                    href="#"
                    className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 flex items-center justify-center transition-all duration-300 group"
                  >
                    <FaFacebook className="text-gray-400 group-hover:text-white transition-colors" />
                  </motion.a>
                  <motion.a
                    whileHover={{ y: -3, scale: 1.05 }}
                    href="#"
                    className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 flex items-center justify-center transition-all duration-300 group"
                  >
                    <FaTwitter className="text-gray-400 group-hover:text-white transition-colors" />
                  </motion.a>
                  <motion.a
                    whileHover={{ y: -3, scale: 1.05 }}
                    href="#"
                    className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 flex items-center justify-center transition-all duration-300 group"
                  >
                    <FaLinkedin className="text-gray-400 group-hover:text-white transition-colors" />
                  </motion.a>
                  <motion.a
                    whileHover={{ y: -3, scale: 1.05 }}
                    href="#"
                    className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 flex items-center justify-center transition-all duration-300 group"
                  >
                    <FaInstagram className="text-gray-400 group-hover:text-white transition-colors" />
                  </motion.a>
                </div>
                {/* Trust badges */}
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center space-x-2 bg-gray-800/50 rounded-lg px-3 py-2">
                    <FaShieldAlt className="text-green-400 text-sm" />
                    <span className="text-xs text-gray-400">100% sécurisé</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-gray-800/50 rounded-lg px-3 py-2">
                    <FaCheckCircle className="text-blue-400 text-sm" />
                    <span className="text-xs text-gray-400">Certifié ONIAM</span>
                  </div>
                </div>
              </div>

              {/* Column 2 - Quick Links */}
              <div>
                <h4 className="text-white font-semibold text-lg mb-4 flex items-center space-x-2">
                  <FaArrowRight className="text-blue-400 text-sm" />
                  <span>{t.footer.quickLinks}</span>
                </h4>
                <ul className="space-y-3">
                  {['benefits', 'features', 'how-it-works', 'pricing', 'coverage', 'faq'].map((link, index) => (
                    <li key={link}>
                      <motion.button
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => scrollToSection(link)}
                        className="text-gray-400 hover:text-white transition-colors text-sm flex items-center space-x-2 group"
                      >
                        <span className="w-1 h-1 bg-blue-400 rounded-full group-hover:w-2 transition-all"></span>
                        <span className="group-hover:translate-x-1 transition-transform">
                          {t.nav[link === 'how-it-works' ? 'howItWorks' : link]}
                        </span>
                      </motion.button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 3 - Resources & Support */}
              <div>
                <h4 className="text-white font-semibold text-lg mb-4 flex items-center space-x-2">
                  <FaBookOpen className="text-blue-400 text-sm" />
                  <span>Ressources</span>
                </h4>
                <ul className="space-y-3">
                  <li>
                    <button className="text-gray-400 hover:text-white transition-colors text-sm flex items-center space-x-2 group">
                      <span className="w-1 h-1 bg-blue-400 rounded-full group-hover:w-2 transition-all"></span>
                      <span>Blog médical</span>
                    </button>
                  </li>
                  <li>
                    <button className="text-gray-400 hover:text-white transition-colors text-sm flex items-center space-x-2 group">
                      <span className="w-1 h-1 bg-blue-400 rounded-full group-hover:w-2 transition-all"></span>
                      <span>Webinaires gratuits</span>
                    </button>
                  </li>
                  <li>
                    <button className="text-gray-400 hover:text-white transition-colors text-sm flex items-center space-x-2 group">
                      <span className="w-1 h-1 bg-blue-400 rounded-full group-hover:w-2 transition-all"></span>
                      <span>Guides et tutoriels</span>
                    </button>
                  </li>
                  <li>
                    <button className="text-gray-400 hover:text-white transition-colors text-sm flex items-center space-x-2 group">
                      <span className="w-1 h-1 bg-blue-400 rounded-full group-hover:w-2 transition-all"></span>
                      <span>Centre d'aide</span>
                    </button>
                  </li>
                </ul>
              </div>

              {/* Column 4 - Contact & Newsletter */}
              <div>
                <h4 className="text-white font-semibold text-lg mb-4 flex items-center space-x-2">
                  <FaEnvelope className="text-blue-400 text-sm" />
                  <span>{t.footer.contact}</span>
                </h4>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center space-x-3 text-gray-400 hover:text-white transition-colors group">
                    <div className="w-8 h-8 rounded-full bg-gray-800 group-hover:bg-blue-500/20 flex items-center justify-center transition-colors">
                      <FaPhoneAlt className="text-sm text-blue-400" />
                    </div>
                    <span className="text-sm">+237 222 00 00 00</span>
                  </li>
                  <li className="flex items-center space-x-3 text-gray-400 hover:text-white transition-colors group">
                    <div className="w-8 h-8 rounded-full bg-gray-800 group-hover:bg-blue-500/20 flex items-center justify-center transition-colors">
                      <FaWhatsapp className="text-sm text-green-400" />
                    </div>
                    <span className="text-sm">+237 6 99 99 99 99</span>
                  </li>
                  <li className="flex items-center space-x-3 text-gray-400 hover:text-white transition-colors group">
                    <div className="w-8 h-8 rounded-full bg-gray-800 group-hover:bg-blue-500/20 flex items-center justify-center transition-colors">
                      <FaEnvelope className="text-sm text-blue-400" />
                    </div>
                    <span className="text-sm">contact@mediconnect.cm</span>
                  </li>
                  <li className="flex items-center space-x-3 text-gray-400 hover:text-white transition-colors group">
                    <div className="w-8 h-8 rounded-full bg-gray-800 group-hover:bg-blue-500/20 flex items-center justify-center transition-colors">
                      <FaMapMarkerAlt className="text-sm text-red-400" />
                    </div>
                    <span className="text-sm">Yaoundé, Cameroun</span>
                  </li>
                </ul>

                {/* Newsletter */}
                <div className="mt-4">
                  <h5 className="text-white text-sm font-semibold mb-2">Newsletter</h5>
                  <p className="text-gray-400 text-xs mb-3">Recevez nos actualités et offres exclusives</p>
                  <div className="flex">
                    <input
                      type="email"
                      placeholder="Votre email"
                      className="flex-1 px-3 py-2 text-sm bg-gray-800 border border-gray-700 rounded-l-lg focus:outline-none focus:border-blue-500 text-white placeholder-gray-500"
                    />
                    <button className="px-3 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm rounded-r-lg hover:shadow-lg transition-all">
                      S'abonner
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className={`py-6 border-t ${darkMode ? 'border-gray-800' : 'border-gray-800'}`}>
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-center md:text-left">
                <p className="text-gray-400 text-sm">
                  &copy; 2024 MediConnect. {t.footer.rights}
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  {t.footer.tagline}
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-4">
                <button className="text-gray-400 hover:text-white text-xs transition-colors">
                  Conditions générales
                </button>
                <span className="text-gray-600 text-xs">|</span>
                <button className="text-gray-400 hover:text-white text-xs transition-colors">
                  Confidentialité
                </button>
                <span className="text-gray-600 text-xs">|</span>
                <button className="text-gray-400 hover:text-white text-xs transition-colors">
                  Cookies
                </button>
                <span className="text-gray-600 text-xs">|</span>
                <button className="text-gray-400 hover:text-white text-xs transition-colors">
                  Mentions légales
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative bottom gradient */}
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
      </footer>
    </div>
  )
}

export default LandingPage
