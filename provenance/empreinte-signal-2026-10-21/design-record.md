# Empreinte × Signal — 21 octobre 2026

Demande explicite du studio : appliquer cette direction au projet `Portfolio_Baerg`, branche `dev_q`. Accueil inspiré d'Empreinte, apports de Signal et fond plus orange, proche de l'intention chromatique d'Altrix. Pour À propos, Réalisations, Offres et Contact, conserver la composition existante et mettre à jour les couleurs et le traitement typographique.

## Implémentation

- Accueil : objet central, grand titre bas dans l'image, actions séparées et marque translucide d'Empreinte. Les liens continuent à ouvrir les cinq pages existantes. La présentation du studio reprend le texte des études Empreinte/Signal ; les sections suivantes de l'accueil et leurs destinations sont conservées.
- Pages intérieures : même contenu et même DOM dans `main`, mêmes grilles, espacements, ordre des sections, tarifs, mentions et champs. Une seule feuille `theme.css` est ajoutée dans leur en-tête. Police DM Sans locale conservée ; graisse plus affirmée pour les titres, légendes monospace, palette cuivre/ivoire.
- `home.css` isole la nouvelle composition de l'accueil des styles historiques.
- Menus, navigation au scroll, formulaire local, préremplissage des offres, fenêtres et maquettes restent gérés par les scripts existants.
- Les nouvelles feuilles de style sont incluses dans le serveur et l'export statique. Aucun déploiement ni push.

## Images et droits

`assets/empreinte-orange.png` est une nouvelle version générée par l'outil intégré `image_gen`, éditée à partir de l'art original du Lab `experiments/baerg-chromatique-2026-10-21/assets/pages-de-verre.png`. Le pli de verre est conservé ; l'éclairage devient cuivre, orange et ambre. Prompt exact et chemins dans `asset.json`. Image statique : aucune simulation 3D ou réfraction physique revendiquée.

La référence tierce `baerg-altrix-detail.png` a été consultée pour sa palette et ses traînées, sans incorporer sa capture ni ses silhouettes dans le site. Source : Saklain Sarowor, Digital Design Agency Website UI, https://dribbble.com/shots/27670665-Digital-Design-Agency-Website-UI. Les droits de cette référence restent à son créateur.

Les assets et licences existants, les trois maquettes et les archives de la version précédente sont conservés.

## Vérification

`scripts/verify-design.cjs` vérifie les cinq routes à 1440, 820, 390 et 320 px. Pour les quatre pages intérieures, il compare le contenu de `main` et les propriétés structurelles calculées aux relevés de `layout-before.json` : grilles, gaps, paddings, marges et ordre.

Il contrôle aussi les menus, les fenêtres, les liens, les préremplissages sponsor/refonte/photographies, le brouillon de contact sans envoi, la navigation au scroll, les images et les erreurs navigateur. Résultats dans `verification.json`, captures dans `test-results/empreinte-signal/`.

Le formulaire de contact conserve son fonctionnement actuel de copie locale. Les prix, conditions et contenus de l'offre sont ceux fournis précédemment par le studio.


## Ajustement de palette — rouge / vermillon

À la demande du studio, réduction des jaunes et de l’ambre au profit du rouge, du vermillon et des ombres bordeaux. Le visuel source est préservé ; seule sa teinte affichée est ajustée en CSS (`hue-rotate(-18deg) saturate(.95)`). Les fonds, accents, contours et teintes de texte sont harmonisés. Aucune modification de composition ou de contenu.


## Alternance beige crème / rouge

À la demande du studio, ajout de plages beige crème inspirées de Signal : présentation et conclusion de l’accueil, portraits et compétences d’À propos, galerie de Réalisations, offre Partenaire pilote, conclusion d’Offres et formulaire Contact. Les autres sections gardent le rouge / vermillon. Les textes, boutons, prix et champs des zones claires passent en encre brune pour conserver leur contraste. Ajustement uniquement dans `theme.css`, sans changement de DOM, de contenu ou de mise en page.


## Orange de la référence Altrix — suppression des fonds bruns

Le studio demande de reprendre précisément le caractère orange de sa capture, sans aplats bruns. L’orange médian des pixels fortement saturés de la référence est `#D14A12`. Les fonds colorés, la navigation, les pieds de page et les boutons sont harmonisés avec cet orange et ses nuances vermillon. Les sections crème restent présentes ; leur encre devient graphite neutre. Les voiles chocolat et le filtre de teinte précédent sont retirés.

Le nouveau visuel `assets/empreinte-altrix.png` est édité avec l’outil intégré ImageGen à partir du visuel original et de la capture Altrix utilisée uniquement comme référence de couleur. Les silhouettes, textes et compositions de la référence ne sont pas repris. L’original orange reste conservé. Prompt exact : `asset-altrix.json`. Aucun changement de contenu, de grille ou d’espacement.

## Navigation et nom — 21 octobre 2026

Navigation identique sur les cinq pages : logo à gauche, cinq liens regroupés à droite sur ordinateur, menu partagé sur mobile. Suppression des exceptions propres à l’accueil. Nom « Baerg » avec B majuscule dans les logos, la signature et les pieds de page. Couleurs et mise en page du contenu conservées.
