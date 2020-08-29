// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import React from 'react';
import styled from 'styled-components';
import i18n from 'web/client/i18n';

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
`;
const Loading = styled.div`
  color: official;
  display: inline-block;
  position: relative;
  width: 4em;
  height: 4em;

  & > div {
    ${props => props['bar-style']}
    animation: lds-spinner 1.2s linear infinite;
    @keyframes lds-spinner {
      0% {
        opacity: 1;
      }
      100% {
        opacity: 0;
      }
    }
  }

  & > div:after {
    content: " ";
    display: block;
    position: absolute;
    ${props => props['content-style']}
  }


  & > div:nth-child(1) {
    transform: rotate(0deg);
    animation-delay: -1.1s;
  }
  & > div:nth-child(2) {
    transform: rotate(30deg);
    animation-delay: -1s;
  }
  & > div:nth-child(3) {
    transform: rotate(60deg);
    animation-delay: -0.9s;
  }
  & > div:nth-child(4) {
    transform: rotate(90deg);
    animation-delay: -0.8s;
  }
  & > div:nth-child(5) {
    transform: rotate(120deg);
    animation-delay: -0.7s;
  }
  & > div:nth-child(6) {
    transform: rotate(150deg);
    animation-delay: -0.6s;
  }
  & > div:nth-child(7) {
    transform: rotate(180deg);
    animation-delay: -0.5s;
  }
  & > div:nth-child(8) {
    transform: rotate(210deg);
    animation-delay: -0.4s;
  }
  & > div:nth-child(9) {
    transform: rotate(240deg);
    animation-delay: -0.3s;
  }
  & > div:nth-child(10) {
    transform: rotate(270deg);
    animation-delay: -0.2s;
  }
  & > div:nth-child(11) {
    transform: rotate(300deg);
    animation-delay: -0.1s;
  }
  & > div:nth-child(12) {
    transform: rotate(330deg);
    animation-delay: 0s;
  }
  @keyframes lds-spinner {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
`;

const contentStyle = {
  top: '3px',
  left: '29px',
  width: '3px',
  height: '14px',
  borderRadius: '20%',
  background: '#000000'};

const barStyle = {
  transformOrigin: '32px 32px'
};

export default (props) => <LoadingContainer style={props.style}>
  <Loading {...props} style={props.containerStyle}
    content-style={props.contentStyle || contentStyle}
    bar-style={props.barStyle || barStyle}
  >
    <div
      aria-live='polite'
      aria-label={i18n.t('LOADING_TEXT')} tabIndex={0} />
    <div /><div /><div /><div /><div /><div /><div /><div /><div /><div /><div />
  </Loading>
</LoadingContainer>;
