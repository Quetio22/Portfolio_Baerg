# Fiches pour le portfolio Baerg

Deux projets personnels conceptuels, pour des entreprises fictives. Aucun client, chantier, repas servi ni résultat commercial à revendiquer. Traverse utilise des illustrations IA identifiées ; Midi & Compagnie utilise désormais des photographies de stock légendées « Photographie d’illustration » (sources et licences dans `public/concepts/midi-et-compagnie/IMAGES.md`).

## Atelier Traverse

**Objectif.** Aider un particulier autour de Bulle à comprendre les possibilités de rangement et d’agencement sur mesure, en vue d’une future demande de devis.

**Travail réalisé.** Identité visuelle fictive, rédaction, intégration responsive de la navigation et de l’introduction, deux inspirations d’aménagement, volets explicatifs et schéma SVG correspondant au meuble d’entrée. Retour permanent vers Baerg et contrôles d’accessibilité. La demande de devis n’est pas construite : elle est explicitement indisponible, sans formulaire ni collecte. La méthode et la zone d’intervention restent à développer.

**Technologies.** HTML rendu par modules Node.js, CSS Grid et media queries, navigation au défilement en JavaScript, éléments HTML natifs interactifs, SVG, images JPEG et polices locales. Export statique via le build existant ; tests Playwright et axe.

**Trois choix de conception.**

1. Une grande photographie à gauche et un ensemble compact titre, texte et action à droite : le meuble occupe le premier plan sans bandeau de titre vide sur ordinateur.
2. Barlow Condensed, tons pierre et accent brique pour une identité d’atelier, avec photographie non déformée.
3. Une liste de deux aménagements avec vignettes à droite, un schéma explicatif relié à l’image et des volets HTML natifs : l’organisation du meuble s’explique au clic, au clavier et sans JavaScript.

**Route :** `/concepts/atelier-traverse/`.

**Captures :** premier écran [ordinateur, 1440 × 900](captures/atelier-traverse-1440-ecran.jpg) et [mobile, 390 × 844](captures/atelier-traverse-390-ecran.jpg) ; pages complètes [ordinateur](captures/atelier-traverse-1440.jpg) et [mobile](captures/atelier-traverse-390.jpg).

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
