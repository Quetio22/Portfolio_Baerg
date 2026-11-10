# Fiche de recette à compléter — BDT-25

Cette fiche est vierge : aucune ligne ne constitue un essai déjà réalisé.

## Identification

- Testeur et date :
- Commit testé :
- URL de préproduction :
- Modèle iPhone / version iOS / version Safari :
- Modèle Android / version Android / version Chrome :
- Réseau utilisé :

## Sur chaque téléphone physique

| Essai | iPhone | Android | Preuve / remarque |
| --- | --- | --- | --- |
| Ouvrir les huit pages, images et polices chargées | À faire | À faire | |
| Menu : ouvrir, choisir une page, revenir et fermer hors menu | À faire | À faire | |
| Portrait/paysage, petit écran et agrandissement des textes | À faire | À faire | |
| Zoom/pincement : texte lisible, pas de contenu inaccessible | À faire | À faire | |
| Clavier virtuel du contact, e-mail, sélecteurs et fermeture du clavier | À faire | À faire | |
| Retour d’erreur lisible et saisie conservée | À faire | À faire | |
| Contrastes du menu d’accueil au sommet et au retour du header | À faire | À faire | |
| Fenêtre d’informations : ouverture, défilement et fermeture | À faire | À faire | |
| Lise : choix du soin, créneau, récapitulatif, retour et remise à zéro | À faire | À faire | |
| Midi : filtres et réservation de démonstration indiquée indisponible | À faire | À faire | |
| Traverse : galerie et formulaire de démonstration | À faire | À faire | |
| Mouvement réduit activé dans le système | À faire | À faire | |

## Réception réelle — après réalisation du contact

N’utiliser que des données de test autorisées. Identifier le destinataire de test avant de déclencher l’envoi.

| Essai | Résultat | Preuve attendue |
| --- | --- | --- |
| Envoi valide reçu | À faire | Date/heure, identifiant de demande, copie du message reçu expurgée |
| Champs obligatoires, e-mail invalide et limites de longueur | À faire | Erreurs visibles et compréhensibles |
| Échec contrôlé du service de test | À faire | Message d’échec, saisie conservée, nouvelle tentative possible |
| Double clic / requête lente | À faire | Absence de doublon et retour utilisateur clair |
| Déconnexion réseau pendant l’envoi | À faire | Pas de faux succès ; récupération possible |

## Sur la préproduction

- [ ] HTTPS et domaine final vérifiés.
- [ ] Politique d’indexation publique et des concepts vérifiée dans HTML **et** en-têtes HTTP.
- [ ] Métadonnées et aperçu du partage social contrôlés.
- [ ] Redirections anciennes et normalisation des barres finales : paramètres conservés, aucune boucle.
- [ ] Page inconnue imbriquée : vrai statut 404 ; GET et HEAD.
- [ ] Cache et compression constatés sur les réponses de l’hébergeur.
- [ ] Informations du studio et confidentialité validées pour le fonctionnement réel.
- [ ] Version finale identifiée, derniers résultats automatisés joints, écarts éventuels acceptés explicitement par le studio.
