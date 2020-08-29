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
import i18n from 'i18next';
import ItemDetails from './ItemDetails';
import jsdom from 'jsdom';

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
  }
}));

jest.mock('react-i18next', () => ({
  Trans: 'div'
}));

/* global describe, it, expect, beforeEach */
/* eslint-disable max-len */
global.window = new jsdom.JSDOM().window;
global.document = window.document;

describe('ItemDetails', () => {
  let mockProps = {
    image: 'https://www.ndtv.com/cooks/images/grilled.sandwich.jpg',
    displayText: 'Mc Alister’s Club',
    amount: '12.00',
    description: 'Organic and Natural sandwiches with delicious sauce made to required sizes and shapes as per wish.',
    tagNames: ['Veg', '160 cal'],
    modifiers: {
      'modifiers': [
        {
          'id': 'bread',
          'description': 'BREAD',
          'type': 'radio',
          'options': [
            {
              'id': 'wheatbaguette',
              'description': 'Wheat Baguette',
              'selected': false
            },
            {
              'id': 'wheatwrap',
              'description': 'Wheat wrap',
              'selected': false
            },
            {
              'id': 'spinachwrap',
              'description': 'Spinach wrap',
              'selected': false
            }
          ]
        },
        {
          'id': 'addon',
          'description': 'ADD ON',
          'type': 'checkbox',
          'options': [
            {
              'id': 'Fountain Drink',
              'description': 'Fountain Drink',
              'selected': true,
              'amount': '2.50',
              'options': [
                {
                  'id': 'Large',
                  'description': 'Large',
                  'selected': true,
                  'amount': '2.50'
                },
                {
                  'id': 'Small',
                  'description': 'Small',
                  'selected': false,
                  'amount': '1.50'
                }
              ]
            },
            {
              'id': 'Small Soup',
              'description': 'Small Soup',
              'selected': false,
              'amount': '1.50'
            },
            {
              'id': 'Large Soup',
              'description': 'Aged Cheddar',
              'selected': true,
              'amount': '1.50'
            },
            {
              'id': 'Swiss',
              'description': 'Swiss',
              'selected': true,
              'amount': '1.50'
            }
          ]
        }
      ],
      'addOnAmount': 0
    }
  };
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<ItemDetails itemDisplayList={['labels', 'description', 'image']} selectItem={mockProps}/>);
  });
  it('does a snapshot test', () => {
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render without throwing an error', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('should render without throwing an error on mount', () => {
    const mountWrapper = mount(<ThemeProvider theme={theme}><ItemDetails itemDisplayList={['labels', 'description', 'image']} selectItem={mockProps} disableAddToCart/></ThemeProvider>);
    expect(mountWrapper.exists()).toBe(true);
  });

  it('checks whether image prop is recevied', () => {
    let imageComponent = wrapper.find('DynamicImage');
    expect(imageComponent.props().src).toBe(mockProps.image);
  });

  it('checks whether description prop is recevied', () => {
    let description = wrapper.find('.description');
    expect(description.props().children).toBe(mockProps.description);
  });

  it('checks whether tags prop is recevied', () => {
    let tags = wrapper.find('TileContent');
    expect(tags.length).toBe(mockProps.tagNames.length);
  });

  it('calls add to cart when clicked whether tags prop is recevied', () => {
    let mockFn = jest.fn();
    let OnAddWrapper = shallow(<ItemDetails itemDisplayList={['labels', 'description', 'image']} selectItem={mockProps} handleClick={mockFn}/>);
    const spy = jest.spyOn(OnAddWrapper.instance(), 'onAddToCart');
    OnAddWrapper.instance().forceUpdate();
    OnAddWrapper.setState({ modifiersAreValid: true });
    OnAddWrapper.find('.add-to-cart-button').simulate('click');
    expect(spy).toHaveBeenCalled();
    spy.mockClear();
  });

  it('calls add to cart when clicked whether tags prop is recevied', () => {
    let OnAddWrapper = shallow(<ItemDetails itemDisplayList={['labels', 'description', 'image']} selectItem={mockProps}/>);
    const spy = jest.spyOn(OnAddWrapper.instance(), 'onAddToCart');
    OnAddWrapper.instance().forceUpdate();
    OnAddWrapper.setState({ modifiersAreValid: false });
    OnAddWrapper.find('.add-to-cart-button').simulate('click');
    expect(spy).toHaveBeenCalled();
    spy.mockClear();
  });

  it('checks whether reset button work properly', () => {
    let itemCount = wrapper.find('AddItem').dive();
    let plusButton = itemCount.find('Styled(IconButton)').last();
    plusButton.props().onClick();
    itemCount.update();
    wrapper.update();
    let resetButton = wrapper.find('.button');
    resetButton.props().onClick();
    wrapper.update();
    let resetAmount = wrapper.find('Styled(Text)').last().props().children;
    expect(`$${mockProps.amount}`).toBe(resetAmount);
  });

  describe('when Image prop is not given', () => {
    beforeEach(() => {
      mockProps.image = '';
      wrapper = shallow(<ItemDetails itemDisplayList={['labels', 'description', 'image']} selectItem={mockProps}/>);
    });
    it('checks whether image prop is not recevied', () => {
      let imageComponent = wrapper.find('DynamicImage');
      expect(imageComponent.length).toBe(0);
    });
  });

  describe('when image is not present in itemDisplayList prop', () => {
    beforeEach(() => {
      wrapper = shallow(<ItemDetails itemDisplayList={['labels', 'description']} selectItem={mockProps}/>);
    });
    it('checks whether image is rendered', () => {
      let imageComponent = wrapper.find('DynamicImage');
      expect(imageComponent.length).toBe(0);
    });
  });

  describe('when modifiers data given', () => {
    it('checks whether modifiers shown', () => {
      let modifier = wrapper.find('ItemModifier');
      expect(modifier.length).toBe(1);
    });
    it('checks total amount with selected modifiers', () => {
      let totalAddOnAmount = Number(mockProps.amount);
      mockProps.modifiers.modifiers.map((tabs) => {
        const selectedOptions = tabs.options.filter(item => (item.selected === true && item.amount));
        selectedOptions.map((option) => {
          totalAddOnAmount = totalAddOnAmount + Number(option.amount);
        });
      });
      let itemdetails = wrapper;
      itemdetails.find('ItemModifier').dive().find('.option').first().childAt(0).simulate('click');
      itemdetails.update();
      expect(itemdetails.find('Styled(Text)').last().props().children).toBe(`$${totalAddOnAmount.toFixed(2)}`);
    });
  });

  describe('componentWillUpdate', () => {
    let newMockProps = {
      image: 'https://www.ndtv.com/cooks/images/grilled.sandwich.jpg',
      displayText: 'sMc Alister’s Club',
      amount: '12.00',
      description: 'Organic and Natural sandwiches with delicious sauce made to required sizes and shapes as per wish.',
      tagNames: ['Veg', '160 cal'],
      modifiers: {
        'modifiers': [
          {
            'id': 'bread',
            'description': 'BREAD',
            'type': 'radio',
            'options': [
              {
                'id': 'wheatbaguette',
                'description': 'Wheat Baguette',
                'selected': false
              },
              {
                'id': 'wheatwrap',
                'description': 'Wheat wrap',
                'selected': false
              },
              {
                'id': 'spinachwrap',
                'description': 'Spinach wrap',
                'selected': false
              }
            ]
          },
          {
            'id': 'addon',
            'description': 'ADD ON',
            'type': 'checkbox',
            'options': [
              {
                'id': 'Fountain Drink',
                'description': 'Fountain Drink',
                'selected': true,
                'amount': '2.50',
                'options': [
                  {
                    'id': 'Large',
                    'description': 'Large',
                    'selected': true,
                    'amount': '2.50'
                  },
                  {
                    'id': 'Small',
                    'description': 'Small',
                    'selected': false,
                    'amount': '1.50'
                  }
                ]
              },
              {
                'id': 'Small Soup',
                'description': 'Small Soup',
                'selected': false,
                'amount': '1.50'
              },
              {
                'id': 'Large Soup',
                'description': 'Aged Cheddar',
                'selected': true,
                'amount': '1.50'
              },
              {
                'id': 'Swiss',
                'description': 'Swiss',
                'selected': true,
                'amount': '1.50'
              }
            ]
          }
        ],
        'addOnAmount': 0
      }
    };
    it('updates with newprops', () => {
      wrapper.setProps({ selectItem: newMockProps });
    });
  });
});
