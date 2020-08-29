// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Drawer, Flex } from 'rebass';
import PrimaryButton from 'web/client/app/components/PrimaryButton';
import Announcements from 'web/client/app/components/Announcements';

const NotificationContainer = styled(Drawer)`
  display: flex;
  background-color: rgba(0,0,0,.7);
  border-radius: 10px;
  color: ${props => props.theme.colors.light};
  box-shadow: -1px 0 2px rgba(0,0,0,0.5);
  margin-bottom: 35px;
  margin-left: auto;
  margin-right: auto;
  min-width: 400px;
  max-width: 800px;
  &:hover {
    box-shadow: none;
  }
  ${props => props.theme.mediaBreakpoints.mobile`
    min-width: 300px;
  `}
`;

const MainButton = styled(props => <PrimaryButton {...props} />)`
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
  min-width: 50px;
  padding: 4px;
  text-align: center;
  margin: 0;
  margin-left: auto;
  background: none;
  width: auto;
  white-space: nowrap;
  color: ${props => props.theme.colors.light};
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

class NotificationBar extends Component {

  constructor (props) {
    super(props);
    this.closeNotificationBar = this.closeNotificationBar.bind(this);
  }

  componentDidUpdate (prevProps) {
    if (!prevProps.open && this.props.open) {
      this.closeNotificationBar();
    }
  }

  closeNotificationBar () {
    if (this.props.open) {
      setTimeout(
        function () {
          this.props.onActionClick();
        }.bind(this),
        4000
      );
    }
  }

  render () {
    const { open, text, actionButtonText, onActionClick } = this.props;
    return (
      <Flex>
        {open &&
        <NotificationContainer
          role='alert'
          open={open}
          side='bottom'
          p={3}>
          <Announcements message={text} ariaLive='assertive'/>
          <span tabIndex={0} style={{outline: 'none', boxShadow: 'none'}}
            aria-label={text}>{text}</span>
          <MainButton
            children={actionButtonText}
            onClick={onActionClick}
            tabIndex={0}
            aria-label={actionButtonText}
            role='button'
          />
        </NotificationContainer>
        }
      </Flex>
    );
  }
}

NotificationBar.propTypes = {
  open: PropTypes.bool,
  actionButtonText: PropTypes.object,
  onActionClick: PropTypes.func,
  text: PropTypes.string
};

export default NotificationBar;
