// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import React from 'react';
import {
  shallow,
  mount,
  configure
} from 'enzyme';
import toJson from 'enzyme-to-json';
import Adapter from 'enzyme-adapter-react-16';
import { ThemeProvider } from 'styled-components';
import theme from 'web/client/theme';
import { BrowserRouter as Router } from 'react-router-dom';
import { t } from 'i18next';

import BackLink from '.';

configure({
  adapter: new Adapter()
});

jest.mock('i18next');
t.mockImplementation((key) => {
  return key;
});

jest.mock('web/client/i18n', () => ({
  t: (key) => {
    return key;
  }
}));

jest.mock('react-i18next', () => ({
  Trans: 'div'
}));

describe('BackLink', () => {
  var mockMatch = {
    params: {}
  };
  const sites = {};
  it('does a snapshot test', () => {
    const wrapper = mount(<Router><ThemeProvider theme={theme}><BackLink showText section='site' match={mockMatch} sites={sites}/></ThemeProvider></Router>);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render without throwing an error when section is site', () => {
    expect(shallow(<BackLink showText section='site' match={mockMatch} sites={sites}/>).exists()).toBe(true);
  });

  it('should render with updated themes', () => {
    theme.colors.reverseTextColor = '#000000';
    theme.colors.buttonControlColor = '#000000';
    expect(mount(<Router><ThemeProvider theme={theme}><BackLink showText section='site' match={mockMatch} sites={sites}/></ThemeProvider></Router>).exists()).toBe(true);
  });

  it('should render without throwing an error when section is Item', () => {
    expect(shallow(<BackLink showText section='item' match={mockMatch} />).exists()).toBe(true);
  });

  describe('when section is menu', () => {

    it('should render without throwing an error when section is menu', () => {
      expect(shallow(<BackLink showText section='menu' match={mockMatch} />).exists()).toBe(true);
    });

    it('traverse and get category when menu is provided', () => {
      var mockLocalMatch = {
        params: {
          categoryId: 1
        }
      };
      var menu = {
        current: {
          categories: [
            {
              id: 1,
              name: 'test'
            }
          ]
        }
      };
      expect(shallow(<BackLink showText section='menu' match={mockLocalMatch} menu={menu} />).exists()).toBe(true);
    });
  });

  describe('when section is payment', () => {
    it('should render without throwing an error when section is payment', () => {
      var location = {
        pathname: '/paymentComponent'
      };
      const pathWrapper = shallow(<BackLink showText section='payment' location={location} match={mockMatch} />);
      expect(pathWrapper.exists()).toBe(true);
      expect(pathWrapper.state().previousPath).toBe('/payment');
    });

    it('should redirect to Sms notification if Sms is enabled', () => {
      const redirectWrapper = shallow(<BackLink showText section='payment' location isSmsEnabled match={mockMatch} />);
      expect(redirectWrapper.state().previousPath).toBe('/smsNotification');
    });

    it('should redirect to deliveryLocation if delivery is enabled', () => {
      const redirectWrapper = shallow(<BackLink showText section='payment' location deliveryLocation match={mockMatch} />);
      expect(redirectWrapper.state().previousPath).toBe('/deliveryLocation');
    });

    it('should redirect to nameCapture if nameCapture is enabled', () => {
      const redirectWrapper = shallow(<BackLink showText section='payment' location nameCapture match={mockMatch} />);
      expect(redirectWrapper.state().previousPath).toBe('/nameCapture');
    });

    it('should redirect to tipCapture if tipCapture is enabled', () => {
      const redirectWrapper = shallow(<BackLink showText section='payment' location tipCapture match={mockMatch} />);
      expect(redirectWrapper.state().previousPath).toBe('/tip');
    });

    it('should redirect to last cart location if none of the above are enabled', () => {
      const redirectWrapper = shallow(<BackLink showText section='payment' lastCartLocation='test' location match={mockMatch} />);
      expect(redirectWrapper.state().previousPath).toBe('test');
    });
  });

  describe('when section is delivery', () => {
    it('should render without throwing an error when section is delivery', () => {
      var location = {
        pathname: '/deliveryLocation'
      };
      expect(shallow(<BackLink showText section='delivery' location={location} match={mockMatch} />).exists()).toBe(true);
    });

    it('should redirect to  deliveryLocation when tip is not enabled and but pathname is not deliveryLocation', () => {
      var location = {
        pathname: '/test'
      };
      const redirectWrapper = shallow(<BackLink showText section='delivery' location={location} match={mockMatch} />);
      expect(redirectWrapper.state().previousPath).toBe('/deliveryLocation');
    });

    it('should redirect to tipCapture if tipCapture is enabled', () => {
      var location = {
        pathname: '/deliveryLocation'
      };
      const redirectWrapper = shallow(<BackLink showText section='delivery' tipCapture location={location} match={mockMatch} />);
      expect(redirectWrapper.state().previousPath).toBe('/tip');
    });

    it('should redirect to deliverylocation if  if tipCapture is enabled but pathname is not deliveryLocation', () => {
      var location = {
        pathname: '/test'
      };
      const redirectWrapper = shallow(<BackLink showText section='delivery' tipCapture location={location} match={mockMatch} />);
      expect(redirectWrapper.state().previousPath).toBe('/deliveryLocation');
    });
  });

  describe('when section is namecapture', () => {
    it('should render without throwing an error when section is namecapture', () => {
      var location = {
        pathname: '/nameCapture'
      };
      expect(shallow(<BackLink showText section='namecapture' location={location} match={mockMatch} />).exists()).toBe(true);
    });

    it('should redirect to nameCapture when pathname is not nameCapture', () => {
      var location = {
        pathname: '/test'
      };
      const redirectWrapper = shallow(<BackLink showText section='namecapture' location={location} match={mockMatch} />);
      expect(redirectWrapper.state().previousPath).toBe('/nameCapture');
    });

    it('should redirect to tip when pathname is nameCapture', () => {
      var location = {
        pathname: '/nameCapture'
      };
      const redirectWrapper = shallow(<BackLink showText section='namecapture' tipCapture location={location} match={mockMatch} />);
      expect(redirectWrapper.state().previousPath).toBe('/tip');
    });

    it('should redirect to nameCapture when pathname is not nameCapture but tip is enabled', () => {
      var location = {
        pathname: '/test'
      };
      const redirectWrapper = shallow(<BackLink showText section='namecapture' tipCapture location={location} match={mockMatch} />);
      expect(redirectWrapper.state().previousPath).toBe('/nameCapture');
    });
  });

  describe('when section is tip', () => {
    it('should render without throwing an error when section tip', () => {
      var location = {
        pathname: '/tip'
      };
      expect(shallow(<BackLink showText section='tip' location={location} match={mockMatch} />).exists()).toBe(true);
    });
    it('should redirect to tip when path name is not tip', () => {
      var location = {
        pathname: '/test'
      };
      const redirectWrapper = shallow(<BackLink showText section='tip' location={location} match={mockMatch} />);
      expect(redirectWrapper.state().previousPath).toBe('/tip');
    });
  });

  describe('when section is smsnotification', () => {
    it('should render without throwing an error when section smsnotification', () => {
      var mockMatch = {
        params: {}
      };
      expect(shallow(<BackLink showText section='smsnotification' match={mockMatch} />).exists()).toBe(true);
    });

    it('should redirect to deliveryLocation if enabled', () => {
      var mockMatch = {
        params: {}
      };
      const redirectWrapper = shallow(<BackLink showText location section='payment' deliveryLocation match={mockMatch} />);
      expect(redirectWrapper.state().previousPath).toBe('/deliveryLocation');
    });

    it('should redirect to nameCapture if enabled', () => {
      var mockMatch = {
        params: {}
      };
      const redirectWrapper = shallow(<BackLink showText section='smsnotification' nameCapture match={mockMatch} />);
      expect(redirectWrapper.state().previousPath).toBe('/nameCapture');
    });

    it('should redirect to tipCapture if enabled', () => {
      var mockMatch = {
        params: {}
      };
      const redirectWrapper = shallow(<BackLink showText section='smsnotification' tipCapture match={mockMatch} />);
      expect(redirectWrapper.state().previousPath).toBe('/tip');
    });

  });
});
