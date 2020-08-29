// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.
/* eslint-disable max-len */
import React, { Component } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import theme from 'web/client/theme';
import { Flex, Button, Text, Input } from 'rebass';
import { currencyLocaleFormat } from 'web/client/app/utils/NumberUtils';
import { Trans } from 'react-i18next';
import Modal from 'web/client/app/components/Modal';
import i18n from 'web/client/i18n';
import { getDeliveryEnabled } from 'web/client/app/utils/LocationUtils';

const Container = styled(Flex)`
  align-items: center;
  margin: auto;
  max-width: 400px;
  padding-bottom: 20px;
  ${props => props.theme.mediaBreakpoints.desktop`margin-top: 170px;`};
  ${props => props.theme.mediaBreakpoints.tablet`margin-top: 170px;`};
  ${props => props.theme.mediaBreakpoints.mobile`
    margin-top: 120px; padding-bottom: 20px;
    border: none;
    max-width: 100%;
    height: inherit;
    padding-left: 10px;
    padding-right: 10px;
    background: ${props => props.theme.colors.light};
  `};
  flex-direction: column;
  width: 100%;
  margin-bottom: auto !important;
`;

const ChildBox = styled(Flex)`
  flex-direction: column;
  width: 100%;
  background: ${props => props.theme.colors.light};
  ${props => props.theme.mediaBreakpoints.desktop`border: 1px solid lightgrey;`};
  ${props => props.theme.mediaBreakpoints.tablet`border: 1px solid lightgrey;`};
  ${props => props.theme.mediaBreakpoints.mobile`border: none; margin-top: 0px;`};
`;

const ButtonParent = styled(Flex)`
  width: 100%;
  flex-direction: column;
  min-height: 70px;
  margin-bottom: 20px;
`;

const PayButton = styled(Button)`
  background: ${props => props.theme.colors.buttonControlColor};
  color: ${props => props.theme.colors.buttonTextColor};
  cursor: pointer;
  font-weight: 500;
  font-size: ${props => props.theme.fontSize.md};
  float: right;
  width: 100%;
  min-height: 50px;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.nm};
  &:hover {
    box-shadow: 0px 0px 10px 2px lightgrey;
    -webkit-box-shadow: 0px 0px 10px 2px lightgrey;
    -moz-box-shadow: 0px 0px 10px 2px lightgrey;;
  }
  text-align: center;
  margin: 0 auto;
  border: none;
  border-radius: 0;
  outline: none;
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const NoTipButton = styled(Flex)`
  text-align: center;
  word-break: break-word;
  height: auto;
  justify-content: center;
  align-items: center;
  width: ${props => {
    if (props.fullwidth) return `100%`;
    return `calc(1/3*100% - (1 - 1/3)*10px)`;
  }};
  height: ${props => {
    if (props.fullwidth) return `50px`;
    return `80px`;
  }};
  padding-left: 10px;
  padding-right: 10px;
  margin-bottom: 10px;
  color: ${props => props.theme.colors.primaryTextColor};
  border: 1px solid #E6E6E6;
  &:focus {
    outline: none;
    box-shadow: none;
  }
  &:active {
    box-shadow: 0px 0px 2px 0px #505050 !important;
  }
  ${props => props.theme.mediaBreakpoints.desktop`
  &:hover {
    box-shadow: 0px 0px 8px 0px #ddd;

  -webkit-box-shadow: 0px 0px 8px 0px #ddd;
  -moz-box-shadow: 0px 0px 8px 0px #ddd;
    cursor: pointer;
    color: ${props => props.theme.colors.buttonControlColor};
  }
  `};
