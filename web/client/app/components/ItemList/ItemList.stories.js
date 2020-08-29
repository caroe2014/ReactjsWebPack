// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import React from 'react';

import { storiesOf } from '@storybook/react';
import ItemList from './ItemList';

storiesOf('ItemList Component', module)
  .add('With images', () => {
    const menuItems = [
      {
        id: 100,
        name: 'Mc Alister’s Club',
        description: 'Organic and natural sandwiches with delicious sauces made in all sizes',
        amount: '12.00',
        image: 'https://lh3.googleusercontent.com/-oCQXVe5cO98sceFwpt-9yYpkjTXX1Fb7ZfMFSCA1FFXRfJOTg2wCV1hPbyJO7HqexJYBN5frg5NhXVsgaFhG5I=s730-c-e365', // eslint-disable-line max-len
        attributes: [
          { id: 'gluten', name: 'Gluten Free', value: 'Gluten Free' },
          { id: 'healthy', name: 'Healthy Choice', value: 'Healthy' }
        ]
      },
      {
        id: 101,
        name: 'King Club',
        description: 'Organic and natural sandwiches with delicious sauces made in all sizes',
        amount: '12.00',
        image: 'https://www.landolakes.com/RecipeManagementSystem/media/Recipe-Media-Files/Recipes/Retail/x17/20733-all-american-club-sandwich-600x600.jpg?ext=.jpg', // eslint-disable-line max-len
        attributes: [
          { id: 'gluten', name: 'Gluten Free', value: 'Gluten Free' },
          { id: 'healthy', name: 'Healthy Choice', value: 'Healthy' },
          { id: 'calories', name: 'Calories', value: '120Cal' }
        ]
      },
      {
        id: 102,
        name: 'Big mc Burger',
        description: 'Organic and natural sandwiches with delicious sauces made in all sizes',
        amount: '12.00',
        image: 'https://imagesvc.timeincapp.com/v3/mm/image?url=http%3A%2F%2Fcdn-image.myrecipes.com%2Fsites%2Fdefault%2Ffiles%2Fstyles%2Fmedium_2x%2Fpublic%2F1426263343%2FBestEverJuicy-Burger_420x420.jpg%3Fitok%3DwNkrRxc4&w=700&q=85', // eslint-disable-line max-len
        attributes: [
          { id: 'gluten', name: 'Gluten Free', value: 'Gluten Free' },
          { id: 'calories', name: 'Calories', value: '120Cal' }
        ]
      },
      {
        id: 103,
        name: 'Non veg Club',
        description: 'Organic and natural sandwiches with delicious sauces made in all sizes',
        amount: '12.00',
        image: 'https://ls.imgix.net/recipes/thumbnails/BBQMatesAmerican-Club-Sandwich-with-Candied-Bacon.jpg?w=620&h=310&auto=compress,format&fit=crop', // eslint-disable-line max-len
        attributes: [
          { id: 'gluten', name: 'Gluten Free', value: 'Gluten Free' },
          { id: 'healthy', name: 'Healthy Choice', value: 'Healthy' },
          { id: 'calories', name: 'Calories', value: '120Cal' }
        ]
      },
      {
        id: 104,
        name: 'Spicy south',
        description: 'Organic and natural sandwiches with delicious sauces made in all sizes. Sandwiches filled with nice cut veggies with slightly coated cheese.', // eslint-disable-line max-len
        amount: '12.00',
        image: 'https://bigoven-res.cloudinary.com/image/upload/t_recipe-480/classy-club-sandwiches-2.jpg',
        attributes: [
          { id: 'gluten', name: 'Gluten Free', value: 'Gluten Free' },
          { id: 'healthy', name: 'Healthy Choice', value: 'Healthy' },
          { id: 'calories', name: 'Calories', value: '120Cal' }
        ]
      },
      {
        id: 105,
        name: 'Grilled chicken sandwich',
        description: 'Organic and natural sandwiches with delicious sauces made in all sizes',
        amount: '12.00',
        image: 'https://bigoven-res.cloudinary.com/image/upload/t_recipe-480/the-downtowner-sandwich-fbafcd-1ef83878f8097edf4f02867d.jpg', // eslint-disable-line max-len
        attributes: [
          { id: 'healthy', name: 'Healthy Choice', value: 'Healthy' }
        ]
      },
      {
        id: 106,
        name: 'Cheese max pasta',
        description: 'Organic and natural sandwiches with delicious sauces made in all sizes',
        amount: '12.00',
        image: 'https://bigoven-res.cloudinary.com/image/upload/t_recipe-480/davinci-pasta-like-cheesecake-facto.jpg',
        attributes: [
          { id: 'healthy', name: 'Healthy Choice', value: 'Healthy' },
          { id: 'calories', name: 'Calories', value: '120Cal' }
        ]
      }
    ];

    return (
      <ItemList keyProps={menuItems} showAddButton/>
    );
  }
  );

