// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import React, { Component } from 'react';
import { Toolbar, Heading, Text, Flex } from 'rebass';
import moment from 'moment';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Trans } from 'react-i18next';
import i18n from 'web/client/i18n';
import get from 'lodash.get';
import Announcements from 'web/client/app/components/Announcements';

const Full = styled(Flex)`
  width: 100%;
  background-color: ${props => {
    if (props.theme.colors.contextBar) return `${props.theme.colors.contextBar}`;
    return 'transparent';
  }};
`;

const Container = styled(Toolbar)`
  background-color: ${props => {
    if (props.theme.colors.contextBar) return `${props.theme.colors.contextBar}`;
    return 'transparent';
  }};
${props => props.theme.mediaBreakpoints.desktop`max-width: 1200px; padding-left: 20px; padding-right: 20px;`}
  padding-left: 0px;
  padding-right: 0px;
  min-height: 50px;
  position: relative;
  margin: auto;
  width: 100%;
`;

const TitleDiv = styled(Flex)`
  color: ${props => props.theme.colors.primaryTextColor};
`;

const Title = styled(Heading)`
  display: flex;
  align-items: center;
  color: ${props => props.theme.colors.primaryTextColor};
  font-size: ${props => props.theme.fontSize.md};
  font-weight: 500;
  top: 0px;
  bottom: 0px;
  margin: auto;
  left: 50%;
  position: absolute;
  transform: translate(-50%, 0);
  white-space: normal;
  width: auto;
  text-align: center;
  justify-content: center;
  ${props => props.theme.mediaBreakpoints.mobile`
    width: 100%;
  `};
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const BackLinkContainer = styled(Flex)`
  ${props => props.theme.mediaBreakpoints.mobile`display: none;`};
  ${props => props.theme.mediaBreakpoints.tablet`display: none;`};
  & > a {
    cursor: pointer;
    font-size: ${props => props.theme.fontSize.nm};
    font-weight: 500;
    text-decoration: none;
    text-transform: uppercase;
    & > i {
      -webkit-text-stroke: 1px ${props => props.theme.colors.contextBackground};
    }
  }
`;

const OpenTime = styled(Text)`
  color: ${props => props.theme.colors.primaryTextColor};
  display: flex;
  align-items: center;
  font-size: ${props => props.theme.fontSize.nm};
  margin-left: auto;
  margin-right: 0;
${props => props.theme.mediaBreakpoints.mobile`display: none;`};
  & > i {
    color: ${props => props.theme.colors.primaryTextColor};
    font-size: ${props => props.theme.fontSize.lg};
    margin-right: 8px;
  }
  & > i.close {
    color: ${props => props.theme.colors.tile};
  }
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

class ContextBar extends Component {
  constructor (props) {
    super(props);
    this.state = {
      title: '',
      linkText: '',
      previousPath: '',
      selectedSite: {}
    };

    this.handleChange = this.handleChange.bind(this);
    this.siteOpen = this.siteOpen.bind(this);
    this.getSiteAvailability = this.getSiteAvailability.bind(this);
  }

  componentDidMount () {
    this.handleChange(this.props);
  }

  componentDidUpdate (prevProps) {
    if (prevProps.section !== this.props.section) {
      document.getElementById('top-container') &&
       document.getElementById('top-container').focus();
    }
  }

  componentWillReceiveProps (nextProps) {
    this.handleChange(nextProps);
  }

  siteOpen (value) {
    if (moment(value.closes, 'h:mma').isBefore(moment(value.opens, 'h:mma'))) {
      return moment().isAfter(moment(value.opens, 'h:mma'));
    }
    return (
      moment().isAfter(moment(value.opens, 'h:mma')) &&
      moment().isBefore(moment(value.closes, 'h:mma'))
    );
  }

