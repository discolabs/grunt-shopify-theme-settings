'use strict';

var grunt = require('grunt');

exports.shopify_theme_settings = {
  compile: function(test) {
    test.expect(1);

    var actual = grunt.file.read('tmp/test.html');
    var expected = grunt.file.read('test/expected/test.html');
    test.equal(actual, expected, 'settings.html file generated correctly.');

    test.done();
  }
};