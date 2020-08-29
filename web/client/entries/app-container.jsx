// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

/* eslint-disable max-len */
// import config from 'app.config';
import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import { Provider as ThemeProvider, Flex, Box } from 'rebass';
import i18n from '../i18n';
import { I18nextProvider } from 'react-i18next';
import { Provider, connect } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import ReactDOM from 'react-dom';
import App from '../app';
import Demo from '../app/demo';
import Concepts from 'web/client/pages/concepts';
import Menu from 'web/client/pages/menu';
import ItemDetailsPage from 'web/client/pages/item-details';
import Payment from 'web/client/pages/payments';
import Cart from 'web/client/app/components/Cart';
import GA from 'web/client/app/components/GAPayment';
import DeliveryLocationPage from 'web/client/pages/delivery-location';
import TipCapturePage from 'web/client/pages/tip-capture';
import SmsNotificationPage from 'web/client/pages/sms-notification';
import nameCapturePage from 'web/client/pages/name-capture';
import ErrorMessage from 'web/client/pages/error-message';
import GuestProfileLogin from 'web/client/pages/guest-profile';
import SavedCardsPage from 'web/client/pages/saved-cards';
import IdleMessage from 'web/client/pages/idle-message';
import Loyalty from 'web/client/pages/loyalty';
import styled from 'styled-components';
import theme from '../theme';
import auth from 'web/client/auth';
import { store, history } from '../store';
import config from 'app.config';
import { ConnectedNav, ConnectedPaySuccess, ConnectedBackLink, ConnectedContextBar, ConnectedPayment, ConnectedGAPayment, ConnectedOrderGuidModal } from 'web/client/app/reduxpages/ConnectedComponents'; // eslint-disable-line max-len
import { setIdleFlag, setTimeoutFlag, clearIdleFlags } from 'web/client/app/modules/error/sagas';
import { closeLoginPopup, showSavedCardsPopup } from 'web/client/app/modules/guestProfile/sagas';
import { setAppQueryParams } from 'web/client/app/utils/SeatNumber';
import { themeUpdate } from 'web/client/app/utils/AppThemeUpdate';
import UrlImageLoader from 'web/client/app/components/UrlImageLoader';
import {
  Route,
  Redirect,
  Switch
} from 'react-router-dom';
import IdleTimer from 'react-idle-timer';

const authorized = auth.checkAuth();
const Logout = () => {
  auth.logout(true);
  return <div />;
};
const ParentStyle = styled(Flex)`
  flex-direction: column;
  width: 100%;
  position: relative;
  z-index: 999;
  align-items: center;
  height: 100%;
`;
const TopContainer = styled(Flex)`
  flex-shrink: 0;
  position: fixed;
  width: 100%;
  z-index: 999;
  @media screen and (-ms-high-contrast: active), (-ms-high-contrast: none) {
    left: 0;
  }
`;
const SwitchContainer = styled(Flex)`
 width: 100%;
 height: 100%;
`;
const AppBackground = styled.div`
  ${props => props.theme.mediaBreakpoints.desktop`display:block`};
  ${props => props.theme.mediaBreakpoints.tablet`display:none`};
  ${props => props.theme.mediaBreakpoints.mobile`display:none`};
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  width:100%;
  @media print { 
    display: none;
  }
`;
const AppBackgroundMobile = styled.div`
  ${props => props.theme.mediaBreakpoints.desktop`display:none`};
  ${props => props.theme.mediaBreakpoints.tablet`display:block`};
  ${props => props.theme.mediaBreakpoints.mobile`display:block`};
  position: fixed;
  top: 0;
  bottom: 0;
  width:100%;
  @media print { 
    display: none;
  }
`;
window.location && window.location.search !== '' && setAppQueryParams(window.location.search);
const showLogOutLink = (siteAuth) => {
  return siteAuth && siteAuth.type && (siteAuth.type !== 'none' && siteAuth.type !== 'socialLogin' && siteAuth.type !== 'atrium');
};
const getBackground = (cboConfig, location, conceptOptions, selectedId) => {
  if (!cboConfig.fetching && cboConfig.config.theme && location.pathname.indexOf('/menu/') === -1) {
    return {
      showImage: cboConfig.config.theme.desktop.showImage,
      desktopBackground: cboConfig.config.theme.desktop.showImage === 'true' ? cboConfig.config.theme.desktop.backgroundImage : cboConfig.config.theme.desktop.color,
      mobileBackground: cboConfig.config.theme.mobile ? cboConfig.config.theme.mobile.color : theme.colors.light,
      contextID: cboConfig.config.contextID
    };
  } else if (conceptOptions && location.pathname.indexOf('/menu/') === 0) {
    return {
      showImage: conceptOptions.onDemandShowImage,
      desktopBackground: conceptOptions.onDemandShowImage === 'true' ? conceptOptions.onDemandDesktopBackgroundImage : conceptOptions.onDemandDesktopColor,
      mobileBackground: conceptOptions.onDemandMobileColor ? conceptOptions.onDemandMobileColor : theme.colors.light,
      contextID: selectedId
    };
  } else {
    return false;
  }
};

