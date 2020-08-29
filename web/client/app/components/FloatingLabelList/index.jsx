// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import React, { Component } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import theme from 'web/client/theme';
import { Text, Flex } from 'rebass';
import ReactSelect from 'react-select';
import i18n from 'web/client/i18n';
import IconButton from 'web/client/app/components/IconButton';

const InputWrapper = styled.div`
  position: relative;
  margin-bottom: 10px;
  min-height: 75px;
`;

const InputParent = styled(Flex)`
  flex-direction: column-reverse;
  width: 100%;
  &>input::-ms-clear {
    display: none;
  }
  &>input::-webkit-inner-spin-button, 
  &>input::-webkit-outer-spin-button { 
    -webkit-appearance: none; 
    margin: 0; 
  }
  .type_select input:focus ~ & {
    .input-placeholder {
      display: ${props => props.length > 0 ? 'none' : 'block'};
    }
  }
  .type_select input:focus ~ & {
    .input-field-label{
      transform: translateY(8px) scale(0.85);
      color: ${props => props.theme.colors.primaryText};
      font-weight: bold;
    }
  }
`;

const DropDown = styled(ReactSelect)`
  border-radius: 0;
  border-bottom: 2px solid #EEE;
  box-shadow: none;
  width: 100%;
  background-color: transparent;
  background-size: 0px;
  height: 40px !important;
  color: ${props => props.theme.colors.textGrey};
  left: 0px;
  top: 0px;
  opacity: ${props => props.disabled && '0.25'};
  ${props => props.theme.mediaBreakpoints.mobile`
    width: 100%;
  `};
  .react-select__indicators {
    display: none;
  }
  .react-select__control {
    background-color: transparent;
    border: none;
    box-shadow: none;
  }
  .react-select__single-value{
    padding-top: 10px;
    font-size: 18px;
  }
  .react-select__placeholder {
    display:none
  }
  .react-select__menu {
    margin-top: 4px;
    z-index: 1000;
    display: block;
  }
  .Select-menu-outer {
    z-index: 1000;
    position:relative;
  }
  .react-select__value-container {
    padding: 2px 0px;
  }
  .react-select__input input {
    padding-top: 6px !important;
  }
`;

const InputLabel = styled(Text)`
  pointer-events: none;
  color: ${props => props.theme.colors.primaryTextColor}};
  margin-bottom: -6px;
  padding-left: 1px;
  ${props => {
    if (props.length > 0) {
      return `transform: translateY(8px) scale(0.85);
      font-weight: bold;
      `;
    } else {
      return `transform: translateY(25px) scale(1);
      font-weight: normal;
      `;
    }
  }}
  transform-origin: left top;
  transition: 100ms;
  font-size: 16px;
  .type_select input:focus ~ & {
    transform: translateY(8px) scale(0.85);
    color: ${props => props.theme.colors.primaryText};
    font-weight: bold;
  }
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const InputPlaceholder = styled(Text)`
  pointer-events: none;
  position: absolute;
  color: ${props => props.theme.colors.textGrey};
  opacity: 0.75;
  transform-origin: left top;
  transition: 100ms;
  font-size: 16px;
  display: none;
  bottom: 30px;
  left: 0px;
  margin-bottom: 0px;
`;

const ErrorMessage = styled.p`
  color: ${props => props.theme.colors.validationError};
  height: auto;
  font-size: 14px;
  min-height: 1.2em;
  padding-left: 3px;
  margin: 5px 0px 0px 0px;
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const CloseButton = styled(props => <IconButton {...props} />)`
  &:focus {
    outline: none;
    box-shadow: none;
  }
  display: ${props => props['disabled'] ? 'none' : 'block'};
    bottom: 25px;
    font-size: ${props => props.theme.fontSize.md};
    right:0;
    color: ${props => props.theme.colors.textGrey};
    font-weight: 500;
    position: absolute;
    opacity: ${props => {
    if (props.disabled) return '0.6 !important';
    return 'pointer';
  }};
  cursor: ${props => {
    if (props.disabled) return 'not-allowed';
    return 'pointer';
  }};
`;

class FloatingLabelList extends Component {

  constructor (props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.onClearInput = this.onClearInput.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
  }

  handleChange (selectedOption) {
    const { callBack, property } = this.props;
    callBack && callBack(property, selectedOption);
  }

  onInputChange (value) {
    const { inputChange, property } = this.props;
    inputChange && inputChange(property, value);
  }

  onClearInput () {
    const { callBack, property } = this.props;
    callBack && callBack(property, '');
  }

  render () {
    const { label, ariaLabel, tabIndex, placeHolder, inputList, inputValue, selectedOption,
      error, clearIcon, noOptionsText, disabled, className } = this.props;
    return (
      <ThemeProvider theme={theme}>
        <InputWrapper className='input-field-wrapper'>
          <InputParent className='input-field-parent' length={inputValue.length || (selectedOption ? 1 : 0)}>
            <DropDown
              className={className ? `type-select ${className}` : 'type-select'}
              id='location'
              name='location'
              aria-label={ariaLabel}
              tabIndex={tabIndex}
              classNamePrefix='react-select'
              menuPortalTarget={document.body}
              onChange={this.handleChange}
              value={selectedOption}
              options={inputList}
              isSearchable
              disabled={disabled}
              isDisabled={disabled}
              noOptionsMessage={() => noOptionsText}
              dropdownIndicator={false}
              styles={{ menuPortal: base => ({ ...base, zIndex: 9999, marginTop: '-5px' }) }}
              onInputChange={this.onInputChange}
            />
            <InputLabel
              className='input-field-label' length={inputValue.length || (selectedOption ? 1 : 0)}>
              {label}
            </InputLabel>
            {placeHolder &&
              <InputPlaceholder className='input-placeholder' length={inputValue.length || (selectedOption ? 1 : 0)}>
                {placeHolder}
              </InputPlaceholder>
            }
            {clearIcon &&
              <CloseButton children='&#10005;'
                tabIndex={0} aria-label={i18n.t('CLEAR_VALUE')} role='button'
                onClick={!disabled ? this.onClearInput : undefined}
                className='clear-value'
                disabled={(inputValue && inputValue.length > 0) || selectedOption ? 0 : 1}
              />}
          </InputParent>
          <ErrorMessage tabIndex={error && error ? 0 : -1} aria-label={error}
            aria-live='polite' className='input-field-error'>{error && error}</ErrorMessage>
        </InputWrapper>
      </ThemeProvider>
    );
  }
}

export default FloatingLabelList;
