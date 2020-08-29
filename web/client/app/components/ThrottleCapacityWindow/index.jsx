// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

/* istanbul ignore file */
import React, { Component } from 'react';
import styled from 'styled-components';
import { Modal as ModalWindow, Flex, Fixed, Heading, Text, Button } from 'rebass';
import PrimaryButton from 'web/client/app/components/PrimaryButton';
import RadioButton from 'web/client/app/components/RadioButton';
import IconButton from 'web/client/app/components/IconButton';
import { Trans } from 'react-i18next';
import { scheduleType } from 'web/client/app/utils/constants';
import get from 'lodash.get';
import i18n from 'web/client/i18n';

const ModalContainer = styled(ModalWindow)`
  border-radius: 4px;
  z-index: 1101;
  width: 420px;
  padding: 15px;
  ${props => props.theme.mediaBreakpoints.mobile`width: 100%; border-radius: 0px; height: 100%`};
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

const ModalTitle = styled(Heading)`
  margin: 25px 20px 25px;
  color: ${props => props.theme.colors.primaryTextColor};
  font-size: 1.5em;
  font-weight: 500;
  text-align: center;
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const ModalText = styled(Text)`
  color: ${props => props.theme.colors.secondaryTextColor};
  font-size: 14px;
  text-align: center;
  padding: 0px 20px;
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const ModalFooter = styled(Flex)`
  flex-direction: column;
  justify-content: center;
  padding: 20px 20px 0px;
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const StyledButton = styled(Button)`
  background-color: ${props => props.theme.colors.buttonControlColor};
  border-radius: 0;
  color: ${props => props.theme.colors.buttonTextColor};
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
`;

const AcceptButton = styled(props => <StyledButton {...props} />)`
  background-color: ${props => props.theme.colors.buttonControlColor};
  opacity: ${props => {
    if (props.selectedoption) return 1;
    return 0.75;
  }};
  border-radius: 0;
  color: ${props => {
    if (props.selectedoption) return props.theme.colors.buttonTextColor;
    return '#FFFFFF';
  }};
  cursor: ${props => {
    if (props.selectedoption) return 'pointer';
    return 'default';
  }};
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
  border-radius: 4px;
  font-size: 0.8rem;
  margin-bottom: 20px;
  padding: 15px 0;
  text-align: center;
  width: 100%;
  text-transform: uppercase;
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const ContinueButton = styled(props => <PrimaryButton {...props} />)`
  border-radius: 4px;
  font-size: 0.8rem;
  margin-bottom: 20px;
  padding: 15px 0;
  text-align: center;
  width: 100%;
  text-transform: uppercase;
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

const RadioButtonContainer = styled(Flex)`
  flex-direction: column;
  width: 100%;
  padding: 25px 20px 0px;
  .input-field-wrapper .input-text {
    border-bottom: 1px solid #7d7d7d;
  }
  .input-field-wrapper {
    margin-bottom: 0px;
  }
  .radio-o {
    font-size: 20px;
    color: ${props => props.theme.colors.buttonControlColor} !important;
  }
`;

class ThrottleCapacityWindow extends Component {
  constructor (props) {
    super(props);
    this.state = {
      selectedOption: null
    };
    this.checkSelected = this.checkSelected.bind(this);
    this.onClickAccept = this.onClickAccept.bind(this);
    this.onClickContinue = this.onClickContinue.bind(this);
    this.onClickOk = this.onClickOk.bind(this);
    this.onClickClose = this.onClickClose.bind(this);
    this.onEscape = this.onEscape.bind(this);
    this.makeEverythingAccessible = this.makeEverythingAccessible.bind(this);
  }

  componentDidMount () {
    document.getElementById('spl-ins-title') &&
      document.getElementById('spl-ins-title').focus();
  }

  checkSelected (type) {
    this.setState({ selectedOption: type });
  }

  onClickAccept () {
    const { selectedOption } = this.state;
    const scheduleSlotList = get(this.props, 'capacityData.scheduleSlotList', []);
    const { scheduleOrderData } = this.props;
    if (selectedOption) {
      const scheduleOrder = {
        scheduleType: scheduleOrderData ? scheduleOrderData.scheduleType : scheduleType.laterToday,
        scheduleTime: selectedOption,
        daysToAdd: scheduleOrderData ? scheduleOrderData.daysToAdd : 0
      };
      this.props.setScheduleOrderData(scheduleOrder);
      this.makeEverythingAccessible();
      this.props.acceptCapacityTime(scheduleSlotList.find(slot => slot.displayRange === selectedOption).scheduledEndTime); // eslint-disable-line max-len
    }
  }

  onClickContinue () {
    this.makeEverythingAccessible();
    this.props.acceptCapacityTime();
  }

  onClickOk () {
    this.makeEverythingAccessible();
    this.props.history.replace('/');
    this.props.cancelCart();
    this.props.resetRemaining();
    this.props.resetDelivery();
    this.props.resetSmsDetails();
    this.props.resetTipData();
    this.props.resetNameDetails();
    this.props.resetScheduleOrderData();
    this.props.setHideScheduleTime(false);
    this.props.clearGAState();
    this.props.resetAtrium();
    this.props.removeCCPaymentCard();
    this.props.clearLoyaltyState();
  }

