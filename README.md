# Baerg Design

Site vitrine en français : Accueil, À propos, Réalisations, Contact, mentions légales, confidentialité et page 404. HTML rendu côté serveur, CSS et JavaScript natif, Node.js sans dépendance d’exécution. Aucun compte, base de données, cookie ou outil de tracking.

## Démarrer

Node.js **22.9 ou supérieur**.

```sh
npm ci
cp .env.example .env
npm run dev
```

Ouvrir **http://127.0.0.1:3000**. Les modifications des modules redémarrent le serveur ; recharger le navigateur après une modification. `npm start` lance le serveur sans surveillance. `PORT` et `HOST` sont configurables. Un environnement qui interdit les serveurs locaux nécessite d’autoriser l’ouverture du port.

```sh
npm run build          # Export HTML dans dist/
npm test               # Validation et serveur ; messagerie simulée
npx playwright install chromium webkit
npm run test:browser   # Navigation, responsive, accessibilité et formulaire
npm run format:check
```

Les outils de test et de formatage sont uniquement des dépendances de développement. L’exécution du site ne nécessite aucun paquet npm.

## Modifier le site

- `src/content.js` : identité, navigation, services, méthode, options du formulaire, projets et informations légales.
- `src/site.js` : composants partagés, contenus propres aux pages et métadonnées.
- `public/styles.css` : palette, typographie, grille et responsive.
- `src/assets.js` : URLs des styles, scripts, favicon et image de partage versionnées selon leur contenu, pour éviter l’affichage d’anciennes ressources en cache.
- `public/app.js` : menu accessible et états du formulaire.
- `public/theme.js` : restauration du thème avant l’affichage de la page.
- `src/contact.js` : validation, limitation et appel au service de messagerie.
- `server.js` : routes HTTP, ressources, en-têtes de sécurité, robots et sitemap.
- `scripts/build.js` : export des pages et contrôle des projets publiés.

L’accueil affiche une composition de l’identité **du studio**, pas une réalisation client. Les prénoms, coordonnées, liens professionnels, technologies spécifiques et projets absents du brief n’ont pas été inventés. À la demande du studio, la page À propos contient deux portraits générés de démonstration, explicitement marqués « Portrait provisoire » en prévisualisation et masqués en mode publication.

## Présenter les deux fondateurs

Les profils sont centralisés dans `founders`, dans `src/content.js`. Pour chaque personne, renseigner son prénom dans `name`, ajouter sa vraie photo dans `public/images/`, mettre à jour `image`, `imageAlt`, `width` et `height`, puis passer `isPlaceholder` à `false`. Une courte présentation personnelle (`biography`) et un lien professionnel réel (`profileUrl`) sont facultatifs. Les portraits sont présentés au format 4:5 et s’adaptent au mobile.

Les images provisoires sont `public/images/portrait-demo-a.jpg` et `public/images/portrait-demo-b.jpg`, en 800 × 1 000 px. Les [prompts et détails de génération](docs/portraits-provisoires.md) sont conservés dans le projet. Aucun nom ou parcours individuel n’est inventé. En mode publication, un profil provisoire ou dépourvu de prénom ou de photo est masqué ; la présentation collective reste visible.

La palette est centralisée dans les variables `:root` de `public/styles.css` : blanc `#FFFFFF`, encre `#292A30`, paragraphes `#50515A`, accent bleu `#4059D8` et annotation abricot `#F0B89A`. Le bleu est réservé aux actions et repères choisis, ainsi qu’à la feuille de marque ; les grandes surfaces restent neutres. Le pied de page utilise l’encre. Le visuel d’accueil est un concept d’interface de réservation non commandé, composé en HTML/CSS, avec une légende explicite. Le logo Pinyon Script et les grands titres Cormorant sont conservés ; les titres de services utilisent DM Sans. Les paragraphes restent à 16–17 px, les repères principaux et la légende du concept à 12 px. Les couleurs fonctionnelles ont leurs propres variables. Le générateur de l’image de partage réutilise la composition `studioArt()` et les styles du site ; la régénérer avec `npm run assets:share` après modification. Le favicon SVG est bleu.

Un simple rechargement suffit après une modification : les ressources principales changent d’URL lorsque leur contenu change. Le serveur demande également leur revalidation (`Cache-Control: public, no-cache`) et renvoie une réponse légère `304` lorsqu’elles sont inchangées. Cette protection remplace l’ancienne conservation d’une heure, qui pouvait masquer une nouvelle palette. L’export `dist/` contient aussi les URLs versionnées ; le reconstruire avant de le mettre à jour sur un hébergement statique.

