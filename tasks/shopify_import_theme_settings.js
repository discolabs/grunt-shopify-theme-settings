/*
 * grunt-shopify-theme-settings
 * https://github.com/discolabs/grunt-shopify-theme-settings
 *
 * Copyright (c) 2014 Gavin Ballard
 * Licensed under the MIT license.
 */

'use strict';
var tidy = require('htmltidy').tidy;

module.exports = function(grunt) {

  grunt.registerTask('shopify_import_theme_settings', 'Grunt task to import settings.html into out settings.yml format.', function() {

    // Read options.
    var importFile = grunt.option('importFile');

    // Mark this task as asynchronous.
    var done = this.async();

    // Check that an importFile option was provided.
    if(!importFile) {
      grunt.log.warn('You must provide the path to a settings.html file to import from with the --importFile argument.');
      return false;
    }

    // Check that the importFile provided is valid.
    if(!grunt.file.exists(importFile)) {
      grunt.log.warn('The specified file ' + importFile + ' does not exist!');
      return false;
    }

    // Read and tidy the input HTML for consistency.
    tidy(grunt.file.read(importFile), {}, function(err, html) {

      // Check to see if there were any errors tidying the HTML.
      if(err) {
        grunt.log.error(err);
        done(false);
      }

      // Mark asynchronous tasks as done.
      done();
    });
  });

};