# Baerg Design — 08A Fusion

Le site 08A est directement à la racine de `Portfolio_Baerg`, sur la branche `dev_q`.

## Démarrer

Node.js 22.9 ou supérieur. Aucune dépendance à installer.

```sh
npm run dev
```

Ouvrir http://127.0.0.1:4612. Modifier les fichiers, puis recharger le navigateur. `npm start` lance le serveur sans surveillance. Le port est configurable avec `PORT`.

## Modifier le site

- `index.html` : contenu, navigation et sections.
- `common.css` : styles de base ; `fusion.css` : composition 08A et responsive.
- `app.js` : menu et dialogues ; `motion.js` : parallaxe et arrêt des mouvements.
- `assets/` : images, polices et licences.
- `demos/` : trois maquettes fictives et leurs ressources.
- `server.js` : aperçu local ; `scripts/build.js` : export statique.
- `brief.md`, `notes.md`, `captures/`, `provenance/` : historique propre à 08A. Les chemins du Lab cités dans ces archives sont historiques.

## Exporter

```sh
npm run build
```

L’export autonome est écrit dans `dist/`. Cette commande ne publie rien.

Le projet est la version `08A-initial` transférée du Lab le 20 octobre 2026, désormais sans dossier intermédiaire. L’ancien site est retiré de cette branche et reste accessible dans l’historique Git. Les visuels de concept art et leur provenance sont conservés. Le contact copie un brouillon sans envoyer de message ; les projets sont fictifs.
