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

import CartNotification from '.';
configure({
  adapter: new Adapter()
});

jest.mock('web/client/i18n', () => ({
  t: (key) => {
    return key;
  }
}));

jest.mock('i18next');
t.mockImplementation((key) => {
  return key;
});

jest.mock('react-i18next', () => ({
  Trans: 'div'
}));


describe('CartNotification', () => {

  it('does a snapshot test', () => {
    const wrapper = shallow(<CartNotification/>);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render without throwing an error', () => {
    expect(shallow(<CartNotification />).exists()).toBe(true);
  });

  
  it('should render without throwing an error ob mount', () => {
    const mountWrapper = mount(
      <ThemeProvider theme={theme}>
        <CartNotification lastItemAdded/>
      </ThemeProvider>
    );
    expect(mountWrapper.exists()).toBe(true);
  });

  it('should call handleClose with spy', () => {
    let mockFn = jest.fn();
    let wrapper = shallow(<CartNotification lastItemAdded closeCart={mockFn} toggleCart={mockFn}/>);
    const spy = jest.spyOn(wrapper.instance(), 'handleClose');
    wrapper.instance().forceUpdate();
    wrapper.find('.view-cart-button').simulate('click');
    expect(spy).toHaveBeenCalled();
    spy.mockClear();
  });

  it('should call handleDelete with spy', () => {
    let lastItemAdded={
      uniqueId: 1001
    };
    let items=[
      {
        uniqueId: 1001
      }
    ];
    let mockFn = jest.fn();
    let wrapper = shallow(<CartNotification lastItemAdded closeCart={mockFn} items={items} lastItemAdded={lastItemAdded} closeCartNotification={mockFn} removeItem={mockFn}/>);
    const spy = jest.spyOn(wrapper.instance(), 'handleDelete');
    wrapper.instance().forceUpdate();
    wrapper.find('.undo-button').simulate('click');
    expect(spy).toHaveBeenCalled();
    spy.mockClear();
  });

  it('should call handleDelete with spy', () => {
    let lastItemAdded={
      uniqueId: 1001
    };
    let items=[
      {
        uniqueId: 1001
      }
    ];
    let mockFn = jest.fn();
    let wrapper = shallow(<CartNotification lastItemAdded closeCart={mockFn} fillContent lastItemAdded={lastItemAdded} closeCartNotification={mockFn} removeItem={mockFn}/>);
    const spy = jest.spyOn(wrapper.instance(), 'handleDelete');
    wrapper.instance().forceUpdate();
    wrapper.find('.undo-button').simulate('click');
    expect(spy).toHaveBeenCalled();
    spy.mockClear();
  });


});
