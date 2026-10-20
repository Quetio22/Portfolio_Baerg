# 08A initial — Fusion

Base de développement transférée du Baerg Design Lab le 20 octobre 2026, à la demande du studio, sur `dev_q`. Il s’agit exactement de la version `08A-initial` conservée dans le Lab (forêt et montagne en couches séparées), pas de la révision au paysage recomposé qui avait été supprimée.

## Démarrer

Depuis la racine de Portfolio_Baerg : `npm run dev:fusion`, puis http://127.0.0.1:4612. Le serveur sert uniquement ce dossier. Aucun paquet supplémentaire ni accès au Lab nécessaire.

## Construire le site

- `index.html` : contenu, navigation, sections et dialogues.
- `common.css` : styles de base ; `fusion.css` : composition 08A et responsive.
- `app.js` : menu et dialogues ; `motion.js` : parallaxe et préférences de mouvement.
- `assets/` : images et polices locales, licences de polices conservées.
- `demos/` : trois maquettes fictives autonomes, avec retour vers cette page.
- `brief.md`, `notes.md`, `captures/`, `provenance/` : historique de conception, captures et provenance des images générées. Les chemins du Lab mentionnés dans les notes sont historiques.

Les liens vers le comparateur et les directions du Lab ont été retirés ; le reste de la composition est conservé. Les ressources partagées ont été rapatriées sans régénération. La vérification historique reste dans `verification.json`, celle du transfert dans `transfer-verification.json`.

Cette base reste un prototype : le contact copie un brouillon, sans envoi, et les projets sont fictifs. Les images sont du concept art généré, avec provenance conservée. L’intégration au serveur principal, le formulaire réel et la publication restent à réaliser. Le site existant du dépôt est conservé ; `npm run dev` continue à le lancer.
