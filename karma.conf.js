
module.exports = function (config) {
    config.set({
      basePath: '',
      frameworks: ['jasmine', '@angular-devkit/build-angular'],
      plugins: [
        'karma-jasmine',
        'karma-parallel',
        'karma-junit-reporter',
        'karma-chrome-launcher',
        'karma-jasmine-html-reporter',
        'karma-coverage-istanbul-reporter',
        '@angular-devkit/build-angular/plugins/karma',
        'karma-coverage',
      ],
      client: {
        clearContext: false // leave Jasmine Spec Runner output visible in browser
      },
      coverageReporter: {
        dir: require('path').join(__dirname, 'coverage'),
        subdir: '.',
        reporters: [{type: 'cobertura'}]
      },
      junitReporter: {
        outputDir: 'testresults', // results will be saved as $outputDir/$browserName.xml
        outputFile: undefined, // if included, results will be saved as $outputDir/$browserName/$outputFile
        suite: '', // suite will become the package name attribute in xml testsuite element
        useBrowserName: true, // add browser name to report and classes names
        nameFormatter: undefined, // function (browser, result) to customize the name attribute in xml testcase element
        classNameFormatter: undefined, // function (browser, result) to customize the classname attribute in xml testcase element
        properties: {} // key value pair of properties to add to the <properties> section of the report
      },
      coverageIstanbulReporter: {
        dir: require('path').join(__dirname, './coverage/my-angular-project'),
        reports: ['html', 'lcovonly', 'text-summary'],
        fixWebpackSourcePaths: true
      },
      reporters: [
        'progress',
        'coverage',
        'junit'
      ],
      port: 9876,
      colors: true,
      logLevel: config.ERROR,
      autoWatch: false,
      browsers: ['ChromeHeadless'],
      customLaunchers: {
        ChromeHeadless: {
                  base: 'Chrome',
                  flags: [
                      '-headless',
                  ],
              }

      },
      singleRun: true,
      restartOnFileChange: true,
        parallelOptions: {
      executors: 2
    }
    });
  };
  