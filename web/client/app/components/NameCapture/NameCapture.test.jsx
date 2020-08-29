// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import React from 'react';
import { shallow, mount, configure } from 'enzyme';
import toJson from 'enzyme-to-json';
import Adapter from 'enzyme-adapter-react-16';
import NameCapture from '.';
import jsdom from 'jsdom';
import { ThemeProvider } from 'styled-components';
import theme from 'web/client/theme';

configure({
  adapter: new Adapter()
});

/* global describe, it, expect, beforeEach jest */
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
  },
}));

jest.mock('react-i18next', () => ({
  Trans: 'div'
}));

configure({
  adapter: new Adapter()
});

describe('NameCapture', () => {

  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<NameCapture isNameCaptureRequired nameInstructionText='Instruction text'/>
    );
  });

  it('does a snapshot test', () => {
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render without throwing an error', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('should render without throwing an error on mount', () => {
    expect(mount(<ThemeProvider theme={theme}><NameCapture isNameCaptureRequired nameInstructionText='Instruction text'/></ThemeProvider>).exists()).toBe(true);
  });

  it('should render without throwing an error on mount without NameCaptureRequired', () => {
    expect(mount(<ThemeProvider theme={theme}><NameCapture isNameCaptureRequired={false} nameInstructionText='Instruction text'/></ThemeProvider>).exists()).toBe(true);
  });

  // it('should render skip button when prop is true', () => {
  //   expect(wrapper.dive().find('.skip-btn').length).toBe(1);
  // });

  describe('when Instruction text empty', () => {
    it('should render Instruction text when smsInstructionText prop not received', () => {
      const TipWrapper = shallow(<NameCapture isNameCaptureRequired={false} isSmsEnabled/>);
      expect(TipWrapper.dive().find('.instruction-text').length).toBe(1);
    });
  });

  describe('when Sms is not Enabled', () => {
    it('should render Instruction text when smsInstructionText prop not received', () => {
      const TipWrapper = shallow(<NameCapture isNameCaptureRequired={false} isSmsEnabled={true}/>);
      expect(TipWrapper.dive().find('.instruction-text').length).toBe(1);
    });
  });

  it('should call skipNameCapture with spy', () => {
    let mockFn = jest.fn();
    let wrapper = shallow(<NameCapture isNameCaptureRequired={false}  onContinuePay={mockFn} isSmsEnabled={true}/>);
    const spy = jest.spyOn(wrapper.instance(), 'skipNameCapture');
    wrapper.instance().forceUpdate();
    wrapper.find('.skip-btn').simulate('click');
    expect(spy).toHaveBeenCalled();
    spy.mockClear();
  });

  describe('when continuePay is clicked', () => {
  it('should call continuePay with spy', () => {
    let mockFn = jest.fn();
    let wrapper = shallow(<NameCapture isNameCaptureRequired={false}  onContinuePay={mockFn} isSmsEnabled={true}/>);
    const spy = jest.spyOn(wrapper.instance(), 'continuePay');
    wrapper.instance().forceUpdate();
    wrapper.find('.nextBtn').simulate('click');
    expect(spy).toHaveBeenCalled();
    spy.mockClear();
  });
  it('firstName, lastInitial is given', () => {
    let mockFn = jest.fn();
    let wrapper = shallow(<NameCapture isNameCaptureRequired={false}  onContinuePay={mockFn} isSmsEnabled={true}/>);
    const spy = jest.spyOn(wrapper.instance(), 'continuePay');
    wrapper.setState({ firstName: 'Test', lastInitial: 'test' });
    wrapper.instance().forceUpdate();
    wrapper.find('.nextBtn').simulate('click');
    expect(spy).toHaveBeenCalled();
    spy.mockClear();
  });
});


});
