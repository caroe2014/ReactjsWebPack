// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import React from 'react';
import { shallow, mount, configure } from 'enzyme';
import toJson from 'enzyme-to-json';
import Adapter from 'enzyme-adapter-react-16';
import Cart from '.';
import jsdom from 'jsdom';
import {
  ThemeProvider
} from 'styled-components';
import theme from 'web/client/theme';
import { t } from 'i18next';
import { createMemoryHistory } from 'history';

configure({
  adapter: new Adapter()
});

/* global describe, it, expect, beforeEach */
/* eslint-disable max-len */
global.window = new jsdom.JSDOM().window;
global.document = window.document;

configure({
  adapter: new Adapter()
});

jest.mock('i18next');
t.mockImplementation((key) => {
  return key;
});

jest.mock('react-i18next', () => ({
  Trans: 'div'
}));

jest.mock('web/client/i18n', () => ({
  t: (key) => {
    return key;
  }
}));
// jest.mock('react-i18next', () => ({
//   // this mock makes sure any components using the translate HoC receive the t function as a prop
//   withTranslation: () => Component => {
//     Component.defaultProps = { ...Component.defaultProps, t: (key) => key };
//     return Component;
//   },
// }));

const history = createMemoryHistory('/payments');

const props = {
  subTotal: 0,
  tax: 0,
  total: 0,
  items: [],
  fillContent: true
};

let mockFn = jest.fn();

let mockCurrency = {
  currencyDecimalDigits: '2',
  currencyCultureName: 'en-US',
  currencyCode: 'USD',
  currencySymbol: '$'
};

