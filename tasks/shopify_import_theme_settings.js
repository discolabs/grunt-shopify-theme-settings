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

    // Set up options to pass to HTMLTidy.
    var tidyOptions = {
      wrap: 0
    };

    // Read and tidy the input HTML for consistency.
    tidy(grunt.file.read(importFile), tidyOptions, function(err, html) {

      // Check to see if there were any errors tidying the HTML.
      if(err) {
        grunt.log.error(err);
        done(false);
      }

      // Parse the HTML using Cheerio.
      var $ = cheerio.load(html);

      // Extract sections from the parsed HTML.
      var sections = getSections($);

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
          subsectionFields  = {};

      // If we couldn't extract a name from the subsection, generate one and mark the title as hidden.
      if(!subsectionName) {
        subsectionName = 'Untitled Subsection #' + (i + 1);
        subsectionFields.notitle = true;
      }

      // Add any extracted fields to the fields hash.
      addSubsectionFieldsFromTable($, subsectionFields, $table);

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
   * Extract the fields for this subsection from the given $table and add
   * them to the given fields object.
   */
  function addSubsectionFieldsFromTable($, fields, $table) {
    // Iterate through each input inside the table.
    $table.find(':input').each(function(i) {
      var $input      = $(this),
          fieldLabel  = getFieldLabelFromInput($, $input);

      // If we couldn't extract a label from the field, generate one.
      if(!fieldLabel) {
        fieldLabel = 'Untitled Field #' + (i + 1);
      }

      fields[fieldLabel] = getFieldData($, $input);
    });

    return fields;
  }

  /**
   * Extract the field label from the given $input.
   */
  function getFieldLabelFromInput($, $input) {
    // Try and find a <label> element in the same row.
    var $label = $input.closest('tr').find('label');
    if($label.length === 0) {
      return null;
    }
    return $label.first().text();
  }

  /**
   * Extract field information from the given $input.
   */
  function getFieldData($, $input) {
    var fieldData = {};

    var fieldName = $input.attr('name');
    fieldData['name'] = fieldName;

    var fieldType = getFieldType($, $input);
    fieldData['type'] = fieldType;

    var fieldHelp = getFieldHelp($, $input);
    if(fieldHelp) {
      fieldData['help'] = fieldHelp;
    }

    // Add options for select and font types.
    if(fieldType === 'select' || fieldType === 'font') {
      fieldData['options'] = getFieldOptions($, $input);
    }

    // Add default for text-single and text-multi types, if present.
    if(fieldType === 'text-single' || fieldType === 'text-multi') {
      var fieldDefault = getFieldDefault($, $input);
      if(fieldDefault) {
        fieldData['default'] = fieldDefault;
      }
    }

    // Add width/height for file types.
    if(fieldType === 'file') {
      if($input.data('maxWidth')) {
        fieldData['width'] = $input.data('maxWidth');
      }
      if($input.data('maxHeight')) {
        fieldData['height'] = $input.data('maxHeight');
      }
    }

    // Add cols/rows for text-multi types.
    if(fieldType === 'text-multi') {
      if($input.attr('cols')) {
        fieldData['cols'] = $input.attr('cols');
      }
      if($input.attr('rows')) {
        fieldData['rows'] = $input.attr('rows');
      }
    }

    return fieldData;
  }

  /**
   * Get the field type of the passed $input.
   */
  function getFieldType($, $input) {
    // Check for simple properties that determine type.
    if($input.is('textarea')) { return 'text-multi'; }
    if($input.is('[type="checkbox"]')) { return 'checkbox'; }
    if($input.is('[type="file"]')) { return 'file'; }

    // Check for <select>-based inputs.
    if($input.is('select')) {
      if($input.hasClass('font')) { return 'font'; }
      if($input.hasClass('blog')) { return 'blog'; }
      if($input.hasClass('collection')) { return 'collection'; }
      if($input.hasClass('linklist')) { return 'linklist'; }
      if($input.hasClass('page')) { return 'page'; }
      if($input.hasClass('snippet')) { return 'snippet'; }
      return 'select';
    }

    // Text-based inputs.
    if($input.hasClass('color')) { return 'color'; }

    return 'text-single';
  }

  /**
   * Try to extract any help text for the given field.
   */
  function getFieldHelp($, $input) {
    // Try and find a <small> element in the same row.
    var $small = $input.closest('tr').find('small');
    if($small.length === 0) {
      return null;
    }
    return $small.first().html();
  }

  /**
   * Get the options for a field.
   */
  function getFieldOptions($, $input) {
    var options = {};

    $input.find('option').each(function() {
      var $option = $(this);
      options[$option.attr('value')] = $option.text();
    });

    return options;
  }

  /**
   * Get the options for a field.
   */
  function getFieldDefault($, $input) {
    return $input.val();
  }

};
