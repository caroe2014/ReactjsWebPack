// Copyright © 2020 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import React from 'react';
import styled from 'styled-components';
import i18n from 'web/client/i18n';

const TabWidget = styled.div`
  display: flex;
  .tab-bar.justify {
    justify-content: space-between; 
  }
  .tab-bar.equal {
    width: 100%; 
  }
  .tab-bar.equal li{
    width: calc(20)%;
  }
  .tab-bar.equal li a{
    display: inline-block;
  }
  .tab-bar.equal li:nth-child(5){
    text-align: right;
  }
`;

const TabContainer = styled.ul`
  position: relative;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap; 
  background-color: transparent;
  border-radius: 0 !important;
  -moz-border-radius: 0 !important;
  list-style: none !important;
  margin-bottom: 10px;
  padding: 0px;
  flex-wrap: no-wrap;
  &:focus {
    outline: none;
    box-shadow: none;
  }
  .active > a:after {
    text-decoration: none;
    position: absolute;
    content: '';
    border-radius: 0px;
    border-bottom: 4px solid ${props => props.theme.colors.buttonControlColor};
    width: 100%;
    bottom: 0px;
    transform: translateX(-50%);
    transition: all 0.33s cubic-bezier(0.38, 0.8, 0.32, 1.07);
    left: 50%;
  }
  .active > a{
    font-size: 16px;
    color: ${props => props.theme.colors.buttonControlColor};
  }
  &::before, &::after{
    content: none;
  }
`;

const TabLink = styled.a`
  position: relative;
  padding: 7px 15px 10px 15px;
  color: ${props => props.theme.colors.primaryTextColor};
  background-color: transparent !important;
  line-height: 13px;
  font-size: 16px;
  cursor: pointer;  
  font-weight: 500;
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

class TabBar extends React.Component {
  constructor (props) {
    super(props);
    const { tabs } = this.props;
    this.state = {
      activeTab: tabs && tabs.length > 0 && tabs[0].id
    };
    this.enterPressed = this.enterPressed.bind(this);
  }

  componentDidMount () {
    if (this.props.selectedTab) {
      this.setState({ activeTab: this.props.selectedTab });
    }
  }

  onTabbarClick (tab) {

    if (this.props.disabled) { return; }

    this.setState({ activeTab: tab.id });
    if (this.props.callbackHandler) {
      this.props.callbackHandler(tab);
    }
  }

  enterPressed (event) {
    const type = event.type;
    let next = false;
    const KEYCODE = {
      LEFT: 37,
      RIGHT: 39,
      SPACE: 32,
      ENTER: 13
    };
    const node = event.currentTarget;
    if (type === 'keydown') {
      switch (event.which) {
        case KEYCODE.RIGHT:
          next = this.nextTabButton(node);
          if (!next) {
            next = this.firstTabButton(node); // if node is the last node, node cycles to first.
          }
          break;

        case KEYCODE.LEFT:
          next = this.previousTabButton(node);
          if (!next) {
            next = this.lastTabButton(node); // if node is the last node, node cycles to first.
          }
          break;

        case KEYCODE.ENTER:
        case KEYCODE.SPACE:
          const tab = this.props.tabs.filter(tab => tab.id === event.currentTarget.dataset.id)[0];
          this.onTabbarClick(tab);

      }

      if (next) {
        let tabButton = this.firstTabButton(node);

        while (tabButton) {
          this.setTabButton(tabButton, 'false');
          tabButton = this.nextTabButton(tabButton);
        }

        this.setTabButton(next, 'true');

        event.preventDefault();
        event.stopPropagation();
      }
    }
  }

  setTabButton (node, state) {
    if (state === 'false') {
      node.tabIndex = -1;
    } else {
      const tab = this.props.tabs.filter(tab => tab.id === node.getAttribute('data-id'))[0];
      node.tabIndex = 0;
      node.focus();
      this.onTabbarClick(tab);
    }

  }

  nextTabButton (node) {

    let next = node.nextSibling;

    while (next) {
      if (next.nodeType === node.ELEMENT_NODE) {
        if (next.getAttribute('role') === 'tab') return next;
      }
      next = next.nextSibling;
    }

    return null;
  }

  firstTabButton (node) {

    let first = node.parentNode.firstChild;

    while (first) {
      if (first.nodeType === node.ELEMENT_NODE) {
        if (first.getAttribute('role') === 'tab') return first;
      }
      first = first.nextSibling;
    }

    return null;
  }

  previousTabButton (node) {

    let prev = node.previousSibling;

    while (prev) {
      if (prev.nodeType === node.ELEMENT_NODE) {
        if (prev.getAttribute('role') === 'tab') return prev;
      }
      prev = prev.previousSibling;
    }

    return null;
  }

  lastTabButton (node) {

    let last = node.parentNode.lastChild;

    while (last) {
      if (last.nodeType === node.ELEMENT_NODE) {
        if (last.getAttribute('role') === 'tab') return last;
      }
      last = last.previousSibling;
    }

    return last;
  }

  render () {
    var addClass = '';
    if (this.props.tabalign === 'justify') {
      addClass = addClass + 'justify ';
    } else if (this.props.tabalign === 'equal') {
      addClass = addClass + 'equal ';
    }
    return (
      <TabWidget className='tabbar-parent'>
        <TabContainer className={'nav tab-bar ' + addClass} tabIndex={0}
          role='tablist' aria-label={i18n.t('FULFILLMENT_LIST')}>
          {this.props.tabs.map((tab, key) => {
            return <li key={key}
              style={{ marginRight: this.props.nomargin ? '0' : '40', outline: 'none', boxShadow: 'none' }}
              className={this.state.activeTab &&
                this.state.activeTab === tab.id ? 'active' : null}
              onClick={() => this.onTabbarClick(tab)}
              tabIndex={0}
              aria-label={tab.displayText}
              data-id={tab.id}
              role='tab'
              onKeyDown={this.enterPressed}>
              <TabLink
                className={(this.props.highlightTextColor
                  ? this.props.highlightTextColor : '') + (this.props.disabled ? ' tabbar-disabled' : '')}
              >
                {tab.displayText}
              </TabLink>
            </li>;
          })}
        </TabContainer>
      </TabWidget>
    );
  }
}

export default TabBar;
