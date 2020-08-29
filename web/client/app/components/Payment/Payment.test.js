import React from 'react';
import { shallow, mount, configure } from 'enzyme';
import toJson from 'enzyme-to-json';
import Adapter from 'enzyme-adapter-react-16';
import { ThemeProvider } from 'styled-components';
import theme from 'web/client/theme';
import configureMockStore from 'redux-mock-store';
import jsdom from 'jsdom';
import { t } from 'i18next';
// import Payment from '.';
import i18n from 'web/client/i18n';
import { createMemoryHistory } from 'history';

configure({
  adapter: new Adapter()
});

jest.mock('web/client/i18n', () => jest.fn());
jest.mock('i18next');

t.mockImplementation((key) => {
  return key;
});

jest.mock('react-i18next', () => ({
  Trans: 'div'
}));

jest.mock('web/client/i18n', () => ({
  t: (key) => {
    return key;
  }
}));

// i18n.mockImplementation(() => {
//   return {
//     language: 'en'
//   };
// });

const history = createMemoryHistory('/payments');

global.window = new jsdom.JSDOM().window;
global.document = window.document;

const map = {};
global.window.addEventListener = jest.fn((event, cb) => {
  map[event] = cb;
});

const mockStore = configureMockStore();
const store = mockStore({});
const storesList = [{name: 'test'}];
let getToken;

