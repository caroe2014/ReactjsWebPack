// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.
/* eslint-disable max-len */
import React, { Component } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import theme from 'web/client/theme';
import PropTypes from 'prop-types';
import { Flex, Text, Image } from 'rebass';
import PaymentCard from 'web/client/app/components/PaymentCard';
import { Trans } from 'react-i18next';
import config from 'app.config';
import get from 'lodash.get';
import UrlImageLoader from 'web/client/app/components/UrlImageLoader';
import Announcements from 'web/client/app/components/Announcements';
import {
  ConnectedGAPayment,
  ConnectedRoomCharge,
  ConnectedMemberCharge,
  ConnectedLoyaltyVoucherModal,
  ConnectedLoyaltyPointsModal,
  ConnectedLoyaltyHostCompVoucherModal,
  ConnectedAtriumModal
} from 'web/client/app/reduxpages/ConnectedComponents';
import { currencyLocaleFormat } from 'web/client/app/utils/NumberUtils';
import i18n from 'web/client/i18n';

import { loyaltyTenderMappings } from 'web/client/app/utils/constants';
import LoyaltyPaymentModal from 'web/client/app/components/LoyaltyModals/LoyaltyPaymentModal';

const Container = styled(Flex)`
  background-color: white;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%
  ${props => props.theme.mediaBreakpoints.desktop`
    width: 638px; 
    height: 100%;
`};
  ${props => props.theme.mediaBreakpoints.mobile`
    justify-content: center;
    align-items: center;
    width: 100%
  `};

  ${props => props.theme.mediaBreakpoints.tablet`
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
`};
  
  &:after{
    content: '';
    margin: auto;
    width: 280px;
  }
  .detail-container-atrium {
    overflow: hidden;
    white-space: nowrap;
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

const PayOptionParent = styled(Flex)`
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-start;
  align-self: center;
  background: white;
  padding-bottom: 20px;
  &:focus {
    outline: none;
    box-shadow: none;
  }
  ${props => props.theme.mediaBreakpoints.tablet`width: 300px;`};
  ${props => props.theme.mediaBreakpoints.desktop`width: 100%;`};
  ${props => {
    if (!props.singleoption) {
      return `
      &:after{
        content: ' ';
        margin: 1em;
        width: 280px;
        height: 50px;
      }`
      ;
    }
  }};

  & > :last-child{
    margin-bottom: 60px;
  }
`;

const MethodText = styled(Text)`
  font-size: 18px;
  font-weight: 700;
  color: ${props => props.theme.colors.primaryTextColor};
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const MethodTextLabel = styled(Text)`
  font-size: 16px;
  font-weight: 400;
  color: ${props => props.theme.colors.secondaryTextColor};
  margin: 10px 0px;
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const MethodFlex = styled(Flex)`
  align-items: center;
  justify-content: center;
  flex-direction: column;
  text-align: center;
  padding: 0px 30px;
  ${props => props.theme.mediaBreakpoints.desktop`margin-top: 20px; margin-bottom: 20px;`};
  ${props => props.theme.mediaBreakpoints.tablet`
    margin-top: 20px;
    margin-bottom: 20px;
    margin-left: 0px;
    margin-right: 30px;
    justify-content: center;
  `};
  ${props => props.theme.mediaBreakpoints.mobile`
    align-items: center;
    padding-top: 8px;
    padding-bottom: 8px;
    width: 100%;
    margin-bottom: 20px;
    margin-top: 0px; margin-left: 0px; margin-right: 0px; justify-content: center;
  `};
`;
const PayRequestContainer = styled(Flex)`
  flex-direction: row;
  width: 100%;
  min-height: 50px;
  max-height: 100px;
  margin: .5em 1em .5em 1em;
  max-width: 280px;
  align-items: center;
  justify-content: center;
  padding: 4px 0px 4px;
  border: 2px solid ${props => props.theme.colors.buttonControlColor};
  border-radius: 6px;
  color: ${props => props.theme.colors.buttonControlColor};
  ${props => props.theme.mediaBreakpoints.mobile`
    margin: 0em auto 3em auto;
  `}
  ${props => props.theme.mediaBreakpoints.tablet`
    margin: 0em auto 3em auto;
  `}
  opacity: ${props => {
    if (props.validpayment) return '1';
    return '0.4';
  }};
  &:hover {
    cursor: ${props => props.validpayment ? 'pointer' : 'initial'};
    color: ${props => props.theme.colors.buttonControlColor};
    ${props => {
    if (props.validpayment) {
      return `box-shadow: 2px 3px 10px 0px rgba(0, 0, 0, .30);
          -webkit-box-shadow: 2px 3px 10px 0px rgba(0, 0, 0, .30);
          -moz-box-shadow: 2px 3px 10px 0px rgba(0, 0, 0, .30);`;
    }
  }};
  };
`;

const BoxContainer = styled(Flex)`
  justify-content: center;
  align-items: center;
  height: 40px;
  width: 40px;
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

const TextContainer = styled(Text)`
  font-size: 14px;
  font-weight: bold;
  text-align: center;
  flex: 0.7;
  text-align: left;
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const ImageContainer = styled(Flex)`
  flex: 0.3;
  width: 40px;
  height: 40px;
  justify-content: center;
  align-items: center;
`;

const cardLogoStyle = {
  width: '40px',
  height: '100%',
  backgroundSize: 'contain',
  backgroundRepeat: 'no-repeat',
  maxHeight: '40px'
};

const PayListTopContainer = styled(Flex)`
  flex-direction: column;
  justify-content: flex-start;
  padding: 20px 0px;
  margin-bottom: 20px;
  ${props => props.theme.mediaBreakpoints.desktop`
    height: 100%;
  `};
  ${props => props.theme.mediaBreakpoints.tablet`
    height: 100%;
  `};
  ${props => props.theme.mediaBreakpoints.mobile`
    align-items: center;
  `};
