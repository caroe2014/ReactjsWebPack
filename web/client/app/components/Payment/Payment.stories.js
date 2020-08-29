// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import React from 'react';

import Payment from '.';
import { storiesOf } from '@storybook/react';
import { Provider } from 'react-redux';
import { store } from '../../../store';

storiesOf('Payment Component', module)
  .add('Payment Component', () => {

    return (
      <Provider store={store}>
        <Payment />
      </Provider>
    );
  }
  );
