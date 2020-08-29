// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

const menuData = [
  {
    id: 'home',
    primaryText: 'MENU_DATA_HOME',
    path: '/home',
    icon: 'fa fa-clock-o',
    hidden: false,
    isHome: true
  },
  {
    id: 'profile',
    primaryText: 'MENU_DATA_PROFILE',
    path: '/profile',
    icon: 'fa fa-user',
    hidden: true
  },
  {
    id: 'locations',
    primaryText: 'MENU_DATA_LOCATIONS',
    path: '/',
    icon: 'fa fa-map-marker',
    hidden: true
  },
  {
    id: 'concepts',
    primaryText: 'MENU_CONCEPT',
    path: '/concepts',
    icon: 'fa agilysys-icon-restaurant-menu',
    hidden: false
  },
  {
    id: 'sign-out',
    primaryText: 'MENU_DATA_SIGN_OUT',
    path: '/logout',
    icon: 'fa fa-power-off',
    hidden: false
  }
];

export default class MenuData {
  constructor () {
    this.menuData = menuData.slice();
  }

  getItem (id) {
    return this.menuData.find(item => item.id === id);
  }

  get data () {
    return this.menuData;
  }
};