`;

const ImageCont = styled(Image)`
`;

const ErrorBubbleText = styled(Text)`
  background: #D5D5D5 0% 0% no-repeat padding-box;
  color: black;
  font-size: 14px;
  border-radius: 12px;
  width: 280px;
  min-height: 45px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 10px;
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const footerStyle = {
  display: 'flex',
  position: 'fixed',
  bottom: 0,
  width: 'inherit',
  justifyContent: 'center',
  borderTop: '2px solid lightgrey',
  background: 'white'
};

const footerSpaced = {
  display: 'flex',
  position: 'fixed',
  bottom: 0,
  width: 'inherit',
  justifyContent: 'space-between',
  borderTop: '2px solid lightgrey',
  borderRight: '1px solid lightgrey',
  background: 'white'
};

class PaymentOptions extends Component {
  constructor (props) {
    super(props);
    this.state = {
      selectedOptionId: this.props.selectedOptionId,
      showGaPaymentModal: false,
      showGaAccountInfoModal: false,
      showRoomChargeModal: false,
      showMemberChargeModal: false,
      showLoyaltyPointsModal: false,
      showLoyaltyVouchersModal: false,
      showLoyaltyHostCompVoucherModal: false,
      showLoyaltyPaymentModal: false,
      showAtriumModal: false,
      loyaltyVoucherInfo: {},
      selectedGaAccount: {},
      previousActiveElement: ''
    };

    this.closeGaPaymentModal = this.closeGaPaymentModal.bind(this);
    this.closeRoomChargeModal = this.closeRoomChargeModal.bind(this);
    this.closeMemberChargeModal = this.closeMemberChargeModal.bind(this);
    this.closeGaAccountInfoModal = this.closeGaAccountInfoModal.bind(this);
    this.closeLoyaltyVoucherModal = this.closeLoyaltyVoucherModal.bind(this);
    this.closeLoyaltyPointsModal = this.closeLoyaltyPointsModal.bind(this);
    this.closeLoyaltyHostCompVoucherModal = this.closeLoyaltyHostCompVoucherModal.bind(this);
    this.closeLoyaltyProcessModal = this.closeLoyaltyProcessModal.bind(this);
    this.closeLoyaltyPaymentModal = this.closeLoyaltyPaymentModal.bind(this);
    this.returnLoyaltyPaymentOptions = this.returnLoyaltyPaymentOptions.bind(this);
    this.isPaymentOptionEnabled = this.isPaymentOptionEnabled.bind(this);
    this.makeDialogAloneAccessible = this.makeDialogAloneAccessible.bind(this);
    this.makeEverythingAccessible = this.makeEverythingAccessible.bind(this);
    this.setAriaLabel = this.setAriaLabel.bind(this);
    this.closeAtriumModal = this.closeAtriumModal.bind(this);
    this.validateVoucherExists = this.validateVoucherExists.bind(this);
    this.checkTaxableTender = this.checkTaxableTender.bind(this);
  }

  componentWillMount () {
    this.props.clearRoomChargeError();
    this.props.clearMemberChargeError();
  }

  componentDidUpdate (prevProps, prevState) {
    if ((this.props.multiPaymentEnabled && prevProps.accountPopupFlag !== this.props.accountPopupFlag) ||
      (prevProps.gaSplitAuthResponse !== this.props.gaSplitAuthResponse && this.props.gaSplitAuthResponse) ||
      (prevProps.removeGAPaymentResponse !== this.props.removeGAPaymentResponse && this.props.removeGAPaymentResponse)) { // eslint-disable-line max-len
      this.closeGaPaymentModal();
    }
    if (prevProps.accountInfoPopupFlag !== this.props.accountInfoPopupFlag) {
      this.closeGaAccountInfoModal();
    }

    if ((prevProps.remaining !== this.props.remaining) && this.props.remaining &&
      !isNaN(this.props.remaining) && !(this.props.remaining > 0)) {
      this.props.processMultiPayment();
    }

    // TODO: do we need this, could we leverage something with remaining / errorS
    if ((prevProps.loyaltyPaymentResponse !== this.props.loyaltyPaymentResponse && this.props.loyaltyPaymentResponse) ||
      (prevProps.removeLoyaltyPaymentResponse !== this.props.removeLoyaltyPaymentResponse && (this.props.removeLoyaltyPaymentResponse && !this.props.processingMultipleActions))) {
      this.closeLoyaltyPointsModal();
      this.closeLoyaltyVoucherModal();
      this.closeLoyaltyHostCompVoucherModal();
    }

    if (!prevProps.fetching && this.props.fetching) {
      this.closeLoyaltyPaymentModal();
    }
  }

  makeDialogAloneAccessible (param) {
    let parentClass = '.BottomContainer .pay-list-top-container';
    let childId;
    if (param === 'roomCharge') {
      childId = 'roomcharge-modal';
    } else if (param === 'memberCharge') {
      childId = 'member-charge-modal';
    } else if (param === 'genericAuthorization' || param === 'gaAccount') {
      const previousActiveElement = document.activeElement;
      this.setState({
        previousActiveElement
      });
      childId = 'ga-modal';
    } else if (param === 'loyalty') {
      childId = 'loyalty-modal';
    } else if (param === 'loyaltyHostCompVoucher') {
      childId = 'loyalty-host-comp-modal';
    } else if (param === 'loyaltyVoucher') {
      childId = 'loyalty-voucher-modal';
    } else if (param === 'loyaltyPoints') {
      childId = 'loyalty-points-modal';
    } else if (param === 'atrium') {
      childId = 'atrium-meal-credit-modal';
    } else if (param === 'capacityCheck') {
      childId = 'throttle-modal';
    } else if (param === 'savedCard') {
      const bottomContainer = document.querySelector('.BottomContainer');
      bottomContainer.inert = true;
      const topContainer = document.querySelector('.TopContainer');
      const topContainerChildren = topContainer.children;
      Array.from(topContainerChildren).forEach(child => {
        if (child.id !== 'saved-card-modal') {
          child.inert = true;
        }
      });
    } else if (param === 'iframe') {
      childId = 'iframe-modal';
      parentClass = '.BottomContainer .payments-container-parent';
    }
    if (param !== 'savedCard') {
      // Accessibility for dialog
      const parent = document.querySelector(parentClass);
      const topContainer = document.querySelector('.TopContainer');
      topContainer.inert = true;
      const footer = document.querySelector('.BottomContainer .footer');
      footer.inert = true;
      const Children = parent.children;
      Array.from(Children).forEach(child => {
        if (child.id !== childId) {
          child.inert = true;
        }
      });
    }
  }

