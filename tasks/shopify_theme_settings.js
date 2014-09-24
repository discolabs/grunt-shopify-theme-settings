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

  grunt.registerMultiTask('shopify_theme_settings', 'Grunt plugin to build a settings.html file for Shopify themes.', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      includes: [],
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

      // If we have a specified include path, use a specialised filesystem loader for Swig templates that tries to load
      // from our specified include directory first, then falls back to the default loader.
      if(options.includes.length) {
        options.includes.push('');
        swig.setDefaults({ loader: fsMultipleDirectoryLoader(options.includes) });
      }

      // Compile the template using Swig.
      var settingsTemplate = swig.compileFile(__dirname + '/templates/settings.html');

      // Execute (render) our compiled template.
      var output = settingsTemplate({
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
   * Define a simple customer filesystem loader for Swig templates that can resolve from multiple templates directories
   * in order of precedence.
   *
   * See: http://paularmstrong.github.io/swig/docs/loaders/#custom
   *
   * @param basepaths
   * @param encoding
   * @returns {{}}
   */
  function fsMultipleDirectoryLoader(basepaths, encoding) {
    var ret = {}, loaders;

    // Ensure we have something in our basepaths, and that it's an array.
    if(!basepaths || !basepaths.length) {
      basepaths = [''];
    }

    // Create a loader for each basepath.
    loaders = basepaths.map(function(basepath) {
      return swig.loaders.fs(basepath, encoding);
    });

    /**
     * Resolve to a path for the given template.
     *
     * @param to
     * @param from
     * @returns {*}
     */
    ret.resolve = function(to, from) {
      var candidates = loaders.map(function(loader) {
        return loader.resolve(to, from);
      });

      // Return the first candidate that exists.
      for(var i = 0, l = candidates.length; i < l; i++) {
        grunt.log.writeln('test', candidates[i]);
        if(grunt.file.isFile(candidates[i])) {
          grunt.log.writeln('return', candidates[i]);
          return candidates[i];
        }
      }
    };

    // Pass the template loader load() method off to the default Swig filesystem loader load() method.
    ret.load = loaders[0].load;

    return ret;
  }

};
