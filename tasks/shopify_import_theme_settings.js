/*
 * grunt-shopify-theme-settings
 * https://github.com/discolabs/grunt-shopify-theme-settings
 *
 * Copyright (c) 2014 Gavin Ballard
 * Licensed under the MIT license.
 */

'use strict';
var tidy = require('htmltidy').tidy;
var cheerio = require('cheerio');
var yaml = require('js-yaml');

module.exports = function(grunt) {

  grunt.registerTask('shopify_import_theme_settings', 'Grunt task to import settings.html into out settings.yml format.', function() {

    // Read options.
    var importFile = grunt.option('importFile');
    var exportFile = grunt.option('exportFile');

    // Mark this task as asynchronous.
    var done = this.async();

    // Check that an importFile option was provided.
    if(!importFile) {
      grunt.log.warn('You must provide the path to a settings.html file to import from with the --importFile argument.');
      return false;
    }

    // Check that an exportFile option was provided.
    if(!exportFile) {
      grunt.log.warn('You must provide the path to a settings.yml file to export to with the --exportFile argument.');
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

      // Parse the HTML using Cheerio.
      var $ = cheerio.load(html);

      // Extract sections from the parsed HTML.
      var sections = getSections($);

      //
      grunt.log.writeln(JSON.stringify(sections));

      // Write the output.
      grunt.file.write(exportFile, yaml.safeDump(sections));

      // Print a success message and mark the asynchronous task as done.
      grunt.log.writeln('File "' + exportFile + '" created.');
      done();
    });
  });

  /**
   * Extract a structured Javascript object from the given $ objects, which
   * represents a DOM tree parsed by Cheerio.
   */
  function getSections($) {
    // Create a sections object to return.
    var sections = {};

    // Iterate through each Fieldset ("Section").
    $('fieldset').each(function() {
      var $fieldset           = $(this),
          sectionName         = getSectionNameFromFieldset($, $fieldset),
          sectionSubsections  = getSectionSubsectionsFromFieldset($, $fieldset);

      sections[sectionName] = sectionSubsections;
    });

    return sections;
  }

  /**
   * Extract the name of this section from the given $fieldset.
   */
  function getSectionNameFromFieldset($, $fieldset) {
    return $fieldset.find('legend').first().text();
  }

  /**
   * Extract the subsections for this section from the given $fieldset.
   */
  function getSectionSubsectionsFromFieldset($, $fieldset) {
    // Create a subsections object to return.
    var subsections = {};

    // Iterate through each Table ("Subsection").
    $fieldset.children('table').each(function(i) {
      var $table            = $(this),
          subsectionName    = getSubsectionNameFromTable($, $table),
          subsectionFields  = getSubsectionFieldsFromTable($, $table);

      // If we couldn't extract a name from the subsection, generate one and mark the title as hidden.
      if(!subsectionName) {
        subsectionName = 'Untitled Subsection #' + i;
        subsectionFields.notitle = true;
      }

      subsections[subsectionName] = subsectionFields;
    });

    return subsections;
  }

  /**
   * Extract the name of this subsection from the given $table.
   */
  function getSubsectionNameFromTable($, $table) {
    // First, see if there's an explicit <h3> header before this table.
    var $h3 = $table.prev('h3');
    if($h3.length === 0) {
      return null;
    }
    return $h3.first().text();
  }

  /**
   * Extract the fields for this subsection from the given $table.
   */
  function getSubsectionFieldsFromTable($, $table) {
    return {};
  }

};