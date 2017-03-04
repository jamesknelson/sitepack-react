'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = sitepackReactTransform;

var _junctions = require('junctions');

function sitepackReactTransform() {
  return function (site) {
    var junctions = {};

    return site.map(function (page) {
      if (!page.children) {
        return page.consume('title');
      }

      var branches = {};
      for (var i = 0, len = page.children.length; i < len; i++) {
        var child = page.children[i];

        branches[child.id] = {
          default: child.path == page.default,
          path: child.path,
          next: junctions[child.id] || null,
          data: {
            pageId: child.id
          }
        };
      }

      if (page.content && junctions[page.content.id]) {
        branches[page.content.id] = {
          intermediate: !!page.content.absolutePath,
          path: page.content.path,
          data: {
            pageId: page.content.id
          },

          // Site#map is gauranteed to iterate in an order that results in
          // children being processed before their parents, so this works.
          next: junctions[page.content.id]
        };
      }

      var junction = (0, _junctions.createJunction)(branches);
      junctions[page.id] = junction;

      return Object.keys(branches).length === 0 ? page.consume('title') : page.set({ junction: junction }).consume('junction', 'default', 'title');
    });
  };
}