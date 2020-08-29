// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import React from 'react';
import {shallow, mount, configure} from 'enzyme';
import toJson from 'enzyme-to-json';
import Adapter from 'enzyme-adapter-react-16';

import {
  ThemeProvider
} from 'styled-components';
import theme from 'web/client/theme';
import ItemModifier from './ItemModifier';
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
  },
}));

jest.mock('react-i18next', () => ({
  Trans: 'div'
}));

global.window = new jsdom.JSDOM().window;
global.document = window.document;
/* global describe, it, expect, beforeEach */

describe('ItemModifier', () => {

  let mockFn = jest.fn();
  let wrapper;
  let restProps;
  let mockProps = {
    modifiers: [
      {
        id: 'bread',
        description: 'BREAD',
        type: 'radio',
        minimum: 5,
        options: [
          {
            id: 'ciabatta',
            description: 'Ciabatta',
            selected: false,
            amount: '20'
          },
          {
            id: 'sourdough',
            description: 'Sourdough',
            selected: false,
            amount: '1.50'
          },
          {
            id: 'marblerye',
            description: 'MarbleRye',
            selected: false,
            amount: '1.50'
          },
          {
            id: 'multigrain',
            description: 'Multi Grain',
            selected: false
          },
          {
            id: 'wheatbaguette',
            description: 'Wheat Baguette',
            selected: false
          },
          {
            id: 'wheatwrap',
            description: 'Wheat wrap',
            selected: false
          },
          {
            id: 'spinachwrap',
            description: 'Spinach wrap',
            selected: false
          }
        ]
      },
      {
        id: 'proteins',
        description: 'PROTEINS',
        type: 'checkbox',
        minimum: 2,
        options: [
          {
            id: 'roastedbeef',
            description: 'Roatedbeef',
            selected: false
          },
          {
            id: 'bakedham',
            description: 'Baked Ham',
            selected: false
          },
          {
            id: 'roastedturkey',
            description: 'Roasted Turkey',
            selected: false
          },
          {
            id: 'multigrain',
            description: ' Multi Grain',
            selected: false
          },
          {
            id: 'cheickenbreast',
            description: 'Chicken Breast',
            selected: false
          },
          {
            id: 'bacon',
            description: 'Bacon',
            selected: false
          },
          {
            id: 'Chicken Salad',
            description: 'Chicken Salad',
            selected: false
          }
        ]
      },
      {
        id: 'addon',
        description: 'ADD ON',
        type: 'checkbox',
        minimum: 1,
        options: [
          {
            id: 'Fountain Drink',
            description: 'Fountain Drink',
            selected: false,
            amount: '2.50',
            options: [{
              id: 'Large',
              description: 'Large',
              selected: true,
              amount: '2.50'
            },
            {
              id: 'Small',
              description: 'Small',
              selected: false,
              amount: '1.50'
            }]
          },
          {
            id: 'Small Soup',
            description: 'Small Soup',
            selected: false,
            amount: '1.50'
          },
          {
            id: 'Large Soup',
            description: 'Aged Cheddar',
            selected: false,
            amount: '1.50'
          },
          {
            id: 'Swiss',
            description: 'Swiss',
            selected: false,
            amount: '1.50'
          },
          {
            id: 'American',
            description: 'American',
            selected: false,
            amount: '1.50'
          },
          {
            id: 'Mozarella',
            description: 'Mozarella',
            selected: false,
            amount: '1.50'
          },
          {
            id: 'No cheese',
            description: 'No cheese',
            selected: false,
            amount: '1.50'
          }
        ]
      }
    ],
    addOnAmount: 0
  };
  restProps = {
    showValidationState: 'test'
  };

  beforeEach(() => {
    wrapper = shallow(<ItemModifier modifiers={mockProps} {...restProps}/>
    );
  });

  it('does a snapshot test', () => {
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render without throwing an error', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('should render without throwing an error on mount', () => {
    const mountWrapper = mount(<ThemeProvider theme={theme}><ItemModifier modifiers={mockProps} {...restProps}/></ThemeProvider>);
    expect(mountWrapper.exists()).toBe(true);
  });

  describe('when the page gets loaded', () => {
    it('should select first tab by default', () => {
      expect(wrapper.state().selectedTab).toBe(mockProps.modifiers[0].id);
    });
  });

  describe('when a tab is selected', () => {
    it('should select the appropriate modifier', () => {
      expect(wrapper.state().selectedTab).toBe(mockProps.modifiers[0].id);
      const input = wrapper.find('.' + mockProps.modifiers[1].id);
      input.simulate('click');
      expect(wrapper.state().selectedTab).toBe(mockProps.modifiers[1].id);
    });
  });

  describe('when a tab is selected', () => {
    it('should select the appropriate modifier', () => {
      expect(wrapper.state().selectedTab).toBe(mockProps.modifiers[0].id);
      const input = wrapper.find('.' + mockProps.modifiers[2].id);
      input.simulate('click');
      expect(wrapper.state().selectedTab).toBe(mockProps.modifiers[2].id);
    });
  });

  describe('when a tab is selected', () => {
    it('should display its options', () => {
      expect(wrapper.state().selectedTab).toBe(mockProps.modifiers[0].id);
      const input = wrapper.find('.' + mockProps.modifiers[1].id);
      input.simulate('click');
      expect(wrapper.state().selectedTab).toBe(mockProps.modifiers[1].id);
      expect(wrapper.find('.option').length).toBe(mockProps.modifiers[1].options.length);
    });
  });

  describe('when a modifier is selected', () => {
    it('should update the appropriate modifier', () => {
      let shalloWrapper = shallow(<ItemModifier modifiers={mockProps} handlerFromParent={mockFn} {...restProps}/>);
      const spy = jest.spyOn(shalloWrapper.instance(), 'updateModifierOption');
      shalloWrapper.instance().forceUpdate();
      shalloWrapper.find(`.option_id_${mockProps.modifiers[0].options[0].id}`).simulate('click');
      expect(spy).toHaveBeenCalled();
      spy.mockClear();
    });
  });

  describe('when a modifier is selected on mount', () => {
    let newMockProps = {
      modifiers: [
        {
          id: 'addon',
          description: 'ADD ON',
          type: 'checkbox',
          minimum: 1,
          options: [
            {
              id: 'Fountain Drink',
              description: 'Fountain Drink',
              selected: false,
              amount: '2.50',
              maximum: 10,
              options: [{
                id: 'Large',
                description: 'Large',
                selected: true,
                amount: '2.50'
              },
              {
                id: 'Small',
                description: 'Small',
                selected: false,
                amount: '1.50'
              }]
            },
            {
              id: 'Small Soup',
              description: 'Small Soup',
              selected: false,
              amount: '1.50'
            },
            {
              id: 'Large Soup',
              description: 'Aged Cheddar',
              selected: false,
              amount: '1.50'
            },
            {
              id: 'Swiss',
              description: 'Swiss',
              selected: false,
              amount: '1.50'
            },
            {
              id: 'American',
              description: 'American',
              selected: false,
              amount: '1.50'
            },
            {
              id: 'Mozarella',
              description: 'Mozarella',
              selected: false,
              amount: '1.50'
            },
            {
              id: 'No cheese',
              description: 'No cheese',
              selected: false,
              amount: '1.50'
            }
          ]
        }
      ],
      addOnAmount: 0
    };

    it('should update the appropriate modifier', () => {
      let mountWrapper = mount(<ThemeProvider theme={theme}><ItemModifier modifiers={newMockProps} handlerFromParent={mockFn} {...restProps}/></ThemeProvider>);
      expect(mountWrapper.exists()).toBe(true);
    });
  });

  describe('when a modifier minimum is 0', () => {
    let newMockProps = {
      modifiers: [
        {
          id: 'addon',
          description: 'ADD ON',
          type: 'checkbox',
          minimum: 0,
          options: [
            {
              id: 'Fountain Drink',
              description: 'Fountain Drink',
              selected: false,
              amount: '2.50',
              maximum: 10,
              options: [{
                id: 'Large',
                description: 'Large',
                selected: true,
                amount: '2.50'
              },
              {
                id: 'Small',
                description: 'Small',
                selected: false,
                amount: '1.50'
              }]
            },
            {
              id: 'Small Soup',
              description: 'Small Soup',
              selected: false,
              amount: '1.50'
            },
            {
              id: 'Large Soup',
              description: 'Aged Cheddar',
              selected: false,
              amount: '1.50'
            },
            {
              id: 'Swiss',
              description: 'Swiss',
              selected: false,
              amount: '1.50'
            },
            {
              id: 'American',
              description: 'American',
              selected: false,
              amount: '1.50'
            },
            {
              id: 'Mozarella',
              description: 'Mozarella',
              selected: false,
              amount: '1.50'
            },
            {
              id: 'No cheese',
              description: 'No cheese',
              selected: false,
              amount: '1.50'
            }
          ]
        }
      ],
      addOnAmount: 0
    };

    it('should update the appropriate modifier', () => {
      let shallowWrapper = shallow(<ItemModifier modifiers={newMockProps} handlerFromParent={mockFn} {...restProps}/>);
      expect(shallowWrapper.exists()).toBe(true);
    });
  });

  describe('when a modifier max is 1', () => {
    let newMockProps = {
      modifiers: [
        {
          id: 'addon',
          description: 'ADD ON',
          type: 'checkbox',
          minimum: 1,
          maximum: 1,
          options: [
            {
              id: 'Fountain Drink',
              description: 'Fountain Drink',
              selected: false,
              amount: '2.50',
              type: 'checkbox',
              maximum: 10,
              options: [{
                id: 'Large',
                description: 'Large',
                selected: true,
                amount: '2.50'
              },
              {
                id: 'Small',
                description: 'Small',
                selected: false,
                amount: '1.50'
              }]
            },
            {
              id: 'Small Soup',
              description: 'Small Soup',
              selected: false,
              amount: '1.50'
            },
            {
              id: 'Large Soup',
              description: 'Aged Cheddar',
              selected: false,
              amount: '1.50'
            },
            {
              id: 'Swiss',
              description: 'Swiss',
              selected: false,
              amount: '1.50'
            },
            {
              id: 'American',
              description: 'American',
              selected: false,
              amount: '1.50'
            },
            {
              id: 'Mozarella',
              description: 'Mozarella',
              selected: false,
              amount: '1.50'
            },
            {
              id: 'No cheese',
              description: 'No cheese',
              selected: false,
              amount: '1.50'
            }
          ]
        }
      ],
      addOnAmount: 0
    };

    it('should update the appropriate modifier', () => {
      let shallowWrapper = shallow(<ItemModifier modifiers={newMockProps} handlerFromParent={mockFn} {...restProps}/>);
      expect(shallowWrapper.exists()).toBe(true);
    });

    it('should update the appropriate modifier', () => {
      let shalloWrapper = shallow(<ItemModifier modifiers={newMockProps} handlerFromParent={mockFn} {...restProps}/>);
      const spy = jest.spyOn(shalloWrapper.instance(), 'updateSubOption');
      shalloWrapper.instance().forceUpdate();
      shalloWrapper.find(`.subitem_${newMockProps.modifiers[0].options[0].options[0].id}`).simulate('click');
      expect(spy).toHaveBeenCalled();
      spy.mockClear();
    });

  });

  describe('when a modifier has type radio', () => {
    let newMockProps = {
      modifiers: [
        {
          id: 'addon',
          description: 'ADD ON',
          type: 'radio',
          minimum: 1,
          maximum: 1,
          options: [
            {
              id: 'Fountain Drink',
              description: 'Fountain Drink',
              selected: false,
              amount: '2.50',
              type: 'radio',
              maximum: 10,
              options: [{
                id: 'Large',
                description: 'Large',
                selected: true,
                amount: '2.50'
              },
              {
                id: 'Small',
                description: 'Small',
                selected: false,
                amount: '1.50'
              }]
            },
            {
              id: 'Small Soup',
              description: 'Small Soup',
              selected: false,
              amount: '1.50'
            },
            {
              id: 'Large Soup',
              description: 'Aged Cheddar',
              selected: false,
              amount: '1.50'
            },
            {
              id: 'Swiss',
              description: 'Swiss',
              selected: false,
              amount: '1.50'
            },
            {
              id: 'American',
              description: 'American',
              selected: false,
              amount: '1.50'
            },
            {
              id: 'Mozarella',
              description: 'Mozarella',
              selected: false,
              amount: '1.50'
            },
            {
              id: 'No cheese',
              description: 'No cheese',
              selected: false,
              amount: '1.50'
            }
          ]
        }
      ],
      addOnAmount: 0
    };

    it('should update the appropriate modifier', () => {
      let shallowWrapper = shallow(<ItemModifier modifiers={newMockProps} handlerFromParent={mockFn} {...restProps}/>);
      expect(shallowWrapper.exists()).toBe(true);
    });

    it('should update the appropriate modifier', () => {
      let shalloWrapper = shallow(<ItemModifier modifiers={newMockProps} handlerFromParent={mockFn} {...restProps}/>);
      const spy = jest.spyOn(shalloWrapper.instance(), 'updateSubOption');
      shalloWrapper.instance().forceUpdate();
      shalloWrapper.find(`.subitem_${newMockProps.modifiers[0].options[0].options[0].id}`).simulate('click');
      expect(spy).toHaveBeenCalled();
      spy.mockClear();
      shalloWrapper.unmount();
    });

  });

  describe('when a modifier is selected for radio', () => {
    let newMockProps = {
      modifiers: [
        {
          id: 'addon',
          description: 'ADD ON',
          type: 'radio',
          minimum: 1,
          maximum: 1,
          options: [
            {
              id: 'Fountain Drink',
              description: 'Fountain Drink',
              selected: false,
              amount: '2.50',
              type: 'radio',
              maximum: 10,
              options: [{
                id: 'Large',
                description: 'Large',
                selected: true,
                amount: '2.50'
              },
              {
                id: 'Small',
                description: 'Small',
                selected: false,
                amount: '1.50'
              }]
            },
            {
              id: 'Small Soup',
              description: 'Small Soup',
              selected: false,
              amount: '1.50'
            },
            {
              id: 'Large Soup',
              description: 'Aged Cheddar',
              selected: false,
              amount: '1.50'
            },
            {
              id: 'Swiss',
              description: 'Swiss',
              selected: false,
              amount: '1.50'
            },
            {
              id: 'American',
              description: 'American',
              selected: false,
              amount: '1.50'
            },
            {
              id: 'Mozarella',
              description: 'Mozarella',
              selected: false,
              amount: '1.50'
            },
            {
              id: 'No cheese',
              description: 'No cheese',
              selected: false,
              amount: '1.50'
            }
          ]
        }
      ],
      addOnAmount: 0
    };
    it('should update the appropriate modifier', () => {
      let shalloWrapper = shallow(<ItemModifier modifiers={newMockProps} handlerFromParent={mockFn} {...restProps}/>);
      const spy = jest.spyOn(shalloWrapper.instance(), 'updateModifierOption');
      shalloWrapper.instance().forceUpdate();
      shalloWrapper.find('.option_id_Fountain').simulate('click');
      expect(spy).toHaveBeenCalled();
      spy.mockClear();
    });
  });

  describe('when a modifier is selected for checkbox', () => {
    let newMockProps = {
      modifiers: [
        {
          id: 'addon',
          description: 'ADD ON',
          type: 'checkbox',
          minimum: 1,
          maximum: 1,
          options: [
            {
              id: 'Fountain Drink',
              description: 'Fountain Drink',
              selected: false,
              amount: '2.50',
              type: 'checkbox',
              maximum: 10,
              options: [{
                id: 'Large',
                description: 'Large',
                selected: true,
                amount: '2.50'
              },
              {
                id: 'Small',
                description: 'Small',
                selected: false,
                amount: '1.50'
              }]
            },
            {
              id: 'Small Soup',
              description: 'Small Soup',
              selected: false,
              amount: '1.50'
            },
            {
              id: 'Large Soup',
              description: 'Aged Cheddar',
              selected: false,
              amount: '1.50'
            },
            {
              id: 'Swiss',
              description: 'Swiss',
              selected: false,
              amount: '1.50'
            },
            {
              id: 'American',
              description: 'American',
              selected: false,
              amount: '1.50'
            },
            {
              id: 'Mozarella',
              description: 'Mozarella',
              selected: false,
              amount: '1.50'
            },
            {
              id: 'No cheese',
              description: 'No cheese',
              selected: false,
              amount: '1.50'
            }
          ]
        }
      ],
      addOnAmount: 0
    };
    it('should update the appropriate modifier', () => {
      let shalloWrapper = shallow(<ItemModifier modifiers={newMockProps} handlerFromParent={mockFn} {...restProps}/>);
      const spy = jest.spyOn(shalloWrapper.instance(), 'updateModifierOption');
      shalloWrapper.instance().forceUpdate();
      shalloWrapper.find('.option_id_Fountain').simulate('click');
      expect(spy).toHaveBeenCalled();
      spy.mockClear();
    });
  });

});
