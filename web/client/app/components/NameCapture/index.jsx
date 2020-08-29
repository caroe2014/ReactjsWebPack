// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import React, { Component } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import theme from 'web/client/theme';
import { Text, Flex, Button } from 'rebass';
import FloatingLabelInput from 'web/client/app/components/FloatingLabelInput';
import { AVOID_ONLY_FIRST_SPACE, FIRST_NAME_PATTERN, LAST_INITIAL_PATTERN } from 'web/client/app/utils/constants';
import { Trans } from 'react-i18next';
import i18n from 'web/client/i18n';

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
  word-break: break-word;
  background: ${props => props.theme.colors.light};
  padding: 20px;
  ${props => props.theme.mediaBreakpoints.desktop`border: 1px solid lightgrey; margin-bottom: 20px`};
  ${props => props.theme.mediaBreakpoints.tablet`border: 1px solid lightgrey;`};
  ${props => props.theme.mediaBreakpoints.mobile`border: none; margin-top: 0px; padding: 20px 0px`};
`;

const InputContainer = styled(Flex)`
  flex-direction: column;
  border-bottom: none;
  border-top: none;
  padding-top: 20px;
  width: 100%;
  align-self: center;
  margin-top: 20px;
`;

const HeaderLabel = styled(Text)`
  color: ${props => props.theme.colors.primaryTextColor};
  font-size: ${props => props.theme.fontSize.md};
  font-weight: 500;
  max-width: 360px;
  justify-content: left;
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

const ButtonParent = styled(Flex)`
  flex-direction: column;
  min-height: 60px;
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

const SkipButton = styled(Button)`
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

const InputHeader = styled(Text)`
  color: ${props => props.theme.colors.primaryTextColor};
  font-size: ${props => props.theme.fontSize.nm};
  margin-bottom: 10px;
  text-align: center;
`;

class NameCapture extends Component {

  constructor (props) {
    super(props);
    this.firstNameProperty = 'firstName';
    this.lastInitialProperty = 'lastInitial';
    this.state = {firstNameError: '',
      lastInitialError: '',
      firstName: this.props.firstName || '',
      lastInitial: this.props.lastInitial || ''};
    this.skipNameCapture = this.skipNameCapture.bind(this);
    this.continuePay = this.continuePay.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount () {
    window.scrollTo(0, 0);
  }

  handleChange (propertyName, inputValue) {
    let errorData = {};
    if (propertyName === this.firstNameProperty) {
      errorData.firstNameError = inputValue ? '' : this.state.firstNameError;
    } else if (propertyName === this.lastInitialProperty) {
      errorData.lastInitialError = inputValue ? '' : this.state.lastInitialError;
    }
    this.setState({[propertyName]: inputValue, ...errorData});
  }

  continuePay () {
    const { firstName, lastInitial } = this.state;
    const { onContinuePay, getAliasName } = this.props;
    this.setState({
      firstNameError: firstName.length === 0 ? i18n.t(getAliasName ? 'ALIAS_NAME_ERROR' : 'FIRST_NAME_ERROR') : '',
      lastInitialError: (!getAliasName && lastInitial.length === 0) ? i18n.t('LAST_INITIAL_ERROR') : ''});
    if (firstName.length === 0 || (!getAliasName && lastInitial.length === 0)) {
      return;
    }
    onContinuePay(this.state.firstName, this.state.lastInitial);
  }

  skipNameCapture () {
    const { onContinuePay } = this.props;
    this.setState({firstNameError: '',
      lastInitialError: ''});
    onContinuePay('', '');
  }

  render () {
    const { isNameCaptureRequired, nameInstructionText, isSmsEnabled, deliveryEnabled, getAliasName } = this.props;
    const { firstNameError, lastInitialError, firstName, lastInitial } = this.state;
    return (
      <ThemeProvider theme={theme}>
        <Container className='name-capture-container'>
          <ChildBox className='child-box'>
            <HeaderLabel
              aria-label={nameInstructionText || i18n.t(getAliasName
                ? 'ALIAS_NAME_CAPTURE_INSTN' : 'NAME_CAPTURE_INSTN')}
              tabIndex={0}
              role='form' className='instruction-text'>
              {nameInstructionText || <Trans i18nKey={getAliasName
                ? 'ALIAS_NAME_CAPTURE_INSTN' : 'NAME_CAPTURE_INSTN'}/>}
            </HeaderLabel>
            <InputContainer>
              {(isNameCaptureRequired || getAliasName) &&
                <InputHeader tabIndex={0} aria-label={i18n.t('DELIVERY_LOCATION_INPUT_HEADER')}>
                  <Trans i18nKey='DELIVERY_LOCATION_INPUT_HEADER'/></InputHeader>
              }
              <FloatingLabelInput
                ariaLabel={i18n.t(getAliasName ? 'ALIAS_NAME_LABEL' : 'FIRST_NAME_LABEL')}
                tabIndex={0}
                propertyName={this.firstNameProperty}
                label={<Trans i18nKey={getAliasName ? 'ALIAS_NAME_LABEL' : 'FIRST_NAME_LABEL'}/>}
                value={firstName}
                error={firstNameError}
                callBack={this.handleChange}
                clearIcon
                validationRegEx={getAliasName ? AVOID_ONLY_FIRST_SPACE : FIRST_NAME_PATTERN}
                placeHolder={<Trans i18nKey={getAliasName ? 'ALIAS_NAME_LABEL' : 'FIRST_NAME_LABEL'}/>}/>
              {!getAliasName &&
              <FloatingLabelInput
                ariaLabel={i18n.t('LAST_INITIAL_LABEL')}
                tabIndex={0}
                className='lastInitial'
                propertyName={this.lastInitialProperty}
                label={<Trans i18nKey='LAST_INITIAL_LABEL'/>}
                value={lastInitial}
                error={lastInitialError}
                callBack={this.handleChange}
                clearIcon
                validationRegEx={LAST_INITIAL_PATTERN}
                placeHolder={<Trans i18nKey='LAST_INITIAL_LABEL'/>}/>
              }
              <ButtonParent>
                <PayButton
                  aria-label={isSmsEnabled || deliveryEnabled ? i18n.t('NEXT_LABEL')
                    : i18n.t('DELIVERY_LOCATION_CONTINUE_PAY')}
                  tabIndex={0}
                  className='nextBtn'
                  children={isSmsEnabled || deliveryEnabled ? <Trans i18nKey='NEXT_LABEL'/>
                    : <Trans i18nKey='DELIVERY_LOCATION_CONTINUE_PAY'/>}
                  onClick={this.continuePay}/>
                {!getAliasName && !isNameCaptureRequired && <SkipButton
                  aria-label={i18n.t('SKIP_LABEL')}
                  tabIndex={0}
                  className='skip-btn'
                  children={<Trans i18nKey='SKIP_LABEL'/>}
                  onClick={this.skipNameCapture}/>}
              </ButtonParent>
            </InputContainer>
          </ChildBox>
        </Container>
      </ThemeProvider>
    );
  }
}

export default NameCapture;
