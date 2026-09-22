import { assetUrl } from '../assets.js';

const base = '/concepts/lise';
const services = [
  {
    id: 'visage',
    name: 'Soin du visage',
    duration: 60,
    price: 95,
    intro: 'Un temps consacré au visage, du nettoyage au soin de finition.',
    includes: 'Nettoyage, exfoliation douce, masque et application d’un soin.',
    note: 'Venez avec ou sans maquillage. Le nettoyage fait partie du soin.',
  },
  {
    id: 'massage',
    name: 'Massage de détente',
    duration: 45,
    price: 75,
    intro: 'Une pause avec un massage manuel du dos, des épaules et des bras.',
    includes:
      'Échange sur votre confort, installation et massage de détente. Vous pouvez demander à ajuster la pression ou à interrompre le soin à tout moment.',
    note: 'Une prestation de bien-être, sans objectif médical ni thérapeutique.',
  },
  {
    id: 'mains',
    name: 'Beauté des mains',
    duration: 40,
    price: 55,
    intro: 'Des ongles mis en forme et un soin des mains, tout simplement.',
    includes:
      'Limage, soin du contour des ongles et application d’une crème. Sans pose de gel, de semi-permanent ni de vernis.',
    note: 'La dépose de gel ou de semi-permanent n’est pas comprise.',
  },
];
const arrow = '<span aria-hidden="true">↗</span>';
const calendar =
  '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 11h18m-14 4h2m6 0h2m-10 3h2"/></svg>';

