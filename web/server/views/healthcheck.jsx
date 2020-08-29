// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

/* eslint-disable max-len */
'use strict';
import config from 'app.config';
import getWebpackAssets from 'web/server/get-webpack-assets';
import React from 'react';
import newRelic from 'newrelic';
import Head from './head';

class App extends React.Component {

  render () {
    const style = {
      height: '100%',
      margin: 0
    };

    return (
      <html style={style} lang='en-US'>
        <Head>
          <meta charSet='utf-8' />
          {newRelic.getBrowserTimingHeader()}
          <meta name='viewport' content='width=device-width, initial-scale=1' />
          <link rel='icon' href='data:;base64,iVBORw0KGgo=' />
          <script
            dangerouslySetInnerHTML={{ __html: `var BASE_PATH = '${config.webPaths.parts.base}'; var computeFavFn = ${config.webPaths.computeFavPath}; var computeBaseFn = ${config.webPaths.computedBasePath}; document.write("<base href='" + (computeBaseFn(window.location)) + "'/>");` }} />
          <script
            dangerouslySetInnerHTML={{ __html: `document.write("<link rel='shortcut icon' type='image/x-icon' href='" + (computeFavFn(computeBaseFn(window.location), '${config.webPaths.assets}favicon.ico')) + "'/>");` }} />
          <title>IG OnDemand</title>
        </Head>
        <body style={style}>
          <div id='appContainer' className='flex-container container' style={style}>
            Loading...
          </div>
        </body>
        <script src={getWebpackAssets().vendor.js} />
        <script async src={getWebpackAssets().healthcheck.js} />
      </html>
    );
  };
}

module.exports = App;
