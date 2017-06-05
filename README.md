# [pliers](https://pliersjs.github.io/)-svg-sprite

As of 3.0.0, the PNG fallback functionality is removed, re-enabling support for earlier node versions. As IE8 has fallen off most project’s testing radars, this shouldn’t be an issue. It also drops the huge PhantomJS dependency that svg2png brought with it.

As of 2.0.0, Node 6+ is required due to the svg2png dependency

---

Build an SVG sprite with PNG fallback from a folder of single SVGs.

[![build status](https://secure.travis-ci.org/pliersjs/pliers-svg-sprite.png)](http://travis-ci.org/pliersjs/pliers-svg-sprite)

Uses [svg-sprite](https://www.npmjs.org/package/svg-sprite) and [svg2png](https://www.npmjs.org/package/svg2png) under the hood.

## Installation

```
npm install pliers-svg-sprite --save
```

## Usage

Within a `pliers.js` file:

```
module.exports = function(pliers) {
  pliers('buildSprite', require('pliers-svg-sprite')(pliers, config))
}
```

Then from the CLI:

```
pliers buildSprite
```

`config` should be an object structured like the following example:

```js
var config =
  { imgSourceDir: 'images/raw'               // Directory of individual SVGs
  , imgOutputDir: 'images/compiled'          // Directory for compiled SVG/PNG
  , stylusTemplate: 'stylus/sprite.styl.tpl' // Template to format Stylus
  , stylusDest: 'stylus/sprite.styl'         // File to output formatted Stylus
  }
```

## Upgrading from 0.x.x to 1.x.x

An updated Stylus template is required ([Example template](test/fixtures/stylus/sprite.styl.tpl) in test fixtures)

Hover state functionality has been removed to reduce code complexity, and improve developer control. Any legacy icons with filenames ending in `--hover` will need bespoke hover states applied on a pre-project basis as part of the upgrade.

## Licence
ISC
