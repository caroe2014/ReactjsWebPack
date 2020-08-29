// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

/* eslint-disable max-len */
import React, { Component } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { Flex, Box, Heading, Text, Button, Fixed, Image } from 'rebass';
import theme from 'web/client/theme.js';
import get from 'lodash.get';
import ReceiptPopup from 'web/client/app/components/ReceiptPopup';
import Loader from 'web/client/app/components/Loader/index';
import { Trans } from 'react-i18next';
import i18n from 'web/client/i18n';
import { currencyLocaleFormat } from 'web/client/app/utils/NumberUtils';
import { ConnectedLoyaltyProcess } from 'web/client/app/reduxpages/ConnectedComponents';
import moment from 'moment-timezone';
import { LoadingComponent } from 'web/client/app/components/Loader/ReusableLoader';
import { getVatEntriesFromOrderedItems } from 'web/client/app/utils/VatUtils';
import Announcements from 'web/client/app/components/Announcements';

const Container = styled(Flex)`
  flex-direction: column;
  max-width: 450px;
  margin: 70px auto auto auto;
  padding: 20px 0px 0px 0px;
  width: 100%;
  padding-top:50px;
  border-bottom: none;
  background-color: ${props => props.theme.colors.light};
  background-color: #EEEEEE;
  height: fit-content;
  @media print{
    display:none;
  }
`;

const BackgroundContainer = styled.div`
  margin: -50px auto auto auto;
  padding: 20px 20px 0px 20px;
  border: 1px solid lightgrey;
  ${props => props.theme.mediaBreakpoints.tablet`
  margin: -120px auto auto auto;
  padding: 0px 20px 0px 20px;
  `}
  ${props => props.theme.mediaBreakpoints.mobile`
    margin: -120px auto auto auto;
    padding: 0px 20px 0px 20px;
  `}
  max-width: 453px;
  width: 100%;
  background: ${props => props.theme.colors.light};
  z-index: -1;
  position: fixed;
  height: 100%;
  @media print{
    display:none;
  }
  left: 50%;
  transform: translate(-50%, 0);
`;

const ModifierFlex = styled(Flex)`
  padding-left:20px;
  line-height: normal;
  align-tems: flex-start;
`;

const StoreContainer = styled(Flex)`
  font-size: 1.2rem;
  font-weight: bold;
  align-items: center;
  text-align: center;
  justify-content: center;
  font-family: ${props => props.theme.receiptFontFamily};
`;

const StoreAddress = styled(Flex)`
 font-size: 1.2rem;
  align-items: center;
  margin: 10px 0 10px 0;
  text-align: center;
  justify-content: center;
  flex-direction: column;
  font-family: ${props => props.theme.receiptFontFamily};
  & > div {
    font-family: ${props => props.theme.receiptFontFamily};
  }
`;

const LoadingContainer = styled(Fixed)`
  display:flex;
  justify-content: center;
  align-items: center;
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

const PaymentSuccessHeader = styled(Heading)`
  color: ${props => props.theme.colors.primaryTextColor};
  font-size: 20px;
  font-weight: 500;
  margin: 10px 0px 20px;
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const DeliveryConfirmationText = styled(PaymentSuccessHeader)`
  text-align: center;
  margin: 10px 10px 20px 10px;
`;

const Total = styled(Heading)`
  color: ${props => props.theme.colors.primaryTextColor};
  font-size: 20px;
  font-weight: 500;
  margin-bottom: 20px;
  text-align: center;
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const OrderNumber = styled(Total)`
  margin-bottom: 0px;
`;

const ReadyTimeBlock = styled(Flex)`
  outline: none;
  box-shadow: none;
  flex-direction: column;
`;

const ReceiptText = styled(Text)`
  color: ${props => props.theme.colors.primaryTextColor};
  margin-top: 20px;
  margin-bottom: 15px;
  font-size: 20px;
  font-weight: 500;
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const BoxContainer = styled(Box)`
  height: auto;
`;

const LoyaltyContainer = styled(Box)`
  height: auto;
  margin: 10px 0px 0px;
  color: ${props => {
    if (props.enabled) return 'white';
    return 'red';
  }};
`;

const SendButton = styled(Button)`
  color:  ${props => props.theme.colors.buttonControlColor};
  cursor: pointer;
  background: white;
  ${props => {
    if (props['processing']) {
      return `
        background: ${props.theme.colors.buttonControlColor};
        color: ${props.theme.colors.buttonTextColor};
        cursor: not-allowed;
      `;
    };
  }};
  ${props => {
    if (props['disabled']) {
      return `
        border: 2px solid grey !important;
        color: grey;
        cursor: auto;
    `;
    };
    return `
      border: 2px solid ${props.theme.colors.buttonControlColor} !important;
  `;
  }};
  border-radius: 6px !important;
  font-weight: 500;
  font-size: 16px;
  float: right;
  width: 100%;
  height: 50px;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.nm};
  &:hover {
    box-shadow: 0px 0px 10px 2px lightgrey;
    -webkit-box-shadow: 0px 0px 10px 2px lightgrey;
    -moz-box-shadow: 0px 0px 10px 2px lightgrey;
  }
  text-align: center;
  margin: 0 auto;
  border: none;
  border-radius: 0;
  &:focus {
    outline: none;
    box-shadow: none;
  }
  &:disabled{
    opacity: 0.5;
  }
`;

const PrintViewParent = styled(Flex)`
  position: absolute;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.theme.colors.light};
  width: 100%;
  display: none;
  @media print {
    display: block;
  }
  @page {
    size: auto;
    margin: 20mm 0mm;
  }
  & > div {
    page-break-inside: avoid;
  }
`;

const PrintView = styled(Box)`
  width: 30em;
  background-color: ${props => props.theme.colors.light};
  margin: 0 auto;
  & > div {
    page-break-inside: avoid;
  }
`;

const BorderFlex = styled(Flex)`
  align-items: center;
  margin: 10px 0 10px 0;
  line-height: 0;
`;

const ItemFlex = styled(Flex)`
  align-items: center;
  margin: 10px 0 10px 0;
  line-height: normal;
  font-family: ${props => props.theme.receiptFontFamily};
`;

const TaxTotalLabel = styled(Text)`
  color: ${props => props.theme.colors.primaryText};
  font-size: 1.2rem;
  font-weight: 200;
  font-family: ${props => props.theme.receiptFontFamily};
`;

const TenderLabel = styled(Text)`
  color: ${props => props.theme.colors.primaryText};
  font-size: 1.2rem;
  font-weight: 200;
  text-transform: capitalize;
  font-family: ${props => props.theme.receiptFontFamily};
`;

const ItemLabel = styled(Text)`
  color: ${props => props.theme.colors.primaryText};
  font-size: 1.2rem;
  font-weight: 200;
  word-break: break-word;
  font-family: ${props => props.theme.receiptFontFamily};
`;

const TotalLabel = styled(Text)`
  color: ${props => props.theme.colors.primaryText};
  font-size: 1.2rem;
  font-weight: bold;
  font-family: ${props => props.theme.receiptFontFamily};
`;

const ItemPrice = styled(Text)`
  color: ${props => props.theme.colors.primaryText};
  font-size: 1.2rem;
  font-weight: 200;
  font-family: ${props => props.theme.receiptFontFamily};
`;

const ItemTotal = styled(Text)`
  color: ${props => props.theme.colors.primaryText};
  font-size: 1.2rem;
  font-weight: bold;
  font-family: ${props => props.theme.receiptFontFamily};
`;

const Description = styled(Text)`
  color: ${props => props.theme.colors.primaryText};
  font-size: ${props => props.theme.fontSize.nm};
  display: inline;
  float: left;
  font-weight: 200;
  padding-left: 20px;
  word-break: break-word;
  font-family: ${props => props.theme.receiptFontFamily};
`;

const InstructionText = styled(Description)`
  text-transform: uppercase;
  font-family: ${props => props.theme.receiptFontFamily};
`;

const Price = styled(Text)`
  color: ${props => props.theme.colors.primaryText};
  font-size: ${props => props.theme.fontSize.nm};
  display: inline;
  float: right;
  font-weight: 400;
  font-family: ${props => props.theme.receiptFontFamily};
`;

