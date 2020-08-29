// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { Provider } from 'rebass';
import theme from 'web/client/theme.js';
import IncrementInput from './IncrementInput';

storiesOf('Input', module)
  .add('IncrementInput', () =>
    <Provider theme={theme} style={{ width: '100px' }}>
      <IncrementInput onClick={action('clicked')}/>
    </Provider>
  );
