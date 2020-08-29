import React from 'react';
import styled from 'styled-components';
import { Modal as ModalWindow, Flex, Fixed, Heading, Text, Input } from 'rebass';
import PrimaryButton from 'web/client/app/components/PrimaryButton';
import SecondaryButton from 'web/client/app/components/SecondaryButton';
import IconButton from 'web/client/app/components/IconButton';

export const ModalContainer = styled(ModalWindow)`
  border-radius: 4px;
  z-index: 1100;
  width: 420px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  ${props => props.theme.mediaBreakpoints.mobile`
    width: 100%;
    height: 100%;
    border-radius: 0px;
  `};
`;

export const LoadingContainer = styled(Fixed)`
  display:flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  opacity: 1;
  will-change: opacity;
  transition: opacity 225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
`;

export const ModalBackground = styled(Fixed)`
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

export const ModalTitle = styled(Heading)`
  margin: 25px 0 0 0;
  color: ${props => props.theme.colors.primaryTextColor};
  font-size: 30px;
  font-weight: bold;
  text-align: center;
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

export const ModalText = styled(Text)`
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

export const ModalAccountText = styled(ModalText)`
  font-weight: bold;
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

export const ModalTotalText = styled(ModalText)`
  font-weight: bold;
  margin: 20px;
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

export const ModalRemainingText = styled(ModalText)`
  font-weight: bold;
  margin: 20px;
  color: ${props => props.theme.colors.buttonControlColor};
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

export const ModalBody = styled(Flex)`
  flex-direction: column;
  width: 85%;
  margin: 0 auto;
  flex-shrink: 0;
  padding: 15px 15px 0px;
  .styled-floating-label-input {
      cursor: not-allowed;
  }
  .error-text {
    margin-top: 10px;
    color: ${props => props.theme.colors.error};
  }
`;

export const ModalFooter = styled(Flex)`
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

export const MainButton = styled(props => <PrimaryButton {...props} />)`
  border-radius: 4px;
  font-size: 16px;
  margin: 10px auto;
  padding: 15px 0;
  text-align: center;
  font-weight: bold;
  height: 40px;
  line-height: 10px;
  &:disabled {
    cursor: not-allowed;
  }
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

export const CloseButton = styled(props => <IconButton {...props} />)`
  color: #1F1F1F;
  font-size: ${props => props.theme.fontSize.md};
  font-weight: 300;
  position: absolute;
  left: 20px;
  top: 15px;
  opacity: ${props => {
    if (props.disabled) return '0.6 !important';
    return 'pointer';
  }};
  cursor: ${props => {
    if (props.disabled) return 'not-allowed';
    return 'pointer';
  }};
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

export const CancelButton = styled(props => <SecondaryButton {...props} />)`
  border-radius: 4px;
  font-size: 16px;
  margin: 10px auto;
  padding: 15px 0;
  text-align: center;
  font-weight: bold;
  border: none;
  height: 40px;
  line-height: 10px;
  width: auto;
  box-shadow: none !important;
  &:focus {
    outline: none !important;
    box-shadow: none !important;
  }
  opacity: ${props => {
    if (props.disabled) return '0.6 !important';
    return 'pointer';
  }};
  cursor: ${props => {
    if (props.disabled) return 'not-allowed';
    return 'pointer';
  }};
`;

export const ModalErrorText = styled(ModalText)`
  margin: 8px auto;
  color: ${props => props.theme.colors.error};
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

export const CustomAmountInput = styled(Input)`
  padding: 0px;
  height: auto;
  &::placeholder {
    color: #BCBCBC;
    opacity: 1;
  }
  width: 65%;
  width:  ${props => {
    if (props.customamountinput) {
      return `${((props.customamountinput.length + 1 -
        (props.customamountinput.includes('.') ? 1 : 0)) * 16) -
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
`};
  opacity: ${props => {
    if (props.disabled) return '0.6 !important';
    return 'unset';
  }};
  cursor: ${props => {
    if (props.disabled) return 'not-allowed';
    return 'auto';
  }};
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

export const CurrencyText = styled(Text)`
  height: auto;
  font-size: 24px;
  margin-right: 0px;
  margin-left: -4px;
  color: ${props => {
    if (!props.disabled) return `${props.theme.colors.primaryTextColor}`;
    return `darkgrey`;
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

export const InstructionImageContainer = styled(Flex)`
  width: auto;
  max-width: 300px;
  height: auto;
  margin: auto;
  margin-bottom: 50px;
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;
