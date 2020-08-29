
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
import SecondaryButton from '.';
import { t } from 'i18next';

configure({
  adapter: new Adapter()
});

jest.mock('i18next');
t.mockImplementation((key) => {
  return key;
});

jest.mock('react-i18next', () => ({
  Trans: 'div'
}));

describe('SecondaryButton', () => {
  it('does a snapshot test', () => {
    const wrapper = mount(<ThemeProvider theme={theme}><SecondaryButton /></ThemeProvider>);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render without throwing an error', () => {
    expect(mount(<ThemeProvider theme={theme}><SecondaryButton /></ThemeProvider>).exists()).toBe(true);
  });
});
