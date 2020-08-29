// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import React from 'react';
import {
  shallow,
  mount,
  configure
} from 'enzyme';
import toJson from 'enzyme-to-json';
import Adapter from 'enzyme-adapter-react-16';
import {
  ThemeProvider
} from 'styled-components';
import theme from 'web/client/theme';
import { t } from 'i18next';

import Modal from './index';
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

describe('Modal', () => {

  it('does a snapshot test', () => {
    const wrapper = shallow(<Modal continueButtonText='' showClose text={'test'} showCancelButton onContinue={jest.fn()} onCancel={jest.fn()} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render without throwing an error', () => {
    expect(shallow(<Modal continueButtonText='' text={'test'} showClose showCancelButton onContinue={jest.fn()} onCancel={jest.fn()} />).exists()).toBe(true);
  });

  it('should render without throwing an error on mount', () => {
    const mountWrapper = mount(
      <ThemeProvider theme={theme}>
        <Modal open continueButtonText='' text={'test'} showClose textI18nKey={'test'} showCancelButton onContinue={jest.fn()} onCancel={jest.fn()} />
      </ThemeProvider>
    );
    expect(mountWrapper.exists()).toBe(true);
  });

  it('should render without throwing an error on mount', () => {
    const mountWrapper = mount(
      <ThemeProvider theme={theme}>
        <Modal open continueButtonText='' text={'test'} showClose showCancelButton onContinue={jest.fn()} onCancel={jest.fn()} />
      </ThemeProvider>
    );
    expect(mountWrapper.exists()).toBe(true);
  });
});
