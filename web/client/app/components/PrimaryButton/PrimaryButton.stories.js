// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { Provider } from 'rebass';
import theme from 'web/client/theme.js';
import PrimaryButton from '.';

storiesOf('Button', module)
  .add('PrimaryButton', () =>
    <Provider theme={theme} style={{ height: '250px' }}>
      <PrimaryButton onClick={action('clicked')} children='Button'/>
    </Provider>
  );
