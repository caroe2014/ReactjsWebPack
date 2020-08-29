// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import React from 'react';
import {
  shallow,
  mount,
  configure
} from 'enzyme';
import toJson from 'enzyme-to-json';
import Adapter from 'enzyme-adapter-react-16';
import {
  ThemeProvider
} from 'styled-components';
import theme from 'web/client/theme';

import SiteSelectCard from '.';

configure({
  adapter: new Adapter()
});

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

describe('SiteSelectCard', () => {
  let wrapper;
  let mockProps = {
    id: '1001',
    image: 'http://eatstreet.co.id/wp-content/uploads/2016/11/cropped-MASTER-FINAL_LOGO-OVAL-EAT-STREET-1.png',
    name: 'Eat Street',
    availableAt: {
      opens: '9:00am',
      closes: '6:00pm',
      availableNow: true,
      closingIn: 10,
      conceptsAvailableNow: true
    },
    address: ['1000, windward concourse', 'alpharetta,GA, USA']
  };

  beforeEach(() => {
    wrapper = shallow(<SiteSelectCard keyProps={mockProps} />
    );
  });

  it('does a snapshot test', () => {
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render without throwing an error', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('should render without throwing an error on mount', () => {
    expect(mount(<ThemeProvider theme={theme}><SiteSelectCard keyProps={mockProps} showOperationTimes /></ThemeProvider>).exists()).toBe(true);
  });

  // it('checks whether image prop is recevied', () => {
  //   expect(wrapper.find('Tile').dive().find('.image').props().src).toBe(mockProps.image);
  // });

  describe('when Image prop is undefined', () => {
    beforeEach(() => {
      mockProps.image = '';
      mockProps.availableAt.conceptsAvailableNow = false;
    });
    it('checks whether image prop is not recevied', () => {
      const imageWrapper = shallow(< SiteSelectCard keyProps={mockProps}
      />);
      expect(imageWrapper.find('.image').length).toBe(0);
    });
    it('should render without throwing an error on mount', () => {
      expect(mount(<ThemeProvider theme={theme}><SiteSelectCard keyProps={mockProps} showOperationTimes /></ThemeProvider>).exists()).toBe(true);
    });
    it('should render without throwing an error on mount', () => {
      mockProps.availableAt.closingIn = 1;
      expect(mount(<ThemeProvider theme={theme}><SiteSelectCard keyProps={mockProps} showOperationTimes /></ThemeProvider>).exists()).toBe(true);
    });
  });

  it('show closed now text when store is closed', () => {
    mockProps.availableAt.availableNow = false;
    const closeWrapper = mount(<ThemeProvider theme={theme}><SiteSelectCard keyProps={mockProps} showOperationTimes /></ThemeProvider>);
    expect(closeWrapper.exists()).toBe(true);
  });

});
