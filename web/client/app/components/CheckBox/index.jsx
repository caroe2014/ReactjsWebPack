// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import React, { Component } from 'react';
import styled from 'styled-components';
import { Flex, Text } from 'rebass';

const IconParent = styled(Flex)`
  align-items: center;
  width: fit-content;
  & > i {
    color: ${props => props.disabled ? 'grey' : props.theme.colors.buttonControlColor};
    align-items: center;
    font-size: 18px;
    display: inline-block;
    cursor: ${props => props.disabled ? 'auto' : 'pointer'};
    padding: 10px 8px 10px 10px;
    margin-left: -11px;
    ${props => props.theme.mediaBreakpoints.mobile`margin-left: -8px;`}
  }
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const StyledText = styled(Text)`
  margin-left: 10px;
  color: ${props => props.theme.colors.PrimaryTextColor};
  display: inline-block;
  font-size: ${props => props.theme.fontSize.nm};
  font-weight: ${props => {
    if (props.capacitytext) return 500;
    return 400;
  }};
  cursor: pointer;
  &.active {
    font-weight: 500;
    color: ${props => props.theme.colors.PrimaryTextColor};
  }
`;

class CheckBox extends Component {

  constructor (props) {
    super(props);
    this.onHandleClick = this.onHandleClick.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  onHandleClick () {
    this.props.selectedOption();
  }

  handleKeyDown (event) {
    if (event.which === 13 || event.which === 32) {
      this.onHandleClick();
    }
  }

  render () {
    const { selected, ariaChecked, ariaLabel, tabIndex, label,
      classDesc, capacityText, style, buttonSize} = this.props;
    return (
      <IconParent
        capacitytext={capacityText ? 1 : 0}
        onClick={this.onHandleClick}
        onKeyDown={this.handleKeyDown}
        size={buttonSize}
        style={style}
        role='checkbox'
        aria-label={ariaLabel}
        aria-checked={ariaChecked}
        tabIndex={tabIndex}>
        {<i
          className={`${selected ? 'fa agilysys-icon-check-box'
            : 'fa agilysys-icon-check-box-outline-blank'} ${classDesc} checkbox-o`}
        /> }
        <StyledText capacitytext={capacityText ? 1 : 0} className={`option_desc ${selected ? 'active' : ''}`}>
          {label}
        </StyledText>
      </IconParent>
    );
  }
}

export default CheckBox;
