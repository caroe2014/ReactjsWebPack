// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import React from 'react';
import { storiesOf } from '@storybook/react';
import PaymentOptions from '.';

storiesOf('PaymentOptions', module)
  .add('With Images', () => {
    const paymentOptionsList = [{
      image: 'https://cdn.freebiesupply.com/logos/large/2x/visa-logo-png-transparent.png',
      id: '101',
      name: 'CREDIT/ DEBIT CARD',
      value: 'cardpay',
      valid: true
    },
    {
      image: 'https://image.flaticon.com/icons/svg/825/825455.svg',
      id: '102',
      name: 'APPLE PAY',
      value: 'applepay',
      valid: true
    },
    {
      image: ' http://en.prothomalo.com/contents/cache/images/350x0x1/uploads/media/2018/02/22/fb830ec3a1e1390306c609af7ae4a6cd-Google-Pay.png', // eslint-disable-line max-len
      id: '103',
      name: 'ANDROID PAY',
      value: 'androidpay',
      valid: false
    }
    ];
    return (
      <PaymentOptions keyProps={paymentOptionsList} />
    );
  })
  .add('Without Images', () => {
    const paymentOptionsList = [{
      id: '101',
      name: 'CREDIT/ DEBIT CARD',
      value: 'cardpay',
      valid: true
    },
    {
      id: '102',
      name: 'APPLE PAY',
      value: 'applepay',
      valid: true
    },
    {
      id: '103',
      name: 'ANDROID PAY',
      value: 'androidpay',
      valid: false
    }
    ];
    return (
      <PaymentOptions keyProps={paymentOptionsList} />
    );
  });