`;

const AddCustomTipButton = styled(Flex)`
  padding: 0;
  word-break: break-all;
  min-height: 2em;
  height: 100%;
  justify-content: center;
  align-items: center;
  width: calc(1/3*100% - (1 - 1/3)*10px);
  color: #ffffff;
  background: ${props => props.theme.colors.buttonControlColor};
  font-weight: 500;
  font-size: ${props => props.theme.fontSize.nm};
  // float: right;
  text-align: center;
  margin: 0 auto;
  border: none;
  border-radius: 0;
  outline: none;
  cursor: pointer;
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const CloseBox = styled(Flex)`
  height: 30px;
  justify-content: center;
  align-items: center;
  width: calc(1/3*100% - (1 - 1/3)*30px);
  color: #505050;
  font-weight: 500;
  font-size: 18px;
  text-align: center;
  margin: 0 auto;
  border: none;
  border-radius: 0;
  outline: none;
  cursor: pointer;
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const BillBox = styled(Flex)`
  width: 100%;
  height: auto;
  color: #505050;
  font-size: 18px;
  min-height: 60px;
  border-bottom: 0.5px solid #E6E6E6;
  justify-content: center;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  ${props => props.theme.mediaBreakpoints.mobile`
    padding: 10px 0px;
    min-height: 60px;
  `};
`;

const BillFields = styled(Flex)`
width: 100%;
height: auto;
color: ${props => props.theme.colors.secondaryTextColor};
font-size: 16px;
justify-content: center;
flex-direction: row;
justify-content: space-between;
align-items: center;
`;

const TipBox = styled(Flex)`
  width: 100%;
  height: auto;
  min-height: 60px;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  padding-left: 20px;
  padding-right: 20px;
  & > :last-child{
    margin-bottom: 20px;
  }
  ${props => props.theme.mediaBreakpoints.mobile`
  padding-left: 0px;
  padding-right: 0px;
  & > :last-child{
    margin-bottom: 10px;
  }
`};
`;

const PayBox = styled(Flex)`
  width: 100%;
  height: auto;
  min-height: 60px;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  padding-left: 20px;
  padding-right: 20px;
  ${props => props.theme.mediaBreakpoints.mobile`
  padding-left: 0px;
  padding-right: 0px;
`};
`;

const PayField = styled(Flex)`
  width: 100%;
  padding-top: 16px;
  padding-bottom: 16px;
  margin-bottom: 20px;
  height: auto;
  color: ${props => props.theme.colors.primaryTextColor};
  font-size: 18px;
  font-weight: bold;
  justify-content: center;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #000000;
  border-bottom: 1px solid #909090;
`;

const LabelText = styled(Text)`
  height: auto;
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const AddTip = styled(Text)`
  color: ${props => props.theme.colors.primaryTextColor};
  font-size: 18px;
  font-weight: bold;
  padding-top: 20px;
  padding-bottom: 20px;
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const TipButton = styled(Flex)`
  width: calc(1/3*100% - (1 - 1/3)*10px);
  height: 80px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: ${props => {
    if (props.selected) return `1px solid ${props.theme.colors.buttonControlColor}`;
    return `1px solid #E6E6E6`;
  }};
  font-size: ${props => {
    if (props.selected) return `18px`;
    return `16px`;
  }};
  color: ${props => {
    if (props.selected) return `#000000`;
    return `lightgrey`;
  }};
  &:focus {
    outline: none;
    box-shadow: none;
  }

  &> :first-child {
    font-weight: ${props => {
    if (props.selected) return `500`;
    return `normal`;
  }};
  }

  &:active {
    box-shadow: 0px 0px 2px 0px #505050 !important;
  }
${props => props.theme.mediaBreakpoints.desktop`
  &:hover {
    box-shadow: ${props => {
    if (props.selected) return `none`;
    return `0px 0px 8px 0px #ddd;`;
  }};

    -webkit-box-shadow: : ${props => {
    if (props.selected) return `none`;
    return `0px 0px 8px 0px #ddd;`;
  }};
    -moz-box-shadow: : ${props => {
    if (props.selected) return `none`;
    return `0px 0px 8px 0px #ddd;`;
  }};
    font-size: 18px;
    cursor: pointer;
    &> :first-child {
      font-weight: ${props => {
    if (props.selected) return `500`;
    return `normal`;
  }};
  color: ${props => {
    if (props.selected) return `${props.theme.colors.primaryTextColor};`;
    return `${props.theme.colors.buttonControlColor};`;
  }};
    }
  }
