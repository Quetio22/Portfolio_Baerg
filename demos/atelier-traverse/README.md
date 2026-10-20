# Atelier Traverse — C, L’enseigne

Route conservée : `/concepts/atelier-traverse/`. Document autonome rendu par `src/concepts/atelier-traverse.js`, sans styles, thème ou navigation partagée de Baerg. Export statique via le build existant ; noindex et exclusion du sitemap conservés.

Référence : Design Lab, `experiments/atelier-traverse-final/`, sélection Expressive personnalisée du 1 octobre 2026. Arial 700, échelle 101 %, marges 38/20 px (mobile 32/15), image 490 px à 58 % (mobile entière 3:2), sections 112 %, CTA brique pleins. Les valeurs sont figées dans styles.css ; aucun stockage, panneau ni dépendance au Lab.

Images bench.webp et joint.webp : conversions WebP sans perte des originaux 1536 × 1024 du Lab. Images de synthèse, études fictives, aucun chantier réel. Provenance et prompts préservés dans le Lab : `experiments/atelier-traverse/assets-provenance.md`. Les anciens assets restent disponibles pour préserver leurs URL.

Le contact est une démonstration locale : aucun appel API, aucune transmission ou persistance. Fermeture par Échap, bouton ou extérieur, remise à zéro des saisies à la fermeture et restitution du focus. Sans JavaScript, bouton désactivé et explication visible. Le formulaire Baerg est indépendant.

Ancres historiques haut, contenu, amenagements et entree conservées. Retour à Baerg au pied de page pour préserver la composition validée. Mouvement de l’enseigne 5 px / 360 ms, flèches 2 px ; préférence de mouvement réduit respectée, y compris lors d’un changement en cours de page.

## Évolution éditoriale — 1 octobre 2026

À la demande du studio après l’intégration : suppression de la numérotation et des notes latérales, repères de section plus affirmés (graisse 700 et trait brique) et ajout d’un tabouret détouré dans L’atelier. L’objet utilise un fond alpha réel, sans cadre ni fond rapporté. Il passe sous le texte sur tablette/mobile. `images/stool-cutout.webp` : 1254 × 1254, WebP sans perte avec transparence, généré avec imagegen intégré. Image de synthèse, pas une réalisation réelle. Le Lab reste la référence historique inchangée ; la section atelier et les repères ne sont donc plus identiques pixel à pixel à cette référence.

## Scène et galerie — 2 octobre 2026

Le tabouret isolé est remplacé par `images/atelier-scene.webp` (1254 × 1254, alpha, WebP sans perte). Scène en béton brut, banc et étagère en frêne, haut de l’étagère dépassant du cadre photographique. Visuel de synthèse créé avec imagegen intégré.

Les deux études deviennent une galerie : largeur partagée, grande/petite image, échange animé au clic (650 ms), sans autoplay. Boutons natifs et flèches clavier, Home/End, aria-pressed ; transitions supprimées en mouvement réduit. Sans JavaScript, les deux études gardent leur présentation statique. Vérification Chromium/WebKit et captures des deux états à 390/820/1440 px.
