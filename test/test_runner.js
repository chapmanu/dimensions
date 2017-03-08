require(["test/simple_test", "jquery"], function($) {
  window.mochaPhantomJS ? mochaPhantomJS.run() : mocha.run();
});
