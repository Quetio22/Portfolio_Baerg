# Atelier Traverse — intégration finale vérifiée

> Historique de l’intégration initiale. Évolution demandée ensuite : numéros et notes latérales supprimés, repères renforcés et meuble détouré ajouté dans L’atelier. La comparaison pixel exacte ci-dessous concerne la version initiale, avant ces évolutions.

Date : 1 octobre 2026. Direction C — L’enseigne, Expressive personnalisé.

## Résultat

Route `/concepts/atelier-traverse/` conservée, redirection 308 depuis la variante sans slash, ancres historiques conservées, export statique et noindex. Document autonome sans chargement des styles, du thème ou de la navigation partagée de Baerg. Fiche et vignette Traverse actualisées, autres projets inchangés.

Réglages finaux figés dans styles.css ; interaction et mouvement dans app.js. Aucune dépendance au Design Lab, au Polish Studio, à une URL de réglages ou au stockage navigateur.

## Fidélité

Comparaison Chromium sur la même machine, mouvement réduit, images chargées : **zéro pixel différent avant le pied de page** à 390, 820 et 1440 px. Comparaison des positions, dimensions, polices, espacements, couleurs et cadrages de 12 éléments principaux : égalité exacte à 320, 390, 650, 651, 820, 1000, 1440 et 1920 px. Captures finales inspectées visuellement à 390, 820 et 1440 px.

Les PNG 1536 × 1024 ont été convertis en WebP sans perte ; égalité des pixels RGB vérifiée pour les deux fichiers. Environ 1,36 Mo chacun, contre 2,1 Mo environ pour les originaux. Hero prioritaire, études chargées à la demande, dimensions réservées. Vignette JPEG 1440 × 1080 : 117 988 octets.

Écart approuvé : lien Retour à Baerg dans le pied de page ; sa hauteur diffère donc de la référence. Métadonnées, focus, anciennes ancres, indication sans JavaScript et comportement du dialogue sont adaptés à l’intégration.

## Fonctionnement et non-régression

- 20 tests Traverse réussis sur Chromium et WebKit : huit largeurs, clavier, focus, fermeture/restitution du focus, formulaire local sans requête d’envoi, remise à zéro à la fermeture, absence de cookies/stockage, tactile et rotation, JavaScript désactivé et préférence de mouvement réduit dynamique.
- Analyse axe WCAG A/AA sans violation détectée sur page et dialogue à 390 et 1440 px, dans les deux moteurs.
- Suite complète : 139/140 contrôles réussis au premier passage ; le test WebKit de texte agrandi a subi une indisponibilité transitoire du serveur local, puis a réussi seul lors de la relance. Aucun échec restant.
- 13 tests serveur réussis, fournisseur de messagerie simulé ; aucun e-mail réel envoyé.
- Build local réussi : sept pages et trois concepts, mode prévisualisation non indexable.
- Formatage des nouveaux fichiers de code vérifié ; diff sans erreur d’espacement.
- 126 fichiers des expériences du Design Lab vérifiés par SHA-256, tous inchangés. Les captures Lise régénérées automatiquement par ses tests ont été restaurées, sans changement aux autres projets.

## Limites voulues

Contact exclusivement démonstratif : aucun service d’envoi lié à Traverse. Le bouton est désactivé sans JavaScript, avec explication visible. Les contrôles tactiles utilisent une émulation, pas des appareils physiques. La comparaison pixel exacte est propre au moteur et à l’environnement de test ; Arial peut varier selon le système. Aucun déploiement, publication ou push.

## Évolution du 2 octobre 2026

Scène brutaliste avec étagère sortant du cadre, à la place du meuble isolé. Galerie de deux images avec échange de proportions au clic et transition de 650 ms. Huit largeurs contrôlées sans débordement ; captures visuelles des deux états à 390, 820 et 1440 px. Les 20 contrôles précédents passent dans les deux moteurs ; les 6 contrôles dédiés à la galerie vérifient l’échange des dimensions, le clavier et la préférence de mouvement réduit.
