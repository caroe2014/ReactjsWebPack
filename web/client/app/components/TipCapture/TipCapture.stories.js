// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import React from 'react';
import { storiesOf } from '@storybook/react';
import TipCapture from '../TipCapture';

storiesOf('TipCapture', module)
  .add('No Custom Tip', () => {
    const tipDetails = {
      subTotalAmount: 58.20,
      taxAmount: 5.80,
      tips: [15, 20, 25],
      customTipFlag: false
    };
    return (
      <TipCapture tipDetails={tipDetails} showAddButton/>
    );
  }
  )
  .add('Custom Tip', () => {
    const tipDetails = {
      subTotalAmount: 58.20,
      taxAmount: 5.80,
      tipPercent: [15, 20, 25],
      customTipFlag: true
    };
    return (
      <TipCapture tipDetails={tipDetails} showAddButton/>
    );
  }
  );
