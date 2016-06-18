const m = require('mithril')

const otra = require('./paginas/otra')
const inicio = require('./paginas/inicio')

m.route.mode = 'pathname';

m.route(document.getElementById('bundle'), "/", {
  "/": inicio,
  "/otra": otra
});

