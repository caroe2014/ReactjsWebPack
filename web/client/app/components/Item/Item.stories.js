// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import React from 'react';

import { storiesOf } from '@storybook/react';
import Item from './Item';
import { Provider } from 'rebass';
import theme from 'web/client/theme.js';

storiesOf('ItemComponent', module)
  .add('With image', () => {
    const menuItem = {
      id: 100,
      name: 'Mc Alister’s Club ',
      description: 'Organic and natural sandwiches with delicious sauces made in all sizes',
      amount: '12.00',
      image: 'https://imagesvc.timeincapp.com/v3/mm/image?url=http%3A%2F%2Fcdn-image.myrecipes.com%2Fsites%2Fdefault%2Ffiles%2Fstyles%2Fmedium_2x%2Fpublic%2F1426263343%2FBestEverJuicy-Burger_420x420.jpg%3Fitok%3DwNkrRxc4&w=700&q=85', // eslint-disable-line max-len
      tagNames: ['Gluten Free', 'Healthy Choice', 'Calories']
    };
    return (
      <Provider theme={theme}>
        <Item keyProps={menuItem} showAddButton/>
      </Provider>
    );
  }
  );

storiesOf('ItemComponent', module)
  .add('Without image', () => {
    const menuItem = {
      id: 100,
      name: 'Mc Alister’s Club ',
      description: 'Organic and natural sandwiches with delicious sauces made in all sizes',
      amount: '12.00',
      attributes: [
        { id: 'gluten', name: 'Gluten Free', value: 'Gluten Free' },
        { id: 'healthy', name: 'Healthy Choice', value: 'Healthy' }
      ]
    };
    return (
      <Provider theme={theme}>
        <Item keyProps={menuItem} showAddButton/>
      </Provider>
    );
  }
  );

storiesOf('ItemComponent', module)
  .add('With 2 line desc', () => {
    const menuItem = {
      id: 100,
      name: 'Mc Alister’s Club ',
      description: 'Organic and natural sandwiches with delicious sauces made in all sizes',
      image: 'https://imagesvc.timeincapp.com/v3/mm/image?url=http%3A%2F%2Fcdn-image.myrecipes.com%2Fsites%2Fdefault%2Ffiles%2Fstyles%2Fmedium_2x%2Fpublic%2F1426263343%2FBestEverJuicy-Burger_420x420.jpg%3Fitok%3DwNkrRxc4&w=700&q=85', // eslint-disable-line max-len
      amount: '12.00',
      attributes: [
        { id: 'gluten', name: 'Gluten Free', value: 'Gluten Free' },
        { id: 'healthy', name: 'Healthy Choice', value: 'Healthy' }
      ]
    };
    return (
      <Provider theme={theme}>
        <Item keyProps={menuItem} showAddButton/>
      </Provider>
    );
  }
  );

storiesOf('ItemComponent', module)
  .add('With multi line desc', () => {
    const menuItem = {
      id: 100,
      name: 'Mc Alister’s Club ',
      description: 'Organic and natural sandwiches with delicious sauces made in all sizes. Sandwiches filled with nice cut veggies with slightly coated cheese.', // eslint-disable-line max-len
      image: 'https://imagesvc.timeincapp.com/v3/mm/image?url=http%3A%2F%2Fcdn-image.myrecipes.com%2Fsites%2Fdefault%2Ffiles%2Fstyles%2Fmedium_2x%2Fpublic%2F1426263343%2FBestEverJuicy-Burger_420x420.jpg%3Fitok%3DwNkrRxc4&w=700&q=85', // eslint-disable-line max-len
      amount: '12.00',
      attributes: [
        { id: 'gluten', name: 'Gluten Free', value: 'Gluten Free' },
        { id: 'healthy', name: 'Healthy Choice', value: 'Healthy' },
        { id: 'calories', name: 'Calories', value: '120Cal' }
      ]
    };
    return (
      <Provider theme={theme}>
        <Item keyProps={menuItem} showAddButton/>
      </Provider>
    );
  }
  );

storiesOf('ItemComponent', module)
  .add('Without amount', () => {
    const menuItem = {
      id: 100,
      name: 'Mc Alister’s Club ',
      description: 'Organic and natural sandwiches with delicious sauces made in all sizes',
      image: 'https://imagesvc.timeincapp.com/v3/mm/image?url=http%3A%2F%2Fcdn-image.myrecipes.com%2Fsites%2Fdefault%2Ffiles%2Fstyles%2Fmedium_2x%2Fpublic%2F1426263343%2FBestEverJuicy-Burger_420x420.jpg%3Fitok%3DwNkrRxc4&w=700&q=85', // eslint-disable-line max-len
      attributes: [
        { id: 'gluten', name: 'Gluten Free', value: 'Gluten Free' },
        { id: 'healthy', name: 'Healthy Choice', value: 'Healthy' },
        { id: 'calories', name: 'Calories', value: '120Cal' }
      ]
    };
    return (
      <Provider theme={theme}>
        <Item keyProps={menuItem} showAddButton/>
      </Provider>
    );
  }
  );

storiesOf('ItemComponent', module)
  .add('With 1 tile', () => {
    const menuItem = {
      id: 100,
      name: 'Mc Alister’s Club ',
      description: 'Organic and natural sandwiches with delicious sauces made in all sizes',
      image: 'https://imagesvc.timeincapp.com/v3/mm/image?url=http%3A%2F%2Fcdn-image.myrecipes.com%2Fsites%2Fdefault%2Ffiles%2Fstyles%2Fmedium_2x%2Fpublic%2F1426263343%2FBestEverJuicy-Burger_420x420.jpg%3Fitok%3DwNkrRxc4&w=700&q=85', // eslint-disable-line max-len
      amount: '12.00',
      attributes: [
        { id: 'healthy', name: 'Healthy Choice', value: 'Healthy' }
      ]
    };
    return (
      <Provider theme={theme}>
        <Item keyProps={menuItem} showAddButton/>
      </Provider>
    );
  }
  );

storiesOf('ItemComponent', module)
  .add('With no tiles', () => {
    const menuItem = {
      id: 100,
      name: 'Mc Alister’s Club ',
      description: 'Organic and natural sandwiches with delicious sauces made in all sizes',
      image: 'https://imagesvc.timeincapp.com/v3/mm/image?url=http%3A%2F%2Fcdn-image.myrecipes.com%2Fsites%2Fdefault%2Ffiles%2Fstyles%2Fmedium_2x%2Fpublic%2F1426263343%2FBestEverJuicy-Burger_420x420.jpg%3Fitok%3DwNkrRxc4&w=700&q=85', // eslint-disable-line max-len
      amount: '12.00'
    };
    return (
      <Provider theme={theme}>
        <Item keyProps={menuItem} showAddButton/>
      </Provider>
    );
  }
  );
