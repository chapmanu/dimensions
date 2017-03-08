// TODO: find a way to test cropping functionality
// these functions live in js/dimensions.js but requiring this file
// in a test environment will break tests due to jQuery code dependencies

require(["test/simple_test", "jquery"], function($) {
  window.mochaPhantomJS ? mochaPhantomJS.run() : mocha.run();
});
