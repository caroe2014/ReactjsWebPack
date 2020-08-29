// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import React from 'react';
import { storiesOf } from '@storybook/react';
import DynamicImage from './DynamicImageExample';

storiesOf('DynamicImage', module)
  .add('DynamicImage', () => {
    const siteItem = {
      image: 'http://eatstreet.co.id/wp-content/uploads/2016/11/cropped-MASTER-FINAL_LOGO-OVAL-EAT-STREET-1.png',
      name: 'Eat Street',
      availableAt: {
        opens: '9:00am',
        closes: '5:00pm'
      },
      address: ['1000, windward concourse, Sometown', 'Alpharetta,GA, USA - 500100']
    };
    return (
      <DynamicImage keyProps={siteItem} />
    );
  });
