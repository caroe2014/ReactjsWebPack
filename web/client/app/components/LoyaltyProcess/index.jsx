// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import React, { Component } from 'react';
import styled from 'styled-components';
import { Label, Flex, Text, Button, Heading, Modal as ModalWindow, Fixed } from 'rebass';
import { Trans } from 'react-i18next';
import RadioButton from 'web/client/app/components/RadioButton';
import IconButton from 'web/client/app/components/IconButton';
import LoyaltyActivity from 'web/client/app/components/LoyaltyActivity';
import i18n from 'web/client/i18n';
import get from 'lodash.get';
import Loader from 'web/client/app/components/Loader/index';

const ModalContainer = styled(ModalWindow)`
  border-radius: 4px;
  z-index: 1101;
  width: 420px;
  padding: 15px;
  height: 100%;
  max-height: 600px;
  display: flex;
  flex-direction: column;
  ${props => props.theme.mediaBreakpoints.mobile`width: 100%; border-radius: 0px; height: 100%; max-height: 100%;`};
`;

const LoadingContainer = styled(Fixed)`
  display:flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  opacity: 1;
  will-change: opacity;
  transition: opacity 225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
`;

const ModalBackground = styled(Fixed)`
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1101;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  opacity: 1;
  will-change: opacity;
  transition: opacity 225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
`;

const AccountParent = styled(Flex)`
  flex-direction: column;
  width: 100%;
  padding: 0px 24px;
`;

const MessageContainer = styled(Flex)`
  padding: 0px 0px 48px;
  padding: ${props => {
    if (props.success) return '38px 0px 48px;';
    return '0px 0px 48px';
  }};
  & > i {
    color: ${props => props.theme.colors.buttonControlColor};
    align-items: center;
    font-size: ${props => props.theme.fontSize.nm};
    padding-right: 10px;
  }
`;

const LoyaltyButton = styled(Button)`
  background-color:  ${props => props.theme.colors.buttonControlColor};
  margin: 20px 0px 10px;
  border-radius: 0;
  color: ${props => props.theme.colors.buttonTextColor};
  cursor: pointer;
  font-size: ${props => props.theme.fontSize.nm};
  font-weight: 400;
  padding: 12px;
  text-transform: uppercase;
  width: 100%;
  min-width: 240px;
  height: 40px;
  &:hover {
    box-shadow: 0px 0px 10px 2px lightgrey;
    -webkit-box-shadow: 0px 0px 10px 2px lightgrey;
    -moz-box-shadow: 0px 0px 10px 2px lightgrey;
  }
  text-align: center;
  border: none;
  border-radius: 6px;
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const ButtonParent = styled(Flex)`
  flex-direction: column;
  justify-content: center;
  margin-top: 4px;
`;

const LoyaltyButtonParent = styled(Flex)`
  flex-direction: column;
  justify-content: center;
  margin-top: 4px;
`;

const ReEnterButton = styled(Button)`
  background-color:  ${props => props.theme.colors.buttonControlColor};
  margin: 0px 0px 10px;
  color: ${props => props.theme.colors.buttonTextColor};
  cursor: pointer;
  font-size: ${props => props.theme.fontSize.nm};
  font-weight: 400;
  padding: 12px;
  text-transform: uppercase;
  width: 100%;
  min-width: 240px;
  height: 40px;
  margin-top: 20px;
  &:hover {
    box-shadow: 0px 0px 10px 2px lightgrey;
    -webkit-box-shadow: 0px 0px 10px 2px lightgrey;
    -moz-box-shadow: 0px 0px 10px 2px lightgrey;
  }
  text-align: center;
  border: none;
  border-radius: 0px;
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const ReEnterTextParent = styled(Flex)`
  justify-content: center;
  max-width: 420px;
  width: 100%;
`;

const ReEnterTextButton = styled(Text)`
  margin: 10px 0px;
  color: ${props => props.theme.colors.buttonControlColor};
  cursor: pointer;
  font-weight: 500;
  font-size: ${props => props.theme.fontSize.nm};
  text-transform: uppercase;
  text-align: center;
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const RadioButtonContainer = styled(Flex)`
  flex-direction: column;
  width: 100%;
