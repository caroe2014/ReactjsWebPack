// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import { Flex, Text, Button, Heading, Modal as ModalWindow, Fixed } from 'rebass';
import config from 'app.config';
import { currencyLocaleFormat } from 'web/client/app/utils/NumberUtils';
import Loader from 'web/client/app/components/CircleBarLoader/index';
import BaseLoader from 'web/client/app/components/Loader/index';
import ErrorCodes from './error-codes';
import { getOrderConfigurationDetails } from 'web/client/app/utils/OrderConfig';
import { paymentTypes } from 'web/client/app/utils/constants';
import IconButton from 'web/client/app/components/IconButton';
import i18n from 'web/client/i18n';
import { Trans } from 'react-i18next';
import CheckBox from 'web/client/app/components/CheckBox';
import Announcements from 'web/client/app/components/Announcements';

let errorCodes = new ErrorCodes();

const ModalContainer = styled(ModalWindow)`
  border-radius: 4px;
  z-index: 1101;
  width: 420px;
  height: ${props => {
    if (props.checkbox) return '880px';
    return '810px';
  }};
  ${props => props.theme.mediaBreakpoints.mobile`width: 100%; border-radius: 0px; height: 100%`};
`;

const TopContainer = styled(Flex)`
  padding: 15px;
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

const CloseButton = styled(props => <IconButton {...props} />)`
  color: ${props => props.theme.colors.textGrey};
  font-size: ${props => props.theme.fontSize.md};
  font-weight: 300;
  position: absolute;
  top: 15px;
  padding: 15px;
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const Container = styled(Flex)`
  flex-direction: column;
  position: relative;
  max-width: 600px;
  width: 100%;
  margin: 20px auto 0px;
  padding: 0px 30px;
  ${props => props.theme.mediaBreakpoints.mobile`
    margin: 25px auto 0px auto;
    background-color: white;
    padding: 0px 0px;
  `};
  ${props => props.theme.mediaBreakpoints.tablet`
    margin: 25px auto 0px auto;
    background-color: white;
    `};
`;

const BackgroundContainer = styled.div`
  ${props => props.theme.mediaBreakpoints.desktop`display: none`};
  ${props => props.theme.mediaBreakpoints.tablet`display: none`};
  ${props => props.theme.mediaBreakpoints.mobile`
    display: block;
    height: 100%;
  `}
  width: 100%;
  background: ${props => props.theme.colors.light};
  z-index: -1;
  position: fixed;
  height: 100%;
  @media print{
    display:none;
  }
`;

const iFrameStyle = {
  height: '100%',
  width: '100%',
  minHeight: '570px'
};

const iFrameHidden = {
  display: 'none'
};

const FetchText = styled(Flex)`
  width:100%;
  margin-top: 20px;
  justify-content: center;
  color: ${props => props.theme.colors.textGrey};
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const FetchBoldText = styled(Text)`
  height: 100%;
  width:100%;
  margin: auto;
  font-weight: 700;
  color: #505050;
  margin-top: 5px;
  margin-bottom: 40px;
  text-align: center;
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const SendButton = styled(Button)`
  background: ${props => props.theme.colors.buttonControlColor};
  color: ${props => props.theme.colors.buttonTextColor};
  cursor: pointer;
  font-weight: 500;
  font-size: 16px;
  float: right;
  width: 150px;
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
`;

const LoadingSuccessContainer = styled(Flex)`
  position: absolute;
  margin-top: 100px;
`;

const IconFlex = styled(Flex)`
  width: 50px;
  height: 130px;
  margin-bottom: 20px;
  margin-top: 30px;
  justify-content: center;
  align-items: center;
`;

const RetryTab = styled(Flex)`
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const CheckBoxContainer = styled(Flex)`
  display: flex;
  flex-direction: column;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  margin: 16px 0px;
`;

const ModalTitle = styled(Heading)`
  margin: 12px 0px 16px;
  color: ${props => props.theme.colors.primaryTextColor};
  font-size: 1.5em;
  font-weight: 500;
  ${props => props.theme.mediaBreakpoints.mobile`margin: 20px 4px 16px;`}
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const ModalText = styled(Text)`
  color: ${props => props.theme.colors.secondaryTextColor};
  font-size: 16px;
  margin-bottom: 8px;
  text-align: center;
  ${props => props.theme.mediaBreakpoints.mobile`margin: 16px 4px 16px;`}
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const LoadingContainer = styled(Flex)`
  // z-index: 1000;
