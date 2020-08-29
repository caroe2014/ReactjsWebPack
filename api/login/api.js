// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import config from 'app.config';
import envConfig from 'env.config';
import path from 'path';
import Boom from 'boom';
import uuid from 'uuid/v1';
import amqp from 'amqplib';
import email from '../../web/validation/login/email';
import Agilysys from 'agilysys.lib';

const logger = config.logger.child({ component: path.basename(__filename) });

// TODO - make this come from config/service call.
const tenantsByEmailDomain = envConfig.domain; // TODO: Make this a real lookup

const fetchTenantId = (emailDomain) => {
  const tenantId = tenantsByEmailDomain.toLowerCase().indexOf(emailDomain.toLowerCase()) >= 0 && envConfig.tenantID;
  return tenantId;
};

const getTenantId = (emailAddress) => {
  // look up in map, if not in map fetch
  const emailDomain = emailAddress.split("@")[1].split(".")[0];
  let tenantId = fetchTenantId(emailDomain);
  return tenantId;
};

const validateEmailAddress = (emailAddress) => {
  const tenantId = getTenantId(emailAddress);
  if (!tenantId) {
    throw new Error(`no tenant found for email address ${emailAddress}`);
  }
};

const buildEmailLink = (emailAddress, requestInfo) => {
  const loginToken = uuid();
  const link = `${requestInfo.referrer}/email/${emailAddress}/${loginToken}`; // `${config.server.protocol}://${requestInfo.host}${config.webPaths.base}/login/email/${emailAddress}/${loginToken}`;

  return {
    link,
    loginToken
  };
};

const connectToRabbit = async (emailAddress, linkToken) => {
  const tenantId = getTenantId(emailAddress);
  const conn = await amqp.connect(config.server.amqp);
  const channel = await conn.createChannel();
  await channel.assertExchange(config.server.loginExchangeName, 'direct', {
    durable: true,
    autoDelete: false
  });
  const q = await channel.assertQueue(config.server.loginQueueName(tenantId, emailAddress, linkToken), { durable: true, exclusive: false, expires: 600000 }); // eslint-disable-line max-len
  channel.bindQueue(q.queue, config.server.loginExchangeName, q.queue);
  return {
    channel,
    conn,
    q,
    sendMessage: (json) => {
      channel.sendToQueue(q.queue, new Buffer(JSON.stringify(json)));
    },
    receiveMessage: (cb) => {
      channel.consume(q.queue, cb, { noAck: true });
    },
    close: (cb, deleteQueue) => {
      setTimeout(async () => {
        if (cb && typeof (cb) === 'function') {
          await cb();
        }
        if (deleteQueue) {
          await channel.deleteQueue(q.queue);
        }
        conn.close();
      }, 5000);
    },
    deleteQueue: () => {

    }
  };
};

export default {
/*
 * 1) validate email address: match configured pattern such as amex.com
 * 2) build email link with uuid as login token value
 * 3) create rabbit exchange: rguest.buy.cloud.desktop.login
 *       - producer:
 *                   routing key: rguest.buy.cloud.desktop.login.tenants.[value].email.[value].uuid.[value]
 *       - consumer:
 *                   binding key: rguest.buy.cloud.desktop.login.tenants.[value].email.[value].uuid.[value]
 *                         queue: rguest.buy.cloud.desktop.login.tenants.[value].email.[value].uuid.[value]
 * 4) send rmq message: short lived, one time use, queue dies after use or ttl expiration
 * 5) send email with link
 * 6) response:
 *       200 ok
 *       TODO failure cases/http error codes (obfuscate auth details?)
 */
  sendEmail: async (emailAddress, requestInfo) => {
    try {
      validateEmailAddress(emailAddress);
    } catch (ex) {
      logger.debug(ex.message);
      return Boom.badRequest('Invalid Email Address');
    }
    try {
      let linkInfo = buildEmailLink(emailAddress, requestInfo);
      linkInfo.tenantId = getTenantId(emailAddress);
      const connection = await connectToRabbit(emailAddress, linkInfo.loginToken);
      await connection.sendMessage(linkInfo);
      logger.debug(`Sent Validation Link: ${linkInfo.link}`);
      connection.close();
      return linkInfo.link;
    } catch (ex) {
      logger.debug(ex);
      return Boom.serverUnavailable('Error Sending Email.');
    }
  },
/*
 *      * 6) parse tenant, email address, uuid from link
 *      - matches then ok
 *                - http 200
 *                - tenant id in response (?? header, body.. TODO)
 *                - TODO add to README in gateway service what the contract
 *      - if not, fail
 */
  validateLink: async (loginToken, emailAddress) => {

    const connection = await connectToRabbit(emailAddress, loginToken);
    let success = false;
    const promiseMessage = (resolve, reject) => {
      connection.receiveMessage((msg) => {
        if (msg) {
          resolve(JSON.parse(msg.content.toString()));
          success = true;
        }
      });
      connection.close(() => {
        if (!success) {
          reject(Boom.teapot('fweeeet!'));
        }
      }, true);
    };
    const message = new Promise(promiseMessage);
    logger.info(`validate link! loginToken: ${loginToken}`);

    return message;
  },
  gatewayLogin: async (tenantConfig) => {
    const credentials = {
      tenantId: tenantConfig.tenantID,
      tenantConfig: tenantConfig
    };

    const agilysys = new Agilysys(credentials);
    return await agilysys.login();
  }
};
