// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.
/* eslint-disable max-len */
import config from 'app.config';
import axios from 'axios';

const localStorage = window.localStorage;
const GATEWAY_TOKEN = 'gateway-token';
const ACCESS_TOKEN = 'access-token';
const REFRESH_KEY = config.auth.refreshKey;
const EXPIRES_KEY = config.auth.expiresKey;
const REDIRECT_KEY = config.auth.redirectKey;

const logger = config.logger.child({ childName: 'auth' });

class Auth {
  logout (redirectToLogin = true) {
    logger.info(`LOGOUT`);
    localStorage.getItem(ACCESS_TOKEN) && localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(GATEWAY_TOKEN) || localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(EXPIRES_KEY);
    const redirectURI = config.webPaths.parts.ui ? window.location.href.split(`${config.webPaths.parts.ui}`)[1] : window.location.pathname; // eslint-disable-line max-len
    if (redirectURI && redirectURI !== '/login') {
      localStorage.setItem(REDIRECT_KEY, redirectURI);
    }
    if (redirectToLogin && config.authorization) {
      var baseURI = config.webPaths.computedBasePath(window.location);
      if (config.webPaths.parts.base === '/' && baseURI.charAt(baseURI.length - 1) === '/') {
        baseURI = baseURI.substr(0, baseURI.length - 1);
      }
      config.webPaths.parts.base !== '/' ? window.location.replace(`${baseURI}${config.webPaths.ui.substr(1)}/login`) : window.location.replace(`${baseURI}/login`); // eslint-disable-line max-len
    }
  }
  login (headers, redirect = localStorage.getItem(REDIRECT_KEY) || '') {
    if (headers) {
      this.authObj = headers;
    }
    if (redirect.indexOf('logout') >= 0) {
      redirect = '';
    }
    const baseURI = config.webPaths.computedBasePath(window.location);
    localStorage.removeItem(REDIRECT_KEY);
    if (baseURI.charAt(baseURI.length - 1) === '/' && redirect.length > 0) {
      redirect = redirect.charAt(0) === '/' ? redirect.substr(1) : redirect;
    }
    window.location.replace(`${baseURI}${config.webPaths.parts.base !== '/' ? config.webPaths.parts.base.substr(1) : ''}${config.webPaths.parts.ui}${redirect}`); // eslint-disable-line max-len
  }
  refresh (headers) {
    logger.info(`REFRESH`);
    this.authObj = headers;
  }
  get authObj () {
    return localStorage.getItem('access-token') && localStorage.getItem('access-token') !== null ? {
      accessToken: localStorage.getItem('access-token'),
      expiresAt: localStorage.getItem(EXPIRES_KEY)
    }
      : {
        gatewayToken: localStorage.getItem('gateway-token'),
        expiresAt: localStorage.getItem(EXPIRES_KEY)
      };
  }
  set authObj (headers) {
    localStorage.removeItem(GATEWAY_TOKEN) || localStorage.removeItem(ACCESS_TOKEN);
    const token = (headers[GATEWAY_TOKEN] || localStorage.getItem(GATEWAY_TOKEN)) || (headers[ACCESS_TOKEN] || localStorage.getItem(ACCESS_TOKEN));
    const expiresAt = (headers[GATEWAY_TOKEN] || localStorage.getItem(GATEWAY_TOKEN)) || (headers[ACCESS_TOKEN] || localStorage.getItem(ACCESS_TOKEN));
    if (token && expiresAt) {
      localStorage.setItem((headers[GATEWAY_TOKEN] || localStorage.getItem(GATEWAY_TOKEN)) ? GATEWAY_TOKEN : ACCESS_TOKEN, token);
      localStorage.setItem(EXPIRES_KEY, expiresAt);
    }
  }
  async checkAuth (redirectToLogin = true) {
    if (config.authorization) {
      const auth = this.authObj;
      if (!(auth.gatewayToken || auth.accessToken)) {
        this.logout(redirectToLogin);
        return false;
      }
    }
    return true;
  }
};

const auth = new Auth();

// Add auth to all async requests.
/* istanbul ignore next line */
axios.interceptors.request.use((request) => {
  const token = localStorage.getItem(GATEWAY_TOKEN) || localStorage.getItem(ACCESS_TOKEN);
  if (token && !request.headers['authorization']) {
    request.headers.common['Authorization'] = `Bearer ${token}`;
  }
  return request;
});

// Retry on 401.
/* istanbul ignore next line */
axios.interceptors.response.use(null, async (error) => {
// TODO do not merge to develop!!!
  if (error.config && error.response && error.response.status === 401) {
    const token = localStorage.getItem(GATEWAY_TOKEN) || localStorage.getItem(ACCESS_TOKEN);
    const refresh = localStorage.getItem(ACCESS_TOKEN) && localStorage.getItem(REFRESH_KEY);
    if (token && refresh && !error.config.headers['retry']) {
      error.config.headers['retry'] = true;
      const authorization = `Bearer ${token}`;
      const refreshToken = localStorage.getItem(ACCESS_TOKEN) && `Bearer ${refresh}`;
      const refreshRequest = await axios.get(`${config.webPaths.api}login/refresh`,
        { headers: { authorization, refreshToken, retry: true } });
      if (refreshRequest.data.refresh && (refreshRequest.headers[GATEWAY_TOKEN] || refreshRequest.headers[ACCESS_TOKEN])) {
        auth.refresh(refreshRequest.headers);
        error.config.headers['Authorization'] = `Bearer ${refreshRequest.headers[GATEWAY_TOKEN] || refreshRequest.headers[ACCESS_TOKEN]}`;
        return axios.request(error.config);
      } else {
        auth.logout();
        return Promise.reject(error);
      }
    } else {
      auth.logout();
      return Promise.reject(error);
    }
  } else if (error.config && (error.code === 'ECONNREFUSED' || error.message === 'Network Error') && !error.config.headers['retry_refused']) { // eslint-disable-line max-len
    error.config.headers['retry_refused'] = true;
    logger.info('Retrying connection refused');
    return axios.request(error.config);
  }
  return Promise.reject(error);
});

export default auth;
