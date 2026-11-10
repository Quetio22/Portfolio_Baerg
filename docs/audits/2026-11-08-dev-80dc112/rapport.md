# Recette Baerg — BDT-25 — 8 novembre 2026

**Résultat : fonctionnement courant satisfaisant, lancement non validé.** Les parcours testés fonctionnent et aucune erreur JavaScript ni ressource cassée n’a été observée sur les huit pages. Le contact ne transmet aucune demande, les informations légales sont provisoires et le contraste de plusieurs textes sur le fond de l’accueil reste insuffisant. Les essais sur appareils physiques et sur une préproduction restent à faire.

Cet audit recense les corrections ; il ne les applique pas. Aucune modification du site, aucun changement de branche, aucun push, aucune publication et aucun message réel envoyé.

## Version et périmètre

| Élément | Version testée |
| --- | --- |
| Dépôt | `/Users/quentinbergmann/code/Portfolio_Baerg` |
| Branche demandée | `Dev` |
| Commit complet | `80dc11290e29ecf9fe490855b3676b724c55b218` |
| Vérification distante | `origin/Dev` confirmé au même commit par `git ls-remote` |
| Référence du ticket | `bd94201` ; comparaison technique des changements, sans le texte de l’audit du 4 novembre |
| Isolation | Archive Git du commit dans un dossier temporaire ; dossier original laissé sur `dev_t` |
| Environnement | macOS arm64, Node 25.9.0, npm 11.12.1 |
| Moteurs | Chromium 153.0.8010.12, WebKit 26.6, Firefox 155.0 |
| Pages | Accueil, À propos, Réalisations, Offres, Contact, Lise, Midi & Compagnie, Atelier Traverse |

Le build exporté est servi localement avec la logique du serveur du dépôt, en déplaçant seulement sa racine vers `dist/`. Cela vérifie l’export, pas la configuration d’un futur hébergeur. WebKit sur Mac n’est pas un essai Safari sur iPhone physique ; Firefox et Chromium sont également des moteurs de bureau.

## Résultats des tests

| Contrôle | Résultat et portée |
| --- | --- |
| Installation verrouillée | `npm ci --prefix experiments/liquid-glass` réussi dans une copie propre |
| Compilation | Deux `npm run build` réussis ; 86 fichiers identiques octet pour octet, soit 3 501 071 octets |
| Suite existante | **44/44 tests réussis**, Chromium et WebKit ; neuf largeurs jusqu’à 1920 px selon les tests |
| Matrice complémentaire | **144 affichages vérifiés** : huit pages × six largeurs × trois moteurs |
| Largeurs complémentaires | 320, 390, 650, 651, 820 et 1440 pixels CSS |
| Structure et ressources | Un H1 par page, pas d’ID dupliqué détecté, images chargées, pas de titre/libellé hors largeur ; tolérance d’arrondi de 1 px |
| Réseau normal | **0 erreur JavaScript, 0 réponse HTTP en erreur, 0 requête échouée** sur les parcours de la matrice |
| Liens | **34 URL/ancres internes vérifiées**, toutes accessibles et ancres présentes |
| Parcours complémentaires | **45/45 groupes réussis**, soit 15 groupes dans chacun des trois moteurs |
| Ressources de l’export | **85/85 fichiers publics** servis à l’identique ; le 86e est `redirects.json`, configuration interne volontairement non servie |
| Contrôles HTTP dédiés | **49/53 assertions réussies** ; quatre échecs correspondant au même défaut de conservation des paramètres, décrit en A05 |
| Anciennes adresses | 18 redirections vérifiées : trois adresses × trois formes × GET/HEAD ; destination et paramètres conservés |
| Pages inconnues | Page 404 personnalisée avec vrai statut 404, y compris URL imbriquée et HEAD |
| Analyse Axe complète | 48 analyses A/AA ; trois alertes sur le même logo décoratif, à qualifier, et plusieurs contrastes sur image laissés en vérification manuelle |
| Reflow | Cinq pages principales à 640 et 320 pixels CSS dans les trois moteurs, sans débordement dépassant la tolérance ; ce n’est pas un essai du zoom système sur téléphone |

