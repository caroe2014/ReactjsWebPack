// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import React from 'react';
import {
  shallow,
  mount,
  configure
} from 'enzyme';
import toJson from 'enzyme-to-json';
import Adapter from 'enzyme-adapter-react-16';
import { ThemeProvider } from 'styled-components';
import theme from 'web/client/theme';
import { t } from 'i18next';

import ContextBar from '.';

configure({
  adapter: new Adapter()
});

jest.mock('i18next');
t.mockImplementation((key) => {
  return key;
});

jest.mock('web/client/i18n', () => ({
  t: (key) => {
    return key;
  }
}));

jest.mock('react-i18next', () => ({
  Trans: 'div'
}));

const props = {
  sites: {
    list: []
  },
  menu: {
    current: {}
  },
  item: {}
};

describe('ContextBar', () => {

  it('does a snapshot test', () => {
    let mockHistory = { goBack: () => {} };
    const wrapper = mount(<ThemeProvider theme={theme}><ContextBar section='site' history={mockHistory} {...props} /></ThemeProvider>);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render without throwing an errorwith additional themes', () => {
    let mockHistory = { goBack: () => {} };
    theme.colors.contextBar = '#000000';
    theme.colors.primaryTextColor = '#ffffff';
    expect(mount(<ThemeProvider theme={theme}><ContextBar section='site' history={mockHistory} {...props}/></ThemeProvider>).exists()).toBe(true);
  });

  describe('case statements', () => {
    let mockHistory;
    let mockSites;
    let mockItem;
    let mockMenu;
    let match;
    beforeEach(() => {
      mockHistory = { goBack: () => {} };
      mockSites = {
        selectedId: 1001,
        list: [
          {
            id: 1001,
            name: 'test',
            availableAt: true
          }
        ]
      };
      mockItem = {
        id: 1001,
        selectItem: {}
      };
      match = {
        params: {
          categoryId: 1
        }
      };
      mockMenu = {
        menuId: 12,
        current: {
          categories: [
            {
              id: 1,
              name: 'test'
            }
          ]
        }
      };
    });

    it('should show OpenTime when available', () => {
      const wrapper = shallow(<ContextBar section='site' sites={mockSites} item={mockItem} showOpenTime showOperationTimes history={mockHistory} {...props}/>);
      const spy = jest.spyOn(wrapper.instance(), 'handleChange');
      wrapper.setProps({ sites: mockSites, item: mockSites, section: 'site' });
      wrapper.setState({ selectedSite: mockSites.list[0] });
      wrapper.update();
      wrapper.instance().forceUpdate();
      expect(spy).toHaveBeenCalled();
      spy.mockClear();
    });

    describe('should render when section is item', () => {
      it('when item is not passed', () => {
        const wrapper = shallow(<ContextBar section='item' sites={mockSites} item={mockItem} showOpenTime showOperationTimes history={mockHistory} {...props}/>);
        const spy = jest.spyOn(wrapper.instance(), 'handleChange');
        wrapper.setProps({ sites: mockSites, item: mockItem, section: 'item' });
        wrapper.setState({ selectedSite: mockSites.list[0] });
        wrapper.update();
        wrapper.instance().forceUpdate();
        expect(spy).toHaveBeenCalled();
        spy.mockClear();
      });
      it('when item displayText is passed', () => {
        mockItem.selectItem.displayText = 'itemTest';
        const wrapper = shallow(<ContextBar section='item' sites={mockSites} item={mockItem} showOpenTime showOperationTimes history={mockHistory} {...props}/>);
        const spy = jest.spyOn(wrapper.instance(), 'handleChange');
        wrapper.setProps({ sites: mockSites, item: mockItem, section: 'item' });
        wrapper.setState({ selectedSite: mockSites.list[0] });
        wrapper.update();
        wrapper.instance().forceUpdate();
        expect(spy).toHaveBeenCalled();
        spy.mockClear();
        expect(wrapper.state().title).toBe('itemTest');
      });
    });

    describe('should render when section is item', () => {
      it('should render when section is menu', () => {
        const wrapper = shallow(<ContextBar section='menu' sites={mockSites} mockMenu={mockMenu} match={match} item={mockItem} showOpenTime showOperationTimes history={mockHistory} {...props}/>);
        const spy = jest.spyOn(wrapper.instance(), 'handleChange');
        wrapper.setProps({ sites: mockSites, item: mockItem, section: 'menu' });
        wrapper.setState({ selectedSite: mockSites.list[0] });
        wrapper.update();
        wrapper.instance().forceUpdate();
        expect(spy).toHaveBeenCalled();
        spy.mockClear();
      });

      it('should satisfy if cond', () => {
        let newMockMenu = {
          menuId: 14,
          current: {
            categories: [
              {
                id: 5,
                name: 'test'
              }
            ]
          }
        };
        const wrapper = shallow(<ContextBar section='menu' sites={mockSites} menu={mockMenu} match={match} item={mockItem} showOpenTime showOperationTimes history={mockHistory} {...props}/>);
        const spy = jest.spyOn(wrapper.instance(), 'handleChange');
        wrapper.setProps({ sites: mockSites, item: mockItem, menu: newMockMenu, section: 'menu' });
        wrapper.setState({ selectedSite: mockSites.list[0] });
        wrapper.update();
        wrapper.instance().forceUpdate();
        expect(spy).toHaveBeenCalled();
        spy.mockClear();
        expect(wrapper.state().title).toBe('');
      });

      it('should satisfy if cond', () => {
        const wrapper = shallow(<ContextBar section='menu' sites={mockSites} menu={mockMenu} match={match} item={mockItem} showOpenTime showOperationTimes history={mockHistory} {...props}/>);
        const spy = jest.spyOn(wrapper.instance(), 'handleChange');
        wrapper.setProps({ sites: mockSites, item: mockItem, menu: mockMenu, section: 'menu', match: match });
        wrapper.setState({ selectedSite: mockSites.list[0] });
        wrapper.update();
        wrapper.instance().forceUpdate();
        expect(spy).toHaveBeenCalled();
        spy.mockClear();
        expect(wrapper.state().title).toBe('');
      });
    });

    it('should render when section is payment', () => {
      const wrapper = shallow(<ContextBar section='payment' sites={mockSites} item={mockItem} showOpenTime showOperationTimes history={mockHistory} {...props}/>);
      const spy = jest.spyOn(wrapper.instance(), 'handleChange');
      wrapper.setProps({ sites: mockSites, item: mockItem, section: 'payment' });
      wrapper.setState({ selectedSite: mockSites.list[0] });
      wrapper.update();
      wrapper.instance().forceUpdate();
      expect(spy).toHaveBeenCalled();
      expect(wrapper.state().title).toEqual(<div i18nKey='CONTEXT_PAYMENT' />);
      spy.mockClear();
    });

    it('should render when section is delivery', () => {
      const wrapper = shallow(<ContextBar section='delivery' sites={mockSites} item={mockItem} showOpenTime showOperationTimes history={mockHistory} {...props}/>);
      const spy = jest.spyOn(wrapper.instance(), 'handleChange');
      wrapper.setProps({ sites: mockSites, item: mockItem, section: 'delivery' });
      wrapper.setState({ selectedSite: mockSites.list[0] });
      wrapper.update();
      wrapper.instance().forceUpdate();
      expect(spy).toHaveBeenCalled();
      expect(wrapper.state().title).toEqual(<div i18nKey='DELIVERY_LOCATION_CONTEXT_LABEL' />);
      spy.mockClear();
    });

    it('should render when section is tip', () => {
      const wrapper = shallow(<ContextBar section='tip' sites={mockSites} item={mockItem} showOpenTime showOperationTimes history={mockHistory} {...props}/>);
      const spy = jest.spyOn(wrapper.instance(), 'handleChange');
      wrapper.setProps({ sites: mockSites, item: mockItem, section: 'tip' });
      wrapper.setState({ selectedSite: mockSites.list[0] });
      wrapper.update();
      wrapper.instance().forceUpdate();
      expect(spy).toHaveBeenCalled();
      expect(wrapper.state().title).toEqual(<div i18nKey='TIP_CAPTURE_CONTEXT_LABEL' />);
      spy.mockClear();
    });

    it('should render when section is namecapture', () => {
      const wrapper = shallow(<ContextBar section='namecapture' sites={mockSites} item={mockItem} showOpenTime showOperationTimes history={mockHistory} {...props}/>);
      const spy = jest.spyOn(wrapper.instance(), 'handleChange');
      wrapper.setProps({ sites: mockSites, item: mockItem, section: 'namecapture' });
      wrapper.setState({ selectedSite: mockSites.list[0] });
      wrapper.update();
      wrapper.instance().forceUpdate();
      expect(spy).toHaveBeenCalled();
      expect(wrapper.state().title).toEqual(<div i18nKey='NAME_CAPTURE_CONTEXT_LABEL' />);
      spy.mockClear();
    });

    it('should render when section is smsnotification', () => {
      const wrapper = shallow(<ContextBar section='smsnotification' sites={mockSites} item={mockItem} showOpenTime showOperationTimes history={mockHistory} {...props}/>);
      const spy = jest.spyOn(wrapper.instance(), 'handleChange');
      wrapper.setProps({ sites: mockSites, item: mockItem, section: 'smsnotification' });
      wrapper.setState({ selectedSite: mockSites.list[0] });
      wrapper.update();
      wrapper.instance().forceUpdate();
      expect(spy).toHaveBeenCalled();
      expect(wrapper.state().title).toEqual(<div i18nKey='SMS_NOTIFICATION_CONTEXT_LABEL' />);
      spy.mockClear();
    });

  });
});