`;

const PaymentInfo = styled(Flex)`
  width: 100%;
  max-width: 400px;
  flex-direction: column;
  ${props => props.theme.mediaBreakpoints.mobile`padding: 0px 8px;`}
  justify-content: center;
    align-items: center;
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

const fontStyle = {
  fontSize: '130px',
  display: 'inline-block',
  verticalAlign: 'middle',
  marginRight: '8px',
  color: '#BFBFBF'
};

const generateIframeURL = (props) => {
  const baseURI = config.webPaths.computedBasePath(window.location);
  const { iFrameApi, payTenantId, clientId, apiToken } = props;
  if (clientId && apiToken) {
    return `${iFrameApi}/pay-iframe-service/iFrame/tenants/${payTenantId}/${clientId}?apiToken=${apiToken.token}&submit=PROCESS&style=${baseURI}${config.webPaths.api}payOptions/getIFrameCss/${i18n.language ? i18n.language : 'en'}/${window.location.hostname}&doVerify=true&version=3`; // eslint-disable-line max-len
  }
};

class Payment extends Component {
  constructor (props) {
    super(props);
    this.state = {
      tokenFlag: false,
      payToken: '',
      successLoader: false,
      tokenErrorTab: false,
      retry: false,
      fetchForm: true,
      iFrameURL: '',
      formLoaded: false,
      saveCardFlag: false
    };
    this.send = this.send.bind(this);
    this.iFrameUrl = generateIframeURL(props);
    this.refreshWhenExpired = this.refreshWhenExpired.bind(this);
    this.handleFileLoad = this.handleFileLoad.bind(this);
    this.initPayment = this.initPayment.bind(this);
    this.handleModalClose = this.handleModalClose.bind(this);
    this.checkSelected = this.checkSelected.bind(this);
    this.onClickClose = this.onClickClose.bind(this);
    this.onEscape = this.onEscape.bind(this);
    this.makeEverythingAccessible = this.makeEverythingAccessible.bind(this);
  }

  componentDidMount () {
    if (this.props.storesList.length > 0) {
      this.initPayment();
    } else {
      this.props.getSites();
    }
    this.props.setShowCapacityWindow(false);
    ((this.state.fetchForm || !this.state.formLoaded) && !this.state.tokenErrorTab) &&
    document.getElementById('iframe-fetching') &&
      document.getElementById('iframe-fetching').focus();
  }

  checkSelected () {
    this.setState({ saveCardFlag: !this.state.saveCardFlag });
  }

  initPayment () {
    // TOKEN STARTS
    this.props.getToken();
    window.addEventListener('message', this.handleFrameTasks);
    this.send();
    this.received = false;
    this.iFrameUrl = generateIframeURL(this.props);
    this.setState({ iFrameURL: this.iFrameUrl });
    if (this.Payment) {
      this.Payment.src = this.iFrameUrl;
    }
  }

  componentWillReceiveProps (nextProps) {
    this.setState({ tokenFlag: true });
    const { items, storesList, displayProfileId } = this.props;
    if (storesList.length !== nextProps.storesList.length && nextProps.storesList.length > 0) {
      const orderConfig = getOrderConfigurationDetails(items, nextProps.storesList, displayProfileId);
      this.props.setOrderConfig(orderConfig);
      this.initPayment();
    }
  }

  componentDidUpdate (prevProps, prevState) {
    if ((this.props.apiToken) && prevProps.apiToken !== this.props.apiToken) {
      this.stopLoading();
      this.clearErrorTab();
    }
    if (prevProps.saleData !== this.props.saleData) {
      this.redirectToSuccess();
    }
    if (prevProps.tokenError !== this.props.tokenError) {
      this.setErrorTab();
    }
    if (prevProps.autoTokenError !== this.props.autoTokenError) {
      this.setRetry();
    }
    if (prevProps.saleErrorFlag !== this.props.saleErrorFlag) {
      this.props.setAppError(new Error(i18n.t('PAYMENT_PAGE_ERROR_TRANSACTION')));
      this.refreshWhenExpired();
    }
    if ((prevProps.capacityFail !== this.props.capacityFail) || (prevProps.refreshSession !== this.props.refreshSession)) { // eslint-disable-line max-len
      this.props.paymentType === paymentTypes.IFRAME && this.refreshWhenExpired();
    }
    const newIframeURL = generateIframeURL(this.props);
    if (this.iFrameUrl !== newIframeURL && this.props.changePending === 0) {
      this.iFrameUrl = newIframeURL;
      if (this.Payment) {
        this.Payment.contentWindow.location.replace(this.iFrameUrl);
      }
      this.setPaymentSrc(newIframeURL);
      const { history, lastCartLocation } = this.props;
      if (this.props.items.length === 0) {
        history.replace(lastCartLocation || '/');
      }
    }
  }

