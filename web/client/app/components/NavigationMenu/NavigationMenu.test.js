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
import configureMockStore from 'redux-mock-store';
// import NavigationMenu from './NavigationMenu';
import { BrowserRouter as Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

const mockStore = configureMockStore();
const store = mockStore({cartItems: [{count: 1}, {count: 2}]});
/* global describe, it, expect */
/* eslint-disable max-len */
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
  }
}));

jest.mock('react-i18next', () => ({
  Trans: 'div'
}));

const history = createMemoryHistory('/payments');

describe('NavigationMenu', () => {
  // should be removed once addressed unit test case
  it('dummy test case', () => {
    expect(true).toEqual(true);
  });

  // it('does a snapshot test', () => {
  //   const wrapper = shallow(<NavigationMenu location={{pathname: '/cart'}}/>);
  //   expect(toJson(wrapper)).toMatchSnapshot();
  // });

  // it('should render without throwing an error', () => {
  //   expect(shallow(<NavigationMenu location={{pathname: '/cart'}} />)
  //     .exists()).toBe(true);
  // });

  // it('should render without throwing an error on mount', () => {
  //   expect(mount(<Router><ThemeProvider theme={theme}><NavigationMenu location={{pathname: '/cart'}} /></ThemeProvider></Router>)
  //     .exists()).toBe(true);
  // });

  // it('Should not show the back link if it is inactive', () => {
  //   const wrapper = shallow(<NavigationMenu showBackLink={false} location={{pathname: '/cart'}}/>);
  //   var link = wrapper.find('BackLink');
  //   expect(link).toHaveLength(0);
  // });

  // it('Should not show the Home link if it is inactive', () => {
  //   const wrapper = shallow(<NavigationMenu showHomeLink={false} location={{pathname: '/cart'}}/>);
  //   var link = wrapper.find('HomeLink');
  //   expect(link).toHaveLength(0);
  // });

  // it('Should not show the cart link if it is inactive', () => {
  //   const wrapper = shallow(<NavigationMenu showCartLink={false} location={{pathname: '/cart'}}/>);
  //   var link = wrapper.find('CartLink');
  //   expect(link).toHaveLength(0);
  // });

  // it('Should show the back link if active', () => {
  //   var mockHistory = { goBack: () => {} };
  //   const wrapper = shallow(<NavigationMenu showBackLink history={mockHistory} location={{pathname: '/cart'}}/>);
  //   var link = wrapper.find('BackLink');
  //   expect(link).toBeDefined();
  // });

  // it('Should show the Home link if active', () => {
  //   var mockHistory = { goBack: () => {} };
  //   const wrapper = shallow(<NavigationMenu showHomeLink history={mockHistory} location={{pathname: '/cart'}}/>);
  //   var link = wrapper.find('HomeLink');
  //   expect(link).toBeDefined();
  // });

  // it('Should show the cart link if active', () => {
  //   var mockHistory = { goBack: () => {} };
  //   const wrapper = shallow(<NavigationMenu showCartLink history={mockHistory} location={{pathname: '/cart'}}/>);
  //   var link = wrapper.find('CartLink');
  //   expect(link).toBeDefined();
  // });

  // it('Should cart count match with badge icon count', () => {
  //   var mockHistory = { goBack: () => {} };
  //   let cartItems = [{count: 5}, {count: 2}];
  //   let count = cartItems.reduce((total, cart) => total + cart.count, 0);
  //   const wrapper = shallow(<NavigationMenu showCartLink history={mockHistory} location={{pathname: '/cart'}} cartItems={cartItems} />);
  //   var value = wrapper.find('CartBadge').props().children;
  //   expect(value).toBe(count);
  // });

  // describe('Show StyledNotifyTriangle', () => {
  //   var mockHistory = { goBack: () => {} };
  //   let cartItems = [{count: 5}, {count: 2}];

  //   it('Should show StyledNotifyTriangle when notifyCart is available', () => {
  //     const wrapper = shallow(<NavigationMenu showCartLink history={mockHistory} location={{pathname: '/cart'}} cartItems={cartItems} />);
  //     wrapper.setState({ notifyCart: true });
  //     wrapper.update();
  //     wrapper.instance().forceUpdate();
  //     expect(wrapper.find('.styled-notify-triangle').length).toBe(1);
  //   });

  //   it('Should show showSheduleLink when it is available on mount', () => {
  //     const wrapper = mount(<Router><ThemeProvider theme={theme}><NavigationMenu showCartLink history={mockHistory}
  //       showSheduleLink location={{pathname: '/cart'}} cartItems={cartItems} /></ThemeProvider></Router>);
  //     wrapper.setState({ notifyCart: true });
  //     wrapper.update();
  //     wrapper.instance().forceUpdate();
  //     expect(wrapper.exists()).toBe(true);
  //   });
  // });

  // describe('Show cart link container', () => {
  //   var mockHistory = { goBack: () => {} };
  //   let cartItems = [{count: 5}, {count: 2}];

  //   it('Should show cart link when it is available on mount', () => {
  //     const wrapper = mount(<Router><ThemeProvider theme={theme}><NavigationMenu showCartLink history={mockHistory}
  //       showSheduleLink location={{pathname: '/cart'}} isScheduleOrderEnabled cartOpen cartItems={cartItems} /></ThemeProvider></Router>);
  //     expect(wrapper.exists()).toBe(true);
  //   });

  //   it('Should show click link', () => {
  //     const wrapper = shallow(<NavigationMenu showCartLink history={mockHistory}
  //       showSheduleLink location={{pathname: '/cart'}} isScheduleOrderEnabled cartOpen cartItems={cartItems} />);
  //     expect(wrapper.exists()).toBe(true);
  //   });
  // });

  // describe('Logout link container', () => {
  //   var mockHistory = { goBack: () => {} };
  //   let cartItems = [{count: 5}, {count: 2}];

  //   it('Should show when enabled', () => {
  //     const wrapper = shallow(<NavigationMenu isScheduleOrderEnabled showCartLink cartOpen showLogOutLink history={mockHistory} location={{pathname: '/cart'}} cartItems={cartItems} />);
  //     expect(wrapper.find('.logout-link-container').length).toBe(1);
  //   });

  //   it('Should show when it is available on mount', () => {
  //     const wrapper = mount(<Router><ThemeProvider theme={theme}><NavigationMenu showLogOutLink showCartLink history={mockHistory}
  //       showSheduleLink location={{pathname: '/cart'}} isScheduleOrderEnabled cartOpen cartItems={cartItems} /></ThemeProvider></Router>);
  //     expect(wrapper.exists()).toBe(true);
  //   });
  // });

  // describe('menu link container', () => {
  //   var mockHistory = { goBack: () => {} };
  //   let cartItems = [{count: 5}, {count: 2}];
  //   it('Should show when menu is open', () => {
  //     const wrapper = shallow(<NavigationMenu isScheduleOrderEnabled showCartLink cartOpen showLogOutLink history={mockHistory} location={{pathname: '/cart'}} cartItems={cartItems} />);
  //     wrapper.setState({ menuOpen: true });
  //     wrapper.instance().forceUpdate();
  //     expect(wrapper.find('.menu-open').length).toBe(1);
  //   });
  // });

  // describe('home link', () => {
  //   let cartItems = [{count: 5}, {count: 2}];
  //   let location = {
  //     pathname: '/tip'
  //   };
  //   it('Should call redirectHome when home is selected', () => {
  //     let mockFn = jest.fn();
  //     const wrapper = shallow(<NavigationMenu location={location} setHideScheduleTime={mockFn} showHomeLink isScheduleOrderEnabled showCartLink cartOpen showLogOutLink history={history} cartItems={cartItems} />);
  //     const spy = jest.spyOn(wrapper.instance(), 'redirectHome');
  //     wrapper.find('.home-button-link').simulate('click');
  //     spy.mockClear();
  //   });
  // });

  // describe('call instance methods', () => {
  //   let cartItems = [{count: 5}, {count: 2}];
  //   let location = {
  //     pathname: '/tip'
  //   };
  //   let cboConfig = {
  //     theme: {
  //       logoImage: 'someImage.png'
  //     }
  //   };
  //   it('Should call loadImage when componentDidUpdate is triggered', () => {
  //     const wrapper = shallow(<NavigationMenu location={location} showHomeLink isScheduleOrderEnabled showCartLink cartOpen showLogOutLink history={history} cartItems={cartItems} />);
  //     const spy = jest.spyOn(wrapper.instance(), 'loadImage');
  //     wrapper.instance().forceUpdate();
  //     wrapper.setProps({ cboConfig: cboConfig });
  //     wrapper.setState({ isLogoDisplay: false });
  //     expect(spy).toHaveBeenCalled();
  //     spy.mockClear();
  //   });

  //   it('Should call loadImage when redirectNavLinkHome is triggered', () => {
  //     let mockFn = jest.fn();
  //     const wrapper = shallow(<NavigationMenu location={location} setHideScheduleTime={mockFn} showHomeLink isScheduleOrderEnabled showCartLink cartOpen showLogOutLink history={history} cartItems={cartItems} />);
  //     const spy = jest.spyOn(wrapper.instance(), 'redirectNavLinkHome');
  //     wrapper.instance().forceUpdate();
  //     wrapper.find('.mobile-logo').simulate('click');
  //     expect(spy).toHaveBeenCalled();
  //     spy.mockClear();
  //   });

  //   it('Should call toggleCart when CartLink is triggered', () => {
  //     location = {};
  //     let mockFn = jest.fn();
  //     const wrapper = shallow(<NavigationMenu location={location} toggleCart={mockFn} setHideScheduleTime={mockFn} showHomeLink isScheduleOrderEnabled showCartLink cartOpen showLogOutLink history={history} cartItems={cartItems} />);
  //     const spy = jest.spyOn(wrapper.instance(), 'toggleCart');
  //     wrapper.instance().forceUpdate();
  //     wrapper.find('.CartLink').simulate('click');
  //     expect(spy).toHaveBeenCalled();
  //     spy.mockClear();
  //   });

  //   it('Should call toggleCart when CartLink is triggered', () => {
  //     location = {};
  //     let mockFn = jest.fn();
  //     const wrapper = shallow(<NavigationMenu location={location} toggleCart={mockFn} showHomeLink isScheduleOrderEnabled showCartLink cartOpen showLogOutLink history={history} cartItems={cartItems} />);
  //     const spy = jest.spyOn(wrapper.instance(), 'toggleCart');
  //     wrapper.instance().forceUpdate();
  //     wrapper.find('.cart-open').simulate('click');
  //     expect(spy).toHaveBeenCalled();
  //     spy.mockClear();
  //   });

  //   it('Should call toggleCart when CartLink is triggered', () => {
  //     location = {};
  //     let mockFn = jest.fn();
  //     const wrapper = shallow(<NavigationMenu location={location} toggleCart={mockFn} showHomeLink isScheduleOrderEnabled showCartLink cartOpen showLogOutLink history={history} cartItems={cartItems} />);
  //     const spy = jest.spyOn(wrapper.instance(), 'toggleCart');
  //     wrapper.instance().forceUpdate();
  //     wrapper.find('.cart-close-button').simulate('click');
  //     expect(spy).toHaveBeenCalled();
  //     spy.mockClear();
  //   });

  //   it('Should call history when logout link is triggered', () => {
  //     location = {};
  //     let mockFn = jest.fn();
  //     const wrapper = mount(<Router><ThemeProvider theme={theme}>
  //       <NavigationMenu location={location} toggleCart={mockFn} setHideScheduleTooltip={mockFn} showHomeLink isScheduleOrderEnabled
  //         showCartLink cartOpen showLogOutLink history={history} cartItems={cartItems} />
  //     </ThemeProvider></Router>);
  //     expect(wrapper.exists()).toBe(true);
  //   });

  //   it('Should call redirectConcept when Concepticon is clicked', () => {
  //     location = {};
  //     let mockFn = jest.fn();
  //     const wrapper = shallow(<NavigationMenu location={location} toggleCart={mockFn} setHideScheduleTime={mockFn} showHomeLink isScheduleOrderEnabled showCartLink cartOpen showLogOutLink history={history} cartItems={cartItems} />);
  //     const spy = jest.spyOn(wrapper.instance(), 'redirectConcept');
  //     wrapper.instance().forceUpdate();
  //     wrapper.find('.conceptID').simulate('click');
  //     expect(spy).toHaveBeenCalled();
  //     spy.mockClear();
  //   });

  //   it('Should call redirectConcept when Concepticon is clicked', () => {
  //     location = {};
  //     let mockFn = jest.fn();
  //     const wrapper = shallow(<NavigationMenu location={location} toggleCart={mockFn} selectedId={-1} setHideScheduleTime={mockFn} showHomeLink isScheduleOrderEnabled showCartLink cartOpen showLogOutLink history={history} cartItems={cartItems} />);
  //     const spy = jest.spyOn(wrapper.instance(), 'redirectConcept');
  //     wrapper.instance().forceUpdate();
  //     wrapper.find('.conceptID').simulate('click');
  //     expect(spy).toHaveBeenCalled();
  //     spy.mockClear();
  //   });

  // });

});
