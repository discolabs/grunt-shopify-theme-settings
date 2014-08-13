'use strict';

var grunt = require('grunt');

exports.shopify_import_theme_settings = {
  importSettings: function(test) {
    test.expect(1);

    var actual = grunt.file.read('tmp/import.yml');
    var expected = grunt.file.read('test/expected/import.yml');
    test.equal(actual, expected, 'import.yml file imported correctly.');

    test.done();
  }
};