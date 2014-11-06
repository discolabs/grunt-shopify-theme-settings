/*
 * grunt-shopify-theme-settings
 * https://github.com/discolabs/grunt-shopify-theme-settings
 *
 * Copyright (c) 2014 Gavin Ballard
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp']
    },

    // Configuration for testing the `shopify_import_theme_settings` task.
    shopify_import_theme_settings: {
      importSettings: {
        importFile: 'test/fixtures/import.html',
        exportFile: 'tmp/import.yml'
      }
    },

    // Configuration for testing the `shopify_theme_settings` task.
    shopify_theme_settings: {
      compileSpecific: {
        options: {},
        files: {
          'tmp/test-specific.html': ['test/fixtures/test_c.yml', 'test/fixtures/test_a.yml']
        }
      },
      compileGlob: {
        options: {},
        files: {
          'tmp/test-glob.html': ['test/fixtures/test_*.yml']
        }
      },
      compileWithRepeat: {
        options: {},
        files: {
          'tmp/test-repeat.html': 'test/fixtures/repeat.yml'
        }
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // For testing, set the importFile and exportFile options as if they was set on the command line.
  grunt.option('importFile', 'test/fixtures/import.html');
  grunt.option('exportFile', 'tmp/import.yml');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'shopify_theme_settings', 'shopify_import_theme_settings', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
