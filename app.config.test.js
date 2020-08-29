'use strict';

import config from './app.config';
import { locale } from 'moment';

describe('app.config', function () {

  it('should return imagePathResolver', function () {
    const expected = 'http://test.com/';
    expect(config.imagePathResolver('http://test.com/')).toEqual(expected);
  });

  it('should return imagePathResolver when url is not present', function () {
    const expected = 'application/ui/static/assets/test.com/';
    expect(config.imagePathResolver('test.com/')).toEqual(expected);
  });

  it('should return getPOSImageURL with filename', function () {
    const expected = 'application/api/image/10/1001/testFileName';
    expect(config.getPOSImageURL(1001, 'testFileName', 10)).toEqual(expected);
  });

  it('should return computed base path for the given location', function () {
    const expected = 'http://localhost:8080/';
    let location = {
      href: 'http://localhost:8080',
      origin: 'http://localhost:8080'
    };
    expect(config.webPaths.computedBasePath(location)).toEqual(expected);
  });

  it('should return computed fav path for the given location', function () {
    const expected = 'http://localhost:8080/api/test';
    expect(config.webPaths.computeFavPath('http://localhost:8080/', 'api/test')).toEqual(expected);
  });

  it('should return loginQueueName', function () {
    const expected = 'rguest.buy.cloud.desktop.login.tenants.0.email.testEmailAddress.uuid.100';
    expect(config.server.loginQueueName(0, 'testEmailAddress', 100)).toEqual(expected);
  });
});
