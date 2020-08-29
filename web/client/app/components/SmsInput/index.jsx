// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import React, { Component } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import theme from 'web/client/theme';
import { Flex, Text } from 'rebass';
import FloatingLabelInput from 'web/client/app/components/FloatingLabelInput';
import { PHONE_NUMBER_PATTERN_INTL } from 'web/client/app/utils/constants';
import { Trans } from 'react-i18next';
import i18n from 'web/client/i18n';
import { PhoneNumberUtil, PhoneNumber, AsYouTypeFormatter, PhoneNumberFormat } from 'google-libphonenumber';
import ReactSelect, { components } from 'react-select';
import { countries } from 'country-data';

const InputContainer = styled(Flex)`
  flex-direction: column;
  border-bottom: none;
  border-top: none;
  padding-top: 20px;
  width: 100%;
  align-self: center;
  margin-top: 20px;
  .input-field-wrapper {
    width: 100%;
  }
`;

const NumberContainer = styled(Flex)`
  flex-direction: row;
  width: 100%;
  align-self: center;
`;

const CountryButton = styled(Flex)`
  margin-right: 24px;
  flex-direction: column;
  height: 53px;
  justify-content: flex-start;
  align-items: center;
  width: 50px;
  outline: none;
`;

const CountryText = styled(Text)`
  font-weight: bold;
  transform: translateY(7px) scale(0.85);
  color: ${props => props.theme.colors.primaryTextColor}};
  font-size: 16px;
  margin-bottom:8px;
`;

const FlagContainer = styled(Flex)`
  width: 24px;
  height: 20px;
  flex: 0.1;
`;

const BorderDiv = styled(Flex)`
  border-bottom: 2px solid #EEE;
  height: 2px;
  width: 100%;
  margin-top: 0px;
`;

const DropDown = styled(ReactSelect)`
.react-select__menu {
  z-index: 1000;
  display: block;
}
.Select-menu-outer {
  z-index: 1000;
  position:relative;
}
.Select.is-open {
  z-index: 1000 !important;
}
.react-select__indicator-separator{
  display: none;
}
.react-select__control, .react-select__control--is-focused{
  border: none !important;
  box-shadow: none;
  width: 80px;
  padding: 0px 0px 0px 16px;
  min-height: 20px;
}
.react-select__value-container{
  padding: 6px 8px;
}
.react-select__value-container, .react-select__value-container--has-value{
  padding: 0px 8px;
}
.react-select__value-container input {
  left: 0px;
}
.react-select__control--is-disabled {
  background: #ffffff;
}
.react-select__menu-list {
    max-height: ${props => {
    if (props.receiptSms) return `130px`;
    return '350px';
  }};
${props => props.theme.mediaBreakpoints.mobile`max-height: 350px;`};
  }
`;

const FlagButton = styled(Flex)`
  flex-direction: row;
`;

const FlagOption = styled(Flex)`
  flex-direction: row;
`;

const ErrorText = styled(Flex)`
  color: #cc0000;
  height: auto;
  font-size: 14px;
  min-height: 1.2em;
  padding-left: 3px;
`;

const ErrorDiv = styled(Flex)`
  margin: -24px 0px 0px 0px;
  min-height: 28px;
`;

const CaretDownIcon = (props) => {
  return <i
    style={{ marginTop: '-8px', color: props.options === 1 && '#ffffff' }}
    className='fa fa-caret-down'
  />;
};

const ScheduleTypeOption = props => {
  return (
    <components.Option {...props}>
      {renderCustomComponent(props)}
    </components.Option>
  );
};

const ScheduleTypeSingleValue = ({ children, ...props }) => {
  return (
    <components.SingleValue {...props}>
      <FlagContainer
        className={`img-thumbnail flag flag-icon-background flag-icon-${props.data && props.data.value &&
          props.data.value.toLowerCase()}`}
      />
    </components.SingleValue>
  );
};

const renderCustomComponent = (props) => {
  return (
    <React.Fragment>
      <FlagOption>
        <FlagContainer
          className={`img-thumbnail flag flag-icon-background flag-icon-${props.data.value.toLowerCase()}`}
        />
        <span style={{flex: '0.8', marginLeft: '8px'}}>
          {props.data.label} ({props.data.value})
        </span>
        <span style={{flex: '0.1'}}>
        +{props.data.phoneCode}
        </span>
      </FlagOption>
    </React.Fragment>
  );
};

