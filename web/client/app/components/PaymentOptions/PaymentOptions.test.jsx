// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import React from 'react';
import { shallow, mount, configure } from 'enzyme';
import toJson from 'enzyme-to-json';
import Adapter from 'enzyme-adapter-react-16';
import { ThemeProvider } from 'styled-components';
import theme from 'web/client/theme.js';
import PaymentOptions from '.';
import { t } from 'i18next';

configure({ adapter: new Adapter() });

jest.mock('react-i18next', () => ({
  Trans: 'div'
}));

jest.mock('../UrlImageLoader', () => () => <div id='mockUrlImageLoaderm'>
     mockUrlImageLoader
</div>);

jest.mock('../PaymentCard', () => () => <div id='mockPaymentCard'>
     mockPaymentCard
</div>);

describe('PaymentOptions', () => {

  let wrapper;
  let mockProps = [{
    image: 'https://cdn.freebiesupply.com/logos/large/2x/visa-logo-png-transparent.png',
    id: '101',
    name: 'CREDIT/ DEBIT CARD',
    displayLabel: 'CREDIT/ DEBIT CARD',
    value: 'cardpay',
    type: 'cardpay',
    valid: true
  },
  {
    image: 'https://image.flaticon.com/icons/svg/825/825455.svg',
    id: '102',
    name: 'APPLE PAY',
    displayLabel: 'APPLE PAY',
    value: 'applepay',
    type: 'applepay',
    valid: true
  },
  {
    image: ' http://en.prothomalo.com/contents/cache/images/350x0x1/uploads/media/2018/02/22/fb830ec3a1e1390306c609af7ae4a6cd-Google-Pay.png', // eslint-disable-line max-len
    id: '103',
    name: 'ANDROID PAY',
    displayLabel: 'ANDROID PAY',
    value: 'androidpay',
    type: 'androidpay',
    valid: false
  }
  ];
  const MOCK_APP_CONFIG = {
    instructionText: 'mock instruction text'
  };

  beforeEach(() => {
    let mockFn = jest.fn();
    wrapper = shallow(<PaymentOptions keyProps={mockProps} appconfig={MOCK_APP_CONFIG} clearRoomChargeError={mockFn} clearMemberChargeError={mockFn}/>
    );
  });

  // TODO: replace these
  // it('does a snapshot test', () => {
  //   const snapWrapper = mount(<ThemeProvider theme={theme}>
  //     <PaymentOptions
  //       keyProps={mockProps}
  //       stripeEnabled
  //       isPayValid
  //       isApplePay
  //       selectedOptionId={'stripe-pay'}
  //       appconfig={MOCK_APP_CONFIG} />
  //   </ThemeProvider>);
  //   expect(toJson(snapWrapper)).toMatchSnapshot();
  // });

  // it('does a snapshot test', () => {
  //   const snapWrapper = mount(<ThemeProvider theme={theme}>
  //     <PaymentOptions
  //       keyProps={mockProps}
  //       stripeEnabled
  //       selectedOptionId
  //       appconfig={MOCK_APP_CONFIG} />
  //   </ThemeProvider>);
  //   expect(toJson(snapWrapper)).toMatchSnapshot();
  // });

  it('should render without throwing an error', () => {
    expect(wrapper.exists()).toBe(true);
  });

  // describe('when Item props are received', () => {
  //   it('should render the same number of tiles', () => {
  //     expect(wrapper.find('.tile').length).toBe(mockProps.length);
  //   });
  // });

  describe('when Item props are not received', () => {
    beforeEach(() => {
      mockProps = [];
    });
    let mockFn = jest.fn();
    it('should not render ConceptList', () => {
      const itemWrapper = shallow(<PaymentOptions keyProps={mockProps} appconfig={MOCK_APP_CONFIG} clearRoomChargeError={mockFn} clearMemberChargeError={mockFn}/>);
      expect(itemWrapper.find('.tile').length).toBe(0);
    });
  });

});
