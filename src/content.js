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

// Les portraits de démonstration restent limités à la prévisualisation.
// Remplacer les images, renseigner les prénoms puis passer isPlaceholder à false.
export const founders = [
  {
    id: 'founder-a',
    name: '',
    role: 'Cofondateur · Apprenti développeur full-stack',
    biography: '',
    image: '/images/portrait-demo-a.jpg',
    imageAlt: 'Portrait généré de démonstration, à remplacer par celui du cofondateur.',
    width: 800,
    height: 1000,
    isPlaceholder: true,
    profileUrl: '',
  },
  {
    id: 'founder-b',
    name: '',
    role: 'Cofondateur · Apprenti développeur full-stack',
    biography: '',
    image: '/images/portrait-demo-b.jpg',
    imageAlt: 'Portrait généré de démonstration, à remplacer par celui du cofondateur.',
    width: 800,
    height: 1000,
    isPlaceholder: true,
    profileUrl: '',
  },
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

export const approach = {
  label: 'TRAVAILLER ENSEMBLE',
  title: 'On construit votre site',
  emphasis: 'avec vous.',
  introduction: 'Vous connaissez votre activité. Nous prenons le temps de la comprendre.',
  paragraphs: [
    'Nous parlons de ce que vous faites, des personnes qui viendront sur votre site et de ce qu’elles doivent y trouver. À partir de là, nous vous proposons des pages et une première maquette. Vous nous dites ce qui vous plaît, ce qui manque, ce qui est à revoir.',
    'Vous échangez directement avec nous deux pendant le développement. Nous ajustons le site avec vos retours, vérifions son fonctionnement sur ordinateur et mobile, puis le mettons en ligne. Avant de vous le confier, nous vous montrons comment l’utiliser.',
  ],
  linkLabel: 'Faire connaissance avec le studio',
};

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
    name: 'Lise — soins & bien-être',
    summary: 'Un institut, trois soins et un parcours de rendez-vous à essayer.',
    nature: 'Concept non commandé',
    image: '/images/lise-preview.jpg',
    imageAlt:
      'Aperçu de Lise, institut fictif à Bulle : identité pervenche, choix des soins et tarifs illustratifs.',
    width: 1440,
    height: 1080,
    problem:
      'Imaginer le site d’un institut indépendant fictif à Bulle pour choisir un soin et connaître son prix, sa durée et son déroulement.',
    solution:
      'Une page responsive avec des prestations détaillées, une FAQ et une simulation de rendez-vous en trois étapes, sans collecte de données ni réservation réelle.',
    url: '/concepts/lise/',
    linkLabel: 'Voir la maquette',
  },
  {
    published: true,
    name: 'Midi & Compagnie',
    summary: 'Un bistrot du midi, sa carte et toutes les infos pour venir déjeuner.',
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
    summary: 'Des rangements sur mesure, expliqués par l’image et le dessin.',
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
