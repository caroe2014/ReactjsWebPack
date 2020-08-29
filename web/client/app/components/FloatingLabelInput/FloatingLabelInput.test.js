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

import FloatingLabelInput from '.';
configure({
  adapter: new Adapter()
});

describe('FloatingLabelInput', () => {

  let callback = jest.fn();

  it('does a snapshot test', () => {
    const wrapper = mount(<ThemeProvider theme={theme}><FloatingLabelInput value='test'/></ThemeProvider>);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render without throwing an error', () => {
    expect(mount(<ThemeProvider theme={theme}><FloatingLabelInput placeHolder='test' value='test'/></ThemeProvider>).exists()).toBe(true);
  });

  it('should render InputLabel with normal font', () => {
    expect(mount(<ThemeProvider theme={theme}><FloatingLabelInput value='' label={'testLabel'} clearIcon callBack={callback} propertyName={'testProperty'}/></ThemeProvider>).exists()).toBe(true);
  });

  it('should render InputLabel with normal font', () => {
    expect(mount(<ThemeProvider theme={theme}><FloatingLabelInput value='' placeHolder='test' label={'testLabel'} clearIcon callBack={callback} propertyName={'testProperty'}/></ThemeProvider>).exists()).toBe(true);
  });

  it('should call  onClearInput with mock', () => {
    let wrapper = shallow(<FloatingLabelInput value='test' label={'testLabel'} clearIcon callBack={callback} propertyName={'testProperty'}/>);
    let mockFn = jest.fn();
    wrapper.instance().onClearInput = mockFn;
    wrapper.instance().forceUpdate();
    wrapper.update();
    wrapper.find('.clear-value').simulate('click');
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('should call onClearInput with spy', () => {
    const callback = jest.fn();
    let wrapper = shallow(<FloatingLabelInput value='' placeHolder='test' label={'testLabel'} clearIcon callBack={callback} propertyName={'testProperty'}/>);
    const spy = jest.spyOn(wrapper.instance(), 'onClearInput');
    wrapper.instance().forceUpdate();
    wrapper.find('.clear-value').simulate('click');
    expect(spy).toHaveBeenCalled();
    spy.mockClear();
  });

  it('should call handleChange when InputText is entered', () => {
    const callback = jest.fn();
    let wrapper = shallow(<FloatingLabelInput value='' placeHolder='test' label={'testLabel'} clearIcon callBack={callback} propertyName={'testProperty'}/>);
    const spy = jest.spyOn(wrapper.instance(), 'handleChange');
    wrapper.instance().forceUpdate();
    wrapper.find('.input-text').simulate('focus');
    wrapper.find('.input-text').simulate('change', { target: { value: 'tests' } });
    expect(spy).toHaveBeenCalled();
    spy.mockClear();
  });

  it('should call handleChange when InputText is entered when regex is present', () => {
    const callback = jest.fn();
    let wrapper = shallow(<FloatingLabelInput value='' placeHolder='test' label={'testLabel'} validationRegEx={'someRegex'} clearIcon callBack={callback} propertyName={'testProperty'}/>);
    const spy = jest.spyOn(wrapper.instance(), 'handleChange');
    wrapper.instance().forceUpdate();
    wrapper.find('.input-text').simulate('focus');
    wrapper.find('.input-text').simulate('change', { target: { value: 'tests' } });
    expect(spy).toHaveBeenCalled();
    spy.mockClear();
  });

});
