# 08A — Fusion · notes de direction

## Analyse et preuves visuelles

Sources : `../05C/index.html`, `../05C/mountain.css`, `../05C/mountain-split.png` ; `../07B/index.html`, `../07B/typography.css`, `../07B/forest.png`. Inspection réelle des deux images et de la capture `../type-studio/captures/07B-1440.png`.

05C apporte le volume anguleux, le graphite et une incision orange déjà intégrée à la roche. 07B apporte la densité forestière, les diagonales de brume, le vide à gauche et deux lignes typographiques de même importance. Les deux univers partagent une gamme sombre et un signal chaud localisé.

Le Vault annoncé n'est pas disponible dans ce poste : absent à `../baerg-taste-vault` et aucun `reference-to-design/SKILL.md` trouvé sous le dossier utilisateur. Sa documentation et ses captures n'ont pas été prétendument consultées. Application du workflow local et du brief explicite ; aucun nouveau skill ni Sites utilisé.

## Composition

Forêt plein cadre légèrement désaturée, montagne au centre/droite, canopée devant le pied de la roche par masque progressif. Un même voile latéral et inférieur relie le paysage au noir de l'interface. La lueur résiduelle des arbres accompagne celle de la fissure. Aucun nouvel asset généré, aucun traitement destructif des sources. Les masques et les niveaux lumineux sont en CSS ; le titre reste du HTML.

Mobile : titre puis relief dans le même paysage, introduction et actions dessous. La navigation, les sections, les projets fictifs et les dialogues reprennent le périmètre existant. Copies locales des pages de démonstration pour assurer le retour vers 08A, avec leurs ressources partagées inchangées.

Mouvement : déplacement limité à 3/2 px pour la forêt et 9/6 px pour le relief selon le pointeur fin ; traitement regroupé dans requestAnimationFrame uniquement sur entrée. Pulsation de l'opacité d'une copie du visuel masquée autour de l'incision, période de 6 secondes. Arrêt hors écran et onglet masqué, contrôle manuel et préférence système respectés. Pas de WebGL, vidéo ou dépendance réseau.

## Sources, droits et limites

- `assets/mountain-split.png` : copie exacte de `../05C/mountain-split.png`, concept art original Imagegen selon `../05C/asset-record.json`. Historique et prompt conservés dans la source.
- `assets/forest.png` : copie exacte de `../07B/forest.png`, concept art original Imagegen selon `../07B/notes.md` et `../forest-studies/asset-prompts.json`. Aucun lieu réel revendiqué.
- DM Sans et aperçus des maquettes : ressources locales partagées de `../04-05/assets/`. Licence DM Sans : `../04-05/assets/fonts/OFL-DMSans.txt`.
- Références tierces historiques : voir les notes des sources ; leurs auteurs et droits ne sont pas tous renseignés. Aucune capture tierce ajoutée au site. Aucune nouvelle licence ni garantie de droits déduite.

Étude locale avec concept art provisoire. La profondeur reste une composition 2D par couches, pas une scène 3D reconstruite. Validation du studio attendue avant finitions ou transfert séparé.

## Vérification

`verify.cjs` et `verification.json` : largeurs 1440, 820, 390 et 320 px ; absence de débordement, images chargées, titre contenu, menus, dialogues, mouvement, reduced-motion, retours des trois maquettes et empreintes originales. Captures dans `captures/`. Inspection visuelle desktop et mobile réalisée. Aucun fichier de production modifié.
