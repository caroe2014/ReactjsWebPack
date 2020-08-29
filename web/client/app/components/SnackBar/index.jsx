// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

/* eslint-disable max-len */
import React, { PureComponent } from 'react';
import { Flex } from 'rebass';
import styled from 'styled-components';

const Container = styled(Flex)`
  min-width: 250px;
  text-align: center;
  position: ${props => props.position || 'fixed'};
  z-index: 1;
  bottom: ${props => props.bottom || '30'}px;
  font-size: 1rem;
  width: 250px;
  @-webkit-keyframes fadein {
    from {bottom: 0; opacity: 0;} 
    to {bottom: 30px; opacity: 1;}
  }
  
  @keyframes fadein {
    from {bottom: 0; opacity: 0;}
    to {bottom: 30px; opacity: 1;}
  }
  
  @-webkit-keyframes fadeout {
    from {bottom: 30px; opacity: 1;} 
    to {bottom: 0; opacity: 0;}
  }
  
  @keyframes fadeout {
    from {bottom: 30px; opacity: 1;}
    to {bottom: 0; opacity: 0;}
  }

  .show {
    visibility: visible;
   -webkit-animation: fadein 0.5s; // ,fadeout 0.5s 2.5s
   transition: visibility fadein 0.5s; //  ,fadeout 0.5s 2.5s;
  }
`;

const ChildContainer = styled.div`
  visibility: hidden;
  text-align: center;
  width: 100%;
  background-color: #333;
  padding: 10px;
  border-radius: 2px;
  word-break: break-word;
`;

class SnackBar extends PureComponent {
  message = ''
  constructor (props) {
    super(props);
    this.state = {
      isActive: false
    };
    this.timeoutHandler = this.timeoutHandler.bind(this);
    this.callbackActiveHandler = this.callbackActiveHandler.bind(this);
  }

  openSnackBar = (message = 'Something went wrong...') => {
    this.message = message;
    if (this.timeoutListener) {
      clearTimeout(this.timeoutListener);
    }
    this.setState({ isActive: true }, this.callbackActiveHandler);
  }

  callbackActiveHandler () {
    this.timeoutListener = setTimeout(this.timeoutHandler, 2700);
  }

  timeoutHandler () {
    this.setState({ isActive: false });
  }

  render () {
    const { displayPosition, bottom } = this.props;
    const { isActive } = this.state;
    return (
      <Container
        className='snack-bar'
        position={displayPosition}
        bottom={bottom}
        is-active={isActive}
        style={{display: isActive ? 'flex' : 'none'}}>
        <ChildContainer
          className={`child-container ${isActive ? 'show' : ''}`}>
          {this.message}
        </ChildContainer>
      </Container>
    );
  }
}

export default SnackBar;
