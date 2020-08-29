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
import 'jest-styled-components';

import ArrowHorizontalScroll from '.';
/* global describe, it, expect */
configure({
  adapter: new Adapter()
});

describe('ArrowHorizontalScroll', () => {

  it('does a snapshot test', () => {
    const wrapper = mount(<ThemeProvider theme={theme}><ArrowHorizontalScroll/></ThemeProvider>);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render without throwing an error', () => {
    expect(shallow(<ArrowHorizontalScroll />).exists()).toBe(true);
  });

  it('renders right and left Arrows style rule', () => {
    let wrapper = shallow(<ArrowHorizontalScroll />);
    wrapper.setState({ rightArrowVisible: true, leftArrowVisible: true });
    wrapper.update();
    expect(wrapper.find('.scroll-arrow-left')).toHaveStyleRule('visibility', 'visible');
    expect(wrapper.find('.scroll-arrow-right')).toHaveStyleRule('visibility', 'visible');
  });

  it('click on scroll arrows', () => {
    let wrapper = mount(<ThemeProvider theme={theme}><ArrowHorizontalScroll /></ThemeProvider>);
    wrapper.find('.scroll-arrow-left').first().simulate('click');
    wrapper.find('.scroll-arrow-right').first().simulate('click');
    wrapper.find('.scroll-content').first().simulate('scroll');
    expect(wrapper.exists()).toBe(true);
  });

  it('should call  onScroll with mock', () => {
    let wrapper = shallow(<ArrowHorizontalScroll />);
    let mockFn = jest.fn();
    wrapper.instance().onScroll = mockFn;
    wrapper.instance().forceUpdate();
    wrapper.update();
    wrapper.find('.scroll-arrow-left').simulate('click');
    wrapper.find('.scroll-arrow-right').simulate('click');
    expect(mockFn).toHaveBeenCalledTimes(2);
  });

  it('should call  onContentScroll  with mock', () => {
    let wrapper = shallow(<ArrowHorizontalScroll />);
    let mockFn = jest.fn();
    wrapper.instance().onContentScroll = mockFn;
    wrapper.instance().forceUpdate();
    wrapper.update();
    wrapper.find('.scroll-content').simulate('scroll');
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('testing component did mount ref', () => {
    const myComponent = shallow(<ArrowHorizontalScroll/>, { disableLifecycleMethods: true });
    myComponent.instance().modifierTab = {
      scrollWidth: 100,
      offsetWidth: 2
    };
    myComponent.instance().componentDidMount();
  });

  it('testing component did mount ref', () => {
    const myComponent = shallow(<ArrowHorizontalScroll/>);
    myComponent.instance().modifierTab = {
      scrollWidth: 100,
      offsetWidth: 2
    };
    myComponent.instance().scrollInterval(10, 100, 1);
  });
});
