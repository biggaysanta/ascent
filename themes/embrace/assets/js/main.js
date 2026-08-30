/** @format */


import Alpine from 'alpinejs';
import Atlas from '@casoon/atlas';
import './butterfy-system.js';

window.Alpine = Alpine;

Alpine.start();

const atlas = Atlas;
if (atlas && typeof atlas.init === 'function') {
  window.atlas = atlas;
  atlas.init();
}
