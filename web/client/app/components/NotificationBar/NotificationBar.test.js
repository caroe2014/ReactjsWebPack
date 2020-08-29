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

import NotificationBar from './index';
configure({
  adapter: new Adapter()
});

describe('NotificationBar', () => {

  it('does a snapshot test', () => {
    const wrapper = shallow(<NotificationBar open/>);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render without throwing an error', () => {
    expect(shallow(<NotificationBar open/>).exists()).toBe(true);
  });

  it('should render without throwing an error on mount', () => {
    expect(mount(<ThemeProvider theme={theme}><NotificationBar open/></ThemeProvider>).exists()).toBe(true);
  });
});
