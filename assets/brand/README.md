# Baerg — favicon et partage

Choix Thomas : B orange sur crème ; composition typographique sans photographie.
Palette : #c6380b / #f1eadd. Tracés issus de DM Sans locale, graisse750 pour le B et le nom. SVG autonomes sans police externe ; licence originale dans ../fonts/OFL-DMSans.txt.

favicon.svg : onglets modernes ; PNG16/32 en repli ; apple-touch-icon.png180 pour raccourci iOS. share.png1200×630 : partage social, source vectorielle share.svg. Textes repris de l’identité existante, sans nouvelle photographie ni promesse d’envoi de formulaire opérationnel.

Régénération facultative : Python avec fonttools et brotli, puis python scripts/brand-assets.py depuis la racine. Avec l’aperçu local en fonctionnement et les dépendances du module verre installées : BRAND_PREVIEW_URL=http://127.0.0.1:4618/ node scripts/render-brand-assets.cjs. Les fichiers produits sont versionnés : aucun de ces outils n’est nécessaire au build normal.
