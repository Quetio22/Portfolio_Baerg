import { assetUrl } from '../assets.js';

const base = '/concepts/atelier-traverse';
const arrow =
  '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6" stroke="currentColor" stroke-width="1.5"/></svg>';
const mark =
  '<svg viewBox="0 0 40 40" fill="none" aria-hidden="true"><path d="M6 34V6h10v28M24 34V6h10v28M6 23h28" stroke="currentColor" stroke-width="3"/></svg>';

function facade() {
  return `<svg class="facade" viewBox="0 0 600 340" role="img" aria-labelledby="facade-title facade-desc">
    <title id="facade-title">Schéma de l’entrée illustrée</title>
    <desc id="facade-desc">À gauche, deux portes toute hauteur. À droite, trois patères au-dessus d’une banquette et deux tiroirs en dessous. Les repères 1, 2 et 3 renvoient aux explications sous le schéma.</desc>
    <g fill="none" stroke="currentColor" stroke-width="2">
      <path d="M64 300V32h450v268M70 292V38h438v254Z M260 38v254M165 38v254M151 153v44m27-44v44M265 238h243M265 246h243M387 246v46M64 300h450"/>
      <rect x="269" y="227" width="235" height="10" rx="3"/>
      <circle cx="327" cy="96" r="4"/><circle cx="383" cy="96" r="4"/><circle cx="440" cy="96" r="4"/>
      <path d="M316 251h22m86 0h22"/>
    </g>
    <g class="diagram-marker"><circle cx="165" cy="96" r="16"/><circle cx="548" cy="230" r="16"/><circle cx="548" cy="270" r="16"/></g>
    <g class="diagram-number" text-anchor="middle" dominant-baseline="central"><text x="165" y="96">1</text><text x="548" y="230">2</text><text x="548" y="270">3</text></g>
    <g stroke="currentColor" stroke-width="1"><path d="M509 230h23M509 270h23"/></g>
  </svg>`;
}