Les 45 groupes couvrent le menu au clavier, Échap et retour du focus, les liens d’évitement, la fenêtre juridique, les préremplissages, les erreurs de saisie, la copie et son repli manuel, les deux pannes de chargement du verre, le parcours complet Lise, les filtres Midi, la galerie et le formulaire de démonstration Traverse, le mouvement réduit, les contenus sans JavaScript et le reflow. La copie réussie et son refus sont **simulés**, sans modifier le presse-papiers réel de l’utilisateur. Les démonstrations restent volontairement sans réservation ni envoi.

## Corrections à traiter

### A01 — Bloquant lancement : aucune demande ne peut être reçue

**Constat.** Sur Contact, le bouton copie un brouillon et ne fait aucune requête d’envoi. La page annonce explicitement que le formulaire n’est pas ouvert. Il n’y a pas non plus de moyen de contact réel proposé sur cette page. La phrase « Nous vous répondrons » ne peut donc pas être tenue par ce parcours.

**Reproduire.** Renseigner les champs obligatoires puis cliquer sur « Copier mon brouillon ». Le retour est « Brouillon copié. Aucun message envoyé. » En cas de refus du presse-papiers, le texte est proposé à la copie manuelle ; ce repli fonctionne mais ne transmet rien non plus.

**À faire.** Finaliser le moyen de transmission et l’adresse de réception, adapter les textes, puis tester un succès réel et un échec contrôlé : retour visible, valeurs conservées en cas d’échec, absence de double demande et preuve de réception. Le refus de copie testé ici ne remplace pas un échec d’envoi e-mail.

**Sources :** [app.js](/Users/quentinbergmann/code/Portfolio_Baerg/app.js:49), [Contact](/Users/quentinbergmann/code/Portfolio_Baerg/contact/index.html), [preuve des parcours](preuves/functional.json), [capture Contact](preuves/captures/chromium-contact-390.jpg).

### A02 — Bloquant lancement : informations du studio encore provisoires

**Constat.** La fenêtre « Informations & confidentialité » contient encore « Cette exploration est un prototype local » et indique que les coordonnées et mentions devront être renseignées avant publication. Elle s’ouvre et se ferme correctement, mais son contenu n’est pas finalisé.

**À faire.** Renseigner les informations réelles du studio et les faire valider. Décrire le traitement effectivement mis en place pour le contact lorsque A01 sera réalisé : la promesse actuelle d’absence d’envoi devra alors être revue. Il s’agit d’un constat de contenu provisoire, pas d’une certification juridique.

**Preuves :** texte relevé lors des essais de fenêtre dans [functional.json](preuves/functional.json), HTML des cinq pages principales.

### A03 — Priorité haute : contraste de la navigation sur l’image d’accueil

**Constat confirmé à 1440 × 1000.** Les liens blancs du menu sont placés sur une zone orange claire. Les rapports mesurés sous les glyphes sont approximativement :

| Texte | Contraste minimal mesuré | Contraste médian mesuré |
| --- | ---: | ---: |
| À propos | 3,92:1 | 4,30:1 |
| Réalisations | 3,09:1 | 3,41:1 |
| Offres | 2,74:1 | 2,86:1 |
| Contact | 2,37:1 | 2,45:1 |

Ces petits textes nécessitent 4,5:1 selon le [critère WCAG 1.4.3](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html). Certaines portions du CTA « Découvrir les réalisations » et du grand titre croisent également des zones trop claires. Une moyenne satisfaisante sur l’ensemble d’un texte ne suffit pas à garantir son contraste partout.

**Méthode.** Deux captures PNG identiques, avec puis sans les glyphes, permettent d’échantillonner le fond réel sous les pixels de texte presque pleins. Le calcul utilise la couleur CSS du texte, en écartant les pixels d’anticrénelage. Les résultats dépendent du cadrage testé et doivent être revérifiés aux autres cadrages après correction.

