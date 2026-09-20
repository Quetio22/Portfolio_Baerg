# Vérifications

## Contrôle responsive — 19 septembre 2026

- **62 tests navigateur réussis** : 31 dans Chromium et 31 dans WebKit. Les 13 tests Node, le build des sept pages, le formatage et `git diff --check` passent également.
- Les sept pages sont contrôlées sur 14 formats : 320 × 568, 360 × 800, 375 × 667, 390 × 844, 430 × 932, 600 × 800, 601 × 800, 768 × 1024, 800 × 600, 801 × 600, 844 × 390, 932 × 430, 1024 × 768 et 1440 × 900. Texte normal et doublé dans chaque moteur : **392 combinaisons sans débordement horizontal de page ou de texte visible**.
- Corrections : retour à la ligne des titres et textes longs, grilles qui respectent l’espace disponible, logo gardé sur une ligne avec une largeur adaptée, navigation mobile jusqu’à 800 px, menu positionné sous la hauteur réelle de l’en-tête et refermé au passage en paysage large. L’agrandissement automatique du texte lors des changements d’orientation est stabilisé, sans interdire le zoom utilisateur.
- Les champs du formulaire se répartissent selon leur largeur disponible et passent sur une colonne sur téléphone. La section Contact passe sur une colonne jusqu’à 800 px. Champs à au moins 16 px ; liens de navigation mobile, boutons et actions isolées contrôlés avec une zone tactile d’au moins 44 × 44 px. Les liens du pied de page peuvent revenir à la ligne.
- Menu vérifié au toucher et au clavier, avec texte doublé, fermeture extérieure, Escape, retour du focus, lien actif et rotation. Formulaire vérifié avec saisie, listes de choix, hauteur réduite, erreurs et confirmation simulées, conservation des valeurs et focus sur le retour. Aucun envoi réel.
- Portraits : chargement des deux images, ratio 4:5 et absence de chevauchement à 320, 390, 600, 601 et 844 px. Captures inspectées pour l’accueil, le duo, le formulaire, le menu ouvert et le paysage ; identité et contenus conservés.
- Axe WCAG 2 A/AA et 2.1 AA sur les sept pages à 390 et 1440 px dans les deux moteurs, plus le menu ouvert : aucune violation détectée. Liens, ressources, cache, navigation sans JavaScript et réduction des mouvements vérifiés. Le contrôle de console distingue le message CSP provoqué uniquement par la feuille vide que Playwright injecte pendant les captures WebKit ; la politique de sécurité du site reste inchangée.
- Tests ajoutés dans `tests/browser/responsive.spec.js`. Pour les reproduire : `npx playwright install chromium webkit`, puis `npm run test:browser`. Captures dans `test-results/`, hors Git.

**Limites :** émulation de tailles et d’interactions tactiles sur ordinateur, sans téléphone physique. WebKit teste le moteur de Safari, pas une version iOS installée sur un iPhone. Le texte doublé est une simulation CSS ; le clavier virtuel est approché par une réduction de hauteur. Les projets publiés étant encore absents, leur contenu devra être revérifié lors de l’ajout. Le site n’a pas été déployé pendant ce contrôle.

## Historique — 13 septembre 2026

## Résultats

