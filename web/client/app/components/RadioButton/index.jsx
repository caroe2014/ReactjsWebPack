// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import React, { Component } from 'react';
import styled from 'styled-components';
import { Flex, Text } from 'rebass';
import { LoadingComponent } from 'web/client/app/components/Loader/ReusableLoader';
import i18n from 'web/client/i18n';

const IconParent = styled(Flex)`
  align-items: center;
  margin-bottom: ${props => {
    if (props.capacitytext) return '18px';
    return '15px';
  }};
  width: fit-content;
  &:focus {
    outline: none;
    box-shadow: none;
  }
  & > i {
    color: ${props => props.disabled ? 'grey' : props.theme.colors.buttonControlColor};
    align-items: center;
    align-self: center;
    font-size: ${props => props.size ? props.size : props.theme.fontSize.nm};
    display: inline-block;
    cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  }
  
    ${props => {
    if (props['disabled']) {
      return `
      .option_desc{
          color: ${props.theme.colors.secondaryTextColor} !important;
          cursor: not-allowed !important;
          font-weight: 400 !important;
      }
        `;
    };
  }};
`;

const StyledText = styled(Text)`
  margin-left: 10px;
  color: ${props => props.theme.colors.secondaryTextColor};
  display: inline-block;
  font-size: ${props => props.theme.fontSize.nm};
  font-weight: ${props => {
    if (props.capacitytext) return 500;
    return 400;
  }};
  cursor: pointer;
  &.active {
    font-weight: 500;
    color: ${props => props.theme.colors.buttonControlColor};
  }
  ::first-letter {
    text-transform: uppercase;
  }
`;

const StyledLoadingComponent = styled(LoadingComponent)`
  height: 40px;
  width: 40px; 
`;

const GATenderBalanceContainer = styled(Flex)`
  margin-right:50px;
`;

const GATenderBalance = styled(Flex)`
  color: ${props => props.theme.colors.buttonControlColor};
`;

class RadioButton extends Component {

  constructor (props) {
    super(props);
    this.onHandleClick = this.onHandleClick.bind(this);
    this.clickRadioGroup = this.clickRadioGroup.bind(this);
    this.keyDownRadioGroup = this.keyDownRadioGroup.bind(this);
    this.firstRadioButton = this.firstRadioButton.bind(this);
    this.lastRadioButton = this.lastRadioButton.bind(this);
    this.setRadioButton = this.setRadioButton.bind(this);
    this.nextRadioButton = this.nextRadioButton.bind(this);
  }

  onHandleClick (type) {
    this.props.selectedOption(type || this.props.type);
  }

  firstRadioButton (node) {

    let first = node.parentNode.firstChild;

    while (first) {
      if (first.nodeType === node.ELEMENT_NODE) {
        if (first.getAttribute('role') === 'radio') return first;
      }
      first = first.nextSibling;
    }

    return null;
  }

  lastRadioButton (node) {

    let last = node.parentNode.lastChild;

    while (last) {
      if (last.nodeType === node.ELEMENT_NODE) {
        if (last.getAttribute('role') === 'radio') return last;
      }
      last = last.previousSibling;
    }

    return last;
  }

  nextRadioButton (node) {

    let next = node.nextSibling;

    while (next) {
      if (next.nodeType === node.ELEMENT_NODE) {
        if (next.getAttribute('role') === 'radio') return next;
      }
      next = next.nextSibling;
    }

    return null;
  }

  previousRadioButton (node) {

    let prev = node.previousSibling;

    while (prev) {
      if (prev.nodeType === node.ELEMENT_NODE) {
        if (prev.getAttribute('role') === 'radio') return prev;
      }
      prev = prev.previousSibling;
    }

    return null;
  }

  setRadioButton (node, state) {
    if (state === 'true') {
      node.setAttribute('aria-checked', 'true');
      node.firstChild.className = `fa fa-dot-circle-o ${this.props.ariaLabel} radio-o`;
      node.firstChild.nextSibling.classList.add('active');
      node.tabIndex = 0;
      node.focus();
      this.onHandleClick(node.firstChild.nextSibling.id);
    } else {
      node.setAttribute('aria-checked', 'false');
      node.firstChild.className = `fa fa fa-circle-thin ${this.props.ariaLabel} radio-o`;
      node.firstChild.nextSibling.classList.remove('active');
      node.tabIndex = -1;
    }
  }

  clickRadioGroup (event) {
    const type = event.type;
    if (type === 'click') {
    // If either enter or space is pressed, execute the function

      const node = event.currentTarget;

      let radioButton = this.firstRadioButton(node);

      while (radioButton) {
        this.setRadioButton(radioButton, 'false');
        radioButton = this.nextRadioButton(radioButton);
      }

      this.setRadioButton(node, 'true');

      event.preventDefault();
      event.stopPropagation();
    }
  }

  keyDownRadioGroup (event) {
    const type = event.type;
    let next = false;
    const KEYCODE = {
      DOWN: 40,
      LEFT: 37,
      RIGHT: 39,
      SPACE: 32,
      UP: 38
    };

    if (type === 'keydown') {
      let node = event.currentTarget;
      switch (event.which) {
        case KEYCODE.DOWN:
        case KEYCODE.RIGHT:
          next = this.nextRadioButton(node);
          if (!next) {
            next = this.firstRadioButton(node); // if node is the last node, node cycles to first.
          }
          break;

        case KEYCODE.UP:
        case KEYCODE.LEFT:
          next = this.previousRadioButton(node);
          if (!next) {
            next = this.lastRadioButton(node); // if node is the last node, node cycles to first.
          }
          break;

        case KEYCODE.SPACE:
          next = node;
          break;
      }

      if (next) {
        let radioButton = this.firstRadioButton(node);

        while (radioButton) {
          this.setRadioButton(radioButton, 'false');
          radioButton = this.nextRadioButton(radioButton);
        }

        this.setRadioButton(next, 'true');

        event.preventDefault();
        event.stopPropagation();
      }
    }
  }

  render () {

    const { loader, balanceGA, label, ariaLabel, ariaChecked, tabIndex,
      classDesc, capacityText, disabled, style, buttonSize } = this.props;
    return (
      <IconParent
        capacitytext={capacityText ? 1 : 0}
        onClick={this.clickRadioGroup}
        disabled={disabled}
        size={buttonSize}
        aria-label={ariaLabel}
        tabIndex={tabIndex}
        aria-checked={ariaChecked}
        onKeyDown={this.keyDownRadioGroup}
        role='radio'
        style={style}>
        {<i
          className={`fa fa-circle-thin ${classDesc} radio-o`}
        />}
        <StyledText capacitytext={capacityText ? 1 : 0}
          className={'option_desc'} id={classDesc}>
          {label}
        </StyledText>
        {balanceGA &&
        <React.Fragment>
          <GATenderBalanceContainer capacitytext={capacityText ? 1 : 0}
            aria-live='polite' aria-label={`${i18n.t('GA_BALANCE')} ${balanceGA}`} />
          <GATenderBalance className='account-balance'>{balanceGA}
          </GATenderBalance>
        </React.Fragment>
        }
        {loader &&
          <StyledLoadingComponent height='25px' width='25px' borderSize={2} />}
      </IconParent>
    );
  }
}

export default RadioButton;
