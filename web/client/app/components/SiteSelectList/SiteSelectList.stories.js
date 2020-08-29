// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import React from 'react';
import { storiesOf } from '@storybook/react';
import SiteSelectList from './SiteSelectList';

storiesOf('SiteSelectList', module)
  .add('With Images', () => {
    const siteItems = [{
      image: 'http://eatstreet.co.id/wp-content/uploads/2016/11/cropped-MASTER-FINAL_LOGO-OVAL-EAT-STREET-1.png',
      name: 'Eat Street',
      availableAt: {
        opens: '9:00am',
        closes: '6:00pm'
      },
      address: ['1000, windward concourse', 'alpharetta,GA, USA']
    },
    {
      image: 'https://i.ebayimg.com/images/g/CXoAAOSwo4pYHIIl/s-l300.jpg',
      name: 'City Central',
      availableAt: {
        opens: '9:00am',
        closes: '5:00pm'
      },
      address: ['3380-146th PI SE', 'Believue,USA']
    },
    {
      image: 'http://www.eamc.in/wp-content/uploads/2015/12/inorbit-logo-2.png',
      name: 'Inorbit',
      availableAt: {
        opens: '9:00am',
        closes: '5:00pm'
      },
      address: ['6775, S Edmond st #100', 'Lasvegas, USA']
    },
    {
      image: 'https://upload.wikimedia.org/wikipedia/commons/7/74/Mall_of_america_logo13.png',
      name: 'Mall of America',
      availableAt: {
        opens: '9:00am',
        closes: '5:00pm'
      },
      address: ['Santa Barbara', 'CA, USA']
    },
    {
      image: 'http://eatstreet.co.id/wp-content/uploads/2016/11/cropped-MASTER-FINAL_LOGO-OVAL-EAT-STREET-1.png',
      name: 'Eat Street',
      availableAt: {
        opens: '9:00am',
        closes: '5:00pm'
      },
      address: ['1000, windward concourse', 'alpharetta,GA, USA']
    },
    {
      image: 'https://i.ebayimg.com/images/g/CXoAAOSwo4pYHIIl/s-l300.jpg',
      name: 'City Central',
      availableAt: {
        opens: '9:00am',
        closes: '5:00pm'
      },
      address: ['3380-146th PI SE', 'Believue,USA']
    },
    {
      image: 'http://www.eamc.in/wp-content/uploads/2015/12/inorbit-logo-2.png',
      name: 'Inorbit',
      availableAt: {
        opens: '9:00am',
        closes: '2:00pm'
      },
      address: ['6775, S Edmond st #100', 'Lasvegas, USA']
    }];
    return (
      <SiteSelectList keyProps={siteItems} />
    );
  })
  .add('Without Images', () => {
    const siteItems = [{
      name: 'Eat Street',
      availableAt: {
        opens: '9:00am',
        closes: '5:00pm'
      },
      address: ['1000, windward concourse', 'alpharetta,GA, USA']
    },
    {
      name: 'City Central',
      availableAt: {
        opens: '9:00am',
        closes: '5:00pm'
      },
      address: ['3380-146th PI SE', 'Believue,USA']
    },
    {
      name: 'Inorbit',
      availableAt: {
        opens: '9:00am',
        closes: '5:00pm'
      },
      address: ['6775, S Edmond st #100', 'Lasvegas, USA']
    },
    {
      name: 'Mall of America',
      availableAt: {
        opens: '9:00am',
        closes: '5:00pm'
      },
      address: ['Santa Barbara', 'CA, USA']
    },
    {
      name: 'Eat Street',
      availableAt: {
        opens: '9:00am',
        closes: '5:00pm'
      },
      address: ['1000, windward concourse', 'alpharetta,GA, USA']
    },
    {
      name: 'City Central',
      availableAt: {
        opens: '9:00am',
        closes: '5:00pm'
      },
      address: ['3380-146th PI SE', 'Believue,USA']
    },
    {
      name: 'Inorbit',
      availableAt: {
        opens: '9:00am',
        closes: '2:00pm'
      },
      address: ['6775, S Edmond st #100', 'Lasvegas, USA']
    },
    {
      name: 'Mall of America',
      availableAt: {
        opens: '9:00am',
        closes: '5:00pm'
      },
      address: ['Santa Barbara', 'CA, USA']
    }];
    return (
      <SiteSelectList keyProps={siteItems} />
    );
  });
