// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import React from 'react';
import { Flex } from 'rebass';
import styled from 'styled-components';
// import IconButton from '../../components/IconButton/IconButton';

const Container = styled(Flex)`
  align-items: center;
  background-color: ${props => props.theme.colors.light};
  border: 0.5px solid ${props => props.theme.colors.primaryText};
  border-radius: 20px;
  justify-content: center;
  padding: 4px;
`;

const Input = styled(Flex)`
  color: ${props => props.theme.colors.primaryText};
  justify-content: center;
  padding: 0 5px;
  min-width: 45px;
`;
// TODO: Fix this after order-service supports quantity requests
// const Button = styled(IconButton)`
//   color: ${props => props.theme.colors.primaryText};
//   font-weight: 400;
//   margin: 0 10px 0 10px
// `;

export default function IncrementInput (props) {
  const { decrement, increment, ...rest } = props;
  return (
    <Container {...rest} id='IncrementInput'>
      {/* TODO: Fix this after order-service supports quantity requests */}
      {/* <Button
        onClick={() => props.decrement()}
        children='&minus;'
      />
      <Input>
        {props.value}
      </Input>
      <Button
        onClick={() => props.increment()}
        children='&#43;'
      /> */}
      <Input style={{ fontWeight: '100', padding: '0px 27px' }}>
        Quantity {props.value}
      </Input>
    </Container>
  );
}
