# Vérifications — 13 septembre 2026

## Résultats

- Build des sept pages HTML, page 404 statique, ressources, robots et sitemap.
- 13 tests Node : champs, antispam, expiration du quota, réponses fournisseur simulées, idempotence, absence de configuration, origine, méthode, type JSON, taille de requête, erreurs, limite de tentatives, faux en-têtes proxy, pages et sécurité HTTP. Le passage en mode public, les URLs canoniques, le sitemap et les métadonnées de partage sont vérifiés avec une configuration de test en mémoire. La revalidation du cache et la réponse `304` sont également vérifiées.
- 14 tests Chromium : sept pages aux largeurs 320, 390, 600, 768, 1 024 et 1 440 px ; aucun débordement horizontal détecté. Un test supplémentaire conserve réellement les anciens styles beiges dans le cache, puis vérifie que la nouvelle page affiche la palette charbon et blanc sans vidage manuel du cache ni interception réseau.
- Axe WCAG 2 A/AA et 2.1 AA sur les sept pages à 390 et 1 440 px : aucune violation détectée.
- Menu mobile au clavier : ouverture Entrée, Tabulation, Escape, retour du focus, lien actif, navigation effective.
- Tous les liens internes vérifiés, titres et descriptions uniques, ressources chargées, aucune exception JavaScript, erreur de console inattendue ni requête vers une ressource tierce pendant les parcours.
- Formulaire désactivé sans configuration ; validation native, indisponibilité réseau, erreur serveur, attente, conservation des saisies, nouvelle tentative et succès avec fournisseur **simulé**.
- Navigation utilisable sans JavaScript, texte doublé à 768 px sans débordement horizontal, préférence de réduction des mouvements respectée.
- Inspection visuelle des captures de l’accueil mobile/ordinateur et du contact ordinateur.
- Polices et licences présentes localement ; image de partage générée à 1 200 × 630 px.

## Mise à jour de la palette charbon et blanc

- Palette centralisée dans `public/styles.css` : navigation et accueil blancs, alternance blanc/gris très clair, pied de page charbon. Suppression des variables et surfaces de marque vertes, ombres et dégradés teintés compris.
- Maquettes de marque d’accueil et illustration À propos recolorées dans leur code source ; favicon SVG modifié et image de partage PNG régénérée depuis sa source. Pinyon Script, les autres polices, les contenus et les fonctionnalités sont préservés. Aucun projet client publié actuellement, aucun filtre ajouté aux images de projets.
- Paragraphes courants vérifiés à 16–17 px sur les sept pages, sans transparence. Les compositions typographiques et miniatures conservent leurs tailles propres. Correction du débordement de la grille de valeurs à 200 % de texte.
- Contrastes calculés : charbon/blanc **15,49:1**, paragraphes/blanc **9,09:1**, paragraphes/gris très clair **8,27:1**, texte secondaire/pied de page **11,33:1**, bordures de champs et menu/blanc **3,66:1**, texte désactivé **6,65:1**.
- Build réussi ; **13 tests Node et 14 tests Chromium réussis**. Sept pages vérifiées à 320, 390, 600, 768, 1 024 et 1 440 px ; aucune violation Axe sur les sept pages à 390 et 1 440 px.
- Contrôles supplémentaires : menu mobile ouvert et focus clavier visibles, survol du bouton principal, champs à 16 px, bouton désactivé, messages d’erreur et de succès simulés. Aucune violation Axe dans le menu ouvert ni sur les messages simulés. Aucun e-mail réellement envoyé.
- Captures inspectées : accueil ordinateur/mobile, À propos ordinateur, contact mobile, menu ouvert et image de partage. Le site ne possède ni navigation sticky ni mode sombre distinct ; sa palette claire reste lisible avec une préférence système sombre.
- `npm run format:check` et `git diff --check` réussis.

## Limites

Le site n’a pas été publié. Aucun domaine ni service e-mail réel n’a été configuré, aucun e-mail envoyé et aucune réception vérifiée. Les informations légales définitives dépendent des renseignements listés dans README.

Les tests ont été exécutés sur Chromium dans cet environnement, sans appareil physique ni lecteur d’écran. Axe et les tests clavier ne constituent pas un audit exhaustif d’accessibilité. Les pages sont vérifiées avec leur contenu actuel ; refaire une passe visuelle après ajout de projets ou modification substantielle des textes.

Les protections sont vérifiées pour un seul serveur Node local. TLS, le reverse proxy, les journaux et les limites de la plateforme devront être vérifiés sur l’hébergement retenu. Aucun audit externe de sécurité ni mesure de performance en réseau mobile réel n’a été réalisé.
