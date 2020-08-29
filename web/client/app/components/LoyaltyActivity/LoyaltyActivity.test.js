import React from 'react';
import { shallow, mount, configure } from 'enzyme';
import toJson from 'enzyme-to-json';
import Adapter from 'enzyme-adapter-react-16';
import { ThemeProvider } from 'styled-components';
import theme from 'web/client/theme.js';
import i18n from 'i18next';
import LoyaltyActivity from '.';
import jsdom from 'jsdom';
import { createMemoryHistory } from 'history';

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

describe('LoyaltyActivity', () => {

  let wrapper;
  let loyaltyDetailsAccounts = [
    {
      'id': 'phone',
      'enabled': true
    },
    {
      'id': 'card',
      'enabled': true
    },
    {
      'id': 'account',
      'enabled': false
    }
  ];
  let fetching = false;
  const history = createMemoryHistory('/payments');
  let list = [{id: 1001, isLoyaltyEnabled: true}];

  beforeEach(() => {
    wrapper = shallow(<LoyaltyActivity loyaltyDetailsAccounts={loyaltyDetailsAccounts} fetching={false} history={history}/>);
  });

  it('does a snapshot test', () => {
    const snapwrapper = mount(<ThemeProvider theme={theme}><LoyaltyActivity loyaltyDetailsAccounts={loyaltyDetailsAccounts} fetching={false}/></ThemeProvider>);
    expect(toJson(snapwrapper)).toMatchSnapshot();
  });

  it('should render without throwing an error', () => {
    expect(wrapper.exists()).toBe(true);
  });

  // describe('when fetching is true', () => {
  //   it('should render without throwing an error', () => {
  //     const fetchWrapper = shallow(<LoyaltyActivity loyaltyDetailsAccounts={loyaltyDetailsAccounts} fetching history={history}/>);
  //     expect(fetchWrapper.exists()).toBe(true);
  //   });
  //   it('should trigger onCancel when cancel button is clicked', () => {
  //     let mockFn = jest.fn();
  //     const fetchWrapper = shallow(<LoyaltyActivity loyaltyDetailsAccounts={loyaltyDetailsAccounts} cancelLoyaltyInfo={mockFn} fetching history={history}/>);
  //     const spy = jest.spyOn(fetchWrapper.instance(), 'onCancel');
  //     fetchWrapper.instance().forceUpdate();
  //     fetchWrapper.find('.submit-button').simulate('click');
  //     expect(spy).toHaveBeenCalled();
  //     spy.mockClear();
  //   });
  // });

  // describe('when fetching is false', () => {
  //   let mockFn = jest.fn();
  //   it('should trigger onSubmit when Submit button is clicked', () => {
  //     const fetchWrapper = shallow(<LoyaltyActivity loyaltyDetailsAccounts={loyaltyDetailsAccounts} handleLoyaltyInfo={mockFn} fetching={false} history={history}/>);
  //     const spy = jest.spyOn(fetchWrapper.instance(), 'onSubmit');
  //     fetchWrapper.instance().forceUpdate();
  //     fetchWrapper.find('.submit-button').simulate('click');
  //     expect(spy).toHaveBeenCalled();
  //     spy.mockClear();
  //   });
  //   it('should trigger onSubmit when Submit button is clicked ', () => {
  //     const fetchWrapper = shallow(<LoyaltyActivity loyaltyDetailsAccounts={loyaltyDetailsAccounts} handleLoyaltyInfo={mockFn} fetching={false} history={history}/>);
  //     const spy = jest.spyOn(fetchWrapper.instance(), 'onSubmit');
  //     fetchWrapper.setState({ formatNumber: '9876527282', selectedOption: 'phone' });
  //     fetchWrapper.instance().forceUpdate();
  //     fetchWrapper.update();
  //     fetchWrapper.find('.submit-button').simulate('click');
  //     expect(spy).toHaveBeenCalled();
  //     spy.mockClear();
  //   });
  // });

  it('should render without throwing an error when loyaltyDetailsAccounts is not available', () => {
    const fetchWrapper = shallow(<LoyaltyActivity fetching loyaltyDetailsAccounts={loyaltyDetailsAccounts} history={history}/>);
    expect(fetchWrapper.exists()).toBe(true);
  });

  it('should render without throwing an error when loyaltyInfoMap  is  available', () => {
    const loyaltyInfoMap = {
      1001: {
        test: 'test',
        loyaltyInfo: {
          test: 'test',
          selectedOption: 'phone'
        }
      }
    };
    const fetchWrapper = shallow(
      <LoyaltyActivity
        fetching
        loyaltyDetailsAccounts={loyaltyDetailsAccounts}
        loyaltyInfoMap={loyaltyInfoMap}
        siteId={1001}
        history={history}/>
    );
    expect(fetchWrapper.exists()).toBe(true);
  });

  // it('should render only one option with default enabled', () => {
  //   let loyaltyDetailsAccounts = [
  //     {
  //       'id': 'phone',
  //       'enabled': true
  //     },
  //     {
  //       'id': 'card',
  //       'enabled': false
  //     },
  //     {
  //       'id': 'account',
  //       'enabled': false
  //     }
  //   ];
  //   const newWrapper = shallow(<LoyaltyActivity loyaltyDetailsAccounts={loyaltyDetailsAccounts} fetching={false} history={history}/>);
  //   // const newWrapper = mount(<ThemeProvider theme={theme}><LoyaltyActivity loyaltyDetailsAccounts={loyaltyDetailsAccounts} fetching={false}/></ThemeProvider>);
  //   expect(newWrapper.find('.option_desc').length).toBe(1);
  // });

  it('should render only one option with default enabled', () => {
    let loyaltyDetailsAccounts = [
      {
        'id': 'phone',
        'enabled': true
      },
      {
        'id': 'card',
        'enabled': false
      },
      {
        'id': 'account',
        'enabled': false
      }
    ];
    const newWrapper = mount(<ThemeProvider theme={theme}><LoyaltyActivity loyaltyDetailsAccounts={loyaltyDetailsAccounts} fetching={false}/></ThemeProvider>);
    expect(newWrapper.exists()).toBe(true);
  });

});