  onClickClose () {
    const { capacityData, onHandleClose, paymentType } = this.props;
    if (capacityData && capacityData.scheduleSlotList) {
      if (paymentType) {
        this.makeEverythingAccessible();
        onHandleClose && onHandleClose();
      }
      this.makeEverythingAccessible();
      this.props.setShowCapacityWindow(false);
    } else {
      this.onClickOk();
    }
  }

  makeEverythingAccessible () {
    // Accessibility for dialog
    const bottomContainer = document.querySelector('.BottomContainer .pay-list-top-container');
    const topContainer = document.querySelector('.TopContainer');
    topContainer.inert = false;
    const footer = document.querySelector('.BottomContainer .footer');
    footer.inert = false;
    const Children = bottomContainer.children;
    Array.from(Children).forEach(child => {
      if (child.id !== 'throttle-modal') {
        child.inert = false;
      }
    });
  }

  onEscape (e) {
    if (e.which === 27) {
      this.onClickClose();
    }
  }

  render () {
    const { orderThrottling } = this.props;
    const { selectedOption } = this.state;
    const scheduleSlotList = get(this.props, 'capacityData.scheduleSlotList');
    const strategy = get(this.props, 'capacityData.strategy');
    return (
      <Flex id='throttle-modal' role='dialog'>
        <ModalBackground className='throttle-modal-background'/>
        <ModalContainer className='throttle-modal-parent' onKeyDown={this.onEscape}>

          <ModalTitle className='modal-title' tabIndex={0} id='throttle-title'
            aria-label={`${(orderThrottling && orderThrottling.titleText) ||
            i18n.t('THROTTLING_MODAL_TITLE')}`}>
            {(orderThrottling && orderThrottling.titleText) || <Trans i18nKey='THROTTLING_MODAL_TITLE'/>}
          </ModalTitle>
          <ModalText className='modal-text' tabIndex={0}
            aria-label={`${(orderThrottling && (!scheduleSlotList ? orderThrottling.rejectMessage
              : orderThrottling.optionsMessage)) ||
            !scheduleSlotList ? i18n.t('THROTTLING_MODAL_TEXT_REJECT') : i18n.t('THROTTLING_MODAL_TEXT_OPTIONS')}`}
          >
            {(orderThrottling &&
              (!scheduleSlotList ? orderThrottling.rejectMessage : orderThrottling.optionsMessage)) ||
              <Trans i18nKey={!scheduleSlotList ? 'THROTTLING_MODAL_TEXT_REJECT' : 'THROTTLING_MODAL_TEXT_OPTIONS'}/>
            }
          </ModalText>
          {scheduleSlotList && <RadioButtonContainer id='radiogroup' className='throttle-capacity-radio-div'>
            {
              scheduleSlotList.map((capacityRange, index) => (
                <React.Fragment key={`account-${index}`}>
                  <RadioButton
                    classDesc={`${capacityRange.displayRange}`}
                    className={`${capacityRange.displayRange}-radio`}
                    label={capacityRange.displayRange}
                    ariaLabel={capacityRange.displayRange}
                    tabIndex={0}
                    capacityText
                    type={capacityRange.displayRange}
                    selectedOption={this.checkSelected}
                    selected={selectedOption === capacityRange.displayRange}
                  />
                </React.Fragment>
              ))}
          </RadioButtonContainer> }
          <ModalFooter className='modal-footer'>
            {scheduleSlotList && <AcceptButton
              onClick={this.onClickAccept}
              selectedoption={selectedOption}
              role='button'
              tabIndex={selectedOption ? 0 : -1}
              aria-label={i18n.t('THROTTLING_MODAL_ACCEPT')}
            >
              <Trans i18nKey='THROTTLING_MODAL_ACCEPT'/>
            </AcceptButton>}
            {scheduleSlotList && strategy === 'SUGGEST_AND_ALLOW' &&
            <ContinueButton
              role='button'
              tabIndex={0}
              aria-label={i18n.t('THROTTLING_MODAL_KEEP_TIME')}
              onClick={this.onClickContinue}>
              <Trans i18nKey='THROTTLING_MODAL_KEEP_TIME'/>
            </ContinueButton>}
            {!scheduleSlotList &&
              <ContinueButton
                role='button'
                tabIndex={0}
                aria-label={i18n.t('THROTTLING_MODAL_TEXT_REJECT_OK')}
                onClick={this.onClickOk}>
                <Trans i18nKey='THROTTLING_MODAL_TEXT_REJECT_OK'/>
              </ContinueButton>}

          </ModalFooter>
          <CloseButton children='&#10005;' role='button' tabIndex={0}
            aria-label={i18n.t('EXIT_DIALOG')} onClick={this.onClickClose} />
        </ModalContainer>
      </Flex>
    );
  };
}

export default ThrottleCapacityWindow;
