# Vérifications — 13 septembre 2026

## Résultats

- Build des sept pages HTML, page 404 statique, ressources, robots et sitemap.
- 12 tests Node : champs, antispam, expiration du quota, réponses fournisseur simulées, idempotence, absence de configuration, origine, méthode, type JSON, taille de requête, erreurs, limite de tentatives, faux en-têtes proxy, pages et sécurité HTTP. Le passage en mode public, les URLs canoniques, le sitemap et les métadonnées de partage sont vérifiés avec une configuration de test en mémoire.
- 13 tests Chromium : sept pages aux largeurs 320, 390, 600, 768, 1 024 et 1 440 px ; aucun débordement horizontal détecté.
- Axe WCAG 2 A/AA et 2.1 AA sur les sept pages à 390 et 1 440 px : aucune violation détectée.
- Menu mobile au clavier : ouverture Entrée, Tabulation, Escape, retour du focus, lien actif, navigation effective.
- Tous les liens internes vérifiés, titres et descriptions uniques, ressources chargées, aucune exception JavaScript, erreur de console inattendue ni requête vers une ressource tierce pendant les parcours.
- Formulaire désactivé sans configuration ; validation native, indisponibilité réseau, erreur serveur, attente, conservation des saisies, nouvelle tentative et succès avec fournisseur **simulé**.
- Navigation utilisable sans JavaScript, texte doublé à 768 px sans débordement horizontal, préférence de réduction des mouvements respectée.
- Inspection visuelle des captures de l’accueil mobile/ordinateur et du contact ordinateur.
- Polices et licences présentes localement ; image de partage générée à 1 200 × 630 px.

## Mise à jour de la palette vert sapin

- Remplacement des anciens tons bordeaux, crème et beige, y compris dans les ombres, la composition d’accueil, le favicon et l’image de partage. Palette centralisée dans les variables CSS.
- Contrastes calculés : blanc/vert sapin **12:1**, charbon/blanc froid **14,04:1**, textes secondaires sur fond clair **5,47:1**, textes secondaires sur fond vert **9,20:1**. Bordures des champs **3,23:1**, contour du menu **3,84:1**, texte désactivé **5,02:1**, erreur **6,58:1**, confirmation **7,11:1**.
- Vérification supplémentaire du menu mobile ouvert avec Axe : aucune violation détectée. Le site ne possède pas de navigation sticky ni de mode sombre distinct ; les champs natifs conservent un schéma clair explicite.
- Inspection rapprochée des logos de navigation et de la composition d’accueil : espacement de « DESIGN » et taille de la signature adaptés aux petits écrans. Lien d’en-tête remplacé par « Discutons de votre projet », toujours vers Contact.

## Limites

Le site n’a pas été publié. Aucun domaine ni service e-mail réel n’a été configuré, aucun e-mail envoyé et aucune réception vérifiée. Les informations légales définitives dépendent des renseignements listés dans README.

Les tests ont été exécutés sur Chromium dans cet environnement, sans appareil physique ni lecteur d’écran. Axe et les tests clavier ne constituent pas un audit exhaustif d’accessibilité. Les pages sont vérifiées avec leur contenu actuel ; refaire une passe visuelle après ajout de projets ou modification substantielle des textes.

Les protections sont vérifiées pour un seul serveur Node local. TLS, le reverse proxy, les journaux et les limites de la plateforme devront être vérifiés sur l’hébergement retenu. Aucun audit externe de sécurité ni mesure de performance en réseau mobile réel n’a été réalisé.
