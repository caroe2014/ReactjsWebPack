// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import React, { Component } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import theme from 'web/client/theme';
import PropTypes from 'prop-types';
import { Flex, Text, Box } from 'rebass';
import { Trans } from 'react-i18next';
import DynamicImage from 'web/client/app/components/DynamicImage';
const Container = styled(Flex)`
  flex-wrap: no-wrap;
  flex-direction: column;
  flex: 1 1 auto;
  box-shadow: ${props => {
    if (!props['data-border']) return 'none';
    return props.theme.shadow;
  }};
  ${props => props.theme.mediaBreakpoints.desktop`
  min-height: ${props => {
    if (props.iscart) return '110px';
    return '170px';
  }};
  margin-bottom: ${props => {
    if (props.iscart) return '0px';
    return '20px';
  }};
  `};
  position: relative;
  width: 100%;
  max-width: 570px;
  cursor: ${props => !props.disabled && props['data-action'] ? 'pointer' : 'initial'};
  
  background-color: white;
  ${props => props.theme.mediaBreakpoints.tablet`margin-bottom: 10px; min-height: 170px;`};
  ${props => props.theme.mediaBreakpoints.mobile`margin-bottom: 10px; min-height: 110px;`};
  .custom-time{
    font-weight: 400;
  }
  &:hover {
    .closed-overlay{
      opacity: 1;
      visibility: visible;
    }
    .closes-text{
      font-weight: 300 !important;
    }
    .custom-title{
      font-weight: 500 !important;
    }
    .custom-time{
      font-weight: bold;
    }
    ${props => props.theme.mediaBreakpoints.desktop`
      ${props => {
    return `box-shadow: 2px 3px 10px 0px rgba(0, 0, 0, .30);
          -webkit-box-shadow: 2px 3px 10px 0px rgba(0, 0, 0, .30);
          -moz-box-shadow: 2px 3px 10px 0px rgba(0, 0, 0, .30);
          .title-hover{
            color: ${props.theme.colors.textHoverColor} !important;`;
  }}
`};
  };
`;
const TopContainer = styled(Flex)`
  flex: 1 1 auto;
  background-color: #FFF;
  @media screen and (-ms-high-contrast: active), (-ms-high-contrast: none) {
    min-height: 170px;
  }
`;
const ImageContainer = styled(DynamicImage)`
  border: 0.5px solid lightgray;
`;
ImageContainer.displayName = 'ImageContainer';
const DetailContainer = styled(Flex)`
  flex: 1 1 auto;
  height:auto;
  padding: ${props => {
    if (props.iscart) return '10px 0px';
    return '10px';
  }};
  
  word-wrap: break-word;
`;
const BoxContainer = styled(Flex)` 
  height: 170px;
  width: 170px;
  position: relative;
${props => props.theme.mediaBreakpoints.mobile`
    width: ${props => {
    if (props.imageresponsive) return '120px';
    return '190px';
  }};
    height: ${props => {
    if (props.imageresponsive) return '120px';
    return '190px';
  }};
`};
`;
const TextContainer = styled(Text)`
  color: ${props => props.theme.colors.primaryTextColor};
  font-size: 20px;
  font-weight: bold;
  ${props => props.theme.mediaBreakpoints.tablet`font-size: 18px;`};
  ${props => props.theme.mediaBreakpoints.mobile`font-size: 18px;`};
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;
const Overlay = styled(Box)`
  width: 100%;
  height: 100%;
  position: absolute;
  opacity: 0.5;
  z-index: 3;
  background-color: ${props => props.theme.colors.light};
`;
const ClosedOverlay = styled(Box)`
  width: 100%;
  height: 100%;
  position: absolute;
  display: block;
  z-index: 4;
  background: rgba(0, 0, 0, 0);
  left: 0;
  top: 0;
  padding: inherit;
  & > div {
    display: flex;
    opacity: 0;
    visibility: hidden;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.55);
    height: 100%;
    width: 100%;
    color: ${props => props.theme.colors.reverseTextColor};
  }
${props => props.theme.mediaBreakpoints.tablet`
    display: ${props => !props.disabled ? 'none' : 'block'};
`}
`;

class Tile extends Component {
  constructor (props) {
    super(props);
    this.handleOnClick = this.handleOnClick.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }
  static defaultProps = {
    isEnabled: true,
    hasBorder: true
  }
  handleOnClick (e) {
    if (this.props.handleClick && this.props.isEnabled) {
      this.props.handleClick(this.props.id);
    }
  }
  handleKeyDown (e) {
    // TODO: make this usable by all clickable elements,
    //  pass in caller's onclickhandler (13 is keycode for enter key, 32 is spacebar)
    if (e.which === 13 || e.which === 32) {
      this.handleOnClick();
    }
  }
  render () {
    const {
      classContext,
      image,
      title,
      titleStyle,
      children,
      footer,
      handleClick,
      isEnabled,
      hasBorder,
      closedoverlay,
      isHover,
      ariaLabel,
      tabIndex,
      ...rest } = this.props;
    return (
      <ThemeProvider className='tile-container' theme={theme}>
        <Container
          {...rest}
          className={classContext}
          flexWrap='nowrap'
          role='button'
          onClick={this.handleOnClick}
          onKeyDown={this.handleKeyDown}
          data-action={handleClick !== undefined}
          disabled={!isEnabled}
          data-border={hasBorder}
          is-hover={isHover}
        >
          <TopContainer {...rest} className='top-container' width={1} id={`top-container${classContext}`}>
            { !isEnabled &&
              <Overlay className='overlay' />
            }
            {image &&
              <BoxContainer {...rest} className='box-container' width={[0.4]} id={`box-container${rest.id}`} >
                <ImageContainer
                  className='image'
                  src={image}
                  bgSize='100% 100%'
                  alt=''
                />
                { closedoverlay &&
                <ClosedOverlay disabled={!isEnabled}>
                  <div className='closed-overlay'>
                    {isEnabled ? <Trans i18nKey='TILE_OPEN'/> : <Trans i18nKey='TILE_CLOSED'/>}
                  </div>
                </ClosedOverlay>
                }
              </BoxContainer>
            }
            <DetailContainer
              {...rest}
              className='detail-container'
              flexDirection='column'
              alignItems={children ? 'flex-start' : 'center'}
              justifyContent={children ? 'flex-start' : 'center'}
              id={`detail-container${classContext}`}
              width={image ? [0.6] : [1]}
            >
              <TextContainer className='title-hover tile-tile'
                aria-label={ariaLabel} tabIndex={tabIndex}
                style={titleStyle} handlehover={handleClick && 'true'}>
                {title}
              </TextContainer>
              {children && children}
            </DetailContainer>
          </TopContainer>
          {footer && footer}
        </Container>
      </ThemeProvider>
    );
  }
}
Tile.propTypes = {
  handleClick: PropTypes.func,
  image: PropTypes.string,
  title: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object
  ]),
  titleStyle: PropTypes.object,
  footer: PropTypes.element,
  isEnabled: PropTypes.bool,
  hasBorder: PropTypes.bool
};
export default Tile;
