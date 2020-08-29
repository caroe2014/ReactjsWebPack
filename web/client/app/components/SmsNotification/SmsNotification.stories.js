// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import React from 'react';
import { storiesOf } from '@storybook/react';
import SmsNotification from '../SmsNotification';
import i18n from '../../../i18n';
import { I18nextProvider } from 'react-i18next';

storiesOf('SmsNotification', module)
  .addDecorator(story => <I18nextProvider i18n={i18n}>{story()}</I18nextProvider>)
  .add('No smsInstructionText', () => {
    return (
      <SmsNotification/>
    );
  }
  )
  .add('smsInstructionText', () => {
    return (
      <SmsNotification smsInstructionText='Instruction text'/>
    );
  }
  ).add('without skip', () => {
    return (
      <SmsNotification smsInstructionText='Instruction text' isMobileNumberRequired/>
    );
  }
  );
