import React from 'react';
import {
  mount,
  shallow,
  configure
} from 'enzyme';
import toJson from 'enzyme-to-json';
import Adapter from 'enzyme-adapter-react-16';
import 'jest-styled-components';
import theme from 'web/client/theme';
import { ThemeProvider } from 'styled-components';

import AddItem from '.';
configure({
  adapter: new Adapter()
});

describe('IconButton', () => {

  it('does a snapshot test', () => {
    const wrapper = mount(<ThemeProvider theme={theme}><AddItem theme={theme} min={1}/></ThemeProvider>);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render without throwing an error', () => {
    expect(mount(<ThemeProvider theme={theme}><AddItem theme={theme} min={1}/></ThemeProvider>).exists()).toBe(true);
  });

  it('should call doDecrement with spy', () => {
    let wrapper = shallow(<AddItem theme={theme} min={1}/>);
    const spy = jest.spyOn(wrapper.instance(), 'doDecrement');
    wrapper.instance().forceUpdate();
    wrapper.find('.decrement-button').simulate('click');
    expect(spy).toHaveBeenCalled();
    spy.mockClear();
  });

  it('should call doDecrement with spy with value set', () => {
    let wrapper = shallow(<AddItem theme={theme} min={1}/>);
    wrapper.setState({ value: 3 });
    const spy = jest.spyOn(wrapper.instance(), 'doDecrement');
    wrapper.instance().forceUpdate();
    wrapper.find('.decrement-button').simulate('click');
    expect(spy).toHaveBeenCalled();
    spy.mockClear();
  });

  it('should call doIncrement with spy', () => {
    let wrapper = shallow(<AddItem theme={theme} max={10}/>);
    const spy = jest.spyOn(wrapper.instance(), 'doIncrement');
    wrapper.instance().forceUpdate();
    wrapper.find('.increment-button').simulate('click');
    expect(spy).toHaveBeenCalled();
    spy.mockClear();
  });

  it('should call doIncrement with spy with value set', () => {
    let wrapper = shallow(<AddItem theme={theme} max={5}/>);
    wrapper.setState({ value: 10 });
    const spy = jest.spyOn(wrapper.instance(), 'doIncrement');
    wrapper.instance().forceUpdate();
    wrapper.find('.increment-button').simulate('click');
    expect(spy).toHaveBeenCalled();
    spy.mockClear();
  });
});
