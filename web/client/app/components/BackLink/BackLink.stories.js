// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import React from 'react';

import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs/react';
import { Provider } from 'rebass';
import theme from 'web/client/theme.js';
import BackLink from 'web/client/app/components/BackLink';

const props = {
  match: {
    params: {}
  }
};

storiesOf('BackLink', module)
  .addDecorator(withKnobs)
  .add('BackLink', () => {
    return (
      <div>
        <Provider theme={theme}>
          <BackLink section='site' {...props}/>
        </Provider>
      </div>
    );
  });