const DropdownIndicator = props => {
  return (
    <components.DropdownIndicator {...props}>
      <CaretDownIcon options={props.options && props.options.length}/>
    </components.DropdownIndicator>
  );
};

const customStyles = {
  menu: styles => ({ ...styles,
    width: window.document.getElementById('numberContainer') &&
      window.document.getElementById('numberContainer').offsetWidth + 'px',
    marginLeft: '12px',
    marginTop: '0px'
  })
};

class SmsInput extends Component {

  constructor (props) {
    super(props);
    const formatNumber = (this.props.mobileNumber && this.props.selectedCountry
      ? this.getNewFormatValue(this.props.mobileNumber.substr(this.props.selectedCountry.phoneCode.length + 1),
        this.props.selectedCountry.value
      ) : this.props.receiptSms && this.props.loyaltyNumber) || '';
    const defaultCountryRegion = this.props.regionCode ||
      Object.keys(countries).find(key => countries[key].countryCallingCodes &&
        countries[key].countryCallingCodes.indexOf(`+${this.props.countryCode}`) >= 0);
    const countryList = this.getCountryList(this.props.countryCodeList, this.props.countryCode, defaultCountryRegion);
    this.state = {error: '',
      mobileNumber: formatNumber.replace(/\D/g, ''),
      isValidNumber: !!formatNumber,
      formatNumber,
      countryList,
      selectedCountry: this.props.selectedCountry ||
        countryList.find(country => country.value === defaultCountryRegion) || ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.isValidNumber = this.isValidNumber.bind(this);
    this.onCountryChange = this.onCountryChange.bind(this);
  }

  init () {
    this.phoneNumberUtil = new PhoneNumberUtil();
    this.phoneNumber = new PhoneNumber();
    this.phoneNumber.setCountryCode(Number(this.state.selectedCountry && this.state.selectedCountry.phoneCode));
    this.phoneNumber.setNationalNumber(Number(this.state.mobileNumber));
  }

  componentDidMount () {
    window.scrollTo(0, 0);
  }

  componentWillMount () {
    this.init();
    this.updatePhoneNumber();
  }

  componentDidUpdate (prevProps) {
    if (prevProps.mobileNumber !== this.props.mobileNumber || prevProps.loyaltyNumber !== this.props.loyaltyNumber) {
    }
  }

  updatePhoneNumber () {
    const { mobileNumber, countryCode, selectedCountry, loyaltyNumber } = this.props;
    const smsNotificationNumber = (mobileNumber && countryCode && selectedCountry
      ? this.getNewFormatValue(
        mobileNumber.substr(selectedCountry.phoneCode.length + 1),
        selectedCountry.value)
      : (loyaltyNumber && this.state.selectedCountry &&
        this.getNewFormatValue(loyaltyNumber, this.state.selectedCountry.value))) || '';
    this.setState({formatNumber: smsNotificationNumber, mobile: smsNotificationNumber.replace(/-/g, '')});
  }

  handleChange (propertyName, inputValue) {
    const { selectedCountry } = this.state;
    if (inputValue.replace(/\D/g, '') === '00') {
      return;
    }
    const formatNumber = this.getFormatValue(inputValue);
    this.setState({
      mobileNumber: formatNumber.replace(/[- )(]/g, ''),
      formatNumber,
      error: !inputValue ? '' : this.state.error
    });
    this.phoneNumber.setNationalNumber(Number(formatNumber.replace(/[- )(]/g, '')));
    const isValidNumber = this.phoneNumberUtil.isValidNumber(this.phoneNumber);
    const updatedNumber = this.phoneNumberUtil.format(this.phoneNumber, PhoneNumberFormat.E164);
    this.props.updateSmsInfo(formatNumber, isValidNumber, selectedCountry, updatedNumber);
  }

  isValidNumber () {
    const { mobileNumber } = this.state;
    if (!mobileNumber) {
      return false;
    }
    this.phoneNumber.setNationalNumber(Number(mobileNumber));
    const isValidNumber = this.phoneNumberUtil.isValidNumber(this.phoneNumber);
    return isValidNumber;
  }

  getFormatValue (inputValue) {
    const { selectedCountry } = this.state;
    const formatNumber = inputValue.replace(/\D/g, '');
    const formatter = new AsYouTypeFormatter(selectedCountry.value);
    let finalOutput = '';
    for (var i = 0; i < formatNumber.length; i++) {
      finalOutput = formatter.inputDigit(formatNumber.charAt(i));
    }
    return finalOutput;
  }

  getCountryList (countryCodeList, defaultCountryCode, defaultRegionCode) {
    let optionsList = [];
    if (countryCodeList && countryCodeList.length > 0) {
      countryCodeList.forEach(country => {
        optionsList.push({
          value: country.regionCode,
          label: country.name,
          phoneCode: country.countryCode
        });
      });
    } else {
      optionsList.push({
        value: defaultRegionCode,
        label: countries && defaultRegionCode && countries[defaultRegionCode] && countries[defaultRegionCode].name,
        phoneCode: defaultCountryCode
      });
    }
    return optionsList;
  }

  onCountryChange (selectedOption) {
    if (selectedOption === this.state.selectedCountry) {
      return;
    }
    this.setState({ selectedCountry: selectedOption });
    const mobileNumber = this.state.mobileNumber;
    this.phoneNumber.setCountryCode(Number(selectedOption.phoneCode));
    if (mobileNumber) {
      const formatNumber = this.getNewFormatValue(this.state.mobileNumber, selectedOption.value);
      this.setState({
        mobileNumber: formatNumber.replace(/[- )(]/g, ''),
        formatNumber
      });
      this.phoneNumber.setNationalNumber(Number(formatNumber.replace(/[- )(]/g, '')));
      const isValidNumber = this.phoneNumberUtil.isValidNumber(this.phoneNumber);
      const updatedNumber = this.phoneNumberUtil.format(this.phoneNumber, PhoneNumberFormat.E164);
      this.props.updateSmsInfo(formatNumber, isValidNumber, selectedOption, updatedNumber);
    }
  }

  getNewFormatValue (inputValue, countryCode) {
    const formatNumber = inputValue.replace(/\D/g, '');
    const formatter = new AsYouTypeFormatter(countryCode);
    let finalOutput = '';
    for (var i = 0; i < formatNumber.length; i++) {
      finalOutput = formatter.inputDigit(formatNumber.charAt(i));
    }
    return finalOutput;
  }

  render () {
    const { countryList, error, formatNumber, selectedCountry, mobileNumber } = this.state;
    const { label, placeHolder, errorText } = this.props;
    return (
      <ThemeProvider theme={theme}>
        <InputContainer>
          <NumberContainer
            className='number-container'
            id='numberContainer'
            innerRef={(e) => { this.numberContainer = e; }}>
            <CountryButton className='country-div'
              aria-label={countryList && countryList.length === 1 && selectedCountry &&
                    `Country ${selectedCountry.label} `}
              tabIndex={countryList && countryList.length === 1 && 0}
            >
              <CountryText className='country-text'><Trans i18nKey='SMS_COUNTRY_TEXT'/></CountryText>
              <FlagButton className='flag-button' role='listbox'>
                <DropDown
                  className='type-select'
                  classNamePrefix='react-select'
                  menuPortalTarget={document.getElementById('sms-child')}
                  defaultValue={selectedCountry}
                  select={selectedCountry}
                  onChange={this.onCountryChange}
                  label='Single select'
                  isSearchable={false}
                  autosize
                  receiptSms
                  aria-selected={selectedCountry}
                  aria-label={selectedCountry && selectedCountry.label}
                  options={countryList}
                  isDisabled={countryList && countryList.length === 1}
                  components={{ DropdownIndicator,
                    Option: ScheduleTypeOption,
                    SingleValue: ScheduleTypeSingleValue }}
                  styles={customStyles}
                />
              </FlagButton>
              <BorderDiv/>
            </CountryButton>
            <FloatingLabelInput
              ariaLabel={`${i18n.t(label)} +${selectedCountry.phoneCode}`}
              ariaInvalid={!this.isValidNumber()}
              tabIndex={0}
              propertyName={<Trans i18nKey={label}/>}
              label={<Trans i18nKey={label}/>}
              value={formatNumber}
              error={error}
              callBack={this.handleChange}
              clearIcon
              inputType={'tel'}
              pattern={PHONE_NUMBER_PATTERN_INTL}
              prefix={`+${selectedCountry.phoneCode}`}
              placeHolder={<Trans i18nKey={placeHolder}/>}/>
          </NumberContainer>

          <ErrorDiv className='sms-error-div'>
            { mobileNumber && mobileNumber.length > 0 && !this.isValidNumber() &&
            <ErrorText className='sms-error-text' tabIndex={0} aria-label={i18n.t(errorText)}>
              {i18n.t(errorText)}
            </ErrorText>
            }
          </ErrorDiv>

        </InputContainer>
      </ThemeProvider>
    );
  }
}

export default SmsInput;
