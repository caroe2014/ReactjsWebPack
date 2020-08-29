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
import axios from 'axios';

import DynamicImage from '.';
configure({
  adapter: new Adapter()
});

jest.mock('axios');

describe('DynamicImage', () => {

  it('does a snapshot test', () => {
    const wrapper = mount(<ThemeProvider theme={theme}><DynamicImage theme={theme} min={1}/></ThemeProvider>);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render without throwing an error', () => {
    const getSpy = jest.spyOn(axios, 'get');
    expect(mount(<ThemeProvider theme={theme}><DynamicImage theme={theme} bgSize={'contain'} src='testURL' min={1}/></ThemeProvider>).exists()).toBe(true);
    expect(getSpy).toBeCalled();
  });

});
