// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import React from 'react';
import { storiesOf } from '@storybook/react';
import CategoryList from '.';

storiesOf('CategoryList', module)
  .add('With Images', () => {
    const categoryList = [{
      image: 'https://thumbs.dreamstime.com/b/sandwich-plate-28397223.jpg',
      id: '101',
      name: 'Build Your Own Sandwich'
    },
    {
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSaoN_zozVlVN4k6jJlaQOAcr1UbBFA7IJIvxXHjQ5x7o58H-zW6w', // eslint-disable-line max-len
      id: '102',
      name: 'Specials'
    },
    {
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSE4FJOwC6UooDbfKebGZngjvGCC4YQn3XDDrJF-LAJ2hRbv-8V_A', // eslint-disable-line max-len
      id: '103',
      name: 'Sides'
    }
    ];
    return (
      <CategoryList keyProps={categoryList} />
    );
  })
  .add('Without Images', () => {
    const categoryList = [{
      id: '201',
      name: 'Build Your Own Sandwich'
    },
    {
      id: '202',
      name: 'Specials'
    },
    {
      id: '203',
      name: 'Sides'
    }];
    return (
      <CategoryList keyProps={categoryList} />
    );
  });
