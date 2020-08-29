// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import React from 'react';

import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs/react';
import { Provider } from 'rebass';
import theme from 'web/client/theme.js';
import NotificationBar from '../NotificationBar';

storiesOf('Panels', module)
  .addDecorator(withKnobs)
  .add('NotificationBar', () => {
    return (
      <div>
        <Provider theme={theme}>
          <NotificationBar title='Panel Header'>
            <p>Panel Content</p>
          </NotificationBar>
        </Provider>
      </div>
    );
  })
  .add('NotificationBar With Selection', () => {
    return (
      <div>
        <Provider theme={theme}>
          <NotificationBar title='Panel Header' selection='Selection Text'>
            <p>Panel Content</p>
          </NotificationBar>
        </Provider>
      </div>
    );
  });
