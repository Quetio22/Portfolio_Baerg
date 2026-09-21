import { renderTraverse } from './atelier-traverse.js';
import { renderMidi } from './midi-et-compagnie.js';
import { renderLise } from './lise.js';

// Independent documents: no Baerg layout, global styles, or sitemap entry.
export const conceptPages = {
  '/concepts/atelier-traverse/': renderTraverse,
  '/concepts/midi-et-compagnie/': renderMidi,
  '/concepts/lise/': renderLise,
};
