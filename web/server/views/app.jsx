// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

/* eslint-disable max-len */
'use strict';
import config from 'app.config';
import getWebpackAssets from 'web/server/get-webpack-assets';
import React from 'react';
import Head from './head';
import newRelic from 'newrelic';
import { ServerStyleSheet, ThemeProvider } from 'styled-components';
import Loading from 'web/client/app/components/Loader/loading';
import theme from 'web/client/theme';

const sheet = new ServerStyleSheet();

class App extends React.Component {

  render () {
    const style = {
      height: '100%',
      margin: 0
    };
    const bodyStyle = {
      ...style,
      overflowY: 'auto',
      WebkitOverflowScrolling: 'touch'
    };
    const flexContainer = {
      margin: 0,
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    };

    return (
      <html style={style} lang='en-US'>
        <Head>
          <meta charSet='utf-8' />
          {newRelic.getBrowserTimingHeader()}
          <meta name='viewport' content='width=device-width, initial-scale=1, minimum-scale=1,viewport-fit=cover'/>
          <meta name='apple-mobile-web-app-capable' content='yes'/>
          <meta name='mobile-web-app-capable' content='yes'/>
          <script
            dangerouslySetInnerHTML={{ __html: `var BASE_PATH = '${config.webPaths.parts.base}'; var computeFavFn = ${config.webPaths.computeFavPath}; var computeBaseFn = ${config.webPaths.computedBasePath}; document.write("<base href='" + (computeBaseFn(window.location)) + "'/>");` }} />
          {/* <link rel='mask-icon' href={`${config.webPaths.assets}safari-pinned-tab.svg`} color='#ffffff'/> */}
          <link rel='manifest' href={`${config.webPaths.assets}manifest.json`}/>
          <script
            dangerouslySetInnerHTML={{ __html: `document.write("<link rel='shortcut icon' type='image/x-icon' href='" + (computeFavFn(computeBaseFn(window.location), '${config.webPaths.assets}favicon.ico')) + "'/>");` }} />
          {/* <meta name='apple-mobile-web-app-title' content='OnDemand'/> */}
          <meta name='apple-mobile-web-app-status-bar-style' content='black'/>
          <meta name='application-name' content='IG OnDemand'/>
          {/* <meta name='msapplication-TileColor' content='#ffffff'/> */}
          <meta name='msapplication-config' content={`${config.webPaths.assets}browserconfig.xml`}/>
          {/* <meta name='theme-color' content='#ffffff'/> */}
          {/* IOS Splash Screens start for different resolutions */}
          <link rel='apple-touch-startup-image' href={`${config.webPaths.assets}splashscreens/apple-launch-320x640.png`}/>
          {/* iPhone 8, 7, 6s, 6 (750px x 1334px) */}
          <link rel='apple-touch-startup-image' media='(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)' href={`${config.webPaths.assets}splashscreens/apple-launch-750x1334.png`}/>
          {/* iPhone 8 Plus, 7 Plus, 6s Plus, 6 Plus (1242px x 2208px) */}
          <link rel='apple-touch-startup-image' media='(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3)' href={`${config.webPaths.assets}splashscreens/apple-launch-1242x2208.png`}/>
          <link href={`${config.webPaths.assets}splashscreens/apple-launch-640x920.png`} media='(device-width: 320px) and (device-height: 460px) and (-webkit-device-pixel-ratio: 2)' rel='apple-touch-startup-image'/>
          <link href={`${config.webPaths.assets}splashscreens/apple-launch-640x1096.png`} media='(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)' rel='apple-touch-startup-image'/>
          {/* iPhone 5 (640px x 1136px) */}
          <link rel='apple-touch-startup-image' media='(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)' href={`${config.webPaths.assets}splashscreens/apple-launch-640x1136.png`}/>
          <link href={`${config.webPaths.assets}splashscreens/apple-launch-1125x2436.png`} media='(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)' rel='apple-touch-startup-image' />
          <link href={`${config.webPaths.assets}splashscreens/apple-launch-1242x2208.png`} media='(device-width: 621px) and (device-height: 1104px) and (-webkit-device-pixel-ratio: 3)' rel='apple-touch-startup-image' />
          {/* iPad Mini, Air (1536px x 2048px) */}
          <link rel='apple-touch-startup-image' media='(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2)' href={`${config.webPaths.assets}splashscreens/apple-launch-1536x2048.png`}/>
          {/* iPad Pro 10.5" (1668px x 2224px) */}
          <link rel='apple-touch-startup-image' media='(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2)' href={`${config.webPaths.assets}splashscreens/apple-launch-1668x2224.png`}/>
          {/* iPad Pro 12.9" (2048px x 2732px) */}
          <link rel='apple-touch-startup-image' media='(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2)' href={`${config.webPaths.assets}splashscreens/apple-launch-2048x2732.png`}/>
          {/* IOS Splash Screens end for different resolutions */}

          {/* IOS App Icons start for different resolutions */}
          <link rel='apple-touch-icon' sizes='57x57' href={`${config.webPaths.assets}apple-touch-icon/apple-touch-icon-57x57.png`}/>
          <link rel='apple-touch-icon' sizes='60x60' href={`${config.webPaths.assets}apple-touch-icon/apple-touch-icon-60x60.png`}/>
          <link rel='apple-touch-icon' sizes='72x72' href={`${config.webPaths.assets}apple-touch-icon/apple-touch-icon-72x72.png`}/>
          <link rel='apple-touch-icon' sizes='76x76' href={`${config.webPaths.assets}apple-touch-icon/apple-touch-icon-76x76.png`}/>
          <link rel='apple-touch-icon' sizes='114x114' href={`${config.webPaths.assets}apple-touch-icon/apple-touch-icon-114x114.png`}/>
          <link rel='apple-touch-icon' sizes='120x120' href={`${config.webPaths.assets}apple-touch-icon/apple-touch-icon-120x120.png`}/>
          <link rel='apple-touch-icon' sizes='144x144' href={`${config.webPaths.assets}apple-touch-icon/apple-touch-icon-144x144.png`}/>
          <link rel='apple-touch-icon' sizes='152x152' href={`${config.webPaths.assets}apple-touch-icon/apple-touch-icon-152x152.png`}/>
          <link rel='apple-touch-icon' sizes='180x180' href={`${config.webPaths.assets}apple-touch-icon/apple-touch-icon-180x180.png`}/>
          {/* IOS App Icons start for different resolutions */}
          <script type='text/javascript' src='https://js.stripe.com/v3/' />
          <script
            dangerouslySetInnerHTML={{
              __html: `
            ${getWebpackAssets().vendor.css ? `
                var vendor_css = document.createElement('link');
                vendor_css.rel = "stylesheet";
                vendor_css.type = "text/css";
                vendor_css.href = "${getWebpackAssets().vendor.css}";
                document.head.appendChild(vendor_css);` : 'console.log("no vendor css");'}
            ${getWebpackAssets().vendor.css ? `
                var app_css = document.createElement('link');
                app_css.rel = "stylesheet";
                app_css.type = "text/css";
                app_css.href = "${getWebpackAssets().app.css}";
                document.head.appendChild(app_css);` : 'console.log("no app css");'}
            var LOAD_RESOURCES = function() {
              var vendor = document.createElement('script');
              vendor.src = "${getWebpackAssets().vendor.js}";
              document.head.appendChild(vendor);
              var app = document.createElement('script');
              app.src = "${getWebpackAssets().app.js}"
              document.head.appendChild(app);
              document.removeEventListener("DOMContentLoaded", this);
            }
            if (document.readyState === "complete" || (document.readyState !== "loading" && !document.documentElement.doScroll)) {
              LOAD_RESOURCES();
            } else {
              document.addEventListener("DOMContentLoaded", LOAD_RESOURCES);
            }
          ` }}
          />
          {sheet.getStyleElement()}
        </Head>
        <body style={bodyStyle} >
          <ThemeProvider theme={theme}>
            <div className='appContainer' id='appContainer' style={flexContainer} >
              <Loading />
            </div>
          </ThemeProvider>
        </body>
      </html>
    );
  }
}

module.exports = App;
