#!/usr/bin/env node

const commandLineArgs = require('command-line-args');
const commandLineUsage = require('command-line-usage');
const commandLineData = require('./command-line-data');
const Launcher = require('webdriverio').Launcher;
const environments = require('./environments').environments;

const { direct, watch, tag, suite, invert, help, headless, environment, debug, spec } = commandLineArgs(commandLineData.options);
const environmentConfiguration = environments[environment];
const baseUrl = direct ? environmentConfiguration.url : 'http://localhost:9013/';

if (help) {
  console.log(commandLineUsage(commandLineData.usage));
  process.exit(0);
}

let configOverrides = {
  watch,
  baseUrl,
  jasmineNodeOpts: {
    grep: tag,
    invertGrep: invert
  }
};

if (spec) {
  Object.assign(configOverrides, {
    spec: `specs/${spec}`
  });
}

if (suite) {
    Object.assign(configOverrides, {
        suite
    });
}

if (debug) {
  Object.assign(configOverrides, {
    maxInstances: 1,
    execArgv: ['--inspect'],
    jasmineNodeOpts: {
      defaultTimeoutInterval: 10000000,
    }
  });
}

let wdio = new Launcher('./wdio.conf.js', configOverrides);
wdio.configParser._capabilities[0].chromeOptions.args.push('--window-size=1920,980');

if (headless) {
  //WDIO does not allow overriding capabilities, so we have to monkey patch the config
  wdio.configParser._capabilities[0].chromeOptions.args.push('--headless', '--disable-gpu');
}


process.env.testTenant = environmentConfiguration.tenant;
process.env.uri = environmentConfiguration.url;
process.env.basePath = environmentConfiguration.basePath;
process.env.username = environmentConfiguration.username;
process.env.password = environmentConfiguration.password;
process.env.multipleContexts = environmentConfiguration.multipleContexts;
process.env.email = environmentConfiguration.email;
process.env.tenantId = environmentConfiguration.tenantId;
process.env.businessContextId = environmentConfiguration.businessContextId;
process.env.ondemandConfigId = environmentConfiguration.ondemandConfigId;
process.env.domain = environmentConfiguration.domain;
process.env.displayProfileID = environmentConfiguration.displayProfile;
process.env.storeBusinessContextID = environmentConfiguration.storeBusinessContext;
process.env.backofficeUrl = environmentConfiguration.backOfficeURL;


wdio.run().then(function (code) {
  process.exit(code);
}, function (error) {
  console.error('Launcher failed to start the test', error.stacktrace);
  process.exit(1);
});
