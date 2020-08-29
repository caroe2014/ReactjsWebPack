// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import React from 'react';
import { shallow, configure } from 'enzyme';
import toJson from 'enzyme-to-json';
import Adapter from 'enzyme-adapter-react-16';
import { ThemeProvider } from 'styled-components';
import theme from 'web/client/theme.js';
import Tile from '.';

configure({ adapter: new Adapter() });
/* global describe, it, expect, beforeEach */
/* eslint-disable max-len */
describe('Tile Component', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<Tile image='http://eatstreet.co.id/wp-content/uploads/2016/11/cropped-MASTER-FINAL_LOGO-OVAL-EAT-STREET-1.png'
      title='Eat Street' />
    );
  });

  it('does a snapshot test', () => {
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render without throwing an error', () => {
    expect(wrapper.exists()).toBe(true);
  });
  it('when image props received', () => {
    expect(wrapper.find('ImageContainer')).toHaveLength(1);
  });
  it('when image props not received', () => {
    wrapper = shallow(<Tile title='Eat Street' />);
    expect(wrapper.find('ImageContainer')).toHaveLength(0);
  });
  it('when childrens given render without error', () => {
    wrapper = shallow(<Tile title='Eat Street'><div>test</div></Tile>);
    expect(wrapper.find('ImageContainer')).toHaveLength(0);
  });
});
