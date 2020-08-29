// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import React from 'react';
import { storiesOf } from '@storybook/react';
import NameCapture from '../NameCapture';
import i18n from '../../../i18n';
import { I18nextProvider } from 'react-i18next';

storiesOf('NameCapture', module)
  .addDecorator(story => <I18nextProvider i18n={i18n}>{story()}</I18nextProvider>)
  .add('No nameInstructionText', () => {
    return (
      <NameCapture/>
    );
  }
  )
  .add('nameInstructionText', () => {
    return (
      <NameCapture nameInstructionText='Instruction text'/>
    );
  }
  ).add('without skip', () => {
    return (
      <NameCapture nameInstructionText='Instruction text' isNameCaptureRequired/>
    );
  }
  );
