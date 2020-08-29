// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import React from 'react';
import { Flex } from 'rebass';
import styled from 'styled-components';
import IconButton from 'web/client/app/components/IconButton';

const Container = styled(Flex)`
  align-items: center;
  background-color: ${props => props.theme.colors.light};
  justify-content: center;
  padding: 4px;
`;

const Input = styled(Flex)`
  color: ${props => props.theme.colors.primaryText};
  justify-content: center;
  padding: 0 5px;
  min-width: 75px;
  border-bottom: 1px solid lightgrey;
`;
// TODO: Fix this after order-service supports quantity requests
const Button = styled(IconButton)`
  color: ${props => props.theme.colors.primaryText};
  font-weight: 400;
  margin: 0 10px 0 10px;
  font-size: 25px;
`;

export default function IncrementDecrementInput (props) {
  const { decrement, increment, ...rest } = props;
  return (
    <Container {...rest} id='IncrementDecrementInput'>
      <Button
        className='decrement'
        onClick={() => props.decrement()}
        children={<i className='fa fa-minus-circle' aria-hidden='true'/>}
      />
      <Input>
        {props.value}
      </Input>
      <Button
        className='increment'
        onClick={() => props.increment()}
        children={<i className='fa fa-plus-circle' aria-hidden='true' />}
      />
    </Container>
  );
}
