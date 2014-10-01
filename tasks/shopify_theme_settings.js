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
var temp = require('temp');
var path = require('path');

module.exports = function(grunt) {

  grunt.registerMultiTask('shopify_theme_settings', 'Grunt plugin to build a settings.html file for Shopify themes.', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      templates: [],
      tidyOptions: {
        docType: 'strict',
        outputXhtml: true,
        indent: true,
        indentSpaces: 4,
        wrap: 0,
        showBodyOnly: true,
        dropEmptyElements: false
      }
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

      // Default path to the base settings template file. Only changes if we're using custom templates.
      var templateDirectory = __dirname + '/templates/';

      // If we have a specified include path, create a temporary directory and copy templates from our various sources.
      if(options.templates.length) {
        options.templates.push(templateDirectory);
        templateDirectory = getCombinedTemplateDirectory(options.templates);
      }

      // Compile the settings.html template using Swig.
      var compiledTemplate = swig.compileFile(path.join(templateDirectory, 'settings.html'));

      // Execute (render) our compiled template.
      var output = compiledTemplate({
        sections: sections
      });

      // Tidy using HTMLTidy.
      tidy(output, options.tidyOptions, function(err, tidiedOutput) {
        // Write the destination file.
        grunt.file.write(f.dest, tidiedOutput);

        // Print a success message.
        grunt.log.writeln('File "' + f.dest + '" created.');

        // Mark asynchronous task as done.
        done();
      });
    });
  });

  /**
   * Given a list of template directories, compile them into a single template directory.
   * Templates with the same name will be overridden, with preference given to those first in the list.
   *
   * @param templateDirectories
   * @return string
   */
  function getCombinedTemplateDirectory(templateDirectories) {
    // Automatically track and clean up files at exit.
    temp.track();

    // Create a temporary directory to hold our template files.
    var combinedTemplateDirectory = temp.mkdirSync('templates');

    // Copy templates from our source directories into the combined directory.
    templateDirectories.reverse().forEach(function(templateDirectory) {
      grunt.file.expand(path.join(templateDirectory, '*.html')).forEach(function(srcPath) {
        var srcFilename = path.basename(srcPath),
            destPath = path.join(combinedTemplateDirectory, srcFilename);
        grunt.file.copy(srcPath, destPath);
      });
    });

    return combinedTemplateDirectory;
  }

};