let timeoutTimer;
let currentIdleFlag;

const ConnectedAppContainer = connect((state, props) => ({
  ...state.sites,
  digitalMenuId: state.app.digitalMenuId,
  cboConfig: state.app,
  cartOpen: state.cart.cartOpen,
  siteAuth: state.app.config.siteAuth,
  location: state.router.location,
  conceptOptions: state.concept.conceptOptions,
  selectedId: state.sites.selectedId,
  idleFlag: state.error.idleFlag,
  timeoutFlag: state.error.timeoutFlag,
  isScheduleOrderEnabled: state.scheduleorder.isScheduleOrderEnabled,
  hideScheduleTime: state.scheduleorder.hideScheduleTime,
  error: state.error,
  isOrderGuidInvalid: state.app.isOrderGuidInvalid
}),
(dispatch) => ({
  setIdleFlag: (flag) => dispatch(setIdleFlag(flag)),
  setTimeoutFlag: (flag) => dispatch(setTimeoutFlag(flag)),
  clearIdleFlags: () => dispatch(clearIdleFlags()),
  closeLoginPopup: () => dispatch(closeLoginPopup()),
  showSavedCardsPopup: (flag) => dispatch(showSavedCardsPopup(flag))
}))(
  ({cboConfig,
    digitalMenuId,
    siteAuth,
    cartOpen,
    location,
    conceptOptions,
    selectedId,
    idleFlag,
    setIdleFlag,
    setTimeoutFlag,
    clearIdleFlags,
    closeLoginPopup,
    showSavedCardsPopup,
    isScheduleOrderEnabled,
    isOrderGuidInvalid,
    hideScheduleTime }) => {
    if (cboConfig && !cboConfig.fetching) {
      theme.colors = themeUpdate(cboConfig.config.theme).colors;
      window.document.title = (cboConfig.config && cboConfig.config.groupName) ? cboConfig.config.groupName : '';
    }
    let background = getBackground(cboConfig, location, conceptOptions, selectedId);
    currentIdleFlag = idleFlag;
    const onAction = () => {
      setTimeout(() => {
        if (!currentIdleFlag) { clearIdleFlags(); }
        clearTimeout(timeoutTimer);
      });
    };
    const onIdle = () => {
      setTimeout(() => {
        setIdleFlag(true);
        timeoutTimer = setTimeout(() => {
          closeLoginPopup();
          showSavedCardsPopup(false);
          setTimeoutFlag(true);
        }, (config.idle.timeout) * 1000);
      });
    };

    return <ConnectedRouter history={history} >
      <ThemeProvider
        theme={theme}
        role='main'
        style={{
          height: '100%',
          flexDirection: 'column',
          display: 'flex'
        }}>
        <AppBackground className='app-background'>
          {background &&
          background.showImage === 'true'
            ? <UrlImageLoader
              src={config.getPOSImageURL(background.contextID, background.desktopBackground, cboConfig.config.tenantID)} />
            : <AppBackground className='app-background-color' style={{backgroundColor: background.desktopBackground ? background.desktopBackground : theme.colors.light}} />}
        </AppBackground>
        {background && background.mobileBackground
          ? <AppBackgroundMobile className='app-background-mobile' id='app-background' style={{backgroundColor: background.mobileBackground}}/>
          : <AppBackgroundMobile className='app-background-mobile-color' id='app-background' style={{backgroundColor: theme.colors.light}}/>}
        <I18nextProvider i18n={i18n} >
          <React.Fragment>
            {!digitalMenuId &&
            <IdleTimer
              element={document}
              onActive={() => {}}
              onIdle={onIdle}
              onAction={onAction}
              debounce={250}
              timeout={config.idle.warning * 1000} />
            }
            <ParentStyle className='parent' id='parent'>
              <Route className='TopContainer' render={({ match, location, history }) => (
                <TopContainer className='TopContainer'>
                  <Switch>
                    {isScheduleOrderEnabled && <Route exact path='/' render={({ match, location, history }) => (
                      <Box width={1}>
                        <ConnectedNav
                          showHomeLink
                          showBackLink={!digitalMenuId}
                          showCartLink
                          section='home'
                          match={match}
                          cartOpen={cartOpen}
                          showLogOutLink={showLogOutLink(siteAuth)}
                          backLink={<ConnectedBackLink section='home' match={match} history={history} location={location} />}
                          location={location}
                          history={history}
                        />
                        {hideScheduleTime && <ConnectedContextBar
                          showOpenTime
                          section='home'
                          match={match}
                          backLink={<ConnectedBackLink showText section='home' match={match} location={location} />}
                        />}
                      </Box>
                    )} />
                    }
                    <Route exact path='/concepts/:siteId/:displayProfileId' render={({ match, location, history }) => (
                      <Box width={1}>
                        <ConnectedNav
                          showBackLink
                          showHomeLink={!digitalMenuId}
                          showCartLink
                          section='site'
                          match={match}
                          cartOpen={cartOpen}
                          showLogOutLink={showLogOutLink(siteAuth)}
                          backLink={<ConnectedBackLink section='site' match={match} location={location} />}
                          location={location}
                          history={history}
                        />
                        <ConnectedContextBar
                          showOpenTime
                          section='site'
                          match={match}
                          backLink={<ConnectedBackLink showText section='site' match={match} location={location} />}
                        />
                      </Box>
                    )} />
                    <Route
                      exact
                      path='/menu/:siteId/:displayProfileId/:conceptId/:categoryId?'
                      render={({ match, location, history }) => (
                        <Box width={1}>
                          <ConnectedNav
                            showBackLink
                            showHomeLink
                            showCartLink
                            section='menu'
                            match={match}
                            showLogOutLink={showLogOutLink(siteAuth)}
                            backLink={<ConnectedBackLink section='menu' match={match} location={location} />}
                            location={location}
                            history={history}
                          />
                          <ConnectedContextBar
                            showOpenTime
                            section='menu'
                            match={match}
                            backLink={<ConnectedBackLink showText section='menu' match={match} location={location} />}
                          />
                        </Box>
                      )} />
                    <Route
                      exact
                      path='/menu/:siteId/:displayProfileId/:conceptId/:categoryId/:itemId' render={({ match, location, history }) => (
                        <Box width={1}>
                          <ConnectedNav
                            showBackLink
                            showHomeLink
                            showCartLink
                            section='item'
                            match={match}
                            cartOpen={cartOpen}
                            showLogOutLink={showLogOutLink(siteAuth)}
                            backLink={<ConnectedBackLink section='item' match={match} location={location} />}
                            location={location}
                            history={history}
                          />
                          <ConnectedContextBar
                            showOpenTime
                            section='item'
                            match={match}
                            backLink={<ConnectedBackLink showText section='item' match={match} location={location} />}
                          />
                        </Box>
                      )}
                    />
                    <Route
                      exact
                      path='/deliveryLocation' render={({ match, location, history }) => (
                        <Box width={1}>
                          <ConnectedNav
                            showBackLink
                            showHomeLink
                            showCartLink
                            section='delivery'
                            match={match}
                            cartOpen={cartOpen}
                            showLogOutLink={showLogOutLink(siteAuth)}
                            backLink={<ConnectedBackLink section='delivery' match={match} location={location} />}
                            location={location}
                            history={history}
                          />
                          <ConnectedContextBar
                            showText
                            section='delivery'
                            delivery
                            match={match}
                            backLink={<ConnectedBackLink showText section='delivery' match={match} location={location} />}
                          />
                        </Box>
                      )}
                    />
                    <Route
                      exact
                      path='/smsNotification' render={({ match, location, history }) => (
                        <Box width={1}>
                          <ConnectedNav
                            showBackLink
                            showHomeLink
                            showCartLink
                            section='smsnotification'
                            match={match}
                            cartOpen={cartOpen}
                            showLogOutLink={showLogOutLink(siteAuth)}
                            backLink={<ConnectedBackLink section='smsnotification' match={match} location={location} />}
                            location={location}
                            history={history}
                          />
                          <ConnectedContextBar
                            showText
                            section='smsnotification'
                            smsnotification
                            match={match}
                            backLink={<ConnectedBackLink showText section='smsnotification' match={match} location={location} />}
                          />
                        </Box>
                      )}
                    />
                    <Route
                      exact
                      path='/nameCapture' render={({ match, location, history }) => (
                        <Box width={1}>
                          <ConnectedNav
                            showBackLink
                            showHomeLink
                            showCartLink
                            section='namecapture'
                            match={match}
                            cartOpen={cartOpen}
                            showLogOutLink={showLogOutLink(siteAuth)}
                            backLink={<ConnectedBackLink section='namecapture' match={match} location={location} />}
                            location={location}
                            history={history}
                          />
                          <ConnectedContextBar
                            showText
                            section='namecapture'
                            namecapture
                            match={match}
                            backLink={<ConnectedBackLink showText section='namecapture' match={match} location={location} />}
                          />
                        </Box>
                      )}
                    />
                    <Route
                      exact
                      path='/tip' render={({ match, location, history }) => (
                        <Box width={1}>
                          <ConnectedNav
                            showBackLink
                            showHomeLink
                            showCartLink
                            section='tip'
                            match={match}
                            cartOpen={cartOpen}
                            showLogOutLink={showLogOutLink(siteAuth)}
                            backLink={<ConnectedBackLink section='tip' match={match} location={location} />}
                            location={location}
                            history={history}
                          />
                          <ConnectedContextBar
                            showText
                            section='tip'
                            tip
                            match={match}
                            backLink={<ConnectedBackLink showText section='tip' match={match} location={location} />}
                          />
                        </Box>
                      )}
                    />
                    <Route render={({ match, location, history }) => (
                      <Box width={1}>
                        <ConnectedNav
                          showHomeLink
                          showBackLink
                          showCartLink
                          section='payment'
                          match={match}
                          cartOpen={cartOpen}
                          showLogOutLink={showLogOutLink(siteAuth)}
                          backLink={(location.pathname === '/payment' || location.pathname === '/paymentComponent') &&
                            <ConnectedBackLink section='payment' match={match} payment history={history} location={location} />}
                          location={location}
                          history={history}
                        />
                        {location.pathname === '/payment' && <ConnectedContextBar
                          showOpenTime
                          section='payment'
                          match={match}
                          backLink={
                            <ConnectedBackLink
                              showText
                              section='payment'
                              match={match}
                              payment
                              history={history}
                              location={location}
                            />}
                        />}
                        <ConnectedGAPayment
                          match={match}
                          location={location}
                          history={history} />
                      </Box>
                    )}
                    />
                  </Switch>
                </TopContainer>
              )}
              />
              <SwitchContainer className='BottomContainer' history={history}>
                <Switch>
                  <Route exact path='/' component={App} />
                  <Route exact path='/demo' component={Demo} />
                  <Route exact path='/paymentSuccess' component={ConnectedPaySuccess} />
                  <Route exact path='/paymentComponent' component={ConnectedPayment} />
                  <Route exact path='/payment' component={Payment} />
                  <Route exact path='/cart' component={Cart} />
                  <Route exact path='/ga' component={GA} />
                  <Route exact path='/logout' component={Logout} />
                  <Route exact path='/concepts/:siteId/:displayProfileId' component={Concepts} />
                  <Route exact path='/menu/:siteId/:displayProfileId/:conceptId/:categoryId?' component={Menu} />
                  <Route exact path='/menu/:siteId/:displayProfileId/:conceptId/:categoryId/:itemId' component={ItemDetailsPage} />
                  <Route exact path='/deliveryLocation' component={DeliveryLocationPage} />
                  <Route exact path='/tip' component={TipCapturePage} />
                  <Route exact path='/smsNotification' component={SmsNotificationPage} />
                  <Route exact path='/nameCapture' component={nameCapturePage} />
                  <Route exact path='/404' component={() => (<h1>404</h1>)} />
                  <Redirect from='*' to='/404' />
                </Switch>
              </SwitchContainer>
              <ErrorMessage history={history}/>
              <IdleMessage history={history} />
              <Loyalty history={history} />
              {(siteAuth && siteAuth.type && (siteAuth.type === 'socialLogin' || siteAuth.type === 'atrium')) && <GuestProfileLogin history={history} />}
              <SavedCardsPage history={history} location={location}/>
              {isOrderGuidInvalid && <ConnectedOrderGuidModal/>}
            </ParentStyle>
          </React.Fragment>
        </I18nextProvider>
      </ThemeProvider>
    </ConnectedRouter>;
  });
class AppContainer extends Component {
  render () {
    return (
      <Provider store={store}>
        <ConnectedAppContainer />
      </Provider>
    );
  }
}
const AppRoot = hot(module)(AppContainer);
const renderApp = async () => {
  if (await authorized) {
    ReactDOM.render(
      <AppRoot />,
      document.getElementById('appContainer')
    );
  }
};
renderApp();
