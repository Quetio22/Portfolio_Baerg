# Rejouer la recette

Les scripts sont des outils d’audit, sans correction du site. Ils attendent la structure suivante : `source/` pour l’archive de Dev, `scripts/` pour ces outils et `evidence/` pour les résultats. Ils ne s’exécutent pas directement contre le dossier original du portfolio.

## Préparer une copie propre

Depuis un terminal, avec Node et Git disponibles :

```sh
task_audit_dir=$(mktemp -d /private/tmp/baerg-recette-XXXXXX)
mkdir "$task_audit_dir/source" "$task_audit_dir/evidence"
git -C /Users/quentinbergmann/code/Portfolio_Baerg archive 80dc11290e29ecf9fe490855b3676b724c55b218 | tar -x -C "$task_audit_dir/source"
cp -R /Users/quentinbergmann/code/Portfolio_Baerg/docs/audits/2026-11-08-dev-80dc112/scripts "$task_audit_dir/scripts"
cd "$task_audit_dir/source"
npm ci --prefix experiments/liquid-glass
npm run build
node experiments/liquid-glass/node_modules/playwright/cli.js install chromium webkit firefox
cd "$task_audit_dir"
ln -s ../../source/experiments/liquid-glass/node_modules scripts/existing-suite/node_modules
```

L’installation utilise le lockfile du commit. Les navigateurs sont ceux requis par Playwright. Le build et l’installation écrivent uniquement dans cette copie et dans les caches des outils.

## Démarrer les deux serveurs locaux

Les ports 4738 et 4739 doivent être disponibles. Conserver ce terminal et ses variables pour l’arrêt :

```sh
PORT=4738 node source/server.js > evidence/source-server.log 2>&1 &
task_source_pid=$!
PORT=4739 node scripts/export-server.mjs > evidence/export-server.log 2>&1 &
task_export_pid=$!
```

Le second script conserve le serveur du dépôt en adaptant sa racine à `source/dist/`. Il n’ajoute aucune règle propre à un hébergeur et ne publie rien.

## Exécuter les contrôles

```sh
node source/experiments/liquid-glass/node_modules/@playwright/test/cli.js test --config scripts/existing-playwright.config.cjs
node scripts/audit-pages.cjs
node scripts/audit-functional.cjs
python3 scripts/audit-http.py
node scripts/contrast-capture.cjs
node scripts/contrast-measure.cjs
```

- `audit-pages.cjs` : 144 affichages, 48 analyses Axe complètes, liens, images, requêtes, captures.
- `audit-functional.cjs` : 45 groupes de parcours, sans envoi de message ; la copie du presse-papiers est simulée. `ENGINES`, `TEST_FILTER` et `REPORT_NAME` permettent un recontrôle ciblé.
- `audit-http.py` : statuts, ressources de l’export, anciennes URL et conservation des paramètres. Ses quatre assertions de paramètres échouent sur le commit audité ; le résultat est consigné dans `http.json`.
- `contrast-capture.cjs` et `contrast-measure.cjs` : captures PNG puis mesures sous les glyphes de l’accueil à 1440 px.
- La suite existante est conservée avec une seule adaptation de ses deux URL littérales : port 4613 remplacé par 4738. Les attentes fonctionnelles ne sont pas modifiées.

Les résultats et échecs sont dans les JSON ; certains scripts d’audit collectent les anomalies sans sortir avec un code non nul. Il faut lire ces rapports, pas uniquement le code de sortie du processus. Les preuves historiques de cette passe sont dans `../preuves/`.

Pour arrêter les deux serveurs démarrés par ces commandes :

```sh
kill "$task_source_pid" "$task_export_pid"
```

## Limites conservées

Les tests n’envoient pas d’e-mail, ne publient rien et ne remplacent pas les essais physiques. Le reflow est testé par des largeurs CSS équivalentes ; le zoom CSS exploratoire initial n’a pas été retenu comme preuve de conformité ou comme anomalie produit. Sur WebKit/macOS, les essais de liens utilisent Option+Tab. Les navigateurs, captures et analyses automatisées ne suffisent pas à certifier l’accessibilité entière du site.
