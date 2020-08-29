// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import React, { Component } from 'react';
import styled from 'styled-components';
import { Modal as ModalWindow, Flex, Fixed, Heading, Text } from 'rebass';
import PrimaryButton from 'web/client/app/components/PrimaryButton';
import SecondaryButton from 'web/client/app/components/SecondaryButton';
import IconButton from 'web/client/app/components/IconButton';
import FloatingLabelInput from 'web/client/app/components/FloatingLabelInput';
import { currencyLocaleFormat } from 'web/client/app/utils/NumberUtils';
import { LoadingComponent } from 'web/client/app/components/Loader/ReusableLoader';
import { Trans } from 'react-i18next';
import Loader from 'web/client/app/components/Loader/index';
import i18n from 'web/client/i18n';
import Announcements from 'web/client/app/components/Announcements';

const StyledFloatingLabelInput = styled(FloatingLabelInput)`
  margin-top: 10px;
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const ModalContainer = styled(ModalWindow)`
  border-radius: 4px;
  z-index: 1100;
  width: 420px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  ${props => props.theme.mediaBreakpoints.mobile`width: 100%; height: 100%`};
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
  z-index: 1000;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  opacity: 1;
  will-change: opacity;
  transition: opacity 225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
`;

const ModalTitle = styled(Heading)`
  margin: 25px 0 0 0;
  color: ${props => props.theme.colors.primaryTextColor};
  font-size: 30px;
  font-weight: bold;
  text-align: center;
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const ModalText = styled(Text)`
  color: ${props => props.theme.colors.primaryTextColor};
  font-size: 16px;
  text-align: center;
  padding: 0px 10px;
  margin: 20px auto;
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const ModalTotalText = styled(ModalText)`
  font-weight: bold;
  margin: 20px;
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const ModalRemainingText = styled(ModalText)`
  font-weight: bold;
  margin: 20px;
  color: ${props => props.theme.colors.buttonControlColor};
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const ModalBody = styled(Flex)`
  flex-direction: column;
  width: 85%;
  margin: 0 auto;
  flex-shrink: 0;
  padding: 15px 15px 0px;
  .error-text {
    margin-top: 10px;
    color: ${props => props.theme.colors.error};
  }
`;

const Footer = styled(Flex)`
  border-top: 2px solid lightgrey;
  margin: 10px 0px 0px 0px;
  position: sticky;
  bottom: 0;
  min-height: 50px;
  align-items: center;
  font-size: 16px;
  font-weight: bold;
  background-color: white;
  justify-content: ${props => {
    if (props.remaining) return 'space-between';
    return 'center';
  }};
`;

const MainButton = styled(props => <PrimaryButton {...props} />)`
  border-radius: 4px;
  font-size: 16px;
  margin: 10px auto;
  padding: 15px 0;
  text-align: center;
  font-weight: bold;
  height: 40px;
  line-height: 10px;
  &:disabled {
    cursor: not-allowed;
  }
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const CloseButton = styled(props => <IconButton {...props} />)`
  color: #1F1F1F;
  font-size: ${props => props.theme.fontSize.md};
  font-weight: 300;
  position: absolute;
  left: 20px;
  top: 15px;
  opacity: ${props => {
    if (props.disabled) return '0.6 !important';
    return 'pointer';
  }};
  cursor: ${props => {
    if (props.disabled) return 'not-allowed';
    return 'pointer';
  }};
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const CancelButton = styled(props => <SecondaryButton {...props} />)`
  border-radius: 4px;
  font-size: 16px;
  margin: 10px auto;
  padding: 15px 0;
  text-align: center;
  font-weight: bold;
  border: none;
  height: 40px;
  line-height: 10px;
  width: auto;
  box-shadow: none !important;
  &:focus {
    outline: none !important;
    box-shadow: none !important;
  }
  opacity: ${props => {
    if (props.disabled) return '0.6 !important';
    return 'pointer';
  }};
  cursor: ${props => {
    if (props.disabled) return 'not-allowed';
    return 'pointer';
  }};
