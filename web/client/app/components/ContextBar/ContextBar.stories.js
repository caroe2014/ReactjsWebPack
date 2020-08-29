// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import React from 'react';

import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs/react';
import { Provider } from 'rebass';
import theme from 'web/client/theme.js';
import ContextBar from '.';

const props = {
  sites: {
    list: []
  },
  menu: {
    current: {}
  },
  item: {}
};

storiesOf('ContextBar', module)
  .addDecorator(withKnobs)
  .add('ContextBar', () => {
    return (
      <div>
        <Provider theme={theme}>
          <ContextBar section='site' {...props}/>
        </Provider>
      </div>
    );
  });