  makeEverythingAccessible (param) {

    let parentClass = '.BottomContainer .pay-list-top-container';
    let childId;
    if (param === 'roomCharge') {
      childId = 'roomcharge-modal';
    } else if (param === 'memberCharge') {
      childId = 'member-charge-modal';
    } else if (param === 'genericAuthorization' || param === 'gaAccount') {
      childId = 'ga-modal';
    } else if (param === 'loyalty') {
      childId = 'loyalty-modal';
    } else if (param === 'loyaltyHostCompVoucher') {
      childId = 'loyalty-host-comp-modal';
    } else if (param === 'loyaltyVoucher') {
      childId = 'loyalty-voucher-modal';
    } else if (param === 'loyaltyPoints') {
      childId = 'loyalty-points-modal';
    } else if (param === 'atrium') {
      childId = 'atrium-meal-credit-modal';
    }
    // Accessibility for dialog
    const parent = document.querySelector(parentClass);
    const topContainer = document.querySelector('.TopContainer');
    const footer = document.querySelector('.BottomContainer .footer');
    const Children = parent.children;
    Array.from(Children).forEach(child => {
      if (child.id !== childId) {
        child.inert = false;
      }
    });
    if (param === 'genericAuthorization' || param === 'gaAccount') {
      const { previousActiveElement } = this.state;
      previousActiveElement && previousActiveElement.focus();
    }
    setTimeout(() => {
      topContainer.inert = false;
      footer.inert = false;
    }, 500);
  }

  handleOption = (selectedOption, paymentObj) => {
    if (selectedOption === 'genericAuthorization') {
      this.setState({
        showGaPaymentModal: true
      });
      this.makeDialogAloneAccessible(selectedOption);
    } else if (selectedOption === 'savedCard') {
      this.makeDialogAloneAccessible(selectedOption);
      this.props.showSavedCards();
    } else if (selectedOption === 'gaAccount') {
      this.props.selectedAccount(paymentObj);
      this.setState({
        showGaAccountInfoModal: true,
        selectedGaAccount: paymentObj
      });
      this.makeDialogAloneAccessible(selectedOption);
    } else if (selectedOption === 'roomCharge') {
      this.setState({
        showRoomChargeModal: true,
        roomCharge: paymentObj
      });
      this.makeDialogAloneAccessible(selectedOption);
    } else if (selectedOption === 'memberCharge') {
      this.setState({
        showMemberChargeModal: true,
        memberCharge: paymentObj
      });
      this.makeDialogAloneAccessible(selectedOption);
    } else if (selectedOption === 'loyaltyVoucher') {
      this.setState({
        showLoyaltyVouchersModal: true,
        loyaltyVoucherInfo: paymentObj,
        selectedLoyaltyVoucherAccount: paymentObj
      });
      this.makeDialogAloneAccessible(selectedOption);
    } else if (selectedOption === 'loyaltyPoints') {
      this.setState({
        showLoyaltyPointsModal: true,
        selectedLoyaltyPointsAccount: paymentObj
      });
      this.makeDialogAloneAccessible(selectedOption);
    } else if (selectedOption === 'loyaltyHostCompVoucher') {
      this.setState({
        showLoyaltyHostCompVoucherModal: true,
        selectedLoyaltyVoucherAccount: paymentObj
      });
      this.makeDialogAloneAccessible(selectedOption);
    } else if (selectedOption === 'loyalty') {
      if (this.props.fetching) return;
      let loyaltyDetails = this.props.paymentLoyaltyDetails;
      loyaltyDetails.header = paymentObj.displayLabel || i18n.t('LOYALTY_PAYMENT_HEADER_LABEL');
      loyaltyDetails.instructionText = (paymentObj.accountEntry && paymentObj.accountEntry.instructionText) || i18n.t('LOYALTY_PAYMENT_INSTRUCTION_TEXT'); // eslint-disable-line max-len
      this.setState({
        showLoyaltyPaymentModal: true,
        loyaltyDetails
      });
      this.makeDialogAloneAccessible(selectedOption);
    } else if (selectedOption === 'atrium') {
      if (!this.props.userId) {
        this.props.saveUserPage(this.props.history.location.pathname);
        // const baseURI = config.webPaths.computedBasePath(window.location);
        const baseOrigin = window.location.origin;
        const webPath = baseOrigin.includes('localhost') ? '/application/ui' : process.env.ENVIRONMENT === 'production' ? '' : '/kiosk-desktop-service/application/ui';
        const samlIdentifierQueryParam = this.props.samlIdentifierFormat ? `&samlIdentifierFormat=${this.props.samlIdentifierFormat}` : '';
        const samlAssertPathOverrideQueryParam = this.props.samlAssertPathOverride ? `&samlAssertPathOverride=${this.props.samlAssertPathOverride}` : '';
        const keystoreOverrideQueryParam = this.props.keystoreLocation ? `&keystoreLocation=${this.props.keystoreLocation}` : '';
        window.location = `${baseOrigin}${webPath}/samllogin?entryPoint=${this.props.atriumEntryPoint}&friendlyName=${this.props.samlFriendlyName}&samlHostDomain=${this.props.samlHostDomain}${samlIdentifierQueryParam}${samlAssertPathOverrideQueryParam}${keystoreOverrideQueryParam}`;
      } else if (!this.props.atriumAccountInfo || this.props.atriumAccountInfo.length === 0) {
        this.props.getAtriumAccountInquiry();
      } else {
        const { totalWithTip, remaining, proccessAtriumAccount } = this.props;
        if (proccessAtriumAccount) return;
        const remainingAmount = (remaining === null) ? totalWithTip : remaining;
        let limitOnAccount = parseFloat(paymentObj.amount.remaining);
        if (paymentObj.limitOnAccount && !paymentObj.isAutoDetect) {
          this.setState({
            showAtriumModal: true,
            selectedAtriumAccount: paymentObj
          });
        } else if (paymentObj.authResponse) {
          this.props.showPaymentDeleteModal(selectedOption, paymentObj);
        } else {
          const amountToCharge = limitOnAccount > parseFloat(remainingAmount) ? remainingAmount : limitOnAccount;
          this.props.authAtriumPayment(paymentObj, amountToCharge, paymentObj.isAutoDetect);
        }
      }
    } else {
      this.props.onSelectOption(selectedOption);
    }
  }