`};
`;

const CustomTipButton = styled(Flex)`
  height: 80px;
  flex: 2 1 0;
  width: calc(2/3*100% - (1 - 2/3)*10px);
  justify-content: ${props => {
    if (props.selected) return `space-between`;
    return `center`;
  }};
  align-items: center;
  margin-bottom: 10px;
  color: ${props => props.theme.colors.primaryTextColor};
  border: ${props => {
    if (props.selected) return `1px solid ${props.theme.colors.buttonControlColor}`;
    return `1px solid #E6E6E6`;
  }};
  &:focus {
    outline: none;
    box-shadow: none;
  }
  &:active {
      box-shadow: ${props => {
    if (!props.selected) return `0px 0px 2px 0px #505050 !important`;
    return `none`;
  }};

  }
${props => props.theme.mediaBreakpoints.desktop`
  &:hover {
    box-shadow: ${props => {
    if (props.selected) return `none`;
    return `0px 0px 8px 0px #ddd;`;
  }};

    -webkit-box-shadow: : ${props => {
    if (props.selected) return `none`;
    return `0px 0px 8px 0px #ddd;`;
  }};
    -moz-box-shadow: : ${props => {
    if (props.selected) return `none`;
    return `0px 0px 8px 0px #ddd;`;
  }};
    cursor: ${props => {
    if (!props.pointerclick) return `pointer`;
    return `default`;
  }};
  color: ${props => {
    if (props.selected) return `${props.theme.colors.primaryTextColor};`;
    return `${props.theme.colors.buttonControlColor};`;
  }};
  }
`};
`;

const CustomTipField = styled(Flex)`
  align-items: center;
  width: 100%;
  font-color: #000000;
  padding: 20px;
  &>input::-ms-clear {
    display: none;
  }
  &>input::-webkit-inner-spin-button,
  &>input::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const CustomFlex = styled(Flex)`
  width: 65%;
  align-items: center;
  justify-content: center;
  &>input::-ms-clear {
    display: none;
  }
  &>input::-webkit-inner-spin-button,
  &>input::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const CurrencyText = styled(Text)`
  height: auto;
  color: ${props => props.theme.colors.textGrey};
  font-size: 24px;
  margin-right: 0px;
  margin-left: -4px;
  color: ${props => {
    if (props.value) return `${props.theme.colors.primaryTextColor}`;
    return `${props => props.theme.colors.textGrey}`;
  }};
${props => props.theme.mediaBreakpoints.mobile`
  font-size: 20px;
  margin-right: 0px;
  margin-left: 0px;
  `};
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const CustomTipInput = styled(Input)`
  padding: 0px;
  height: auto;
  &::placeholder {
    color: #BCBCBC;
    opacity: 1;
  }
  width: 65%;
  width:  ${props => {
    if (props.customtipinput) {
      return `${((props.customtipinput.length + 1 -
        (props.customtipinput.includes('.') ? 1 : 0)) * 16) -
        12}px`;
    }
    return `15px`;
  }};
  color: ${props => props.theme.colors.primaryTextColor};
  font-size: 24px;
  text-align: center;
  box-shadow: none;
  -moz-appearance: textfield;
${props => props.theme.mediaBreakpoints.mobile`
  font-size: 20px;
  width:  ${props => {
    if (props.customtipinput) {
      return `${((props.customtipinput.length + 1) * 14) -
        12}px`;
    }
    return `15px`;
  }};
`};
`;

const TipText = styled(Text)`
  height: auto;
  color: ${props => props.theme.colors.primaryTextColor};
  opacity: 1;
  font-size: 24px;
`;

const TipAmountText = styled(Text)`
  height: auto;
  color: ${props => props.theme.colors.secondaryTextColor};
  font-size: 14px;
