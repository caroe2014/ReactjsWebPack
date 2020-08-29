// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Flex } from 'rebass';
import styled from 'styled-components';
import { Trans } from 'react-i18next';
import i18n from 'web/client/i18n';
const BackArrow = styled(Flex)`
  & > i {
    -webkit-text-stroke: 1px #f0f0f3;
  }
  color: ${props => {
    if (props.theme.colors.reverseTextColor) return `${props.theme.colors.reverseTextColor}`;
    return 'transparent';
  }};
${props => props.theme.mediaBreakpoints.desktop`
    display: ${props => {
    if (((props.section === 'site' || props.section === 'loyalty') && !props['hide-arrow']) ||
     (props.section === 'home' && props['hide-arrow']) || props['multi-pass']) return `none`;
    return 'block';
  }};
  color: ${props => {
    if (props.theme.colors.buttonControlColor) return `${props.theme.colors.buttonControlColor}`;
    return 'transparent';
  }};
`
}
${props => props.theme.mediaBreakpoints.tablet`
  display: ${props => {
    if ((props.section === 'home' && !props['hide-arrow'])) return `none`;
    return 'block';
  }};  
  padding-left: 8px; padding-right: 8px;`}
${props => props.theme.mediaBreakpoints.mobile`
  display: ${props => {
    if ((props.section === 'home' && !props['hide-arrow'])) return `none`;
    return 'block';
  }};  
  padding-left: 8px; padding-right: 8px;`
}
`;
const BackArrowText = styled(Flex)`
color: ${props => {
    if (props.theme.colors.buttonControlColor) return `${props.theme.colors.buttonControlColor}`;
    return 'transparent';
  }};
`;
class BackLink extends Component {
  constructor (props) {
    super(props);
    this.state = {
      linkText: '',
      previousPath: '',
      showBackLink: true
    };
    this.handleChange = this.handleChange.bind(this);
    this.onNavLinkClick = this.onNavLinkClick.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }
  componentDidMount () {
    this.handleChange(this.props);
  }
  componentWillReceiveProps (nextProps) {
    this.handleChange(nextProps);
  }
  handleChange (nextProps) {
    const { match, menu, section, lastCartLocation, location, multiPassEnabled,
      deliveryLocation, tipCapture, isSmsEnabled, nameCapture, sites, digitalMenuId, conceptList } = nextProps;

    switch (section) {
      case 'item':
        this.setState({
          linkText: <Trans i18nKey='CONTEXT_BACK_TO_ITEMS'/>,
          previousPath: `/menu/${match.params.siteId}/${match.params.displayProfileId}/${match.params.conceptId}/${match.params.categoryId}` // eslint-disable-line max-len
        });
        break;
      case 'menu':
        let category = match.params.categoryId && menu.current.categories
          ? menu.current.categories.find(category => category.id === match.params.categoryId)
          : {};
        let linkText = category.name
          ? <Trans i18nKey='CONTEXT_BACK_TO_CATEGORIES'/>
          : <Trans i18nKey='CONTEXT_BACK_TO_CONCEPTS'/>;
        let path = category.name
          ? `/menu/${match.params.siteId}/${match.params.displayProfileId}/${match.params.conceptId}`
          : `/concepts/${match.params.siteId}/${match.params.displayProfileId}`;
        let showBackLink = digitalMenuId
          ? category.name ? true : (conceptList && conceptList.length > 1)
          : true;
        this.setState({ linkText: linkText, previousPath: path, showBackLink });
        break;
      case 'site':
        const { skipSitesPage } = sites;
        if (skipSitesPage) {
          this.setState({
            linkText: i18n.t('CONTEXT_BACK_TO_CHANGE_TIME'),
            previousPath: '/',
            showBackLink: !digitalMenuId
          });
          break;
        } else {
          this.setState({
            linkText: <Trans i18nKey={'CONTEXT_BACK_CHANGE_LOCATION'}/>, // eslint-disable-line max-len
            previousPath: `/`,
            showBackLink: !digitalMenuId
          });

          break;
        }
      case 'home':
        this.setState({ linkText: i18n.t('CONTEXT_BACK_TO_CHANGE_TIME'), previousPath: `/`, showBackLink: !digitalMenuId }); // eslint-disable-line max-len
        break;
      case 'payment':
        if (location.pathname && location.pathname === '/paymentComponent') {
          this.setState({ linkText: <Trans i18nKey={'CONTEXT_BACK_TO'}/>,
            previousPath: '/payment'
          });
        } else if (deliveryLocation && !multiPassEnabled) {
          this.setState({ linkText: <Trans i18nKey={'CONTEXT_BACK_TO_DELIVERY'}/>,
            previousPath: '/deliveryLocation'
          });
        } else if (isSmsEnabled) {
          this.setState({ linkText: <Trans i18nKey={'CONTEXT_BACK_TO_SMS'}/>,
            previousPath: '/smsNotification'
          });
        } else if (nameCapture && !multiPassEnabled) {
          this.setState({ linkText: <Trans i18nKey={'CONTEXT_BACK_TO_NAME_CAPTURE'}/>,
            previousPath: '/nameCapture'
          });
        } else if (tipCapture) {
          this.setState({ linkText: <Trans i18nKey={'CONTEXT_BACK_TO_TIP'}/>,
            previousPath: '/tip'
          });
        } else {
          this.setState({ linkText: <Trans i18nKey={'CONTEXT_BACK_TO'}/>,
            previousPath: lastCartLocation
          });
        }
        break;
      case 'delivery':
        if (isSmsEnabled) {
          this.setState({ linkText: <Trans i18nKey={'CONTEXT_BACK_TO_SMS'}/>,
            previousPath: '/smsNotification'
          });
        } else if (nameCapture) {
          this.setState({ linkText: <Trans i18nKey='CONTEXT_BACK_TO_NAME_CAPTURE'/>,
            previousPath: '/nameCapture'
          });
          break;
        } else if (tipCapture) {
          this.setState({ linkText: <Trans i18nKey='CONTEXT_BACK_TO_TIP'/>,
            previousPath: ((location.pathname && location.pathname === '/deliveryLocation') ? '/tip' : '/deliveryLocation') // eslint-disable-line max-len
          });
          break;
        } else {
          this.setState({ linkText: <Trans i18nKey='CONTEXT_BACK_TO'/>,
            previousPath: ((location.pathname && location.pathname === '/deliveryLocation') ? lastCartLocation : '/deliveryLocation') // eslint-disable-line max-len
          });
          break;
        }
        break;
      case 'namecapture':
        if (tipCapture) {
          this.setState({ linkText: <Trans i18nKey='CONTEXT_BACK_TO_TIP'/>,
            previousPath: ((location.pathname && location.pathname === '/nameCapture') ? '/tip' : '/nameCapture') // eslint-disable-line max-len
          });
          break;
        } else {
          this.setState({ linkText: <Trans i18nKey='CONTEXT_BACK_TO'/>,
            previousPath: ((location.pathname && location.pathname === '/nameCapture') ? lastCartLocation : '/nameCapture') // eslint-disable-line max-len
          });
          break;
        }

      case 'tip':
        this.setState({ linkText: <Trans i18nKey='CONTEXT_BACK_TO'/>,
          previousPath: ((location.pathname && location.pathname === '/tip') ? lastCartLocation : '/tip') // eslint-disable-line max-len
        });
        break;
      case 'smsnotification':
        if (nameCapture && !multiPassEnabled) {
          this.setState({ linkText: <Trans i18nKey='CONTEXT_BACK_TO_NAME_CAPTURE'/>,
            previousPath: '/nameCapture'
          });
          break;
        } else if (tipCapture) {
          this.setState({ linkText: <Trans i18nKey='CONTEXT_BACK_TO_TIP'/>,
            previousPath: '/tip'
          });
          break;
        } else {
          this.setState({ linkText: <Trans i18nKey='CONTEXT_BACK_TO'/>,
            previousPath: lastCartLocation
          });
          break;
        }
    }
  }

