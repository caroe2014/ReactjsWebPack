// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import React from 'react';
import {
  shallow,
  mount,
  configure
} from 'enzyme';
import toJson from 'enzyme-to-json';
import Adapter from 'enzyme-adapter-react-16';
import {
  ThemeProvider
} from 'styled-components';
import theme from 'web/client/theme';
import { t } from 'i18next';

import PaymentCard from '.';

configure({
  adapter: new Adapter()
});

jest.mock('web/client/i18n', () => ({
  t: (key) => {
    return key;
  }
}));

jest.mock('react-i18next', () => ({
  Trans: 'div'
}));

jest.mock('../UrlImageLoader', () => ()=> <div id="mockUrlImageLoaderm">
   mockUrlImageLoader
</div>);

const MOCK_APP_CONFIG = {
  contextID: '1',
  tenantID: '1'
};

describe('PaymentCard', () => {
  let mockProps = {
    image: 'https://cdn.freebiesupply.com/logos/large/2x/visa-logo-png-transparent.png',
    id: '101',
    displayLabel: 'CREDIT/ DEBIT CARD',
    name: 'CREDIT/ DEBIT CARD',
    value: 'cardpay',
    type: 'cardpay',
    valid: true
  }
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<PaymentCard keyProps={mockProps} appconfig={MOCK_APP_CONFIG} />);
  });

  it('does a snapshot test', () => {
    const snapWrapper = mount(<ThemeProvider theme={theme}><PaymentCard keyProps={mockProps} appconfig={MOCK_APP_CONFIG} /></ThemeProvider>);
    expect(toJson(snapWrapper)).toMatchSnapshot();
  });

  it('should render without throwing an error', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('should disable if invalid', () => {
    let invalidMock = {
      image: 'https://cdn.freebiesupply.com/logos/large/2x/visa-logo-png-transparent.png',
      id: '101',
      displayLabel: 'CREDIT/ DEBIT CARD',
      name: 'CREDIT/ DEBIT CARD',
      value: 'cardpay',
      type: 'cardpay',
      valid: false
    }
    const invalidWrapper = shallow(<ThemeProvider theme={theme}><PaymentCard keyProps={invalidMock} appconfig={MOCK_APP_CONFIG} /></ThemeProvider>);
    expect(invalidWrapper.exists()).toBe(true);
  });

  it('should show if type is rGuestIframe', () => {
    let iFrameMock = {
      image: 'https://cdn.freebiesupply.com/logos/large/2x/visa-logo-png-transparent.png',
      id: '101',
      displayLabel: 'CREDIT/ DEBIT CARD',
      name: 'CREDIT/ DEBIT CARD',
      value: 'cardpay',
      type: 'rGuestIframe',
      valid: true
    }
    const iFrameWrapper = mount(<ThemeProvider theme={theme}><PaymentCard keyProps={iFrameMock} selectedOptionId={'rGuestIframe'} appconfig={MOCK_APP_CONFIG} /></ThemeProvider>);
    expect(iFrameWrapper.exists()).toBe(true);
  });

  it('should show simulate mouseover', () => {
    let iFrameMock = {
      id: '101',
      displayLabel: 'CREDIT/ DEBIT CARD',
      name: 'CREDIT/ DEBIT CARD',
      value: 'cardpay',
      type: 'rGuestIframe',
      valid: false
    }
    const iFrameWrapper = shallow(<PaymentCard keyProps={iFrameMock} selectedOptionId={'rGuestIframe'} appconfig={MOCK_APP_CONFIG} />);
    const inputMobile = iFrameWrapper.find('.container');
    inputMobile.simulate('mouseover');
  });

  // it('checks whether image prop is recevied', () => {
  //   expect(wrapper.find('.detail-container').props().imageflag).toBe(mockProps.image);
  // });

  describe('when Image prop is undefined', () => {
    let wrapper;

    beforeEach(() => {
      mockProps.image = '';
      wrapper = shallow(<PaymentCard keyProps={mockProps} appconfig={MOCK_APP_CONFIG}/>);
    });

    it('checks whether image prop is not recevied', () => {
      expect(wrapper.find('.image').length).toBe(0);
    });
  });

  describe('when mouse is over the component', () => {
    it('should highlight based on hover state', () => {
      const wrapper = shallow(<PaymentCard keyProps={mockProps} appconfig={MOCK_APP_CONFIG}/>);
      expect(wrapper.state().hover).toBe(false);
      const input = wrapper.find('.container');
      input.simulate('mouseLeave');
      expect(wrapper.state().hover).toBe(false);
      input.simulate('mouseEnter');
      expect(wrapper.state().hover).toBe(true);
    });
  });

  it('should call handleDelete when DeleteButton is clicked', () => {
    let mockFn = jest.fn();
    let wrapper = shallow(<PaymentCard keyProps={mockProps} onSelectOptionList={mockFn} appconfig={MOCK_APP_CONFIG}/>);
    const spy = jest.spyOn(wrapper.instance(), 'handleOption');
    wrapper.instance().forceUpdate();
    wrapper.find('.click-cont').simulate('click');
    expect(spy).toHaveBeenCalled();
    spy.mockClear();
  });

  it('should render Loader when loading state is true', () => {
    let wrapper = mount(<ThemeProvider theme={theme}><PaymentCard keyProps={mockProps} appconfig={MOCK_APP_CONFIG} /></ThemeProvider>);
    wrapper.setState({ keyProps: {type: 'applePay'} });
    wrapper.instance().forceUpdate();
    expect(wrapper.exists()).toBe(true);
  });

});
