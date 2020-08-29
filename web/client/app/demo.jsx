// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import React, { Component } from 'react';
import axios from 'axios';
import config from 'app.config';
import { ValidationError, echo as echoValidator } from 'web/validation';
import joi from 'joi';

const logger = config.logger.child({ childName: 'test' });

class Test extends Component {
  constructor (props) {
    super(props);
    this.state = {
      time: 'Loading...',
      msg: '',
      storeDetails: 'Loading...',
      itemDetails: 'Loading...'
    };
    this.updateTime = this.updateTime.bind(this);
    this.updateMsg = this.updateMsg.bind(this);
    this._msg = this.state.msg;
    this.getStoreDetails = this.getStoreDetails.bind(this);
    this.getItemDetails = this.getItemDetails.bind(this);
  }
  async updateTime () {
    const time = (await axios.get(`${config.webPaths.api}demo/getTime`)).data;
    logger.info(`updateTime: ${time}`);
    this.setState({
      time
    });
  }
  async updateMsg (msg) {
    if (msg.preventDefault) {
      msg.preventDefault();
    }
    const message = typeof msg === 'string' ? msg : this._msg;
    try {
      const { error } = joi.validate({ echo: message }, echoValidator);
      if (error) {
        throw new ValidationError('Validation Error', error);
      }

      const echo = await axios.get(`${config.webPaths.api}demo/echo/${message}`);
      logger.info(`updateMsg: ${echo.data}`);
      this.setState({
        msg: echo.data
      });
    } catch (ex) {
      let messages = [];
      ex.response.status === 400
        ? ex.response.data.details.forEach(m => messages.push(m.message))
        : messages.push(ex.response.data.message);
      messages.forEach(m => logger.error(m));
      this.setState({
        msg: messages.join('\n')
      });
    }
  }
  async getStoreDetails () {
    const details = await axios.get(`${config.webPaths.api}demo/stores`);
    this.setState({ storeDetails: details.data });
    return details.data;
  }
  async getItemDetails () {
    let requestPath = `${config.webPaths.api}demo/items/${this.state.storeDetails[1].businessContextId}`;
    this.state.storeDetails[1].displayProfile.concepts[0].menus[0].items.forEach(itemId => {
      requestPath += `/${itemId}`;
    });
    const details = await axios.get(requestPath);
    this.setState({ itemDetails: details.data });
    return details.data;
  }
  componentDidMount () {
    this.updateTime();
    this.updateMsg('Hello!');
    this.getStoreDetails();
  }
  render () {
    const { time, msg } = this.state;
    const { updateTime, updateMsg } = this;
    return (
      <div>
        <div>
          <h4>{time}</h4>
          <button onClick={updateTime}>Update Time</button>
        </div>
        <div>
          <h4>{msg}</h4>
          <form onSubmit={updateMsg}>
            echo:
            <input name='echo' onChange={(e) => { this._msg = e.target.value; }} type='text' defaultValue={this._msg} />
            <br />
            <button type='submit'>Update Message</button>
            <h1>Store Details</h1>
            { typeof this.state.storeDetails !== 'string' &&
              // <img src={config.getPOSImageURL(store[0].businessContextId, store[0].displayProfile.displayProfileOptions.conceptLogo, store[0].tenantId)} />
              this.state.storeDetails.map(store =>
                <img key={`demoimg-${store.businessContextId}`}
                  src={config.getPOSImageURL(store.businessContextId,
                    store.displayProfile.displayProfileOptions.logoFileName,
                    store.tenantId)}
                />)
            }
            <textarea
              readOnly
              value={JSON.stringify(this.state.storeDetails, null, 2)}
              style={{ width: '100%', height: '400px' }}
            />
          </form>
        </div>
      </div>
    );
  }
}

export default Test;
