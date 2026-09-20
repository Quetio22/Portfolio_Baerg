# Atelier Traverse — aperçu

Route : http://127.0.0.1:3011/concepts/atelier-traverse/ (ou le port habituel du serveur).

Aperçu limité à la navigation, au premier écran et à deux inspirations d’aménagement. Les volets explicatifs utilisent des éléments HTML `details` et restent utilisables sans JavaScript. La demande de devis est explicitement indisponible. Le concept n’est pas ajouté au portfolio Baerg à ce stade.

## Architecture

- Document autonome : `src/concepts/atelier-traverse.js`.
- Registre de routes : `src/concepts/index.js` ; branche dédiée dans `server.js`.
- CSS, JavaScript, favicon, polices et images isolés dans ce dossier.
- Export inclus dans `dist/concepts/atelier-traverse/index.html` par `npm run build`.
- Aperçu non indexable et exclu du sitemap. Les pages et styles de Baerg restent inchangés.

## Images et provenance

Illustrations originales générées avec l’outil intégré imagegen le 20 septembre 2026 pour cet exercice fictif. Aucun chantier réel, aucune photographie de client, aucune marque tierce. Les légendes visibles identifient les images d’inspiration générées par IA. Versions JPEG optimisées depuis les originaux PNG ; pas de service d’images externe appelé par le navigateur.

Fichiers : `images/entree.jpg` et `images/bibliotheque.jpg`.

Le schéma de façade a été dessiné en SVG à partir de l’illustration d’entrée retenue : deux portes à gauche, trois patères, une assise et deux tiroirs à droite. Il explique l’organisation du rangement, sans constituer un plan de fabrication.

### Prompt entrée — outil intégré imagegen

Use case: photorealistic-natural. Asset type: original inspiration image for a fictional Swiss joinery concept website Atelier Traverse. Generate a landscape 1536x1024 editorial interior photograph, absolutely no text or watermark. A functional small apartment entryway with precisely built natural pale oak cabinetry. Front-on elevation camera, straight verticals. Whole cabinet fully visible centered with margins, floor and neutral plaster wall. Cabinet has exactly two zones: left 40% width two full-height closed oak doors with long slender wooden handles; right 60% a recessed sitting bench, TWO equal wide closed shoe drawers under the seat, and a plain oak back panel above with THREE small wooden coat pegs in a horizontal row, one dark olive jacket hanging on one peg. Simple bag on bench, no people. Tall doors reach the same top as the right niche surround. Natural side daylight, tactile wood grain, modest lived-in home, pale grey stone floor. No gilding, luxury staging or excessive decor. Realistic buildable furniture, precise joinery, warm wood against cool neutral walls. Photo only, not a website mockup.

### Prompt bibliothèque — outil intégré imagegen

Use case: photorealistic-natural. Asset type: inspiration image for a fictional Swiss joinery website. Landscape 1536x1024 editorial photograph of a built-in pale oak open bookshelf in a modest contemporary living room, natural window light from left. Strong perpendicular geometric structure: floor-to-ceiling oak bookcase with three vertical bays, varied shelf heights holding books of assorted neutral and brick-red spines, understated everyday ceramics, closed low cupboards across the bottom. A small rust-red upholstered reading chair partly visible at right and a wool rug. Wood grain, matte finish, precise joinery, believable lived-in interior, neutral white walls, balanced daylight rather than golden filter. Furniture is protagonist, realistic practical craftsmanship, no luxury mansion codes. No people, text, logos, watermarks. Entire bookcase visible, straight verticals, appealing composed architectural photograph, not a website mockup.

## Polices

Barlow Condensed 600 et Source Sans 3 400/600, hébergées localement. Sources : Google Fonts (`fonts.gstatic.com`). Licences SIL OFL incluses dans `fonts/` ; textes récupérés depuis les dossiers `ofl/barlowcondensed` et `ofl/sourcesans3` du dépôt officiel https://github.com/google/fonts.