- Build des sept pages HTML, page 404 statique, ressources, robots et sitemap.
- 13 tests Node : champs, antispam, expiration du quota, réponses fournisseur simulées, idempotence, absence de configuration, origine, méthode, type JSON, taille de requête, erreurs, limite de tentatives, faux en-têtes proxy, pages et sécurité HTTP. Le passage en mode public, les URLs canoniques, le sitemap et les métadonnées de partage sont vérifiés avec une configuration de test en mémoire. La revalidation du cache et la réponse `304` sont également vérifiées.
- 14 tests Chromium : sept pages aux largeurs 320, 390, 600, 768, 1 024 et 1 440 px ; aucun débordement horizontal détecté. Un test supplémentaire conserve réellement les anciens styles beiges dans le cache, puis vérifie que la nouvelle page affiche la palette actuelle sans vidage manuel du cache ni interception réseau.
- Axe WCAG 2 A/AA et 2.1 AA sur les sept pages à 390 et 1 440 px : aucune violation détectée.
- Menu mobile au clavier : ouverture Entrée, Tabulation, Escape, retour du focus, lien actif, navigation effective.
- Tous les liens internes vérifiés, titres et descriptions uniques, ressources chargées, aucune exception JavaScript, erreur de console inattendue ni requête vers une ressource tierce pendant les parcours.
- Formulaire désactivé sans configuration ; validation native, indisponibilité réseau, erreur serveur, attente, conservation des saisies, nouvelle tentative et succès avec fournisseur **simulé**.
- Navigation utilisable sans JavaScript, texte doublé à 768 px sans débordement horizontal, préférence de réduction des mouvements respectée.
- Inspection visuelle des captures de l’accueil mobile/ordinateur et du contact ordinateur.
- Polices et licences présentes localement ; image de partage générée à 1 200 × 630 px.

## Direction atelier éditorial : encre, bleu et abricot

- Base blanche et encre `#292A30`, paragraphes `#50515A`, accents bleus `#4059D8` pour les actions et quelques repères. Abricot `#F0B89A` réservé aux annotations. Grandes sections neutres et pied de page encre conservés.
- Arche d’accueil remplacée par un concept d’interface de réservation, explicitement non commandé : cours, date et inscription regroupés, avec une annotation expliquant ce choix. Composition réalisée dans le code, signature Pinyon blanche sur feuille bleue. Aucun projet client inventé ni image de projet filtrée.
- Illustration À propos remplacée par une note de travail « Comprendre, Dessiner, Développer ». Présentation du duo plus concrète dans l’accueil ; logo, grands titres éditoriaux et fonctionnalités conservés. Titres de services en DM Sans 500, repères et légendes principaux agrandis, italiques réduits sur certains titres.
- Favicon bleu ; image de partage régénérée depuis la même fonction `studioArt()` et les styles du site.
- Contrastes calculés : blanc/bleu **5,77:1**, encre/abricot **8,19:1**, paragraphes/blanc **7,88:1**.
- **13 tests Node et 14 tests Chromium réussis**. Sept pages vérifiées à 320, 390, 600, 768, 1 024 et 1 440 px ; aucun débordement horizontal, y compris avec texte doublé à 768 px. Aucune violation Axe sur les sept pages à 390 et 1 440 px.
- Menu mobile ouvert, focus bleu, survol plus sombre, champs à 16 px, bouton désactivé et retours d’erreur/succès simulés contrôlés. Aucune violation Axe sur le menu ouvert et les messages simulés. Aucun e-mail réellement envoyé.
- Captures inspectées sur ordinateur, tablette et mobile ; cadrage du concept ajusté pour préserver la signature et l’action du prototype. Image de partage et note À propos inspectées.
- Aucun mode sombre distinct ni navigation sticky existants. Aucune photo réelle du duo disponible dans le projet : aucun portrait fictif ajouté.
- Build, formatage et contrôle des différences validés.

## Limites

Le site n’a pas été publié. Aucun domaine ni service e-mail réel n’a été configuré, aucun e-mail envoyé et aucune réception vérifiée. Les informations légales définitives dépendent des renseignements listés dans README.

Les tests ont été exécutés sur Chromium dans cet environnement, sans appareil physique ni lecteur d’écran. Axe et les tests clavier ne constituent pas un audit exhaustif d’accessibilité. Les pages sont vérifiées avec leur contenu actuel ; refaire une passe visuelle après ajout de projets ou modification substantielle des textes.

Les protections sont vérifiées pour un seul serveur Node local. TLS, le reverse proxy, les journaux et les limites de la plateforme devront être vérifiés sur l’hébergement retenu. Aucun audit externe de sécurité ni mesure de performance en réseau mobile réel n’a été réalisé.
