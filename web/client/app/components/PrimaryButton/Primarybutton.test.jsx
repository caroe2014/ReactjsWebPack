import React from 'react';
import {
  mount,
  configure
} from 'enzyme';
import toJson from 'enzyme-to-json';
import Adapter from 'enzyme-adapter-react-16';
import 'jest-styled-components';
import theme from 'web/client/theme';

import PrimaryButton from '.';

configure({
  adapter: new Adapter()
});

describe('PrimaryButton', () => {

  it('does a snapshot test', () => {
    const wrapper = mount(<PrimaryButton classContext='test'  theme={theme} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render without throwing an error', () => {
    expect(mount(<PrimaryButton classContext='test'  theme={theme} />).exists()).toBe(true);
  });
});