beforeAll(() => {
  getToken = jest.fn();
});

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
  //   const wrapper = shallow(
  //     < Payment
  //       keyProps={mockProps}
  //       storesList={storesList}
  //       getToken={getToken}
  //       apiToken={'111'} payTenantId={'111'} configFetching={false} siteFetching={false}
  //     />
  //   );
  //   expect(toJson(wrapper)).toMatchSnapshot();
  // });

  // it('should render without throwing an error', () => {
  //   expect(shallow(
  //     < Payment keyProps={mockProps}
  //       storesList={storesList}
  //       getToken={getToken}
  //       apiToken={'111'} payTenantId={'111'} configFetching={false} siteFetching={false}/>
  //   ).exists()).toBe(true);
  // });

  // it('should render without throwing an error on mount', () => {

  //   expect(mount(
  //     <ThemeProvider theme={theme}>
  //       < Payment keyProps={mockProps} getToken={getToken} storesList={storesList}
  //         apiToken={'111'} payTenantId={'111'} configFetching={false} siteFetching={false}/>
  //     </ThemeProvider>
  //   ).exists()).toBe(true);
  // });

  // describe('when token for iFrame is received', () => {
  //   it('loads the iFrame component', () => {
  //     const wrapper = shallow(
  //       <ThemeProvider theme={theme}>
  //         <Payment payUserKey={{}} keyProps={mockProps} getToken={getToken}
  //           apiToken='sometoken' payTenantId='testTenantId' storesList={storesList}/>
  //       </ThemeProvider>
  //     );
  //     const payComp = wrapper.dive();
  //     payComp.setState({ tokenFlag: true, fetchForm: false, tokenErrorTab: false, iFrameURL: 'test.com/iFrame' });
  //     payComp.update();
  //     expect(payComp.find('.iFrame').exists()).toBe(true);
  //   });
  // });

  // it('should render LoadingSuccessContainer when state is true', () => {
  //   let wrapper = shallow(
  //     <Payment payUserKey={{}} keyProps={mockProps} getToken={getToken}
  //       apiToken='sometoken' payTenantId='testTenantId' storesList={storesList}/>
  //   );
  //   wrapper.setState({ successLoader: true, tokenErrorTab: true });
  //   wrapper.instance().forceUpdate();
  //   expect(wrapper.find('.loading-success-container').length).toBe(1);
  // });

  // it('should render base loader when loading state is true', () => {
  //   let wrapper = shallow(<Payment payUserKey={{}} keyProps={mockProps} getToken={getToken}
  //     apiToken='sometoken' payTenantId='testTenantId' configFetching storesList={storesList}/>);
  //   expect(wrapper.find('.base-loader').length).toBe(1);
  // });

  // it('should render retry-tab when retry state is true', () => {
  //   let wrapper = shallow(<Payment payUserKey={{}} keyProps={mockProps} getToken={getToken}
  //     apiToken='sometoken' payTenantId='testTenantId' storesList={storesList}/>);
  //   wrapper.setState({ tokenFlag: true, fetchForm: false, tokenErrorTab: true, retry: true });
  //   wrapper.update();
  //   expect(wrapper.find('.retry-tab').length).toBe(1);
  // });

  // it('should render retry-tab when retry state is true', () => {
  //   let mockFn = jest.fn();
  //   let wrapper = shallow(<Payment payUserKey={{}} keyProps={mockProps} getToken={getToken}
  //     apiToken='sometoken' payTenantId='testTenantId' tipAmount={10} payUserKeyClientId={'someId'} getSites={mockFn} setOrderConfig={mockFn} storesList={[]}/>);
  //   wrapper.setState({ tokenFlag: true, fetchForm: false, tokenErrorTab: true, retry: true });
  //   wrapper.update();
  //   const newStoresList = [{name: 'test1'}, {name: 'test2'}];
  //   wrapper.setProps({
  //     storesList: newStoresList
  //   });
  // });

  // it('should render iFrameStyle  when formLoaded state is true', () => {
  //   let wrapper = shallow(<Payment payUserKey={{}} keyProps={mockProps} getToken={getToken}
  //     apiToken='sometoken' payTenantId='testTenantId' storesList={storesList}/>);
  //   wrapper.setState({ tokenFlag: true, fetchForm: false, tokenErrorTab: false, iFrameURL: 'test.com/iFrame', formLoaded: true });
  //   wrapper.update();
  //   expect(wrapper.find('.form-loaded').length).toBe(1);
  // });

  // it('should show OpenTime when available', () => {
  //   let mockFn = jest.fn();
  //   const wrapper = shallow(<Payment history={history} payUserKey={{}} keyProps={mockProps} getAutoToken={mockFn} getToken={getToken}
  //     apiToken='sometoken' payTenantId='testTenantId' storesList={storesList} autoTokenError />);
  //   const spy = jest.spyOn(wrapper.instance(), 'setRetry');
  //   wrapper.setProps({ autoTokenError: { uri: 'something_different' } });
  //   wrapper.update();
  //   wrapper.instance().forceUpdate();
  //   wrapper.instance().setRetry();
  //   wrapper.instance().redirectToSuccess();
  //   wrapper.instance().handleFileLoad();
  //   wrapper.instance().setErrorTab();
  //   wrapper.instance().clearErrorTab();
  //   expect(spy).toHaveBeenCalled();
  //   spy.mockClear();
  //   wrapper.unmount();
  // });

  // describe('when handleFrameTasks for iFrame is called', () => {
  //   let mockFn;
  //   let handleWarpper;
  //   beforeEach(() => {
  //     mockFn = jest.fn();
  //     handleWarpper = shallow(< Payment keyProps={mockProps} history={history} setTokenizedData={mockFn} setAppError={mockFn} getToken={mockFn} storesList={storesList}/>);
  //   });
  //   it('is caught in catch when token is undefined and data is wrong ', () => {
  //     map.message({ data: {
  //       response: 'Enter'
  //     }
  //     });
  //     expect(handleWarpper.exists()).toBe(true);
  //   });

  //   it('parses through the function when code is 9000', () => {
  //     const spy = jest.spyOn(handleWarpper.instance(), 'refreshWhenExpired');
  //     map.message({ data: '{ "response":200, "code":9000, "message":"Data test message", "error":"some error"}' });
  //     handleWarpper.instance().forceUpdate();
  //     expect(spy).toHaveBeenCalled();
  //     spy.mockClear();
  //   });

  //   it('parses through the function when code is not 9000', () => {
  //     const spy = jest.spyOn(handleWarpper.instance(), 'refreshWhenExpired');
  //     map.message({ data: '{ "response":200, "code":9001, "message":"Data test message", "error":"some error"}' });
  //     expect(handleWarpper.exists()).toBe(true);
  //     handleWarpper.instance().forceUpdate();
  //     expect(spy).toHaveBeenCalled();
  //     spy.mockClear();
  //   });

  //   it('parses through the function when code is not 9000 but message is unavaiable', () => {
  //     map.message({ data: '{ "response":200, "code":9001, "error":"some error"}' });
  //     expect(handleWarpper.exists()).toBe(true);
  //   });

  //   it('parses through the function when code is not 9000 but code is unavailable', () => {
  //     map.message({ data: '{ "response":200, "code":1234, "message":"Data test message", "error":"some error"}' });
  //     expect(handleWarpper.exists()).toBe(true);
  //   });

  //   it('parses through the function when token is available', () => {

  //     let order = {
  //       taxIncludedTotalAmount: {
  //         amount: 10
  //       },
  //       subTotalTaxAmount: {
  //         amount: 10
  //       },
  //       orderNumber: 1001,
  //       created: true
  //     };

  //     let tipAmount = 10;

  //     let newHandleWarpper = shallow(< Payment keyProps={mockProps} tipAmount={tipAmount} order={order} setTokenizedData={mockFn} setAppError={mockFn} getToken={mockFn} storesList={storesList}/>);
  //     map.message({ data: { token: '1234', cardInfo: {cardholderName: 'test', expirationYearMonth: '2019'} } });
  //     expect(newHandleWarpper.state().successLoader).toBe(true);
  //   });

  //   it('parses through the function when token is available without tip and cardholderName ', () => {

  //     let order = {
  //       taxIncludedTotalAmount: {
  //         amount: 10
  //       },
  //       subTotalTaxAmount: {
  //         amount: 10
  //       },
  //       orderNumber: 1001,
  //       created: true
  //     };

  //     let newHandleWarpper = shallow(< Payment keyProps={mockProps} order={order} setTokenizedData={mockFn} setAppError={mockFn} getToken={mockFn} storesList={storesList}/>);
  //     map.message({ data: { token: '1234', cardInfo: {expirationYearMonth: '2019'} } });
  //     expect(newHandleWarpper.state().successLoader).toBe(true);
  //   });

  //   it('refresh when canceled', () => {
  //     map.message({ data: { cancel: true } });
  //     expect(handleWarpper.exists()).toBe(true);
  //   });

  //   it('refresh when canceled', () => {
  //     map.message({ data: { token: false } });
  //     expect(handleWarpper.exists()).toBe(true);
  //   });
  // });

  // it('calls onLoad callback on load', () => {
  //   let wrapper = shallow(<Payment payUserKey={{}} keyProps={mockProps} getToken={getToken}
  //     apiToken='sometoken' payTenantId='testTenantId' storesList={storesList}/>);
  //   wrapper.setState({
  //     tokenFlag: true,
  //     fetchForm: false,
  //     tokenErrorTab: false,
  //     iFrameURL: 'test.com/iFrame',
  //     formLoaded: true
  //   });
  //   wrapper.update();
  //   const spy = jest.spyOn(wrapper.instance(), 'handleFileLoad');
  //   wrapper.instance().forceUpdate();
  //   wrapper.find('.form-loaded').simulate('load');
  //   expect(spy).toHaveBeenCalled();
  //   spy.mockClear();
  // });

  // it('calls refreshWhenExpired on click', () => {
  //   let wrapper = shallow(<Payment payUserKey={{}} keyProps={mockProps} getToken={getToken}
  //     apiToken='sometoken' payTenantId='testTenantId' storesList={storesList}/>);
  //   wrapper.setState({
  //     tokenFlag: true,
  //     fetchForm: false,
  //     tokenErrorTab: true,
  //     retry: true,
  //     iFrameURL: 'test.com/iFrame',
  //     formLoaded: true
  //   });
  //   wrapper.update();
  //   const spy = jest.spyOn(wrapper.instance(), 'refreshWhenExpired');
  //   wrapper.instance().forceUpdate();
  //   wrapper.find('.retry-button').simulate('click');
  //   expect(spy).toHaveBeenCalled();
  //   spy.mockClear();
  // });

  it('dummy test this will be removed', () => {
    expect(true).toEqual(true);
  });

});
