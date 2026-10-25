# Icônes d’interface — Lucide

Les huit pages Baerg et démos utilisent les SVG officiels de **lucide-static 1.61.0**. Onze dessins, intégrés directement au HTML : aucune bibliothèque JavaScript, requête CDN ou dépendance React pour les icônes. Les sources et licences ISC/MIT sont conservées dans `lucide/` ; la provenance et l’intégrité npm figurent dans `lucide/provenance.json`.

`lucide.css` fixe une épaisseur de 1,7 et une taille de 20 px, avec adaptations de 22/24 px pour les petites commandes. Les couleurs suivent `currentColor`. Les SVG sont décoratifs (`aria-hidden`, `focusable=false`) ; les boutons conservent leurs libellés accessibles. Menu et fermeture utilisent les vrais dessins Menu et X ; les accordéons Plus et Minus. Les flèches et calendriers existants ont été harmonisés. Le signe de marque Traverse `⊣` et les lettres des logos restent des éléments d’identité, pas des commandes.

Pour modifier une géométrie, mettre à jour sa source locale puis exécuter `npm run icons:sync`. Les changements de style se font dans `lucide.css`. Les SVG inline fonctionnent sans JavaScript, hors interactions qui nécessitent déjà JavaScript. Aucun changement dans le Design Lab ou le Taste Vault.

Traverse utilise ChevronRight sur les CTA et Plus sans cartouche sur les études non sélectionnées. Le formulaire garde son libellé seul. Les autres projets conservent leurs icônes.
