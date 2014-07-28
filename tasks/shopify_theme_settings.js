/*
 * grunt-shopify-theme-settings
 * https://github.com/discolabs/grunt-shopify-theme-settings
 *
 * Copyright (c) 2014 Gavin Ballard
 * Licensed under the MIT license.
 */

'use strict';
var swig = require('swig');
var tidy = require('htmltidy').tidy;

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('shopify_theme_settings', 'Grunt plugin to build a settings.html file for Shopify themes.', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      docType: 'strict',
      outputXhtml: true,
      indent: true,
      indentSpaces: 4,
      wrap: 0,
      showBodyOnly: true
    });

    // Mark this task as asynchronous.
    var done = this.async();

    // Iterate over all specified file targets.
    this.files.forEach(function(f) {

      // Test each source YAML file for existence, then reduce the parsed YAML into a single sections object.
      var sections = f.src.filter(function(filepath) {
        // Warn on and remove invalid source files (if nonull was set).
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      }).reduce(function(sections, filepath) {
        // Parse source file.
        var parsed = grunt.file.readYAML(filepath);

        // Add the sections from the parsed source file to our existing sections.
        for(var key in parsed) {
          if(parsed.hasOwnProperty(key)) {
            sections[key] = parsed[key];
          }
        }

        return sections;
      }, {});

      // Compile and render using Swig.
      var settingsTemplate = swig.compileFile(__dirname + '/templates/settings.html');
      var output = settingsTemplate({
        sections: sections
      });

      // Tidy using HTMLTidy.
      tidy(output, options, function(err, tidiedOutput) {
        // Write the destination file.
        grunt.file.write(f.dest, tidiedOutput);

        // Print a success message.
        grunt.log.writeln('File "' + f.dest + '" created.');

        // Mark asynchronous task as done.
        done();
      });
    });
  });

};