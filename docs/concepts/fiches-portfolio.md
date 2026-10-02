# Fiches pour le portfolio Baerg

Deux projets personnels conceptuels, pour des entreprises fictives. Aucun client, chantier, repas servi ni résultat commercial à revendiquer. Traverse utilise des illustrations IA identifiées ; Midi & Compagnie utilise désormais des photographies de stock légendées « Photographie d’illustration » (sources et licences dans `public/concepts/midi-et-compagnie/IMAGES.md`).

## Atelier Traverse

**Objectif.** Présenter une menuiserie fictive autour de Bulle à travers la direction C — L’enseigne, validée dans le Baerg Design Lab.

**Travail réalisé.** Intégration de la composition finale : enseigne TRAVERSE monumentale, photographie brute du banc, présentation courte de l’atelier, deux études et contact de démonstration. Réglages Expressive personnalisés figés dans le CSS, sans Polish Studio ni stockage. Retour à Baerg au pied de page.

**Technologies.** HTML rendu par module Node.js, CSS Grid et media queries, JavaScript natif, dialogue HTML accessible et mouvement discret. Arial système et images WebP sans perte. Export statique, Playwright et axe.

**Trois choix de conception.**

1. Une enseigne monumentale précède la photographie puis le titre ; la composition et les espaces validés sont conservés.
2. Arial Bold 700, palette papier/pierre/encre/brique et CTA pleins ; cadrage du banc à 58 % sur desktop/tablette, image entière sur mobile.
3. Deux études, contenu limité et interaction de contact explicitement locale : aucune transmission, API ou persistance.

**Route :** `/concepts/atelier-traverse/`, avec les anciennes ancres conservées.

**Captures :** [desktop 1440](captures/atelier-traverse-final-1440.png), [tablette 820](captures/atelier-traverse-final-820.png), [mobile 390](captures/atelier-traverse-final-390.png). Les anciennes captures restent historiques.

**Vérification :** `atelier-traverse-final-verification.md`.

## Midi & Compagnie

**Objectif.** Donner envie de déjeuner dans un bistrot de quartier fictif à Bulle et permettre de consulter facilement sa carte, ses prix en CHF et ses horaires.

**Travail réalisé.** Identité visuelle fictive, rédaction, introduction photographique, carte de six propositions avec filtres, section d’horaires, raccourcis mobiles et retour permanent vers Baerg. Prix et horaires signalés comme illustratifs. La réservation et l’accès ne sont pas construits ; réservation explicitement indisponible, sans formulaire ni collecte.

**Technologies.** HTML rendu par modules Node.js, CSS responsive, JavaScript natif pour les filtres, images JPEG et polices locales. Export statique via le build existant ; tests Playwright et axe.

**Trois choix de conception.**

1. Fraunces, aubergine et touches citron pour une adresse conviviale, distincte du concept menuiserie.
2. Une carte textuelle filtrable, avec prix immédiatement lisibles ; toutes les propositions restent disponibles sans JavaScript.
3. Des horaires dans une section contrastée et des raccourcis fixes sur mobile, pour accéder rapidement aux informations du déjeuner.

**Route :** `/concepts/midi-et-compagnie/`.

**Captures :** premier écran [ordinateur, 1440 × 900](captures/midi-et-compagnie-1440-ecran.jpg) et [mobile, 390 × 844](captures/midi-et-compagnie-390-ecran.jpg) ; pages complètes [ordinateur](captures/midi-et-compagnie-1440.jpg) et [mobile](captures/midi-et-compagnie-390.jpg).

Les captures longues montrent les éléments fixes à leur position dans la fenêtre initiale ; les captures du premier écran représentent le cadrage réel à l’ouverture.