`;

const CustomTipText = styled(Text)`
  height: auto;
`;

const TipBoxes = styled(Flex)`
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
  & > :nth-child(2) {
    margin-left: 10px;
    margin-right: 10px;
  }
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const DynamicTipBoxes = styled(Flex)`
  flex-direction: row;
  width: 100%;
  padding-top: 10px;
  font-size: 16px;
  justify-content: space-between;
  & > :nth-child(2) {
    margin-left: 10px;
  }
`;

const CustomTipAmount = styled(Text)`
  height: auto;
  width: 100%;
  font-weight: bold;
  color: ${props => props.theme.colors.primaryTextColor};
  font-size: 24px;
  text-align: center;
`;

class TipCapture extends Component {

  constructor (props) {
    super(props);
    this.state = {
      selectedTip: props.selectedTipProp,
      customTipValue: props.selectedTipProp === 'custom' ? props.selectedTipAmountProp : '',
      selectedTipAmount: '0.00',
      payableAmount: '',
      customTipInput: '',
      showModal: false,
      clearCartModalTitle: '',
      clearCartModalText: '',
      clearCartContinueButtonText: '',
      clearCartCancelButtonText: '',
      removePayments: this.props.removePayments
    };
    this.continueWithTip = this.continueWithTip.bind(this);
    this.continueWithoutTip = this.continueWithoutTip.bind(this);
    this.calculateTip = this.calculateTip.bind(this);
    this.calculateTipText = this.calculateTipText.bind(this);
    this.handleCustomAdd = this.handleCustomAdd.bind(this);
    this.handleUserInput = this.handleUserInput.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleCustomAddKeyDown = this.handleCustomAddKeyDown.bind(this);
    this.handleAddTipKeyDown = this.handleAddTipKeyDown.bind(this);
    this.selectTipOption = this.selectTipOption.bind(this);
    this.selectCustomTipOption = this.selectCustomTipOption.bind(this);
    this.editCustomTip = this.editCustomTip.bind(this);
    this.onModalContinue = this.onModalContinue.bind(this);
    this.closePopup = this.closePopup.bind(this);
    this.makeDialogAloneAccessible = this.makeDialogAloneAccessible.bind(this);
    this.makeEverythingAccessible = this.makeEverythingAccessible.bind(this);
    this.onEscape = this.onEscape.bind(this);
  }