  checkModalClosed () {
    const { showGaPaymentModal, showLoyaltyPointsModal, showLoyaltyVouchersModal, showLoyaltyHostCompVoucherModal, showLoyaltyPaymentModal,
      showGaAccountInfoModal } = this.state;

    if (!showGaPaymentModal && !showLoyaltyPointsModal && !showLoyaltyVouchersModal && !showLoyaltyHostCompVoucherModal && !showLoyaltyPaymentModal &&
      !showGaAccountInfoModal) {
      return true;
    }
    return false;
  }

  closeRoomChargeModal () {
    this.makeEverythingAccessible('roomCharge');
    this.props.clearRoomChargeError();
    this.setState({ showRoomChargeModal: false });
  }

  closeMemberChargeModal () {
    this.makeEverythingAccessible('memberCharge');
    this.props.clearMemberChargeError();
    this.setState({ showMemberChargeModal: false });
  }

  closeGaPaymentModal () {
    this.makeEverythingAccessible('genericAuthorization');
    this.setState({
      showGaPaymentModal: false,
      showGaAccountInfoModal: false
    });
  }

  closeGaAccountInfoModal () {
    this.setState({
      showGaAccountInfoModal: false
    });
  }

  closeLoyaltyVoucherModal () {
    this.makeEverythingAccessible('loyaltyVoucher');
    this.setState({
      showLoyaltyVouchersModal: false
    });
  }

  closeLoyaltyPointsModal () {
    this.makeEverythingAccessible('loyaltyPoints');
    this.setState({
      showLoyaltyPointsModal: false
    });
  }

  closeLoyaltyHostCompVoucherModal () {
    this.makeEverythingAccessible('loyaltyHostCompVoucher');
    this.setState({
      showLoyaltyHostCompVoucherModal: false
    });
  }

  closeLoyaltyProcessModal () {
    this.setState({
      showLoyaltyProcessModal: false
    });
  }

  closeLoyaltyPaymentModal () {
    this.makeEverythingAccessible('loyalty');
    this.setState({
      showLoyaltyPaymentModal: false
    });
  }

  closeAtriumModal () {
    this.makeEverythingAccessible('atrium');
    this.setState({
      showAtriumModal: false
    });
  }

  maskAccountNumber (number) {
    return (number.slice(-4));
  }

  validateVoucherExists (loyaltyAccountTier, instrumentType) {
    const { displayOptions } = this.props;
    const tenderType = `voucher/${instrumentType}`;
    const voucherExist = loyaltyAccountTier.voucherSummaries.find(voucher => voucher.instrumentType === instrumentType);
    return !!displayOptions[loyaltyTenderMappings[tenderType].tenderIdKey] && voucherExist;
  }

