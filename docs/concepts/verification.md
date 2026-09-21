# Vérification des concepts — 21 septembre 2026

## Corrections

- Retour explicite vers les réalisations de Baerg, dans un bandeau qui reste visible au défilement sur les deux concepts. Le lien de Midi & Compagnie était auparavant masqué sur mobile.
- Mention « Projet conceptuel — entreprise fictive » maintenue dans ce même bandeau.
- Nouvelle composition du premier écran de Traverse, sans changement de palette, de polices ni d’images : photographie à gauche, titre, texte et action regroupés à droite ; empilement inchangé sur téléphone.
- Décalage des ancres adapté au bandeau et à la navigation fixes. Les destinations et le lien d’évitement peuvent recevoir le focus. Traverse dispose d’un lien direct vers les aménagements, sans menu déroulant.
- Focus contrasté sur la section d’horaires sombre de Midi et marge de défilement tenant compte de sa barre mobile inférieure.
- Devis et réservation explicitement indisponibles, avec indication d’absence d’envoi et de collecte sur mobile comme sur ordinateur. Aucun formulaire ajouté.
- Espace corrigé dans le pied de page de Traverse lorsque le saut de ligne disparaît sur téléphone.

- Ajustement suivant : retrait du bloc « 01— / Fermer pour ranger / Ouvrir pour vivre », suppression du menu mobile et de son JavaScript ; composition ordinateur compacte, sans titre sur une rangée séparée, pour supprimer le vide supérieur. Composition mobile conservée.

- Section d’aménagements transformée en liste avec textes à gauche et vignettes à droite sur ordinateur, empilée sur téléphone.
- Navigation des deux concepts masquée à la descente, révélée dès 1 px de remontée et au focus clavier ; retour Baerg toujours visible, animation désactivée si mouvement réduit demandé.

## Vérifications réalisées

Suite dédiée : `tests/browser/concepts.spec.js`, sur un serveur temporaire servant les fichiers actuels. Les 32 scénarios sont validés, incluant désormais descente, remontée de 1 px et retour au focus clavier des deux navigations.

- Chromium et WebKit : formats 320 × 568, 390 × 844, 768 × 1024, 844 × 390, 1024 × 768 et 1440 × 900.
- Navigation, destinations des ancres, retour vers Baerg, lien direct mobile Traverse et transfert du focus.
- Ouverture des deux explications Traverse au clavier, empilement des deux aménagements en lignes distinctes sur ordinateur, absence de débordement après ouverture.
- Filtres de la carte au clavier et au toucher, états pressés, annonce du nombre de plats et lien vers la section d’horaires.
- Émulation tactile et rotation portrait/paysage ; liens d’évitement et contenu principal sans JavaScript. Dans WebKit sur macOS, Option-Tab permet de parcourir les liens avec le réglage clavier natif utilisé ici.
- Chargement de toutes les images, absence d’erreur console, d’exception JavaScript, de réponse HTTP en erreur et de requête échouée pendant les parcours.
- Audit automatique axe WCAG A/AA aux largeurs 390 et 1440 px, incluant les contrastes détectables automatiquement.
- Aucun formulaire ni champ personnel, aucune requête autre que GET, aucun appel tiers, aucun cookie ni contenu dans localStorage/sessionStorage pendant les parcours.
- Inspection visuelle des captures Chromium ordinateur/mobile ; build de production.

## Limites

Pas de test sur iPhone physique, dans l’application Safari réelle, ni avec VoiceOver. WebKit automatisé et émulation tactile ne remplacent pas ces contrôles. Pas de certification d’accessibilité exhaustive. Aucun envoi de devis ou de réservation à tester : ces fonctionnalités n’existent pas encore. Les contrôles réseau et de stockage portent sur les deux concepts, pas sur les pages de Baerg après le retour.

## Reproduire

```sh
npx playwright test tests/browser/concepts.spec.js
npm run build
```

Pour renouveler les captures Chromium : `CAPTURE_CONCEPTS=1 npx playwright test tests/browser/concepts.spec.js --project=chromium`.
