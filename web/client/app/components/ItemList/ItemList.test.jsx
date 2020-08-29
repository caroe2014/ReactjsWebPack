// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import React from 'react';
import { shallow, mount, configure } from 'enzyme';
import toJson from 'enzyme-to-json';
import Adapter from 'enzyme-adapter-react-16';
import { ThemeProvider } from 'styled-components';
import theme from 'web/client/theme.js';
import ItemList from './ItemList';
import { t } from 'i18next';

configure({ adapter: new Adapter() });

jest.mock('web/client/i18n', () => ({
  t: (key) => {
    return key;
  }
}));

jest.mock('react-i18next', () => ({
  Trans: 'div'
}));

describe('ItemList Component', () => {

  let wrapper;
  let mockProps = [
    {
      id: '100',
      name: 'This is a mock name',
      description: 'Mock description text',
      amount: 'Mock amount',
      image: 'image.png',
      attributes: [
        { id: 'mockId1', name: 'mockName', value: 'mockValue1' },
        { id: 'mockId2', name: 'mockName', value: 'mockValue2' },
        { id: 'mockId3', name: 'mockName', value: 'mockValue3' }
      ]
    },
    {
      id: '101',
      name: 'This is a mock name',
      description: 'Mock description text',
      amount: 'Mock amount',
      image: 'image.png',
      attributes: [
        { id: 'mockId1', name: 'mockName', value: 'mockValue1' },
        { id: 'mockId2', name: 'mockName', value: 'mockValue2' },
        { id: 'mockId3', name: 'mockName', value: 'mockValue3' }
      ]
    },
    {
      id: '102',
      name: 'This is a mock name',
      description: 'Mock description text',
      amount: 'Mock amount',
      image: 'image.png',
      attributes: [
        { id: 'mockId1', name: 'mockName', value: 'mockValue1' },
        { id: 'mockId2', name: 'mockName', value: 'mockValue2' }
      ]
    },
    {
      id: '103',
      name: 'This is a mock name',
      description: 'Mock description text',
      amount: 'Mock amount',
      image: 'image.png',
      attributes: [
        { id: 'mockId1', name: 'mockName', value: 'mockValue1' },
        { id: 'mockId2', name: 'mockName', value: 'mockValue2' }
      ]
    }
  ];

  beforeEach(() => {
    wrapper = mount(<ThemeProvider theme={theme}><ItemList keyProps={mockProps} /></ThemeProvider>);
  });

  it('does a snapshot test', () => {
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render without throwing an error', () => {
    expect(wrapper.exists()).toBe(true);
  });

  describe('when Item props are received', () => {
    it('should render the same number of tiles', () => {
      const ListWrapper = shallow(<ItemList keyProps={mockProps} validList/>);
      expect(ListWrapper.find('.tile').length).toBe(mockProps.length);
    });
  });

  describe('when Item props are not received', () => {
    beforeEach(() => {
      mockProps = [];
    });
    it('should not render ItemComponent', () => {
      const itemWrapper = shallow(<ItemList keyProps={mockProps} />);
      expect(itemWrapper.find('.tile').length).toBe(0);
    });
  });

});
