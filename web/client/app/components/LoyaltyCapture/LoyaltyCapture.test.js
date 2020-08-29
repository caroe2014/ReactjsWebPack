import React from 'react';
import { shallow, mount, configure } from 'enzyme';
import toJson from 'enzyme-to-json';
import Adapter from 'enzyme-adapter-react-16';
import { ThemeProvider } from 'styled-components';
import theme from 'web/client/theme.js';
import i18n from 'i18next';
import LoyaltyCapture from '.';
import jsdom from 'jsdom';
import { createMemoryHistory } from 'history';

configure({ adapter: new Adapter() });

/* global describe, it, expect, beforeEach, jest */
/* eslint-disable max-len */
global.window = new jsdom.JSDOM().window;
global.document = window.document;
global.scrollTo = jest.fn();

jest.mock('wicg-inert', () => ({
  t: (key) => {
    return key;
  }
}));

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

describe('LoyaltyCapture', () => {

  let wrapper;
  let loyaltyDetails = {
    header: 'test'
  };
  let loyaltyInfoMap = {
    1001: {
      id: 'test',
      loyaltyInfo: {
        test: 'test'
      }
    }
  };
  let siteId = 1001;
  const history = createMemoryHistory('/payments');
  let list = [{id: 1001, isLoyaltyEnabled: true}];

  beforeEach(() => {
    wrapper = shallow(<LoyaltyCapture loyaltyDetails={loyaltyDetails} loyaltyInfoMap={loyaltyInfoMap} siteId={siteId} fetching={false} history={history}/>);
  });

  it('does a snapshot test', () => {
    const snapwrapper = mount(<ThemeProvider theme={theme}><LoyaltyCapture loyaltyDetails={loyaltyDetails} loyaltyInfoMap={loyaltyInfoMap} siteId={siteId} fetching={false}/></ThemeProvider>);
    expect(toJson(snapwrapper)).toMatchSnapshot();
  });

  it('should render without throwing an error', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('should render without throwing an error when loyaltyInfoDetails is not available', () => {
    const wrapper = mount(<ThemeProvider theme={theme}><LoyaltyCapture showMessage siteId={siteId} fetching={false}/></ThemeProvider>);
    expect(wrapper.exists()).toBe(true);
  });

});
