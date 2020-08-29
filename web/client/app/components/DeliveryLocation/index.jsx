// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import React, { Component } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import theme from 'web/client/theme';
import { Text, Flex, Button } from 'rebass';
import FloatingLabelInput from 'web/client/app/components/FloatingLabelInput';
import FloatingLabelList from 'web/client/app/components/FloatingLabelList';
import { locationSeparator } from 'web/client/app/utils/constants';
import { Trans } from 'react-i18next';
import i18n from 'web/client/i18n';
import TabBar from 'web/client/app/components/TabBar';
import get from 'lodash.get';
import { getDeliveryOptions } from 'web/client/app/utils/LocationUtils';
import moment from 'moment-timezone';

const Container = styled(Flex)`
  align-items: center;
  margin: auto;
  max-width: 600px;
  margin-top: 120px;
  height: fit-content;
  ${props => props.theme.mediaBreakpoints.mobile`
    padding-bottom: 20px; 
    border: none;
    max-width: 100%; 
    background: ${props => props.theme.colors.light};
  `};
  flex-direction: column;
  width: 100%;
  margin-bottom: auto !important;
  .tabbar-parent{
    justify-content: center;
    margin-top: 15px;
  }
`;

const BackgroundContainer = styled.div`
  margin: -50px auto auto auto;
  padding: 20px 20px 0px 20px;
  border-left: 1px solid #efefef;
  border-right: 1px solid #efefef;
  ${props => props.theme.mediaBreakpoints.tablet`
  margin: -120px auto auto auto;
  padding: 0px 20px 0px 20px;
  `}
  ${props => props.theme.mediaBreakpoints.mobile`
    margin: -120px auto auto auto;
    padding: 0px 20px 0px 20px;
    border-left: none;
    border-right: none;
  `}
  max-width: 600px;
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

const ChildBox = styled(Flex)`
  flex-direction: column;
  width: 350px;
  word-break: break-word;
  background: ${props => props.theme.colors.light};
  padding: 20px;
  ${props => props.theme.mediaBreakpoints.desktop`margin-bottom: 20px`};
  ${props => props.theme.mediaBreakpoints.mobile`width: 100%; border: none; margin-top: 0px; padding: 20px 20px`};
  .delivery-header,.instruction-text,.clear-button {
    ${props => props['show-content'] ? `visibility: visible; opacity: 1` : `visibility: hidden; opacity: 0`}
  }
  .input-parent {
    display: ${props => props['show-content'] ? 'flex' : 'none'}
  }
`;

const FullFillContainer = styled(Flex)`
  flex-direction: column;
  width: 100%;
  align-items: center;
  border-bottom: 1px solid #efefef;
`;

const FullFillChildBox = styled(ChildBox)`
  margin-bottom: 0px;
  padding-bottom: 0px;
  width: 100%;
  .store-name{
    margin-top: 0px;
  }
`;

const InputContainer = styled(Flex)`
  flex-direction: column;
  border-bottom: none;
  border-top: none;
  width: 100%;
  align-self: center;
`;

const HeaderLabel = styled(Text)`
  color: ${props => props.theme.colors.primaryTextColor};
  font-size: ${props => props.theme.fontSize.md};
  font-weight: 500;
  text-align: center;
  width: 100%;
  justify-content: center;
  text-align: center;
  ${props => props.theme.mediaBreakpoints.mobile`
    max-width: 100%;
    padding-right: 10px;
  `};
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const InstructionText = styled(Text)`
  color: ${props => props.theme.colors.secondaryTextColor};
  font-size: ${props => props.theme.fontSize.nm};
  width: 100%;
  justify-content: center;
  margin-top: 20px;
  text-align: center;
  ${props => props.theme.mediaBreakpoints.mobile`
    max-width: 100%;
  `};
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const InputHeader = styled(Text)`
  color: ${props => props.theme.colors.textGrey};
  font-size: ${props => props.theme.fontSize.nm};
  justify-content: center;
  margin-bottom: 10px;
  margin-top: 5px;
  font-weight: 300;
  opacity: 0.75;
  text-align: center;
`;

const ButtonParent = styled(Flex)`
  flex-direction: column;
  min-height: 140px;
  ${props => props.theme.mediaBreakpoints.mobile`
    min-height: 140px;
  `}
  margin-top: 10px;
`;

const PayButton = styled(Button)`
  background: ${props => props.theme.colors.buttonControlColor};
  color: ${props => props.theme.colors.buttonTextColor};
  cursor: pointer;
  font-weight: 500;
  font-size: ${props => props.theme.fontSize.md};
  float: right;
  width: 100%;
  height: 60px;
  min-height: 60px;
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

