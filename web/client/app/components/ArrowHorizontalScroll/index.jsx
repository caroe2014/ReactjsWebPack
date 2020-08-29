// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import i18n from 'web/client/i18n';

const TabContainer = styled.div`
  display: flex;
  overflow: hidden;
  align-items: center;
  position: relative;
`;

const ScrollContent = styled.div`
  flex-direction: row;
  overflow-x: hidden;
  overflow-y: hidden;
  white-space: nowrap;
  display: flex;
  align-items: center;
  ${props => props.theme.mediaBreakpoints.tablet`
    overflow-x: auto;
  `};
  ${props => props.theme.mediaBreakpoints.mobile`
    overflow-x: auto;
  `};
 
`;

const RightArrow = styled.div`
  position: absolute;
  right: 0;
  z-index: 100;
  cursor: pointer;
  height: 100%;
  ${props => {
    if (props['visible']) {
      return `
      visibility: visible;
        opacity: 1;
      `;
    };
    return `
        visibility: hidden;
        opacity: 0;
    `;
  }};
   transition: opacity 200ms ease-in-out;
  @media screen and (-ms-high-contrast: active), (-ms-high-contrast: none) {
    top: 0;
  }
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const LeftArrow = styled.div`
  position: absolute;
  z-index: 100;
  cursor: pointer;
  height: 100%;
  ${props => {
    if (props['visible']) {
      return `
      visibility: visible;
        opacity: 1;
      `;
    }
    return `
        visibility: hidden;
        opacity: 0;
    `;
  }};
  transition: opacity 200ms ease-in-out;
  @media screen and (-ms-high-contrast: active), (-ms-high-contrast: none) {
    top: 0;
  }
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

class ArrowHorizontalScroll extends Component {
  constructor (props) {
    super(props);
    this.state = {
      leftArrowVisible: false,
      rightArrowVisible: false
    };
    this.scrollInterval = this.scrollInterval.bind(this);
    this.onScroll = this.onScroll.bind(this);
    this.onContentScroll = this.onContentScroll.bind(this);
    this.handleKeyDownLeftArrow = this.handleKeyDownLeftArrow.bind(this);
    this.handleKeyDownRightArrow = this.handleKeyDownRightArrow.bind(this);
    this.scrollToDirection = this.scrollToDirection.bind(this);
  }

  componentDidMount () {
    if (this.modifierTab) {
      if (this.modifierTab.scrollWidth > this.modifierTab.offsetWidth) {
        this.setState({ rightArrowVisible: true });
      }
    }
  }

  scrollInterval (multipleOffset, scrollTo, direction) {
    this.currentPos += multipleOffset;
    this.modifierTab.scrollLeft = this.currentPos;
    if ((direction > 0 && parseInt(this.currentPos) >= scrollTo) ||
      (direction < 0 && parseInt(this.currentPos) <= scrollTo)) {
      clearInterval(this.intervalId);
      this.onContentScroll();
    }
  }

  onScroll = (direction) => (e) => {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    let offetWidth = this.modifierTab.offsetWidth / 2 * direction;
    this.currentPos = this.modifierTab.scrollLeft;
    let scrollTo = this.currentPos + offetWidth;
    let multipleOffset = Math.abs(offetWidth) > 100 ? offetWidth / 15 : offetWidth / 7;
    this.intervalId = setInterval(this.scrollInterval, 10, multipleOffset, scrollTo, direction);
  }

  scrollToDirection (direction) {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    let offetWidth = this.modifierTab.offsetWidth / 2 * direction;
    this.currentPos = this.modifierTab.scrollLeft;
    let scrollTo = this.currentPos + offetWidth;
    let multipleOffset = Math.abs(offetWidth) > 100 ? offetWidth / 15 : offetWidth / 7;
    this.intervalId = setInterval(this.scrollInterval, 10, multipleOffset, scrollTo, direction);
  }

  onContentScroll () {
    if (this.modifierTab.scrollLeft === 0) {
      this.setState({ leftArrowVisible: false, rightArrowVisible: true });
    } else if (Math.ceil(this.modifierTab.scrollLeft + this.modifierTab.offsetWidth) >= this.modifierTab.scrollWidth) {
      this.setState({ rightArrowVisible: false, leftArrowVisible: true });
    } else {
      this.setState({ leftArrowVisible: true, rightArrowVisible: true });
    }
  }

  handleKeyDownRightArrow (event) {
    // TODO: make this usable by all clickable elements,
    //  pass in caller's onclickhandler (13 is keycode for enter key, 32 is spacebar)
    if (event.which === 13 || event.which === 32) {
      this.scrollToDirection(1);
    }
  }

  handleKeyDownLeftArrow (event) {
    // TODO: make this usable by all clickable elements,
    //  pass in caller's onclickhandler (13 is keycode for enter key, 32 is spacebar)
    if (event.which === 13 || event.which === 32) {
      this.scrollToDirection(-1);
    }
  }

  render () {
    const { classContext, tabIndex } = this.props;
    return (
      <TabContainer className={classContext}>
        <Fragment>
          <LeftArrow
            className='scroll-arrow-left'
            visible={this.state.leftArrowVisible}
            onClick={this.onScroll(-1)}
            onKeyDown={this.handleKeyDownLeftArrow}
            tabIndex={this.state.leftArrowVisible && tabIndex}
            aria-label={i18n.t('SCROLL_LEFT')}
            role='button'
          >
            {this.props.leftArrow}
          </LeftArrow>
          <ScrollContent
            id='scroll-content'
            className='scroll-content'
            innerRef={(e) => { this.modifierTab = e; }}
            style={this.props.contentStyle}
            onScroll={this.onContentScroll}
          >
            {this.props.children}
          </ScrollContent>
          <RightArrow
            className='scroll-arrow-right'
            visible={this.state.rightArrowVisible}
            onClick={this.onScroll(1)}
            onKeyDown={this.handleKeyDownRightArrow}
            tabIndex={this.state.leftArrowVisible && tabIndex}
            aria-label={i18n.t('SCROLL_RIGHT')}
            role='button'
          >
            {this.props.rightArrow}
          </RightArrow>
        </Fragment>
      </TabContainer>
    );
  }
}

export default ArrowHorizontalScroll;
