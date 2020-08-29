// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import React from 'react';
import { shallow, mount, configure } from 'enzyme';
import toJson from 'enzyme-to-json';
import Adapter from 'enzyme-adapter-react-16';
import { ThemeProvider } from 'styled-components';
import theme from 'web/client/theme.js';
import SiteSelectList from './SiteSelectList';
import { t } from 'i18next';

configure({ adapter: new Adapter() });

jest.mock('i18next');
t.mockImplementation((key) => {
  return key;
});

jest.mock('react-i18next', () => ({
  Trans: 'div'
}));

jest.mock('web/client/i18n', () => ({
  t: (key) => {
    return key;
  }
}));

describe('SiteSelectList', () => {

  let wrapper;
  let mockProps = [
    {
      id: '1000',
      image: 'image.png',
      name: 'This is a mock name',
      availableAt: {
        opens: '9:00am',
        closes: '5:00pm',
        availableNow: true,
        closingIn: 10
      },
      address: ['1000, windward concourse', 'alpharetta,GA, USA']
    },
    {
      id: '1001',
      image: 'image.png',
      name: 'This is a mock name',
      availableAt: {
        opens: '9:00am',
        closes: '5:00pm',
        availableNow: true,
        closingIn: 10
      },
      address: ['3380-146th PI SE', 'Believue,USA']
    },
    {
      id: '1002',
      image: 'image.png',
      name: 'This is a mock name',
      availableAt: {
        opens: '9:00am',
        closes: '5:00pm',
        availableNow: true,
        closingIn: 10
      },
      address: ['6775, S Edmond st #100', 'Lasvegas, USA']
    }
  ];

  beforeEach(() => {
    wrapper = shallow(<SiteSelectList keyProps={mockProps} />
    );
  });

  it('does a snapshot test', () => {
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render without throwing an error', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('should render without throwing an error in mount', () => {
    const mountWrapper = mount(<ThemeProvider theme={theme}><SiteSelectList keyProps={mockProps} /></ThemeProvider>);
    expect(mountWrapper.exists()).toBe(true);
  });

  describe('when Site list props are received', () => {
    it('should render the same number of tiles', () => {
      expect(wrapper.find('.tile').length).toBe(mockProps.length);
    });
  });

  describe('when Site list props are not received', () => {
    beforeEach(() => {
      mockProps = [];
    });
    it('should not render ItemComponent', () => {
      const itemWrapper = shallow(<SiteSelectList keyProps={mockProps} />);
      expect(itemWrapper.find('.tile').length).toBe(0);
    });
  });

  it('should render without throwing', () => {
    const mountWrapper = shallow(<SiteSelectList keyProps={mockProps} selectSite/>);
    wrapper.instance().forceUpdate();
    wrapper.instance().selectSite();
    expect(mountWrapper.exists()).toBe(true);
  });

});
