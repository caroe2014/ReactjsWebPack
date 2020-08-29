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
import FloatingLabelList from 'web/client/app/components/FloatingLabelList';
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
  ${props => props.theme.mediaBreakpoints.mobile`
    width: 100%;
    height: 100%;
    border-radius: 0px;
  `};
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
`;

const ModalRemainingText = styled(ModalText)`
  font-weight: bold;
  margin: 20px;
  color: ${props => props.theme.colors.buttonControlColor};
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

class RoomCharge extends Component {
  constructor (props) {
    super(props);
    this.state = {
      customAmountInput: '',
      hotel: '',
      wing: '',
      roomNumber: '',
      lastName: '',
      creditCard: '',
      processPayment: false,
      hotelInputValue: '',
      wingInputValue: '',
      hotelList: [],
      wingList: []
    };

    this.onModalClose = this.onModalClose.bind(this);
    this.processRoomCharge = this.processRoomCharge.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleListChange = this.handleListChange.bind(this);
    this.onEscape = this.onEscape.bind(this);
  }

  componentDidMount () {
    const { roomChargeDetails, fetchRoomChargeBySiteId, cartItems, contextId, displayProfileId } = this.props;
    if (!roomChargeDetails || cartItems[0].contextId !== contextId) {
      fetchRoomChargeBySiteId(cartItems[0].contextId, displayProfileId);
    } else {
      this.initialState(roomChargeDetails);
    }
    document.getElementById('roomcharge-title') &&
      document.getElementById('roomcharge-title').focus();
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.roomChargeDetails && this.props.roomChargeDetails !== nextProps.roomChargeDetails) {
      this.initialState(nextProps.roomChargeDetails);
    }
    if ((nextProps.inquiryError && this.props.inquiryError !== nextProps.inquiryError) ||
    (nextProps.roomChargeCapture && this.props.roomChargeCapture !== nextProps.roomChargeCapture)) {
      this.resetButton();
    }

  }

  resetButton () {
    this.setState({ processPayment: false });
  }

  initialState (roomChargeDetails) {
    const hotelList = roomChargeDetails.map(data => {
      return {
        value: data.name,
        label: data.displayName || data.name,
        ...data
      };
    });
    let hotel = '';
    let wing = '';
    let wingList = [];
    if (hotelList.length === 1) {
      hotel = hotelList[0];
      hotel.wings && hotel.wings.map(data => {
        if (data.isActive) {
          wingList.push({
            value: data.prefix,
            label: data.displayName
          });
        }
      });
      wing = wingList.length === 1 ? wingList[0] : '';
    }
    this.setState({hotelList, wingList, hotel, wing});
  }

  onModalClose () {
    const { closeRoomCharge } = this.props;
    this.setState(this.baseState);
    closeRoomCharge();
  }

  processRoomCharge () {
    const { hotel, wing, roomNumber, lastName } = this.state;
    const { roomCharge, roomChargeError, inquiryError, disableProcess } = this.props;
    const processRoomChargePayload = {
      tenderId: hotel.tenderId,
      verificationCodeId: hotel.verificationCodeId,
      hotel,
      wing,
      roomNumber: roomNumber.toUpperCase(),
      lastName: lastName.toUpperCase(),
      coverCount: roomCharge.coverCount,
      pmsAdapterId: roomCharge.pmsAdapterId
    };
    this.setState({ processPayment: true });
    this.props.processRoomCharge(processRoomChargePayload);
    !disableProcess && !roomChargeError && !inquiryError && this.props.accessible('roomCharge');

  }

  handleChange (propertyName, inputValue) {
    this.setState({
      [propertyName]: inputValue
    });
  }

  handleListChange (property, selectedOption) {
    if (property === 'hotel') {
      const wingDataSet = this.props.roomChargeDetails.find(data => data.name === selectedOption.value);
      const wingList = [];
      wingDataSet && wingDataSet.isWingPresent && wingDataSet.wings &&
      wingDataSet.wings.length > 0 && wingDataSet.wings.map(data => {
        if (data.isActive) {
          wingList.push({
            value: data.prefix.toUpperCase(),
            label: data.displayName
          });
        }
      });
      const wing = wingList.length === 1 ? wingList[0] : '';
      this.setState({hotel: selectedOption, hotelInputValue: (selectedOption && selectedOption.value) || '', wingList, wing}); // eslint-disable-line max-len
    } else if (property === 'wing') {
      this.setState({wing: selectedOption, wingInputValue: (selectedOption && selectedOption.value) || ''});
    }
  }

  handleInputChange (property, value) {
    if (property === 'hotel') {
      this.setState({hotelInputValue: value});
    } else if (property === 'wing') {
      this.setState({wingInputValue: value});
    }
  }

  onEscape (e) {
    if (e.which === 27) {
      this.onModalClose();
    }
  }

  render () {
    const { roomCharge, totalWithTip, currencyDetails, remaining, fetchingRoomCharge,
      roomChargeError, inquiryError, disableProcess } = this.props;
    const { hotel, wing, roomNumber, lastName, processPayment,
      hotelInputValue, wingInputValue, hotelList, wingList } = this.state;
    const disableProcessButton = hotel.length === 0 || (wingList.length > 0 && wing.length === 0) ||
      lastName.length === 0 || roomNumber.length === 0;

    return (
      <Flex className='roomcharge-modal' id='roomcharge-modal' onKeyDown={this.onEscape} role='dialog'>
        <ModalBackground />
        <ModalContainer className='modal-container'>
          {processPayment &&
            <Announcements message={i18n.t('PROCESSING_TEXT')} />}
          <ModalBody className='modal-body'>
            <ModalTitle className='modal-title' id='roomcharge-title'
              tabIndex={0} aria-label={roomCharge.displayLabel || i18n.t('ROOM_CHARGE_TITLE')}>
              {roomCharge.displayLabel || <Trans i18nKey='ROOM_CHARGE_TITLE'/>}
            </ModalTitle>
            <ModalText className='instruction-text'
              tabIndex={0} aria-label={roomCharge.instructionText || i18n.t('ROOM_CHARGE_INSTN')}>
              {roomCharge.instructionText || <Trans i18nKey='ROOM_CHARGE_INSTN'/>}
            </ModalText>
            {roomChargeError &&
              <ModalText className='error-text' aria-live='polite'
                tabIndex={0} aria-label={i18n.t('ROOM_CHARGE_ERROR')}>
                {<Trans i18nKey='ROOM_CHARGE_ERROR'/>}
              </ModalText>
            }
            {hotelList.length > 1 && <FloatingLabelList
              className='hotel'
              label={roomCharge.propertyLabel || <Trans i18nKey='ROOM_CHARGE_HOTEL'/>}
              ariaLabel={roomCharge.propertyLabel || <Trans i18nKey='ROOM_CHARGE_HOTEL'/>}
              property='hotel'
              selectedOption={hotel}
              aria-selected={hotel}
              inputValue={hotelInputValue}
              callBack={this.handleListChange}
              inputChange={this.handleInputChange}
              clearIcon
              disabled={processPayment}
              inputList={hotelList}
              tabIndex={0}
            /> }

            {wingList.length > 1 && <FloatingLabelList
              className='wing'
              label={roomCharge.wingLabel || <Trans i18nKey='ROOM_CHARGE_WING'/>}
              ariaLabel={roomCharge.wingLabel || <Trans i18nKey='ROOM_CHARGE_WING'/>}
              property='wing'
              selectedOption={wing}
              aria-selected={wing}
              inputValue={wingInputValue}
              callBack={this.handleListChange}
              inputChange={this.handleInputChange}
              clearIcon
              inputList={wingList}
              disabled={processPayment}
              noOptionsText={<Trans i18nKey='ROOM_CHARGE_WING_EMPTY'/>}
              tabIndex={0}
            /> }

            <StyledFloatingLabelInput
              className='styled-floating-label-input room-number'
              ariaLabel={roomCharge.roomNumberLabel || i18n.t('ROOM_CHARGE_ROOM_NUMBER')}
              propertyName='roomNumber'
              label={roomCharge.roomNumberLabel || <Trans i18nKey='ROOM_CHARGE_ROOM_NUMBER'/>}
              value={roomNumber}
              callBack={this.handleChange}
              clearIcon
              disabled={processPayment}
              tabIndex={0}
            />

            <StyledFloatingLabelInput
              className='styled-floating-label-input last-name'
              propertyName='lastName'
              ariaLabel={roomCharge.lastNameLabel || i18n.t('ROOM_CHARGE_LAST_NAME')}
              label={roomCharge.lastNameLabel || <Trans i18nKey='ROOM_CHARGE_LAST_NAME'/>}
              value={lastName}
              callBack={this.handleChange}
              clearIcon
              disabled={processPayment}
              tabIndex={0}
            />

            <MainButton
              className='main-btn'
              onClick={this.processRoomCharge}
              disabled={disableProcessButton || processPayment || disableProcess}
              role='button'
              tabIndex={(disableProcessButton || processPayment || disableProcess) ? -1 : 0}
              style={{ padding: '0px 0px 3px 0px' }}
            >
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
              className='cancel-button'
              disabled={processPayment}
              onClick={this.onModalClose}
              tabIndex={processPayment ? -1 : 0}
              aria-label={i18n.t('MODAL_CANCEL')}
              role='button'
            >
              <Trans i18nKey='MODAL_CANCEL'/>
            </CancelButton>

            {!disableProcess && inquiryError && <ErrorText
              aria-live='polite'
              tabIndex={0}
              aria-label={i18n.t('ROOM_CHARGE_INQUIRY_ERROR')}>
              <Trans i18nKey='ROOM_CHARGE_INQUIRY_ERROR'/></ErrorText>}
            {disableProcess &&
            <ErrorText
              aria-live='polite'
              tabIndex={0}
              aria-label={roomCharge.maxAttemptsMessage || i18n.t('ROOM_CHARGE_MAX_ATTEMPTS')}>
              {roomCharge.maxAttemptsMessage || <Trans i18nKey='ROOM_CHARGE_MAX_ATTEMPTS'/>}
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
            className='exit-dialog-button'
            disabled={processPayment}
            onClick={this.onModalClose}
            role='button'
            tabIndex={processPayment ? -1 : 0}
            aria-label={i18n.t('EXIT_DIALOG')}
          />
          {fetchingRoomCharge && <LoadingContainer><Loader /></LoadingContainer>}
        </ModalContainer>
      </Flex>

    );
  }
}

export default RoomCharge;
