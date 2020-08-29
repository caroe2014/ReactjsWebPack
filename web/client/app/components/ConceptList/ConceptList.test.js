// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import React from 'react';
import { shallow, mount, configure } from 'enzyme';
import toJson from 'enzyme-to-json';
import Adapter from 'enzyme-adapter-react-16';
import ConceptList from '.';
import { ThemeProvider } from 'styled-components';
import theme from 'web/client/theme.js';

configure({ adapter: new Adapter() });

jest.mock('web/client/i18n', () => ({
  t: (key) => {
    return key;
  }
}));
jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate HoC receive the t function as a prop
  withTranslation: () => Component => {
    Component.defaultProps = { ...Component.defaultProps, t: (key) => key };
    return Component;
  },
}));

jest.mock('react-i18next', () => ({
  Trans: 'div'
}));

describe('ConceptList', () => {

  let wrapper;
  let mockProps = [
    {
      image: 'https://www.freeiconspng.com/uploads/environment-icon-png-16.png',
      id: '101',
      name: 'Pickle',
      availableNow: true,
      availableAt: {
        time: 300
      }
    },
    {
      image: 'https://www.milkmaid.in/Images/Recipe/Chocolate%20694x400_11.JPG',
      id: '102',
      name: 'Ice Berg',
      availableNow: false,
      availableAt: {
        time: 30
      }
    },
    {
      image: 'https://www.milkmaid.in/Images/Recipe/Chocolate%20694x400_11.JPG',
      id: '108',
      name: 'Ice Berg',
      availableNow: true,
      availableAt: {
        time: 30
      }
    },
    {
      image: 'https://www.milkmaid.in/Images/Recipe/Chocolate%20694x400_11.JPG',
      id: '109',
      name: 'Ice Berg',
      availableNow: false,
      availableAt: {
        time: 330
      }
    },
    {
      image: 'https://www.milkmaid.in/Images/Recipe/Chocolate%20694x400_11.JPG',
      id: '110',
      name: 'Ice Berg',
      availableNow: false,
      availableAt: {
        time: 300
      }
    },
    {
      image: 'https://www.freeiconspng.com/uploads/chicken-caesar-salad-png-23.png',
      id: '103',
      name: 'Go Green',
      availableNow: true
    },
    {
      image: 'https://bakingmischief.com/wp-content/uploads/2016/05/chicken-shawarma-with-yogurt-sauce-image-square1.jpg', // eslint-disable-line max-len
      id: '104',
      name: 'Made Nice',
      availableNow: true
    }
  ];

  beforeEach(() => {
    wrapper = shallow(<ConceptList keyProps={mockProps} />
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
        <ConceptList keyProps={mockProps} showOperationTimes/>
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
    it('should not render ConceptList', () => {
      const itemWrapper = shallow(<ConceptList keyProps={mockProps} />);
      expect(itemWrapper.find('.tile').length).toBe(0);
    });
  });

});
