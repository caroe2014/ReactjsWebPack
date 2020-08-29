// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import React from 'react';

import { storiesOf } from '@storybook/react';
import { withKnobs, boolean } from '@storybook/addon-knobs/react';

import { Provider } from 'rebass';
import config from 'app.config';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Provider as ReactProvider } from 'react-redux';
import theme from 'web/client/theme.js';
import NavigationMenu from './NavigationMenu';
import { store } from '../../../store';

storiesOf('Navigation', module)
  .addDecorator(withKnobs)
  .add('Navigation Menu', () => {
    const showBackLink = boolean('Show Back Link', false);
    const showCartLink = boolean('Show Cart Link', false);
    const showHomeLink = boolean('Show Home Link', false);
    return (
      <ReactProvider store={store}>
        <div>
          <Provider theme={theme} style={{ height: '250px' }}>
            <Router basename={config.webPaths.base}>
              <Route
                render={({ match, location, history }) => (
                  <NavigationMenu
                    showBackLink={showBackLink}
                    showCartLink={showCartLink}
                    showHomeLink={showHomeLink}
                    match={match}
                    location={location}
                    history={history}
                  />
                )}
              />
            </Router>
          </Provider>
        </div>
      </ReactProvider>
    );
  })
  .add('Navigation Menu Open', () => {
    const showBackLink = boolean('Show Back Link', false);
    const showCartLink = boolean('Show Cart Link', false);
    const showHomeLink = boolean('Show Home Link', false);
    return (
      <ReactProvider store={store}>
        <div>
          <Provider theme={theme} style={{ height: '250px' }}>
            <Router basename={config.webPaths.base}>
              <Route
                render={({ match, location, history }) => (
                  <NavigationMenu
                    showBackLink={showBackLink}
                    showCartLink={showCartLink}
                    showHomeLink={showHomeLink}
                    match={match}
                    menuOpen
                    location={location}
                    history={history}
                  />
                )}
              />
            </Router>
          </Provider>
        </div>
      </ReactProvider>
    );
  });
