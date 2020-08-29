import React from 'react';
import {
  mount,
  configure
} from 'enzyme';
import toJson from 'enzyme-to-json';
import 'jest-styled-components';
import Adapter from 'enzyme-adapter-react-16';
import {
  ThemeProvider
} from 'styled-components';
import theme from 'web/client/theme';
import Loading from './loading';

configure({
  adapter: new Adapter()
});

describe('Loading', () => {

  it('does a snapshot test', () => {
    const wrapper = mount(<ThemeProvider theme={theme}><Loading /></ThemeProvider>);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render without throwing an error', () => {
    expect(mount(<ThemeProvider theme={theme}><Loading /></ThemeProvider>).exists()).toBe(true);
  });

});