  onNavLinkClick () {
    if (this.state.linkText === i18n.t('CONTEXT_BACK_TO_CHANGE_TIME')) {
      this.props.setHideScheduleTime(false);
    }
  }

  hideBackLinkOnMultiPass () {
    const { match, menu, section, location, multiPassEnabled } = this.props;
    let category = match.params.categoryId && menu.current.categories
      ? menu.current.categories.find(category => category.id === match.params.categoryId)
      : {};
    return multiPassEnabled && (location.pathname.includes('concepts') ||
    (section === 'menu' && (!category.name && category.name !== '')));
  }

  handleKeyDown (e) {
    if (e.which === 32 || e.which === 13) {
      this.onNavLinkClick();
    }
  }

  render () {
    const { showText, section, hideScheduleTime, isScheduleOrderEnabled, siteFetch } = this.props;
    const { linkText, previousPath, showBackLink } = this.state;
    const isHideBackLinkOnMultiPass = this.hideBackLinkOnMultiPass();
    return (
      <React.Fragment>
        {showBackLink && !siteFetch &&
          <NavLink style={{ display: 'flex', outline: 'none', boxShadow: 'none' }}
            aria-label={i18n.t('NAVIGATE_PREV_PAGE')} tabIndex={showText && linkText ? -1 : 0}
            onKeyDown={this.handleKeyDown}
            className='back-arrow-link' to={previousPath} onClick={this.onNavLinkClick}>
            <BackArrow hide-arrow={hideScheduleTime}
              multi-pass={isHideBackLinkOnMultiPass}
              schedule-order={isScheduleOrderEnabled} section={section}>
              <i className='fa fa-arrow-left' />
            </BackArrow>
            {showText && !(isHideBackLinkOnMultiPass) &&
            <BackArrowText role='button' aria-label={i18n.t('NAVIGATE_PREV_PAGE')}
              tabIndex={linkText ? 0 : -1}>&nbsp;{linkText}</BackArrowText>}
          </NavLink>
        }
      </React.Fragment>
    );
  }
}
export default BackLink;
