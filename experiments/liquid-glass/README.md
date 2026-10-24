# Thomas — essai de deux liens liquid glass

24 octobre 2026. Branche `dev_t`, base `0c9d074`. Essai isolé dans un worktree ; aucune modification sur `dev_q`.

## Ouvrir et comparer

Node.js 22.12 ou supérieur est nécessaire pour compiler les composants.

Depuis la racine de ce worktree :

```sh
npm run setup:glass
PORT=4613 npm run dev:glass
```

- Référence : `http://127.0.0.1:4613/?glass=original`
- Essai : `http://127.0.0.1:4613/?glass=liqui`
- Sans paramètre, le site reste dans son état original.

Les deux seules cibles sont les liens du hero « Découvrir les réalisations » (`/realisations/`) et « Discuter d’un projet » (`/contact/`). Le reste de la page, les cinq routes et les trois maquettes ne sont pas modifiés. Aucun réglage n’est enregistré dans le navigateur.

## Architecture et dépendances

Le dossier a son propre `package.json`, son lockfile et ses `node_modules`. Versions verrouillées, notamment React 19.2.0, Liqui Design 0.5.0, Tailwind 4.3.3 et Vite 8.3.5. Les outils du registre shadcn/Base UI sont disponibles ici ; le site complet reste en HTML/CSS natif.

`src/components/ui/glass-link.tsx` adapte l’anatomie et les valeurs optiques du Button officiel en **vrai lien HTML**. Il utilise directement le même noyau `LiquiGlass` ; aucun `role=button`, gestionnaire de clic simulant la navigation ou élément interactif imbriqué. Le composant Base UI Button d’origine est conservé dans `provenance/button.registry.json` pour référence, avec les jetons et la licence MIT. Aucun besoin du CLI shadcn pendant l’exécution du site.

- Source officielle : https://github.com/leefanv/liqui-design
- Registre consulté : https://liqui.design/r/button.json et https://liqui.design/r/liqui.json
- Licence : `provenance/LICENSE-liqui.txt`.

Les styles de surface de la bibliothèque sont compilés avec les styles locaux. Seuls les utilitaires Tailwind préfixés `lgx:` sont utilisés ; le reset global/preflight est exclu. Les jetons `--lq-*` sont définis sur les liens, sans importer les couleurs bleues/grises globales du fournisseur.

`assets/liquid-glass-loader.js` ne charge le module React et le CSS que pour `?glass=liqui`, sur le hero. Les liens d’origine ne sont masqués qu’après un montage réussi. Sans JavaScript, filtre de fond, module ou feuille de style, ils restent accessibles. Aucun iframe : les surfaces peuvent réfracter le vrai paysage derrière elles.

## Direction visuelle

- Premier lien : surface crème légèrement orangée, encre brune et bord lumineux.
- Second : surface plus transparente rouge chaud, texte crème et reflet orange.
- Rayon 12 px, cibles de 56–58 px minimum, hauteur et largeur adaptées aux mêmes points de rupture que le hero.
- Réfraction 45 / 32, biseau 11 / 9, dispersion chromatique désactivée. Le texte reste au-dessus de la matière.
- Survol discret de la flèche et pression légère ; transitions et apparition de la lentille supprimées avec mouvement réduit. Focus visible double ton.

La documentation officielle limite la réfraction SVG à Chromium. Safari/WebKit et Firefox utilisent automatiquement le dépoli. Les tests exécutés confirment le mode réfractif dans Chromium et le mode dépoli dans WebKit. Aucun rendu identique entre moteurs n’est revendiqué.

## Compiler, vérifier et exporter

```sh
npm run build:glass
npm run test --prefix experiments/liquid-glass
npm run build
```

Le build dépose `glass.js` et `glass.css` dans `assets/liquid-glass/`, ignoré par Git. L’export racine compile d’abord le composant puis copie ses fichiers dans `dist/assets/`. La configuration force React en mode production et minifie le module.

Mesures locales : JS de 273 590 octets (71 835 gzip), CSS de 4 192 octets (1 449 gzip). Le serveur de prévisualisation ne compresse pas les réponses : les poids gzip indiquent le potentiel sur un hébergement compressé. Le petit chargeur est le seul ajout réseau de l’accueil par défaut ; React et les styles de verre ne sont pas téléchargés dans ce mode.

**30 tests réussis**, Chromium et WebKit : 320, 390, 650, 651, 820, 1050, 1440 et 1920 px ; débordements et texte, vrais liens, clavier, nouvel onglet, replis module/CSS/JavaScript/filtre, focus, préférence de mouvement réduit, absence de requête d’envoi. Axe A/AA sans violation détectée sur les actions à 390 et 1440 px.

Les deux rendus ont été inspectés visuellement à 390, 820 et 1440 px. Export statique vérifié dans Chromium : cinq routes, trois maquettes et deux liens liquid glass, sans erreur de ressource ou de script. Tests en émulation, sans certification exhaustive ni essai sur téléphone physique.

## Isolation et Git

Le dossier principal du portfolio reste sur `dev_q`. Ce worktree est sur `dev_t`, avec ses propres dépendances et son port 4613. Les fichiers compilés, node_modules et rapports de test ne sont pas commités. Aucune fusion vers `dev_q`, publication ou mise en ligne.
