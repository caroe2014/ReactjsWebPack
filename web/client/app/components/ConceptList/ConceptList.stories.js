// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import React from 'react';
import { storiesOf } from '@storybook/react';
import ConceptList from '.';

storiesOf('ConceptList', module)
  .add('With Images', () => {
    const siteItems = [{
      image: 'https://www.freeiconspng.com/uploads/environment-icon-png-16.png',
      id: '101',
      name: 'Pickle'
    },
    {
      image: 'https://www.milkmaid.in/Images/Recipe/Chocolate%20694x400_11.JPG',
      id: '102',
      name: 'Ice Berg'
    },
    {
      image: 'https://www.freeiconspng.com/uploads/chicken-caesar-salad-png-23.png',
      id: '103',
      name: 'Go Green'
    },
    {
      image: 'https://bakingmischief.com/wp-content/uploads/2016/05/chicken-shawarma-with-yogurt-sauce-image-square1.jpg', // eslint-disable-line max-len
      id: '104',
      name: 'Made Nice'
    }
    ];
    return (
      <ConceptList keyProps={siteItems} />
    );
  })
  .add('Without Images', () => {
    const siteItems = [{
      id: '101',
      name: 'Pickle'
    },
    {
      id: '102',
      name: 'Ice Berg',
      image: 'https://www.freeiconspng.com/uploads/chicken-caesar-salad-png-23.png'
    },
    {
      id: '103',
      name: 'Go Green'
    },
    {
      id: '104',
      name: 'Made Nice'
    }];
    return (
      <ConceptList keyProps={siteItems} />
    );
  });