storiesOf('ItemList Component', module)
  .add('Without images', () => {
    const menuItems = [
      {
        id: 100,
        name: 'Mc Alister’s Club',
        description: 'Organic and natural sandwiches with delicious sauces made in all sizes',
        amount: '12.00',
        attributes: [
          { id: 'healthy', name: 'Healthy Choice', value: 'Healthy' },
          { id: 'calories', name: 'Calories', value: '120Cal' }
        ]
      },
      {
        id: 101,
        name: 'Mc Alister’s Club',
        description: 'Organic and natural sandwiches with delicious sauces made in all sizes',
        amount: '12.00',
        attributes: [
          { id: 'gluten', name: 'Gluten Free', value: 'Gluten Free' },
          { id: 'calories', name: 'Calories', value: '120Cal' }
        ]
      },
      {
        id: 102,
        name: 'King Club',
        description: 'Organic and natural sandwiches with delicious sauces made in all sizes',
        amount: '12.00',
        attributes: [
          { id: 'gluten', name: 'Gluten Free', value: 'Gluten Free' },
          { id: 'healthy', name: 'Healthy Choice', value: 'Healthy' },
          { id: 'calories', name: 'Calories', value: '120Cal' }
        ]
      },
      {
        id: 103,
        name: 'Non veg Club',
        description: 'Organic and natural sandwiches with delicious sauces made in all sizes',
        amount: '12.00',
        attributes: [
          { id: 'healthy', name: 'Healthy Choice', value: 'Healthy' }
        ]
      },
      {
        id: 104,
        name: 'Spicy south',
        description: 'Organic and natural sandwiches with delicious sauces made in all sizes. Sandwiches filled with nice cut veggies with slightly coated cheese.', // eslint-disable-line max-len
        amount: '12.00',
        attributes: [
          { id: 'gluten', name: 'Gluten Free', value: 'Gluten Free' },
          { id: 'healthy', name: 'Healthy Choice', value: 'Healthy' },
          { id: 'calories', name: 'Calories', value: '120Cal' }
        ]
      },
      {
        id: 105,
        name: 'Grilled chicken sandwich',
        description: 'Organic and natural sandwiches with delicious sauces made in all sizes',
        amount: '12.00',
        attributes: [
          { id: 'gluten', name: 'Gluten Free', value: 'Gluten Free' },
          { id: 'calories', name: 'Calories', value: '120Cal' }
        ]
      },
      {
        id: 106,
        name: 'Cheese max pasta',
        description: 'Organic and natural sandwiches with delicious sauces made in all sizes',
        amount: '12.00',
        attributes: [
          { id: 'type', value: 'Veg' },
          { id: 'gluten', name: 'Gluten Free', value: 'Gluten Free' },
          { id: 'calories', name: 'Calories', value: '120Cal' }
        ]
      },
      {
        id: 107,
        name: 'Chicken tofu',
        description: 'Organic and natural sandwiches with delicious sauces made in all sizes',
        amount: '12.00',
        attributes: [
          { id: 'calories', name: 'Calories', value: '120Cal' }
        ]
      }
    ];
    return (
      <ItemList keyProps={menuItems} showAddButton/>
    );
  }
  );
