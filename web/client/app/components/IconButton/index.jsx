// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import React from 'react';
import { ButtonCircle } from 'rebass';
import styled from 'styled-components';

const Button = styled(ButtonCircle)`
  background-color: transparent;
  color: ${props => props.theme.colors.secondaryText};
  cursor: pointer;
  font-size: ${props => props.theme.fontSize.md};
  padding: 0;
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

export default function IconButton (props) {
  const { classContext, iconClassName, ...rest } = props;
  return (
    <Button id={classContext} {...rest}>
      <i className={iconClassName} />
      {props.children}
    </Button>
  );
}