describe('Cart', () => {

  it('does a snapshot test', () => {
    const wrapper = shallow(<Cart {...props}/>);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render without throwing an error', () => {
    expect(shallow(<Cart {...props} />).exists()).toBe(true);
  });

  it('should render without throwing an error on mount', () => {
    expect(mount(<ThemeProvider theme={theme}><Cart {...props} changePending/></ThemeProvider>).exists()).toBe(true);
  });

  it('should render withnecessary props on mount ', () => {
    props.items = [
      {
        displayText: 'test',
        contextId: 100,
        selectedModifiers: [
          {
            description: 'test',
            baseAmount: 10,
            suboption: [
              {
                description: 'test',
                amount: 1
              }
            ]
          }
        ],
        count: 1,
        id: 1001,
        uniqueId: 1001,
        amount: 10
      }
    ];
    props.tipAmount = 10;
    props.total = 10;
    props.changePending = 0;
    props.storesList = [
      {
        id: 100,
        tip: {
          acceptTips: true
        }
      }
    ];
    props.currency = mockCurrency;
    props.fillContent = false;
    expect(mount(<ThemeProvider theme={theme}><Cart {...props} /></ThemeProvider>).exists()).toBe(true);
  });

  it('should render Loader when loading state is true', () => {
    let wrapper = shallow(<Cart {...props} />);
    wrapper.setState({ loader: true });
    wrapper.instance().forceUpdate();
    expect(wrapper.find('.loader-container').length).toBe(1);
  });

  it('should call handleDelete when DeleteButton is clicked', () => {
    let wrapper = shallow(<Cart {...props} removeItem={mockFn}/>);
    const spy = jest.spyOn(wrapper.instance(), 'handleDelete');
    wrapper.instance().forceUpdate();
    wrapper.find('.cart-delete-btn-1').simulate('click');
    expect(spy).toHaveBeenCalled();
    spy.mockClear();
  });

  describe('When price of modifier & sub modifier are 0', () => {
    it('should not show the price', () => {
      props.items = [
        {
          displayText: 'test',
          contextId: 100,
          selectedModifiers: [
            {
              description: 'test',
              baseAmount: 0,
              suboption: [
                {
                  description: 'test',
                  amount: 0
                }
              ]
            }
          ],
          count: 1,
          id: 1001,
          uniqueId: 1001,
          amount: 10
        }
      ];
      props.storesList = [
        {
          id: 100,
          tip: {
            acceptTips: true
          },
          pay: {
            paymentsEnabled: true
          }
        }
      ];
      props.changePending = 10;
      let wrapper = shallow(<Cart {...props} />);
      expect(wrapper.find('.modifier-empty-price').length).toBe(1);
      expect(wrapper.find('.sub-modifier-empty-price').length).toBe(1);
    });
  });

  it('should render withnecessary props on mount ', () => {
    let mockprops = {};
    mockprops.items = [
      {
        displayText: 'test',
        contextId: 100,
        count: 1,
        id: 1001,
        uniqueId: 1001,
        amount: 10
      }
    ];
    mockprops.tipAmount = 10;
    mockprops.total = 10;
    mockprops.changePending = 0;
    mockprops.storesList = [
      {
        id: 100,
        tip: {
          acceptTips: true
        },
        pay: {
          paymentsEnabled: true
        }
      }
    ];
    mockprops.currency = mockCurrency;
    mockprops.fillContent = false;
    expect(mount(<ThemeProvider theme={theme}><Cart {...mockprops} /></ThemeProvider>).exists()).toBe(true);
  });

  // it('should call handleCheckout when payments is disabled ', () => {
  //   let mockprops = {};
  //   mockprops.items = [
  //     {
  //       displayText: 'test',
  //       contextId: 100,
  //       count: 1,
  //       id: 1001,
  //       uniqueId: 1001,
  //       amount: 10
  //     }
  //   ];
  //   mockprops.tipAmount = 10;
  //   mockprops.total = 10;
  //   mockprops.changePending = 0;
  //   mockprops.storesList = [
  //     {
  //       id: 100,
  //       tip: {
  //         acceptTips: true
  //       },
  //       pay: {
  //         paymentsEnabled: false
  //       }
  //     }
  //   ];
  //   mockprops.currency = mockCurrency;
  //   mockprops.fillContent = false;
  //   let wrapper = shallow(<Cart {...mockprops} setCheckoutData={mockFn}/>);
  //   const spy = jest.spyOn(wrapper.instance(), 'handleCheckout');
  //   wrapper.instance().forceUpdate();
  //   wrapper.find('.pay-cart-button').simulate('click');
  //   expect(spy).toHaveBeenCalled();
  //   spy.mockClear();
  // });

  describe('handlePay clicked', () => {
    let mockprops = {};
    mockprops.items = [
      {
        displayText: 'test',
        contextId: 100,
        count: 1,
        id: 1001,
        uniqueId: 1001,
        amount: 10
      }
    ];
    mockprops.tipAmount = 10;
    mockprops.total = 10;
    mockprops.changePending = 0;
    mockprops.location = {
      pathname: '/test'
    };
    mockprops.storesList = [
      {
        id: 100,
        tip: {
          acceptTips: true
        },
        pay: {
          paymentsEnabled: true
        }
      }
    ];
    mockprops.currency = mockCurrency;
    mockprops.fillContent = false;

    // it('should call handlePay when payments is enabled ', () => {
    //   let wrapper = shallow(<Cart {...mockprops} lastCartLocation={mockFn} setCheckoutData={mockFn} setOrderConfig={mockFn} setCartLoyaltyInfo={mockFn} history={history} toggleCart={mockFn} closeCart={mockFn}/>);
    //   const spy = jest.spyOn(wrapper.instance(), 'handlePay');
    //   wrapper.instance().forceUpdate();
    //   wrapper.find('.pay-cart-button').simulate('click');
    //   expect(spy).toHaveBeenCalled();
    //   spy.mockClear();
    // });

    // it('return when location is payment ', () => {
    //   mockprops.location = {
    //     pathname: '/payment'
    //   };
    //   let wrapper = shallow(<Cart {...mockprops} lastCartLocation={mockFn} setCheckoutData={mockFn} setOrderConfig={mockFn} setCartLoyaltyInfo={mockFn} history={history} toggleCart={mockFn} closeCart={mockFn}/>);
    //   const spy = jest.spyOn(wrapper.instance(), 'handlePay');
    //   wrapper.instance().forceUpdate();
    //   wrapper.find('.pay-cart-button').simulate('click');
    //   expect(spy).toHaveBeenCalled();
    //   spy.mockClear();
    // });

    // it('accept tips is false ', () => {
    //   mockprops.location = {
    //     pathname: '/test'
    //   };
    //   mockprops.storesList = [
    //     {
    //       id: 100,
    //       tip: {
    //         acceptTips: false
    //       },
    //       pay: {
    //         paymentsEnabled: true
    //       }
    //     }
    //   ];
    //   let wrapper = shallow(<Cart {...mockprops} lastCartLocation={mockFn} setCheckoutData={mockFn} setOrderConfig={mockFn} setCartLoyaltyInfo={mockFn} history={history} toggleCart={mockFn} closeCart={mockFn}/>);
    //   const spy = jest.spyOn(wrapper.instance(), 'handlePay');
    //   wrapper.instance().forceUpdate();
    //   wrapper.find('.pay-cart-button').simulate('click');
    //   expect(spy).toHaveBeenCalled();
    //   spy.mockClear();
    // });

    // it('deliveryDestination is enabled ', () => {
    //   mockprops.location = {
    //     pathname: '/test'
    //   };
    //   mockprops.storesList = [
    //     {
    //       id: 100,
    //       tip: {
    //         acceptTips: false
    //       },
    //       pay: {
    //         paymentsEnabled: true
    //       },
    //       deliveryDestination: {
    //         deliverToDestinationEnabled: true
    //       }
    //     }
    //   ];
    //   let wrapper = shallow(<Cart {...mockprops} lastCartLocation={mockFn} setCheckoutData={mockFn} setOrderConfig={mockFn} setCartLoyaltyInfo={mockFn} history={history} toggleCart={mockFn} closeCart={mockFn}/>);
    //   const spy = jest.spyOn(wrapper.instance(), 'handlePay');
    //   wrapper.instance().forceUpdate();
    //   wrapper.find('.pay-cart-button').simulate('click');
    //   expect(spy).toHaveBeenCalled();
    //   spy.mockClear();
    // });

    // it('deliveryDestination is enabled but path is deliveryLocation ', () => {
    //   mockprops.location = {
    //     pathname: '/deliveryLocation'
    //   };
    //   mockprops.storesList = [
    //     {
    //       id: 100,
    //       tip: {
    //         acceptTips: false
    //       },
    //       pay: {
    //         paymentsEnabled: true
    //       },
    //       deliveryDestination: {
    //         deliverToDestinationEnabled: true
    //       }
    //     }
    //   ];
    //   let wrapper = shallow(<Cart {...mockprops} lastCartLocation={mockFn} setCheckoutData={mockFn} setOrderConfig={mockFn} setCartLoyaltyInfo={mockFn} history={history} toggleCart={mockFn} closeCart={mockFn}/>);
    //   const spy = jest.spyOn(wrapper.instance(), 'handlePay');
    //   wrapper.instance().forceUpdate();
    //   wrapper.find('.pay-cart-button').simulate('click');
    //   expect(spy).toHaveBeenCalled();
    //   spy.mockClear();
    // });

    // it('nameCapture is enabled ', () => {
    //   mockprops.location = {
    //     pathname: '/test'
    //   };
    //   mockprops.storesList = [
    //     {
    //       id: 100,
    //       tip: {
    //         acceptTips: false
    //       },
    //       pay: {
    //         paymentsEnabled: true
    //       },
    //       deliveryDestination: {
    //         deliverToDestinationEnabled: false
    //       },
    //       nameCapture: {
    //         featureEnabled: true
    //       }
    //     }
    //   ];
    //   let wrapper = shallow(<Cart {...mockprops} lastCartLocation={mockFn} setCheckoutData={mockFn} setOrderConfig={mockFn} setCartLoyaltyInfo={mockFn} history={history} toggleCart={mockFn} closeCart={mockFn}/>);
    //   const spy = jest.spyOn(wrapper.instance(), 'handlePay');
    //   wrapper.instance().forceUpdate();
    //   wrapper.find('.pay-cart-button').simulate('click');
    //   expect(spy).toHaveBeenCalled();
    //   spy.mockClear();
    // });

    // it('nameCapture is enabled but path is nameCapture ', () => {
    //   mockprops.location = {
    //     pathname: '/nameCapture'
    //   };
    //   mockprops.storesList = [
    //     {
    //       id: 100,
    //       tip: {
    //         acceptTips: false
    //       },
    //       pay: {
    //         paymentsEnabled: true
    //       },
    //       deliveryDestination: {
    //         deliverToDestinationEnabled: false
    //       },
    //       nameCapture: {
    //         featureEnabled: true
    //       }
    //     }
    //   ];
    //   let wrapper = shallow(<Cart {...mockprops} lastCartLocation={mockFn} setCheckoutData={mockFn} setOrderConfig={mockFn} setCartLoyaltyInfo={mockFn} history={history} toggleCart={mockFn} closeCart={mockFn}/>);
    //   const spy = jest.spyOn(wrapper.instance(), 'handlePay');
    //   wrapper.instance().forceUpdate();
    //   wrapper.find('.pay-cart-button').simulate('click');
    //   expect(spy).toHaveBeenCalled();
    //   spy.mockClear();
    // });

    // it('sms is enabled ', () => {
    //   mockprops.location = {
    //     pathname: '/test'
    //   };
    //   mockprops.storesList = [
    //     {
    //       id: 100,
    //       tip: {
    //         acceptTips: false
    //       },
    //       pay: {
    //         paymentsEnabled: true
    //       },
    //       deliveryDestination: {
    //         deliverToDestinationEnabled: false
    //       },
    //       nameCapture: {
    //         featureEnabled: false
    //       },
    //       sms: {
    //         isSmsEnabled: true
    //       }
    //     }
    //   ];
    //   let wrapper = shallow(<Cart {...mockprops} lastCartLocation={mockFn} setCheckoutData={mockFn} setOrderConfig={mockFn} setCartLoyaltyInfo={mockFn} history={history} toggleCart={mockFn} closeCart={mockFn}/>);
    //   const spy = jest.spyOn(wrapper.instance(), 'handlePay');
    //   wrapper.instance().forceUpdate();
    //   wrapper.find('.pay-cart-button').simulate('click');
    //   expect(spy).toHaveBeenCalled();
    //   spy.mockClear();
    // });

    // it('Sms is enabled but path is isSmsEnabled ', () => {
    //   mockprops.location = {
    //     pathname: '/smsNotification'
    //   };
    //   mockprops.storesList = [
    //     {
    //       id: 100,
    //       tip: {
    //         acceptTips: false
    //       },
    //       pay: {
    //         paymentsEnabled: true
    //       },
    //       deliveryDestination: {
    //         deliverToDestinationEnabled: false
    //       },
    //       nameCapture: {
    //         featureEnabled: false
    //       },
    //       sms: {
    //         isSmsEnabled: true
    //       }
    //     }
    //   ];
    //   let wrapper = shallow(<Cart {...mockprops} lastCartLocation={mockFn} setCheckoutData={mockFn} setOrderConfig={mockFn} setCartLoyaltyInfo={mockFn} history={history} toggleCart={mockFn} closeCart={mockFn}/>);
    //   const spy = jest.spyOn(wrapper.instance(), 'handlePay');
    //   wrapper.instance().forceUpdate();
    //   wrapper.find('.pay-cart-button').simulate('click');
    //   expect(spy).toHaveBeenCalled();
    //   spy.mockClear();
    // });

    // it('Accept tips is true but path is tip ', () => {
    //   mockprops.location = {
    //     pathname: '/tip'
    //   };
    //   mockprops.storesList = [
    //     {
    //       id: 100,
    //       tip: {
    //         acceptTips: true
    //       },
    //       pay: {
    //         paymentsEnabled: true
    //       },
    //       deliveryDestination: {
    //         deliverToDestinationEnabled: false
    //       },
    //       nameCapture: {
    //         featureEnabled: false
    //       },
    //       sms: {
    //         isSmsEnabled: false
    //       }
    //     }
    //   ];
    //   let wrapper = shallow(<Cart {...mockprops} lastCartLocation={mockFn} setCheckoutData={mockFn} setOrderConfig={mockFn} setCartLoyaltyInfo={mockFn} history={history} toggleCart={mockFn} closeCart={mockFn}/>);
    //   const spy = jest.spyOn(wrapper.instance(), 'handlePay');
    //   wrapper.instance().forceUpdate();
    //   wrapper.find('.pay-cart-button').simulate('click');
    //   expect(spy).toHaveBeenCalled();
    //   spy.mockClear();
    // });
  });

});
