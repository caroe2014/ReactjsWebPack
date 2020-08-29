// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import React from 'react';
import { shallow, configure } from 'enzyme';
import renderer from 'react-test-renderer';
import axios from 'axios';
import Adapter from 'enzyme-adapter-react-16';

import { HealthCheck } from './health-check';

configure({
  adapter: new Adapter()
});

describe('HealthCheck', () => {

  it('renders correct snapshot', () => {
    const tree = renderer.create(
      <HealthCheck />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render without throwing an error', () => {
    expect(shallow(<HealthCheck />).exists()).toBe(true);
  });

  it('should render without throwing an error', () => {
    let wrapper = shallow(<HealthCheck />);
    wrapper.setState({ error: true });
    expect(shallow(<HealthCheck />).exists()).toBe(true);
  });

  it('should call handleClick and updateHeathCheckSummary when clicked', () => {
    let wrapper = shallow(<HealthCheck />);
    const spy = jest.spyOn(wrapper.instance(), 'handleClick');
    wrapper.instance().forceUpdate();
    wrapper.find('.health-check-link').simulate('click');
    expect(spy).toHaveBeenCalled();
    spy.mockClear();
  });

  it('should call handleClick and updateHeathCheckSummary when clicked but error is thrown', () => {
    let wrapper = shallow(<HealthCheck />);
    axios.get.mockReturnValue(Promise.reject(new Error('error')));
    const spy = jest.spyOn(wrapper.instance(), 'handleClick');
    wrapper.instance().forceUpdate();
    wrapper.find('.health-check-link').simulate('click');
    expect(spy).toHaveBeenCalled();
    spy.mockClear();
  });

  it('should call handleClick and updateManifestmockResponse when clicked', () => {

    let mockResponse = {
      data: {
        someData: 'testData'
      }
    };
    axios.get.mockReturnValue(Promise.resolve(mockResponse));

    let wrapper = shallow(<HealthCheck />);
    const spy = jest.spyOn(wrapper.instance(), 'handleClick');
    wrapper.instance().forceUpdate();
    wrapper.find('.health-check-link2').simulate('click');
    expect(spy).toHaveBeenCalled();
    spy.mockClear();
  });

  it('should call handleClick and updateManifestmockResponse when clicked but error is thrown', () => {
    let wrapper = shallow(<HealthCheck />);
    axios.get.mockReturnValue(Promise.reject(new Error('error')));
    const spy = jest.spyOn(wrapper.instance(), 'handleClick');
    wrapper.instance().forceUpdate();
    wrapper.find('.health-check-link2').simulate('click');
    expect(spy).toHaveBeenCalled();
    spy.mockClear();
  });

});
