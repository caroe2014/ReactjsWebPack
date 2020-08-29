/* eslint-disable no-mixed-operators */
/* eslint-disable max-len */
// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import React, { Component } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import theme from 'web/client/theme';
import PropTypes from 'prop-types';
import { Flex, Text, Button } from 'rebass';
import Tile from 'web/client/app/components/Tile';
import i18n from 'web/client/i18n';
import { Trans } from 'react-i18next';
import { getDeliveryOptions } from 'web/client/app/utils/LocationUtils';

const Container = styled(Flex)`
 align-items: flex-start;
 flex-wrap: wrap;
 flex-direction: column;
 justify-content: center;
 margin: 0;
 padding: 0;
 max-width: 570px;
 width:100%;
 height: auto;
 &>div {
  height: 100%;
 }
 .top-container {
  ${props => props.theme.mediaBreakpoints.mobile`
    padding-bottom: 50px;
  `};
 }
`;

const TextContainer = styled(Text)`
 font-size: ${props => props.theme.fontSize.nm};
 margin-top: 2px;
 word-break: break-all;
 width: 100%;
 &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const OpenTextContainer = styled(Text)`
 font-size: 14px;
 margin-top: 16px;
 z-index: 10;
`;

const SiteStatusContainer = styled(Text)`
 font-size: 14px;
 z-index: 10;
`;

const AddressContainer = styled(Flex)`
  flex-grow: 1
  margin-top: 5px;
  color: ${props => props.theme.colors.secondaryTextColor};
  width: 100%;
`;

const Closed = styled(Text)`
  padding-top: 0.5em;
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const ClosedAsapMessage = styled(Text)`
  padding-top: 0.5em;
  padding-bottom: 0.5em;
  font-weight: 500;
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const DeliveryContainer = styled(Flex)`
  height: 35px;
  align-items: center;
  width: ${props => props.optionLength > 1 ? '100%' : '25%'};
  ${props => props.theme.mediaBreakpoints.mobile`
    height: 50px;
    position: absolute;
    left: 0;
    bottom: 0;
    padding: 0px 10px;
    width: ${props => props.optionLength > 1 ? '100%' : 'auto'};
    ${props => props.optionLength === 1 && `
    button {
      padding: 5px 15px;
    }`}
  `};
  &>:not(:last-child) {
    margin-right: 10px;
  }
`;

const DeliveryButton = styled(Button)`
  background: ${props => props.theme.colors.light};
  border: 0.5px solid ${props => props.theme.colors.buttonControlColor};
  color: ${props => props.theme.colors.buttonControlColor};
  cursor: pointer;
  font-weight: 500;
  font-size: ${props => props.theme.fontSize.nm};
  float: right;
  height: 30px;
  min-height: 30px;
  padding: 0px 0px 0px;
  flex: 1 1 auto;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  text-transform: uppercase;
  &:hover {
    box-shadow: 0px 0px 10px 2px lightgrey;
    -webkit-box-shadow: 0px 0px 10px 2px lightgrey;
    -moz-box-shadow: 0px 0px 10px 2px lightgrey;
  }
  text-align: center;
  border-radius: 5px;
  outline: none;
  &:focus {
    outline: none;
    box-shadow: none;
  }
  ${props => props.theme.mediaBreakpoints.mobile` padding: 2px 0px 0px;`};