**À faire.** Donner aux textes concernés un fond suffisamment constant : voile local, surface de navigation ou autre traitement graphique. Revérifier au sommet de page et après défilement, sur ordinateur et mobile, ainsi qu’au focus et au survol.

**Ne pas confondre avec l’alerte du logo.** Les trois alertes Axe sont la répétition, dans trois moteurs, du grand « Baerg » décoratif à faible contraste. L’exception concernant les logotypes et le caractère décoratif de cette signature conduisent à ne pas la retenir comme défaut bloquant. `aria-hidden` seul ne constitue pas cette justification. Les vrais liens du menu, eux, restent concernés.

**Preuves :** [capture originale](preuves/contrast-original.png), [fond sans les glyphes](preuves/contrast-background.png), [mesures détaillées](preuves/contrast-sampled.json), [sorties Axe brutes](preuves/pages.json).

### A04 — À finaliser avant publication : indexation, partage et hébergement

**Constat.** Les cinq pages publiques portent `noindex,nofollow` et le serveur ajoute aussi `X-Robots-Tag: noindex, nofollow`. `robots.txt` et `sitemap.xml` répondent 404. Aucune URL canonique ni métadonnée Open Graph n’a été relevée sur ces pages ; plusieurs descriptions sont identiques. Le serveur est configuré sans cache pour l’aperçu.

**Interprétation.** C’est cohérent pour Dev. Cette configuration ne doit pas être considérée comme une configuration publique validée.

**À faire.** Préparer une configuration de production distincte : domaine et URL finales, politique d’indexation des pages publiques et des concepts, métadonnées de partage, redirections, vraie 404, HTTPS, cache et compression. `redirects.json` n’est pas automatiquement compris par un hébergeur statique. Vérifier le résultat sur une préproduction avant validation du ticket.

**Preuves :** [métadonnées relevées](preuves/pages.json), [en-têtes et réponses HTTP](preuves/http.json), [server.js](/Users/quentinbergmann/code/Portfolio_Baerg/server.js:44).

### A05 — Priorité normale : paramètres perdus dans les URL sans barre finale

**Reproduire.** Ouvrir `/contact?projet=refonte`. Le serveur répond `308 Location: /contact/`, en supprimant `?projet=refonte`. Le préremplissage ne peut plus sélectionner « Refonte de site ». Le même mécanisme affecte les autres répertoires testés et les paramètres de suivi.

**Attendu.** Rediriger vers `/contact/?projet=refonte`. Les anciennes URL `/concepts/...`, elles, conservent correctement leurs paramètres.

**Correction proposée, non appliquée.** Conserver `url.search` dans la redirection qui ajoute la barre finale, puis ajouter un test GET/HEAD avec paramètres. Vérifier aussi la règle correspondante chez l’hébergeur.

**Sources :** [server.js, ligne 40](/Users/quentinbergmann/code/Portfolio_Baerg/server.js:40), [quatre reproductions HTTP](preuves/http.json).

### A06 — Priorité normale : l’ancien script de recette ne valide plus le site actuel

**Constat.** `scripts/verify-design.cjs`, encore annoncé dans le README, termine en échec avec **20 comparaisons de DOM/mise en page non conformes**. Il utilise toujours le référentiel du 21 octobre. La page À propos, les fiches simplifiées et les décorations du verre ont changé depuis. Ses contrôles de navigation exécutés durant cette passe ne signalent ni erreur JavaScript ni erreur HTTP.

**À faire.** Conserver ce contrôle comme historique ou le remplacer par une recette du design actuel, validée humainement. Ne pas mettre automatiquement à jour le référentiel pour faire disparaître les échecs. Rendre explicites l’installation du verre, le build préalable, la commande de test et l’URL testée. La suite actuelle contient aussi deux URL de test en dur sur le port 4613 ; elles ont été adaptées au port isolé pour cet audit.

