// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import React from 'react';
import ReactDOMServer from 'react-dom/server';

export default class Head extends React.Component {
  render () {
    let dangerousInnerHTML = this.props.children.map(value => {
      if (typeof value !== 'string') { return ReactDOMServer.renderToStaticMarkup(value); } else { return value; }
    });
    return (
      <head dangerouslySetInnerHTML={{ __html: dangerousInnerHTML.join('') }} />
    );
  }
}