export function renderLise() {
  return `<!doctype html><html lang="fr"><head>
    <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Lise — soins & bien-être à Bulle · Concept Baerg Design</title>
    <meta name="description" content="Un institut fictif à Bulle, imaginé par Baerg Design. Prestations, prix et durées illustratifs, avec simulation de rendez-vous sans envoi.">
    <meta name="robots" content="noindex, nofollow"><meta name="theme-color" content="#F6F3EF">
    <link rel="icon" href="${assetUrl(base + '/favicon.svg')}" type="image/svg+xml">
    <link rel="preload" href="${base}/fonts/dm-sans.woff2" as="font" type="font/woff2" crossorigin>
    <link rel="stylesheet" href="${assetUrl(base + '/styles.css')}">
    <script src="${assetUrl(base + '/app.js')}" defer></script>
    <script src="${assetUrl('/concepts/navigation.js')}" defer></script>
  </head><body id="haut" tabindex="-1">
    <a class="skip" href="#contenu">Aller au contenu</a>
    <div class="concept-bar"><div class="wrap"><span>Projet conceptuel — entreprise fictive <span class="credit">imaginée par Baerg Design</span></span><a href="/realisations/">← Retour à Baerg</a></div></div>
    <header class="header" data-scroll-header><div class="wrap header-inner">
      <a class="brand" href="#haut" aria-label="Lise, accueil">lise<span>soins & bien-être</span></a>
      <nav aria-label="Navigation principale"><a href="#prestations">Les soins</a><a href="#visite">Votre visite</a><a href="#lieu">Le lieu</a></nav>
      <a class="button small" href="#rendez-vous">Choisir un soin ${arrow}</a>
    </div></header>
    <main id="contenu" tabindex="-1">
      <section class="intro wrap" aria-labelledby="intro-title">
        <p class="eyebrow">Du temps pour vous, à Bulle.</p>
        <div class="intro-heading"><h1 id="intro-title">Choisissez votre soin.<br><span>Prenez votre temps.</span></h1><p>Soins du visage, massages de détente et beauté des mains. Le temps et le prix sont annoncés. À vous de choisir ce qui vous fait envie.</p></div>
        <div class="quick-choices" aria-label="Choisir une prestation">${services.map((s) => `<a href="#soin-${s.id}"><strong>${s.name}</strong><span>${s.duration} min <span aria-hidden="true">/</span> ${s.price} CHF</span></a>`).join('')}</div>
      </section>
      <figure class="gesture wrap"><img src="${assetUrl(base + '/images/preparation.webp')}" srcset="${assetUrl(base + '/images/preparation-720.webp')} 720w, ${assetUrl(base + '/images/preparation.webp')} 1600w" sizes="(max-width: 700px) calc(100vw - 36px), (max-width: 1050px) calc(100vw - 56px), (max-width: 1376px) calc(100vw - 96px), 1280px" width="1600" height="1067" fetchpriority="high" alt="Des mains préparent un mélange de soin dans un bol en céramique, sur une table en bois à la lumière naturelle."><figcaption>Photographie d’illustration</figcaption><p class="image-caption">Des soins pour vous,<br>tout simplement.</p></figure>
      <section class="services section wrap" id="prestations" tabindex="-1" aria-labelledby="services-title">
        <div class="section-head"><div><h2 id="services-title">Le soin, le temps,<br>le prix.</h2></div><p>Tout ce qu’il faut savoir pour choisir.<br>Les durées incluent l’accueil et l’installation.</p></div>
        <div class="service-list">${services.map((s) => `<article class="service-row" id="soin-${s.id}" tabindex="-1"><div class="service-content"><h3>${s.name}</h3><p>${s.intro}</p><details><summary>Ce qui est compris <span aria-hidden="true">+</span></summary><div class="detail-copy"><p>${s.includes}</p><p>${s.note}</p></div></details></div><div class="service-action"><p><strong>${s.price} <small>CHF</small></strong><span>${s.duration} minutes</span></p><a class="button secondary" href="#rendez-vous" data-choose="${s.id}">Choisir ce soin ${calendar}</a></div></article>`).join('')}</div>
        <p class="micro">Prestations et prix imaginés pour ce concept. Aucun soin n’est vendu sur ce site.</p>
      </section>
      <section class="visit section" id="visite" tabindex="-1" aria-labelledby="visit-title"><div class="wrap">
        <div class="section-head"><div><h2 id="visit-title">Avant, pendant et après<br>votre soin.</h2></div><p>Un rendez-vous se prépare aussi avec des informations simples. Voici le déroulement imaginé chez Lise.</p></div>
        <ol class="visit-steps"><li><h3>Avant : on fait le point.</h3><p>Vous choisissez une prestation et son créneau. À l’arrivée, quelques minutes permettent de préciser vos attentes et de poser vos questions.</p><span class="step-tag">La durée et le prix sont connus.</span></li><li><h3>Pendant : vous gardez la main.</h3><p>Chaque étape vous est expliquée. Dites ce qui vous convient. Vous pouvez demander une pause ou arrêter.</p><span class="step-tag">Votre confort guide le rendez-vous.</span></li><li><h3>Après : pas de précipitation.</h3><p>Après le soin, vous pouvez prendre quelques minutes avant de repartir. Vous choisissez si vous souhaitez reprendre rendez-vous, sans forfait imposé.</p><span class="step-tag">Vous repartez à votre rythme.</span></li></ol>
      </div></section>
      <section class="place section wrap" id="lieu" tabindex="-1" aria-labelledby="place-title"><figure><img src="${assetUrl(base + '/images/cabine-naturelle.webp')}" srcset="${assetUrl(base + '/images/cabine-naturelle-720.webp')} 720w, ${assetUrl(base + '/images/cabine-naturelle.webp')} 1200w" sizes="(max-width: 700px) calc(100vw - 36px), (max-width: 1376px) 52vw, 660px" width="1200" height="800" loading="lazy" alt="Petite cabine de massage avec table habillée de linge, étagères et lumière filtrée par des stores en bois."><figcaption>Photographie d’illustration</figcaption></figure><div><h2 id="place-title">Un petit institut<br>près de chez vous.</h2><p>Lise est imaginé comme un institut indépendant dans la région de Bulle : un espace d’accueil, une cabine et une seule personne pour vous accompagner du début à la fin.</p><dl><div><dt>Situation</dt><dd>Région de Bulle, Gruyère</dd></div><div><dt>Accueil</dt><dd>Sur rendez-vous uniquement</dd></div><div><dt>Horaires imaginés</dt><dd>Mardi–vendredi, 9 h–18 h<br>Samedi, 9 h–13 h</dd></div></dl><p class="micro">Aucune adresse ni équipe réelle : ce lieu est une proposition visuelle pour le concept.</p></div></section>
      <section class="faq section wrap" aria-labelledby="faq-title"><div><h2 id="faq-title">Avant de venir.</h2></div><div class="faq-list">
        <details><summary>Je ne sais pas quel soin choisir. <span aria-hidden="true">+</span></summary><p>Comparez les trois prestations et ouvrez « Ce qui est compris ». Le soin du visage est consacré au visage, le massage au dos, aux épaules et aux bras, la beauté des mains aux ongles et aux mains.</p></details>
        <details><summary>Dois-je prévoir quelque chose ? <span aria-hidden="true">+</span></summary><p>Dans le parcours imaginé, aucune tenue particulière n’est nécessaire. Pour le visage, le nettoyage est inclus. Pour les mains, prévoyez des ongles sans gel ni semi-permanent : leur dépose n’est pas comprise.</p></details>
        <details><summary>Puis-je changer de prestation ? <span aria-hidden="true">+</span></summary><p>Oui, dans cette démonstration vous pouvez revenir au choix du soin à tout moment avant la simulation finale. Le prix et la durée du récapitulatif se mettent à jour.</p></details>
        <details><summary>Le massage est-il un soin thérapeutique ? <span aria-hidden="true">+</span></summary><p>Non. Il s’agit uniquement d’une prestation de détente, sans objectif médical, thérapeutique ni promesse de résultat.</p></details>
        <details><summary>Est-ce que je réserve un vrai rendez-vous ? <span aria-hidden="true">+</span></summary><p>Non. Lise est une entreprise fictive imaginée par Baerg Design. Tous les créneaux sont des exemples. Aucune réservation, aucun paiement et aucun envoi de données ne sont effectués.</p></details>
      </div></section>
      <section class="booking section" id="rendez-vous" tabindex="-1" aria-labelledby="booking-title"><div class="wrap">
        <div class="section-head"><div><h2 id="booking-title">Votre prochain moment.<br>Pour l’exemple.</h2></div><p class="booking-disclaimer"><strong>Simulation uniquement.</strong> Aucun rendez-vous réel, aucun paiement. Aucun nom, e-mail ou téléphone demandé. Vos choix ne sont ni envoyés ni enregistrés.</p></div>
        <noscript><p class="no-js">La simulation nécessite JavaScript. Les prestations, les prix et les réponses aux questions restent consultables ci-dessus.</p></noscript>
        <div id="booking-app" hidden>
          <ol class="progress" aria-label="Étapes de la simulation"><li data-progress="1" aria-current="step"><span>1</span> Le soin</li><li data-progress="2"><span>2</span> Le créneau</li><li data-progress="3"><span>3</span> Le récapitulatif</li></ol>
          <form id="booking-form">
            <div class="booking-step" data-step="1"><h3 tabindex="-1">Quel soin vous ferait envie ?</h3><fieldset><legend class="sr-only">Choisissez une prestation</legend><div class="booking-services">${services.map((s) => `<label><input type="radio" name="service" value="${s.id}" data-name="${s.name}" data-duration="${s.duration}" data-price="${s.price}" required><span><strong>${s.name}</strong><span>${s.duration} min · ${s.price} CHF</span></span></label>`).join('')}</div></fieldset><div class="booking-actions"><button class="button" type="button" data-next="2">Choisir un créneau <span aria-hidden="true">→</span></button></div></div>
            <div class="booking-step" data-step="2" hidden><h3 tabindex="-1">Un moment dans votre semaine.</h3><p class="selected-service"></p><p class="micro">Semaine type fictive, sans date réelle. Tous les créneaux sont proposés uniquement pour essayer le parcours.</p><fieldset><legend>Le jour</legend><div class="day-options">${['Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'].map((d) => `<label><input type="radio" name="day" value="${d}" required><span>${d}</span></label>`).join('')}</div></fieldset><fieldset id="time-field" hidden><legend>L’heure de début</legend><div id="time-options" class="time-options"></div></fieldset><div class="booking-actions"><button class="text-button" type="button" data-back="1">← Changer de soin</button><button class="button" type="button" data-next="3">Voir le récapitulatif <span aria-hidden="true">→</span></button></div></div>
            <div class="booking-step" data-step="3" hidden><h3 tabindex="-1">Tout est clair ?</h3><dl id="booking-summary"></dl><p class="micro">Créneau fictif. La simulation suivante n’effectue aucune réservation.</p><div class="booking-actions"><button class="text-button" type="button" data-back="2">← Modifier le créneau</button><button class="button" type="submit">Simuler ce rendez-vous ${arrow}</button></div></div>
            <p id="booking-error" role="alert" hidden></p>
          </form>
          <div id="booking-complete" hidden><p class="eyebrow">DÉMONSTRATION TERMINÉE</p><h3 tabindex="-1">Vous avez essayé le parcours.</h3><p>Aucun rendez-vous n’a été réservé. Aucune donnée n’a été envoyée ou enregistrée.</p><button class="button" type="button" id="restart">Recommencer la simulation <span aria-hidden="true">↺</span></button></div>
        </div>
      </div></section>
    </main>
    <footer class="footer"><div class="wrap"><a class="brand" href="#haut" aria-label="Lise, retour en haut">lise<span>soins & bien-être</span></a><p>Projet conceptuel — entreprise fictive<br>Imaginé par Baerg Design.</p><a href="/realisations/">Revenir aux projets Baerg ${arrow}</a></div></footer>
  </body></html>`;
}
