// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

/* eslint-disable max-len */
'use strict';
import config from 'app.config';
import getWebpackAssets from 'web/server/get-webpack-assets';
import React from 'react';
import newRelic from 'newrelic';
import Head from './head';

import { css, ServerStyleSheet, ThemeProvider } from 'styled-components';
import Loading from 'web/client/app/components/Loader/loading';

import theme from 'web/client/theme';

const loadingTheme = {
  colors: {
    ...theme.colors,
    light: theme.colors.loginBackground,
    tertiary: theme.colors.light
  },
  mediaBreakpoints: {
    mobile: (...args) => css`@media (max-width: 32em) {${css(...args)}}`,
    tablet: (...args) => css`@media (max-width: 72em) {${css(...args)}}`,
    desktop: (...args) => css`@media (min-width: 72em) {${css(...args)}}`
  }
};

const sheet = new ServerStyleSheet();

class App extends React.Component {
  render () {
    const style = {
      height: '100%',
      margin: 0
    };
    const flexContainer = {
      ...style,
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    };

    return (
      <html style={style} lang='en-US'>
        <Head>
          <script
            dangerouslySetInnerHTML={{ __html: `var BASE_PATH = '${config.webPaths.parts.base}'; var computeBaseFn = ${config.webPaths.computedBasePath}; document.write("<base href='" + (computeBaseFn(window.location)) + "'/>");` }} />
          <meta charSet='utf-8' />
          {newRelic.getBrowserTimingHeader()}
          <meta name='viewport' content='width=device-width, initial-scale=1, maximum-scale=1' />
          <script
            dangerouslySetInnerHTML={{ __html: `document.write("<link rel='shortcut icon' type='image/x-icon' href='" + (computeBaseFn(window.location)) + "${config.webPaths.assets}favicon.ico'/>");` }} />
          <script dangerouslySetInnerHTML={{
            __html: `
            ${getWebpackAssets().vendor.css ? `
                var vendor_css = document.createElement('link');
                vendor_css.rel = "stylesheet";
                vendor_css.type = "text/css";
                vendor_css.href = "${getWebpackAssets().vendor.css}";
                document.head.appendChild(vendor_css);` : 'console.log("no css");'}
            ${getWebpackAssets().vendor.css ? `
                var app_css = document.createElement('link');
                app_css.rel = "stylesheet";
                app_css.type = "text/css";
                app_css.href = "${getWebpackAssets().login.css}";
                document.head.appendChild(app_css);` : 'console.log("no app css");'}
            var LOAD_RESOURCES = function() {
              var vendor = document.createElement('script');
              vendor.src = "${getWebpackAssets().vendor.js}";
              document.head.appendChild(vendor);
              var login = document.createElement('script');
              login.src = "${getWebpackAssets().login.js}"
              document.head.appendChild(login);
              document.removeEventListener("DOMContentLoaded", this);
            }
            if (document.readyState === "complete" || (document.readyState !== "loading" && !document.documentElement.doScroll)) {
              LOAD_RESOURCES();
            } else {
              document.addEventListener("DOMContentLoaded", LOAD_RESOURCES);
            }
          ` }} />
          {sheet.getStyleElement()}
        </Head>
        <body style={style}>
          <input type='hidden' id='emailAddress' value={this.props.emailAddress} />
          <input type='hidden' id='loginToken' value={this.props.loginToken} />
          <input type='hidden' id='siteAuth' value={this.props.siteAuth} />
          <input type='hidden' id='tenantId' value={this.props.tenantId} />
          <input type='hidden' id='cboConfig' value={JSON.stringify(this.props.cboConfig)} />
          <div id='appContainer' className='flex-container container' style={flexContainer}>
            <ThemeProvider theme={loadingTheme}>
              <Loading />
            </ThemeProvider>
          </div>
        </body>

      </html>
    );
  };
}

module.exports = App;
