import React from 'react';
import {
  mount,
  configure
} from 'enzyme';
import toJson from 'enzyme-to-json';
import Adapter from 'enzyme-adapter-react-16';
import 'jest-styled-components';
import theme from 'web/client/theme';

import IconButton from '.';
configure({
  adapter: new Adapter()
});

describe('IconButton', () => {

  it('does a snapshot test', () => {
    const wrapper = mount(<IconButton classContext='test' theme={theme} iconClassName='test-name' />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render without throwing an error', () => {
    expect(mount(<IconButton classContext='test' theme={theme} iconClassName='test-name' />).exists()).toBe(true);
  });
});
