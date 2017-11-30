// const manifest = require('../../build/manifest.json');
import fs from 'fs';

const Manifest = (function manifest() {
  let instance = null;
  return {
    get: function get() {
      if (!instance) {
        instance = JSON.parse(fs.readFileSync('./build/manifest.json', 'utf8'));
      }
      return instance;
    },
  };
}());

export default function resolve(file) {
  return Manifest.get()[file];
}
