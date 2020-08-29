// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.
/* eslint-disable no-mixed-operators */
/* eslint-disable max-len */
import React, { Component } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import theme from 'web/client/theme';
import PropTypes from 'prop-types';
import { Flex, Text } from 'rebass';
import config from 'app.config';
import UrlImageLoader from 'web/client/app/components/UrlImageLoader';
import { Trans } from 'react-i18next';
import { currencyLocaleFormat } from 'web/client/app/utils/NumberUtils';
import { LoadingComponent } from 'web/client/app/components/Loader/ReusableLoader';
import i18n from 'web/client/i18n';

const Container = styled(Flex)`
  align-items: left;
  flex-wrap: no-wrap;
  flex-direction: column;
  min-height: 50px;
  max-height: 100px;
  justify-content: center;
  margin: 0.5em 1em 0.5em 1em;
  ${props => props.theme.mediaBreakpoints.mobile`
    margin: 0em auto 1em auto;
  `};
  ${props => props.theme.mediaBreakpoints.tablet`
    margin: 0em auto 1em auto;
  `};
  width: 100%;
  max-width: 280px;
  border: 2px solid ${props => props.theme.colors.buttonControlColor};
  border-radius: 6px;
  padding: ${props => {
    if (props.amountcharged || props.showLoading) return '4px 0px 0px';
    return '4px 0px 4px';
  }};
  opacity: ${props => {
    if (props.validpayment) return '1';
    return '0.4';
  }};
  }
  color: ${props => props.theme.colors.buttonControlColor};
  &:hover {
    cursor: ${props => props.validpayment && !props.showLoading ? 'pointer' : 'initial'};
    .account-container{
      color: ${props => props.theme.colors.buttonControlColor};
    }
    
${props => {
    if (props.validpayment) {
      return `box-shadow: 2px 3px 10px 0px rgba(0, 0, 0, .30);
        -webkit-box-shadow: 2px 3px 10px 0px rgba(0, 0, 0, .30);
        -moz-box-shadow: 2px 3px 10px 0px rgba(0, 0, 0, .30);`;
    }
  }};
`;

const DetailContainer = styled(Flex)`
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  flex: 0.7;
`;

const BoxContainer = styled(Flex)`
  justify-content: center;
  align-items: center;
  flex: 0.3;
`;

const TextContainer = styled(Text)`
  font-size: 14px;
  font-weight: bold;
  text-align: left;
  ::first-letter {
    text-transform: uppercase;
  }
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const InstructionText = styled(Text)`
  font-size: 14px;
  font-weight: 500;
  text-align: left;
  margin-top: 4px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const GATextContainer = styled(Text)`
  font-size: 14px;
  font-weight: 500;
  text-align: left;
  margin-top: 4px;
`;

const AccountContainer = styled(Flex)`
  flex-direction: row;
  width: 100%;
  justify-content: center;
  align-items: center;
  margin-bottom: ${props => {
    if (props.amountcharged || props.showLoading) return '4px';
    return '0px';
  }};
  height: 40px;
`;
const AmountContainer = styled(Flex)`
  width: 100%;
  justify-content: center;
  align-items: center;
  background: ${props => props.theme.colors.buttonControlColor};
  color: ${props => props.theme.colors.buttonTextColor};
  height: 30px;
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const LoadingContainer = styled(Flex)`
  width: 100%;
  justify-content: center;
  align-items: center;
  background: ${props => props.theme.colors.buttonControlColor};
  color: ${props => props.theme.colors.buttonTextColor};
  height: 30px;
`;

const AtriumContainer = styled(Flex)`
  width: 100%;
  justify-content: space-between;
  align-items: center;
  padding-right: 5px;
`;

const RightText = styled(Text)`
  color: ${props => props.theme.colors.primaryTextColor};
  max-width: 40%;
  line-height: 1em;
  white-space: normal;
  overflow-wrap: break-word;