**Impact.** « 44 tests réussis » ne signifie pas que toutes les commandes de recette documentées sont vertes. Il faut résoudre cette ambiguïté avant de déclarer le critère « tests automatisés réussis » entièrement satisfait.

**Preuves :** [résultat de l’ancien script](preuves/legacy-suite.json), [journal](preuves/legacy-suite.log), [suite actuelle](preuves/existing-suite.json), [premier build sans préparation](preuves/build-without-setup.log), [build après préparation](preuves/build-first.log).

## Évolution depuis le commit du ticket

Le texte complet de l’audit du 4 novembre n’était pas disponible lors de cette passe. Cette comparaison porte sur le code de `bd94201` et les preuves présentes dans le dépôt ; elle ne constitue pas la clôture ligne par ligne de cet audit.

| Sujet | Évolution technique vérifiée |
| --- | --- |
| BDT-19 — images | Variantes WebP intégrées et effectivement sélectionnées ; ressources valides. Le fond d’accueil conserve volontairement une source plus grande pour son recadrage. Pas de nouvelle mesure Lighthouse ni de performance sur téléphone dans cette passe. |
| BDT-20 — contrastes ciblés | Couleur des petits accents sur crème renforcée et mention mobile du studio passée en blanc. Ces corrections sont présentes ; elles ne couvrent pas le défaut A03 sur l’image d’accueil. |
| BDT-22 — 404 et anciennes URL | Page personnalisée et anciennes adresses opérationnelles localement ; A05 subsiste pour la normalisation des répertoires. Validation chez l’hébergeur en attente. |
| Export | Nettoyage intégré ; export actuel de 3,50 Mo, identique sur deux builds dans le même environnement. |
| Contact / informations / SEO | Pas de changement de ces contenus et mécanismes dans les commits comparés ; points A01, A02 et A04 toujours ouverts. |

[Liste des changements](preuves/changes-since-ticket.txt) · [Historique des commits](preuves/changes-log.txt).

## Conditions pour terminer BDT-25

| Critère du ticket | État |
| --- | --- |
| Tests automatisés réussis et preuves conservées | Partiel : suite actuelle et parcours complémentaires réussis, preuves conservées ; ancien script à clarifier, A05 à corriger |
| Essais physiques consignés avec modèle/version | **Non réalisés** : Safari iPhone et Android physiques indisponibles dans cette session |
| Réception réelle et échec d’envoi contrôlés | **Non réalisables avec le contact actuel** ; aucun message réel envoyé |
| Aucun blocage restant | **Non satisfait** : A01, A02 et A03 à traiter avant lancement ; configuration publique à finaliser |
| Écarts acceptés et version validée identifiée | Version testée identifiée ; aucun écart accepté au nom du studio, aucune version de lancement validée |

Ordre conseillé : rendre le contact opérationnel et finaliser ses informations, corriger les contrastes, corriger A05 et la recette, préparer la préproduction, puis effectuer les essais physiques et le dernier passage de validation.

La vérification du reflow à 320 pixels CSS correspond en largeur à 400 % sur une fenêtre de 1280 pixels, selon le [critère WCAG 1.4.10](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html). Elle ne valide pas à elle seule tous les comportements du zoom réel, des claviers virtuels ou de Safari iOS.

## Preuves et reproduction

Les [preuves](preuves/identity.json) comprennent les rapports JSON, journaux, empreintes de build, 32 captures de pages complètes, quatre captures de reflow et deux PNG utilisés pour mesurer le contraste. Les scripts complémentaires sont conservés dans [scripts/](scripts/README.md). Les premières erreurs de harnais, liées au clic sous le menu, au raccourci Safari et à une simulation CSS de zoom non pertinente, ont été recontrôlées ; elles ne sont pas présentées comme bugs du site.

Pour les tests qui restent à faire, utiliser la [fiche d’essais physiques et de réception](essais-restants.md). Une [synthèse prête à copier dans BDT-25](resultat-ticket.md) accompagne ce rapport.