  componentWillUnmount () {
    window.removeEventListener('message', this.handleFrameTasks);
  }

  setPaymentSrc (newIframeURL) {
    this.setState({ iFrameURL: newIframeURL });
  }

  send () {
    if (this.Payment && this.Payment.contentWindow) {
      this.Payment.contentWindow.postMessage(this.props.total, '*');
    }
    if (!this.received) {
      setTimeout(this.send, 100);
    }
  }

  handleFrameTasks = (e) => {
    let parsedData = '';
    if (e.data.token === undefined) {
      let cont = true;
      try {
        parsedData = JSON.parse(e.data);
      } catch (er) {
        cont = false;
      }
      if (cont) {
        if (parsedData.code === 9000) {
          this.props.setAppError(new Error(i18n.t('PAYMENT_PAGE_ERROR_SESSION')));
          this.refreshWhenExpired();
        } else if (parsedData.code && parsedData.message) {
          const errorMap = errorCodes.getItem(parsedData.code);
          if (errorMap) {
            this.props.setAppError(new Error(i18n.t(errorMap.reason)));
            this.refreshWhenExpired();
          } else {
            this.props.setAppError(new Error(i18n.t('DEFAULT_IFRAME_ERROR')));
            this.refreshWhenExpired();
          }
        }
      }
    } else if (e.data.token) {
      this.setState({ payToken: e.data.token });
      const obj = {
        token: e.data.token,
        paymentDetails: {
          'amount': `${this.props.order.taxIncludedTotalAmount.amount}`,
          'taxAmount': `${this.props.order.subTotalTaxAmount.amount}`,
          'invoiceId': `${this.props.order.orderNumber}`,
          'billDate': `${this.props.order.created}`,
          'transactionAmount': `${this.props.order.taxIncludedTotalAmount.amount}`,
          'tipAmount': `${this.props.tipAmount ? this.props.tipAmount : '0.00'}`,
          'cardHolderName': e.data.cardInfo.cardholderName ? e.data.cardInfo.cardholderName : '',
          'accountNumberMasked': e.data.cardInfo.accountNumberMasked,
          'cardIssuer': e.data.cardInfo.cardIssuer,
          'expirationYearMonth': e.data.cardInfo.expirationYearMonth,
          'multiPaymentAmount': this.props.multiPaymentEnabled && (this.props.remaining || this.props.totalWithTip)
        },
        saveCardFlag: this.state.saveCardFlag
      };
      this.setState({ successLoader: true });
      this.props.setTokenizedData(obj);
      if (this.props.multiPaymentEnabled) {
        this.props.setPaymentsAmount(this.props.remaining ||
          parseFloat(this.props.totalWithTip), parseFloat(this.props.totalWithTip), 0);
        this.props.setCCPaymentCard(obj.paymentDetails);
      }
      this.onClickClose();
    }
    if (e.data.cancel) {
      this.props.history.goBack();
    }
  }

  refreshWhenExpired () {
    this.setState({ successLoader: false, fetchForm: true, formLoaded: false, tokenErrorTab: false });
    window.scrollTo(0, 0);
    this.props.getToken();
  }

  stopLoading () {
    this.setState({ successLoader: false, fetchForm: false });
  }

  clearErrorTab () {
    this.setState({ tokenErrorTab: false });
  }

  setErrorTab () {
    this.setState({ tokenErrorTab: true, retry: false, fetchForm: false });
    this.props.getAutoToken();
  }

  setRetry () {
    this.setState({ tokenErrorTab: true, retry: true, successLoader: false });
  }

  redirectToSuccess () {
    this.stopLoading();
    this.props.history.push('/paymentSuccess');
  }

  handleFileLoad () {
    this.setState({ formLoaded: true });
  }

  handleModalClose () {
    this.refreshWhenExpired();
  }

  onClickClose () {
    this.makeEverythingAccessible();
    this.props.closeModal();
  }

  onEscape (e) {
    if (e.which === 27) {
      this.onClickClose();
    }
  }

