# BDT-25 — Résultat de recette du 8 novembre 2026

**Statut proposé : recette partielle, ticket à conserver ouvert.**

Version testée : `Dev` / `80dc11290e29ecf9fe490855b3676b724c55b218`, identique à la branche distante au moment du contrôle. Tests dans une copie isolée, sans modification du site ni publication.

Résultats :

- 44/44 tests existants Chromium/WebKit réussis.
- 144 affichages vérifiés : huit pages, six largeurs, trois moteurs dont Firefox.
- 45/45 groupes de parcours complémentaires réussis ; copie de brouillon et refus du presse-papiers simulés, pas d’envoi réel.
- Aucune erreur JavaScript ni ressource en erreur dans la matrice normale ; 34 liens/ancres internes valides et 85 ressources publiques du build servies correctement.
- Deux builds identiques : 86 fichiers, 3 501 071 octets.
- Anciennes URL et vraie 404 opérationnelles localement.

À corriger ou finaliser :

1. **Contact bloquant** : aucun envoi ni réception, uniquement un brouillon copié ; aucun contact réel proposé sur cette page.
2. **Informations provisoires** : fenêtre légale/confidentialité encore rédigée pour un prototype.
3. **Contraste accueil** : plusieurs liens du menu sur l’image sont sous 4,5:1 ; « Contact » mesuré vers 2,37–2,45:1 à 1440 px.
4. **Configuration publique** : noindex dans les pages et les en-têtes ; indexation, partage social et hébergement à finaliser pour la production.
5. **URL sans barre finale** : `/contact?projet=refonte` devient `/contact/` et perd le préremplissage ; conserver les paramètres dans la redirection.
6. **Recette documentée** : l’ancien `verify-design.cjs` échoue sur 20 comparaisons avec le référentiel d’octobre ; distinguer historique et recette actuelle.

Restent non validés : Safari sur iPhone physique, Android physique, zoom système/navigateur sur appareil, réception réelle et échec d’envoi, préproduction et configuration de l’hébergeur. La comparaison au 4 novembre est technique par rapport au commit `bd94201` ; son rapport complet n’était pas disponible.

**Aucun GO de lancement. Aucun écart accepté au nom du studio.**

Rapport détaillé et preuves : [rapport.md](rapport.md).
