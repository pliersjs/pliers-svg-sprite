var SVGSprite = require('svg-sprite')
  , svgToPng = require('svg-to-png')
  , fs = require('fs')

module.exports = function(pliers, spriteConfig) {

  return function (done) {

    var imgSourceDir = spriteConfig.imgSourceDir
      , imgOutputDir = spriteConfig.imgOutputDir
      , options =
        { render:
          { css: false
          , styl:
            { dest: spriteConfig.stylusDest
            , template: spriteConfig.stylusTemplate
            }
          }
        , variables: { replacedExpression: replacedExpression }
        , verbose: 0
        , padding: 2
        , common: 'icon'
        , prefix: 'icon-'
        , sprite: 'icon-sprite'
        , spritedir: ''
        }

    fs.exists(spriteConfig.stylusTemplate, function(exists) {
      if (!exists) {
        pliers.logger.error('Sprite template not found.')
        done()
      } else {
        SVGSprite.createSprite(imgSourceDir, imgOutputDir, options, callback)
      }
    })

    function replacedExpression() {
      if ( this.expression.indexOf('--hover') !== -1 ) {
        return '.btn:hover .' + this.expression.replace('--hover', '') +
          ', .btn:focus .' + this.expression.replace('--hover', '') +
          ', .text-btn:hover .' + this.expression.replace('--hover', '') +
          ', .text-btn:focus .' + this.expression.replace('--hover', '')
      } else {
        return '.' + this.expression
      }
    }

    function callback(err, results) {
      if (err) done(err)

      if (!results.success) {
        pliers.logger.error('SVG sprite could no be created')
        done()
      }

      pliers.logger.info('SVG sprite Created')
      pliers.logger.debug('Compiled SVG sprite from ' + results.data.svg.length + ' images')

      svgToPng.convert(imgOutputDir, imgOutputDir).then( function() {
        pliers.logger.info('PNG sprite Created')
        done()
      })

    }

  }
}
