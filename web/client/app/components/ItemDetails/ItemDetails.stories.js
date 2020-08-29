// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import React from 'react';

import { storiesOf } from '@storybook/react';

import ItemDetailsView from './ItemDetails';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { store, history } from '../../../store';
import { Provider as ThemeProvider } from 'rebass';
import theme from 'web/client/theme.js';

storiesOf('ItemDetailsView', module)
  .add('With image', () => {
    const itemList = {
      image: 'https://www.ndtv.com/cooks/images/grilled.sandwich.jpg',
      title: 'Mc Alister’s Club',
      amount: '12.00',
      description: 'Organic and Natural sandwiches with delicious sauce made to required sizes and shapes as per wish.',
      itemDescription: ['Veg', '160 cal'],
      modifiers: {
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
                },
                {
                  id: 'Extra Small',
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
      }
    };

    return (
      <Provider store={store}>
        <ConnectedRouter history={history} >
          <ThemeProvider theme={theme}>
            <ItemDetailsView selectItem={itemList} />
          </ThemeProvider>
        </ConnectedRouter>
      </Provider>
    );
  }
  );

storiesOf('ItemDetailsView', module)
  .add('Without image', () => {
    const items = {
      title: 'Mc Alister’s Club',
      amount: '12.00',
      description: 'Organic and Natural sandwiches with delicious sauce made to required sizes and shapes as per wish.',
      itemDescription: ['Veg', '160 cal'],
      addons: {
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
      }
    };
    return (
      <ItemDetailsView keyProps={items} />
    );
  }
  );
