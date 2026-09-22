# Lise — soins & bien-être

Route : `/concepts/lise/`. Institut fictif indépendant dans la région de Bulle, imaginé par Baerg Design. Document autonome rendu par `src/concepts/lise.js`, styles et médias locaux, export statique via le build existant. Présent dans les réalisations Baerg avec un aperçu et un lien vers la maquette.

## Périmètre livré

Navigation, accès direct aux trois prestations, prix et durées illustratifs, détails des soins, section « Avant, pendant et après votre soin », lieu fictif, FAQ et simulation complète de rendez-vous. Palette minérale et pervenche, DM Sans Medium/SemiBold, grille conservée et arrondis discrets de 8 px sur les photographies et les éléments interactifs.

Le parcours fonctionne uniquement dans le navigateur : soin → jour d’une semaine type fictive → heure → récapitulatif → simulation. Les heures de fin sont calculées selon la durée du soin, avec créneaux du samedi terminant au plus tard à 13 h. Changer de jour efface l’heure précédemment choisie. Aucun nom, contact, paiement, appel réseau ni stockage persistant. Les choix sont remis à zéro à la fin. Sans JavaScript, toute la partie informative et les volets restent disponibles ; la simulation est signalée comme indisponible.

Le script partagé `/concepts/navigation.js` masque la navigation en descendant et la révèle dès la remontée ou au focus clavier. Le bandeau fictif et le retour Baerg restent visibles. Page non indexable et exclue du sitemap.

## Direction visuelle — septembre 2026

Les variables de `styles.css` centralisent les couleurs : fond minéral `#F6F3EF`, surfaces claires `#FCFAF7`, pervenche `#68669C`, lavande grisée `#E8E4EC`, encre aubergine `#302C35` et argile `#C9826D`. L’argile est réservée aux traits de repère, au soulignement des étapes et à certains états actifs ; elle n’est utilisée ni comme grand fond ni pour les textes.

La variante pervenche `#575580` sert aux petits textes sur fond lavande : la teinte principale y atteint seulement 4,22:1. Les paragraphes utilisent `#615A65`, les contours des contrôles `#928591`. Les légendes et notes passent à 13–14 px. Les séparateurs restent là où ils aident à distinguer les soins et les questions, avec moins de lignes autour des sections et des étapes de visite.

## Photographies actuelles et licences