  returnLoyaltyPaymentOptions () {
    const { loyaltyAccounts, displayOptions, keyProps, hostCompVoucherPayments } = this.props;
    const loyaltyPaymentConfiguration = keyProps.find(paymentConfig => paymentConfig.type === 'loyalty') || {};

    let loyaltyPaymentOptions = [];

    loyaltyAccounts.forEach(loyaltyAccount => {
      loyaltyAccount.loyaltyAccountTiers.forEach(loyaltyAccountTier => {
        if (displayOptions[loyaltyTenderMappings['voucher/HOSTCOMP'].tenderIdKey]) {
          let hostCompVoucherPayment = hostCompVoucherPayments.find(voucher => voucher.primaryAccountId === loyaltyAccountTier.accountNumber);
          loyaltyPaymentOptions.push({
            type: 'loyaltyHostCompVoucher',
            paymentEnabled: true,
            displayLabel: displayOptions[loyaltyTenderMappings['voucher/HOSTCOMP'].displayLabel] || i18n.t('LOYALTY_HOSTCOMP_VOUCHER_TITLE'),
            primaryAccountId: loyaltyAccountTier.accountNumber,
            value: true,
            image: loyaltyPaymentConfiguration.image,
            amountToBeCharged: hostCompVoucherPayment && hostCompVoucherPayment.amountToBeCharged
          });
        }
        if (loyaltyAccountTier.voucherSummaries.length > 0) {
          const reducer = (accumulator, currentVoucher) => accumulator + (currentVoucher.amountToBeCharged ? parseFloat(currentVoucher.amountToBeCharged) : 0);
          let voucherCharges = loyaltyAccountTier.voucherSummaries.reduce(reducer, 0);

          const voucherOfferEnabledAndExists = this.validateVoucherExists(loyaltyAccountTier, 'OFFER');
          const voucherCouponEnabledAndExists = this.validateVoucherExists(loyaltyAccountTier, 'COUPON');
          const voucherCashEnabledAndExists = this.validateVoucherExists(loyaltyAccountTier, 'CASH');
          const voucherPrizeEnabledAndExists = this.validateVoucherExists(loyaltyAccountTier, 'PRIZE');
          const voucherCompEnabledAndExists = this.validateVoucherExists(loyaltyAccountTier, 'COMP');

          if (voucherOfferEnabledAndExists || voucherCouponEnabledAndExists || voucherCashEnabledAndExists || voucherPrizeEnabledAndExists || voucherCompEnabledAndExists) {
            loyaltyPaymentOptions.push({
              type: 'loyaltyVoucher',
              paymentEnabled: true,
              displayLabel: get(loyaltyPaymentConfiguration, 'vouchers.displayLabel', i18n.t('LOYALTY_VOUCHER_TITLE')),
              primaryAccountId: loyaltyAccountTier.accountNumber,
              value: true,
              amountToBeCharged: voucherCharges > 0 && voucherCharges,
              voucherSummaries: loyaltyAccountTier.voucherSummaries,
              voucherOfferEnabled: voucherOfferEnabledAndExists,
              voucherCouponEnabled: voucherCouponEnabledAndExists,
              voucherCashEnabled: voucherCashEnabledAndExists,
              voucherPrizeEnabled: voucherPrizeEnabledAndExists,
              voucherCompEnabled: voucherCompEnabledAndExists,
              image: loyaltyPaymentConfiguration.image
            });
          }
        }
        loyaltyAccountTier.pointsSummaries.forEach(loyaltyPointsType => {
          let tenderType = `points/${loyaltyPointsType.instrumentType}`;
          if (displayOptions[loyaltyTenderMappings[tenderType].tenderIdKey]) {
            loyaltyPaymentOptions.push({
              ...loyaltyPointsType,
              type: 'loyaltyPoints',
              paymentEnabled: true,
              displayLabel: displayOptions[loyaltyTenderMappings[tenderType].displayLabel] || i18n.t('LOYALTY_POINTS_TITLE'), // TODO: Determine if we need more user friendly names
              primaryAccountId: loyaltyAccountTier.accountNumber,
              value: true,
              amountToBeCharged: loyaltyPointsType.amountToBeCharged,
              image: loyaltyPaymentConfiguration.image
            });
          }
        });
      });
    });

    return loyaltyPaymentOptions;
  }

  isPaymentOptionEnabled (paymentOption) {
    const { remaining, displayOptions, fetching, disableLoyaltyInquiry, multiPaymentEnabled,
      loyaltyAccounts, totalWithTip, totalWithoutTip, proccessAtriumAccount, atriumAccountInfo } = this.props;
    if (this.checkTaxableTender(paymentOption)) {
      return false;
    }
    if (proccessAtriumAccount) {
      if ((paymentOption.type.includes('atrium') && (proccessAtriumAccount === 'autoDetect' || proccessAtriumAccount.tenderId === paymentOption.tenderId))) {
        paymentOption.processing = true;
        return true;
      } else {
        paymentOption.processing = false;
        return false;
      }
    }
    if (paymentOption.type.includes('atrium')) {
      let limitOnAccount;
      let remainingAmount = (remaining === null) ? totalWithTip : remaining;
      const isAllTaxExempt = atriumAccountInfo && atriumAccountInfo.every(account => !account.authResponse || account.isAllTaxExempt); // eslint-disable-line max-len
      if (!paymentOption.isAuthUsingTaxableTenderId && !isAllTaxExempt) return false;
      if (!paymentOption.amount) return true;
      if (paymentOption.limitOnAccount) {
        limitOnAccount = parseFloat(paymentOption.limitOnAccount) * parseFloat(paymentOption.amount.remaining);
      } else {
        limitOnAccount = parseFloat(paymentOption.amount.remaining);
      }
      return multiPaymentEnabled ? limitOnAccount > 0 : limitOnAccount >= parseFloat(remainingAmount);
    }
    paymentOption.processing = false;
    if (!paymentOption.type.includes('loyalty')) {
      return true;
    }
    if (paymentOption.type === 'loyalty') {
      const isLoyaltyMultipleInquiryAllowed = paymentOption.accountEntry.allowMultipleAccounts || (loyaltyAccounts && loyaltyAccounts.length === 0);
      return !disableLoyaltyInquiry && !fetching && isLoyaltyMultipleInquiryAllowed;
    } else {
      let remainingAmount = (remaining === null) ? (displayOptions['LOYALTY/isTipExempted'] === 'true' ? totalWithTip : totalWithoutTip) : remaining;
      const onlyTipRemainingAndLoyaltyTipDisabled = displayOptions['LOYALTY/isTipExempted'] === 'true' && (parseFloat(remainingAmount) <= parseFloat(totalWithTip - totalWithoutTip));
      return paymentOption.amountToBeCharged || !onlyTipRemainingAndLoyaltyTipDisabled;
    }
  }

  checkTaxableTender (paymentOption) {
    const { showTaxableTendersOnly, displayOptions } = this.props;
    if (paymentOption.type.includes('loyalty')) {
      const taxExemptedPaymentList = displayOptions['taxExemptedPaymentList'];
      return (showTaxableTendersOnly && (taxExemptedPaymentList && taxExemptedPaymentList === 'LOYALTY'));
    }
  }

