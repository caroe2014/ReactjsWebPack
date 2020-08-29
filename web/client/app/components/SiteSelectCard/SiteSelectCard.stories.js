// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import React from 'react';
import { storiesOf } from '@storybook/react';
import SiteSelectCard from '.';

storiesOf('SiteSelectCard', module)
  .add('AvailabeAtDay', () => {
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
      <SiteSelectCard keyProps={siteItem} />
    );
  })
  .add('AvailabeAtNight', () => {
    const siteItem = {
      image: 'http://eatstreet.co.id/wp-content/uploads/2016/11/cropped-MASTER-FINAL_LOGO-OVAL-EAT-STREET-1.png',
      name: 'Eat Street',
      availableAt: {
        opens: '5:00pm',
        closes: '9:00am'
      },
      address: ['1000, windward concourse', 'alpharetta,GA, USA']
    };
    return (
      <SiteSelectCard keyProps={siteItem} />
    );
  })
  .add('WithoutAddress', () => {
    const siteItem = {
      image: 'http://eatstreet.co.id/wp-content/uploads/2016/11/cropped-MASTER-FINAL_LOGO-OVAL-EAT-STREET-1.png',
      name: 'Eat Street',
      availableAt: {
        opens: '5:00pm',
        closes: '9:00am'
      }
    };
    return (
      <SiteSelectCard keyProps={siteItem} />
    );
  })
  .add('Without Image', () => {
    const siteItem = {
      name: 'Eat Street',
      availableAt: {
        opens: '9:00am',
        closes: '5:00pm'
      },
      address: ['1000, windward concourse', 'alpharetta,GA, USA']
    };
    return (
      <SiteSelectCard keyProps={siteItem} />
    );
  });
