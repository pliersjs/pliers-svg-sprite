var SVGSpriter = require('svg-sprite')
  , glob = require('glob')
  , path = require('path')
  , fs = require('pn/fs')
  , mkdirp = require('mkdirp')

module.exports = function (pliers, config) {

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

    files.forEach(function (file) {
      spriter.add(
        path.resolve(path.join(imgSourceDir, file))
      , file
      , fs.readFileSync(path.join(imgSourceDir, file), { encoding: 'utf-8' })
      )
    })

    fs.exists(config.stylusTemplate, function (exists) {
      if (!exists) return done(new Error('Sprite template not found.'))

      spriter.compile(saveFiles)
    })

    function saveFiles (error, result) {
      if (error) return done(error)

      var mode
        , type

      // Run through all configured output modes
      for (mode in result) {

        // Run through all created resources and write them to disk
        for (type in result[mode]) {
          mkdirp.sync(path.dirname(result[mode][type].path))
          fs.writeFileSync(result[mode][type].path, result[mode][type].contents)
        }

      }

      done()

    }

  }

}
