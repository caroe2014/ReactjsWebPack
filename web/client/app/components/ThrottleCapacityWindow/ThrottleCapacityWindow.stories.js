// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import React from 'react';
import { storiesOf } from '@storybook/react';
import ThrottleCapacityWindow from '../ThrottleCapacityWindow';

storiesOf('ThrottleCapacityWindow', module)
  .add('With Keep time slot button', () => {
    let capacityWindows = [
      '1:00 PM - 1:30 PM',
      '1:30 PM - 2:00 PM',
      '2:00 PM - 2:30 PM'
    ];
    return (
      <ThrottleCapacityWindow
        showClose
        modalTitle={'test'}
        modalText={'test'}
        strategy={'suggestAndAllow'}
        capacityWindows={capacityWindows}
      />
    );
  }
  )
  .add('Without Keep time slot button', () => {
    let capacityWindows = [
      '1:00 PM - 1:30 PM',
      '1:30 PM - 2:00 PM',
      '2:00 PM - 2:30 PM'
    ];
    return (
      <ThrottleCapacityWindow
        showClose
        modalTitle={'test'}
        modalText={'test'}
        capacityWindows={capacityWindows}
      />
    );
  }
  );
