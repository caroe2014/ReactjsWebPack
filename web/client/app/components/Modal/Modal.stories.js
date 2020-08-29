// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import React from 'react';

import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs/react';
import { Provider } from 'rebass';
import theme from 'web/client/theme.js';
import Modal from '.';

storiesOf('Modal', module)
  .addDecorator(withKnobs)
  .add('Error Modal', () => {
    return (
      <div>
        <Provider theme={theme}>
          <Modal
            open
            cancelButtonText={'Cancel'}
            continueButtonText={'Got it'}
            title={'Oops!'}
            text={'Something went wrong \nwe are working on it, please try again after few minutes'}
          />
        </Provider>
      </div>
    );
  })
  .add('Confirmation Modal', () => {
    return (
      <div>
        <Provider theme={theme}>
          <Modal
            open
            showCancelButton
            cancelButtonText={'Cancel'}
            continueButtonText={'Continue'}
            title={'Title!'}
            text={'Some Text'}
          />
        </Provider>
      </div>
    );
  });
