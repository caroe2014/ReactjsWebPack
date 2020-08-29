// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import React from 'react';
import { ButtonCircle } from 'rebass';
import styled from 'styled-components';

const Button = styled(ButtonCircle)`
  background-color: ${props => props.theme.colors.light};
  border: 0.5px solid ${props => props.theme.colors.buttonControlColor};
  border-radius: 0;
  color: ${props => props.theme.colors.buttonControlColor};
  cursor: pointer;
  font-size: ${props => props.theme.fontSize.md};
  font-weight: 500;
  padding: 20px;
  text-transform: uppercase;
  width: 100%
  &:hover {
    box-shadow: 0px 0px 10px 2px lightgrey;
    -webkit-box-shadow: 0px 0px 10px 2px lightgrey;
    -moz-box-shadow: 0px 0px 10px 2px lightgrey;
  }
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

export default function SecondaryButton (props) {
  const { ...rest } = props;
  return (
    <Button {...rest}>
      {props.children}
    </Button>
  );
}
