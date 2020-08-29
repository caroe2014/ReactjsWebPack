// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import React from 'react';
import {
  shallow,
  configure
} from 'enzyme';
import toJson from 'enzyme-to-json';
import Adapter from 'enzyme-adapter-react-16';

import IncrementInput from './IncrementInput';
configure({
  adapter: new Adapter()
});

describe('IncrementInput', () => {

  it('does a snapshot test', () => {
    const wrapper = shallow(<IncrementInput/>);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render without throwing an error', () => {
    expect(shallow(<IncrementInput />).exists()).toBe(true);
  });
});