const TopFlex = styled(Flex)`
  width: 100%;
  justify-content: center;
  align-items: center;
  display: flex;
  flex-direction: column;
  background: white;
  font-family: ${props => props.theme.receiptFontFamily};
`;

const TopDiv = styled(TopFlex)`
  padding: 0px 10px 24px;
  `;

const BottomFlex = styled(TopFlex)`
  margin-top: 20px;
  padding: 0px 50px 70px;
  `;

const CircleFlex = styled(Flex)`
  flex-direction: column;
  background: white;
  border: 1px solid white;
  border-radius: 50%;
  width: 40px;
  height: 50px;
  justify-content: center;
  align-items: center;
  display: flex;
  margin-top: -20px;
  & > i {
    color: ${props => props.theme.colors.buttonControlColor}
  }
`;

const TextContainer = styled(Text)`
  color: ${props => props.theme.colors.primaryText};
  font-size: ${props => props.theme.fontSize.nm};
  display: inline;
  float: right;
  font-weight: 400;
  text-align: center;
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const ButtonParentFlex = styled(Flex)`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const BtnFlex = styled(Flex)`
  flex: 0.70;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  text-align: left;
`;

const SuccessDiv = styled(Flex)`
  width: 100%;
  padding: 10px 0px 0px;
  justify-content: center;
  align-items: center;
  & > i {
    color: ${props => props.theme.colors.buttonControlColor}
  }
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const LoaderDiv = styled(Flex)`
  fontSize: 22px;
  flex: 0.3;
  justify-content: center;
  align-items: center;
  height: 30px;
  margin-left: -6px;
