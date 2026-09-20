// Contenus éditoriaux partagés. Aucun projet ni renseignement personnel fictif.
export const studio = {
  name: 'Baerg Design',
  description:
    'Deux apprentis développeurs full-stack. Un studio à taille humaine pour créer ou repenser votre site web.',
  email: '',
  legal: {
    publisher: '',
    legalForm: '',
    address: '',
    registration: '',
    publicationDirector: '',
    hostName: '',
    hostAddress: '',
    hostContact: '',
    privacyContact: '',
    retention: '',
    processingLocation: '',
  },
};

export const navigation = [
  { href: '/', label: 'Accueil' },
  { href: '/a-propos/', label: 'À propos' },
  { href: '/realisations/', label: 'Réalisations' },
  { href: '/contact/', label: 'Contact' },
];

export const services = [
  {
    name: 'Création de sites web',
    text: 'Nous concevons les pages pour présenter votre activité, vos services et les moyens de vous contacter.',
    tags: 'SITE VITRINE · SUR MESURE',
    icon: 'window',
  },
  {
    name: 'Refonte de sites',
    text: 'Nous revoyons la structure, les contenus et le design de votre site pour rendre les informations plus faciles à trouver.',
    tags: 'STRUCTURE · CONTENUS · DESIGN',
    icon: 'refresh',
  },
  {
    name: 'Une présence qui s’adapte',
    text: 'Nous adaptons la navigation, les textes et les formulaires aux téléphones, tablettes et ordinateurs.',
    tags: 'RESPONSIVE · CLARTÉ',
    icon: 'devices',
  },
];

export const method = [
  {
    name: 'Échange',
    text: 'Nous parlons de votre activité, de vos envies et de ce que votre site doit accomplir.',
  },
  {
    name: 'Conception',
    text: 'Nous organisons les contenus et dessinons une direction visuelle, à valider avec vous.',
  },
  {
    name: 'Développement',
    text: 'Nous développons les pages et vérifions les liens, les formulaires et leur affichage sur les différents écrans.',
  },
  {
    name: 'Mise en ligne',
    text: 'Après les derniers ajustements, nous publions votre site et vous expliquons son fonctionnement.',
  },
];

export const projectTypes = ['À définir', 'Création de site', 'Refonte de site', 'Autre projet'];
export const budgets = [
  'À définir',
  'Moins de 1 000 CHF',
  '1 000 à 3 000 CHF',
  '3 000 à 5 000 CHF',
  'Plus de 5 000 CHF',
];

// Voir README pour le schéma. Les projets non publiés ne sont jamais affichés.
export const projects = [
  {
    published: true,
    name: 'Midi & Compagnie',
    nature: 'Concept non commandé',
    image: '/images/midi-et-compagnie-preview.jpg',
    imageAlt:
      'Aperçu de Midi & Compagnie : bistrot fictif du midi, identité aubergine et photographie d’inspiration d’un déjeuner.',
    width: 1440,
    height: 1080,
    problem:
      'Imaginer le site d’un bistrot fictif à Bulle pour donner envie de déjeuner et trouver facilement la carte, les prix et les horaires.',
    solution:
      'Une maquette responsive avec une carte filtrable en CHF, des images d’inspiration et des horaires dédiés au déjeuner. La réservation reste à venir.',
    url: '/concepts/midi-et-compagnie/',
    linkLabel: 'Voir la maquette',
  },
  {
    published: true,
    name: 'Atelier Traverse',
    nature: 'Concept non commandé',
    image: '/images/atelier-traverse-preview.jpg',
    imageAlt:
      'Aperçu du site conceptuel Atelier Traverse : typographie affirmée, accent brique et inspiration de rangement en bois.',
    width: 1440,
    height: 1080,
    problem:
      'Imaginer le site d’une menuiserie fictive autour de Bulle pour présenter ses aménagements aux particuliers.',
    solution:
      'Un premier aperçu responsive avec une identité dédiée, des images d’inspiration et un schéma explicatif du rangement. Le concept est en cours de construction.',
    url: '/concepts/atelier-traverse/',
    linkLabel: 'Voir la maquette',
  },
];