`;

const openIcon = {
  color: theme.colors.open,
  fontSize: '16px',
  marginRight: '4px'
};

const closeIcon = {
  color: theme.colors.close,
  fontSize: '16px',
  marginRight: '4px'
};

const titleStyle = {
  fontSize: '18px'
};

class SiteSelectCard extends Component {

  constructor (props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    const { keyProps } = this.props;
    this.deliveryOptions = getDeliveryOptions({ deliveryDestination: keyProps.deliveryDestination, dineInConfig: keyProps.dineInConfig, pickUpConfig: keyProps.pickUpConfig }); // eslint-disable-line max-len
  }
  handleClick (e) {
    if (this.props.keyProps.availableAt.availableNow && this.props.selectSite) {
      this.props.selectSite(this.props.keyProps);
    }
    this.props.setDeliveryOption(this.deliveryOptions.find(data => data.id === e.target.value));
  }
  render () {
    const { keyProps, ariaLabel, tabIndex, apptheme, isScheduleOrderEnabled, showOperationTimes, isAsapOrder } = this.props;
    const storeAvailabeNow = !isAsapOrder || (isAsapOrder && keyProps.storeAvailabeNow);
    const isEnabled = keyProps.availableAt.availableNow && keyProps.availableAt.conceptsAvailableNow && storeAvailabeNow;
    return (
      <ThemeProvider className='site-card' theme={theme}>
        <Container className='site-card-container'
          open={keyProps.availableAt.availableNow && keyProps.availableAt.conceptsAvailableNow &&
            storeAvailabeNow}>
          <Tile
            apptheme={apptheme}
            classContext={`tile site_${keyProps.id}`}
            title={keyProps.name}
            image={keyProps.image}
            imageresponsive='true'
            isEnabled={isEnabled}
            titleStyle={titleStyle}
            closedoverlay='true'
            ariaLabel={ariaLabel}
            tabIndex={tabIndex}
          >
            <AddressContainer
              className='address-text'
              flexDirection='column'
              alignItems='flex-start'
            >
              {keyProps.address && keyProps.address.map((item, index) => (
                <React.Fragment key={item.toString() + keyProps.id}>
                  <TextContainer aria-hidden={item === ' ' || item === '  '}
                    aria-label={item} tabIndex={(item === ' ' || item === '  ' || !isEnabled) ? -1 : 0}
                    className={`address-line-${index + 1}`}>{item}</TextContainer>
                </React.Fragment>
              ))}
              <OpenTextContainer className='opens-text custom-time'
                role={showOperationTimes && keyProps.availableAt.opens && 'img'}
                aria-label={showOperationTimes && keyProps.availableAt.opens && i18n.t('SITE_SELECT_OPEN_TIME',
                  { siteOpen: keyProps.availableAt.opens, siteClose: keyProps.availableAt.closes })}
                tabIndex={isEnabled ? 0 : -1}
              >
                {showOperationTimes && keyProps.availableAt.opens && <React.Fragment>
                  <i className='fa fa-clock-o'
                    alt=''
                    style={keyProps.availableAt.availableNow &&
                      keyProps.availableAt.conceptsAvailableNow && storeAvailabeNow ? openIcon : closeIcon}/>
                  {
                    i18n.t('SITE_SELECT_OPEN_TIME',
                      { siteOpen: keyProps.availableAt.opens, siteClose: keyProps.availableAt.closes })
                  }
                </React.Fragment>}
              </OpenTextContainer>
              <SiteStatusContainer>
                {keyProps.availableAt.availableNow &&
                  keyProps.availableAt.conceptsAvailableNow && isAsapOrder && !keyProps.storeAvailabeNow &&
                  <ClosedAsapMessage className='closes-asap' tabIndex={0} aria-label={i18n.t('CLOSED_ASAP')}><Trans i18nKey='CLOSED_ASAP' /></ClosedAsapMessage>
                }
                {(!isScheduleOrderEnabled || isAsapOrder) &&
                <React.Fragment>
                  {!keyProps.availableAt.availableNow &&
                    <Closed className='closes-text' tabIndex={0} aria-label={i18n.t('SITE_SELECT_CLOSED')}><Trans i18nKey='SITE_SELECT_CLOSED' /></Closed>
                  }
                  {keyProps.availableAt.availableNow && !keyProps.availableAt.conceptsAvailableNow &&
                    <Closed className='closes-text' tabIndex={0} aria-label={i18n.t('SITE_SELECT_OPEN_LATER')}><Trans i18nKey='SITE_SELECT_OPEN_LATER' /></Closed>
                  }
                </React.Fragment>
                }
              </SiteStatusContainer>
            </AddressContainer>
            {this.deliveryOptions.length > 0 &&
              <DeliveryContainer
                className='delivery-container'
                optionLength={this.deliveryOptions.length}>
                {this.deliveryOptions.map((data, index) =>
                  <DeliveryButton
                    className='delivery-button'
                    key={`${data.id}-${index}`}
                    children={data.displayText}
                    tabIndex={isEnabled ? 0 : -1}
                    value={data.id}
                    onClick={this.handleClick} />
                )}
              </DeliveryContainer>
            }
          </Tile>
        </Container>
      </ThemeProvider>
    );
  }
}

SiteSelectCard.propTypes = {
  keyProps: PropTypes.shape({
    id: PropTypes.string.isRequired,
    image: PropTypes.string,
    name: PropTypes.string.isRequired,
    availableAt: PropTypes.shape({
      opens: PropTypes.string.isRequired,
      closes: PropTypes.string.isRequired,
      availableNow: PropTypes.bool.isRequired,
      closingIn: PropTypes.number.isRequired
    }).isRequired,
    address: PropTypes.arrayOf(PropTypes.string.isRequired)
  }).isRequired
};
export default SiteSelectCard;
