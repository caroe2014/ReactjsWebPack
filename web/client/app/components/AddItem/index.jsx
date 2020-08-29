// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import React, { Component } from 'react';
import { Flex } from 'rebass';
import styled from 'styled-components';
import IconButton from 'web/client/app/components/IconButton';

const Input = styled(Flex)`
  padding: 0 5px;
  color: ${props => props.theme.colors.textGrey};
`;

const TileContainer = styled(Flex)`
  border: 0.5px solid ${props => props.theme.colors.textGrey};
  border-radius: 15px;
  padding: 0.2em 0.75em;
  height: 32px;
`;

const Button = styled(IconButton)`
  font-size: ${props => props.theme.fontSize.sm};
  color: ${props => props.theme.colors.textGrey};
  &:focus{
   box-shadow: none;
   outline: none;
  }

`;

class AddItem extends Component {
  constructor (props) {
    super(props);
    this.state = {
      value: this.props.value || 1
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  doDecrement = () => {
    const { min } = this.props;
    if (!min || min < this.state.value) {
      let value = this.state.value - 1;
      this.setState({ value });
      this.handleChange(value);
    }
  }

  doIncrement = () => {
    const { max } = this.props;
    if (!max || max > this.state.value) {
      let value = this.state.value + 1;
      this.setState({ value });
      this.handleChange(value);
    }
  }

  handleChange (value) {
    const { onInputChange } = this.props;
    if (onInputChange) {
      onInputChange(value);
    }
  }

  handleInputChange (e) {
    const target = e.target;
    const value = parseInt(target.value);
    this.setState({ value });
    this.handleChange(value);
  }

  render () {
    const { width } = this.props;
    return (
      <TileContainer width={width ? width + 'px' : 'auto'} >
        <Flex justifyContent='space-around' alignItems='center' width='100%'>
          <Button
            className='decrement-button'
            aria-label='decrement'
            onClick={this.doDecrement}
            iconClassName='fa fa-minus'
            role='button'
          />
          <Input>
            {this.state.value}
          </Input>
          <Button
            className='increment-button'
            aria-label='increment'
            onClick={this.doIncrement}
            iconClassName='fa fa-plus'
            role='button'
          />
        </Flex>
      </TileContainer>
    );
  }
}

export default AddItem;
