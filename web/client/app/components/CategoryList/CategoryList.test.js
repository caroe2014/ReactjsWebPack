// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import React from 'react';
import { shallow, mount, configure } from 'enzyme';
import toJson from 'enzyme-to-json';
import Adapter from 'enzyme-adapter-react-16';
import { ThemeProvider } from 'styled-components';
import theme from 'web/client/theme.js';
import CategoryList from '.';
import { t } from 'i18next';

configure({ adapter: new Adapter() });

jest.mock('web/client/i18n', () => ({
  t: (key) => {
    return key;
  }
}));

jest.mock('i18next');
t.mockImplementation((key) => {
  return key;
});

jest.mock('react-i18next', () => ({
  Trans: 'div'
}));

describe('CategoryList', () => {

  let wrapper;
  let mockProps = [
    {
      image: 'https://thumbs.dreamstime.com/b/sandwich-plate-28397223.jpg',
      id: '101',
      name: 'Build Your Own Sandwich'
    },
    {
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSaoN_zozVlVN4k6jJlaQOAcr1UbBFA7IJIvxXHjQ5x7o58H-zW6w', // eslint-disable-line max-len
      id: '102',
      name: 'Specials'
    },
    {
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSE4FJOwC6UooDbfKebGZngjvGCC4YQn3XDDrJF-LAJ2hRbv-8V_A', // eslint-disable-line max-len
      id: '103',
      name: 'Sides'
    }
  ];

  beforeEach(() => {
    wrapper = shallow(<CategoryList keyProps={mockProps} />
    );
  });

  it('does a snapshot test', () => {
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render without throwing an error', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('should render without throwing an error ob mount', () => {
    const mountWrapper = mount(
      <ThemeProvider theme={theme}>
        <CategoryList keyProps={mockProps}/>
      </ThemeProvider>
    );
    expect(mountWrapper.exists()).toBe(true);
  });

  describe('when Item props are received', () => {
    it('should render the same number of tiles', () => {
      expect(wrapper.find('.tile').length).toBe(mockProps.length);
    });
  });

  describe('when Item props are not received', () => {
    beforeEach(() => {
      mockProps = [];
    });
    it('should not render CategoryList', () => {
      const itemWrapper = shallow(<CategoryList keyProps={mockProps} />);
      expect(itemWrapper.find('.tile').length).toBe(0);
    });
  });

});
