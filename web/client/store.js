// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import config from 'app.config';
import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { createBrowserHistory } from 'history';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootSaga from 'web/client/app/modules/rootSaga';
import rootReducer from 'web/client/app/modules/rootReducer';
import Persistor from 'web/client/app/utils/Persister.js';

const persistorConfig = {
  store: 'store',
  ttlSeconds: config.localStoragePersistTTLi,
  blockList: ['error', 'app',
    'sites',
    'concept',
    'menu',
    'stripepayments',
    'payments',
    'itemdetails',
    'communication'],
  restoreList: ['profile']
};

export const persistor = new Persistor(persistorConfig);

const newRelicAddPageAction = () => {
  return next => action => {
    const returnValue = next(action);
    if (window.newrelic) {
      window.newrelic.addPageAction(action.type);
    }
    return returnValue;
  };
};

const logger = config.logger.child({ childName: 'store' });

const getBaseURI = () => {
  if (window.document.baseURI) {
    return window.document.baseURI;
  } else {
    const baseElement = window.document.getElementsByTagName('base');
    return baseElement ? baseElement[0].href : undefined;
  }
};

const baseURI = getBaseURI();

const basename = baseURI
  ? `${baseURI.replace(window.location.origin, '').slice(0, -1)}${config.webPaths.ui}`
  : config.webPaths.ui;
logger.info(`windowOrigin: ${window.location.origin}`);
logger.info(`basename: ${basename}`);

export const history = createBrowserHistory({
  basename
});

export const sagaMiddleware = createSagaMiddleware();

const middlewares = [sagaMiddleware, routerMiddleware(history), newRelicAddPageAction, persistor.middleWare];

// only show redux logs in development or test.
if (['development', 'test'].indexOf(process.env.NODE_ENV) >= 0) {
  const reduxLogger = require('redux-logger');
  const logger = reduxLogger.createLogger();
  middlewares.push(logger);
}

export const store = createStore(
  connectRouter(history)(rootReducer),
  persistor.getInitialState(),
  process.env.NODE_ENV === 'development'
    ? composeWithDevTools(
      applyMiddleware(
        ...middlewares
      ))
    : compose(
      applyMiddleware(
        ...middlewares
      ))
);

rootSaga.map(saga => sagaMiddleware.run(saga));
