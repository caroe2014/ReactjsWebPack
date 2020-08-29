import React from 'react';
import { shallow, mount, configure } from 'enzyme';
import toJson from 'enzyme-to-json';
import Adapter from 'enzyme-adapter-react-16';
import { ThemeProvider } from 'styled-components';
import theme from 'web/client/theme.js';
import i18n from 'i18next';
import LoyaltyProcess from '.';
import jsdom from 'jsdom';

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

describe('LoyaltyProcess', () => {
  let mockFn = jest.fn();
  let wrapper;
  let loyaltyProcess = {
    accrueError: true,
    loyaltyLinkedAccounts: [
      {
        accountNumber: '111'
      }
    ]
  };
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
  let cartLoyaltyInfo = {
    inquiryId: 1001
  };
  beforeEach(() => {
    wrapper = shallow(<LoyaltyProcess
      cartLoyaltyInfo={cartLoyaltyInfo}
      loyaltyProcess={loyaltyProcess}
      loyaltyDetails={loyaltyDetails}
      loyaltyInfoMap={loyaltyInfoMap}
      siteId={siteId}
      fetching={false}
      showAccount
      cancelLoyalty={false}/>);
  });

  it('does a snapshot test', () => {
    const snapwrapper = mount(<ThemeProvider theme={theme}>
      <LoyaltyProcess
        cartLoyaltyInfo={cartLoyaltyInfo}
        inquiryError={'someError'}
        loyaltyProcess={loyaltyProcess}
        loyaltyDetails={loyaltyDetails}
        loyaltyInfoMap={loyaltyInfoMap}
        siteId={siteId}
        fetching={false}
        showAccount
        cancelLoyalty={false}/>
    </ThemeProvider>);
    expect(toJson(snapwrapper)).toMatchSnapshot();
  });

  it('should render without throwing an error', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('should render without throwing an error when cartLoyaltyInfo is unavailable and inquiryError is present', () => {
    const newWrapper = shallow(<LoyaltyProcess
      cartLoyaltyInfo
      inquiryError={'someError'}
      disableLoyalty={mockFn}
      loyaltyProcess={loyaltyProcess}
      loyaltyDetails={loyaltyDetails}
      loyaltyInfoMap={loyaltyInfoMap}
      siteId={siteId}
      fetching={false}
      showAccount
      cancelLoyalty={false}/>);
    expect(newWrapper.exists()).toBe(true);
  });

  it('should call onRetry when retry is clicked on inquiryError', () => {
    const newWrapper = shallow(<LoyaltyProcess
      cartLoyaltyInfo
      inquiryError={'someError'}
      sendLoyaltyInquiry={mockFn}
      sendLoyaltyInfo={mockFn}
      disableLoyalty={mockFn}
      loyaltyProcess={loyaltyProcess}
      loyaltyDetails={loyaltyDetails}
      loyaltyInfoMap={loyaltyInfoMap}
      siteId={siteId}
      fetching={false}
      showAccount
      cancelLoyalty={false}/>);

    const spy = jest.spyOn(newWrapper.instance(), 'onReEnterClick');
    newWrapper.instance().forceUpdate();
    newWrapper.find('.re-enter-button').simulate('click');
    expect(spy).toHaveBeenCalled();
    spy.mockClear();
  });

  // it('should call onRetry when retry is clicked on error', () => {
  //   const newWrapper = shallow(<LoyaltyProcess
  //     cartLoyaltyInfo
  //     error={'someError'}
  //     sendLoyaltyInquiry={mockFn}
  //     sendLoyaltyInfo={mockFn}
  //     loyaltyProcess={loyaltyProcess}
  //     loyaltyDetails={loyaltyDetails}
  //     loyaltyInfoMap={loyaltyInfoMap}
  //     siteId={siteId}
  //     fetching={false}
  //     showAccount
  //     cancelLoyalty={false}/>);

  //   const spy = jest.spyOn(newWrapper.instance(), 'onRetry');
  //   newWrapper.instance().forceUpdate();
  //   newWrapper.find('.re-enter-button').simulate('click');
  //   expect(spy).toHaveBeenCalled();
  //   spy.mockClear();
  // });

  it('should render without throwing an error when cancelLoyalty is true', () => {
    loyaltyProcess.processAccrue = true;
    const newWrapper = shallow(<LoyaltyProcess
      cartLoyaltyInfo
      loyaltyProcess={loyaltyProcess}
      disableLoyalty={mockFn}
      loyaltyDetails={loyaltyDetails}
      loyaltyInfoMap={loyaltyInfoMap}
      siteId={siteId}
      fetching={false}
      showAccount
      cancelLoyalty/>);
    expect(newWrapper.exists()).toBe(true);
  });

  describe('LoyaltyProcess with props loyaltyProcess', () => {
    let newLoyaltyProcess = {
      showAccountSelection: true,
      loyaltyLinkedAccounts: []
    };
    it('should render without throwing an error', () => {
      const newWrapper = shallow(<LoyaltyProcess
        cartLoyaltyInfo={cartLoyaltyInfo}
        loyaltyProcess={newLoyaltyProcess}
        disableLoyalty={mockFn}
        loyaltyDetails={loyaltyDetails}
        loyaltyInfoMap={loyaltyInfoMap}
        siteId={siteId}
        fetching={false}
        showAccount
        cancelLoyalty={false}/>);
      expect(newWrapper.exists()).toBe(true);
    });

    it('should render without throwing an error when one loyaltyLinkedAccounts is available', () => {
      newLoyaltyProcess.loyaltyLinkedAccounts = [
        {
          accountNumber: '111'
        }
      ];
      const newWrapper = shallow(<LoyaltyProcess
        cartLoyaltyInfo={cartLoyaltyInfo}
        loyaltyProcess={newLoyaltyProcess}
        disableLoyalty={mockFn}
        loyaltyDetails={loyaltyDetails}
        loyaltyInfoMap={loyaltyInfoMap}
        siteId={siteId}
        fetching={false}
        showAccount
        cancelLoyalty={false}/>);
      expect(newWrapper.exists()).toBe(true);
    });

    it('should render without throwing an error when multiple loyaltyLinkedAccounts are available', () => {
      newLoyaltyProcess.loyaltyLinkedAccounts = [
        {
          accountNumber: '111'
        },
        {
          accountNumber: '112'
        }
      ];
      const newWrapper = shallow(<LoyaltyProcess
        cartLoyaltyInfo={cartLoyaltyInfo}
        loyaltyProcess={newLoyaltyProcess}
        loyaltyDetails={loyaltyDetails}
        disableLoyalty={mockFn}
        loyaltyInfoMap={loyaltyInfoMap}
        siteId={siteId}
        fetching={false}
        showAccount
        cancelLoyalty={false}/>);
      expect(newWrapper.exists()).toBe(true);
    });

    it('should render without throwing an error when Points are already Accrued', () => {
      let newLoyaltyProcess = {
        showAccountSelection: false,
        loyaltyLinkedAccounts: [
          {
            accountNumber: '111'
          },
          {
            accountNumber: '112'
          }
        ],
        isPointAccrued: true
      };
      const newWrapper = shallow(<LoyaltyProcess
        cartLoyaltyInfo={cartLoyaltyInfo}
        loyaltyProcess={newLoyaltyProcess}
        loyaltyDetails={loyaltyDetails}
        disableLoyalty={mockFn}
        loyaltyInfoMap={loyaltyInfoMap}
        siteId={siteId}
        fetching={false}
        showAccount
        cancelLoyalty={false}/>);
      expect(newWrapper.exists()).toBe(true);
    });

    it('should render without throwing an error when cartloyaltyinfo is not present', () => {
      let newLoyaltyProcess = {
        showAccountSelection: false,
        loyaltyLinkedAccounts: [
          {
            accountNumber: '111'
          },
          {
            accountNumber: '112'
          }
        ],
        isPointAccrued: true
      };
      const newWrapper = shallow(<LoyaltyProcess
        loyaltyProcess={newLoyaltyProcess}
        loyaltyDetails={loyaltyDetails}
        loyaltyInfoMap={loyaltyInfoMap}
        disableLoyalty={mockFn}
        siteId={siteId}
        fetching={false}
        showAccount
        cancelLoyalty={false}/>);
      expect(newWrapper.exists()).toBe(true);
    });

  });
});
