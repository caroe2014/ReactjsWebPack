import config, { _mockConfigHooks } from 'app.config';
import Auth from './auth';
let logger = _mockConfigHooks.logger;

const TOKEN_KEY = config.auth.tokenKey;
const REFRESH_KEY = config.auth.refreshKey;
const EXPIRES_KEY = config.auth.expiresKey;
const headers = {
  [TOKEN_KEY]: 'test token',
  [REFRESH_KEY]: 'test refresh',
  [EXPIRES_KEY]: 'expires'
};
const REDIRECT_KEY = config.auth.redirectKey;

Object.defineProperty(window, 'location', {
  value: {
    href: 'http://localhost/application/ui/concept',
    replace: jest.fn((data) => data)
  },
  writable: true,
  configurable: true
});

const authObj = {
  'accessToken': headers[TOKEN_KEY],
  'expiresAt': headers[TOKEN_KEY]
  // 'refreshToken': headers[REFRESH_KEY]
};

describe('Auth class', () => {

  it('should call refresh', () => {
    Auth.refresh(headers);
    expect(logger.info).toBeCalled();
    expect(Auth.authObj).toEqual(authObj);
  });

  describe('login check', () => {
    it('should call login', () => {
      jest.spyOn(config.webPaths, 'computedBasePath');
      jest.spyOn(window.location, 'replace');
      jest.spyOn(window.Storage.prototype, 'removeItem');
      Auth.login();
      expect(Auth.authObj).toEqual(authObj);
      expect(window.localStorage.removeItem).toHaveBeenCalledWith(REDIRECT_KEY);
      expect(config.webPaths.computedBasePath).toHaveBeenCalled();
      expect(window.location.replace).toHaveBeenCalled();
    });

    it('should call login with redirect logout', () => {
      window.localStorage.setItem(REDIRECT_KEY, 'test-logout');
      jest.spyOn(config.webPaths, 'computedBasePath');
      jest.spyOn(window.location, 'replace');
      Auth.login(headers);
      expect(Auth.authObj).toEqual(authObj);
      expect(config.webPaths.computedBasePath).toHaveBeenCalled();
      expect(window.location.replace).toHaveBeenCalled();
    });

    it('should call login without redirect logout', () => {
      window.localStorage.setItem(REDIRECT_KEY, 'test');
      jest.spyOn(config.webPaths, 'computedBasePath');
      jest.spyOn(window.location, 'replace');
      Auth.login(headers);
      expect(Auth.authObj).toEqual(authObj);
      expect(config.webPaths.computedBasePath).toHaveBeenCalled();
      expect(window.location.replace).toHaveBeenCalled();
    });
  });

  describe('logout check', () => {
    it('should call logout', () => {
      jest.spyOn(window.Storage.prototype, 'removeItem');
      jest.spyOn(config.webPaths, 'computedBasePath');
      Auth.logout();
      expect(logger.info).toBeCalled();
      expect(window.localStorage.removeItem).toHaveBeenCalledWith(TOKEN_KEY);
      expect(window.localStorage.removeItem).toHaveBeenCalledWith(EXPIRES_KEY);
      expect(window.localStorage.removeItem).toHaveBeenCalledWith(REFRESH_KEY);
      expect(config.webPaths.computedBasePath).toHaveBeenCalled();
      expect(window.location.replace).toHaveBeenCalled();
    });

    it('should call logout without redirect', () => {
      jest.spyOn(window.Storage.prototype, 'removeItem');
      Auth.logout(false);
      expect(logger.info).toBeCalled();
      expect(window.localStorage.removeItem).toHaveBeenCalledWith(TOKEN_KEY);
      expect(window.localStorage.removeItem).toHaveBeenCalledWith(EXPIRES_KEY);
      expect(window.localStorage.removeItem).toHaveBeenCalledWith(REFRESH_KEY);
      expect(window.location.replace).toHaveBeenCalled();
    });
  });

  describe('check auth', () => {
    it('should call checkAuth', async () => {
      const spy = jest.spyOn(Auth, 'logout');
      await Auth.checkAuth();
      expect(spy).toBeCalled();
    });
  });

});
