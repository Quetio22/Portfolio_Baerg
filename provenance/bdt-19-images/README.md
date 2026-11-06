# BDT-19 — Optimisation des images, 6 novembre 2026

Origine : dev_t après 0c582d4 ; origin/Dev toujours bd94201 au début de cette passe.

Quatre sources prioritaires, conservées intactes : empreinte-altrix.png, bench.webp, joint.webp, atelier-scene.webp. Trois largeurs générées par source (640, 960, largeur originale). WebP qualité 90, méthode 6, exact=True, redimensionnement Lanczos sans recadrage. Aucun changement des styles de composition, object-position, proportions HTML, alternatives, priorités ou interactions. Aucun changement du Design Lab.

AVIF qualité 85 / 4:4:4 a également été évalué. WebP était plus léger sur le fond et le banc, quasiment équivalent sur l’assemblage, un peu plus lourd sur la scène. WebP retenu uniformément pour sa qualité visuelle et son alpha sans perte ; les essais AVIF ne sont pas exportés. Les dimensions d’origine descendent respectivement de 1 897 412 à 113 170 octets, 1 363 744 à 146 120, 1 363 832 à 171 566 et 1 421 016 à 250 316. Les dimensions réduites pèsent encore moins.

Comparaison visuelle : originaux/variantes, captures complètes mobile 390 et desktop 1440 DPR2. Dimensions des captures identiques avant/après ; cadrages et composition conservés. Alpha de la scène à pleine résolution identique pixel par pixel à l’original. La compression couleur est avec perte ; elle n’est pas une identité binaire et reste soumise à validation visuelle par Thomas. Les sources d’origine restent disponibles. Le poids total de l’export comprend donc aussi ces références ; les mesures concernent les fichiers effectivement chargés.

40 observations avant et 40 après sur huit pages : Chromium 390/820/1440 et WebKit 390/1440, DPR2. Aucun débordement horizontal ni erreur JavaScript après modification. Les 44 tests existants passent (Chromium et WebKit), y compris galerie, menu, clavier, mode sans JavaScript et mouvement réduit. Build réussi. Les démos Lise et Midi ne sont pas modifiées.

Ressources initiales à 390 DPR2 : accueil 2,265 Mo → 0,481 Mo (-79 %), Traverse 4,181 Mo → 0,323 Mo (-92 %). Réalisations 2,803 Mo → 0,957 Mo. Mesures brutes locales sans compression HTTP, pas le poids après défilement intégral.

Performance : trois passages à froid par page avant/après, Chromium 390×844 DPR1, réseau 1,6 Mbit/s, latence150 ms, CPU×4, cache désactivé. LCP médian accueil 11,728 s → 0,936 s ; Traverse20,320 s → 0,704 s. CLS0 dans les douze passages. Après optimisation, le candidat LCP de l’accueil devient le titre (SPAN), et non plus l’image ; ne pas interpréter ce nombre comme le temps précis de décodage du fond. Ce sont des mesures de laboratoire, pas Lighthouse ni des Core Web Vitals réels ; INP non mesuré. Les traces brutes et captures sont dans work/bdt19/ du dossier de travail de la conversation. Résumé portable dans verification.json.

Restant : validation visuelle de Thomas, puis essai sur téléphone physique si souhaité. Cache et compression sur hébergement restent dans BDT-23. Pas de publication ni de changement d’indexation dans ce ticket.
