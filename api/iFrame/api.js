// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import config from 'app.config';
import path from 'path';
import axios from 'axios';
import Agilysys, { paymentUtils } from 'agilysys.lib';
import get from 'lodash.get';

const logger = config.logger.child({component: path.basename(__filename)});

export default {
  getToken: async (credentials, request) => {
    const payload = request.payload;
    const agilysys = new Agilysys(credentials);
    const profileDetails = await agilysys.getDetails(payload.contextId, payload.profileId);
    const useProfitCenterByConcept = get(profileDetails, 'displayProfile.featureConfigurations.profitCenter.useProfitCenterByConcept', false);
    let concept;
    if (useProfitCenterByConcept) {
      concept = await agilysys.getConcept(payload.contextId, payload.conceptId);
    }
    const iframeConfig = paymentUtils.getIframeConfiguration(profileDetails.displayProfile, useProfitCenterByConcept, concept);
    const iframeTenantID = get(iframeConfig, 'config.iframeAuth.iFrameTenantID');
    const tokenResponse = await axios({
      method: 'post',
      url: `${get(iframeConfig, 'config.iframeAuth.iFrameUserApi')}/user-service/apiUser/tenants/${iframeTenantID}/authenticateApiUser`, // eslint-disable-line max-len
      data: get(iframeConfig, 'config.iframeAuth'),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(response => {
      return response.data;
    }
    )
      .catch(err => {
        logger.error('Get token failed. An error occured.', err);
        throw err;
      });

    return axios({
      method: 'get',
      url: `${get(iframeConfig, 'config.iframeAuth.iFrameApi')}/pay-iframe-service/iFrame/tenants/${iframeTenantID}/${get(iframeConfig, 'config.iframeAuth.clientId')}?apiToken=${tokenResponse.token}&doVerify=true&version=3` // eslint-disable-line max-len
    }).then(response => {
      return tokenResponse;
    }
    )
      .catch(err => {
        logger.error('Get iFrame failed. An error occured.', err);
        throw err;
      });
  }

};
