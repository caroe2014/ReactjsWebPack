// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import React from 'react';

import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs/react';

import { Provider } from 'rebass';

import theme from 'web/client/theme.js';
import Cart from './';
import config from 'app.config';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import mockItems from './mockItems';

storiesOf('Cart', module)
  .addDecorator(withKnobs)
  .add('Cart Component', () => {
    return (
      <div style={{ textAlign: '-webkit-center' }}>
        <Provider theme={theme} style={{ width: '30em' }}>
          <Router basename={config.webPaths.base}>
            <Route render={({ match, location, history }) => (
              <Cart fillContent items={mockItems}/>
            )} />
          </Router>
        </Provider>
      </div>
    );
  });
