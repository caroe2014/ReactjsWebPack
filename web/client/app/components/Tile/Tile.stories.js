// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

/* eslint-disable max-len */
import React from 'react';
import { storiesOf } from '@storybook/react';
import Tile from '.';

storiesOf('Tile Component', module)
  .add('With Images', () => {
    return (
      <Tile image='http://eatstreet.co.id/wp-content/uploads/2016/11/cropped-MASTER-FINAL_LOGO-OVAL-EAT-STREET-1.png'
        title='Eat Street' />
    );
  })
  .add('Without Images', () => {
    return (
      <Tile title='Eat Street' />
    );
  })
  .add('With Images and children', () => {
    return (
      <Tile image='http://eatstreet.co.id/wp-content/uploads/2016/11/cropped-MASTER-FINAL_LOGO-OVAL-EAT-STREET-1.png'
        title='Eat Street'>
        <div>test</div>
      </Tile>
    );
  })
  .add('Without Images and children', () => {
    return (
      <Tile title='Eat Street'>
        <div>test</div>
      </Tile>
    );
  })
  .add('With handleOnClick', () => {
    return (
      <Tile image='http://eatstreet.co.id/wp-content/uploads/2016/11/cropped-MASTER-FINAL_LOGO-OVAL-EAT-STREET-1.png'
        title='Eat Street' OnClick/>
    );
  });