Vérification le **22 septembre 2026** : chacune des deux fiches Pexels ci-dessous indique une photographie gratuite sous [licence Pexels](https://www.pexels.com/license/). Celle-ci autorise le téléchargement, la modification et l’utilisation sur un site web, y compris commercial, sans attribution obligatoire. Elle interdit notamment de suggérer le soutien d’une personne ou d’une marque représentée. Aucun abonnement, contenu premium ou licence payante n’a été utilisé.

| Usage et fichiers locaux                                                                             | Auteur et fiche source                                                                                                                                | Licence                                                                            |
| ---------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Introduction : `images/preparation.webp` (1600 × 1067) et `images/preparation-720.webp` (720 × 480)  | **Ron Lach**, [A Person Making a Natural Body Scrub — 8272677](https://www.pexels.com/photo/a-person-making-a-natural-body-scrub-8272677/)            | [Pexels](https://www.pexels.com/license/) ; la fiche indique « Free to use »       |
| Lieu : `images/cabine-naturelle.webp` (1200 × 800) et `images/cabine-naturelle-720.webp` (720 × 480) | **Anna Tarazevich**, [A Massage Table Near the Window Blinds — 6560308](https://www.pexels.com/photo/a-massage-table-near-the-window-blinds-6560308/) | [Pexels](https://www.pexels.com/license/) ; licence gratuite indiquée sur la fiche |

Sources de téléchargement :

- `https://images.pexels.com/photos/8272677/pexels-photo-8272677.jpeg?auto=compress&cs=tinysrgb&w=1600&fm=webp&q=82`
- `https://images.pexels.com/photos/6560308/pexels-photo-6560308.jpeg?auto=compress&cs=tinysrgb&w=1200&fm=webp&q=82`
- Variantes mobiles : mêmes URL avec `w=720` et `q=80`.

Les fichiers sont redimensionnés et encodés en WebP par le serveur d’images Pexels lors du téléchargement, puis stockés dans le projet. `srcset` sélectionne les tailles adaptées, les dimensions sont renseignées et la photo du lieu est chargée à la demande. Aucun appel à Pexels n’est effectué par le navigateur du visiteur. Aucun filtre de couleur ni retouche générative n’est appliqué ; seul le cadrage CSS adapte les formats.

Les deux légendes affichent **« Photographie d’illustration »**. La personne photographiée illustre uniquement un geste de préparation ; elle n’est présentée ni comme la fondatrice, ni comme une employée ou une cliente de Lise. La cabine est une référence visuelle et non un établissement Lise existant. La mention générale « Projet conceptuel — entreprise fictive » et les autres avertissements sont conservés.

## Anciennes illustrations IA — historique, non affichées

Les anciens fichiers JPEG sont conservés pour l’historique mais ne sont plus référencés par la page. Créés avec l’outil intégré **imagegen**, ils ne représentent ni une fondatrice, ni une cliente, ni un établissement réels. Les originaux sont conservés dans le dossier de génération de Codex.

- `images/geste.jpg` : scène de manucure, geste et mains au premier plan.
- `images/cabine.jpg` : cabine fictive, fauteuil de soin et espace d’accueil.

### Prompt — geste

Use case: photorealistic-natural. Create an editorial landscape photograph 1536x1024 for the fictional beauty institute Lise in Bulle, Switzerland. Close, candid view of an adult woman's hands receiving a careful simple manicure at a clean white rectangular table; the independent practitioner is only visible by her forearms in a dark indigo cotton uniform, using a nail file with anatomically accurate hands, no faces, no identity portrait. Client wearing a crisp pale blue shirt. Subtle periwinkle cabinetry and daylight in background, graphite stool, unbranded simple tools, realistic everyday affordable beauty studio. Hands and actual care gesture are the focus, not bottles or towels. Natural skin texture, restrained documentary composition, pleasant light with readable detail. No flowers, gold, pink, candles, luxury spa styling, medical devices, text, labels, logos, or watermark. Photo only, not a website mockup.

### Prompt — cabine

Use case: photorealistic-natural. Editorial architectural photograph, landscape 1536x1024, of a fictional small independent beauty institute treatment room in Bulle Switzerland, same restrained palette of pale periwinkle, crisp white, dark ink blue. Accessible ordinary contemporary studio, daylight through a frosted glass window left, a simple adjustable treatment chair with white upholstery centered, pale periwinkle rectangular wall cabinets, a small sink and neat worktop at back, one graphite upholstered visitor chair, pale grey linoleum floor. Honest and lived-in but clean and professional, real textures, straight verticals. Compose to understand how a client enters and sits; room not empty decorative still life. No people, no flowers, no plants as decoration, no gold, no rose pink, no beige spa aesthetic, no candles, no stacked towels as focal point, no medical devices, no logos, no text. Photo only, not a website screenshot.

## Police

DM Sans variable, copiée depuis la ressource locale existante du projet. Licence SIL OFL conservée dans `fonts/OFL-DMSans.txt`. Aucun service de police tiers appelé.

## Vérification

`tests/browser/lise.spec.js` : Chromium et WebKit, largeurs 320, 390, 700, 768, 1024 et 1440 px ; simulation complète, validations, recalcul après modification, remise à zéro, toucher et rotation, clavier, fonctionnement sans JavaScript, images, ancres, absence de débordement et d’erreur console, audit axe aux formats 390 et 1440 px. Vérification des requêtes, cookies et stockages pendant la simulation. Pas de test sur téléphone physique ou avec VoiceOver, ni certification exhaustive d’accessibilité.

Captures ordinateur/mobile dans `docs/concepts/captures/lise-*.jpg`, à la racine du projet.

```sh
npx playwright test tests/browser/lise.spec.js
npm run build
```
