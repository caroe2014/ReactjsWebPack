// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import React from 'react';
import styled from 'styled-components';

const Loading = styled.div`
  display: flex;
  position: relative;
  width: ${props => `${props.containerWidth ? props.containerWidth : '7em'}`};
  height: ${props => `${props.containerHeight ? props.containerHeight : '60px'}`};
  ${props => props.theme.mediaBreakpoints.mobile`
    width: ${props => `${props.containerWidth ? props.containerWidth : '3em'}`};
    height: ${props => `${props.containerHeight ? props.containerHeight : '3em'}`};
  `}
  & > div {
    box-sizing: border-box;
    display: block;
    position: absolute;
    width: ${props => `${props.width ? props.width : '7em'}`};
    height: ${props => `${props.height ? props.height : '7em'}`};
    border: ${props => `${props.borderSize ? props.borderSize : '10'}`}px solid ${props => props.theme.colors.loader};
    ${props => props.theme.mediaBreakpoints.mobile`
      width: ${props => `${props.width ? props.width : '3em'}`};
      height: ${props => `${props.height ? props.height : '3em'}`};
      border: ${props => `${props.borderSize ? props.borderSize : '5'}`}px solid ${props => props.theme.colors.loader};
      border-color: ${props => props.color ? props.color : props.theme.colors.loader}
        transparent transparent transparent;
  `}
    margin: 6px;
    border-radius: 50%;
    animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    border-color: ${props => props.color ? props.color : props.theme.colors.loader} transparent transparent transparent;
    @keyframes lds-ring {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  }
  & > div:nth-child(1) {
    animation-delay: -0.45s;
  }
  & > div:nth-child(2) {
    animation-delay: -0.3s;
  }
  & > div:nth-child(3) {
    animation-delay: -0.15s;
  }
`;

export const LoadingComponent = (props) => <Loading {...props}><div/><div/><div/><div/></Loading>;