`;

const VatContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const checkStyle = {
  color: theme.colors.buttonControlColor,
  fontSize: '65px',
  marginBottom: '15px'
};

const SentStyle = {
  fontSize: '20px',
  marginRight: '8px',
  color: theme.colors.buttonControlColor
};

const btnStyle = {
  color: theme.colors.primaryText,
  fontSize: '22px',
  flex: '0.3'
};

class PaymentSuccess extends Component {
  constructor (props) {
    super(props);
    this.state = {
      emailSent: false,
      loading: false,
      errorEmail: '',
      errorMobile: '',
      validationError: '',
      email: '',
      cart: null,
      loader: false,
      printReceipt: null,
      showPrintView: false,
      showReceiptFlag: false,
      modalLoader: false,
      sendingEmail: false,
      sendingSMS: false,
      previousActiveElement: ''
    };

    this.redirectReceipt = this.redirectReceipt.bind(this);
    this.getPrintData = this.getPrintData.bind(this);
    this.maskAccountNumber = this.maskAccountNumber.bind(this);
    this.openLoyaltyProcess = this.openLoyaltyProcess.bind(this);
    this.closeLoyaltyProcess = this.closeLoyaltyProcess.bind(this);
    this.getReadyTime = this.getReadyTime.bind(this);
    this.buttonContent = this.buttonContent.bind(this);
    this.showReceiptPopup = this.showReceiptPopup.bind(this);
    this.hideReceiptPopup = this.hideReceiptPopup.bind(this);
    this.sendEmailReceipt = this.sendEmailReceipt.bind(this);
    this.sendSMSReceipt = this.sendSMSReceipt.bind(this);
    this.makeDialogAloneAccessible = this.makeDialogAloneAccessible.bind(this);
    this.makeEverythingAccessible = this.makeEverythingAccessible.bind(this);
    this.getOrderMessage = this.getOrderMessage.bind(this);
    this.getMobileNumberFromProfile = this.getMobileNumberFromProfile.bind(this);
    this.getCountryInfoFromProfile = this.getCountryInfoFromProfile.bind(this);
  }

  componentWillMount () {
    if (this.props.sites.list.length === 0) {
      this.props.getSites();
    }
  }

  componentDidMount () {
    window.scrollTo(0, 0);
  }

  componentDidUpdate (prevProps) {
    if (!this.props.orderConfig) {
      this.props.history && this.props.history.replace('/');
    }
    if (prevProps.sendEmailFlag !== this.props.sendEmailFlag) {
      this.emailConfirmation();
      this.stopLoading();
    }
    if (prevProps.sendSMSFlag !== this.props.sendSMSFlag) {
      this.smsConfirmation();
      this.stopLoading();
    }
    if (prevProps.sendEmailReceiptError !== this.props.sendEmailReceiptError || prevProps.emailReceiptError !== this.props.emailReceiptError) {
      this.resetEmail();
      this.stopLoading();
    }
    if (prevProps.sendSMSReceiptError !== this.props.sendSMSReceiptError || prevProps.smsReceiptError !== this.props.smsReceiptError) {
      this.resetSMS();
      this.stopLoading();
    }
    if (this.props.saleData && prevProps.saleData !== this.props.saleData) {
      this.props.getPrintData();
      const emailReceipt = get(this.props, 'orderConfig.emailReceipt');
      emailReceipt && emailReceipt.customerAddress && emailReceipt.customerAddress.length > 0 && this.props.sendCustomerEmail(emailReceipt.customerAddress);
    }
    if (prevProps.saleData && this.props.saleData && prevProps.saleData.printReceipt !== this.props.saleData.printReceipt && this.state.showPrintView) {
      this.stopLoading();
      this.onPrintPreview();
    }
  }

  resetEmail () {
    this.setState({ sendingEmail: false });
  }

  resetSMS () {
    this.setState({ sendingSMS: false });
  }

  emailConfirmation () {
    this.setState({ sendingEmail: false });
  }

  smsConfirmation () {
    this.setState({ sendingSMS: false });
  }

  stopLoading () {
    this.setState({ loader: false, modalLoader: false });
  }

  showReceiptPopup (type) {
    this.makeDialogAloneAccessible('popup');
    this.setState({ showReceiptFlag: true, showReceiptType: type });
  }

  hideReceiptPopup () {
    this.setState({ showReceiptFlag: false });
  }

  getPrintData () {
    if (this.props.saleData.printReceipt === null) {
      this.props.getPrintData();
      this.setState({ loader: true, showPrintView: true });
    } else {
      this.onPrintPreview();
    }
  }

  openLoyaltyProcess () {
    !this.props.isPointAccrued && this.setState({ openLoyalty: true });
    this.makeDialogAloneAccessible('loyalty');
  }

  closeLoyaltyProcess () {
    this.setState({ openLoyalty: false });
  }

  sendEmailReceipt (obj) {
    this.props.sendReceiptEmail(obj);
    this.setState({ sendingEmail: true });
  }

  sendSMSReceipt (obj) {
    this.props.sendReceiptSMS(obj);
    this.setState({ sendingSMS: true });
  }

  maskAccountNumber (number) {
    return (number.slice(-4));
  }

  redirectReceipt () {
    this.props.history.replace('/');
    this.props.resetSites();
  }

  componentWillUnmount () {
    this.props.clearReadyTime();
  }

  onPrintPreview () {
    const appElement = window.document.getElementById('app-background');
    let appStyle;
    if (appElement) {
      appStyle = appElement.style.cssText;
    }
    window.print();
    appElement && setTimeout(() => {
      appElement.style.cssText = appStyle;
    }, 1000);
  }

  getAbsoluteReadyTime (etf, orderTime, defaultLocale) {
    const timeWithEtf = moment(orderTime).add(etf, 'minutes').locale(defaultLocale);
    timeWithEtf.set({
      minute: Math.ceil(timeWithEtf.get('minute') / 5) * 5
    });
    return moment(timeWithEtf).locale(defaultLocale).format('LT');
  }

  getReadyTime (readyTime, scheduledTime, scheduledDay, deliveryProperties, storeName, orderTime, defaultLocale) {
    if (!deliveryProperties) return;
    const etf = get(readyTime, 'etf') ? get(readyTime, 'etf.minutes') : get(readyTime, 'minutes');
    const minTime = get(readyTime, 'minTime.minutes');
    const maxTime = get(readyTime, 'maxTime.minutes');
    const scheduleFromTime = scheduledTime;

    if (!scheduledTime) {
      let readyText = {};
      readyText.line1 = (deliveryProperties.deliveryOption.id === 'delivery')
        ? i18n.t('READY_TEXT_DELIVERY_LOCATION', { storeName: storeName, deliveryLocation: deliveryProperties.deliveryLocation, interpolation: { escapeValue: false } })
        : i18n.t('READY_TEXT_DINE_IN_PICKUP', {
          deliveryOption: deliveryProperties.deliveryOption.id === 'dinein'
            ? i18n.t('READY_TEXT_DINE_IN') : i18n.t('READY_TEXT_PICKUP'),
          storeName: storeName,
          interpolation: { escapeValue: false }
        });

      if (etf >= 0) {
        if (etf === 0) {
          readyText.line2 = i18n.t('READY_TEXT_A_MINUTE');
        } else if (etf === 1) {
          readyText.line2 = i18n.t('READY_TEXT_IN_A_MINUTE');
        } else {
          readyText.line2 = etf > 60
            ? i18n.t('READY_TEXT_ABS_TIME', { absoluteTime: this.getAbsoluteReadyTime(etf, orderTime, defaultLocale) })
            : i18n.t('READY_TEXT_ABOUT_MINUTES', { minutes: etf });
        }
      } else if (minTime >= 0 && maxTime >= 0) {
        if (minTime === 0 && maxTime === 0) {
          readyText.line2 = i18n.t('READY_TEXT_A_MINUTE');
        } else if (minTime === maxTime && minTime !== 0) {
          readyText.line2 = minTime > 60
            ? i18n.t('READY_TEXT_ABS_TIME', { absoluteTime: this.getAbsoluteReadyTime(minTime, orderTime, defaultLocale) })
            : i18n.t(minTime === 1 ? 'READY_TEXT_IN_A_MINUTE' : ('READY_TEXT_ABOUT_MINUTES', { minutes: minTime }));
        } else if (minTime === 0 && maxTime === 1) {
          readyText.line2 = i18n.t('READY_TEXT_IN_A_MINUTE');
        } else if (minTime === 0 && maxTime > 1) {
          readyText.line2 = maxTime > 60
            ? i18n.t('READY_TEXT_ABS_TIME', { absoluteTime: this.getAbsoluteReadyTime(maxTime, orderTime, defaultLocale) })
            : i18n.t('READY_TEXT_LESS_THAN_N_MIN', { minutes: maxTime });
        } else {
          readyText.line2 = maxTime > 60
            ? i18n.t('READY_TEXT_BETWEEN_M_TO_N_MIN', {
              minTime: this.getAbsoluteReadyTime(minTime, orderTime, defaultLocale),
              maxTime: this.getAbsoluteReadyTime(maxTime, orderTime, defaultLocale)
            })
            : i18n.t('READY_TEXT_IN_M_TO_N_MIN', { minTime: minTime, maxTime: maxTime });
        }
      }
      return readyText;
    } else {
      const readyText = (deliveryProperties.deliveryOption.id === 'delivery')
        ? {
          line1: i18n.t('READY_TEXT_AT_STORE', { storeName: storeName, deliveryLocation: deliveryProperties.deliveryLocation, interpolation: { escapeValue: false } }),
          line2: `${scheduledDay ? i18n.t('READY_TEXT_SCHEDULE_ON', { day: scheduledDay }) : i18n.t('READY_TEXT_SCHEDULE_TODAY')} ${i18n.t('READY_TEXT_SCHEDULE_BETWEEN', { startTime: scheduleFromTime.startTime, endTime: scheduleFromTime.endTime })}`
        }
        : {
          line1: i18n.t('READY_TEXT_AT_STORE_FOR', {
            deliveryOption: deliveryProperties.deliveryOption.id === 'dinein' ? i18n.t('READY_TEXT_DINE_IN') : i18n.t('READY_TEXT_PICKUP'),
            storeName: storeName,
            interpolation: { escapeValue: false }
          }),
          line2: `${scheduledDay ? i18n.t('READY_TEXT_SCHEDULE_ON', { day: scheduledDay }) : i18n.t('READY_TEXT_SCHEDULE_TODAY')} ${i18n.t('READY_TEXT_SCHEDULE_BETWEEN', { startTime: scheduleFromTime.startTime, endTime: scheduleFromTime.endTime })}`
        };

      return readyText;
    }
  };

  getOrderMessage (readyTime, scheduledTime, scheduledDay, deliveryProperties, storeName, orderTime, defaultLocale) {
    if (!deliveryProperties) return;
    const etf = get(readyTime, 'etf') ? get(readyTime, 'etf.minutes') : get(readyTime, 'minutes');
    const minTime = get(readyTime, 'minTime.minutes');
    const maxTime = get(readyTime, 'maxTime.minutes');
    const scheduleFromTime = scheduledTime;
    if (!scheduledTime) {
      const readyText = deliveryProperties.deliveryOption.id === 'delivery'
        ? i18n.t('PRINT_MSG_ETF_LOCATION', { storeName: storeName, deliveryLocation: deliveryProperties.deliveryLocation, interpolation: { escapeValue: false } })
        : i18n.t('PRINT_MSG_ETF_OPTION', {
          deliveryOption: deliveryProperties.deliveryOption.id === 'dinein'
            ? i18n.t('READY_TEXT_DINE_IN') : i18n.t('READY_TEXT_PICKUP'),
          storeName: storeName,
          interpolation: { escapeValue: false }
        });

      let minuteText = '';
      if (etf >= 0) {
        if (etf === 0) {
          minuteText = i18n.t('PRINT_MSG_A_MINUTE');
        } else if (etf === 1) {
          minuteText = i18n.t('PRINT_MSG_IN_A_MINUTE');
        } else {
          minuteText = etf > 60 ? i18n.t('PRINT_MSG_ABS_TIME', { absoluteTime: this.getAbsoluteReadyTime(etf, orderTime, defaultLocale) })
            : i18n.t('PRINT_MSG_IN_N_MIN', { readyTime: etf });
        }
      } else if (minTime >= 0 && maxTime >= 0) {
        if (minTime === 0 && maxTime === 0) {
          minuteText = i18n.t('PRINT_MSG_A_MINUTE');
        } else if (minTime === maxTime && minTime !== 0) {
          minuteText = minTime > 60
            ? i18n.t('PRINT_MSG_ABS_TIME', { absoluteTime: this.getAbsoluteReadyTime(minTime, orderTime, defaultLocale) })
            : minTime === 1 ? i18n.t('PRINT_MSG_IN_A_MINUTE') : i18n.t('PRINT_MSG_IN_N_MIN', { readyTime: minTime });
        } else if (minTime === 0 && maxTime === 1) {
          minuteText = i18n.t('PRINT_MSG_IN_A_MINUTE');
        } else if (minTime === 0 && maxTime > 1) {
          minuteText = maxTime > 60
            ? i18n.t('PRINT_MSG_ABS_TIME', { absoluteTime: this.getAbsoluteReadyTime(maxTime, orderTime, defaultLocale) })
            : i18n.t('PRINT_MSG_THAN_N_MINUTES', { minutes: maxTime });
        } else {
          minuteText = maxTime > 60
            ? i18n.t('PRINT_MSG_BETWEEN_M_TO_N_MIN', {
              minTime: this.getAbsoluteReadyTime(minTime, orderTime, defaultLocale),
              maxTime: this.getAbsoluteReadyTime(maxTime, orderTime, defaultLocale)
            })
            : i18n.t('PRINT_MSG_IN_M_TO_N_MIN', { minTime: minTime, maxTime: maxTime });
        }
      }
      return `${readyText}${minuteText}.`;
    } else {
      const readyText = deliveryProperties.deliveryOption.id === 'delivery'
        ? (i18n.t('PRINT_MSG_SCHEDULE_LOCATION', { storeName: storeName, deliveryLocation: deliveryProperties.deliveryLocation, interpolation: { escapeValue: false } }) +
          (scheduledDay ? i18n.t('PRINT_MSG_SCHEDULE_ON', { scheduledDay: scheduledDay, startTime: scheduleFromTime.startTime, endTime: scheduleFromTime.endTime })
            : i18n.t('PRINT_MSG_SCHEDULE_TODAY', { startTime: scheduleFromTime.startTime, endTime: scheduleFromTime.endTime })))
        : (i18n.t('PRINT_MSG_SCHEDULE_OPTION', {
          storeName: storeName,
          interpolation: { escapeValue: false },
          deliveryOption: deliveryProperties.deliveryOption.id === 'dinein'
            ? i18n.t('READY_TEXT_DINE_IN') : i18n.t('READY_TEXT_PICKUP')
        }) +
          ((scheduledDay ? i18n.t('PRINT_MSG_SCHEDULE_ON', { scheduledDay: scheduledDay, startTime: scheduleFromTime.startTime, endTime: scheduleFromTime.endTime })
            : i18n.t('PRINT_MSG_SCHEDULE_TODAY', { startTime: scheduleFromTime.startTime, endTime: scheduleFromTime.endTime }))));

      return `${readyText}.`;
    }
  }

  buttonContent (icon, key, value, showLoader) {
    return (
      <ButtonParentFlex className='loyalty-btn'>
        {showLoader
          ? <LoaderDiv className='loader-parent'>
            <LoadingComponent
              className='ga-loading-comp'
              color='white'
              containerHeight='100%'
              containerWidth='100%'
              aria-label={i18n.t('PROCESSING_TEXT')}
              height='20px'
              width='20px'
              borderSize={2}
              style={{ justifyContent: 'center' }}
            />
          </LoaderDiv>
          : <i className={`fa ${icon}`} style={btnStyle} />}
        <BtnFlex>{value || <Trans i18nKey={key} />}</BtnFlex>
      </ButtonParentFlex>
    );
  }

  getMobileNumberFromProfile (countryInfo) {
    if (countryInfo) {
      let matchedPhone = countryInfo.matchedPhone;
      return get(matchedPhone, 'countryCode', '') + get(matchedPhone, 'number', '');
    }
  }

  getCountryInfoFromProfile (countryCodeList, countryCode, regionCode, platformProfile) {
    if (!countryCodeList) {
      return {
        label: '',
        phoneCode: countryCode,
        value: regionCode
      };
    } else if (platformProfile) {
      let phoneList = get(platformProfile, 'gpBusinessCard.phoneNumbers');
      let matchedCountry = {};
      if (phoneList && phoneList.length > 0) {
        let sortedPhoneList = phoneList.sort((a, b) => (a.ordinal - b.ordinal));
        let matchedPhone = sortedPhoneList.find(phone => {
          let profileCountryCode = phone.countryCode.slice(1) || '';
          let profileTimeZone = phone.timeZone || '';
          let country = countryCodeList.find(country => country.countryCode === profileCountryCode && country.regionCode === profileTimeZone);
          matchedCountry = country;
          return country;
        });
        return {
          matchedPhone: matchedPhone || {},
          label: (matchedCountry && matchedCountry.name) || '',
          phoneCode: (matchedCountry && matchedCountry.countryCode) || countryCode,
          value: (matchedCountry && matchedCountry.regionCode) || regionCode
        };
      }
    }
  }

  makeDialogAloneAccessible (param) {
    const previousActiveElement = document.activeElement;
    this.setState({
      previousActiveElement
    });
    let parentClass = '.pay-success-container .bottom-div';
    let parentClass1 = '.pay-success-container .top-div';
    let childId;
    if (param === 'loyalty') {
      childId = 'accrual-modal';
    } else if (param === 'popup') {
      childId = 'receipt-modal';
    }
    // Accessibility for dialog
    const bottomContainer = document.querySelector(parentClass);
    const topContainer = document.querySelector('.TopContainer');
    const payTopcontainer = document.querySelector(parentClass1);
    topContainer.inert = true;
    payTopcontainer.inert = true;
    const Children = bottomContainer.children;
    Array.from(Children).forEach(child => {
      if (child.id !== childId) {
        child.inert = true;
      }
    });
  }

  makeEverythingAccessible (param) {
    const { previousActiveElement } = this.state;
    let parentClass = '.pay-success-container .bottom-div';
    let parentClass1 = '.pay-success-container .top-div';
    let childId;
    if (param === 'loyalty') {
      childId = 'accrual-modal';
    } else if (param === 'popup') {
      childId = 'receipt-modal';
    }
    // Accessibility for dialog
    const bottomContainer = document.querySelector(parentClass);
    const topContainer = document.querySelector('.TopContainer');
    const payTopcontainer = document.querySelector(parentClass1);
    const Children = bottomContainer.children;
    Array.from(Children).forEach(child => {
      if (child.id !== childId) {
        child.inert = false;
      }
    });
    previousActiveElement.focus();

    setTimeout(() => {
      payTopcontainer.inert = false;
      topContainer.inert = false;
    }, 500);

  }

  render () {
    const { loader, openLoyalty, showReceiptFlag, showReceiptType, modalLoader, sendingEmail, sendingSMS } = this.state;
    const { saleTime, deliveryConfirmationText, configFetching, isPointAccrued, cartLoyaltyInfo, loyaltyAccrue, loyaltyAccountFetching } = this.props;

    const siteFetching = get(this.props, 'sites.fetching');
    const profileName = get(this.props, 'profile.userName');
    const closedOrder = get(this.props, 'saleData');
    const orderConfig = this.props.orderConfig;
    const siteList = get(this.props, 'siteList', []);
    const currencyDetails = this.props.currencyDetails;
    const siteId = get(orderConfig, 'siteId');
    const displayProfileId = get(orderConfig, 'displayProfileId');
    const amount = get(closedOrder, 'taxIncludedTotalAmount.amount');
    const readyTime = get(this.props, 'readyTimeData');
    const scheduledTime = get(closedOrder, 'scheduledTime');
    const scheduledDay = get(closedOrder, 'scheduledDay');
    const tipAmount = get(closedOrder, 'tipAmount');
    const orderNumber = get(closedOrder, 'orderNumber');
    const deliveryProperties = get(closedOrder, 'deliveryProperties');
    const printReceipt = get(closedOrder, 'printReceipt');
    const totalWithTip = (parseFloat(tipAmount) + parseFloat(amount)).toFixed(2);
    const currentSite = siteList.find(site => site.id === siteId && site.displayProfileId === displayProfileId);
    const storeName = currentSite && currentSite.name;
    const loyaltyAccrueEnabled = currentSite && currentSite.loyaltyAccrueEnabled;
    const etfEnabled = currentSite && get(currentSite, 'etf.etfEnabled');
    const vatEnabled = get(closedOrder, 'taxBreakdown.isVatEnabled', false);
    const taxIdentificationNumber = currentSite && get(currentSite, 'taxIdentificationNumber', '');
    const vatEntries = vatEnabled && closedOrder.lineItems ? getVatEntriesFromOrderedItems(closedOrder, currentSite.taxRuleData) : [];
    const defaultLocale = 'en-US';
    const readyTimeData = this.getReadyTime(readyTime, scheduledTime, scheduledDay, deliveryProperties, storeName, saleTime, defaultLocale);
    const orderMessage = this.getOrderMessage(readyTime, scheduledTime, scheduledDay, deliveryProperties, storeName, saleTime, defaultLocale);
    const emailReceipt = get(this.props, 'orderConfig.emailReceipt');
    const emailReceiptEnabled = get(this.props, 'orderConfig.emailReceipt.featureEnabled', true);
    const textReceipt = get(this.props, 'orderConfig.textReceipt');
    const textReceiptEnabled = get(this.props, 'orderConfig.textReceipt.featureEnabled', true);
    const printReceiptEnabled = get(this.props, 'orderConfig.printReceipt.featureEnabled', true);
    const paymentsEnabled = get(orderConfig, 'pay.paymentsEnabled', false);
    const countryCode = get(this.props, 'orderConfig.sms.countryCode', true);
    const regionCode = get(this.props, 'orderConfig.sms.regionCode', true);
    const countryCodeList = get(this.props, 'orderConfig.sms.countryCodeList');
    const emailSuccess = get(this.props, 'emailReceiptSent');
    const smsSuccess = get(this.props, 'smsReceiptSent');
    const platformGuestProfile = get(this.props, 'platformGuestProfile');
    const countryInfo = get(closedOrder, 'selectedSMSCountry') || this.getCountryInfoFromProfile(countryCodeList, countryCode, regionCode, platformGuestProfile);
    const mobileNumber = get(closedOrder, 'properties.mobileNumber') || this.getMobileNumberFromProfile(countryInfo);

    return (
      <ThemeProvider className='pay-success' theme={theme}>
        {(!siteFetching && !configFetching)
          ? <React.Fragment>
            <Container className='pay-success-container' m={3} alignItems='center'>
              <BackgroundContainer />
              {loader && <LoadingContainer><Loader /></LoadingContainer>}
              {!isPointAccrued && (loyaltyAccountFetching || loyaltyAccrue) && <Announcements message={i18n.t('PROCESSING_ACCRUAL')} />}
              {!emailSuccess && sendingEmail && <Announcements message={i18n.t('PROCESSING_EMAIL')} />}
              {!smsSuccess && sendingSMS && <Announcements message={i18n.t('PROCESSING_SMS')} />}

              {isPointAccrued && <Announcements message={i18n.t('PAYMENT_SUCCESS_POINTS_ACCRUED')} />}
              {emailSuccess && <Announcements message={i18n.t('PAYMENT_SUCCESS_EMAIL_SENT')} />}
              {smsSuccess && <Announcements message={i18n.t('PAYMENT_SUCCESS_SMS_SENT')} />}
              <TopDiv className='top-div'>
                <CircleFlex className='circleFlex'>
                  <i className='fa fa-check-circle' style={checkStyle} />
                </CircleFlex>
                <Announcements ariaLive='assertive' message={paymentsEnabled ? i18n.t('PAYMENT_SUCCESS_TITLE')
                  : i18n.t('PAYMENT_SUCCESS_CHECKOUT_TITLE')} />
                <PaymentSuccessHeader className='payment-success-header'
                  aria-label={paymentsEnabled
                    ? i18n.t('PAYMENT_SUCCESS_TITLE') : i18n.t('PAYMENT_SUCCESS_CHECKOUT_TITLE')}
                  tabIndex={0}
                >
                  <Trans i18nKey={paymentsEnabled
                    ? 'PAYMENT_SUCCESS_TITLE'
                    : 'PAYMENT_SUCCESS_CHECKOUT_TITLE'} />
                </PaymentSuccessHeader>

                {amount !== undefined ? (

                  <React.Fragment>
                    <TextContainer tabIndex={0} aria-label={i18n.t('PAYMENT_SUCCESS_AMOUNT_PAID')}>
                      <Trans i18nKey='PAYMENT_SUCCESS_AMOUNT_PAID' />
                    </TextContainer>
                    <Total className='TotalBill' tabIndex={0} aria-label={`${currencyLocaleFormat(totalWithTip, currencyDetails)}`}>
                      {currencyLocaleFormat(totalWithTip, currencyDetails)}
                    </Total>
                  </React.Fragment>
                ) : (
                  null
                )}

                <React.Fragment>
                  <TextContainer tabIndex={0}
                    aria-label={`${i18n.t('PAYMENT_SUCCESS_YOUR_ORDER')} ${(orderNumber && orderNumber.length > 3) ? (orderNumber.substring(orderNumber.length - 3)) : orderNumber}`}>
                    <Trans i18nKey='PAYMENT_SUCCESS_YOUR_ORDER' />
                  </TextContainer>
                  <OrderNumber className='order-number order-label'>{
                    orderNumber && orderNumber.length > 3
                      ? (orderNumber.substring(orderNumber.length - 3))
                      : orderNumber
                  }
                  </OrderNumber>
                  {((deliveryProperties && deliveryProperties.nameString) || profileName) &&
                    <Total className='delivery-properties' tabIndex={0}
                      aria-label={(deliveryProperties && deliveryProperties.nameString) || profileName}>
                      {(deliveryProperties && deliveryProperties.nameString) || profileName}
                    </Total>
                  }
                </React.Fragment>

                {readyTimeData && <ReadyTimeBlock className='ready-time-block' tabIndex={0}
                  aria-label={`${readyTimeData.line1} ${(etfEnabled || scheduledTime) && readyTimeData.line2}`}>
                  <TextContainer className='ready-time-line1'> {readyTimeData.line1}</TextContainer>
                  {(etfEnabled || scheduledTime) && <Total className='ready-time-line2'>{readyTimeData.line2}</Total>}
                </ReadyTimeBlock>}

                {deliveryConfirmationText &&
                  <DeliveryConfirmationText tabIndex={0} aria-label={deliveryConfirmationText}>
                    {deliveryConfirmationText}
                  </DeliveryConfirmationText>
                }
              </TopDiv>

              <BottomFlex className='bottom-div'>

                <ReceiptText className='receipt-label' tabIndex={0} aria-label={i18n.t('PAYMENT_SUCCESS_OPTIONS')}>
                  <Trans i18nKey='PAYMENT_SUCCESS_OPTIONS' />
                </ReceiptText>

                {loyaltyAccrueEnabled &&
                  (openLoyalty && !loyaltyAccountFetching && !loyaltyAccrue && !isPointAccrued
                    ? <ConnectedLoyaltyProcess
                      closeModal={this.closeLoyaltyProcess}
                      accessible={this.makeEverythingAccessible}
                      openModal={this.openLoyaltyProcess} siteId={siteId}
                      displayProfileId={displayProfileId} />
                    : <LoyaltyContainer width={[1]}>
                      <SendButton
                        className='loyalty-button'
                        type='loyalty'
                        disabled={isPointAccrued}
                        processing={loyaltyAccountFetching || loyaltyAccrue}
                        onClick={this.openLoyaltyProcess}
                        aria-label={!isPointAccrued && (loyaltyAccountFetching || loyaltyAccrue) ? i18n.t('PROCESSING_ACCRUAL') : i18n.t('PAYMENT_SUCCESS_LOYALTY_BUTTON')}
                        role='button'
                        tabIndex={isPointAccrued ? -1 : 0}
                        children={this.buttonContent('agilysys-icon-LoyaltyAccrual', 'PAYMENT_SUCCESS_LOYALTY_BUTTON', false, (loyaltyAccountFetching || loyaltyAccrue))}
                      />
                    </LoyaltyContainer>)
                }

                {isPointAccrued && <SuccessDiv tabIndex={0} aria-label={i18n.t('PAYMENT_SUCCESS_POINTS_ACCRUED')}>

                  <i className='fa fa-check-circle' style={SentStyle} />
                  <Trans i18nKey='PAYMENT_SUCCESS_POINTS_ACCRUED' />
                </SuccessDiv>}

                {emailReceiptEnabled &&
                  <BoxContainer width={[1]} style={{ marginTop: '1em' }}>
                    <SendButton
                      className='No-button'
                      type='submit'
                      onClick={() => !sendingEmail && this.showReceiptPopup('email')}
                      role='button'
                      processing={sendingEmail}
                      disabled={emailSuccess}
                      aria-label={!emailSuccess && sendingEmail ? i18n.t('PROCESSING_EMAIL') : i18n.t('PAYMENT_SUCCESS_EMAIL_BTN')}
                      tabIndex={emailSuccess ? -1 : 0}
                      children={this.buttonContent('agilysys-icon-email-24px', 'PAYMENT_SUCCESS_EMAIL_BTN', emailReceipt && emailReceipt.headerText, sendingEmail)}
                    />
                  </BoxContainer>
                }

                {emailSuccess && <SuccessDiv tabIndex={0} aria-label={i18n.t('PAYMENT_SUCCESS_EMAIL_SENT')}>

                  <i className='fa fa-check-circle' style={SentStyle} />
                  <Trans i18nKey='PAYMENT_SUCCESS_EMAIL_SENT' />
                </SuccessDiv>}

                {textReceiptEnabled &&
                  <BoxContainer width={[1]} style={{ marginTop: '1em' }}>
                    <SendButton
                      className='No-button'
                      type='submit'
                      processing={sendingSMS}
                      disabled={smsSuccess}
                      role='button'
                      tabIndex={smsSuccess ? -1 : 0}
                      aria-label={!smsSuccess && sendingSMS ? i18n.t('PROCESSING_SMS') : i18n.t('PAYMENT_SUCCESS_TEXT_BTN')}
                      onClick={() => !sendingSMS && this.showReceiptPopup('mobile')}
                      children={this.buttonContent('agilysys-icon-textsms-24px', 'PAYMENT_SUCCESS_TEXT_BTN', textReceipt && textReceipt.headerText, sendingSMS)}
                    />
                  </BoxContainer>
                }

                {smsSuccess && <SuccessDiv tabIndex={0} aria-label={i18n.t('PAYMENT_SUCCESS_SMS_SENT')}>
                  <i className='fa fa-check-circle' style={SentStyle} />
                  <Trans i18nKey='PAYMENT_SUCCESS_SMS_SENT' />
                </SuccessDiv>}

                {printReceiptEnabled &&
                  <BoxContainer width={[1]} style={{ marginTop: '1em', textAlign: 'center' }}>
                    <SendButton
                      className='print-link'
                      type='loyalty'
                      onClick={this.getPrintData}
                      role='button'
                      tabIndex={0}
                      aria-label={i18n.t('PAYMENT_SUCCESS_PRINT_RECEIPT')}
                      children={this.buttonContent('agilysys-icon-print-24px', 'PAYMENT_SUCCESS_PRINT_RECEIPT')}
                    />
                  </BoxContainer>
                }

                {showReceiptFlag &&
                  <ReceiptPopup
                    closePopup={this.hideReceiptPopup}
                    type={showReceiptType}
                    accessible={this.makeEverythingAccessible}
                    sendEmail={this.sendEmailReceipt}
                    sendSMS={this.sendSMSReceipt}
                    mobileNumber={mobileNumber}
                    loyaltyNumber={cartLoyaltyInfo && cartLoyaltyInfo.selectedOption === 'phone' && cartLoyaltyInfo.formatNumber}
                    modalLoader={modalLoader}
                    emailReceipt={emailReceipt}
                    textReceipt={textReceipt}
                    regionCode={regionCode}
                    countryCode={countryCode}
                    selectedCountry={countryInfo}
                    countryCodeList={countryCodeList}
                    platformGuestProfile={platformGuestProfile}
                  />
                }

              </BottomFlex>

            </Container>

            {printReceipt && <PrintViewParent>
              <PrintView my={3} className='print-view'>
                {printReceipt.orderData.printedReceiptLogo &&
                  <StoreContainer mt={'2em'}>
                    <Image alt='' src={printReceipt.orderData.printedReceiptLogo} />
                  </StoreContainer>
                }
                {printReceipt.orderData.storeInfo && printReceipt.orderData.storeInfo.storeName &&
                  <Flex justifyContent={'center'}>
                    <StoreContainer mt={'1em'}>
                      {printReceipt.orderData.storeInfo.storeName}
                    </StoreContainer>
                  </Flex>
                }
                {printReceipt.orderData.storeInfo &&
                  <Flex
                    justifyContent={'center'}
                  >
                    <StoreAddress>
                      {printReceipt.orderData.storeInfo.address1 &&
                        <div>
                          {printReceipt.orderData.storeInfo.address1}
                        </div>
                      }
                      {printReceipt.orderData.storeInfo.address2 &&
                        <div>
                          {printReceipt.orderData.storeInfo.address2}
                        </div>
                      }
                      {(printReceipt.orderData.storeInfo.city || printReceipt.orderData.storeInfo.state || printReceipt.orderData.storeInfo.zipCode) &&
                        <div>
                          {printReceipt.orderData.storeInfo.city} {printReceipt.orderData.storeInfo.state} {printReceipt.orderData.storeInfo.zipCode}
                        </div>
                      }
                      {printReceipt.orderData.storeInfo.phoneNumber &&
                        <div>
                          {printReceipt.orderData.storeInfo.phoneNumber}
                        </div>
                      }
                    </StoreAddress>
                  </Flex>
                }
                {printReceipt.orderData.checkNumber &&
                  <StoreContainer m={0}>
                    <Trans i18nKey='PAYMENT_SUCCESS_ORDER' />&nbsp;
                    {printReceipt.orderData.checkNumber.length > 3
                      ? (printReceipt.orderData.checkNumber.substring(printReceipt.orderData.checkNumber.length - 3))
                      : printReceipt.orderData.checkNumber}
                  </StoreContainer>
                }

                {deliveryProperties && (
                  <React.Fragment>
                    {deliveryProperties.nameString && <StoreContainer m={0} >
                      {deliveryProperties.nameString}
                    </StoreContainer>
                    }
                    <StoreContainer m={0} >
                      {deliveryProperties.deliveryOption.id === 'delivery' ? deliveryProperties.deliveryLocation : deliveryProperties.deliveryOption.displayText}
                    </StoreContainer>
                  </React.Fragment>
                )
                }
                {printReceipt.orderData && printReceipt.orderData.mobileNumber &&
                  <StoreContainer m={0} >
                    {printReceipt.orderData.mobileNumber}
                  </StoreContainer>
                }
                {printReceipt.orderData.lineItems && printReceipt.orderData.lineItems.map((item, index) => (
                  <React.Fragment key={`item` + index}>
                    <div>
                      <ItemFlex style={{ position: 'relative', alignItems: 'flex-start' }} width={1} flexDirection='row'>
                        <ItemPrice mr={'1em'}>
                          {item.quantity}
                        </ItemPrice>
                        <ItemLabel mr={'auto'}>{item.displayText}</ItemLabel>
                        <ItemPrice ml={'auto'}>
                          {currencyLocaleFormat(parseFloat(item.price), currencyDetails)}
                        </ItemPrice>

                      </ItemFlex>
                    </div>
                    {item.splInstruction &&
                      <ModifierFlex justifyContent='space-between' width={1} my={15}>
                        <InstructionText>{item.splInstruction}</InstructionText>
                      </ModifierFlex>
                    }
                    {
                      item.lineItemGroups && (
                        <React.Fragment>

                          {
                            item.lineItemGroups.sort((a, b) => b.amount - a.amount).map((option, index) => (
                              <React.Fragment key={`option` + index}>
                                <ModifierFlex justifyContent='space-between'
                                  width={1} my={15}>
                                  <Description>{option.description}</Description>
                                  {parseFloat(option.baseAmount) > 0 ? option.baseAmount && <Price>{currencyLocaleFormat(option.baseAmount, currencyDetails)}</Price> : <Price />}
                                </ModifierFlex>
                                {option.suboption && option.suboption.map((subOption, subIndex) => (
                                  <React.Fragment key={`suboption` + subIndex}>
                                    <ModifierFlex justifyContent='space-between'
                                      width={1} my={15}>
                                      <Description>{subOption.description}</Description>
                                      {parseFloat(subOption.amount) > 0 ? subOption.amount && <Price>{currencyLocaleFormat(subOption.amount, currencyDetails)}</Price> : <Price />}
                                    </ModifierFlex>
                                  </React.Fragment>
                                ))
                                }
                              </React.Fragment>
                            ))
                          }
                        </React.Fragment>
                      )
                    }
                  </React.Fragment>
                ))}
                {!vatEnabled && printReceipt.orderData && printReceipt.orderData.subtotalAmount &&
                  <BorderFlex style={{ position: 'relative' }} width={1} py={3} flexDirection='row'>
                    <TaxTotalLabel className='tax-total-label' mr={'auto'}><Trans i18nKey='PAYMENT_SUCCESS_PRINT_RECEIPT_SUB_TOTAL' /></TaxTotalLabel>
                    <ItemPrice ml={'auto'}>
                      {currencyLocaleFormat(parseFloat(printReceipt.orderData.subtotalAmount), currencyDetails)}
                    </ItemPrice>
                  </BorderFlex>
                }

                {printReceipt.orderData && printReceipt.orderData.gratuity && printReceipt.orderData.gratuity > 0 &&
                  <BorderFlex style={{ position: 'relative' }} width={1} py={3} flexDirection='row'>
                    <TaxTotalLabel mr={'auto'}><Trans i18nKey='PAYMENT_SUCCESS_PRINT_RECEIPT_GRATUITY' /></TaxTotalLabel>
                    <ItemPrice ml={'auto'}>
                      {currencyLocaleFormat(parseFloat(printReceipt.orderData.gratuity), currencyDetails)}
                    </ItemPrice>
                  </BorderFlex>
                }

                {printReceipt.orderData && printReceipt.orderData.serviceAmount && printReceipt.orderData.serviceAmount > 0 &&
                  <BorderFlex style={{ position: 'relative' }} width={1} py={3} flexDirection='row'>
                    <TaxTotalLabel mr={'auto'}><Trans i18nKey='PAYMENT_SUCCESS_PRINT_RECEIPT_SERVICE_CHARGE' /></TaxTotalLabel>
                    <ItemPrice ml={'auto'}>
                      {currencyLocaleFormat(parseFloat(printReceipt.orderData.serviceAmount), currencyDetails)}
                    </ItemPrice>
                  </BorderFlex>
                }

                {!vatEnabled && printReceipt.orderData && printReceipt.orderData.taxAmount &&
                  <BorderFlex style={{ position: 'relative' }} width={1} py={3} flexDirection='row'>
                    <TaxTotalLabel mr={'auto'}><Trans i18nKey='PAYMENT_SUCCESS_PRINT_RECEIPT_TAX' /></TaxTotalLabel>
                    <ItemPrice ml={'auto'}>
                      {currencyLocaleFormat(parseFloat(printReceipt.orderData.taxAmount), currencyDetails)}
                    </ItemPrice>
                  </BorderFlex>
                }

                {printReceipt.orderData && printReceipt.orderData.tip &&
                  <BorderFlex style={{ position: 'relative' }} width={1} py={3} flexDirection='row'>
                    <TaxTotalLabel mr={'auto'}><Trans i18nKey='PAYMENT_SUCCESS_PRINT_RECEIPT_TIP' /></TaxTotalLabel>
                    <ItemPrice ml={'auto'}>
                      {currencyLocaleFormat(parseFloat(printReceipt.orderData.tip), currencyDetails)}
                    </ItemPrice>
                  </BorderFlex>
                }

                {printReceipt.orderData && printReceipt.orderData.totalAmount &&
                  <BorderFlex style={{ position: 'relative', marginTop: '20px' }} width={1} py={3} flexDirection='row'>
                    <TotalLabel mr={'auto'}><Trans i18nKey='PAYMENT_SUCCESS_PRINT_RECEIPT_TOTAL' /></TotalLabel>
                    <ItemTotal ml={'auto'}>
                      {currencyLocaleFormat(parseFloat(printReceipt.orderData.totalAmount), currencyDetails)}
                    </ItemTotal>
                  </BorderFlex>
                }
                {vatEntries.length > 0 && <VatContainer style={{ position: 'relative' }}>
                  {vatEntries.map((data, index) =>
                    <BorderFlex key={index} style={{ position: 'relative', marginBottom: '5px' }} width={1} py={3} flexDirection='row'>
                      <TaxTotalLabel mr={'auto'}>{data.label}</TaxTotalLabel>
                      <ItemPrice ml={'auto'}>
                        {currencyLocaleFormat(data.amount, currencyDetails)}
                      </ItemPrice>
                    </BorderFlex>)}
                  {taxIdentificationNumber && <BorderFlex style={{ position: 'relative' }} width={1} py={3} flexDirection='row'>
                    <TaxTotalLabel mr={'auto'}><Trans i18nKey='TAX_VAT_NUMBER_LABEL' /></TaxTotalLabel>
                    <ItemPrice ml={'auto'}>
                      {taxIdentificationNumber}
                    </ItemPrice>
                  </BorderFlex>}
                </VatContainer>}
                {scheduledTime &&
                  <BorderFlex style={{ position: 'relative', lineHeight: 1 }} width={1} py={3} flexDirection='row'>
                    <TaxTotalLabel mr={'auto'}><Trans i18nKey='PAYMENT_SUCCESS_PRINT_RECEIPT_SCHEDULED_TIME' /></TaxTotalLabel>
                    <ItemPrice ml={'auto'}>
                      {`${scheduledDay || i18n.t('PAYMENT_SUCCESS_PRINT_RECEIPT_TODAY')} ${scheduledTime.startTime} - ${scheduledTime.endTime}`}
                    </ItemPrice>
                  </BorderFlex>
                }

                {printReceipt.orderData && printReceipt.orderData.printDateTime &&
                  <BorderFlex style={{ position: 'relative' }} width={1} py={3} flexDirection='row'>
                    <TaxTotalLabel mr={'auto'}><Trans i18nKey='PAYMENT_SUCCESS_PRINT_RECEIPT_DATE' /></TaxTotalLabel>
                    <ItemPrice className='date' ml={'auto'} style={{ whiteSpace: 'nowrap' }}>
                      {printReceipt.orderData.printDateTime}
                    </ItemPrice>
                  </BorderFlex>
                }

                {printReceipt.orderData && printReceipt.orderData.terminalNumber &&
                  <BorderFlex style={{ position: 'relative' }} width={1} py={3} flexDirection='row'>
                    <TaxTotalLabel mr={'auto'}><Trans i18nKey='PAYMENT_SUCCESS_PRINT_RECEIPT_TERMINAL' /></TaxTotalLabel>
                    <ItemPrice ml={'auto'}>
                      {printReceipt.orderData.terminalNumber}
                    </ItemPrice>
                  </BorderFlex>
                }

                {printReceipt.orderData && printReceipt.orderData.checkNumber &&
                  <BorderFlex style={{ position: 'relative' }} width={1} py={3} flexDirection='row'>
                    <TaxTotalLabel mr={'auto'}><Trans i18nKey='PAYMENT_SUCCESS_PRINT_RECEIPT_CHECK' /></TaxTotalLabel>
                    <ItemPrice ml={'auto'}>
                      {printReceipt.orderData.checkNumber}
                    </ItemPrice>
                  </BorderFlex>
                }

                {
                  printReceipt.orderData.paymentInfo && printReceipt.orderData.paymentInfo.map((paymentData, index) => (
                    <React.Fragment key={`account-${index}`}>

                      <br />

                      {paymentData.tenderName &&
                        <BorderFlex style={{ position: 'relative' }} width={1} py={3} flexDirection='row'>
                          <TenderLabel mr={'auto'}>{paymentData.tenderName}</TenderLabel>
                          {paymentData.account && <ItemPrice ml={'auto'}>
                            {this.maskAccountNumber(paymentData.account)}
                          </ItemPrice>}
                          {paymentData.roomInfo && <ItemPrice ml={'auto'}>
                            {paymentData.roomInfo}
                          </ItemPrice>}
                          {paymentData.accountNumber && <ItemPrice ml={'auto'}>
                            {paymentData.accountNumber}
                          </ItemPrice>}
                        </BorderFlex>
                      }

                      {paymentData.memberInfo &&
                        <BorderFlex style={{ position: 'relative' }} width={1} py={3} flexDirection='row'>
                          <TenderLabel mr={'auto'}><Trans i18nKey='MEMBER_CHARGE_LABEL' /></TenderLabel>
                          <ItemPrice ml={'auto'}>
                            {paymentData.memberInfo}
                          </ItemPrice>
                        </BorderFlex>
                      }

                      {paymentData.showAuthorizationInfoOnReceipt && paymentData.authorizedAmount &&
                        <BorderFlex style={{ position: 'relative' }} width={1} py={3} flexDirection='row'>
                          <TaxTotalLabel mr={'auto'}><Trans i18nKey='PAYMENT_SUCCESS_PRINT_RECEIPT_AUTH_AMOUNT' /></TaxTotalLabel>
                          <ItemPrice ml={'auto'}>
                            {currencyLocaleFormat(paymentData.authorizedAmount, currencyDetails)}
                          </ItemPrice>
                        </BorderFlex>
                      }

                      {paymentData.authCode &&
                        <BorderFlex style={{ position: 'relative' }} width={1} py={3} flexDirection='row'>
                          <TaxTotalLabel mr={'auto'}><Trans i18nKey='PAYMENT_SUCCESS_PRINT_RECEIPT_AUTH_CODE' /></TaxTotalLabel>
                          <ItemPrice ml={'auto'}>
                            {paymentData.authCode}
                          </ItemPrice>
                        </BorderFlex>
                      }

                      {paymentData.gaTenderName &&
                        <BorderFlex style={{ position: 'relative' }} width={1} py={3} flexDirection='row'>
                          <TaxTotalLabel mr={'auto'}>{paymentData.gaTenderName}</TaxTotalLabel>
                        </BorderFlex>
                      }

                      {paymentData.accountNumberLabelText &&
                        <BorderFlex style={{ position: 'relative' }} width={1} py={3} flexDirection='row'>
                          <TaxTotalLabel mr={'auto'}>{paymentData.accountNumberLabelText}</TaxTotalLabel>
                          <ItemPrice ml={'auto'}>
                            <Trans i18nKey='PAYMENT_SUCCESS_PRINT_RECEIPT_ENDING' /> {paymentData.accountNumberLast4}
                          </ItemPrice>
                        </BorderFlex>
                      }

                      {paymentData.amount &&
                        <BorderFlex style={{ position: 'relative' }} width={1} py={3} flexDirection='row'>
                          <TaxTotalLabel mr={'auto'}>{paymentData.buyPaymentForm !== 'GENERIC_AUTHORIZATION' && paymentData.buyPaymentForm !== 'ROOM_CHARGE' &&
                            paymentData.buyPaymentForm !== 'MEMBER_CHARGE' ? <Trans i18nKey='PAYMENT_SUCCESS_PRINT_RECEIPT_AUTH_AMOUNT' />
                            : paymentData.buyPaymentForm === 'LOYALTY'
                              ? <Trans i18nKey='PAYMENT_SUCCESS_PRINT_RECEIPT_AMOUNT_USED' />
                              : <Trans i18nKey='PAYMENT_SUCCESS_PRINT_RECEIPT_AMOUNT_CHARGED' />}
                          </TaxTotalLabel>
                          <ItemPrice ml={'auto'}>
                            {currencyLocaleFormat(parseFloat(paymentData.amount), currencyDetails)}
                          </ItemPrice>
                        </BorderFlex>
                      }

                      {paymentData.gaTenderBalance &&
                        <BorderFlex style={{ position: 'relative' }} width={1} py={3} flexDirection='row'>
                          <TaxTotalLabel mr={'auto'}><Trans i18nKey='PAYMENT_SUCCESS_PRINT_RECEIPT_BALANCE_AMOUNT' /></TaxTotalLabel>
                          <ItemPrice ml={'auto'}>
                            {currencyLocaleFormat(parseFloat(paymentData.gaTenderBalance), currencyDetails)}
                          </ItemPrice>
                        </BorderFlex>
                      }

                      {paymentData.loyaltyVoucherList && paymentData.loyaltyVoucherList.length > 0 &&
                        paymentData.loyaltyVoucherList.map((data, index) =>
                          <BorderFlex style={{ position: 'relative' }} width={1} py={3} flexDirection='row'>
                            <TaxTotalLabel mr={'auto'}>{data.label}</TaxTotalLabel>
                            <ItemPrice ml={'auto'}>
                              {currencyLocaleFormat(parseFloat(data.amount), currencyDetails)}
                            </ItemPrice>
                          </BorderFlex>
                        )}

                      {paymentData.pointsUsed &&
                        <BorderFlex style={{ position: 'relative' }} width={1} py={3} flexDirection='row'>
                          <TaxTotalLabel mr={'auto'}><Trans i18nKey='PAYMENT_SUCCESS_PRINT_RECEIPT_POINTS_USED' /></TaxTotalLabel>
                          <ItemPrice ml={'auto'}>
                            {currencyLocaleFormat(parseFloat(paymentData.pointsUsed), currencyDetails)}
                          </ItemPrice>
                        </BorderFlex>
                      }

                      {paymentData.currentBalance && paymentData.buyPaymentForm !== 'ATRIUM' &&
                        <BorderFlex style={{ position: 'relative' }} width={1} py={3} flexDirection='row'>
                          <TaxTotalLabel mr={'auto'}><Trans i18nKey='PAYMENT_SUCCESS_PRINT_RECEIPT_CURRENT_BALANCE' /></TaxTotalLabel>
                          <ItemPrice ml={'auto'}>
                            {currencyLocaleFormat(parseFloat(paymentData.currentBalance), currencyDetails)}
                          </ItemPrice>
                        </BorderFlex>
                      }

                      {paymentData.atriumLabel &&
                        <BorderFlex style={{ position: 'relative' }} width={1} py={3} flexDirection='row'>
                          <TaxTotalLabel mr={'auto'}>{paymentData.atriumLabel}</TaxTotalLabel>
                          {paymentData.accountNumber && <ItemPrice ml={'auto'}>
                            {paymentData.accountNumber}
                          </ItemPrice>}
                        </BorderFlex>
                      }

                      {paymentData.valueCharged &&
                        <BorderFlex style={{ position: 'relative' }} width={1} py={3} flexDirection='row'>
                          <TaxTotalLabel mr={'auto'}><Trans i18nKey='PAYMENT_SUCCESS_PRINT_RECEIPT_VALUE_CHARGED' /></TaxTotalLabel>
                          <ItemPrice ml={'auto'}>
                            {paymentData.valueCharged}
                          </ItemPrice>
                        </BorderFlex>
                      }

                      {paymentData.valueCurrentBalance &&
                        <BorderFlex style={{ position: 'relative' }} width={1} py={3} flexDirection='row'>
                          <TaxTotalLabel mr={'auto'}><Trans i18nKey='PAYMENT_SUCCESS_PRINT_RECEIPT_VALUE_CURRENT_BALANCE' /></TaxTotalLabel>
                          <ItemPrice ml={'auto'}>
                            {paymentData.valueCurrentBalance}
                          </ItemPrice>
                        </BorderFlex>
                      }

                      {paymentData.amountCharged &&
                        <BorderFlex style={{ position: 'relative' }} width={1} py={3} flexDirection='row'>
                          <TaxTotalLabel mr={'auto'}><Trans i18nKey='PAYMENT_SUCCESS_PRINT_RECEIPT_AMOUNT_CHARGED' /></TaxTotalLabel>
                          <ItemPrice ml={'auto'}>
                            {currencyLocaleFormat(parseFloat(paymentData.amountCharged), currencyDetails)}
                          </ItemPrice>
                        </BorderFlex>
                      }

                      {paymentData.currentBalance && paymentData.buyPaymentForm === 'ATRIUM' &&
                        <BorderFlex style={{ position: 'relative' }} width={1} py={3} flexDirection='row'>
                          <TaxTotalLabel mr={'auto'}><Trans i18nKey='PAYMENT_SUCCESS_PRINT_RECEIPT_CURRENT_BALANCE' /></TaxTotalLabel>
                          <ItemPrice ml={'auto'}>
                            {currencyLocaleFormat(parseFloat(paymentData.currentBalance), currencyDetails)}
                          </ItemPrice>
                        </BorderFlex>
                      }

                    </React.Fragment>
                  ))}

                {printReceipt.orderData.storeInfo && printReceipt.orderData.storeInfo.receiptFooterText &&
                  <StoreContainer m={0}>
                    {printReceipt.orderData.storeInfo.receiptFooterText}
                  </StoreContainer>
                }
                {orderMessage &&
                  <StoreContainer m={0}>{orderMessage}</StoreContainer>
                }

              </PrintView>
            </PrintViewParent>}
          </React.Fragment>
          : <LoadingContainer><Loader /></LoadingContainer>}
      </ThemeProvider>
    );
  }
}

export default PaymentSuccess;