export function renderTraverse() {
  return `<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Atelier Traverse — Menuiserie & agencement · Aperçu conceptuel</title>
  <meta name="description" content="Aperçu d’un site fictif de menuiserie autour de Bulle : rangements sur mesure, mobilier et inspirations d’aménagement. Concept créé par Baerg.">
  <meta name="robots" content="noindex, nofollow"><meta name="theme-color" content="#FAFAF8">
  <link rel="icon" href="${base}/favicon.svg" type="image/svg+xml">
  <link rel="preload" href="${base}/fonts/barlow-condensed-600.ttf" as="font" type="font/ttf" crossorigin>
  <link rel="stylesheet" href="${assetUrl(base + '/styles.css')}">
  <script src="${assetUrl('/concepts/navigation.js')}" defer></script>
</head>
<body id="haut" tabindex="-1">
  <a class="skip-link" href="#contenu">Aller au contenu</a>
  <div class="concept-banner"><div class="wrap"><span>Projet conceptuel — entreprise fictive</span><a href="/realisations/">← Retour à Baerg</a></div></div>
  <header class="site-header" data-scroll-header>
    <div class="wrap nav-inner">
      <a class="wordmark" href="#haut" aria-label="Atelier Traverse, début de l’aperçu">${mark}<span><span class="wordmark-small">ATELIER</span><span class="wordmark-name">TRAVERSE</span></span></a>
      <nav id="navigation" aria-label="Navigation principale"><a href="#amenagements">Les aménagements</a></nav>
      <div class="nav-quote"><button class="outline-button" disabled aria-describedby="nav-unavailable">Parlons de votre projet ${arrow}</button><span id="nav-unavailable">Devis indisponible dans cet aperçu</span></div>
    </div>
  </header>
  <main id="contenu" tabindex="-1">
    <section class="hero wrap" aria-labelledby="hero-title">
      <div class="hero-heading">
        <p class="eyebrow"><span class="accent-line" aria-hidden="true"></span>MENUISERIE & AGENCEMENT · BULLE</p>
        <h1 id="hero-title">Rangements & mobilier.<br><span>À la mesure de votre intérieur.</span></h1>
      </div>
      <figure class="hero-figure">
        <div class="image-heading"><span>UNE PLACE POUR CHAQUE CHOSE</span><span>ÉTUDE 01 / ENTRÉE</span></div>
        <img src="${base}/images/entree.jpg" width="1536" height="1024" fetchpriority="high" alt="Illustration générée : meuble d’entrée en chêne, deux portes à gauche, banquette, trois patères et deux tiroirs à droite.">
        <figcaption><span class="caption-label">IMAGE D’INSPIRATION · GÉNÉRÉE PAR IA</span></figcaption>
      </figure>
      <div class="hero-copy">
        <p class="eyebrow">L’AMÉNAGEMENT, CÔTÉ USAGE</p>
        <p class="hero-description">Une entrée à organiser, une bibliothèque à intégrer, un espace sous pente à utiliser. Des aménagements pensés pour vos pièces et votre quotidien.</p>
        <a class="button" href="#amenagements">Explorer les aménagements ${arrow}</a>
        <div class="hero-services"><span>Rangements sur mesure</span><span>Mobilier</span><span>Agencement intérieur</span></div>
        <p class="demo-note">La demande de devis est indisponible dans cet aperçu. Aucune demande n’est envoyée et aucune donnée personnelle n’est collectée.</p>
      </div>
    </section>
    <section class="inspirations" id="amenagements" tabindex="-1" aria-labelledby="inspirations-title">
      <div class="wrap">
        <div class="section-heading"><div><p class="eyebrow">DES IDÉES POUR VOS PIÈCES</p><h2 id="inspirations-title">Partir de l’usage.<br>Penser l’aménagement.</h2></div></div>
        <div class="inspiration-grid">
          <article class="inspiration-card" id="entree">
            <figure><img src="${base}/images/entree.jpg" width="1536" height="1024" loading="lazy" alt="Inspiration fictive d’un rangement d’entrée avec armoire fermée et banquette intégrée."><figcaption>INSPIRATION 01 · IMAGE GÉNÉRÉE PAR IA</figcaption></figure>
            <div class="inspiration-body"><div class="card-title"><h3>Une entrée qui fait de la place.</h3><span>01</span></div>
            <p>Réunir les manteaux, les chaussures et une assise dans un seul meuble. La partie fermée libère le regard ; la niche garde l’essentiel à portée de main.</p>
            <details class="design-detail"><summary>Comprendre le rangement <span aria-hidden="true">+</span></summary><div class="detail-content"><p class="eyebrow">LECTURE DE LA FAÇADE ILLUSTRÉE</p>${facade()}<ol><li><strong>Deux portes toute hauteur.</strong> Un volume fermé pour ranger à l’abri des regards.</li><li><strong>Une assise sous les patères.</strong> S’installer pour se chausser et accrocher une veste en arrivant.</li><li><strong>Deux tiroirs sous la banquette.</strong> Utiliser l’espace bas pour les chaussures.</li></ol></div></details></div>
          </article>
          <article class="inspiration-card">
            <figure><img src="${base}/images/bibliotheque.jpg" width="1536" height="1024" loading="lazy" alt="Illustration générée : bibliothèque en chêne à trois travées, étagères ouvertes et placards bas, près d’un fauteuil de lecture."><figcaption>INSPIRATION 02 · IMAGE GÉNÉRÉE PAR IA</figcaption></figure>
            <div class="inspiration-body"><div class="card-title"><h3>Des livres. Et de la place autour.</h3><span>02</span></div>
            <p>Des étagères ouvertes pour les livres et les objets, des placards en partie basse pour le reste. Trois travées donnent un rythme au mur du séjour.</p>
            <details class="design-detail"><summary>Comprendre la bibliothèque <span aria-hidden="true">+</span></summary><div class="detail-content"><p class="eyebrow">LE CHOIX D’AMÉNAGEMENT</p><p>Varier les hauteurs de rangement permet d’accueillir des livres de formats différents. Les portes en partie basse réservent un espace aux objets que l’on préfère ne pas exposer.</p><p>Dans un projet réel, les dimensions, les charges et les fixations seraient étudiées avant de choisir les épaisseurs et de fabriquer.</p></div></details></div>
          </article>
        </div>
      </div>
    </section>
  </main>
  <footer class="preview-footer"><div class="wrap"><p><strong>Atelier Traverse</strong><span>Aperçu de direction artistique · Concept de Baerg</span></p><p>La méthode, la zone d’intervention et la demande de devis <br>seront développées à la prochaine étape.</p><a href="#haut">Retour en haut ↑</a></div></footer>
</body></html>`;
}