`;

const HeaderText = styled(Heading)`
  width: 100%;
  word-break: break-word;
  font-weight: bold;
  font-size: 24px;
  color: ${props => props.theme.colors.primaryTextColor};
  margin: 48px 0px 38px;
  text-align: center;
  padding-left: 24px;
  padding-right: 24px;
  ${props => props.theme.mediaBreakpoints.mobile`
    margin: 32px 0px 18px;
  `};
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const MessageLabel = styled(Label)`
  color: ${props => props.theme.colors.primaryTextColor};
  font-size: ${props => props.theme.fontSize.nm};
  font-weight: 400;
  text-align: center;
  align-self: center;
  justify-content: center;
  max-width: 100%;
  ${props => props.theme.mediaBreakpoints.mobile`
  `};
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const CloseButton = styled(props => <IconButton {...props} />)`
  color: ${props => props.theme.colors.textGrey};
  font-size: ${props => props.theme.fontSize.md};
  font-weight: 300;
  position: absolute;
  top: 15px;
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
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const RetryParent = styled(Flex)`
  padding: 0px 48px;
  flex-direction: column;
  ${props => props.theme.mediaBreakpoints.mobile`padding: 0px 24px;`};
`;

class LoyaltyProcess extends Component {

  constructor (props) {
    super(props);
    const accrueSelection = get(this.props.loyaltyProcess, `loyaltyLinkedAccounts[0].loyaltyAccountTiers[0]`, {}); // TODO: replace these
    this.state = {
      selectedOption: get(this.props.cartLoyaltyInfo, 'selectedOption', ''),
      accrueSelection,
      showAccount: !!accrueSelection.accountNumber || this.props.isAccountEmpty || this.props.inquiryError
    };

    this.checkSelected = this.checkSelected.bind(this);
    this.onAccureSubmit = this.onAccureSubmit.bind(this);
    this.setScreenState = this.setScreenState.bind(this);
    this.handleLoyaltyInfo = this.handleLoyaltyInfo.bind(this);
    this.onReEnterClick = this.onReEnterClick.bind(this);
    this.onClickClose = this.onClickClose.bind(this);
    this.onEscape = this.onEscape.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);

