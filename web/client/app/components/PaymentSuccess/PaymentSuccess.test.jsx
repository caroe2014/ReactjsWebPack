// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import React from 'react';
import { shallow, mount, configure } from 'enzyme';
import toJson from 'enzyme-to-json';
import Adapter from 'enzyme-adapter-react-16';
import { ThemeProvider } from 'styled-components';
import theme from 'web/client/theme.js';
import i18n from 'i18next';
import PaymentSuccess from '.';
import jsdom from 'jsdom';
import { createMemoryHistory } from 'history';

configure({ adapter: new Adapter() });

/* global describe, it, expect, beforeEach, jest */
/* eslint-disable max-len */
global.window = new jsdom.JSDOM().window;
global.document = window.document;
global.scrollTo = jest.fn();

jest.mock('web/client/i18n', () => ({
  t: (key) => {
    return key;
  }
}));
jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate HoC receive the t function as a prop
  withTranslation: () => Component => {
    Component.defaultProps = { ...Component.defaultProps, t: (key) => key };
    return Component;
  }
}));

jest.mock('web/client/app/reduxpages/ConnectedComponents', () => {
  return {
    ConnectedLoyaltyProcess: <div/>
  };
});

jest.mock('react-i18next', () => ({
  Trans: 'div'
}));

