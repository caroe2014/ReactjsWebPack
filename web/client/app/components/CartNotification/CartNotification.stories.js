// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import React from 'react';

import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs/react';

import { Provider } from 'rebass';

import theme from 'web/client/theme.js';
import CartNotification from './';
import config from 'app.config';
import { BrowserRouter as Router, Route } from 'react-router-dom';

const lastItemAdded = { name: 'Burger' };

storiesOf('CartNotification', module)
  .addDecorator(withKnobs)
  .add('CartNotification Component', () => {
    return (
      <div style={{ textAlign: '-webkit-center' }}>
        <Provider theme={theme} style={{ width: '30em' }}>
          <Router basename={config.webPaths.base}>
            <Route render={({ match, location, history }) => (
              <CartNotification fillContent lastItemAdded={lastItemAdded}/>
            )} />
          </Router>
        </Provider>
      </div>
    );
  });
