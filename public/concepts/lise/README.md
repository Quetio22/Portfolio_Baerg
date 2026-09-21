# Lise — soins & bien-être

Route : `/concepts/lise/`. Institut fictif indépendant dans la région de Bulle, imaginé par Baerg Design. Document autonome rendu par `src/concepts/lise.js`, styles et médias locaux, export statique via le build existant. Présent dans les réalisations Baerg avec un aperçu et un lien vers la maquette.

## Périmètre livré

Navigation, accès direct aux trois prestations, prix et durées illustratifs, détails des soins, section « Avant, pendant et après votre soin », lieu fictif, FAQ et simulation complète de rendez-vous. Palette pervenche et encre, DM Sans, grille nette et arrondis limités aux contrôles interactifs.

Le parcours fonctionne uniquement dans le navigateur : soin → jour d’une semaine type fictive → heure → récapitulatif → simulation. Les heures de fin sont calculées selon la durée du soin, avec créneaux du samedi terminant au plus tard à 13 h. Changer de jour efface l’heure précédemment choisie. Aucun nom, contact, paiement, appel réseau ni stockage persistant. Les choix sont remis à zéro à la fin. Sans JavaScript, toute la partie informative et les volets restent disponibles ; la simulation est signalée comme indisponible.

Le script partagé `/concepts/navigation.js` masque la navigation en descendant et la révèle dès la remontée ou au focus clavier. Le bandeau fictif et le retour Baerg restent visibles. Page non indexable et exclue du sitemap.

## Images originales et prompts

Créées avec l’outil intégré **imagegen**, puis optimisées en JPEG. Illustrations d’inspiration identifiées sur la page ; elles ne représentent ni une fondatrice, ni une cliente, ni un établissement réels. Les originaux sont conservés dans le dossier de génération de Codex.

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
