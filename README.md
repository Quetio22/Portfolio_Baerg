# Baerg Design — 08A Fusion

Le site 08A est directement à la racine de `Portfolio_Baerg`, sur la branche `dev_q`.

## Démarrer

Node.js 22.9 ou supérieur. Aucune dépendance à installer.

```sh
npm run dev
```

Ouvrir l’adresse affichée dans le terminal : http://127.0.0.1:4612 par défaut. Si ce port est occupé, `npm run dev` choisit automatiquement le prochain port libre. Modifier les fichiers, puis recharger le navigateur. Arrêter le serveur avec `Ctrl+C`.

`npm start` lance le serveur sans surveillance, sur le port fixe 4612. Pour imposer un autre port : `PORT=4613 npm run dev`. Un port explicitement demandé reste fixe et affiche un message clair s’il est occupé.

## Modifier le site

- `index.html` : Accueil et paysage 08A.
- `a-propos/index.html`, `realisations/index.html`, `offres/index.html`, `contact/index.html` : les quatre autres pages.
- `pages.css` : styles des pages et des sections communes.
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

## Contenu des pages

Les textes reprennent presque intégralement `src/content.js` et les pages de `src/site.js` de la branche `Dev`, commit `629787dd14e5e917d0c20c2a3afd4a395ae76de1`. La page Offres reprend désormais le texte fourni par le studio : refonte à 3’500 CHF (forfait de référence), avec photographies professionnelles en option à 800 CHF. Le périmètre et les livrables sont précisés dans le devis. Le slogan et le paysage de l’accueil restent ceux de 08A. Le formulaire Contact reprend les champs existants et prépare un brouillon local ; la messagerie reste non configurée.

## Paysage d’accueil

`assets/fusion-landscape.png` est le paysage continu choisi par le studio : arbres orangés à gauche et fissure dans la montagne à droite. Il remplace la composition initiale en couches séparées. Le paysage entier partage le même cadrage et le même déplacement ; les arbres ne servent plus de fond à une montagne ajoutée. Provenance dans `provenance/fusion-landscape.json`.
