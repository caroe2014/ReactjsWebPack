// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import React from 'react';

import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs/react';

import { Provider } from 'rebass';

import theme from 'web/client/theme.js';
import config from 'app.config';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import LoadingCircle from './loadingCircle';

const barStyle = {
  transformOrigin: '19px 19px'
};

const contentStyle = {
  top: '0px',
  left: '18px',
  width: '2px',
  height: '9px',
  borderRadius: '20%',
  background: 'red'};

const containerStyle = {
  width: '2em',
  height: '2em'
};

storiesOf('CircleBarLoader', module)
  .addDecorator(withKnobs)
  .add('CircleBarLoader with Default', () => {
    return (
      <div style={{ textAlign: '-webkit-center' }}>
        <Provider theme={theme} style={{ width: '30em' }}>
          <Router basename={config.webPaths.base}>
            <Route render={({ match, location, history }) => (
              <LoadingCircle />
            )} />
          </Router>
        </Provider>
      </div>
    );
  })
  .add('CircleBarLoader with Custom', () => {
    return (
      <div style={{ textAlign: '-webkit-center' }}>
        <Provider theme={theme} style={{ width: '30em' }}>
          <Router basename={config.webPaths.base}>
            <Route render={({ match, location, history }) => (
              <LoadingCircle containerStyle={containerStyle} contentStyle={contentStyle} barStyle={barStyle} />
            )} />
          </Router>
        </Provider>
      </div>
    );
  });
