// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import React from 'react';
import { shallow, mount, configure } from 'enzyme';
import toJson from 'enzyme-to-json';
import Adapter from 'enzyme-adapter-react-16';
import { ThemeProvider } from 'styled-components';
import theme from 'web/client/theme.js';
import TipCapture from '.';
import jsdom from 'jsdom';
import { createMemoryHistory } from 'history';

import i18n from 'i18next';

configure({
  adapter: new Adapter()
});

/* global describe, it, expect, beforeEach */
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

describe('TipCapture', () => {

  let wrapper;
  let mockProps = {
    subTotalAmount: 58.20,
    taxAmount: 5.80,
    tips: [15, 20, 25]
  };
  let mockCurrency = {
    currencyDecimalDigits: '2',
    currencyCultureName: 'en-US',
    currencyCode: 'USD',
    currencySymbol: '$'
  };
  let selectedTipProp = '';
  let total = 1.00;
  let subTotal = 1.00;
  let tax = 1.00;
  const history = createMemoryHistory('/payments');

  beforeEach(() => {
    wrapper = shallow(<TipCapture tipDetails={mockProps} customTipFlag total={total} subTotal={subTotal} tax={tax} currencyDetails={mockCurrency} selectedTipProp={selectedTipProp}/>
    );
  });

  it('does a snapshot test', () => {
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render without throwing an error', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('should mount with themes without throwing an error', () => {
    const mountWrapper = mount(<ThemeProvider theme={theme}><TipCapture tipDetails={mockProps} total={total} subTotal={subTotal} tax={tax} currencyDetails={mockCurrency} selectedTipProp={selectedTipProp}/></ThemeProvider>);
    expect(mountWrapper.exists()).toBe(true);
  });

  it('should render Custom Tip when prop is true', () => {
    const mountWrapper = mount(<ThemeProvider theme={theme}><TipCapture tipDetails={mockProps} subTotal={subTotal} tax={tax} customTipFlag currencyDetails={mockCurrency} selectedTipProp={selectedTipProp}/></ThemeProvider>);
    expect(wrapper.find('.custom-tip-button').length).toBe(1);
  });

  describe('when Custom Tip is false', () => {
    it('should not render Image when Image prop is received', () => {
      const TipWrapper = shallow(<TipCapture tipDetails={mockProps} customTipFlag={false} total={total} subTotal={subTotal} tax={tax} currencyDetails={mockCurrency} selectedTipProp={selectedTipProp}/>);
      expect(TipWrapper.find('.custom-tip-button').length).toBe(0);
    });
  });

  describe('When a tip option is clicked', () => {
    it('should update TipOption state', () => {
      expect(wrapper.state().selectedTip).toBe('');
      const input = wrapper.find('.tip-button-0');
      input.simulate('click');
      expect(wrapper.state().selectedTip).toBe(mockProps.tips[0]);
    });
    it('should render theme of TipOption state when selected', () => {
      const tipWrapper = mount(<ThemeProvider theme={theme}><TipCapture tipDetails={mockProps} subTotal={subTotal} tax={tax} customTipFlag currencyDetails={mockCurrency} selectedTipProp={selectedTipProp}/></ThemeProvider>);
      const input = tipWrapper.find('.tip-button-0').at(0);
      input.simulate('click');
      // expect(tipWrapper.state().selectedTip).toBe(mockProps.tips[0]);
      // expect(wrapper.find('.tip-button-0')).toHaveStyleRule('font-size', '16px');
    });
  });

  it('should render No tipbutton always', () => {
    expect(wrapper.dive().find('.no-tip-button').length).toBe(1);
  });

  describe('When CustomTipButton is clicked', () => {
    it('should update selectedTip state', () => {
      expect(wrapper.state().selectedTip).toBe('');
      const input = wrapper.find('.custom-tip-button');
      input.simulate('click');
      expect(wrapper.state().selectedTip).toBe('custom');
    });
  });

  describe('When selectedTipProp is available', () => {
    describe('When selectedTipProp is Custom', () => {
      it('should render', () => {
        const customWrapper = shallow(<TipCapture tipDetails={mockProps} subTotal={subTotal} tax={tax} customTipFlag currencyDetails={mockCurrency} selectedTipProp={'custom'} selectedTipAmountProp={1.00}/>);
        expect(customWrapper.exists()).toBe(true);
      });
      it('should render', () => {
        const customWrapper = mount(<ThemeProvider theme={theme}><TipCapture tipDetails={mockProps} subTotal={subTotal} tax={tax} customTipFlag currencyDetails={mockCurrency} selectedTipProp={'custom'} selectedTipAmountProp={1.00}/></ThemeProvider>);
        expect(customWrapper.exists()).toBe(true);
      });
    });
  });

  describe('When Closebutton is clicked', () => {
    it('should reset customTipValue and customTipInput state', () => {
      const customWrapper = shallow(<TipCapture tipDetails={mockProps} subTotal={subTotal} tax={tax} customTipFlag currencyDetails={mockCurrency} selectedTipProp={'custom'} selectedTipAmountProp={1.00}/>);
      const input = customWrapper.find('.close-button');
      input.simulate('click');
      expect(customWrapper.state().customTipValue).toBe('');
      expect(customWrapper.state().customTipInput).toBe('');
    });

    it('should render with mount', () => {
      const customWrapper = mount(<ThemeProvider theme={theme} ><TipCapture tipDetails={mockProps} subTotal={subTotal} tax={tax} customTipFlag currencyDetails={mockCurrency} selectedTipProp={'custom'} selectedTipAmountProp={1.00}/></ThemeProvider>);
    });
  });

  describe('When props are updated', () => {
    // it('delivery is enabled, it should render', () => {
    //   // const historyMock = { push: jest.fn() };
    //   const updateWrapper = shallow(<TipCapture tipDetails={mockProps} orderConfig deliveryDestination history={history} subTotal={subTotal} tax={tax} customTipFlag currencyDetails={mockCurrency} selectedTipProp={'custom'} selectedTipAmountProp={1.00}/>);
    //   updateWrapper.setProps({ tipFlag: true });
    //   expect(updateWrapper.exists()).toBe(true);
    //   expect(updateWrapper.instance().props.history.location.pathname).toBe('/deliveryLocation');
    // });
    // it('delivery is disabled, it should render', () => {
    //   // const historyMock = { push: jest.fn() };
    //   const updateWrapper = shallow(<TipCapture tipDetails={mockProps} deliveryDestination={false} history={history} subTotal={subTotal} tax={tax} customTipFlag currencyDetails={mockCurrency} selectedTipProp={'custom'} selectedTipAmountProp={1.00}/>);
    //   updateWrapper.setProps({ tipFlag: true });
    //   expect(updateWrapper.exists()).toBe(true);
    //   expect(updateWrapper.instance().props.history.location.pathname).toBe('/deliveryLocation');
    // });
    it('delivery is disabled, name capture is enabled, it should render', () => {
      // const historyMock = { push: jest.fn() };
      const updateWrapper = shallow(<TipCapture tipDetails={mockProps} nameCapture deliveryDestination={false} history={history} subTotal={subTotal} tax={tax} customTipFlag currencyDetails={mockCurrency} selectedTipProp={'custom'} selectedTipAmountProp={1.00}/>);
      updateWrapper.setProps({ tipFlag: true });
      expect(updateWrapper.exists()).toBe(true);
      expect(updateWrapper.instance().props.history.location.pathname).toBe('/nameCapture');
    });
    it('delivery is disabled, name capture is enabled, and Sms is Enabled  it should render', () => {
      // const historyMock = { push: jest.fn() };
      const updateWrapper = shallow(<TipCapture tipDetails={mockProps} isSmsEnabled nameCapture={false} deliveryDestination={false} history={history} subTotal={subTotal} tax={tax} customTipFlag currencyDetails={mockCurrency} selectedTipProp={'custom'} selectedTipAmountProp={1.00}/>);
      updateWrapper.setProps({ tipFlag: true });
      expect(updateWrapper.exists()).toBe(true);
      expect(updateWrapper.instance().props.history.location.pathname).toBe('/smsNotification');
    });
  });

  it('should call continueWithTip when clicked', () => {
    let props = {
      handlerForTipProp: jest.fn()
    };
    let continueWrapper = shallow(<TipCapture tipDetails={mockProps} isSmsEnabled {...props} nameCapture={false} deliveryDestination={false} history={history} subTotal={subTotal} tax={tax} customTipFlag currencyDetails={mockCurrency} selectedTipProp={'custom'} selectedTipAmountProp={1.00}/>);
    const spy = jest.spyOn(continueWrapper.instance(), 'continueWithTip');
    continueWrapper.instance().forceUpdate();
    continueWrapper.find('.pay-button').simulate('click');
    expect(spy).toHaveBeenCalled();
    spy.mockClear();
  });

  it('should call continueWithoutTip', () => {
    let props = {
      handlerForTipProp: jest.fn()
    };
    let continueWrapper = shallow(<TipCapture tipDetails={mockProps} isSmsEnabled {...props}
      nameCapture={false} deliveryDestination={false} history={history} subTotal={subTotal} tax={tax}
      customTipFlag currencyDetails={mockCurrency} selectedTipProp={'custom'} selectedTipAmountProp/>);
    const spy = jest.spyOn(continueWrapper.instance(), 'continueWithoutTip');
    continueWrapper.instance().forceUpdate();
    continueWrapper.find('.no-tip-button').simulate('click');
    expect(spy).toHaveBeenCalled();
    spy.mockClear();
  });
});