const ClearAllButton = styled(Button)`
  background: ${props => props.theme.colors.light};
  border: 0.5px solid ${props => props.theme.colors.buttonControlColor};
  color: ${props => props.theme.colors.buttonControlColor};
  cursor: pointer;
  font-weight: 500;
  font-size: ${props => props.theme.fontSize.md};
  float: right;
  width: 100%;
  height: 60px;
  min-height: 60px;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.nm};
  &:hover {
    box-shadow: 0px 0px 10px 2px lightgrey;
    -webkit-box-shadow: 0px 0px 10px 2px lightgrey;
    -moz-box-shadow: 0px 0px 10px 2px lightgrey;
  }
  text-align: center;
  margin: 15px auto 0 auto;
  border-radius: 0;
  outline: none;
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const PayAsGuestButton = styled(ClearAllButton)``;

const GuestProfileFeatureContainer = styled(Flex)`
  flex-direction: column;
  border-bottom: none;
  border-top: none;
  width: 100%;
  align-self: center;
`;

const AgreementContainer = styled(GuestProfileFeatureContainer)`
  margin: 10px auto 25px auto;
`;

class DeliveryLocation extends Component {

  constructor (props) {
    super(props);
    this.state = {
      dropdownInputValues: {}
    };
    this.deliveryTabs = getDeliveryOptions(this.props.orderConfig);
    this.clearAll = this.clearAll.bind(this);
    this.continuePay = this.continuePay.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.onTabSelect = this.onTabSelect.bind(this);
    this.renderLocationInput = this.renderLocationInput.bind(this);
  }

  componentWillMount () {
    this.onLocationUpdate(this.props.deliveryDestination, this.props.deliveryDetails);
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.deliveryDestination !== nextProps.deliveryDestination) {
      this.onLocationUpdate(nextProps.deliveryDestination, nextProps.deliveryDetails);
    }
  }

  onLocationUpdate (deliveryDestination, deliveryDetails) {
    const locationFormFields = deliveryDestination ? [...deliveryDestination.deliveryDestinationEntries] : []; // eslint-disable-line max-len
    if (deliveryDestination && deliveryDestination.deliveryDestinationEntries.length > 0) {
      locationFormFields.map((data) => {
        data.value = (!deliveryDetails[data.kitchenText] ? window.sessionStorage.getItem(data.fieldName) : deliveryDetails[data.kitchenText]) || ''; // eslint-disable-line max-len
        data.error = '';
      });
    }
    this.setState({locationFormFields});
  }

  componentDidMount () {
    window.scrollTo(0, 0);
    this.setState({activeTab: this.props.deliveryOption.id || this.deliveryTabs[0].id});
    if (!this.props.deliveryOption.id) {
      this.props.setDeliveryOption(this.deliveryTabs[0]);
    }
  }

  handleChange (propertyName, value) {
    this.setState({ [propertyName]: value });
    const { locationFormFields, dropdownInputValues } = this.state;
    locationFormFields.map(data => {
      if (data.kitchenText === propertyName) {
        if (data.inputType === 'dropdown') {
          data.value = value.value;
          data.error = '';
          dropdownInputValues[data.kitchenText + 'InputValue'] = data.value;
        } else {
          data.value = value;
          data.error = value.length < data.characterMinLength ? data.error : '';
        }
      }
    });
    this.setState({locationFormFields, dropdownInputValues});
  }

  handleInputChange (propertyName, value) {
    const {dropdownInputValues} = this.state;
    dropdownInputValues[propertyName + 'InputValue'] = value;
    this.setState({dropdownInputValues});
  }

  continuePay (shouldOptIn) {
    const { onContinuePay, deliveryDestination, shouldOptInProfile } = this.props;
    const { locationFormFields, activeTab } = this.state;
    shouldOptInProfile(shouldOptIn);
    let kitchenString = '';
    let deliveryDetails = {};
    if (activeTab === 'delivery') {
      let isError = false;
      locationFormFields.map((data, index) => {
        if (!data.inputType || data.inputType === 'string') {
          if (data.characterMinLength !== 0 && data.value.length < data.characterMinLength) {
            data.error = i18n.t('DELIVERY_LOCATION_MINIMUM_ERROR', {minimumLength: data.characterMinLength});
            isError = true;
          } else {
            data.error = '';
            kitchenString += `${data.kitchenText}${locationSeparator[deliveryDestination.valueSeparator]}${data.value}${(index !== locationFormFields.length - 1 ? `${locationSeparator[deliveryDestination.optionSeparator]} ` : '')}`; // eslint-disable-line max-len
            deliveryDetails[data.kitchenText] = data.value;
          }
        } else {
          if (!data.value) {
            data.error = i18n.t('DELIVERY_LOCATION_NO_DROPDOWN_INPUT_ERROR');
            isError = true;
          } else {
            data.error = '';
            kitchenString += `${data.kitchenText}${locationSeparator[deliveryDestination.valueSeparator]}${data.value}${(index !== locationFormFields.length - 1 ? `${locationSeparator[deliveryDestination.optionSeparator]} ` : '')}`; // eslint-disable-line max-len
            deliveryDetails[data.kitchenText] = data.value;
          }
        }
      });
      if (isError) {
        this.setState({locationFormFields});
        return;
      }
    }
    onContinuePay(deliveryDetails, kitchenString);
  }

  clearAll () {
    const { locationFormFields } = this.state;
    locationFormFields.map(data => {
      data.value = '';
      data.error = '';
    });
    this.setState({ locationFormFields: locationFormFields });
    this.props.resetDelivery();
  }

  getReadyTime () {
    const readyTime = get(this.props, 'readyTime.etf')
      ? get(this.props, 'readyTime.etf.minutes')
      : get(this.props, 'readyTime.minutes');
    const minTime = get(this.props, 'readyTime.minTime.minutes');
    const maxTime = get(this.props, 'readyTime.maxTime.minutes');
    let readyText = '_ _ _';
    if (readyTime >= 0) {
      if (readyTime === 0) {
        readyText = i18n.t('CART_LESS_MINUTE');
      } else if (readyTime === 1) {
        readyText = i18n.t('CART_IN_A_MINUTE');
      } else {
        readyText = i18n.t('CART_IN_N_MINUTES', { readyTime: readyTime });
      }
    } else if (minTime >= 0 && maxTime >= 0) {
      if (minTime === 0 && maxTime === 0) {
        readyText = i18n.t('CART_LESS_MINUTE');
      } else if (minTime === maxTime && minTime !== 0) {
        readyText = i18n.t('CART_IN_N_MINUTES', { readyTime: minTime });
      } else if (minTime === 0 && maxTime === 1) {
        readyText = i18n.t('CART_IN_A_MINUTE');
      } else if (minTime === 0 && maxTime > 1) {
        readyText = i18n.t('CART_LESS_THAN_N_MINUTES', { maxTime: maxTime });
      } else {
        readyText = i18n.t('CART_M_TO_N_MINUTES', { minTime: minTime, maxTime: maxTime });
      }
    }
    return readyText;
  }

  onTabSelect (tab) {
    this.setState({activeTab: tab.id});
    this.props.setDeliveryOption(tab);
  }

  renderLocationInput (data) {
    if (data.inputType === 'dropdown') {
      const {dropdownInputValues} = this.state;
      let formattedSelectedOption = data.value ? { label: data.value, value: data.value } : '';
      let formattedInputValue = dropdownInputValues[data.kitchenText + 'InputValue'] || '';
      return (
        <FloatingLabelList
          label={data.fieldName}
          ariaLabel={data.fieldName}
          property={data.kitchenText}
          selectedOption={formattedSelectedOption}
          aria-selected={formattedSelectedOption}
          inputValue={formattedInputValue}
          callBack={this.handleChange}
          inputChange={this.handleInputChange}
          error={data.error}
          clearIcon={data.value}
          tabIndex={0}
          inputList={data.dropdownOptions.map(dropdownOption => {
            return {'value': dropdownOption, 'label': dropdownOption
            }
            ;
          })}
        />
      );
    } else {
      return (
        <FloatingLabelInput
          className='delivery-input-field'
          ariaLabel={data.fieldName}
          key={data.kitchenText}
          propertyName={data.kitchenText}
          label={data.fieldName}
          value={data.value}
          error={data.error}
          clearIcon
          callBack={this.handleChange}
          validationRegEx={data.validationRegEx}
          tabIndex={0}
          placeHolder={<Trans i18nKey={data.characterRestriction}/>}/>
      );
    }

  }

  render () {
    const { locationFormFields, activeTab } = this.state;
    const { deliveryDestination, scheduledTime, scheduledDay, orderConfig, deliveryOption } = this.props;
    const guestProfileEnabled = get(orderConfig, 'platformGuestProfileConfig.enabled');
    const etfEnabled = get(orderConfig, 'etf.etfEnabled');
    const storeName = get(orderConfig, 'storeName');
    const readyTimeText = this.getReadyTime();

    return (
      <ThemeProvider theme={theme}>
        <Container className='delivery-fulfillment'>
          <BackgroundContainer/>
          <FullFillContainer className='fulfill-container'>
            <FullFillChildBox className='fulfill-box'>
              <HeaderLabel className='fullfill-header' tabIndex={0} aria-label={i18n.t('DELIVERY_FULFILLMENT_LABEL')}>
                <Trans i18nKey='DELIVERY_FULFILLMENT_LABEL'/>
              </HeaderLabel>
              {(etfEnabled || scheduledTime) && <React.Fragment>
                <InstructionText className='ready-time' tabIndex={0}>
                  {scheduledTime ? i18n.t('DELIVERY_SCHEDULED_TIME',
                    { time: `${scheduledDay > 0
                      ? moment().add(scheduledDay, 'days').format('dddd, MMMM D') : ''} ${scheduledTime}`,
                    interpolation: { escapeValue: false } })
                    : <React.Fragment>{i18n.t('DELIVERY_READY_TIME')} {readyTimeText}</React.Fragment>}
                </InstructionText>
                <InstructionText className='store-name' tabIndex={0}>
                  {i18n.t('FROM_STORE_NAME', { storeName, interpolation: { escapeValue: false } })}
                </InstructionText>
              </React.Fragment>
              }
              <TabBar selectedTab={deliveryOption.id}
                tabs={this.deliveryTabs}
                tabalign='justify'
                callbackHandler={this.onTabSelect}/>
            </FullFillChildBox>
          </FullFillContainer>
          <ChildBox className='delivery-child-box' show-content={activeTab === 'delivery'}>
            <HeaderLabel className='delivery-header'
              tabIndex={0}
              role='heading'
              aria-label={i18n.t('DELIVERY_LOCATION_LABEL')}>
              <Trans i18nKey='DELIVERY_LOCATION_LABEL'/>
            </HeaderLabel>
            <InstructionText
              role='form'
              tabIndex={0}
              aria-label={deliveryDestination && deliveryDestination.instructionText
                ? deliveryDestination.instructionText : ''}
              className='instruction-text'>
              {deliveryDestination && deliveryDestination.instructionText}
            </InstructionText>
            <InputContainer className='input-parent'>
              <InputHeader className='delivery-input-header'>
                <Trans i18nKey='DELIVERY_LOCATION_INPUT_HEADER'/>
              </InputHeader>
              { locationFormFields.map(this.renderLocationInput) }
            </InputContainer>
            <ButtonParent className='button-parent'>
              {guestProfileEnabled ? <GuestProfileFeatureContainer className='guest-profile-feature-container'>
                <AgreementContainer className='agreement-parent'>
                  <HeaderLabel
                    className='agreement-header'
                    tabIndex={0}
                    aria-label={i18n.t('DELIVERY_LOCATION_PROFILE_AGREEMENT')}>
                    <Trans i18nKey='DELIVERY_LOCATION_PROFILE_AGREEMENT'/>
                  </HeaderLabel>
                  <InstructionText
                    role='form'
                    tabIndex={0}
                    aria-label={i18n.t('DELIVERY_LOCATION_PROFILE_AGREEMENT_INSTRUCTION')}
                    className='agreement-instruction-text'>
                    {i18n.t('DELIVERY_LOCATION_PROFILE_AGREEMENT_INSTRUCTION')}
                  </InstructionText>
                </AgreementContainer>
                <PayButton
                  className='pay-button'
                  tabIndex={0}
                  role='button'
                  aria-label={i18n.t('DELIVERY_LOCATION_PROFILE_OPT_IN')}
                  children={<Trans i18nKey='DELIVERY_LOCATION_PROFILE_OPT_IN'/>}
                  onClick={() => {
                    this.continuePay(true);
                  }}/>
                <PayAsGuestButton
                  className='pay-as-guest-button'
                  tabIndex={0}
                  role='button'
                  aria-label={i18n.t('DELIVERY_LOCATION_PROFILE_OPT_OUT')}
                  children={<Trans i18nKey='DELIVERY_LOCATION_PROFILE_OPT_OUT'/>}
                  onClick={() => {
                    this.continuePay(false);
                  }}/>
              </GuestProfileFeatureContainer>
                : <PayButton
                  className='pay-button'
                  tabIndex={0}
                  role='button'
                  aria-label={i18n.t('DELIVERY_LOCATION_CONTINUE_PAY')}
                  children={<Trans i18nKey='DELIVERY_LOCATION_CONTINUE_PAY'/>}
                  onClick={() => {
                    this.continuePay(false);
                  }}/>}
              <ClearAllButton
                className='clear-button'
                tabIndex={0}
                role='button'
                aria-label={i18n.t('DELIVERY_LOCATION_CLEAR_ALL')}
                children={<Trans i18nKey='DELIVERY_LOCATION_CLEAR_ALL'/>}
                onClick={this.clearAll}/>
            </ButtonParent>
          </ChildBox>
        </Container>
      </ThemeProvider>
    );
  }
}

export default DeliveryLocation;
