// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import React from 'react';

import { storiesOf } from '@storybook/react';
import { Provider } from 'rebass';
import theme from 'web/client/theme.js';
import ItemModifier from './ItemModifier';

storiesOf('ItemModifier', module)
  .add('With all modifiers', () => {
    const item = {
      modifiers: [
        {
          id: 'bread',
          description: 'BREAD',
          type: 'radio',
          options: [
            {
              id: 'ciabatta',
              description: 'Ciabatta',
              selected: false
            },
            {
              id: 'sourdough',
              description: 'Sourdough',
              selected: false
            },
            {
              id: 'marblerye',
              description: 'MarbleRye',
              selected: false
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
              description: 'Multi Grain',
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
          id: 'cheese',
          description: 'CHEESE',
          type: 'checkbox',
          options: [
            {
              id: 'Peeper Jack',
              description: 'Peeper Jack',
              selected: false
            },
            {
              id: 'Provolone',
              description: 'Provolone',
              selected: false
            },
            {
              id: 'Aged Cheddar',
              description: 'Aged Cheddar',
              selected: false
            },
            {
              id: 'Swiss',
              description: 'Swiss',
              selected: false
            },
            {
              id: 'American',
              description: 'American',
              selected: false
            },
            {
              id: 'Mozarella',
              description: 'Mozarella',
              selected: false
            },
            {
              id: 'No cheese',
              description: 'No cheese',
              selected: false
            }
          ]
        },
        {
          id: 'addon',
          description: 'ADD ON',
          type: 'checkbox',
          options: [
            {
              id: 'Fountain Drink',
              description: 'Fountain Drink',
              selected: false,
              amount: '',
              options: [{
                id: 'Large',
                description: 'Large',
                selected: false,
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

    return (
      <div>
        <Provider theme={theme}>
          <ItemModifier modifiers={item} handlerFromParent={(data) => console.log('hello:', data)} />
        </Provider>
      </div>
    );
  }
  )

  .add('Without addon', () => {
    const item = {
      modifiers: [
        {
          id: 'bread',
          description: 'BREAD',
          type: 'radio',
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
              description: 'Multi Grain',
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
          id: 'cheese',
          description: 'CHEESE',
          type: 'checkbox',
          options: [
            {
              id: 'Peeper Jack',
              description: 'Peeper Jack',
              selected: false
            },
            {
              id: 'Provolone',
              description: 'Provolone',
              selected: false
            },
            {
              id: 'Aged Cheddar',
              description: 'Aged Cheddar',
              selected: false
            },
            {
              id: 'Swiss',
              description: 'Swiss',
              selected: false
            },
            {
              id: 'American',
              description: 'American',
              selected: false
            },
            {
              id: 'Mozarella',
              description: 'Mozarella',
              selected: false
            },
            {
              id: 'No cheese',
              description: 'No cheese',
              selected: false
            }
          ]
        }
      ],
      addOnAmount: 0
    };

    return (
      <div>
        <Provider theme={theme}>
          <ItemModifier modifiers={item} handlerFromParent={(data) => console.log('hello:', data)} />
        </Provider>
      </div>
    );
  }
  )

  .add('Checkbox list tab With subOption addon', () => {
    const item = {
      modifiers: [
        {
          id: 'bread',
          description: 'BREAD',
          type: 'radio',
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
              description: 'Multi Grain',
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
          id: 'cheese',
          description: 'CHEESE',
          type: 'checkbox',
          options: [
            {
              id: 'Peeper Jack',
              description: 'Peeper Jack',
              selected: false
            },
            {
              id: 'Provolone',
              description: 'Provolone',
              selected: false
            },
            {
              id: 'Aged Cheddar',
              description: 'Aged Cheddar',
              selected: false
            },
            {
              id: 'Swiss',
              description: 'Swiss',
              selected: false
            },
            {
              id: 'American',
              description: 'American',
              selected: false
            },
            {
              id: 'Mozarella',
              description: 'Mozarella',
              selected: false
            },
            {
              id: 'No cheese',
              description: 'No cheese',
              selected: false
            }
          ]
        },
        {
          id: 'addon',
          description: 'ADD ON',
          type: 'checkbox',
          options: [
            {
              id: 'Fountain Drink',
              description: 'Fountain Drink',
              selected: false,
              amount: '',
              options: [{
                id: 'Large',
                description: 'Large',
                selected: false,
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
              amount: '',
              options: [{
                id: 'Large Slice',
                description: 'Large Slice',
                selected: false,
                amount: '2.50'
              },
              {
                id: 'Small Slice',
                description: 'Small Slice',
                selected: false,
                amount: '1.50'
              }]
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

    return (
      <div>
        <Provider theme={theme}>
          <ItemModifier modifiers={item} handlerFromParent={(data) => console.log('hello:', data)} />
        </Provider>
      </div>
    );
  }
  )

  .add('Checkbox: Option with price and subOption without price', () => {
    const item = {
      modifiers: [
        {
          id: 'bread',
          description: 'BREAD',
          type: 'radio',
          options: [
            {
              id: 'ciabatta',
              description: 'Ciabatta',
              selected: false
            },
            {
              id: 'sourdough',
              description: 'Sourdough',
              selected: false
            },
            {
              id: 'marblerye',
              description: 'MarbleRye',
              selected: false
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
              description: 'Multi Grain',
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
          id: 'cheese',
          description: 'CHEESE',
          type: 'checkbox',
          options: [
            {
              id: 'Peeper Jack',
              description: 'Peeper Jack',
              selected: false
            },
            {
              id: 'Provolone',
              description: 'Provolone',
              selected: false
            },
            {
              id: 'Aged Cheddar',
              description: 'Aged Cheddar',
              selected: false
            },
            {
              id: 'Swiss',
              description: 'Swiss',
              selected: false
            },
            {
              id: 'American',
              description: 'American',
              selected: false
            },
            {
              id: 'Mozarella',
              description: 'Mozarella',
              selected: false
            },
            {
              id: 'No cheese',
              description: 'No cheese',
              selected: false
            }
          ]
        },
        {
          id: 'addon',
          description: 'ADD ON',
          type: 'checkbox',
          options: [
            {
              id: 'Fountain Drink',
              description: 'Fountain Drink',
              selected: false,
              amount: '2.50',
              options: [{
                id: 'Large',
                description: 'Large',
                selected: false
              },
              {
                id: 'Small',
                description: 'Small',
                selected: false
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

    return (
      <div>
        <Provider theme={theme}>
          <ItemModifier modifiers={item} handlerFromParent={(data) => console.log('hello:', data)} />
        </Provider>
      </div>
    );
  }
  )

  .add('Radio list tab With subOption addon', () => {
    const item = {
      modifiers: [
        {
          id: 'bread',
          description: 'BREAD',
          type: 'radio',
          options: [
            {
              id: 'ciabatta',
              description: 'Ciabatta',
              selected: false,
              amount: '',
              options: [{
                id: 'Large',
                description: 'Large',
                selected: false,
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
              id: 'sourdough',
              description: 'Sourdough',
              selected: false,
              amount: '1.50'
            },
            {
              id: 'marblerye',
              description: 'MarbleRye',
              selected: false,
              amount: '',
              options: [{
                id: 'Large',
                description: 'Large',
                selected: false,
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
              id: 'multigrain',
              description: 'Multi Grain',
              selected: false,
              amount: '1.50'
            },
            {
              id: 'wheatbaguette',
              description: 'Wheat Baguette',
              selected: false,
              amount: '1.50'
            },
            {
              id: 'wheatwrap',
              description: 'Wheat wrap',
              selected: false,
              amount: '1.50'
            },
            {
              id: 'spinachwrap',
              description: 'Spinach wrap',
              selected: false,
              amount: '1.50'
            }
          ]
        },
        {
          id: 'proteins',
          description: 'PROTEINS',
          type: 'checkbox',
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
              description: 'Multi Grain',
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
          id: 'cheese',
          description: 'CHEESE',
          type: 'checkbox',
          options: [
            {
              id: 'Peeper Jack',
              description: 'Peeper Jack',
              selected: false
            },
            {
              id: 'Provolone',
              description: 'Provolone',
              selected: false
            },
            {
              id: 'Aged Cheddar',
              description: 'Aged Cheddar',
              selected: false
            },
            {
              id: 'Swiss',
              description: 'Swiss',
              selected: false
            },
            {
              id: 'American',
              description: 'American',
              selected: false
            },
            {
              id: 'Mozarella',
              description: 'Mozarella',
              selected: false
            },
            {
              id: 'No cheese',
              description: 'No cheese',
              selected: false
            }
          ]
        },
        {
          id: 'addon',
          description: 'ADD ON',
          type: 'checkbox',
          options: [
            {
              id: 'Fountain Drink',
              description: 'Fountain Drink',
              selected: false,
              amount: '2.50'
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

    return (
      <div>
        <Provider theme={theme}>
          <ItemModifier modifiers={item} handlerFromParent={(data) => console.log('hello:', data)} />
        </Provider>
      </div>
    );
  }
  )

  .add('Radio: Option with price and subOption without price', () => {
    const item = {
      modifiers: [
        {
          id: 'bread',
          description: 'BREAD',
          type: 'radio',
          options: [
            {
              id: 'ciabatta',
              description: 'Ciabatta',
              selected: false,
              amount: '',
              options: [{
                id: 'Large',
                description: 'Large',
                selected: false
              },
              {
                id: 'Small',
                description: 'Small',
                selected: false
              }]
            },
            {
              id: 'sourdough',
              description: 'Sourdough',
              selected: false,
              amount: 20
            },
            {
              id: 'marblerye',
              description: 'MarbleRye',
              selected: false,
              amount: '',
              options: [{
                id: 'Large',
                description: 'Large',
                selected: false
              },
              {
                id: 'Small',
                description: 'Small',
                selected: false
              }]
            },
            {
              id: 'multigrain',
              description: 'Multi Grain',
              selected: false,
              amount: 10
            },
            {
              id: 'wheatbaguette',
              description: 'Wheat Baguette',
              selected: false,
              amount: 10
            },
            {
              id: 'wheatwrap',
              description: 'Wheat wrap',
              selected: false,
              amount: 10
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
              description: 'Multi Grain',
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
          id: 'cheese',
          description: 'CHEESE',
          type: 'checkbox',
          options: [
            {
              id: 'Peeper Jack',
              description: 'Peeper Jack',
              selected: false
            },
            {
              id: 'Provolone',
              description: 'Provolone',
              selected: false
            },
            {
              id: 'Aged Cheddar',
              description: 'Aged Cheddar',
              selected: false
            },
            {
              id: 'Swiss',
              description: 'Swiss',
              selected: false
            },
            {
              id: 'American',
              description: 'American',
              selected: false
            },
            {
              id: 'Mozarella',
              description: 'Mozarella',
              selected: false
            },
            {
              id: 'No cheese',
              description: 'No cheese',
              selected: false
            }
          ]
        },
        {
          id: 'addon',
          description: 'ADD ON',
          type: 'checkbox',
          options: [
            {
              id: 'Fountain Drink',
              description: 'Fountain Drink',
              selected: false,
              amount: '2.50'
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

    return (
      <div>
        <Provider theme={theme}>
          <ItemModifier modifiers={item} handlerFromParent={(data) => console.log('hello:', data)} />
        </Provider>
      </div>
    );
  }
  );
