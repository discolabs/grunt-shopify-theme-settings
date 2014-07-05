'use strict';

var grunt = require('grunt');

exports.shopify_theme_settings = {
  compileSpecific: function(test) {
    test.expect(1);

    var actual = grunt.file.read('tmp/test-specific.html');
    var expected = grunt.file.read('test/expected/test-specific.html');
    test.equal(actual, expected, 'settings.html file generated correctly when specifying order.');

    test.done();
  },
  compileGlob: function(test) {
    test.expect(1);

    var actual = grunt.file.read('tmp/test-glob.html');
    var expected = grunt.file.read('test/expected/test-glob.html');
    test.equal(actual, expected, 'settings.html file generated correctly when using glob.');

    test.done();
  }
};