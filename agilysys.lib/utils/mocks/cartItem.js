// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

export default {
  id: 'LID-cheeseburger-1',
  selectedModifiers: [{
    id: 'LID-add-a-fit-side',
    'description': 'Add a Fit Side',
    'selected': true,
    'amount': '0.00',
    'parentGroupId': 'GID-make-it-a-combo',
    'options': [{
      'id': 'LID-fit-grain-salad',
      'description': 'FIT Grain Salad',
      'selected': true,
      'amount': '0.00',
      'parentGroupId': 'GID-fit-combo'
    },
    {
      'id': '5b525868d2f425000de21a8c',
      'description': 'Carrot Sticks',
      'selected': false,
      'amount': '1.00',
      'parentGroupId': 'GID-fit-combo'
    },
    {
      'id': '5b525868d2f425000de21a66',
      'description': 'Celery Sticks',
      'selected': false,
      'amount': '2.00',
      'parentGroupId': 'GID-fit-combo'
    },
    {
      'id': '5b525868d2f425000de21a86',
      'description': 'Bacon Fat',
      'selected': false,
      'amount': '0.00',
      'parentGroupId': 'GID-fit-combo'
    }
    ]
  },
  {
    'id': 'LID-red-onions',
    'description': 'Red Onions',
    'selected': true,
    'amount': '0.00',
    'parentGroupId': 'GID-add-vegetable'
  }
  ]
};