## Mode sombre

Le bouton lune/soleil à côté du logo permet de basculer entre les deux thèmes sur toutes les pages, y compris sur téléphone. Le mode clair reste le choix initial. Le mode sombre utilise un fond charbon `#1C1D22`, des sections `#25262D` et des textes clairs. Les boutons bleus, les annotations abricot et les couleurs du concept d’accueil sont conservés ; les petits repères bleus et les couleurs fonctionnelles sont adaptés pour rester lisibles.

La palette sombre est centralisée dans `:root[data-theme='dark']` dans `public/styles.css`. Le choix `light` ou `dark` est conservé localement sous la clé `baerg-theme`, restauré par `public/theme.js` avant l’affichage du contenu et synchronisé entre les onglets. Ce petit script s’exécute après la feuille de style, dans l’en-tête du document, pour assurer le bon rendu des champs natifs dans WebKit. Si le stockage est bloqué, le bouton fonctionne pour la page en cours. Sans JavaScript, il est masqué et le thème clair reste utilisable.

## Ajouter une réalisation

Ajouter un objet dans `projects` dans `src/content.js`. Tous les champs de l’exemple ci-dessous sont des indications de saisie, **pas un projet à publier tel quel** :

```js
{
  published: false, // Passer à true après vérification et autorisation de publication.
  name: 'Nom réel du projet',
  nature: 'Personnel', // Client | Personnel | Scolaire | Concept non commandé
  image: '/images/nom-du-projet.webp',
  imageAlt: 'Description utile de la capture réelle',
  width: 1600,
  height: 1200,
  problem: 'Le besoin réel auquel répond le projet.',
  solution: 'Les choix effectivement réalisés.',
  technologies: [], // Uniquement les technologies effectivement utilisées.
  url: '', // Facultatif. Renseigner une vraie URL HTTPS, sinon laisser vide.
}
```

Placer la capture optimisée dans `public/images/`. Les dimensions doivent correspondre au fichier. Préférer WebP ou AVIF, viser moins de 300 Ko et conserver une capture lisible. La grille réserve un ratio de 4:3. Deux projets au maximum apparaissent sur l’accueil ; tous les projets publiés apparaissent dans Réalisations. Sans projet, le site affiche un état vide honnête. Le build vérifie les champs, la nature, les dimensions déclarées, la présence du fichier et la forme du lien. L’existence du site distant et les droits de diffusion restent à vérifier au moment de l’ajout.

## Configurer le formulaire

L’envoi est **désactivé par défaut**, côté navigateur et côté serveur. Il ne suffit pas d’activer un bouton : les informations légales et la configuration serveur doivent être complètes.

1. Définir le domaine réel dans `SITE_URL`, par exemple une origine HTTPS sans chemin. Aucun domaine officiel n’est supposé dans le code.
2. Compléter tous les champs `studio.legal` dans `src/content.js` avec les informations vérifiées. Pour un statut réellement non applicable, le préciser explicitement plutôt que laisser un champ vide. Adapter les textes légaux aux prestataires et à la réglementation applicables.
3. Configurer `RESEND_API_KEY`, `CONTACT_FROM` (expéditeur sur un domaine vérifié chez Resend) et `CONTACT_TO` (boîte de réception confirmée), uniquement dans les variables du serveur ou `.env`. Pour afficher une adresse publique, renseigner séparément `studio.email`.
4. Passer `PUBLICATION_READY=true`, puis redémarrer le serveur. Cette valeur déclare que les contenus et informations réels ont été relus. Le démarrage et le build refusent cette valeur si le domaine ou des informations légales manquent.
5. Envoyer un message de test autorisé, vérifier sa **réception effective** dans la messagerie et son éventuel classement en spam. La réponse positive de l’API signifie l’acceptation par Resend, pas une preuve de livraison en boîte de réception.

Le client vérifie les champs obligatoires, empêche les doubles clics, affiche l’attente et conserve les saisies lors d’un échec. Une clé d’idempotence est réutilisée lors des nouvelles tentatives du même message. Le serveur vérifie à nouveau les champs, leur longueur, les choix proposés, l’origine de la demande et le type JSON. Il ajoute un champ piège, un délai minimal de deux secondes, une limite de cinq tentatives par adresse réseau sur quinze minutes et une limite de corps à 24 Ko. L’appel au fournisseur expire après douze secondes. Aucun faux succès n’est renvoyé en cas d’erreur ou d’absence de configuration.