    this.loyaltyAccountMap = {
      phone: 'LOYALTY_PHONE_ACCOUNT_ASSOCIATE',
      account: 'LOYALTY_ACCOUNT_ACCOUNT_ASSOCIATE',
      card: 'LOYALTY_CARD_ACCOUNT_ASSOCIATE'
    };
    this.loyaltyNoAccountMap = {
      phone: `${i18n.t('LOYALTY_COMMON_NO_ACCOUNT')} ${i18n.t('PHONE_NUMBER')}`,
      account: `${i18n.t('LOYALTY_COMMON_NO_ACCOUNT')} ${i18n.t('ACCOUNT_NUMBER')}`,
      card: `${i18n.t('LOYALTY_COMMON_NO_ACCOUNT')} ${i18n.t('CARD_NUMBER')}`
    };
  }

  componentWillMount () {
    this.setScreenState(this.props);
  }

  componentDidMount () {
    document.getElementById('accrual-modal-title') &&
      document.getElementById('accrual-modal-title').focus();
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.loyaltyProcess !== nextProps.loyaltyProcess) {
      this.setState({
        selectedOption: get(this.props.cartLoyaltyInfo, `selectedOption`, '')
      }, () => this.setScreenState(nextProps));
    }
    if (this.props.fetching !== nextProps.fetching && !nextProps.fetching) {
      this.setState({
        showAccount: true,
        accrueSelection: get(nextProps.loyaltyProcess, `loyaltyLinkedAccounts[0].loyaltyAccountTiers[0]`, {})
      }, () => nextProps.inquiryError && this.setScreenState(nextProps));
    }
    if (this.props.cartLoyaltyInfo !== nextProps.cartLoyaltyInfo) {
      this.setScreenState(this.props);
    }
  }

  setScreenState (props) {
    const { showAccountSelection } = props.loyaltyProcess;
    const { selectedOption } = this.state;
    const { cartLoyaltyInfo, error, inquiryError, loyaltyDetails, loyaltyInfo } = props;
    const loyaltyInfoCart = cartLoyaltyInfo && cartLoyaltyInfo.loyaltyInfo;
    const loyaltyInfoData = loyaltyInfoCart || loyaltyInfo;
    const selectedCartOption = cartLoyaltyInfo && cartLoyaltyInfo.selectedOption;
    let message;
    let showIcon = false;
    const linkedAccount = get(props, `loyaltyProcess.loyaltyLinkedAccounts`, []);
    if (selectedCartOption && showAccountSelection && linkedAccount.length !== 0) {
      message = `${i18n.t(this.loyaltyAccountMap[selectedCartOption], {number: loyaltyInfoData})} ${linkedAccount.length > 1 ? i18n.t('ACCOUNTS_LABEL') : i18n.t('ACCOUNT_LABEL')}:`; // eslint-disable-line max-len
    } else if (error || inquiryError) {
      message = loyaltyDetails.accountInquiryFailureText || i18n.t('LOYALTY_FETCH_ERROR');
    } else if ((selectedCartOption || selectedOption) && linkedAccount.length === 0 && loyaltyInfoData) {
      message = `${this.loyaltyNoAccountMap[selectedOption || selectedCartOption]} ${loyaltyInfoData.formatNumber}`;
      showIcon = false;
    }
    this.setState({message, showIcon});
  }

  checkSelected (type) {
    this.setState({ accrueSelection: type });
  }

  onAccureSubmit () {
    const { isPointAccrued, error, inquiryError, accessible } = this.props;
    !isPointAccrued && !error && !inquiryError && accessible('loyalty');
    this.props.sendLoyaltyAccrue(this.state.accrueSelection.accountNumber || this.state.accrueSelection);
  }

  onReEnterClick () {
    this.setState({showAccount: false});
  }

  handleLoyaltyInfo (loyaltyInquiryInfo) {
    this.props.paymentConfirmation && this.props.accessible('loyalty');
    this.props.sendLoyaltyInquiry(loyaltyInquiryInfo, loyaltyInquiryInfo.selectedOption, loyaltyInquiryInfo.siteId, loyaltyInquiryInfo.displayProfileId, true); // eslint-disable-line max-len
    this.setState({showAccount: true});
  }

  getAccrueLabel (loyaltyAccount) {
    return `${loyaltyAccount.name},\xa0\xa0\xa0****${loyaltyAccount.accountNumber.substring(loyaltyAccount.accountNumber.length - 4)},\xa0\xa0\xa0${loyaltyAccount.tier}`; // eslint-disable-line max-len
  }

  onRetry () {
    const { siteId, sendLoyaltyInfo, cartLoyaltyInfo, sendLoyaltyInquiry, inquiryError, displayProfileId } = this.props;
    if (inquiryError) {
      sendLoyaltyInquiry(cartLoyaltyInfo.loyaltyInfo, cartLoyaltyInfo.selectedOption, siteId, displayProfileId, true);
    } else {
      sendLoyaltyInfo(siteId, displayProfileId, false, true);
    }
  }

  onClickClose () {
    this.props.accessible('loyalty');
    this.props.closeModal();
  }

  onEscape (e) {
    if (e.which === 27) {
      this.onClickClose();
    }
  }

  handleKeyDown (e) {
    // TODO: make this usable by all clickable elements,
    //  pass in caller's onclickhandler (13 is keycode for enter key, 32 is spacebar)
    if (e.which === 13 || e.which === 32) {
      this.onReEnterClick();
    }
  }

  render () {
    const { showAccountSelection,
      accrueError, isPointAccrued } = this.props.loyaltyProcess;
    const { showAccount, message, showIcon } = this.state;
    const { loyaltyDetails, siteId, error, inquiryError, fetching, cartLoyaltyInfo, cancelLoyalty } = this.props;
    const linkedAccount = get(this.props, `loyaltyProcess.loyaltyLinkedAccounts`, []);

    return (
      <Flex className='container-parent' id='accrual-modal'>
        <ModalBackground className='guest-profile-modal-background'/>
        <ModalContainer className='loyalty-process-container' role='dialog' onKeyDown={this.onEscape}>
          <div className='mobile-background'/>
          {(showAccount && !fetching && !cancelLoyalty && message)
            ? <AccountParent className='loyalty-process-account-parent'>
              <HeaderText className='loyalty-process-header' tabIndex={0} id='accrual-modal-title'
                aria-label={(loyaltyDetails && loyaltyDetails.header) || i18n.t('LOYALTY_CAPTURE_POINTS')}>
                {(loyaltyDetails && loyaltyDetails.header) || <Trans i18nKey='LOYALTY_CAPTURE_POINTS'/>}
              </HeaderText>
              <MessageContainer className='msg-parent' success={showIcon}>
                {showIcon && <i className='fa fa-check-circle' alt='' />}
                <MessageLabel className='msg-label' tabIndex={0}
                  aria-label={message}>
                  {message}
                </MessageLabel>
              </MessageContainer>
              {showAccountSelection && linkedAccount.length !== 0 &&
              <RadioButtonContainer className='radio-parent' role='radiogroup'>
                {
                  linkedAccount.length > 1 || linkedAccount[0].loyaltyAccountTiers.length > 1
                    ? linkedAccount.map(account => (
                      account.loyaltyAccountTiers.map((accountItems, index) => (
                        <React.Fragment key={`account-${index}`}>
                          <RadioButton
                            className={`${accountItems.accountNumber}-radio`}
                            classDesc={`${accountItems.accountNumber}`}
                            label={this.getAccrueLabel(accountItems)}
                            type={accountItems.accountNumber}
                            selectedOption={this.checkSelected}
                            tabIndex={0}
                            ariaLabel={this.getAccrueLabel(accountItems)}
                          />
                        </React.Fragment>
                      ))
                    )) : <StyledText style={{fontWeight: 'bold'}} tabIndex={0}
                      aria-label={this.getAccrueLabel(linkedAccount[0].loyaltyAccountTiers[0])}>
                      {this.getAccrueLabel(linkedAccount[0].loyaltyAccountTiers[0])}
                    </StyledText>}
              </RadioButtonContainer>}

              {accrueError && <StyledText className='error-text' style={{ color: 'red' }} tabIndex={0}
                aria-label={i18n.t('LOYALTY_ACCRUE_ERROR')} aria-live='polite'>
                <Trans i18nKey='LOYALTY_ACCRUE_ERROR'/>
              </StyledText>}

              {!isPointAccrued && !error && !inquiryError &&
              <ButtonParent className='button-parent'>
                {linkedAccount.length !== 0
                  ? <React.Fragment>
                    <LoyaltyButtonParent>
                      <LoyaltyButton className='submit-button'
                        tabIndex={0} aria-label={i18n.t('ACCRUE_TO_ACCOUNT')}
                        role='button' onClick={this.onAccureSubmit}>
                        <Trans i18nKey='ACCRUE_TO_ACCOUNT'/>
                      </LoyaltyButton>
                    </LoyaltyButtonParent>
                    <ReEnterTextParent>
                      <ReEnterTextButton className='reEnter-text-button' tabIndex={0} aria-label={i18n.t('RE_ENTER')}
                        role='button' onKeyDown={this.handleKeyDown} onClick={this.onReEnterClick}>
                        <Trans i18nKey='RE_ENTER'/>
                      </ReEnterTextButton>
                    </ReEnterTextParent>
                  </React.Fragment>
                  : <ReEnterButton className='re-enter-button' tabIndex={0} aria-label={i18n.t('RE_ENTER')}
                    role='button' onKeyDown={this.handleKeyDown} onClick={this.onReEnterClick}>
                    <Trans i18nKey='RE_ENTER'/>
                  </ReEnterButton>}
              </ButtonParent>}
              {(error || inquiryError) &&
              <RetryParent>
                <ReEnterButton className='re-enter-button' role='button'
                  aria-label={i18n.t('RE_ENTER')} onClick={this.onReEnterClick}
                  onKeyDown={this.handleKeyDown} tabIndex={0}>
                  <Trans i18nKey='RE_ENTER'/>
                </ReEnterButton>
                <ReEnterButton className='close-button'
                  aria-label={i18n.t('PAYMENT_PAGE_FETCHING_CLOSE')}
                  role='button' onClick={this.onClickClose} tabIndex={0}>
                  <Trans i18nKey='PAYMENT_PAGE_FETCHING_CLOSE'/>
                </ReEnterButton>
              </RetryParent>
              }
            </AccountParent>
            : <LoyaltyActivity
              loyaltyDetailsAccounts={loyaltyDetails.loyaltyDetailsAccounts}
              handleLoyaltyInfo={this.handleLoyaltyInfo}
              {...this.props}
              siteId={siteId}
              cartLoyaltyInfo={cartLoyaltyInfo}
              fetchAccount={fetching}
              loyaltyProcess
              setCartLoyaltyInfo/>
          }
          {(fetching) && <LoadingContainer fetching={fetching}><Loader/></LoadingContainer>}
          <CloseButton className='close-btn' tabIndex={0} aria-label={i18n.t('EXIT_DIALOG')}
            role='button' children='&#10005;' onClick={this.onClickClose}/>
        </ModalContainer>
      </Flex>
    );
  }
}

export default LoyaltyProcess;