describe('PaymentSuccess', () => {

  let wrapper;
  const mockCboConfig = {};
  const history = createMemoryHistory('/payments');
  const saleData = {
    closedOrder: {
      orderNumber: 1001,
      deliveryProperties: {deliveryOption: {id: 'pickup'}},
      contextId: 1001
    }
  };
  const sites = {
    list: [
      {
        id: 1001,
        isLoyaltyEnabled: true,
        etf: {
          etfEnabled: true
        }
      }
    ]
  };

  beforeEach(() => {
    wrapper = shallow(<PaymentSuccess test total='58.50' sites={sites} saleData={saleData} cboConfig={mockCboConfig} history={history}/>);
  });

  it('does a snapshot test', () => {
    const snapwrapper = mount(<ThemeProvider theme={theme}><PaymentSuccess saleData={saleData} total='58.50' sites={sites} cboConfig={mockCboConfig}/></ThemeProvider>);
    expect(toJson(snapwrapper)).toMatchSnapshot();
  });

  it('should render without throwing an error', () => {
    expect(wrapper.exists()).toBe(true);
  });

  // it('should render without throwing an error when printreciepts once available', () => {
  //   var printReceipt = {
  //     orderData: {
  //       storeLogo: 'test.png',
  //       checkNumber: 1234,
  //       storeInfo: { storeName: 'ABC' },
  //       paymentInfo: [{id: 10, tenderName: 'ABC', showAuthorizationInfoOnReceipt: true, amount: 10}],
  //       gratuity: 10,
  //       taxAmount: 10,
  //       printDateTime: '12:12:2019Z12T',
  //       terminalNumber: 100
  //     }
  //   };
  //   var saleData = {
  //     closedOrder: {
  //       deliveryProperties: {deliveryOption: {id: 'pickup'}},
  //       taxIncludedTotalAmount: {
  //         amount: '1.00'
  //       },
  //       scheduledTime: '1:00 AM',
  //       properties: {
  //         packageOption: 'testSeat'
  //       }
  //     }
  //   };
  //   const printWrapper = mount(<ThemeProvider theme={theme}><PaymentSuccess total='58.50' list={list} cboConfig={mockCboConfig} saleData={saleData} printReceipt={printReceipt} history={history}/></ThemeProvider>);
  //   expect(printWrapper.exists()).toBe(true);
  // });

  describe('when sale data is available', () => {
    var saleData = {
      closedOrder: {
        deliveryProperties: {deliveryOption: {id: 'pickup'}},
        orderNumber: 1001,
        taxIncludedTotalAmount: {
          amount: '1.00'
        },
        properties: {
          packageOption: 'testSeat',
          nameAndDelivery: 'testSeat'
        },
        scheduledTime: '10:00 AM'
      }
    };

    it('should render when available', () => {
      const printWrapper = mount(<ThemeProvider theme={theme}><PaymentSuccess total='58.50' sites={sites} cboConfig={mockCboConfig} saleData={saleData} history={history}/></ThemeProvider>);
      expect(printWrapper.exists()).toBe(true);
    });

    it('should show order number when available', () => {
      const printWrapper = shallow(<PaymentSuccess total='58.50' sites={sites} cboConfig={mockCboConfig} saleData={saleData} history={history}/>);
      expect(printWrapper.find('.order-label').length).toBe(1);
    });
  });

  it('should show delivery location when available', () => {
    var saleData = {
      deliveryProperties: {deliveryOption: {id: 'pickup'}},
      orderNumber: 1001,
      contextId: 1001,
      taxIncludedTotalAmount: {
        amount: '1.00'
      },
      properties: {
        packageOption: 'testSeat'
      },
      scheduledTime: '10:00 AM'
    };
    const printWrapper = mount(<ThemeProvider theme={theme}><PaymentSuccess total='58.50' sites={sites} cboConfig={mockCboConfig} saleData={saleData} history={history}/></ThemeProvider>);
    expect(printWrapper.exists()).toBe(true);
    expect(printWrapper.find('.ready-time-line2').length).toBe(4);
  });

  it('should render when amounts are available', () => {
    var saleData = {
      closedOrder: {
        orderNumber: 1001,
        deliveryProperties: {deliveryOption: {id: 'pickup'}},
        taxIncludedTotalAmount: {
          amount: '1.00'
        },
        tipAmount: 2,
        properties: {
          packageOption: 'testSeat'
        }
      }
    };
    var printReceipt = {
      orderData: {
        checkNumber: 1001,
        storeLogo: 'test.png',
        storeInfo: {
          address1: 'Test',
          address2: 'Test',
          city: 'Test',
          phoneNumber: '12345'
        },
        lineItems: [
          {
            quantity: 1,
            displayText: 'test',
            price: '1.00',
            lineItemGroups: [
              {
                description: 'test',
                baseAmount: '1.00'
              }
            ]
          }
        ],
        paymentInfo: [
          {

          }
        ],
        subtotalAmount: '1.00',
        totalAmount: '1.50'
      }
    };

    const printWrapper = mount(<ThemeProvider theme={theme}><PaymentSuccess paymentsEnabled total='58.50' sites={sites} cboConfig={mockCboConfig} printReceipt={printReceipt} deliveryLocation saleData={saleData} history={history}/></ThemeProvider>);
    expect(printWrapper.exists()).toBe(true);
  });

  // it('should render Email input', () => {
  //   expect(wrapper.find('.email-text').length).toBe(1);
  // });

  // describe('When data is entered in Email input field', () => {
  //   it('should update email state', () => {
  //     expect(wrapper.state().email).toBe('');
  //     const input = wrapper.find('.email-text');
  //     input.simulate('focus');
  //     input.simulate('change', { target: { value: 'sample@agilysys.com' } });
  //     expect(wrapper.state().email).toBe('sample@agilysys.com');
  //   });
  // });

  // it('should render Mobile input', () => {
  //   expect(wrapper.find('.mobile-text').length).toBe(1);
  // });

  // describe('When data is entered in Mobile number field', () => {
  //   it('should update mobile state', () => {
  //     expect(wrapper.state().email).toBe('');
  //     const input = wrapper.find('.mobile-text');
  //     input.simulate('focus');
  //     input.simulate('change', { target: { value: '9884771435' } });
  //     expect(wrapper.state().mobile).toBe('9884771435');
  //   });
  // });

  // describe('When Email ID is invalid', () => {
  //   it('should show an error', () => {
  //     expect(wrapper.state().errorEmail).toBe('');
  //     const input = wrapper.find('.email-text');
  //     input.simulate('focus');
  //     input.simulate('change', { target: { value: 'abc' } });
  //     wrapper.find('.button').simulate('click');
  //     expect(wrapper.state().errorEmail).toBe('PAYMENT_SUCCESS_INVALID_EMAIL');
  //     expect(wrapper.find('.email-validation').prop('children')).toBe('PAYMENT_SUCCESS_INVALID_EMAIL');
  //   });
  // });

  // describe('When Mobile number is invalid', () => {
  //   it('should show an error', () => {
  //     expect(wrapper.state().errorMobile).toBe('');
  //     const input = wrapper.find('.mobile-text');
  //     input.simulate('focus');
  //     input.simulate('change', { target: { value: '123 123' } });
  //     wrapper.find('.button').simulate('click');
  //     expect(wrapper.state().errorMobile).toBe('PAYMENT_SUCCESS_INVALID_MOBILE');
  //     expect(wrapper.find('.mobile-valdiation').prop('children')).toBe('PAYMENT_SUCCESS_INVALID_MOBILE');
  //   });
  // });

  // describe('When Email and Mobile number are empty or invalid', () => {
  //   it('should show an error', () => {
  //     expect(wrapper.state().validationError).toBe('');

  //     const inputMobile = wrapper.find('.mobile-text');
  //     inputMobile.simulate('focus');
  //     inputMobile.simulate('change', { target: { value: '' } });

  //     const inputEmail = wrapper.find('.email-text');
  //     inputEmail.simulate('focus');
  //     inputEmail.simulate('change', { target: { value: '' } });

  //     wrapper.find('.button').simulate('click');
  //     expect(wrapper.state().validationError).toBe('Email or Phone number is mandatory');
  //   });
  // });

  // describe('When Mobile number is entered while email field already has a value ', () => {
  //   it('should reset email Id field', () => {

  //     expect(wrapper.state().email).toBe('');

  //     const inputEmail = wrapper.find('.email-text');
  //     inputEmail.simulate('focus');
  //     inputEmail.simulate('change', { target: { value: 'sample@agilysys.com' } });
  //     expect(wrapper.state().email).toBe('sample@agilysys.com');

  //     const inputMobile = wrapper.find('.mobile-text');
  //     inputMobile.simulate('focus');
  //     inputMobile.simulate('change', { target: { value: '9884771435' } });

  //     expect(wrapper.state().mobile).toBe('9884771435');
  //     expect(wrapper.state().email).toBe('');

  //   });
  // });

  // describe('When Email Id is entered while Mobile number field already has a value ', () => {
  //   it('should reset Mobile number field', () => {

  //     expect(wrapper.state().mobile).toBe('');

  //     const inputMobile = wrapper.find('.mobile-text');
  //     inputMobile.simulate('focus');
  //     inputMobile.simulate('change', { target: { value: '9884771435' } });
  //     expect(wrapper.state().mobile).toBe('9884771435');

  //     const inputEmail = wrapper.find('.email-text');
  //     inputEmail.simulate('focus');
  //     inputEmail.simulate('change', { target: { value: 'sample@agilysys.com' } });

  //     expect(wrapper.state().email).toBe('sample@agilysys.com');
  //     expect(wrapper.state().mobile).toBe('');

  //   });
  // });

  describe('componentDidUpdate', () => {
    it('loads profile', () => {
      let mockFn = jest.fn();
      var printReceiptUpdate = {
        orderData: {
          storeLogo: 'tests.png',
          storeInfo: {},
          lineItems: [
            {
              quantity: 1,
              displayText: 'test',
              price: '1.00',
              lineItemGroups: [
                {
                  description: 'test',
                  baseAmount: '1.00'
                }
              ]
            }
          ],
          paymentInfo: [
            {

            }
          ],
          subtotalAmount: '1.00',
          totalAmount: '1.50'
        }
      };
      var saleData = {
        closedOrder: {
          orderNumber: 1001,
          deliveryProperties: {deliveryOption: {id: 'pickup'}},
          taxIncludedTotalAmount: {
            amount: '1.00'
          },
          tipAmount: 2,
          properties: {
            packageOption: 'testSeat'
          }
        },
        printReceipt: printReceiptUpdate
      };

      var orderConfig = {
        printReceipt: {
          featureEnabled: true
        }
      };
      const componentWrapper = shallow(<PaymentSuccess total='58.50' sites={sites} saleData={saleData} cboConfig={mockCboConfig} getPrintData={mockFn} history={history} orderConfig={orderConfig}/>);
      componentWrapper.find('.print-link').simulate('click');
      componentWrapper.setProps({
        sendReceipt: { test: 'something_different' },
        sendReceiptError: { test: 'something_different' },
        receiptError: { test: 'something_different' },
        closedOrder: { test: 'something_different' },
        printReceipt: printReceiptUpdate
      });
    });
  });
  describe('when Loyalty is enabled', () => {
    var saleData = {
      closedOrder: {
        deliveryProperties: {deliveryOption: {id: 'pickup'}},
        orderNumber: 1001,
        taxIncludedTotalAmount: {
          amount: '1.00'
        },
        properties: {
          packageOption: 'testSeat',
          nameAndDelivery: 'testSeat'
        },
        scheduledTime: '10:00 AM'
      }
    };

  });

});
