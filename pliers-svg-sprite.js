var SVGSpriter = require('svg-sprite')
  , glob = require('glob')
  , path = require('path')
  , fs = require('fs')
  , mkdirp = require('mkdirp')
  , svgToPng = require('svg-to-png')

module.exports = function(pliers, config) {

  // Check supplied arguments
  if (!pliers) throw new Error('No pliers argument supplied.')
  if (!config) throw new Error('No config argument supplied.')

  return function (done) {

    var imgSourceDir = config.imgSourceDir
      , imgOutputDir = config.imgOutputDir
      , files = glob.glob.sync('**/*.svg', { cwd: imgSourceDir })
      , options =
        { dest: imgOutputDir
        , shape:
          { spacing:
            { padding: 2
            }
          }
        , mode:
          { css:
            { dest: imgOutputDir
            , common: 'icon'
            , prefix: 'icon--'
            , sprite: 'icon-sprite'
            , bust: false
            , render:
              { styl:
                { template: config.stylusTemplate
                , dest: config.stylusDest
                }
              }
            }
          }
        }
      , spriter = new SVGSpriter(options)

    files.forEach(function(file) {
      spriter.add(
        path.resolve(path.join(imgSourceDir, file))
      , file
      , fs.readFileSync(path.join(imgSourceDir, file), { encoding: 'utf-8' })
      )
    })

    fs.exists(config.stylusTemplate, function(exists) {
      if (!exists) {
        done(new Error('Sprite template not found.'))
      } else {
        spriter.compile(callback)
      }
    })

    function callback(error, result) {
      if (error) done(error)

      // Run through all configured output modes
      for (var mode in result) {

        // Run through all created resources and write them to disk
        for (var type in result[mode]) {
          mkdirp.sync(path.dirname(result[mode][type].path))
          fs.writeFileSync(result[mode][type].path, result[mode][type].contents)
        }
      }

      // Read output dir for SVGs then write PNGs to the same place
      svgToPng.convert(imgOutputDir, imgOutputDir).then( function() {
        done()
      })
    }

  }

}
