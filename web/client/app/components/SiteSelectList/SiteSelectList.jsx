// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import React, { Component } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import theme from 'web/client/theme';
import PropTypes from 'prop-types';
import { Flex } from 'rebass';
import SiteSelectCard from 'web/client/app/components/SiteSelectCard';
import { getOrderConfigurationDetailsWithContextId } from 'web/client/app/utils/OrderConfig';
import i18n from 'web/client/i18n';

const Container = styled(Flex)`
  flex-direction: column;
  margin: 70px auto 0px auto;
  height: fit-content;
  max-width: 75em;
  width: 100%;
  padding: 0px;
  &:after{
    content: '';
    margin: auto;
    width: 100%;
    max-width: 570px;
    }
  ${props => props.theme.mediaBreakpoints.mobile`
    justify-content: center;
    padding-left: 10px;
    padding-right: 10px;
  `}
  ${props => props.theme.mediaBreakpoints.tablet`
    justify-content: center;
  `}
  ${props => props.theme.mediaBreakpoints.desktop`
    justify-content: space-between;
    padding-left: 20px;
    padding-right: 20px;
  `}
`;

const ListContainer = styled(Flex)`
  flex-direction: column;
  flex-flow: row wrap;
  height: fit-content;
  max-width: 75em;
  margin-top: 80px;
  width: 100%;
  padding: 0px;
  &:after{
    content: '';
    margin: auto;
    width: 100%;
    max-width: 570px;
    }
  ${props => props.theme.mediaBreakpoints.mobile`
    justify-content: center;
  `}
  ${props => props.theme.mediaBreakpoints.tablet`
    justify-content: center;
  `}
  ${props => props.theme.mediaBreakpoints.desktop`
    justify-content: space-between;
  `}
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

class SiteSelectList extends Component {
  constructor (props) {
    super(props);
    this.selectSite = this.selectSite.bind(this);
    this.filterStoresWithAsapDisabled = this.filterStoresWithAsapDisabled.bind(this);
  }

  componentDidMount () {
    const { keyProps, skipSitesPage } = this.props;

    if (skipSitesPage) {
      this.selectSite(keyProps[0]);
    } else if (!skipSitesPage && document.getElementById('top-container')) {
      document.getElementById('top-container').focus();
    }
  }

  selectSite (site) {
    const { selectSite, setOrderConfig, keyProps } = this.props;
    if (selectSite) {
      const orderConfig = getOrderConfigurationDetailsWithContextId(site.id, site.displayProfileId, keyProps);
      setOrderConfig(orderConfig);
      selectSite(site);
    }
  }

  filterStoresWithAsapDisabled (site) {
    const { isAsapOrder } = this.props;
    return !isAsapOrder || !site.isAsapOrderDisabled;
  }

  render () {
    const { keyProps, apptheme, scheduleOrderEnabled, showOperationTimes, setDeliveryOption,
      isAsapOrder } = this.props;
    return (
      <ThemeProvider className='site-list' theme={theme}>
        <Container className='site-list-container' p={[1, 2, 3, 4]} m={[0, 2]}>
          <ListContainer className='site-list-container'
            tabIndex={0}
            aria-label={keyProps.length > 1 ? `${i18n.t('STORE_SELECTION')} ${keyProps.length} ${i18n.t('STORES_LABEL')}` : ``}> {/* eslint-disable-line max-len */}
            {keyProps && keyProps.filter(this.filterStoresWithAsapDisabled).map((item, index) => (
              <React.Fragment key={`Site-${item.id}-${item.displayProfileId}`}>
                <SiteSelectCard
                  className={`tile site-${index + 1}`}
                  keyProps={item}
                  selectSite={this.selectSite}
                  apptheme={apptheme}
                  isScheduleOrderEnabled={scheduleOrderEnabled}
                  isAsapOrder={isAsapOrder}
                  showOperationTimes={showOperationTimes}
                  setDeliveryOption={setDeliveryOption}
                  ariaLabel={`store${index + 1} ${item.name}`}
                  tabIndex={0}
                />
              </React.Fragment>
            ))}
          </ListContainer>
        </Container>
      </ThemeProvider>
    );
  }
}

SiteSelectList.propTypes = {
  selectSite: PropTypes.func,
  keyProps: PropTypes.arrayOf(
    PropTypes.shape({
      image: PropTypes.string,
      name: PropTypes.string.isRequired,
      availableAt: PropTypes.shape({
        opens: PropTypes.string.isRequired,
        closes: PropTypes.string.isRequired
      }).isRequired,
      address: PropTypes.arrayOf(PropTypes.string.isRequired)
    }).isRequired
  )
};

export default SiteSelectList;
