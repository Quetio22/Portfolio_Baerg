# Midi & Compagnie — premier aperçu

Route : `/concepts/midi-et-compagnie/` sur le port habituel du serveur.

Document indépendant en HTML rendu par Node, CSS et JavaScript natifs. Le build exporte automatiquement cet aperçu. Il reste non indexable et hors sitemap. Un bandeau permanent indique le caractère fictif et permet de revenir aux réalisations de Baerg, y compris sur téléphone.

## Périmètre

Navigation, introduction et carte illustrative de six propositions. Les filtres sont de simples boutons à état pressé, accessibles au clavier. Sans JavaScript, la carte entière reste visible. Les accès rapides mobiles mènent à la carte et au bandeau d’horaires existants. Réservation explicitement indisponible : aucun formulaire, aucune transmission, aucune confirmation fictive de réservation.

Horaires fictifs centralisés dans le module : lundi–vendredi, ouverture 11 h 30–14 h 30, cuisine 11 h 30–14 h, fermeture le week-end. Aucune offre de petit-déjeuner ou de dîner, aucun contact ni adresse réels.

## Direction artistique

Blanc neutre `#FAFAF7`, aubergine `#51283F`, rose pâle `#F0E3E8`, citron `#E8ED83`, texte `#29272A`. Fraunces 600 pour les titres ; Manrope 400/600 pour la carte et les textes. Polices téléchargées depuis Google Fonts et hébergées localement, licences SIL OFL incluses dans `fonts/` (sources officielles : https://github.com/google/fonts/tree/main/ofl/fraunces et https://github.com/google/fonts/tree/main/ofl/manrope).

## Visuels et prompts

Deux illustrations originales créées avec l’outil intégré imagegen le 20 septembre 2026, optimisées en JPEG dans `images/dejeuner.jpg` et `images/tarte.jpg`. Elles sont explicitement identifiées comme images d’inspiration générées par IA et ne représentent pas un établissement réel. Aucun chargement tiers de polices ou d’images dans le navigateur.

### Déjeuner — prompt imagegen

Use case: photorealistic-natural. Original inspiration photograph for a fictional contemporary neighborhood lunch bistro in Bulle Switzerland named Midi & Compagnie. Wide landscape 1536x1024. A convivial daylight lunch table, overhead at a gentle 45-degree angle, beautiful natural midday window light. Two generous everyday lunch plates on a light wooden table: one golden toasted mushroom and melted Gruyere cheese croque sandwich cut in half with green side salad; one ceramic plate with roast chicken, roasted potatoes and carrots. Small white bowl of creamy pumpkin soup, sliced bread, sparkling water carafe, two small glasses of water, folded muted plum linen napkin, ordinary silver cutlery. White ceramic with plum rim, no fancy fine dining, no alcohol, no candles, no breakfast pastries, no dinner ambiance. Background edge hints of a plum upholstered bistro bench, cozy approachable real-world neighborhood cafe. Appetizing realistic textures, small crumbs, natural unfiltered food colors. Composition with plates arranged across the central horizontal band so it crops well into a wide panorama. No people, labels, text, logos or watermarks. Photograph only, not a website mockup.

### Dessert — prompt imagegen

Use case: photorealistic-natural. Original inspiration food photograph for a fictional Swiss lunch bistro. Portrait 1024x1536 close view of a simple homemade pear and almond tart slice on a white ceramic plate with a thin plum rim, a little dollop of cream, golden flaky crust with visible pear slices. An espresso in small white cup and glass of water sit just behind. Light wooden bistro table, neatly folded muted aubergine linen napkin, ordinary spoon. Daylight only, lunchtime, natural side window light, cozy everyday cafe, close photographic detail, appetizing realistic textures. Colors faithful to actual food, restrained stylish composition, generous slice not tiny fine dining, no gold, no candles, no labels, no text, no brand, no people, no watermark. This is a single photo, not website design.

## Vérifications

Fiche, captures et compte rendu de la passe finale Chromium/WebKit : `docs/concepts/fiches-portfolio.md` et `docs/concepts/verification.md` à la racine du projet. Pas de test sur iPhone physique ; l’audit automatique ne remplace pas une évaluation complète avec lecteur d’écran.
