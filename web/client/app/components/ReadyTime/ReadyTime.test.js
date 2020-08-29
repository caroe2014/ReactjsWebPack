// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import React from 'react';
import {
  mount,
  shallow,
  configure
} from 'enzyme';
import toJson from 'enzyme-to-json';
import 'jest-styled-components';
import Adapter from 'enzyme-adapter-react-16';
import {
  ThemeProvider
} from 'styled-components';
import theme from 'web/client/theme';

import ReadyTime from '.';
configure({
  adapter: new Adapter()
});

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
  Trans: 'div'
}));

describe('ReadyTime', () => {

  let readyTime = {
    minutes: -1
  };

  it('does a snapshot test', () => {
    const wrapper = mount(<ThemeProvider theme={theme}><ReadyTime /></ThemeProvider>);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render without throwing an error', () => {
    expect(mount(<ThemeProvider theme={theme}><ReadyTime /></ThemeProvider>).exists()).toBe(true);
  });

  it('should render scheduledTime when provided in props', () => {
    const wrapper = shallow(<ThemeProvider theme={theme}><ReadyTime scheduledTime={'testTime'}/></ThemeProvider>);
    expect(wrapper.dive().instance().getReadyTime()).toBe('testTime');
  });

  it('should render readytime as empty when value is incorrect', () => {
    const wrapper = shallow(<ThemeProvider theme={theme}><ReadyTime readyTime={readyTime}/></ThemeProvider>);
    expect(wrapper.dive().instance().getReadyTime()).toBe('_ _ _');
  });

  it('should render readytime less than a minute if ready time is 0', () => {
    readyTime = {
      minutes: 0
    };
    const wrapper = shallow(<ThemeProvider theme={theme}><ReadyTime readyTime={readyTime}/></ThemeProvider>);
    expect(wrapper.dive().instance().getReadyTime()).toBe('CART_LESS_MINUTE');
  });

  it('should render readytime in a minute if ready time is 1', () => {
    readyTime = {
      minutes: 1
    };
    const wrapper = shallow(<ThemeProvider theme={theme}><ReadyTime readyTime={readyTime}/></ThemeProvider>);
    expect(wrapper.dive().instance().getReadyTime()).toBe('CART_IN_A_MINUTE');
  });

  it('should render readytime in n minutes if ready time is greater than 1', () => {
    readyTime = {
      minutes: 5
    };
    const wrapper = shallow(<ThemeProvider theme={theme}><ReadyTime readyTime={readyTime}/></ThemeProvider>);
    expect(wrapper.dive().instance().getReadyTime()).toBe('CART_IN_N_MINUTES');
  });

  describe('When readytime etf is served with variance', () => {
    it('should render readytime less than a minute if ready time is 0', () => {
      readyTime = {
        'etf': {
          'periodType':

        { 'name': 'Minutes' },
          'minutes': 0,
          'fieldType':

        { 'name': 'minutes' }
        }
      };
      const wrapper = shallow(<ThemeProvider theme={theme}><ReadyTime readyTime={readyTime}/></ThemeProvider>);
      expect(wrapper.dive().instance().getReadyTime()).toBe('CART_LESS_MINUTE');
    });

    it('should render readytime in a minute if ready time is 1', () => {
      readyTime = {
        'etf': {
          'periodType':

        { 'name': 'Minutes' },
          'minutes': 1,
          'fieldType':

        { 'name': 'minutes' }
        }
      };
      const wrapper = shallow(<ThemeProvider theme={theme}><ReadyTime readyTime={readyTime}/></ThemeProvider>);
      expect(wrapper.dive().instance().getReadyTime()).toBe('CART_IN_A_MINUTE');
    });

    it('should render readytime in n minutes if ready time is greater than 1', () => {
      readyTime = {
        'etf': {
          'periodType':

        { 'name': 'Minutes' },
          'minutes': 3,
          'fieldType':

        { 'name': 'minutes' }
        }
      };
      const wrapper = shallow(<ThemeProvider theme={theme}><ReadyTime readyTime={readyTime}/></ThemeProvider>);
      expect(wrapper.dive().instance().getReadyTime()).toBe('CART_IN_N_MINUTES');
    });
  });

  describe('When readytime min max is served with variance', () => {
    it('should render readytime in less than a  minute if min and max are 0', () => {
      readyTime = {
        'minTime': {
          'periodType':

        { 'name': 'Minutes' },
          'minutes': 0,
          'fieldType':

        { 'name': 'minutes' }
        },
        'maxTime': {
          'periodType':

        { 'name': 'Minutes' },
          'minutes': 0,
          'fieldType':

        { 'name': 'minutes' }
        }
      };
      const wrapper = shallow(<ThemeProvider theme={theme}><ReadyTime readyTime={readyTime}/></ThemeProvider>);
      expect(wrapper.dive().instance().getReadyTime()).toBe('CART_LESS_MINUTE');
    });

    it('should render readytime in n minutes if min and max are same but greater than 0', () => {
      readyTime = {
        'minTime': {
          'periodType':

          { 'name': 'Minutes' },
          'minutes': 5,
          'fieldType':

          { 'name': 'minutes' }
        },
        'maxTime': {
          'periodType':

          { 'name': 'Minutes' },
          'minutes': 5,
          'fieldType':

          { 'name': 'minutes' }
        }
      };
      const wrapper = shallow(<ThemeProvider theme={theme}><ReadyTime readyTime={readyTime}/></ThemeProvider>);
      expect(wrapper.dive().instance().getReadyTime()).toEqual({'readyTime': 5});
    });

    it('should render readytime in a  minute if min is 0 and  max is 1', () => {
      readyTime = {
        'minTime': {
          'periodType':

          { 'name': 'Minutes' },
          'minutes': 0,
          'fieldType':

          { 'name': 'minutes' }
        },
        'maxTime': {
          'periodType':

          { 'name': 'Minutes' },
          'minutes': 1,
          'fieldType':

          { 'name': 'minutes' }
        }
      };
      const wrapper = shallow(<ThemeProvider theme={theme}><ReadyTime readyTime={readyTime}/></ThemeProvider>);
      expect(wrapper.dive().instance().getReadyTime()).toBe('CART_IN_A_MINUTE');
    });

    it('should render readytime in less than n minutes if min is 0 and max is greater than 0', () => {
      readyTime = {
        'minTime': {
          'periodType':

            { 'name': 'Minutes' },
          'minutes': 0,
          'fieldType':

            { 'name': 'minutes' }
        },
        'maxTime': {
          'periodType':

            { 'name': 'Minutes' },
          'minutes': 5,
          'fieldType':

            { 'name': 'minutes' }
        }
      };
      const wrapper = shallow(<ThemeProvider theme={theme}><ReadyTime readyTime={readyTime}/></ThemeProvider>);
      expect(wrapper.dive().instance().getReadyTime()).toBe('CART_LESS_THAN_N_MINUTES');
    });

    it('should render readytime in m to n minutes if min and max are greater than 0', () => {
      readyTime = {
        'minTime': {
          'periodType':

              { 'name': 'Minutes' },
          'minutes': 3,
          'fieldType':

              { 'name': 'minutes' }
        },
        'maxTime': {
          'periodType':

              { 'name': 'Minutes' },
          'minutes': 5,
          'fieldType':

              { 'name': 'minutes' }
        }
      };
      const wrapper = shallow(<ThemeProvider theme={theme}><ReadyTime readyTime={readyTime}/></ThemeProvider>);
      expect(wrapper.dive().instance().getReadyTime()).toBe('CART_M_TO_N_MINUTES');
    });
  });
});
