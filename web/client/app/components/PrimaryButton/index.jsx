// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import React from 'react';
import { Button } from 'rebass';
import styled from 'styled-components';

const StyledButton = styled(Button)`
  background-color: ${props => props.theme.colors.buttonControlColor};
  border-radius: 0;
  color: ${props => props.theme.colors.buttonTextColor};
  cursor: pointer;
  font-size: ${props => props.theme.fontSize.md};
  font-weight: 500;
  padding: 20px;
  text-transform: uppercase;
  width: 100%;
  box-shadow: none;
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

export default function PrimaryButton (props) {
  const { classContext, tabIndex, ariaLabel, ...rest } = props;
  return (
    <StyledButton className={classContext} {...rest}
      tabIndex={tabIndex}
      aria-label={ariaLabel}>
      {props.children}
    </StyledButton>
  );
}
