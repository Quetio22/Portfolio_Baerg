# Portraits provisoires — page À propos

Deux personnages adultes fictifs, générés avec l’outil intégré `image_gen` (compétence imagegen), à la demande de l’utilisateur. Ils ne représentent pas les fondateurs de Baerg Design. Aucun service tiers n’est appelé pendant la visite du site.

## Fichiers intégrés

- `public/images/portrait-demo-a.jpg` : premier emplacement, 800 × 1 000 px.
- `public/images/portrait-demo-b.jpg` : second emplacement, 800 × 1 000 px.

Les originaux ont été générés en PNG puis redimensionnés et compressés en JPEG pour le web. Le texte « Portrait provisoire » est une étiquette HTML, indépendante des images.

## Remplacement

Les deux profils sont centralisés dans `founders`, dans `src/content.js`. Pour chacun, renseigner `name`, `biography` si souhaitée, `image`, `imageAlt`, les dimensions réelles `width` / `height` et éventuellement une URL professionnelle réelle dans `profileUrl`. Mettre `isPlaceholder: false` uniquement après remplacement du portrait de démonstration. Les cartes provisoires et les profils sans prénom ou sans photo ne sont pas affichés lorsque `publicationReady()` est vrai.

## Prompts utilisés

### Portrait A

```text
Use case: photorealistic-natural. Asset type: temporary about-page portrait for a two-person young web development studio. This is a fictional adult, a demonstration portrait to be explicitly labeled as temporary in the website, not a real founder. Create one vertical 4:5 black-and-white editorial photograph, chest-up with both shoulders visible and generous breathing room above the hair, subject centered against a softly textured neutral light gray studio wall. Natural window lighting, subtle film grain, believable skin and clothing texture, relaxed direct eye contact, small understated smile. Contemporary, approachable and unposed, not a corporate headshot. No text, no logos, no watermark, no additional people, no props. Subject: fictional adult man aged about 24, short slightly wavy dark hair, clean shaven, plain dark crewneck shirt, shoulders turned very slightly to his left.
```

### Portrait B

```text
Use case: photorealistic-natural. Asset type: temporary about-page portrait for a two-person young web development studio. This is a fictional adult, a demonstration portrait to be explicitly labeled as temporary in the website, not a real founder. Create one vertical 4:5 black-and-white editorial photograph, chest-up with both shoulders visible and generous breathing room above the hair, subject centered against a softly textured neutral light gray studio wall. Natural window lighting, subtle film grain, believable skin and clothing texture, relaxed direct eye contact, small understated smile. Contemporary, approachable and unposed, not a corporate headshot. No text, no logos, no watermark, no additional people, no props. Subject: fictional adult man aged about 25, short curly hair, discreet round glasses, light stubble, plain light gray casual overshirt over a white T-shirt, shoulders turned very slightly to his right.
```
