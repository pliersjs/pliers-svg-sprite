var join = require('path').join
  , assert = require('assert')
  , rewire = require('rewire')
  , createPliers = require('pliers').bind(null, { logLevel: 'fatal' })
  , pliersSvgSprite = rewire('../pliers-svg-sprite')
  , rmdir = require('rimraf')
  , mkdir = require('mkdirp')
  , fs = require('fs')
  , fixturesDir = join(__dirname, 'fixtures')
  , tempDir = join(__dirname, 'temp')
  , async = require('async')

describe('pliers-svg-sprite', function () {

  beforeEach('copy fixtures to temp', function (done) {
    rmdir(tempDir, function () {
      mkdir(tempDir, function () {
        done()
      })
    })
  })

  after(function (done) {
    rmdir(tempDir, done)
  })

  it('should error if pliers argument is missing', function (done) {
    var pliers = createPliers()
    assert.throws(function () {
      pliers('buildSprite', pliersSvgSprite(null, null))
    }, /No pliers argument supplied./)
    done()
  })

  it('should error if config argument is missing', function (done) {
    var pliers = createPliers()
    assert.throws(function () {
      pliers('buildSprite', pliersSvgSprite(pliers, null))
    }, /No config argument supplied./)
    done()
  })

  it('should error if Stylus template doesn’t exist', function (done) {
    var pliers = createPliers()
      , config =
        { imgSourceDir: fixturesDir + '/images'
        , imgOutputDir: tempDir + '/images'
        , stylusTemplate: fixturesDir + '/fake/path/to/sprite.styl.tpl'
        , stylusDest: tempDir + '/sprite.styl'
        }
    pliers('buildSprite', pliersSvgSprite(pliers, config))
    pliers.run('buildSprite', function (error) {
      assert.equal(error.message, 'Sprite template not found.')
      done()
    })
  })

  it('should build required files using values from the config', function (done) {
    this.timeout(10000)
    var pliers = createPliers()
      , config =
        { imgSourceDir: fixturesDir + '/images'
        , imgOutputDir: tempDir + '/images'
        , stylusTemplate: fixturesDir + '/stylus/sprite.styl.tpl'
        , stylusDest: tempDir + '/stylus/sprite.styl'
        }
    pliers('buildSprite', pliersSvgSprite(pliers, config))
    pliers.run('buildSprite', function (error) {
      if (error) return done(error)

      function checkFileExists (file, done) {
        fs.readFile(file, function (error) {
          assert.equal(error, null, 'File does not exist: ' + file)
          done()
        })
      }

      async.parallel(
        [ checkFileExists.bind(null, config.imgOutputDir + '/icon-sprite.svg')
        , checkFileExists.bind(null, config.imgOutputDir + '/icon-sprite.png')
        , checkFileExists.bind(null, config.stylusDest)
        ], done)

    })
  })

  it('should error if svg-sprite returns an error', function (done) {
    var pliers = createPliers()
      , config =
        { imgSourceDir: fixturesDir + '/images'
        , imgOutputDir: tempDir + '/images'
        , stylusTemplate: fixturesDir + '/stylus/sprite.styl.tpl'
        , stylusDest: tempDir + '/sprite.styl'
        }
      , destroy = pliersSvgSprite.__set__('SVGSpriter', function () {
          return (
            { add: function () { return }
            , compile: function (cb) { return cb(new Error('SVG Sprite returned an error')) }
            })
        })

    pliers('buildSprite', pliersSvgSprite(pliers, config))
    pliers.run('buildSprite', function (error) {
      assert.equal(error.message, 'SVG Sprite returned an error')
      destroy()
      done()
    })
  })

})