L’idempotence est appliquée par [Resend pendant 24 heures](https://resend.com/docs/dashboard/emails/idempotency-keys). La validation utilise du texte brut pour l’e-mail et l’expéditeur est fixé côté serveur. La clé API n’est jamais transmise au navigateur. Les tests substituent le fournisseur : ils **n’envoient aucun e-mail réel**.

## Hébergement et publication

Utiliser le **serveur Node**, derrière un reverse proxy HTTPS, pour disposer de `/api/contact`. Le dossier `dist/` permet un export statique ou une inspection ; un hébergement purement statique ne peut pas traiter le formulaire. Pour ce mode, conserver le formulaire désactivé ou intégrer explicitement une fonction serveur équivalente et les mêmes protections HTTP. Ne pas exposer la racine du dépôt comme répertoire public.

Le serveur écoute sur `127.0.0.1` par défaut. Utiliser `HOST=0.0.0.0` uniquement si la plateforme le nécessite. Terminer TLS sur le proxy et faire suivre le chemin et le corps de la requête. `SITE_URL` doit correspondre à l’origine publique exacte ; rediriger tout domaine alternatif vers cette origine. Les en-têtes CSP, anti-iframe, MIME, permissions et référent sont émis par Node ; HSTS est ajouté lorsque `SITE_URL` utilise HTTPS.

La limitation utilise la mémoire d’**un seul processus Node** et disparaît au redémarrage. Pour plusieurs instances, configurer une limitation partagée au reverse proxy ou à la plateforme. Derrière un proxy, définir `TRUSTED_PROXY_IP` à son adresse exacte et lui faire **remplacer** `X-Real-IP` par l’adresse réelle du client ; ne jamais accepter une valeur fournie par le visiteur. Sans cette configuration, les visiteurs derrière le même proxy partagent le quota. Ajouter au proxy une limite de corps de 24 Ko et des délais de lecture adaptés. Ne pas journaliser les corps de requête et définir la conservation des journaux d’hébergement.

Sans publication déclarée, le serveur émet `noindex, nofollow`, `robots.txt` interdit l’exploration et le sitemap ne contient aucune URL. Cela évite l’indexation involontaire, **sans constituer un contrôle d’accès** : garder les prévisualisations privées au niveau de l’hébergement si nécessaire. Après configuration, chaque page possède son titre, sa description, ses balises de partage et son URL canonique ; le sitemap utilise le domaine réel.

## Informations manquantes avant publication

- Identité juridique, forme/statut, adresse, immatriculation ou statut applicable et responsable de publication.
- Nom, adresse et contact de l’hébergeur effectivement retenu.
- Responsable et contact pour les données personnelles, durée réelle de conservation, lieux de traitement, garanties de transfert des prestataires et politique des journaux d’hébergement. Les textes sont préparatoires, à adapter ; référence utile si le droit suisse s’applique : [devoir d’informer du PFPDT](https://www.edoeb.admin.ch/fr/devoir-dinformer).
- Domaine public, accès Resend, expéditeur vérifié et destinataire confirmé.
- Réception d’un message réel à vérifier une fois ces accès disponibles.

Les réalisations, prénoms, portraits et liens professionnels peuvent être ajoutés ultérieurement ; ils ne bloquent pas le fonctionnement. Aucun contenu fictif n’est publié pour les remplacer.

## Ressources et licences

Les quatre fichiers WOFF2 sont hébergés localement : Pinyon Script pour le logo uniquement, Cormorant Garamond normal/italique pour les titres, DM Sans pour le texte. Total des polices : environ 119 Ko. Le navigateur n’appelle aucun service de polices externe. Les licences SIL OFL 1.1 accompagnent les fichiers dans `public/fonts/`.

Sources des licences : [Pinyon Script](https://github.com/google/fonts/tree/main/ofl/pinyonscript), [Cormorant Garamond](https://github.com/google/fonts/tree/main/ofl/cormorantgaramond), [DM Sans](https://github.com/google/fonts/tree/main/ofl/dmsans).

Les compositions du studio sont dessinées en CSS et SVG, sans image de client. Les deux portraits temporaires de la page À propos sont des personnages fictifs générés avec l’outil intégré `image_gen`, puis optimisés localement en JPEG. `public/images/og.png` est l’image de partage de 1 200 × 630 px. Pour la régénérer après une modification de l’identité : `npm run assets:share` (Chromium installé).

## Vérifications réalisées

Voir `VERIFICATION.md` pour les contrôles et leurs limites. Les captures sont générées dans `test-results/` et restent hors Git.
