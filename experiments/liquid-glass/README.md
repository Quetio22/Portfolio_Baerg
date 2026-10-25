# Thomas — boutons liquid glass et cartes liées

25 octobre 2026. Branche `dev_t`, worktree isolé ; aucune fusion vers `dev_q`.

## Démarrer et comparer

Node.js 22.12 ou supérieur :

```sh
npm run setup:glass
PORT=4613 npm run dev:glass
```

Le verre est actif par défaut sur les actions des cinq pages. `?glass=original` conserve les actions natives pour comparer. Les deux liens du hero restent originaux dans tous les modes. Aucun réglage ne dépend du stockage du navigateur. Les trois maquettes de projets ne sont pas modifiées.

## Intégration

`assets/liquid-glass-loader.js` charge les surfaces compilées. `src/main.tsx` décore les vrais liens et boutons existants : leur destination, leurs gestionnaires, les formulaires et la navigation clavier restent natifs. Une surface décorative non interactive est placée derrière chaque action ; le texte reste au-dessus. En cas d’échec de chargement, sans JavaScript ou sans filtre compatible, les actions originales restent accessibles.

La couleur est choisie à partir du fond et du texte d’origine : orange pour les actions orange, crème pour les fonds clairs, rouge transparent sur fond sombre. Reflets chauds, rayon 8 px (12 px pour fermer les fenêtres), réfraction 38 pour les actions et 24 pour les petites commandes. Pas de dispersion chromatique. Focus visible, cibles adaptées et mouvement réduit respecté.

Les dépendances et leur lockfile sont isolés dans ce dossier : React 19.2.0, Liqui Design 0.5.0, Tailwind 4.3.3, Vite 8.3.5. Aucun reset Tailwind ni jeton global du fournisseur. La provenance du Button officiel et sa licence MIT restent dans `provenance/` ; les éléments interactifs du portfolio restent natifs.

Sources officielles : https://github.com/leefanv/liqui-design ; https://liqui.design/r/button.json ; https://liqui.design/r/liqui.json.

Chromium utilise la réfraction SVG. WebKit utilise automatiquement un verre dépoli ; les rendus diffèrent selon le moteur. Les essais n’incluent pas Firefox.

## Cartes du studio

La page À propos utilise `assets/studio-duo.css` et `assets/studio-duo.js`, sans dépendance React pour leur interaction. Deux cartes, un repère partagé et un mouvement réciproque : survol ou focus pour explorer, bouton pour fixer la sélection, second clic ou Échap pour réinitialiser. Les flèches du clavier passent d’une commande à l’autre. Sur mobile, les cartes sont empilées et se sélectionnent au toucher ; aucun texte n’est masqué. Le mouvement réduit supprime les transitions et déplacements. Voir `STUDIO-DUO.md` pour les références.

## Vérifier et exporter

```sh
npm run build:glass
npm run test --prefix experiments/liquid-glass
npm run build
```

Le build produit `assets/liquid-glass/glass.js` et `glass.css`, ignorés par Git, puis les inclut dans `dist/`. React est compilé en production et minifié. Poids indicatifs : JS 273 ko (72 ko gzip), CSS 3,9 ko (1,3 ko gzip). Le serveur local ne compresse pas les réponses. React est chargé sur chaque page avec verre ; le mode original évite ce téléchargement.

La suite comprend 38 tests Chromium/WebKit : cinq routes aux largeurs 320, 390, 650, 651, 760, 820, 1050, 1440 et 1920 px ; débordements, liens originaux du hero, menu, fenêtres, formulaire de brouillon, nouvel onglet, replis de chargement, clavier, toucher et rotation, mouvement réduit. Axe A/AA est limité aux surfaces modifiées et aux cartes à 390 et 1440 px. L’export statique est également vérifié sur cinq routes et trois maquettes. Tests en émulation, sans essai sur téléphone physique.

Le formulaire conserve son fonctionnement local : copie d’un brouillon, aucun envoi. Aucun déploiement ni publication.

## Ajustement du verre orange — 25 octobre

Teintes orange à 38 % / 58 % d’opacité, densité de dépoli 0,22, reflet spéculaire 1 et bord supérieur lumineux. Texte brun foncé pour maintenir le contraste sur la surface plus transparente. Les surfaces crème et rouges et les liens du hero sont inchangés. Build réussi et quatre contrôles multi-pages Chromium/WebKit à 390 et 1440 px réussis, avec Axe sur les composants modifiés.