`;

const cardLogoStyle = {
  width: '40px',
  height: '40px',
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  maxHeight: '40px'
};

const fontStyle = {
  fontSize: '40px'
};

class PaymentCard extends Component {
  constructor (props) {
    super(props);
    this.state = {
      hover: false,
      newImage: ''
    };
    this.handleOption = this.handleOption.bind(this);
    this.filterPaymentTypes = this.filterPaymentTypes.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.setAriaLabel = this.setAriaLabel.bind(this);
  }

  handleOption (selectedTile, paymentObj) {
    !this.props.isPaymentProcess && this.props.onSelectOptionList(selectedTile, paymentObj);
  }

  handleKeyDown (event, selectedTile, paymentObj) {
    // TODO: make this usable by all clickable elements,
    //  pass in caller's onclickhandler (13 is keycode for enter key, 32 is spacebar)
    if (event.which === 13 || event.which === 32) {
      this.handleOption(selectedTile, paymentObj);
    }
  }

  paymentFont (type) {
    if (type === 'rGuestIframe' || type === 'savedCard' || type === 'ccCard') {
      return 'credit_card';
    } else if (type === 'genericAuthorization') {
      return 'account_box';
    } else if (type === 'roomCharge') {
      return 'room_service';
    } else if (type === 'memberCharge') {
      return 'card_membership';
    } else if (type.includes('loyalty')) {
      return 'LoyaltyAccrual';
    }
  }

  returnLoyaltyDetails (loyaltyAccount) {
    const accountNumberLast4 = loyaltyAccount.primaryAccountId && loyaltyAccount.primaryAccountId.substring(loyaltyAccount.primaryAccountId.length - 4);
    // TODO: pull Casino loyalty name from configuration
    const paymentOptionName = `Casino Loyalty ${accountNumberLast4 && '...' + accountNumberLast4}`;

    return (
      <React.Fragment>
        <TextContainer
          className='text-container'
          data-color={(this.state.hover && loyaltyAccount.valid) ||
            (this.props.selectedOptionId === loyaltyAccount.type && loyaltyAccount.valid)}
        >
          {paymentOptionName}
        </TextContainer>
        <GATextContainer
          className='text-container'
          data-color={(this.state.hover && loyaltyAccount.valid) ||
            (this.props.selectedOptionId === loyaltyAccount.type && loyaltyAccount.valid)}
        >
          {loyaltyAccount.displayLabel}
        </GATextContainer>
      </React.Fragment>
    );
  }
  setAriaLabel (keyProps) {
    if (keyProps.type === 'loyaltyHostCompVoucher' || keyProps.type === 'loyaltyPoints' || keyProps.type === 'loyaltyVoucher') {
      const accountNumberLast4 = (keyProps.type === 'loyaltyHostCompVoucher' || keyProps.type === 'loyaltyPoints' || keyProps.type === 'loyaltyVoucher') ? keyProps.primaryAccountId && keyProps.primaryAccountId.substring(keyProps.primaryAccountId.length - 4) : '';
      // TODO: pull Casino loyalty name from configuration
      const paymentOptionName = `Casino Loyalty ${accountNumberLast4 && '...' + accountNumberLast4}`;
      return `${paymentOptionName} ${keyProps.displayLabel}`;
    } else if (keyProps.type === 'gaAccount') {
      return `${i18n.t('GA_ACCOUNT_LABEL')}  ${keyProps.primaryAccountId !== undefined ? keyProps.primaryAccountId : ''}${keyProps.displayLabel}`;
    } else {
      return keyProps.displayLabel;
    }
  }

  returnAtriumDetails (atriumAccount) {

    return (
      <AtriumContainer>
        <Flex flexDirection='column' style={{overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis'}}>
          <TextContainer
            style={{overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis'}}
            className='text-container'
          >
            { atriumAccount.displayLabel }
          </TextContainer>
          {atriumAccount.instructionText && <InstructionText
            className='instruction-text'
          >
            {atriumAccount.instructionText}
          </InstructionText>
          }
        </Flex>
        {!atriumAccount.isAutoDetect &&
          atriumAccount.authResponse
          ? <RightText>
            {atriumAccount.limitOnAccount ? atriumAccount.authResponse.paymentData.paymentResponse.transactionData.atriumPaymentResponse.amount.remaining
              : currencyLocaleFormat(atriumAccount.authResponse.paymentData.paymentResponse.transactionData.atriumPaymentResponse.amount.remaining)}
          </RightText>
          : (atriumAccount.amount && atriumAccount.amount.remaining) && <RightText>
            {atriumAccount.limitOnAccount ? atriumAccount.amount.remaining : currencyLocaleFormat(atriumAccount.amount.remaining)}
          </RightText>}
      </AtriumContainer>
    );
  }

  filterPaymentTypes () {
    const { keyProps } = this.props;

    return keyProps.type !== 'gaAccount' && keyProps.type !== 'loyaltyHostCompVoucher' &&
      keyProps.type !== 'loyaltyPoints' && keyProps.type !== 'loyaltyVoucher' && keyProps.type !== 'atrium';
  }

  render () {
    const { keyProps, currencyDetails } = this.props;
    const { classContext } = this.props;
    const image = keyProps.type === 'genericAuthorization' || keyProps.type === 'gaAccount' ? keyProps.tenderTypeImage : keyProps.image;
    const amountToBeCharged = keyProps.amountToBeCharged && currencyLocaleFormat(keyProps.amountToBeCharged, currencyDetails);
    const ariaLabel = this.setAriaLabel(keyProps);

    return (
      <ThemeProvider className='card' theme={theme}>
        <Container
          className={`click-cont container ${classContext}`}
          alignItems='center'
          flexWrap='nowrap'
          amountcharged={keyProps.amountToBeCharged}
          validpayment={keyProps.valid ? 1 : 0}
          selectedoption={this.props.selectedOptionId}
          currentoption={keyProps.type}
          onClick={() => { keyProps.valid && this.handleOption(keyProps.type, keyProps); }}
          onKeyDown={(e) => { keyProps.valid && this.handleKeyDown(e, keyProps.type, keyProps); }}
          onMouseEnter={() => this.setState({ hover: true })}
          onMouseLeave={() => this.setState({ hover: false })}
          showLoading={this.props.showLoading}
          role='button'
          aria-label={ariaLabel}
          tabIndex={0}
        >
          <AccountContainer className='account-container' amountcharged={keyProps.amountToBeCharged}>

            <BoxContainer className='box-container' width={[1]} >
              {image ? <UrlImageLoader
                className='url-container'
                src={config.getPOSImageURL(this.props.contextId, image, this.props.appconfig.tenantID)}
                imageStyle={cardLogoStyle}
                alt='' />
                : <i
                  className={`fa agilysys-icon-${this.paymentFont(keyProps.type)}`}
                  style={keyProps.type.includes('loyalty') ? { fontSize: '32px' } : fontStyle}
                  alt=''
                />}
            </BoxContainer>
            <DetailContainer
              className={`detail-container-${keyProps.type}`}
              flexDirection='column'
              alignItems='flex-start'
              imageflag={image}
              width={[1]}
            >
              {keyProps.type === 'gaAccount' &&
                <React.Fragment>
                  <TextContainer
                    className='text-container'
                    data-color={(this.state.hover && keyProps.valid) ||
                      (this.props.selectedOptionId === keyProps.type && keyProps.valid)}
                  >
                    <Trans i18nKey='GA_ACCOUNT_LABEL' />{keyProps.primaryAccountId}
                  </TextContainer>
                  <GATextContainer
                    className='text-container'
                    data-color={(this.state.hover && keyProps.valid) ||
                      (this.props.selectedOptionId === keyProps.type && keyProps.valid)}
                  >
                    {keyProps.displayLabel}
                  </GATextContainer>
                </React.Fragment>
              }
              {(keyProps.type === 'loyaltyHostCompVoucher' || keyProps.type === 'loyaltyPoints' || keyProps.type === 'loyaltyVoucher') &&
                this.returnLoyaltyDetails(keyProps)
              }
              { (keyProps.type === 'atrium') &&
                this.returnAtriumDetails(keyProps)
              }
              {
                this.filterPaymentTypes() &&
                <TextContainer
                  className='text-container'
                  data-color={(this.state.hover && keyProps.valid) ||
                    (this.props.selectedOptionId === keyProps.type && keyProps.valid)}
                >
                  {keyProps.displayLabel}
                </TextContainer>
              }

            </DetailContainer>
          </AccountContainer>
          {
            keyProps.amountToBeCharged &&
            <AmountContainer className='amount-charged'
              tabIndex={0}
              aria-label={amountToBeCharged}>
              {amountToBeCharged}
            </AmountContainer>
          }
          {
            this.props.showLoading &&
            <LoadingContainer>
              <LoadingComponent
                className='loading-cont'
                color='white'
                containerHeight='100%'
                containerWidth='100%'
                aria-label={i18n.t('PROCESSING_TEXT')}
                height='25px'
                width='25px'
                borderSize={2}
                style={{ justifyContent: 'center', marginBottom: '6px' }}
              />
            </LoadingContainer>
          }
        </Container>
      </ThemeProvider>
    );
  }
}

PaymentCard.propTypes = {
  keyProps: PropTypes.shape({
    image: PropTypes.string,
    displayLabel: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    valid: PropTypes.bool.isRequired
  }).isRequired
};

export default PaymentCard;