  handleChange (nextProps) {
    const { sites, menu, item, match, section, conceptOptions } = nextProps;

    const previousMenu = this.props.menu;
    let selectedSite = sites.list.find(item => item.id === sites.selectedId && item.displayProfileId === sites.displayProfileId); // eslint-disable-line max-len

    switch (section) {
      case 'item':
        this.setState({ title: item.selectItem ? item.selectItem.displayText : '' });
        break;
      case 'menu':

        if (previousMenu.menuId !== menu.menuId) {
          this.setState({ title: '' });
          break;
        }

        let category = match.params.categoryId && menu.current.categories
          ? menu.current.categories.find(category => category.id === match.params.categoryId)
          : {};

        let title = category.name
          ? category.name
          : conceptOptions && conceptOptions.onDemandDisplayText
            ? conceptOptions.onDemandDisplayText : menu.current.name;

        this.setState({ title });
        break;
      case 'home':
        this.setState({
          title: <Trans i18nKey='LOCATION_LIST_PAGE_LABEL' /> });
        break;
      case 'site':
        this.setState({ title: selectedSite ? selectedSite.name : '', selectedSite });
        break;
      case 'payment':
        this.setState({ title: <Trans i18nKey='CONTEXT_PAYMENT'/> });
        break;
      case 'delivery':
        this.setState({ title: <Trans i18nKey='DELIVERY_LOCATION_CONTEXT_LABEL'/> });
        break;
      case 'tip':
        this.setState({ title: <Trans i18nKey='TIP_CAPTURE_CONTEXT_LABEL'/> });
        break;
      case 'namecapture':
        this.setState({ title: <Trans i18nKey='NAME_CAPTURE_CONTEXT_LABEL'/> });
        break;
      case 'smsnotification':
        this.setState({ title: <Trans i18nKey='SMS_NOTIFICATION_CONTEXT_LABEL'/> });
        break;
      case 'loyalty':
        this.setState({ title: selectedSite ? selectedSite.name : '', selectedSite });
        break;
    }
  }

  getSiteAvailability (selectedSite, scheduleOrderData) {
    const daysToAdd = get(scheduleOrderData, 'daysToAdd', 0);
    const allAvailableList = get(selectedSite, 'allAvailableList');
    if (!allAvailableList) {
      return selectedSite.availableAt;
    }
    const availableDay = allAvailableList.find(availableAt => availableAt.index === daysToAdd);
    return (availableDay && availableDay.availableAt) || selectedSite.availableAt;
  }

  render () {
    const { showOpenTime, backLink, section, showOperationTimes, sites, isScheduleOrderEnabled, digitalMenuId, scheduleOrderData } = this.props; // eslint-disable-line max-len
    const { title, selectedSite } = this.state;
    const siteAvailableInfo = selectedSite && this.getSiteAvailability(selectedSite, scheduleOrderData);
    const showOpenTimeContainer = showOpenTime && (siteAvailableInfo || (selectedSite && selectedSite.availableAt));
    const removeBackLinkFromConceptsPage = sites.skipSitesPage && !isScheduleOrderEnabled && section === 'site';

    return (
      <React.Fragment>
        <Full section={section}>
          <Container>
            {
              !removeBackLinkFromConceptsPage &&
              <BackLinkContainer className='back-link-container'>
                {backLink}
              </BackLinkContainer>
            }
            {title &&
            <TitleDiv className='title-div'>
              <Announcements message={title} ariaLive='assertive' />
              <Title className='context-title'
                role='heading'
                aria-level='1' tabIndex={0}>
                {title}
              </Title>
            </TitleDiv>
            }
            {showOperationTimes && showOpenTimeContainer && (section === 'site') && !digitalMenuId && (
              <OpenTime className='open-time' mr={'8em'}
                tabIndex={0} aria-label={i18n.t('CONTEXT_SITE_TIME',
                  { siteOpen: siteAvailableInfo.opens, siteClose: siteAvailableInfo.closes })}>
                <i
                  className={`fa fa-clock-o ${this.siteOpen(siteAvailableInfo) ? 'open' : 'close'}`}
                />
                {
                  i18n.t('CONTEXT_SITE_TIME',
                    { siteOpen: siteAvailableInfo.opens, siteClose: siteAvailableInfo.closes })
                }
              </OpenTime>
            )}
          </Container>
        </Full>
      </React.Fragment>
    );
  }
}

ContextBar.propTypes = {
  showOpenTime: PropTypes.bool
};

export default ContextBar;
