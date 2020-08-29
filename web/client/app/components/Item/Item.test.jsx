// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import React from 'react';
import { shallow, mount, configure } from 'enzyme';
import toJson from 'enzyme-to-json';
import Adapter from 'enzyme-adapter-react-16';
import {
  ThemeProvider
} from 'styled-components';
import theme from 'web/client/theme';
import { t } from 'i18next';
import Item from './Item';

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

describe('ItemComponent', () => {

  let wrapper;
  let mockProps = {
    id: '100',
    name: 'This is a mock name',
    description: 'Mock description text',
    amount: 123,
    thumbnail: 'image.png',    
    tagNames: [
      'mockName1',
      'mockName2',
      'mockName3'
    ]
  };

  let mockFn = jest.fn();

  beforeEach(() => {
    wrapper = shallow(<Item keyProps={mockProps} itemDisplayList={['labels', 'description', 'image', 'price']} showAddButton/>
    );
  });

  //TODO: uncomment
  it('does a snapshot test', () => {
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render without throwing an error', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('should render without throwing an error on mount', () => {
    expect(mount(<ThemeProvider theme={theme}><Item keyProps={mockProps} itemDisplayList={['labels', 'description', 'image']} showAddButton/></ThemeProvider>).exists()).toBe(true);
  });

  it('should render Image when Image prop is received', () => {
    expect(wrapper.dive().find('ImageContainer').length).toBe(1);
  });

  describe('when image prop is not received and image is not present in itemDisplayList prop', () => {
    beforeEach(() => {
      mockProps.thumbnail = '';
    });
    it('should not render Image when Image prop is received', () => {
      const imageWrapper = shallow(<Item keyProps={mockProps} itemDisplayList={['labels']}/>);
      expect(imageWrapper.dive().find('ImageContainer').length).toBe(0);
    });
  });

  describe('when image is not present in itemDisplayList prop and image prop is received', () => {
    it('should not render Image', () => {
      const imageWrapper = shallow(<Item keyProps={mockProps} itemDisplayList={['labels']}/>);
      expect(imageWrapper.dive().find('ImageContainer').length).toBe(0);
    });
  });

  describe('when tagNames prop is received', () => {
    it('should render all attribute tiles', () => {
      expect(wrapper.find('.icon-tile').length).toBe(mockProps.tagNames.length);
    });
  });

  describe('when tagNames prop is received', () => {
    it('should render all Icon tiles', () => {
      expect(wrapper.find('.icon-tile-mobile').length).toBe(mockProps.tagNames.length);
    });
  });

  describe('when tagNames prop is not received and labels is not present in itemDisplayList prop', () => {
    beforeEach(() => {
      mockProps.tagNames = [];
    });
    it('should not render attributes tiles', () => {
      const tileWrapper = shallow(<Item keyProps={mockProps} itemDisplayList={['image']} iscart/>);
      expect(tileWrapper.find('.icon-tile').length).toBe(0);
    });
  });

  describe('when labels is not present in itemDisplayList prop and tagNames prop is received', () => {
    it('should not render attributes tiles', () => {
      const tileWrapper = shallow(<Item keyProps={mockProps} itemDisplayList={['image']} iscart/>);
      expect(tileWrapper.find('.icon-tile').length).toBe(0);
    });
  });

  describe('when amount prop is received and price is present in itemDisplayList prop', () => {
    it('should render amount text', () => {
      expect(wrapper.find('.amount').length).toBe(1);
    });
  });

  describe('when amount prop is not received', () => {
    beforeEach(() => {
      mockProps.amount = '';
    });
    it('should not render amount text', () => {
      const amountWrapper = shallow(<Item keyProps={mockProps} itemDisplayList={['image']} showAddButton/>);
      expect(amountWrapper.find('.amount').length).toBe(0);
    });
  });

  describe('when description is not available', () => {
    const newMockProps = {
      id: '100',
      name: 'This is a mock name',
      amount: 'Mock amount',
      thumbnail: 'image.png',
      tagNames: [
        'mockName1',
        'mockName2',
        'mockName3'
      ]
    };
    it('should render TileContainerNoDescription when description is present in itemDisplayList prop', () => {
      const shallowWrapper = shallow(<Item keyProps={newMockProps} itemDisplayList={['description']} showAddButton/>);
      expect(shallowWrapper.find('.tile-container-no-description').length).toBe(1);
    });
  });

});
