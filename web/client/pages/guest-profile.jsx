// Copyright © 2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import GuestProfile from 'web/client/app/components/GuestProfile';
import { closeLoginPopup, setUserData, continueWithPay, saveUserPage } from 'web/client/app/modules/guestProfile/sagas';
import { Fixed } from 'rebass';
import styled from 'styled-components';
import Loader from 'web/client/app/components/Loader/index';
import get from 'lodash.get';

const GOOGLE_OAUTH_SDK = 'https://apis.google.com/js/api.js';

const LoadingContainer = styled(Fixed)`
  display:flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1101;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  opacity: 1;
  will-change: opacity;
  transition: opacity 225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
`;

class GuestProfileLogin extends Component {
  constructor (props) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
    this.loginMethod = this.loginMethod.bind(this);
    this.checkLoginState = this.checkLoginState.bind(this);
    this.statusChangeCallback = this.statusChangeCallback.bind(this);
    this.initializeGoogle = this.initializeGoogle.bind(this);
    this.loadScript = this.loadScript.bind(this);
    this.createFBUserDataPayload = this.createFBUserDataPayload.bind(this);
    this.createGoogleUserDataPayload = this.createGoogleUserDataPayload.bind(this);
    this.googleSignIn = this.googleSignIn.bind(this);
    this.handleGoogleSignInSuccess = this.handleGoogleSignInSuccess.bind(this);
    this.handleGoogleSignInFailure = this.handleGoogleSignInFailure.bind(this);
    this.showAtriumLogin = this.showAtriumLogin.bind(this);
    this.makeEverythingAccessible = this.makeEverythingAccessible.bind(this);
  }

  handleClose () {
    this.makeEverythingAccessible();
    this.props.closeLoginPopup();
  }

  componentDidMount () {
    this.props.siteAuth.config.loginMethods.forEach(loginMethod => {
      switch (loginMethod.type) {
        case 'facebook':
          this.initializeFB(loginMethod.appId);
          break;
        case 'google':
          this.initializeGoogle(loginMethod.appId);
          break;
      }
    });
  }

  componentWillUnMount () {
    window.fbAsyncInit = undefined;
    window.FB.getLoginStatus = undefined;
  }

  loadScript (d, s, id, jsSdk, cb) {
    const element = d.getElementsByTagName(s)[0];
    const fjs = element;
    let js = element;
    js = d.createElement(s);
    js.id = id;
    js.src = jsSdk;
    if (fjs && fjs.parentNode) {
      fjs.parentNode.insertBefore(js, fjs);
    } else {
      d.head.appendChild(js);
    }
    js.onload = cb;
  }

  initializeGoogle (appId) {
    const { domainURL } = this.props;
    this.loadScript(document, 'script', 'google-login', GOOGLE_OAUTH_SDK, () => {

      window.gapi.load('auth2', () => {
        this.auth2 = window.gapi.auth2.init({
          redirect_uri: domainURL,
          client_id: appId
        });
      });

    });
  }

  initializeFB (appId) {
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: appId,
        cookie: false,
        xfbml: false,
        version: 'v5.0'
      });
    };

    (function (d, s, id) {
      var js; var fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = '//connect.facebook.net/en_US/sdk.js';
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  }

  checkLoginState () {
    window.FB.getLoginStatus(function (response) {
      this.statusChangeCallback(response);
    }.bind(this));
  }

  async statusChangeCallback (response) {
    if (response.status !== 'connected') {
      response = await this.login();
    }
    const userInfo = await this.fetchFbUserInfo();
    const payload = this.createFBUserDataPayload(response, userInfo);
    this.props.setUserData(payload);
  }

  createFBUserDataPayload (fbResponse, userInfo) {
    return {
      loginMode: 'facebook',
      accessToken: fbResponse.authResponse.accessToken,
      userId: fbResponse.authResponse.userID,
      userName: userInfo.name
    };
  }

  createGoogleUserDataPayload (responseObj) {
    const basicProfile = responseObj.getBasicProfile();
    const authResponse = responseObj.getAuthResponse();
    return {
      loginMode: 'google',
      accessToken: authResponse.id_token,
      userName: basicProfile.getName(),
      userId: basicProfile.getId()
    };
  }

  login () {
    return new Promise((resolve, reject) => {
      window.FB.login((response) => {
        response.status === 'connected' ? resolve(response) : reject(response);
      });
    });
  }

  fetchFbUserInfo () {
    return new Promise((resolve, reject) => {
      window.FB.api('/me', function (response) {
        resolve(response);
      });
    });
  }

  googleSignIn () {
    const auth2 = window.gapi.auth2.getAuthInstance();
    const options = {
      ux_mode: 'popup',
      fetch_basic_profile: false,
      scope: 'profile'
    };
    // eslint-disable-next-line max-len
    auth2.signIn(options).then(response => this.handleGoogleSignInSuccess(response), err => this.handleGoogleSignInFailure(err));
  }

  /* eslint-disable max-len */
  showAtriumLogin () {
    const baseOrigin = window.location.origin;
    const webPath = baseOrigin.includes('localhost') ? '/application/ui' : process.env.ENVIRONMENT === 'production' ? '' : '/kiosk-desktop-service/application/ui';
    const samlIdentifierQueryParam = this.props.samlIdentifierFormat ? `&samlIdentifierFormat=${this.props.samlIdentifierFormat}` : '';
    const samlAssertPathOverrideQueryParam = this.props.samlAssertPathOverride ? `&samlAssertPathOverride=${this.props.samlAssertPathOverride}` : '';
    const keystoreOverrideQueryParam = this.props.keystoreLocation ? `&keystoreLocation=${this.props.keystoreLocation}` : '';
    window.location = `${baseOrigin}${webPath}/samllogin?entryPoint=${this.props.atriumEntryPoint}&friendlyName=${this.props.samlFriendlyName}&samlHostDomain=${this.props.samlHostDomain}${samlIdentifierQueryParam}${samlAssertPathOverrideQueryParam}${keystoreOverrideQueryParam}`;
  }

  handleGoogleSignInSuccess (response) {
    const payload = this.createGoogleUserDataPayload(response);
    this.props.setUserData(payload);
  }

  handleGoogleSignInFailure (err) {
    console.log('ERROR OCCURED::' + JSON.stringify(err));
  }

  async loginMethod (method) {
    if (method.type === 'facebook') {
      this.checkLoginState();
    } else if (method.type === 'google') {
      this.googleSignIn();
    } else if (method.type === 'atrium') {
      this.props.saveUserPage(this.props.history.location.pathname);
      this.showAtriumLogin();
    } else if (method.type === 'guest') {
      this.props.continueWithPay();
    }
  }

  makeEverythingAccessible () {
    const parent = document.querySelector('.parent');
    const children = parent.children;
    Array.from(children).forEach(child => {
      if (child.id !== 'guest-login-modal') {
        child.inert = false;
      }
    });
  }

  render () {
    const { showLoginPopup, ondToken, fetching, siteAuth } = this.props;

    return (
      siteAuth ? <Fragment>
        <GuestProfile
          open={showLoginPopup && !ondToken}
          ondToken={ondToken}
          profileConfig={siteAuth.config}
          onCancel={this.handleClose}
          onContinue={this.handleClose}
          selectedLoginMethod={this.loginMethod}
          fetching={fetching}
          authType={siteAuth.type}
          {...this.props}
        />
        {(fetching) && <LoadingContainer><Loader /></LoadingContainer>}
      </Fragment> : null
    );
  }
}