`;

const ErrorText = styled(ModalText)`
  margin: 8px auto;
  color: ${props => props.theme.colors.error};
`;

class MemberCharge extends Component {
  constructor (props) {
    super(props);
    this.state = {
      customAmountInput: '',
      memberNumber: '',
      lastName: '',
      processPayment: false
    };

    this.onModalClose = this.onModalClose.bind(this);
    this.processMemberCharge = this.processMemberCharge.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.onEscape = this.onEscape.bind(this);
  }

  componentDidMount () {
    const { tenderId, fetchMemberChargeBySiteId, cartItems, contextId, displayProfileId } = this.props;
    if (!tenderId || cartItems[0].contextId !== contextId) {
      fetchMemberChargeBySiteId(cartItems[0].contextId, displayProfileId);
    }
    document.getElementById('member-charge-title') &&
      document.getElementById('member-charge-title').focus();
  }

  componentWillReceiveProps (nextProps) {
    if ((nextProps.inquiryError && this.props.inquiryError !== nextProps.inquiryError) ||
    (nextProps.memberChargeCapture && this.props.memberChargeCapture !== nextProps.memberChargeCapture)) {
      this.resetButton();
    }
  }

  resetButton () {
    this.setState({ processPayment: false });
  }

  onModalClose () {
    const { closeMemberCharge } = this.props;
    this.setState(this.baseState);
    closeMemberCharge();
  }

  onEscape (e) {
    if (e.which === 27) {
      this.onModalClose();
    }
  }

  processMemberCharge () {
    const { memberNumber, lastName } = this.state;
    const { tenderId, memberCharge, memberChargeError, disableProcess, inquiryError } = this.props;
    const memberChargePayload = {
      memberNumber: memberNumber,
      lastName: lastName.toUpperCase(),
      tenderId,
      coverCount: memberCharge.coverCount,
      pmsAdapterId: memberCharge.pmsAdapterId
    };
    this.setState({ processPayment: true });
    this.props.processMemberCharge(memberChargePayload);
    !disableProcess && !memberChargeError && !inquiryError && this.props.accessible('memberCharge');
  }

  handleChange (propertyName, inputValue) {
    this.setState({
      [propertyName]: inputValue
    });
  }

  render () {
    const { memberCharge, totalWithTip, currencyDetails, remaining,
      fetchingRoomCharge, memberChargeError, inquiryError, disableProcess } = this.props;
    const { memberNumber, lastName, processPayment } = this.state;
    const disableProcessButton = lastName.length === 0 || memberNumber.length === 0;

    return (
      <Flex className='member-charge-modal' id='member-charge-modal' onKeyDown={this.onEscape} role='dialog'>
        <ModalBackground />
        <ModalContainer className='modal-container'>
          {(processPayment || fetchingRoomCharge) &&
            <Announcements message={i18n.t('PROCESSING_TEXT')} />}
          <ModalBody className='modal-body'>
            <ModalTitle className='modal-title' id='member-charge-title'
              tabIndex={0} aria-label={memberCharge.displayLabel || i18n.t('MEMBER_CHARGE_TITLE')}>
              {memberCharge.displayLabel || <Trans i18nKey='MEMBER_CHARGE_TITLE'/>}
            </ModalTitle>
            <ModalText className='instruction-text'
              tabIndex={0} aria-label={memberCharge.instructionText || i18n.t('MEMBER_CHARGE_INSTN')}>
              {memberCharge.instructionText || <Trans i18nKey='MEMBER_CHARGE_INSTN'/>}
            </ModalText>
            {memberChargeError &&
            <ModalText className='error-text'
              aria-live='polite'
              tabIndex={0} aria-label={i18n.t('MEMBER_CHARGE_ERROR')}>
              {<Trans i18nKey='MEMBER_CHARGE_ERROR'/>}
            </ModalText>
            }
            <StyledFloatingLabelInput
              className='styled-floating-label-input'
              ariaLabel={memberCharge.memberNumberLabel || i18n.t('MEMBER_CHARGE_NUMBER')}
              propertyName='memberNumber'
              label={memberCharge.memberNumberLabel || <Trans i18nKey='MEMBER_CHARGE_NUMBER'/>}
              value={memberNumber}
              callBack={this.handleChange}
              clearIcon
              disabled={processPayment}
              tabIndex={0}
            />

            <StyledFloatingLabelInput
              className='styled-floating-label-input'
              propertyName='lastName'
              ariaLabel={memberCharge.lastNameLabel || i18n.t('MEMBER_CHARGE_LAST_NAME')}
              label={memberCharge.lastNameLabel || <Trans i18nKey='MEMBER_CHARGE_LAST_NAME'/>}
              value={lastName}
              callBack={this.handleChange}
              clearIcon
              disabled={processPayment}
              tabIndex={0}
            />

            <MainButton
              className='main-btn'
              onClick={this.processMemberCharge}
              disabled={disableProcessButton || processPayment || disableProcess}
              tabIndex={(disableProcessButton || processPayment || disableProcess) ? -1 : 0}
              style={{ padding: '0px 0px 3px 0px' }}>
              {
                processPayment
                  ? <LoadingComponent
                    className='loading-cont'
                    color='white'
                    containerHeight='100%'
                    containerWidth='100%'
                    aria-label={i18n.t('PROCESSING_TEXT')}
                    height='25px'
                    width='25px'
                    borderSize={2}
                    style={{ justifyContent: 'center' }}
                  />
                  : <div className='submit-btn-room-charge'>
                    <Trans i18nKey='GA_PROCESS_BUTTON'/>
                  </div>
              }
            </MainButton>

            <CancelButton
              disabled={processPayment}
              onClick={this.onModalClose}
              tabIndex={0}
              aria-label={i18n.t('MODAL_CANCEL')}>
              <Trans i18nKey='MODAL_CANCEL'/>
            </CancelButton>

            {!disableProcess && inquiryError && <ErrorText
              aria-live='polite'
              tabIndex={0}
              aria-label={i18n.t('MEMBER_INQUIRY_ERROR')}>
              <Trans i18nKey='MEMBER_INQUIRY_ERROR'/></ErrorText>}
            {disableProcess &&
              <ErrorText
                aria-live='polite'
                tabIndex={0}
                aria-label={memberCharge.maxAttemptsMessage || i18n.t('MEMBER_CHARGE_MAX_ATTEMPTS')}>
                {memberCharge.maxAttemptsMessage || <Trans i18nKey='MEMBER_CHARGE_MAX_ATTEMPTS'/>}
              </ErrorText>
            }
          </ModalBody>

          <Footer remaining={this.props.remaining}>
            <ModalTotalText className='total-due'
              tabIndex={0}
              aria-label={`${i18n.t('GA_TOTAL_DUE')} ${currencyLocaleFormat(totalWithTip, currencyDetails)}`}>
              <Trans i18nKey='GA_TOTAL_DUE'/>: {currencyLocaleFormat(totalWithTip, currencyDetails)}
            </ModalTotalText>
            {this.props.remaining &&
            <ModalRemainingText className='remaining'
              tabIndex={0}
              aria-label={`${i18n.t('REMAINING_FOOTER')} ${currencyLocaleFormat(remaining, currencyDetails)}`}>
              <Trans i18nKey='REMAINING_FOOTER' /> { currencyLocaleFormat(remaining, currencyDetails)}
            </ModalRemainingText>}
          </Footer>
          <CloseButton children='&#10005;'
            disabled={processPayment}
            onClick={this.onModalClose}
            tabIndex={processPayment ? -1 : 0}
            role='button'
            aria-label={i18n.t('EXIT_DIALOG')}
          />
          {fetchingRoomCharge && <LoadingContainer><Loader /></LoadingContainer>}
        </ModalContainer>
      </Flex>

    );
  }
}

export default MemberCharge;