  makeEverythingAccessible () {
    // Accessibility for dialog
    const bottomContainer = document.querySelector('.BottomContainer .payments-container-parent');
    const topContainer = document.querySelector('.TopContainer');
    topContainer.inert = false;
    const footer = document.querySelector('.BottomContainer .footer');
    footer.inert = false;
    const Children = bottomContainer.children;
    Array.from(Children).forEach(child => {
      if (child.id !== 'iframe-modal') {
        child.inert = false;
      }
    });
  }

  render () {
    const { apiToken, payTenantId, configFetching, siteFetching, storesList,
      payOptions, cboConfig, userId, total, tipAmount, currencyDetails, remaining } = this.props;
    const iFrameConfig = payOptions.find(pay => pay.type === 'rGuestIframe');
    const guestProfileEnabled = cboConfig && cboConfig.siteAuth && cboConfig.siteAuth.type === 'socialLogin';

    const totalValue = currencyLocaleFormat(
      parseFloat((parseFloat(total) + parseFloat(tipAmount))).toFixed(2),
      currencyDetails);

    return (
      (!configFetching && !siteFetching && storesList.length > 0)
        ? <Flex className='iframe-modal' id='iframe-modal' onKeyDown={this.onEscape}>
          <ModalBackground className='payment-modal-background'/>
          <ModalContainer className='payment-iframe-modal-parent'
            checkbox={guestProfileEnabled ? userId : undefined}
            role='dialog'
          >
            {((this.state.fetchForm || !this.state.formLoaded) && !this.state.tokenErrorTab) &&
            <Announcements message={i18n.t('PAYMENT_PAGE_FETCHING_IFRAME')} />}
            <Announcements message={i18n.t('PROCESSING_TEXT')} />
            {this.state.tokenErrorTab && !this.state.retry &&
            <Announcements message={`${i18n.t('PAYMENT_PAGE_FETCHING_RETRY_LINE_1')}
                         ${i18n.t('PAYMENT_PAGE_FETCHING_RETRY_LINE_2')}`} />}
            {this.state.tokenErrorTab && !this.state.retry &&
            <Announcements message={`${i18n.t('PAYMENT_PAGE_FETCHING_FAILED_LINE_1')}
                         ${i18n.t('PAYMENT_PAGE_FETCHING_FAILED_LINE_2')}`} />}
            {this.state.formLoaded && <Announcements
              message={iFrameConfig.displayLabel || i18n.t('CREDIT_DEBIT_CARD')} />}
            <TopContainer className='top'>
              <Container className='iframe-container container' m={3} alignItems='center'>
                <BackgroundContainer/>
                {(this.state.successLoader) &&
                  <LoadingSuccessContainer className='loading-success-container'>

                    <Loader className='Loader inLoadingSuccessContainer'/>
                  </LoadingSuccessContainer>
                }
                { (this.state.fetchForm || !this.state.formLoaded) && !this.state.tokenErrorTab && <React.Fragment>
                  <LoadingContainer className='LoadingContainer'>
                    <Loader className='Loader in LoadingContainer'/>
                  </LoadingContainer>

                  <FetchText id='iframe-fetching'
                    tabIndex={0} aria-label={i18n.t('PAYMENT_PAGE_FETCHING_IFRAME')}
                  ><Trans i18nKey='PAYMENT_PAGE_FETCHING_IFRAME'/></FetchText>
                </React.Fragment>}
                {this.state.tokenFlag && apiToken && payTenantId && this.state.iFrameURL &&
        !this.state.tokenErrorTab && !this.state.fetchForm &&
        <Fragment>
          {this.state.formLoaded &&
          <PaymentInfo className='info-parent'>
            <ModalTitle className='modal-title'
              tabIndex={0} aria-label={iFrameConfig.displayLabel || i18n.t('CREDIT_DEBIT_CARD')}>
              {iFrameConfig.displayLabel || <Trans i18nKey='CREDIT_DEBIT_CARD'/>}
            </ModalTitle>
            <Fragment>
              <ModalText className='modal-text'
                tabIndex={0} aria-label={iFrameConfig.instructionText || i18n.t('TRANSACTIONS_ENCRYPTED')}>
                {iFrameConfig.instructionText || <Trans i18nKey='TRANSACTIONS_ENCRYPTED'/>}
              </ModalText>
              <ModalText className='modal-text'
                tabIndex={0} aria-label={iFrameConfig.subInstructionText || i18n.t('IFRAME_SUB_INTSN')}
              >
                {iFrameConfig.subInstructionText || <Trans i18nKey='IFRAME_SUB_INTSN'/>}
              </ModalText>
              { (guestProfileEnabled && userId) && <CheckBoxContainer className='check-box-container'>
                <CheckBox
                  classDesc={'checkbox'}
                  label={<Trans i18nKey='SAVE_CARD'/>}
                  capacityText
                  selectedOption={this.checkSelected}
                  selected={this.state.saveCardFlag}
                  ariaLabel={i18n.t('SAVE_CARD')}
                  tabIndex={0}
                  ariaChecked={this.state.saveCardFlag}
                />
              </CheckBoxContainer>
              }
            </Fragment>
          </PaymentInfo>
          }
          <iframe
            className='iFrame form-loaded'
            onLoad={this.handleFileLoad}
            frameBorder='0'
            scrolling='no'
            style={this.state.formLoaded ? iFrameStyle : iFrameHidden}
            ref={e => {
              this.Payment = e;
            }}
            src={this.state.iFrameURL}
          />
        </Fragment>
                }

                { this.state.tokenErrorTab &&
                <div>
                  { !this.state.retry
                    ? <React.Fragment>
                      <LoadingContainer className='no-retry LoadingContainer'>
                        <Loader className='Loader inLoadingContainer'/>
                      </LoadingContainer>

                      <FetchText aria-label={i18n.t('PAYMENT_PAGE_FETCHING_RETRY_LINE_1')}
                        tabIndex={0}><Trans i18nKey='PAYMENT_PAGE_FETCHING_RETRY_LINE_1'/></FetchText>
                      <FetchBoldText aria-label={i18n.t('PAYMENT_PAGE_FETCHING_RETRY_LINE_2')}
                        tabIndex={0}><Trans i18nKey='PAYMENT_PAGE_FETCHING_RETRY_LINE_2'/></FetchBoldText>
                    </React.Fragment>
                    : <React.Fragment>
                      <RetryTab className='retry-tab'>
                        <IconFlex>
                          <i className='agilysys-icon-tapered_exclamation' alt='' style={fontStyle} />
                        </IconFlex>

                        <FetchText aria-label={i18n.t('PAYMENT_PAGE_FETCHING_FAILED_LINE_1')}
                          tabIndex={0}><Trans i18nKey='PAYMENT_PAGE_FETCHING_FAILED_LINE_1'/></FetchText>
                        <FetchBoldText aria-label={i18n.t('PAYMENT_PAGE_FETCHING_FAILED_LINE_2')}
                          tabIndex={0}><Trans i18nKey='PAYMENT_PAGE_FETCHING_FAILED_LINE_2'/></FetchBoldText>
                        <SendButton
                          className='retry-button'
                          type='submit'
                          onClick={this.refreshWhenExpired}
                          role='button'
                          tabIndex={0}
                          aria-label={i18n.t('PAYMENT_PAGE_FETCHING_RETRY_BUTTON')}
                          children={<Trans i18nKey='PAYMENT_PAGE_FETCHING_RETRY_BUTTON'/>}
                        />
                      </RetryTab>
                    </React.Fragment>}

                </div>
                }
              </Container>
            </TopContainer>
            {this.state.formLoaded &&
              <Footer remaining={this.props.remaining}>
                <ModalTotalText className='total-due'
                  tabIndex={0} aria-label={`${i18n.t('TOTAL_FOOTER')} ${totalValue}`}>
                  <Trans i18nKey='TOTAL_FOOTER'/> {totalValue}
                </ModalTotalText>
                {this.props.remaining &&
                  <ModalRemainingText className='remaining'
                    tabIndex={0}
                    aria-label={`${i18n.t('REMAINING_FOOTER')} ${currencyLocaleFormat(remaining, currencyDetails)}`} >
                    <Trans i18nKey='REMAINING_FOOTER' /> {currencyLocaleFormat(remaining, currencyDetails)}
                  </ModalRemainingText>}
              </Footer>
            }
            <CloseButton children='&#10005;' tabIndex={0} aria-label={i18n.t('EXIT_DIALOG')}
              role='button' onClick={this.onClickClose} />
          </ModalContainer>
        </Flex>
        : <LoadingContainer className='base-loader'><BaseLoader /></LoadingContainer>
    );
  }
}

export default Payment;
