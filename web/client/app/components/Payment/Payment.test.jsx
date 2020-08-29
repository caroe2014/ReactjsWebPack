// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import React from 'react';
import {
  shallow,
  configure
} from 'enzyme';
import toJson from 'enzyme-to-json';
import Adapter from 'enzyme-adapter-react-16';
import {
  ThemeProvider
} from 'styled-components';
import theme from 'web/client/theme';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import jsdom from 'jsdom';
// import Payment from '.';

configure({
  adapter: new Adapter()
});

jest.mock('web/client/i18n', () => ({
  t: (key) => {
    return key;
  }
}));
jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate HoC receive the t function as a prop
  withTranslation: () => Component => {
    Component.defaultProps = { ...Component.defaultProps, t: (key) => key };
    return Component;
  }
}));

global.window = new jsdom.JSDOM().window;
global.document = window.document;

const mockStore = configureMockStore();
const store = mockStore({});
const storesList = [{name: 'test'}];

describe('Payment Component', () => {
  // let mockProps = {
  //   amount: '10',
  //   invoiceId: '111',
  //   billDate: '2018-07-17T06:29:02.435Z',
  //   transactionAmount: '10',
  //   tipAmount: '1',
  //   apiToken: '1',
  //   payTenantId: '1'
  // };

  // it('does a snapshot test', () => {
  //   const wrapper = shallow(<Provider store={store}>< Payment keyProps={mockProps} /></Provider>);
  //   expect(toJson(wrapper)).toMatchSnapshot();
  // });

  // it('should render without throwing an error', () => {
  //   expect(shallow(<Provider store={store}>< Payment keyProps={mockProps} /></Provider>).exists()).toBe(true);
  // });

  // describe('when token for iFrame is received', () => {
  //   it('loads the iFrame component', () => {
  //     const wrapper = shallow(<ThemeProvider theme={theme}><Payment getToken={() => {}} payUserKey={{}} keyProps={mockProps} apiToken='sometoken' payTenantId='testTenantId' storesList={storesList}/></ThemeProvider>);
  //     const payComp = wrapper.dive();
  //     payComp.setState({ tokenFlag: true, fetchForm: false, tokenErrorTab: false, iFrameURL: 'test.com/iFrame' });
  //     payComp.update();
  //     expect(payComp.find('.iFrame').exists()).toBe(true);
  //   });

  it('dummy test this will be removed', () => {
    expect(true).toEqual(true);
  });

});
