import {readFile} from 'node:fs/promises';
const source = await readFile(new URL('../source/server.js', import.meta.url),'utf8');
const distBase = new URL('../source/dist/server.js', import.meta.url).href;
// Same server logic, rooted at the exported files; no change inside dist/.
const relocated = source.replaceAll('import.meta.url',JSON.stringify(distBase));
await import('data:text/javascript;base64,'+Buffer.from(relocated).toString('base64'));
