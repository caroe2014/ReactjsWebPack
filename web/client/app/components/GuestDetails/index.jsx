// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

/* istanbul ignore file */
import React, { Component } from 'react';
import styled from 'styled-components';
import { Flex, Text } from 'rebass';
import PrimaryButton from 'web/client/app/components/PrimaryButton';
import SecondaryButton from 'web/client/app/components/SecondaryButton';
import { Trans } from 'react-i18next';
import { LoadingComponent } from 'web/client/app/components/Loader/ReusableLoader';
import i18n from 'web/client/i18n';
import Announcements from 'web/client/app/components/Announcements';

const GuestIcon = styled(Flex)`
  font-size: 40px;
  text-align: center;
  width: 100%;
  margin-top: 65px;
  margin-bottom: 4px;
  ${props => props.theme.mediaBreakpoints.desktop`margin-top: 38px;`};
  justify-content: center;
  color: ${props => {
    if (props.theme.colors.buttonControlColor) return `${props.theme.colors.buttonControlColor}`;
    return 'transparent';
  }};
`;

const GuestName = styled(Text)`
  color: ${props => props.theme.colors.secondaryTextColor};
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  padding: 10px 20px;
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const AccountText = styled(Text)`
  color: ${props => props.theme.colors.secondaryTextColor};
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  padding: 16px 20px;
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const StyledText = styled(Text)`
  margin-left: 0px;
  color: ${props => props.theme.colors.secondaryTextColor};
  display: inline-block;
  font-size: ${props => props.theme.fontSize.nm};
  font-weight: 400;
  margin-bottom: 15px;
  padding: 0px 20px;
  text-align: center;
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const ErrorContainer = styled(Flex)`
  flex-direction: column;
  height: 100%;
  justify-content: center;
  padding-bottom: 40px;
`;

const LoadingContainer = styled(Flex)`
  flex-direction: column;
  height: 100%;
  justify-content: center;
  padding-bottom: 40px;
`;

const PaymentMethodButton = styled(props => <PrimaryButton {...props} />)`
  border-radius: 4px;
  font-size: 1rem;
  margin-bottom: 15px;
  margin-top: 10px;
  padding: 12px 0;
  text-align: center;
  width: 100%;
  text-transform: uppercase;
  max-width: 300px;
  align-self: center;
  cursor: pointer;
  &:disabled{
    cursor: not-allowed;
  }
`;

const SignOutButton = styled(props => <SecondaryButton {...props} />)`
  font-size: 1rem;
  margin-top: 10px;
  margin-bottom: 20px;
  padding: 5px 0;
  text-align: center;
  width: 90px;
  text-transform: uppercase;
  border: none;
  box-shadow: none;
  align-self: center;
  &:hover{
      box-shadow: none;
  }
`;

class GuestDetails extends Component {
  constructor (props) {
    super(props);
    this.state = {};
    this.onSignOut = this.onSignOut.bind(this);
    this.onPaymentMethod = this.onPaymentMethod.bind(this);
  }

  componentWillMount () {
    if ((!this.props.userName || !this.props.userId) && (this.props.siteAuth.type !== 'atrium')) {
      this.props.fetchUserInfo(this.props.loginMode);
    }
  }
  componentDidMount () {
    document.getElementById('user-name') && document.getElementById('user-name').focus();
  }

  onPaymentMethod () {
    this.props.showSavedCardsPopup(true);
  }

  onSignOut () {
    this.props.signOut();
  }

  render () {
    const { fetchingUser, userName, cardInfo, userInfoError, samlCookie } = this.props;
    return (
      <div className='guest-details' id='guest-details'>
        {fetchingUser && <Announcements message={i18n.t('FETCHING_PROFILE')} />}
        {!fetchingUser && !userInfoError &&
        <Flex flexDirection={'column'}>
          <GuestIcon>
            <i className='fa fa-user-circle' alt='' />
          </GuestIcon>
          {userName &&
            <GuestName className='guest-name' aria-label={userName} id='user-name' tabIndex={0}>
              {userName}
            </GuestName>}
          <AccountText className='guest-name' tabIndex={0} aria-label={i18n.t('GUEST_ACCOUNT')}>
            <Trans i18nKey='GUEST_ACCOUNT' />
          </AccountText>
          { !samlCookie &&
          <PaymentMethodButton
            disabled={!cardInfo || cardInfo.length === 0}
            onClick={this.onPaymentMethod}
            aria-label={i18n.t('PAYMENT_METHODS_LABEL')}
            tabIndex={!cardInfo || cardInfo.length === 0 ? -1 : 0}
          >
            <Trans i18nKey='PAYMENT_METHODS_LABEL'/>
          </PaymentMethodButton>
          }
          <SignOutButton
            onClick={this.onSignOut}
            tabIndex={0}
            role='button'
            aria-label={i18n.t('NAVIGATION_SIGN_OUT')}
          >
            <Trans i18nKey='NAVIGATION_SIGN_OUT'/>
          </SignOutButton>
        </Flex>}
        {fetchingUser &&
          <LoadingContainer>
            <LoadingComponent
              color='#ababab'
              containerHeight='100%'
              containerWidth='100%'
              aria-label={i18n.t('FETCHING_PROFILE')}
              tabIndex={0}
              height='40px'
              width='40px'
              borderSize={4}
              style={{ justifyContent: 'center', height: '60px' }}
            />
            <StyledText>
              <Trans i18nKey='FETCHING_PROFILE'/>
            </StyledText>
          </LoadingContainer>}
        {userInfoError &&
          <ErrorContainer aria-live='polite' tabIndex={0} aria-label={i18n.t('FETCHING_PROFILE_ERROR')}>
            <StyledText>
              <Trans i18nKey='FETCHING_PROFILE_ERROR'/>
            </StyledText>
          </ErrorContainer>}
      </div>
    );
  };
}

export default GuestDetails;
