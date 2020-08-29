// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import React from 'react';
import { storiesOf } from '@storybook/react';
import PaymentCard from '.';

storiesOf('PaymentCard', module)
  .add('Visa With Image', () => {
    const paymentOptions = {
      image: 'https://cdn.freebiesupply.com/logos/large/2x/visa-logo-png-transparent.png',
      id: '101',
      name: 'CREDIT/ DEBIT CARD',
      value: 'cardpay',
      valid: true
    };
    return (
      <PaymentCard keyProps={paymentOptions} />
    );
  }
  )
  .add('Apple Pay', () => {
    const paymentOptions = {
      image: 'https://image.flaticon.com/icons/svg/825/825455.svg',
      id: '102',
      name: 'APPLE PAY',
      value: 'applepay',
      valid: true
    };
    return (
      <PaymentCard keyProps={paymentOptions} />
    );
  }
  )
  .add('Android Pay', () => {
    const paymentOptions = {
      image: ' http://en.prothomalo.com/contents/cache/images/350x0x1/uploads/media/2018/02/22/fb830ec3a1e1390306c609af7ae4a6cd-Google-Pay.png', // eslint-disable-line max-len
      id: '103',
      name: 'ANDROID PAY',
      value: 'androidpay',
      valid: false
    };
    return (
      <PaymentCard keyProps={paymentOptions} />
    );
  }
  )
  .add('Without Image', () => {
    const paymentOptions = {
      id: '101',
      name: 'CREDIT/ DEBIT CARD',
      value: 'cardpay',
      valid: true
    };
    return (
      <PaymentCard keyProps={paymentOptions} />
    );
  }
  );
