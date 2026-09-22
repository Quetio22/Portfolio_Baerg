# Midi & Compagnie — premier aperçu

Route : `/concepts/midi-et-compagnie/` sur le port habituel du serveur.

Document indépendant en HTML rendu par Node, CSS et JavaScript natifs. Le build exporte automatiquement cet aperçu. Il reste non indexable et hors sitemap. Un bandeau permanent indique le caractère fictif et permet de revenir aux réalisations de Baerg, y compris sur téléphone.

## Périmètre

Navigation, introduction et carte illustrative de six propositions. Les filtres sont de simples boutons à état pressé, accessibles au clavier. Sans JavaScript, la carte entière reste visible. Les accès rapides mobiles mènent à la carte et au bandeau d’horaires existants. Réservation explicitement indisponible : aucun formulaire, aucune transmission, aucune confirmation fictive de réservation.

Horaires fictifs centralisés dans le module : lundi–vendredi, ouverture 11 h 30–14 h 30, cuisine 11 h 30–14 h, fermeture le week-end. Aucune offre de petit-déjeuner ou de dîner, aucun contact ni adresse réels.

## Direction artistique

Blanc neutre `#FAFAF7`, aubergine `#51283F`, rose pâle `#F0E3E8`, citron `#E8ED83`, texte `#29272A`. Fraunces 600 pour les titres ; Manrope 400/600 pour la carte et les textes. Polices téléchargées depuis Google Fonts et hébergées localement, licences SIL OFL incluses dans `fonts/` (sources officielles : https://github.com/google/fonts/tree/main/ofl/fraunces et https://github.com/google/fonts/tree/main/ofl/manrope).

## Photographies

Deux photographies de stock réelles remplacent les anciennes illustrations IA : une table de bistrot par Manek Singh (Unsplash) et une tarte Tatin aux poires par Geraud pfeiffer (Pexels). Elles sont hébergées localement en WebP et identifiées comme photographies d’illustration. La tarte ne prétend pas reproduire la recette poire-amande de la carte.

Voir [IMAGES.md](IMAGES.md) pour les sources, auteurs, licences vérifiées, dimensions, poids et cadrages. Les anciens JPEG générés ne sont plus utilisés ; leur historique reste disponible dans Git.

## Vérifications

Fiche, captures et compte rendu de la passe finale Chromium/WebKit : `docs/concepts/fiches-portfolio.md` et `docs/concepts/verification.md` à la racine du projet. Pas de test sur iPhone physique ; l’audit automatique ne remplace pas une évaluation complète avec lecteur d’écran.