const mapStateToProps = (state, props) => ({
  showLoginPopup: state.profile.showLoginPopup,
  ondToken: state.profile.ondToken,
  fetching: state.profile.fetching,
  hideGuestOption: state.profile.hideGuestOption,
  siteAuth: state.app.config.siteAuth,
  domainURL: state.app.config.domain,
  atriumEntryPoint: get(state, 'app.config.siteAuth.config.integrationUrl'),
  samlFriendlyName: get(state, 'app.config.siteAuth.config.samlFriendlyName'),
  samlHostDomain: get(state, 'app.config.siteAuth.config.samlHostDomain'),
  samlIdentifierFormat: get(state, 'app.config.siteAuth.config.samlIdentifierFormat'),
  samlAssertPathOverride: get(state, 'app.config.siteAuth.config.samlAssertPathOverride'),
  keystoreLocation: get(state, 'app.config.siteAuth.config.keystoreLocation'),
  _props: props
});

const mapDispatchToProps = (dispatch, props) => ({
  closeLoginPopup: () => dispatch(closeLoginPopup()),
  setUserData: (data) => dispatch(setUserData(data)),
  continueWithPay: () => dispatch(continueWithPay()),
  saveUserPage: (lastUserPage) => dispatch(saveUserPage(lastUserPage))
});

export default connect(mapStateToProps, mapDispatchToProps)(GuestProfileLogin);
