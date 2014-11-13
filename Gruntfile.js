module.exports = function(grunt) {

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.initConfig({
    shell: {
      options: {
        stdout: true
      },
      selenium: {
        command: './selenium/start',
        options: {
          stdout: false,
          async: true
        }
      },
      protractor_install: {
        command: 'node ./node_modules/protractor/bin/webdriver-manager update'
      },
      npm_install: {
        command: 'npm install'
      }
    },

    connect: {
      options: {
        base: 'app/',
        middleware: function( connect, options, middlewares ) {
          options = options || {};
          options.index = options.index || 'index.html';
          middlewares.unshift(function globalIncludes( req, res, next ) {
            var fs = require('fs');
            var filename = require( 'url' ).parse( req.url ).pathname;
            if ( /\/$/.test( filename )) {
              filename += options.index;
            }
            
            if ( /\.html$/.test( filename )) {
              fs.readFile( options.base + filename, 'utf-8', function( err, data ) {
                if ( err ) {
                  next( err );
                } else {
                  res.writeHead( 200, { 'Content-Type': 'text/html' });
                  data = data.split( '<!--#include virtual="/assets/includes/global/' );
                  res.write( data.shift(), 'utf-8' );
                  data.forEach(function( chunk ) {
                    res.write( fs.readFileSync( options.base + '/assets/includes/global/' + chunk.substring( 0, chunk.indexOf( '"-->' )), 'utf-8' ), 'utf-8' );
                    res.write( chunk.substring( chunk.indexOf( '-->' ) + 3 ), 'utf-8' );
                  });
                  res.end();
                }
              });

            } else {
              next();
            }
          });
          return middlewares;
        }
      },
      webserver: {
        options: {
          port: 8888,
          keepalive: true
        }
      },
      devserver: {
        options: {
          port: 8888
        }
      },
      testserver: {
        options: {
          port: 9999
        }
      },
      coverage: {
        options: {
          base: 'coverage/',
          port: 5555,
          keepalive: true
        }
      }
    },

    protractor: {
      options: {
        keepAlive: true,
        configFile: "./test/protractor.conf.js"
      },
      singlerun: {},
      auto: {
        keepAlive: true,
        options: {
          args: {
            seleniumPort: 4444
          }
        }
      }
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'Gruntfile.js',
        'app/scripts/{,*/}*.js'
      ]
    },

    concat: {
      // styles: {
      //   dest: './app/assets/app.css',
      //   src: [
      //     'app/styles/app.css',
      //     //place your Stylesheet files here
      //   ]
      // },
      scripts: {
        options: {
          separator: ';'
        },
        dest: './app/assets/mam.js',
        src: [
          // 'bower_components/angular/angular.js',
          // 'bower_components/angular-route/angular-route.js',
          // 'bower_components/angular-animate/angular-animate.js',
          'app/scripts/qgovTemplateController.js',
          'app/scripts/mapController.js',
          'bower_components/leaflet/dist/leaflet.js',
          'bower_components/leaflet.markercluster/dist/leaflet.markercluster.js',
          'bower_components/angular-leaflet/dist/angular-leaflet-directive.js',
          'bower_components/marked/lib/marked.js',
          'bower_components/angular-marked/angular-marked.js',
          'app/scripts/ckan.js',
          'app/scripts/searchController.js',
          'app/scripts/detailController.js',
          'app/scripts/app.js',
        ]
      },
    },

    watch: {
      options : {
        livereload: 7777
      },
      assets: {
        files: ['app/scripts/**/*.js'],
        tasks: ['jshint','concat']
      },
      protractor: {
        files: ['app/scripts/**/*.js','test/e2e/**/*.js'],
        tasks: ['protractor:auto']
      }
    },

    open: {
      devserver: {
        path: 'http://localhost:8888'
      },
      coverage: {
        path: 'http://localhost:5555'
      }
    },

    karma: {
      unit: {
        configFile: './test/karma-unit.conf.js',
        autoWatch: false,
        singleRun: true
      },
      unit_auto: {
        configFile: './test/karma-unit.conf.js',
        autoWatch: true,
        singleRun: false
      },
      unit_coverage: {
        configFile: './test/karma-unit.conf.js',
        autoWatch: false,
        singleRun: true,
        reporters: ['progress', 'coverage'],
        preprocessors: {
          'app/scripts/*.js': ['coverage']
        },
        coverageReporter: {
          type : 'html',
          dir : 'coverage/'
        }
      },
    },

    copy: {
      demo: {
        files: [{
          expand: true,
          cwd: 'app/demo',
          src: '**',
          dest: 'demo/'
        }]
      }
    },

    replace: {
      demo: {
        src: ['demo/**/index.html'],
        overwrite: true,
        replacements: [{
          from: /<!--#include\s+virtual="\/assets\/includes\/global\/([a-z-]+.html)"\s*-->/g,
          to: function (matchedWord, index, fullText, regexMatches) {
            return grunt.file.read( 'app/assets/includes/global/' + regexMatches[ 0 ] );
          }
        }, {
          from: '/assets/mam.js',
          to: '../app/assets/mam.js'
        }]
      }
    }
  }
);


  //single run tests
  grunt.registerTask('test', ['jshint','test:unit', 'test:e2e']);
  grunt.registerTask('test:unit', ['karma:unit']);
  grunt.registerTask('test:e2e', ['connect:testserver','protractor:singlerun']);

  //autotest and watch tests
  grunt.registerTask('autotest', ['karma:unit_auto']);
  grunt.registerTask('autotest:unit', ['karma:unit_auto']);
  grunt.registerTask('autotest:e2e', ['connect:testserver','shell:selenium','watch:protractor']);

  //coverage testing
  grunt.registerTask('test:coverage', ['karma:unit_coverage']);
  grunt.registerTask('coverage', ['karma:unit_coverage','open:coverage','connect:coverage']);

  //installation-related
  grunt.registerTask('install', ['update','shell:protractor_install']);
  grunt.registerTask('update', ['shell:npm_install', 'concat']);

  //defaults
  grunt.registerTask('default', ['dev']);

  //development
  grunt.registerTask('dev', ['update', 'jshint', 'connect:devserver', 'open:devserver', 'watch:assets']);

  //server daemon
  grunt.registerTask('serve', ['connect:webserver']);

  // generate static demo pages
  grunt.registerTask('demo', ['copy:demo', 'replace:demo']);
};