  setAriaLabel (isApplePay, stripeApplePay, stripeCreditCard) {
    if (isApplePay) {
      return stripeApplePay ? stripeApplePay.displayLabel : i18n.t('PAYMENT_APPLE_PAY');
    } else {
      return stripeCreditCard ? stripeCreditCard.displayLabel : i18n.t('PAYMENT_OTHERS');
    }
  }
  getPaymentTypes () {
    const { keyProps, ccCardInfo, savedCards, gaAccounts, loyaltyAccounts, atriumAccountInfo, atriumFetchingInquiry,
      userId, orderConfig, atriumInquiryError, multiPaymentEnabled } = this.props;

    let paymentTypes = keyProps && [...keyProps];
    if (savedCards && savedCards.length > 0) {
      const savedCardProps = {
        type: 'savedCard',
        paymentEnabled: true,
        displayLabel: 'Saved Cards',
        valid: true
      };
      paymentTypes && paymentTypes.push(savedCardProps);
    }
    if (ccCardInfo) {
      const ccCard = {
        type: 'ccCard',
        paymentEnabled: true,
        displayLabel: ccCardInfo.cardEnding
          ? ccCardInfo.cardEnding
          : `${ccCardInfo.cardIssuer} ${i18n.t('PAYMENT_PAGE_ENDING')} ${this.maskAccountNumber(ccCardInfo.accountNumberMasked)}`, // eslint-disable-line max-len
        amountToBeCharged: ccCardInfo.multiPaymentAmount,
        valid: true
      };
      paymentTypes && paymentTypes.push(ccCard);
    }
    if (multiPaymentEnabled && gaAccounts && gaAccounts.length > 0) {
      const gaConfig = paymentTypes && paymentTypes.find(pay => pay.type === 'genericAuthorization');
      gaAccounts.forEach(accountInfo => {
        const gaAccountCard = {
          type: 'gaAccount',
          paymentEnabled: true,
          displayLabel: accountInfo.gaTenderName,
          account: accountInfo.accountNumber,
          valid: true,
          tenderTypeImage: gaConfig && gaConfig.tenderTypeImage,
          ...accountInfo
        };
        paymentTypes && paymentTypes.push(gaAccountCard);
      });
    }

    const loyaltyConfig = paymentTypes && paymentTypes.find(pay => pay.type === 'loyalty');
    if (loyaltyConfig && loyaltyAccounts && loyaltyAccounts.length > 0) {
      paymentTypes && paymentTypes.push(...this.returnLoyaltyPaymentOptions());
    }
    const atriumPayConfig = paymentTypes && paymentTypes.find(pay => pay.type === 'atrium');
    if (atriumPayConfig) {
      if (!atriumFetchingInquiry && !atriumInquiryError && userId && orderConfig.atriumConfig && atriumAccountInfo && atriumAccountInfo.length > 0) {
        atriumPayConfig.paymentEnabled = false;
        paymentTypes = paymentTypes.filter(pay => pay.type !== 'atrium');
        const isAllTaxExempt = atriumAccountInfo && atriumAccountInfo.every(account => !account.authResponse || account.isAllTaxExempt); // eslint-disable-line max-len
        atriumAccountInfo && atriumAccountInfo.forEach(accountInfo => {
          if (atriumPayConfig.autoDeduct.isEnabled) {
            if (accountInfo.isDefault) {
              const atriumautoDetectCard = {
                ...accountInfo,
                type: 'atrium',
                paymentEnabled: true,
                instructionText: atriumPayConfig.autoDeduct.displayName || i18n.t('AUTO_DETECT_LABEL'),
                image: atriumPayConfig.autoDeduct.tenderTypeImage,
                displayLabel: atriumPayConfig.displayLabel,
                valid: true,
                isAutoDetect: true
              };
              paymentTypes && paymentTypes.push(atriumautoDetectCard);
            }
          } else {
            if (atriumPayConfig.manualDeduct.isEnabled) {
              const atriumCard = {
                ...accountInfo,
                type: 'atrium',
                paymentEnabled: accountInfo.isTaxExemptedTender ? isAllTaxExempt : true,
                displayLabel: atriumPayConfig.displayLabel,
                instructionText: accountInfo.displayName,
                valid: true,
                image: accountInfo.image
              };
              paymentTypes && paymentTypes.push(atriumCard);
            }
          }
        });
      } else {
        atriumPayConfig.paymentEnabled = true;
      }
    }
    return paymentTypes;
  }

