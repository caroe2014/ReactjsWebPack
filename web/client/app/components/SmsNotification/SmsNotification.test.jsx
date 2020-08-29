// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import React from 'react';
import { shallow, mount, configure } from 'enzyme';
import toJson from 'enzyme-to-json';
import Adapter from 'enzyme-adapter-react-16';
import {
  ThemeProvider
} from 'styled-components';
import theme from 'web/client/theme';
import SmsNotification from '.';
import jsdom from 'jsdom';

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

jest.mock('react-i18next', () => ({
  Trans: 'div'
}));
;

configure({
  adapter: new Adapter()
});

describe('SMSCapture', () => {

  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<SmsNotification isMobileNumberRequired smsInstructionText='Instruction text'/>
    );
  });

  it('does a snapshot test', () => {
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render without throwing an error', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('should render without throwing an error ob mount with mobile', () => {
    const mountWrapper = mount(
      <ThemeProvider theme={theme}>
        <SmsNotification isMobileNumberRequired smsInstructionText='Instruction text' countryCode={'1'} regionCode={'US'}/>
      </ThemeProvider>
    );
    expect(mountWrapper.exists()).toBe(true);
    expect(mountWrapper.find('.skip-btn').length).toBe(0);
  });

  it('should render without throwing an error ob mount without mobile', () => {
    const mountWrapper = mount(
      <ThemeProvider theme={theme}>
        <SmsNotification isMobileNumberRequired={false} smsInstructionText='Instruction text' countryCode={'1'} regionCode={'US'}/>
      </ThemeProvider>
    );
    expect(mountWrapper.exists()).toBe(true);

    expect(mountWrapper.find('.skip-btn').length).toBe(4);
  });

  // it('should render skip button when prop is true', () => {
  //   expect(wrapper.dive().find('.skip-btn').length).toBe(1);
  // });

  // describe('when Custom SMS is false', () => {
  //   it('should not render Image when Image prop is received', () => {
  //     const SMSWrapper = shallow(<SmsNotification isMobileNumberRequired={false}/>);
  //     expect(SMSWrapper.dive().find('.skip-btn').length).toBe(0);
  //   });
  // });

  describe('when Instruction text empty', () => {
    it('should not render Instruction text when smsInstructionText prop not received', () => {
      const SMSWrapper = shallow(<SmsNotification isMobileNumberRequired={false}/>);
      expect(SMSWrapper.dive().find('.instruction-text').length).toBe(0);
    });
  });

  it('should call skipSms with spy', () => {
    let mockFn = jest.fn();
    let wrapper = shallow(<SmsNotification isMobileNumberRequired={false} onContinuePay={mockFn}/>);
    const spy = jest.spyOn(wrapper.instance(), 'skipSms');
    wrapper.instance().forceUpdate();
    wrapper.find('.skip-btn').simulate('click');
    expect(spy).toHaveBeenCalled();
    spy.mockClear();
  });

  it('should call skipSms with spy', () => {
    let mockFn = jest.fn();
    let wrapper = shallow(<SmsNotification isMobileNumberRequired={false} onContinuePay={mockFn}/>);
    const spy = jest.spyOn(wrapper.instance(), 'continuePay');
    wrapper.instance().forceUpdate();
    wrapper.find('.pay-button').simulate('click');
    expect(spy).toHaveBeenCalled();
    spy.mockClear();
  });
  describe('when skipSms is called with mobilenumber', () => {
    it('should reset error state', () => {
      let mockFn = jest.fn();
      let wrapper = shallow(<SmsNotification isMobileNumberRequired={false} mobileNumber={'1234567890'} onContinuePay={mockFn}/>);
      wrapper.setState({ mobileNumber: 9874563210 });
      const spy = jest.spyOn(wrapper.instance(), 'continuePay');
      wrapper.instance().forceUpdate();
      wrapper.find('.pay-button').simulate('click');
      expect(wrapper.state().error).toBe('');
      expect(spy).toHaveBeenCalled();
      spy.mockClear();
    });
  });

});
