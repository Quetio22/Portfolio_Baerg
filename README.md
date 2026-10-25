# Baerg Design — Empreinte × Signal

Site multipage dans `Portfolio_Baerg`, sur la branche `dev_q`. L’accueil reprend la direction Empreinte du Design Lab, avec une atmosphère orange vif, fidèle à la référence Altrix, avec des sections crème. Les autres pages conservent leurs contenus et leurs compositions ; leur palette et leur traitement typographique sont harmonisés.

## Démarrer

Node.js 22.12 ou supérieur. Aucune dépendance à installer pour le site.

```sh
npm run dev
```

Ouvrir l’adresse affichée dans le terminal : http://127.0.0.1:4612 par défaut. Le mode développement choisit le prochain port libre si nécessaire. Recharger le navigateur après une modification. Arrêter avec `Ctrl+C`.

`npm start` utilise le port fixe 4612. Pour choisir un port : `PORT=4613 npm run dev`.

## Modifier le site

- `index.html` : accueil et contenu de présentation.
- `home.css` : composition Empreinte de l’accueil et responsive.
- `theme.css` : couleurs orange/crème, typographie, boutons et champs des cinq pages.
- `a-propos/`, `realisations/`, `offres/`, `contact/` : pages existantes.
- `pages.css` : mise en page des sections et des pages intérieures.
- `common.css`, `fusion.css` : styles de base et styles historiques conservés.
- `app.js` : menus, navigation au scroll, fenêtres et copie du brouillon de contact.
- `assets/empreinte-altrix.png` : matière de verre dans la palette Altrix de l’accueil.
- `assets/` et `demos/` : ressources et trois projets conceptuels.
- `provenance/empreinte-signal-2026-10-21/` : intentions, provenance du visuel et vérification de la conservation des pages.

La page Offres conserve l’offre Partenaire pilote (900 à 1’500 CHF indicatifs), le sponsoring, la refonte à 3’000 CHF et l’option photo à 800 CHF, avec leurs textes et conditions. Le formulaire prépare un brouillon local ; aucun message n’est envoyé. Les maquettes présentées restent des projets fictifs.

## Exporter

```sh
npm run build
```

L’export autonome est écrit dans `dist/`. Cette commande ne publie rien.

## Vérifier le design

Avec Playwright et Chrome disponibles :

```sh
SITE_URL=http://127.0.0.1:4612 node scripts/verify-design.cjs
```

Le script utilise le relevé de mise en page conservé dans `provenance/empreinte-signal-2026-10-21/layout-before.json`. `PLAYWRIGHT_MODULE` et `CHROME_PATH` permettent de préciser les runtimes ; `CAPTURE_DIR` permet de choisir le dossier des captures.

Les archives de 08A, ses images et leur provenance sont conservées. La nouvelle étude de matière est générée et statique ; sa provenance et son prompt sont documentés.

## Expérience Thomas — liquid glass

Sur `dev_t`, les boutons et CTA des cinq pages utilisent un verre teinté orange, crème ou rouge suivant leur couleur d’origine. Les deux liens du hero conservent leur présentation originale. `?glass=original` permet de comparer les actions natives. Les dépendances sont isolées dans `experiments/liquid-glass/` : `npm run setup:glass`, puis `PORT=4613 npm run dev:glass`. Le build général compile et inclut les assets dans l’export statique.

La page À propos relie « Notre histoire » et « Nos compétences » par un repère commun et un mouvement réciproque au survol, au focus ou à la sélection. Les contenus restent visibles. Styles et comportement limités à cette section dans `assets/studio-duo.css` et `assets/studio-duo.js`.

Détails, compatibilité et vérifications : `experiments/liquid-glass/README.md`. Intentions et références Taste Vault : `experiments/liquid-glass/STUDIO-DUO.md`.

## Icônes Lucide et aperçu sur téléphone

Les icônes des cinq pages et trois démos sont des SVG Lucide locaux, sans bibliothèque au chargement. Sources, licences et conventions : `assets/icons/README.md`. `npm run icons:sync` synchronise leur géométrie.

Pour un essai sur téléphone physique connecté au même réseau que le Mac :

```sh
PORT=4614 npm run dev:phone
```

Ouvrir `http://ADRESSE_LOCALE_DU_MAC:4614/` dans Safari. Ce mode écoute sur le réseau local ; le serveur normal reste limité à cet ordinateur. Arrêter avec Ctrl+C après le test. Ce mode ne publie pas le site sur Internet ; éviter un réseau partagé non fiable. L’aperçu HTTP local peut désactiver le presse-papiers automatique : le formulaire conserve son repli de copie manuelle.

La validation sur un appareil physique reste distincte des contrôles Playwright/WebKit. Tant que le modèle, la version iOS et les observations n’ont pas été relevés, elle doit rester marquée « en attente ».