  render () {
    const { keyProps, paymentDetails, instructionText, isPayValid, removeLoyaltyPaymentError, multiPaymentEnabled, gaAccountInfoSuccess,
      stripeEnabled, remaining, multiPaymentFetching, ccCardInfo, showLoyaltyInquiryError, loyaltyPaymentError, loyaltyInquiryError, fetching, loyaltyInfoSuccess,
      stripeCreditCard, stripeApplePay, savedCards, gaAccounts, loyaltyAccounts, hostCompVoucherPayments, processingLoyaltyTransaction, loyaltyInfoSent,
      currencyDetails, totalWithTip, totalWithoutTip, displayOptions, remainingTipAmount, showCapacityWindow, showModal, ...rest } = this.props;
    const loyaltyPaymentConfiguration = (keyProps && keyProps.find(paymentConfig => paymentConfig.type === 'loyalty')) || {};
    const { loyaltyDetails, showLoyaltyPaymentModal, selectedAtriumAccount } = this.state;
    const ariaLabel = this.setAriaLabel(this.props.isApplePay, stripeApplePay, stripeCreditCard);
    let paymentTypes = this.getPaymentTypes();

    if (showCapacityWindow) {
      this.makeDialogAloneAccessible('capacityCheck');
    } else if (showModal) {
      this.makeDialogAloneAccessible('iframe');
    }

    return (
      <ThemeProvider className='pay-options' theme={theme}>
        <Container className='pay-options-container'>
          <PayListTopContainer className='pay-list-top-container'>
            <MethodFlex className='pay-label-container' width={[1]}>
              <MethodText className='pay-label header'
                tabIndex={0} aria-label={(paymentDetails && paymentDetails.headerText) || i18n.t('PAYMENT_PAGE_TITLE')}
              >
                {(paymentDetails && paymentDetails.headerText) || <Trans i18nKey='PAYMENT_PAGE_TITLE' />}
              </MethodText>
              <MethodTextLabel className='pay-label instruction-text'
                tabIndex={0} aria-label={(paymentDetails && paymentDetails.instructionText) || i18n.t('PAYMENT_PAGE_SELECT_PAYMENT')}
              >
                {(paymentDetails && paymentDetails.instructionText) || <Trans i18nKey='PAYMENT_PAGE_SELECT_PAYMENT' />}
              </MethodTextLabel>
              {paymentDetails && paymentDetails.subInstructionText &&
                <MethodTextLabel className='pay-label sub-instruction-text'
                  tabIndex={0} aria-label={paymentDetails.subInstructionText}
                >
                  {paymentDetails.subInstructionText}
                </MethodTextLabel>
              }
            </MethodFlex>
            <PayOptionParent
              className='pay-options-parent'
              singleoption={paymentTypes && paymentTypes.length === 1 && !stripeEnabled}
              aria-label={`${(paymentTypes && paymentTypes.length > 1)
                ? `${i18n.t('SELECT_PAYMENT')}` : ``}`}
              tabIndex={0}
            >
              {paymentTypes && paymentTypes.map((item, index) => {
                if (item.paymentEnabled) {
                  item.valid = this.isPaymentOptionEnabled(item);
                  return <React.Fragment key={`${item.type}-${index}`}>
                    <PaymentCard
                      classContext={`tile ${item.type}-${index}`}
                      className='tile'
                      id={item.type}
                      keyProps={item}
                      selectedOptionId={this.state.selectedOptionId}
                      onSelectOptionList={this.handleOption}
                      contextId={this.props.contextId}
                      currencyDetails={currencyDetails}
                      showLoading={(item.type === 'loyalty' && this.props.fetching) ||
                        (item.type === 'atrium' && this.props.atriumFetchingInquiry) ||
                        item.processing}
                      isModalClosed={this.checkModalClosed}
                      {...rest}
                    />
                  </React.Fragment>;
                }
              })}
              {stripeEnabled &&
                <PayRequestContainer className='stripe-container' onClick={() => this.props.handlePayment('stripe-pay')}
                  selectedoption={this.props.selectedOptionId} validpayment={this.props.isPayValid}
                  onMouseEnter={() => this.setState({ hover: true })}
                  onMouseLeave={() => this.setState({ hover: false })}
                  aria-label={ariaLabel}
                  tabIndex={this.props.isPayValid ? 0 : -1}>
                  {this.props.isApplePay
                    ? <React.Fragment>
                      <ImageContainer className='image-container-1'>
                        {stripeApplePay && stripeApplePay.image
                          ? <UrlImageLoader
                            className='url-container'
                            src={config.getPOSImageURL(this.props.contextId,
                              stripeApplePay.image, rest.appconfig.tenantID)}
                            imageStyle={cardLogoStyle}
                            alt='' />
                          : <BoxContainer className='box-container' width={[1]} >
                            <ImageCont src={`${config.webPaths.assets}apple_pay.png`} alt='' />
                          </BoxContainer>
                        }
                      </ImageContainer>
                      <TextContainer data-color={this.state.hover || this.props.selectedOptionId === 'stripe-pay'}
                      >
                        {stripeApplePay ? stripeApplePay.displayLabel : <Trans i18nKey='PAYMENT_APPLE_PAY' />}
                      </TextContainer>
                    </React.Fragment>
                    : <React.Fragment>
                      <ImageContainer className='image-container-2'>
                        {stripeCreditCard && stripeCreditCard.image
                          ? <UrlImageLoader
                            className='url-container'
                            src={config.getPOSImageURL(this.props.contextId,
                              stripeCreditCard.image, rest.appconfig.tenantID)}
                            imageStyle={cardLogoStyle}
                            alt='' />
                          : <BoxContainer className='box-container' width={[1]} >
                            <ImageCont src={`${config.webPaths.assets}visa_logo.png`} alt='' />
                          </BoxContainer>
                        }
                      </ImageContainer>
                      <TextContainer data-color={this.state.hover || this.props.selectedOptionId === 'stripe-pay'}
                      >
                        {stripeCreditCard ? stripeCreditCard.displayLabel : <Trans i18nKey='PAYMENT_OTHERS' />}
                      </TextContainer>
                    </React.Fragment>
                  }
                </PayRequestContainer>
              }
              {showLoyaltyInquiryError &&
                <ErrorBubbleText aria-live='polite' tabIndex={0}>
                  {loyaltyInquiryError || <Trans i18nKey='LOYALTY_INQUIRY_GENERIC_ERROR' />}
                </ErrorBubbleText>
              }
              {!multiPaymentFetching && !processingLoyaltyTransaction && !showLoyaltyPaymentModal && fetching &&
                <Announcements message={i18n.t('PAYMENT_LOYALTY_ACCOUNTS_FETCHING')} />
              }
              {loyaltyAccounts && loyaltyAccounts.length > 0 && !multiPaymentFetching && !processingLoyaltyTransaction && !showLoyaltyPaymentModal && !fetching && !loyaltyInquiryError &&
                <Announcements message={i18n.t('PAYMENT_LOYALTY_ACCOUNTS_ADDED')} />
              }
              {gaAccounts && gaAccounts.length > 0 && gaAccountInfoSuccess && multiPaymentEnabled && !multiPaymentFetching && !this.state.showGaPaymentModal && !fetching &&
                <Announcements message={i18n.t('PAYMENT_GA_ACCOUNTS_ADDED')} />
              }
            </PayOptionParent>
            {(this.state.showGaPaymentModal || this.state.showGaAccountInfoModal) &&
              <ConnectedGAPayment
                contextId={this.props.contextId}
                tenantId={rest.appconfig.tenantID}
                open={this.state.showGaPaymentModal}
                showGetAccount={this.state.showGaPaymentModal}
                accessible={this.makeEverythingAccessible}
                showAccountInfo={this.state.showGaAccountInfoModal}
                onCancel={this.closeGaPaymentModal}
                multiPaymentEnabled={multiPaymentEnabled}
                selectedGaAccount={this.state.selectedGaAccount} />
            }
            {this.state.showRoomChargeModal &&
              <ConnectedRoomCharge
                closeRoomCharge={this.closeRoomChargeModal}
                accessible={this.makeEverythingAccessible}
                totalWithTip={totalWithTip}
                currencyDetails={currencyDetails}
                remaining={remaining}
                roomCharge={this.state.roomCharge}
                displayProfileId={this.props.displayProfileId}
              />
            }
            {this.state.showMemberChargeModal &&
              <ConnectedMemberCharge
                closeMemberCharge={this.closeMemberChargeModal}
                accessible={this.makeEverythingAccessible}
                totalWithTip={totalWithTip}
                currencyDetails={currencyDetails}
                remaining={remaining}
                memberCharge={this.state.memberCharge}
                displayProfileId={this.props.displayProfileId}
              />
            }
            {
              this.state.showLoyaltyVouchersModal &&
              <ConnectedLoyaltyVoucherModal
                contextId={this.props.contextId}
                tenantId={rest.appconfig.tenantID}
                accessible={this.makeEverythingAccessible}
                closeModal={this.closeLoyaltyVoucherModal}
                totalWithTip={totalWithTip}
                totalWithoutTip={totalWithoutTip}
                currencyDetails={currencyDetails}
                remaining={remaining}
                remainingTipAmount={remainingTipAmount}
                selectedLoyaltyAccount={this.state.selectedLoyaltyVoucherAccount}
                loyaltyVoucherInfo={this.state.loyaltyVoucherInfo}
                multiPaymentEnabled={multiPaymentEnabled}
                isTipExempt={displayOptions['LOYALTY/isTipExempted'] === 'true'}
                loyaltyPaymentError={loyaltyPaymentError}
                removeLoyaltyPaymentError={removeLoyaltyPaymentError}
              />
            }
            {
              this.state.showLoyaltyPointsModal &&
              <ConnectedLoyaltyPointsModal
                contextId={this.props.contextId}
                tenantId={rest.appconfig.tenantID}
                accessible={this.makeEverythingAccessible}
                closeModal={this.closeLoyaltyPointsModal}
                totalWithTip={totalWithTip}
                totalWithoutTip={totalWithoutTip}
                currencyDetails={currencyDetails}
                remaining={remaining}
                remainingTipAmount={remainingTipAmount}
                selectedLoyaltyAccount={this.state.selectedLoyaltyPointsAccount}
                multiPaymentEnabled={multiPaymentEnabled}
                isTipExempt={displayOptions['LOYALTY/isTipExempted'] === 'true'}
                loyaltyPaymentError={loyaltyPaymentError}
                removeLoyaltyPaymentError={removeLoyaltyPaymentError}
              />
            }
            {
              this.state.showLoyaltyHostCompVoucherModal &&
              <ConnectedLoyaltyHostCompVoucherModal
                contextId={this.props.contextId}
                tenantId={rest.appconfig.tenantID}
                accessible={this.makeEverythingAccessible}
                closeModal={this.closeLoyaltyHostCompVoucherModal}
                totalWithTip={totalWithTip}
                totalWithoutTip={totalWithoutTip}
                currencyDetails={currencyDetails}
                remaining={remaining}
                remainingTipAmount={remainingTipAmount}
                selectedLoyaltyAccount={this.state.selectedLoyaltyVoucherAccount}
                multiPaymentEnabled={multiPaymentEnabled}
                isTipExempt={displayOptions['LOYALTY/isTipExempted'] === 'true'}
                loyaltyPaymentError={loyaltyPaymentError}
                removeLoyaltyPaymentError={removeLoyaltyPaymentError}
                hostCompVoucherPayments={hostCompVoucherPayments}
              />
            }
            {
              this.state.showLoyaltyPaymentModal &&
              <LoyaltyPaymentModal
                loyaltyDetails={loyaltyDetails}
                accessible={this.makeEverythingAccessible}
                closeModal={this.closeLoyaltyPaymentModal}
                loyaltyInfoMap={this.props.loyaltyInfoMap}
                siteId={this.props.contextId}
                displayProfileId={this.props.displayProfileId}
                sendLoyaltyInquiry={this.props.sendLoyaltyInquiry}
                loyaltyPaymentConfiguration={loyaltyPaymentConfiguration}
              />
            }
            {
              this.state.showAtriumModal &&
              <ConnectedAtriumModal
                accessible={this.makeEverythingAccessible}
                closeModal={this.closeAtriumModal}
                currencyDetails={currencyDetails}
                totalWithTip={totalWithTip}
                totalWithoutTip={totalWithoutTip}
                remaining={remaining}
                remainingTipAmount={remainingTipAmount}
                atriumAccount={selectedAtriumAccount}
              />
            }
          </PayListTopContainer>
          <div className='footer' style={this.props.remaining ? footerSpaced : footerStyle} remaining={this.props.remaining}>
            <ModalTotalText className='total-due' tabIndex={0}
              aria-label={`${i18n.t('TOTAL_FOOTER')} ${currencyLocaleFormat(totalWithTip, currencyDetails)}`}>
              <Trans i18nKey='TOTAL_FOOTER' />: {currencyLocaleFormat(totalWithTip, currencyDetails)}
            </ModalTotalText>
            {this.props.remaining &&
              <ModalRemainingText className='remaining' tabIndex={0} aria-label={`${i18n.t('REMAINING_FOOTER')}${currencyLocaleFormat(remaining, currencyDetails)}`}>
                <Trans i18nKey='REMAINING_FOOTER' />: {currencyLocaleFormat(remaining, currencyDetails)}
              </ModalRemainingText>}
          </div>
        </Container>
      </ThemeProvider>
    );
  }
}

PaymentOptions.propTypes = {
  keyProps: PropTypes.arrayOf(
    PropTypes.shape({
      image: PropTypes.string,
      type: PropTypes.string.isRequired,
      valid: PropTypes.bool
    }).isRequired
  )
};

export default PaymentOptions;
