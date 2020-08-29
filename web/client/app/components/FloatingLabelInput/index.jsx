// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import React, { Component } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import theme from 'web/client/theme';
import { Input, Label, Flex, Text } from 'rebass';
import i18n from 'web/client/i18n';
import IconButton from 'web/client/app/components/IconButton';
import { AVOID_ONLY_FIRST_SPACE, FIRST_NAME_PATTERN } from 'web/client/app/utils/constants';

const InputWrapper = styled.div`
  position: relative;
  margin-bottom: 10px;
  min-height: 75px;
  width: auto;
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
`;

const InputText = styled(Input)`
  color: ${props => props.theme.colors.primaryText};
  font-size: 18px;
  left: 0;
  background-color: transparent;
  border: 0;
  border-radius: 0;
  border-bottom: 2px solid #EEE;
  padding: 3px 20px 3px 0px;
  box-shadow: none;
  outline: 0;
  padding-left: ${props => props.prefix ? '4px' : '0px'}
  &:disabled{
    cursor: not-allowed;
  }
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const PrefixCodeText = styled(Flex)`
  font-size: 18px;
  padding-bottom: 3px;
  font-weight: normal;
  color: ${props => props.theme.colors.primaryText};
  display: none;
  border-bottom: 2px solid #EEE;
  display:  ${props => props.length > 0 ? 'block' : 'none'}
  ${InputText}:focus ~ & {
    display: block};
  }
`;

const InputLabel = styled(Label)`
  pointer-events: none;
  color: ${props => props.theme.colors.primaryTextColor};
  ${props => {
    if (props.length > 0) {
      return `transform: translateY(8px) scale(0.85);
      font-weight: bold;
      color: ${props => props.theme.colors.primaryTextColor}};
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
  ${InputText}:focus ~ & {
    transform: translateY(8px) scale(0.85);
    color: ${props => props.theme.colors.primaryText};
    font-weight: bold;
  }
  ${props => {
    if (props.transformLabel) {
      return `transform: translateY(8px) scale(0.85);
      color: ${props => props.theme.colors.primaryText};
      font-weight: bold;`;
    }
  }}

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
  bottom: 28px;
  left: 0px;
  left: ${props => props.prefix ? ((props.prefix.length) * 12) + 'px' : '0px'};
  margin-bottom: 0px;
  ${InputText}:focus ~ & {
    display: ${props => props.length > 0 ? 'none' : 'block'};
  }
  ${props => {
    if (props.transformLabel && props.length > 0) {
      return `display: none`;
    } else {
      return props.transformLabel ? 'display: block;' : 'display: none;';
    }
  }}
`;

const CustomInputParent = styled(Flex)`
  flex-direction: row-reverse;
  align-items: flex-end;
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

class FloatingLabelInput extends Component {

  constructor (props) {
    super(props);
    this.state = {
      transformLabel: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.onClearInput = this.onClearInput.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
  }

  onFocus () {
    this.setState({ transformLabel: true });
  }

  onBlur () {
    this.setState({ transformLabel: false });
  }

  handleChange = event => {
    const { callBack, propertyName, validationRegEx } = this.props;
    const textValue = event.target.value;
    if (validationRegEx && textValue.length > 0) {
      if ((validationRegEx === AVOID_ONLY_FIRST_SPACE || validationRegEx === FIRST_NAME_PATTERN) && textValue.length > 30) { // eslint-disable-line max-len
        return;
      }
      const regExp = new RegExp(validationRegEx);
      if (!regExp.test(textValue)) {
        return;
      }
    }
    callBack && callBack(propertyName, textValue);
  }

  onClearInput () {
    const { callBack, propertyName } = this.props;
    callBack && callBack(propertyName, '');
  }

  render () {
    const { label, ariaLabel, ariaInvalid, tabIndex, placeHolder, value, error, inputType,
      clearIcon, pattern, disabled, className, prefix } = this.props;
    return (
      <ThemeProvider theme={theme}>
        <InputWrapper className='input-field-wrapper'>
          <InputParent className='input-field-parent'>
            <CustomInputParent className='text-div' id='parent'>
              <InputText className={className ? `input-text ${className}` : 'input-text'} onChange={this.handleChange}
                value={value} type={inputType || 'text'}
                aria-label={ariaLabel}
                aria-invalid={ariaInvalid}
                tabIndex={tabIndex}
                pattern={pattern || ''}
                disabled={disabled}
                prefix={prefix}
                prefixWidth={this.prefix && this.prefix.offsetWidth}
                onFocus={this.onFocus}
                onBlur={this.onBlur}
              />
              {prefix && <PrefixCodeText length={value.length}>{prefix}</PrefixCodeText>}
            </CustomInputParent>
            <InputLabel
              className='input-field-label'
              length={value.length}
              prefix={prefix}
              transformLabel={this.state.transformLabel}>
              {label}
            </InputLabel>
            {placeHolder &&
              <InputPlaceholder
                className='input-placeholder'
                prefix={prefix}
                transformLabel={this.state.transformLabel}
                length={value.length}>
                {placeHolder}
              </InputPlaceholder>
            }
            {clearIcon &&
              <CloseButton children='&#10005;'
                tabIndex={0} aria-label={i18n.t('CLEAR_VALUE')} role='button'
                onClick={!disabled ? this.onClearInput : undefined}
                className='clear-value'
                disabled={value && value.length > 0 ? 0 : -1}
              />}
          </InputParent>
          <ErrorMessage tabIndex={error && error ? 0 : -1}
            aria-live='polite' className='input-field-error'>{error && error}</ErrorMessage>
        </InputWrapper>
      </ThemeProvider>
    );
  }
}

export default FloatingLabelInput;
