
module.exports = function (config) {
    config.set({
      basePath: '',
      frameworks: ['jasmine', '@angular-devkit/build-angular'],
      plugins: [
        'karma-jasmine',
        'karma-firefox-launcher',
        'karma-jasmine-html-reporter',
        'karma-coverage-istanbul-reporter',
        '@angular-devkit/build-angular/plugins/karma'
      ],
      client: {
        clearContext: false // leave Jasmine Spec Runner output visible in browser
      },
      coverageIstanbulReporter: {
        dir: require('path').join(__dirname, './coverage/my-angular-project'),
        reports: ['html', 'lcovonly', 'text-summary'],
        fixWebpackSourcePaths: true
      },
      reporters: ['progress', 'kjhtml'],
      port: 9876,
      colors: true,
      logLevel: config.LOG_INFO,
      autoWatch: true,
      browsers: ['FirefoxHeadless'],
      customLaunchers: {
        FirefoxHeadless: {
          base: 'Firefox',
          flags: ['-headless']
        }
      },
      singleRun: false,
      restartOnFileChange: true
    });
  };
  