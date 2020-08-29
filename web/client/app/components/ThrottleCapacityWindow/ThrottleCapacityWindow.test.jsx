// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import React from 'react';
import { shallow, mount, configure } from 'enzyme';
import toJson from 'enzyme-to-json';
import Adapter from 'enzyme-adapter-react-16';
import { ThemeProvider } from 'styled-components';
import theme from 'web/client/theme.js';
import ThrottleCapacityWindow from '.';
import jsdom from 'jsdom';

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

describe('ThrottleCapacityWindow', () => {

  let wrapper;
  let capacityWindows = [
    '1:00 PM - 1:30 PM',
    '1:30 PM - 2:00 PM',
    '2:00 PM - 2:30 PM'
  ];

  beforeEach(() => {
    wrapper = shallow(<ThrottleCapacityWindow
      modalTitle={'test'}
      modalText={'test'}
      capacityData={{
        strategy: 'SUGGEST_AND_ALLOW',
        scheduleSlotList: capacityWindows
      }
      }
    />
    );
  });

  it('does a snapshot test', () => {
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render without throwing an error', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('should mount with themes without throwing an error', () => {
    const mountWrapper = mount(
      <ThemeProvider theme={theme}>
        <ThrottleCapacityWindow
          modalTitle={'test'}
          modalText={'test'}
          capacityData={{
            strategy: 'SUGGEST_AND_ALLOW',
            scheduleSlotList: capacityWindows
          }
          }
        />
      </ThemeProvider>);
    expect(mountWrapper.exists()).toBe(true);
  });

  it('should mount with themes without throwing an error', () => {
    const mountWrapper = mount(
      <ThemeProvider theme={theme}>
        <ThrottleCapacityWindow
          strategy={'SUGGEST_AND_ALLOW'}
          capacityData={{
            strategy: 'SUGGEST_AND_ALLOW',
            scheduleSlotList: capacityWindows
          }
          }
        />
      </ThemeProvider>);
    expect(mountWrapper.exists()).toBe(true);
  });

  it('should mount with orderthrottling text without throwing an error', () => {
    let orderThrottling = {
      titleText: 'Sorry. Our kitchens are super busy right now.',
      optionsMessage: 'Will either of these options work for you?',
      rejectMessage: 'Please pick another time or try again later.'
    };
    const mountWrapper = mount(
      <ThemeProvider theme={theme}>
        <ThrottleCapacityWindow
          orderThrottling={orderThrottling}
          capacityData={{
            strategy: 'SUGGEST_AND_ALLOW',
            scheduleSlotList: capacityWindows
          }
          }
        />
      </ThemeProvider>);
    expect(mountWrapper.exists()).toBe(true);
  });

  it('should mount with orderthrottling text without throwing an error', () => {
    let orderThrottling = {
      titleText: 'Sorry. Our kitchens are super busy right now.',
      optionsMessage: 'Will either of these options work for you?',
      rejectMessage: 'Please pick another time or try again later.'
    };
    const mountWrapper = mount(
      <ThemeProvider theme={theme}>
        <ThrottleCapacityWindow
          orderThrottling={orderThrottling}
          capacityData={{
            strategy: 'SUGGEST_AND_ALLOW',
            scheduleSlotList: capacityWindows
          }
          }
        />
      </ThemeProvider>);
    expect(mountWrapper.exists()).toBe(true);
  });

});
