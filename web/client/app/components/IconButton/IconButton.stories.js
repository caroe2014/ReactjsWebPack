// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { Provider } from 'rebass';
import theme from 'web/client/theme.js';
import IconButton from '.';

storiesOf('Button', module)
  .add('IconButton', () =>
    <Provider theme={theme} style={{ height: '250px' }}>
      <IconButton onClick={action('clicked')} iconClassName='fa fa-plus'/>
    </Provider>
  );
