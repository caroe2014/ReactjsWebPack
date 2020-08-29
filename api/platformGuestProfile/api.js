import Agilysys from 'agilysys.lib';
import Boom from 'boom';
import config from 'app.config';
import path from 'path';
import axios from 'axios';
import envConfig from 'env.config';
import get from 'lodash.get';

const logger = config.logger.child({ component: path.basename(__filename) });

const getAxiosClient = (payload) => {
  const guestProfileTenantId = get(payload, 'platformGuestProfileConfig.tenantId');
  const guestProfileContextId = get(payload, 'platformGuestProfileConfig.contextId', 'Default');
  return axios.create({
    baseURL: `${envConfig.guestProfileBaseUrl}profile/tenants/${guestProfileTenantId}/context/${guestProfileContextId}`,
    headers: {
      'X-Gateway-Key': envConfig.guestProfileGatewayKey
    }
  });
};

const api = {
  searchProfile: async (credentials, payload) => {
    return getAxiosClient(payload).get('/search', {params: payload.queryParams})
      .then(response => {
        return response.data;
      })
      .catch(err => {
        logger.error('searchProfile failed. An error occured.', err);
        throw err;
      });
  },
  createProfile: async (credentials, payload) => {
    let formattedPayload;
    const guestProfileTenantId = get(payload, 'platformGuestProfileConfig.tenantId');
    const guestProfileContextId = get(payload, 'platformGuestProfileConfig.contextId', 'Default');
    if (payload.paymentType === 'credit') {
      formattedPayload = {
        tenantId: guestProfileTenantId,
        businessContext: guestProfileContextId,
        correlationIds: [payload.paymentNumber],
        gpBusinessCard: {
          tenantId: guestProfileTenantId,
          businessContext: guestProfileContextId,
          givenName: payload.surName || 'anonymous',
          surname: payload.givenName || 'anonymous'
        }
      };
    } else {
      formattedPayload = {
        tenantId: guestProfileTenantId,
        businessContext: guestProfileContextId,
        gpBusinessCard: {
          tenantId: guestProfileTenantId,
          businessContext: guestProfileContextId,
          givenName: payload.surName || 'anonymous',
          surname: payload.givenName || 'anonymous',
          membershipCards: [
            {
              membershipNumber: payload.paymentNumber,
              membershipProviderUuid: get(payload, 'platformGuestProfileConfig.membershipProviderConfiguration.GA.membershipProviderUUID', '')
            }
          ]
        }
      };
    }
    return getAxiosClient(payload).post('', formattedPayload)
      .then(response => {
        return response.data;
      })
      .catch(err => {
        logger.error('createProfile failed. An error occured.', err);
        throw err;
      });
  },
  updateProfile: async (credentials, payload) => {
    return getAxiosClient(payload).put('', payload.profile)
      .then(response => {
        return response.data;
      })
      .catch(err => {
        logger.error('updateProfile failed. An error occured.', err);
        throw err;
      });
  }
};

export default api;
