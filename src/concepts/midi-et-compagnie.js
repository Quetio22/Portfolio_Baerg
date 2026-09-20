import { assetUrl } from '../assets.js';

const base = '/concepts/midi-et-compagnie';
const hours = {
  days: 'Du lundi au vendredi',
  opening: '11 h 30 – 14 h 30',
  kitchen: '11 h 30 – 14 h',
};
const arrow =
  '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14m-5-5 5 5-5 5" stroke="currentColor" stroke-width="1.7"/></svg>';
const menu = [
  {
    id: 'entrees',
    title: 'Pour commencer',
    items: [
      ['Velouté de courge', 'Graines torréfiées, crème et pain de campagne.', '9'],
      ['La petite salade', 'Jeunes pousses, poire, noix et vinaigrette moutardée.', '8'],
    ],
  },
  {
    id: 'plats',
    title: 'Les bonnes assiettes',
    items: [
      ['Croque aux champignons', 'Pain doré, champignons poêlés, Gruyère et salade verte.', '21'],
      ['Poulet rôti du midi', 'Pommes de terre au four, carottes et jus de cuisson.', '26'],
    ],
  },
  {
    id: 'desserts',
    title: 'Une place pour le dessert',
    items: [
      ['Tarte poire & amande', 'Une pâte croustillante, des poires et un peu de crème.', '8'],
      ['Mousse au chocolat', 'Chocolat noir, texture légère et copeaux de chocolat.', '7'],
    ],
  },
];

export function renderMidi() {
  return `<!doctype html><html lang="fr"><head>
    <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Midi & Compagnie — Le bistrot du midi · Concept</title>
    <meta name="description" content="Un café-bistrot fictif imaginé à Bulle, ouvert uniquement le midi. Découvrez cet aperçu et sa carte illustrative en CHF.">
    <meta name="robots" content="noindex, nofollow"><meta name="theme-color" content="#FAFAF7">
    <link rel="icon" type="image/svg+xml" href="${base}/favicon.svg">
    <link rel="preload" href="${base}/fonts/fraunces-600.ttf" as="font" type="font/ttf" crossorigin>
    <link rel="stylesheet" href="${assetUrl(base + '/styles.css')}">
    <script defer src="${assetUrl(base + '/app.js')}"></script>
  </head><body id="haut">
    <a class="skip-link" href="#contenu">Aller au contenu</a>
    <div class="concept-strip"><div class="wrap"><span>Projet conceptuel — entreprise fictive</span><a href="/">Imaginé par Baerg ${arrow}</a></div></div>
    <header class="header"><div class="wrap header-inner">
      <a class="logo" href="#haut" aria-label="Midi et Compagnie, accueil">midi <span>&</span> compagnie<span class="logo-sub">LE BISTROT DU MIDI</span></a>
      <nav aria-label="Navigation principale"><a href="#carte">La carte</a><a href="#horaires">Les horaires</a></nav>
      <div class="reservation"><button disabled aria-describedby="reservation-note">Réserver une table ${arrow}</button><span id="reservation-note">Indisponible dans cet aperçu</span></div>
    </div></header>
    <main id="contenu">
      <section class="hero" aria-labelledby="hero-title"><div class="wrap">
        <p class="eyebrow hero-eyebrow">BULLE · UNE PAUSE, UNE ASSIETTE, DES GENS</p>
        <h1 id="hero-title">À midi.<br>Et en bonne <span>compagnie.</span></h1>
        <p class="hero-description">Des assiettes généreuses, une cuisine de saison. <br>Et le plaisir de se retrouver, le temps d’un déjeuner.</p>
        <a class="button" href="#carte">Qu’est-ce qu’on mange ? ${arrow}</a>
        <figure class="hero-photo"><img src="${base}/images/dejeuner.jpg" alt="Image d’inspiration générée : table de déjeuner, croque aux champignons, poulet rôti et velouté de courge." width="1536" height="1024" fetchpriority="high"><figcaption>Image d’inspiration générée par IA · Lieu et plats fictifs</figcaption></figure>
      </div></section>
      <section class="menu-section" id="carte" aria-labelledby="menu-title"><div class="wrap">
        <div class="menu-heading"><div><p class="eyebrow">LE BON MOMENT DE LA JOURNÉE</p><h2 id="menu-title">À la carte,<br>ce midi.</h2></div><p class="illustrative">Carte et prix illustratifs · Prix en CHF</p></div>
        <div class="menu-layout"><aside class="menu-aside" aria-label="Inspiration du dessert"><figure><img src="${base}/images/tarte.jpg" width="1024" height="1536" loading="lazy" alt="Image d’inspiration générée : part de tarte aux poires et aux amandes avec crème et espresso."><figcaption>Image d’inspiration générée par IA</figcaption></figure><div class="dessert-note"><p>On garde une petite place ?</p><span>La tarte poire & amande</span><strong>8 CHF</strong></div></aside>
        <div class="menu-board"><div class="filters" role="group" aria-label="Filtrer la carte" hidden><button type="button" data-filter="all" aria-pressed="true">Tout</button><button type="button" data-filter="entrees" aria-pressed="false">Entrées</button><button type="button" data-filter="plats" aria-pressed="false">Plats</button><button type="button" data-filter="desserts" aria-pressed="false">Desserts</button></div>
          <p class="sr-only" id="filter-status" role="status" aria-live="polite"></p>
          ${menu.map((group) => `<section class="menu-category" data-category="${group.id}" aria-labelledby="${group.id}-title"><h3 id="${group.id}-title">${group.title}</h3><ul>${group.items.map(([name, description, price]) => `<li><div class="dish-heading"><h4>${name}</h4><span class="dish-price">${price}<small> CHF</small></span></div><p>${description}</p></li>`).join('')}</ul></section>`).join('')}
          <p class="menu-footnote">Une carte imaginée pour ce concept. Aucun repas ni réservation ne peut être commandé.</p>
        </div></div>
      </div></section>
      <section class="hours-section" id="horaires" aria-labelledby="hours-title"><div class="wrap hours-layout">
        <div class="hours-intro"><p class="eyebrow">LES HORAIRES</p><h2 id="hours-title">On se retrouve <br>à midi.</h2><p>Le temps d’un déjeuner, du lundi au vendredi. <br>Le soir et le week-end, le bistrot est fermé.</p></div>
        <div class="hours-panel"><span class="hours-days">${hours.days}</span><p class="hours-opening">${hours.opening}</p><dl><div><dt>Cuisine ouverte</dt><dd>${hours.kitchen}</dd></div><div><dt>Samedi & dimanche</dt><dd>Fermé</dd></div></dl><p class="hours-note">Horaires illustratifs · Bistrot fictif à Bulle</p></div>
      </div></section>
    </main>
    <footer class="preview-footer"><div class="wrap"><a class="footer-logo" href="#haut">midi & compagnie</a><p>Un aperçu de bistrot, imaginé par Baerg.<br>L’accès et la réservation de démonstration viendront ensuite.</p><a class="back-top" href="#haut">Retour en haut ↑</a></div></footer>
    <nav class="mobile-shortcuts" aria-label="Accès rapides"><a href="#carte">La carte ${arrow}</a><a href="#horaires">Horaires</a><span>Réservation<span>À venir</span></span></nav>
  </body></html>`;
}