  componentDidMount () {
    window.scrollTo(0, 0);
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevProps.tipFlag !== this.props.tipFlag) {
      const deliveryEnabled = getDeliveryEnabled(this.props.orderConfig);
      this.props.history.push(this.props.nameCapture ? '/nameCapture' : this.props.isSmsEnabled
        ? '/smsNotification' : deliveryEnabled ? '/deliveryLocation' : '/payment');
    }
  }

  makeDialogAloneAccessible (param) {
    let childId;
    if (param === 'showModal') {
      childId = 'parent-modal';
    }
    // Accessibility for dialog
    const bottomContainer = document.querySelector('.BottomContainer .tip-capture-container');
    const topContainer = document.querySelector('.TopContainer');

    topContainer.inert = true;
    const children = bottomContainer.children;

    Array.from(children).forEach(child => {
      if (child.id !== childId) {
        child.inert = true;
      }
    });
  }

  makeEverythingAccessible (param) {
    let childId;
    if (param === 'showModal') {
      childId = 'parent-modal';
    }
    // Accessibility for dialog
    const bottomContainer = document.querySelector('.BottomContainer .tip-capture-container');
    const topContainer = document.querySelector('.TopContainer');
    topContainer.inert = false;
    const children = bottomContainer.children;
    Array.from(children).forEach(child => {
      if (child.id !== childId) {
        child.inert = false;
      }
    });
  }
  onEscape (e) {
    if (e.which === 27) {
      this.closePopup();
    }
  }

  continueWithTip () {
    const obj = {
      selectedTip: this.state.selectedTip === 'custom' && this.state.customTipValue === ''
        ? '' : this.state.selectedTip,
      selectedTipAmount: parseFloat(this.calculateTipText(this.props.subTotal, this.state.selectedTip)).toFixed(2)
    };
    this.props.handlerForTipProp(obj);
  }
  continueWithoutTip () {
    const { remaining } = this.props;
    remaining && remaining > 0 ? this.showPopupInfo('NoTipButton')
      : this.setState({ selectedTip: '', customTipValue: '', customTipInput: '', selectedTipAmount: '0.00' });
  }

  calculateTip (amount, tipOption) {
    return (Math.round(amount * tipOption) / 100).toFixed(2);
  }

  calculateTipText (amount, tipOption) {
    if (tipOption === 'custom') {
      return this.state.customTipValue ? this.state.customTipValue : '0.00';
    } else {
      return (Math.round(amount * tipOption) / 100).toFixed(2);
    }
  }

  handleUserInput (e) {
    const value = e.target.value;
    var reg = /^\d{1,4}$|^\d{1,4}\.\d{1,2}$|^\d{1,4}\.$|^0\.$|^0$|^[1-9]\d{1,2}\.$|^\.\d{1,2}$|^0\.\d{1,2}$|^[1-9]\d{1,2}\.\d{1,2}$/; // eslint-disable-line max-len
    if (e.target.value === '.') {
      this.setState({ customTipInput: value });
    } else {
      if (e.target.value) {
        reg.exec(value) && this.setState({ customTipInput: value });
      } else {
        this.setState({ customTipInput: '' });
        this.customTip.value = '';
      }
    }
  }

  handleKeyDown (e) {
    if (e.which === 13 || e.which === 32) { // 13:enter 32:spacebar
      this.state.selectedTip !== 'custom' && this.setState({ selectedTip: 'custom' });
    }
  }

  handleCustomAddKeyDown (e) {
    if (e.which === 13 || e.which === 32) { // 13:enter 32:spacebar
      this.handleCustomAdd();
    }
  }

  handleAddTipKeyDown (e, tipOption) {
    if (e.which === 13 || e.which === 32) { // 13:enter 32:spacebar
      this.selectTipOption(tipOption);
    }
  }

  handleCustomAdd () {
    this.state.customTipInput && this.state.customTipInput !== ''
      ? this.setState({ customTipValue: this.state.customTipInput })
      : this.continueWithoutTip();
  }

  showPopupInfo (SelectedTipButton, tipOption) {
    this.setState({
      showModal: true,
      currentItem: tipOption,
      clearCartModalTitle: i18n.t('MODAL_TIP_REMOVE_HEADER'),
      clearCartModalText: i18n.t('MODAL_TIP_REMOVE_MESSAGE'),
      clearCartContinueButtonText: i18n.t('MODAL_TIP_REMOVE_CONTINUE_TEXT'),
      clearCartCancelButtonText: i18n.t('MODAL_TIP_REMOVE_CANCEL_TEXT'),
      buttonType: SelectedTipButton
    });
    this.makeDialogAloneAccessible('showModal');
  }

  selectCustomTipOption () {
    const { remaining } = this.props;
    const { removePayments } = this.state;
    !removePayments && remaining && remaining > 0 && this.state.selectedTip !== 'custom'
      ? this.showPopupInfo('SelectedCustomTip')
      : this.state.selectedTip !== 'custom' && this.setState({ selectedTip: 'custom' });
  }

  editCustomTip () {
    const { remaining } = this.props;
    const { removePayments } = this.state;
    !removePayments && remaining && remaining > 0 ? this.showPopupInfo('EditSelectedCustomTip')
      : this.setState({ customTipValue: '', customTipInput: '' });
  }

  selectTipOption (tipOption) {
    const { remaining } = this.props;
    const { removePayments } = this.state;
    !removePayments && remaining && remaining > 0 ? this.showPopupInfo('SelectedTipButton', tipOption)
      : this.setState({ selectedTip: tipOption, customTipValue: '', customTipInput: '' });
  }

  closePopup () {
    this.setState({ showModal: false });
    this.makeEverythingAccessible('showModal');
  }

  onModalContinue () {
    this.props.removeAllMultiPayments();
    this.closePopup();
    const { buttonType } = this.state;
    switch (buttonType) {
      case 'SelectedTipButton':
        this.setState({
          removePayments: true, selectedTip: this.state.currentItem, customTipValue: '', customTipInput: ''
        });
        break;
      case 'NoTipButton':
        this.setState({
          removePayments: true, selectedTip: '', customTipValue: '', customTipInput: '', selectedTipAmount: '0.00' });
        break;
      case 'SelectedCustomTip':
        this.setState({ selectedTip: 'custom', removePayments: true });
        break;
      case 'EditSelectedCustomTip':
        this.setState({ customTipValue: '', customTipInput: '', removePayments: true });
        break;
    }
  }
  onNoTipContinue () {
    this.props.removeAllMultiPayments();
    this.closePopup();
  }
  onCustomTipContinue () {
    this.props.removeAllMultiPayments();
    this.setState({ removePayments: true });
    this.state.selectedTip !== 'custom' && this.setState({ selectedTip: 'custom' });
    this.closePopup();
  }

  render () {
    const { tipDetails, customTipFlag, subTotal, tax, gratuity, serviceAmount, total, currencyDetails,
      isSmsEnabled, vatEnabled, nameCapture, deliveryEnabled } = this.props;
    const { showModal, clearCartModalTitle, clearCartModalText,
      clearCartContinueButtonText, clearCartCancelButtonText } = this.state;
    const tipTotal = parseFloat(this.calculateTipText(subTotal, this.state.selectedTip));
    const displayTotal = (total + tipTotal)
      ? currencyLocaleFormat((total + tipTotal), currencyDetails) : '';
    const currencyLocale = currencyLocaleFormat(0, currencyDetails).charAt(0) === currencyDetails.currencySymbol;

    return (
      <ThemeProvider className='tip-capture' theme={theme}>
        <Container className='tip-capture-container'>
          <ChildBox className='child-box'>
            <BillBox className='bill-box'>
              <BillFields className='bill-field sub-total' style={{paddingBottom: '10px'}}>
                <LabelText className='bill-amount-label sub-total' tabIndex={0} aria-label={i18n.t('TIP_CAPTURE_SUBTOTAL')}>
                  <Trans i18nKey='TIP_CAPTURE_SUBTOTAL'/>
                </LabelText>
                <LabelText className='bill-amount-value sub-total' tabIndex={0}
                  aria-label={currencyLocaleFormat(parseFloat(subTotal).toFixed(2), currencyDetails)}>
                  {currencyLocaleFormat(parseFloat(subTotal).toFixed(2), currencyDetails)}
                </LabelText>
              </BillFields>
              {gratuity > 0 && <BillFields className='bill-field gratuity' style={{ paddingBottom: '10px' }}>
                <LabelText className='bill-amount-label gratuity' tabIndex={0} aria-label={i18n.t('TIP_CAPTURE_GRATUITY')}>
                  <Trans i18nKey='TIP_CAPTURE_GRATUITY'/>
                </LabelText>
                <LabelText className='bill-amount-value gratuity' tabIndex={0}
                  aria-label={currencyLocaleFormat(parseFloat(gratuity).toFixed(2), currencyDetails)}>
                  {currencyLocaleFormat(parseFloat(gratuity).toFixed(2), currencyDetails)}
                </LabelText>
              </BillFields>}
              {serviceAmount > 0 && <BillFields className='bill-field service-amount' style={{ paddingBottom: !vatEnabled ? '10px' : '0px' }}>
                <LabelText className='bill-amount-label service-amount' tabIndex={0} aria-label={i18n.t('TIP_CAPTURE_SERVICE_CHARGE')}>
                  <Trans i18nKey='TIP_CAPTURE_SERVICE_CHARGE'/>
                </LabelText>
                <LabelText className='bill-amount-value service-amount' tabIndex={0}
                  aria-label={currencyLocaleFormat(parseFloat(serviceAmount).toFixed(2), currencyDetails)}>
                  {currencyLocaleFormat(parseFloat(serviceAmount).toFixed(2), currencyDetails)}
                </LabelText>
              </BillFields>}
              {!vatEnabled && <BillFields className='bill-field'>
                <LabelText className='bill-amount-label' tabIndex={0} aria-label={i18n.t('TIP_CAPTURE_TAX')}>
                  <Trans i18nKey='TIP_CAPTURE_TAX'/>
                </LabelText>
                <LabelText
                  className='bill-amount-value'
                  tabIndex={0}
                  aria-label={currencyLocaleFormat(parseFloat(tax).toFixed(2), currencyDetails)}>
                  {currencyLocaleFormat(parseFloat(tax).toFixed(2), currencyDetails)}
                </LabelText>
              </BillFields>}
            </BillBox>
            <TipBox className='tip-box'>

              <BillFields className='bill-field bill'>
                <AddTip className='add-tip-label' tabIndex={0} aria-label={i18n.t('TIP_CAPTURE_TIP')}>
                  <Trans i18nKey='TIP_CAPTURE_TIP'/>
                </AddTip>
                <AddTip
                  className='add-tip-label'
                  tabIndex={0}
                  aria-label={i18n.t(currencyLocaleFormat(parseFloat(this.calculateTipText(subTotal,
                    this.state.selectedTip)).toFixed(2), currencyDetails))}
                >
                  {currencyLocaleFormat(parseFloat(this.calculateTipText(subTotal, this.state.selectedTip)).toFixed(2),
                    currencyDetails)}
                </AddTip>
              </BillFields>
              <TipBoxes
                className='tip-options-list'
                tabIndex={0}
                aria-label={`${i18n.t('TIP_SELECTION')} ${tipDetails && tipDetails.tips.length} ${i18n.t('OPTIONS_LABEL')}`}>
                {
                  tipDetails && tipDetails.tips.map((tipOption, index) => (
                    <React.Fragment key={`tip-${index}`}>
                      <TipButton
                        tabIndex={0}
                        onKeyDown={(e) => this.handleAddTipKeyDown(e, tipOption)}
                        className={`tip-button-${index}`}
                        onClick={() => {
                          this.selectTipOption(tipOption);
                        }}
                        selected={this.state.selectedTip === tipOption}
                      >
                        <TipText className='tip-option'>{tipOption}%</TipText>
                        <TipAmountText className='tip-amount'>
                          {currencyLocaleFormat(this.calculateTip(subTotal, tipOption), currencyDetails)}
                        </TipAmountText>
                      </TipButton>
                    </React.Fragment>
                  ))}
              </TipBoxes>
              <DynamicTipBoxes className='dynamic-boxes'>
                <NoTipButton
                  tabIndex={0}
                  className='no-tip-button'
                  fullwidth={customTipFlag ? 0 : 1}
                  children={<Trans i18nKey='TIP_CAPTURE_NO_GRATUITY'/>}
                  onClick={this.continueWithoutTip}
                />
                { customTipFlag &&
                <CustomTipButton
                  onKeyDown={(e) => this.handleKeyDown(e)}
                  tabIndex={0}
                  className='custom-tip-button'
                  pointerclick={this.state.selectedTip === 'custom' ? 1 : 0}
                  onClick={this.selectCustomTipOption}
                  selected={this.state.selectedTip === 'custom'}>
                  {this.state.selectedTip === 'custom'
                    ? < CustomTipField className='custom-tip-field'>
                      { this.state.customTipValue
                        ? <React.Fragment>
                          <div style={{ width: 'calc(1/3*100% - (1 - 1/3)*30px)' }}/>
                          <CustomTipAmount className='custom-tip-entered'>
                            {currencyLocaleFormat(parseFloat(this.state.customTipValue).toFixed(2), currencyDetails)}
                          </CustomTipAmount>
                          <CloseBox
                            className='close-button'
                            tabIndex={0}
                            aria-label={i18n.t('CLEAR_VALUE')}
                            children='&#10005;'
                            onClick={this.editCustomTip}
                          />
                        </React.Fragment>
                        : <React.Fragment>
                          <CustomFlex className='custom-flex'>
                            {currencyLocale &&
                            <CurrencyText className='currency-text'
                              tabIndex={0} aria-label={`${currencyDetails.currencySymbol} ${this.state.customTipInput}`}
                              value={this.state.customTipInput}>{currencyDetails.currencySymbol}</CurrencyText>
                            }
                            <CustomTipInput
                              innerRef={(e) => { this.customTip = e; }}
                              className='custom-tip-input-field'
                              type='number'
                              customtipinput={this.state.customTipInput}
                              autoFocus
                              aria-label={i18n.t('TIP_CAPTURE_CUSTOM')}
                              onChange={(e) => this.handleUserInput(e)}
                              onKeyPress={(e) => (e.which === 45 || e.which === 43 ||
                              e.keyCode === 107 || e.keyCode === 109) &&
                               e.preventDefault()}
                              value={this.state.customTipInput}
                            />
                            {!currencyLocale &&
                              <CurrencyText className='currency-text'
                                tabIndex={0}
                                aria-label={`${currencyDetails.currencySymbol} ${this.state.customTipInput}`}
                                value={this.state.customTipInput}>{currencyDetails.currencySymbol}</CurrencyText>
                            }
                          </CustomFlex>
                          <AddCustomTipButton
                            tabIndex={0}
                            className='add-custom-tip-button'
                            children={<Trans i18nKey='TIP_CAPTURE_ADD'/>}
                            tipamount={this.state.customTipInput}
                            onClick={this.handleCustomAdd}
                            onKeyDown={(e) => this.handleCustomAddKeyDown(e)}
                          />
                        </React.Fragment>
                      }

                    </CustomTipField>
                    : <CustomTipText className='custom-tip-textss'><Trans i18nKey='TIP_CAPTURE_CUSTOM'/></CustomTipText>
                  }
                </CustomTipButton>
                }
              </DynamicTipBoxes>

            </TipBox>
            <PayBox className='button-box'>
              <PayField className='pay-field'>
                <LabelText className='bill-amount-label' tabIndex={0} aria-label={i18n.t('TIP_CAPTURE_AMOUNT_PAYABLE')}>
                  <Trans i18nKey='TIP_CAPTURE_AMOUNT_PAYABLE'/>
                </LabelText>
                <LabelText className='bill-amount-value' tabIndex={0} aria-label={displayTotal}>
                  {displayTotal}
                </LabelText>
              </PayField>
              <ButtonParent className='button-parent'>
                <PayButton
                  tabIndex={0}
                  className='pay-button'
                  children={(nameCapture || deliveryEnabled || isSmsEnabled)
                    ? <Trans i18nKey='NEXT_LABEL'/> : <Trans i18nKey='DELIVERY_LOCATION_CONTINUE_PAY'/>}
                  onClick={this.continueWithTip}/>
              </ButtonParent>
            </PayBox>
          </ChildBox>
          {showModal &&
          <Modal
            open={showModal}
            showCancelButton
            showClose
            onCancel={this.closePopup}
            onClose={this.closePopup}
            onContinue={this.onModalContinue}
            onEscape={this.onEscape}
            cancelButtonText={clearCartCancelButtonText}
            continueButtonText={clearCartContinueButtonText}
            title={clearCartModalTitle}
            textI18nKey={clearCartModalText}
          />}
        </Container>
      </ThemeProvider>
    );
  }
}

export default TipCapture;
