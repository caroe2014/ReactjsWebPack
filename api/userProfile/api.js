// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.
import Agilysys from 'agilysys.lib';
import Boom from 'boom';
import GetJWTSigningKey from '../../jwtKeyConfig';
import jwt from 'jsonwebtoken';
import { encrypt, decrypt } from '../util';
import config from 'app.config';
import path from 'path';
import get from 'lodash.get';
import Iron from '@hapi/iron';
import { SAML_COOKIE_PASSWORD } from 'web/client/app/utils/constants';

const logger = config.logger.child({ component: path.basename(__filename) });

const api = {
  guestLogin: async (credentials, values) => {
    try {
      const agilysys = new Agilysys(credentials);

      if (values.ond_token) {
        try {
          const ondTokenPayload = await validateONDToken(values, agilysys);
          if (ondTokenPayload.user_id) {
            try {
              const guestProfile = await agilysys.fetchGuestProfile(getProfileID(ondTokenPayload));

              removeCCTokenFromPayload(guestProfile);
              return decorateGuestProfileResponse(guestProfile, values.ond_token);
            } catch (ex) {
              logger.error('Error occured while fetching guest profile.', ex);
              return Boom.badRequest(ex.message);
            }
          } else {
            logger.error('Received a invalid OND token payload');
            return Boom.badRequest('OND_TOKEN_FAILED');
          }
        } catch (ex) {
          logger.error('Error while validating the OND token', ex);
          return Boom.badRequest('OND_TOKEN_FAILED');
        }
      } else if (values.tokenType === 'facebook') {
        try {
          const guestProfile = await createFBUserProfile(values, agilysys);
          try {
            const tenantConfig = agilysys.getTenantConfig();
            const clientId = getAuthClientIdByType(tenantConfig, 'facebook');
            const longLiveToken = await agilysys.generateFBLongLiveToken(values, clientId);
            const generatedToken = await generateONDToken(values, longLiveToken.access_token);

            removeCCTokenFromPayload(guestProfile);
            return decorateGuestProfileResponse(guestProfile, generatedToken);
          } catch (ex) {
            logger.error('Error while creating Facebook user', ex);
            return Boom.badRequest(ex.message);
          }
        } catch (ex) {
          logger.error('Error while creating Facebook user', ex);
          return Boom.badRequest(ex.message);
        }
      } else if (values.tokenType === 'google') {
        try {
          const guestProfile = await createGoogleUserProfile(values, agilysys);
          try {
            const generatedToken = await generateONDToken(values, values.token);

            removeCCTokenFromPayload(guestProfile);
            return decorateGuestProfileResponse(guestProfile, generatedToken);
          } catch (ex) {
            logger.error('Error while creating Google user', ex);
            return Boom.badRequest(ex.message);
          }
        } catch (ex) {
          logger.error('Error while creating Google user', ex);
          return Boom.badRequest(ex.message);
        }
      }
    } catch (err) {
      logger.error('Error while creating Facebook user', err);
      return new Boom(err.message, { statusCode: err.code });
    }
  },
  getUserProfile: async (credentials, values) => {
    try {
      const agilysys = new Agilysys(credentials);
      let ondTokenPayload;
      try {
        ondTokenPayload = await validateONDToken(values, agilysys);
        if (!ondTokenPayload.user_id) {
          throw new Error('Received a invalid OND token payload');
        }
      } catch (error) {
        logger.error('Error while validating the OND token', error);
        return Boom.badRequest('OND_TOKEN_FAILED');
      }
      const guestProfile = await agilysys.fetchGuestProfile(getProfileID(ondTokenPayload));
      removeCCTokenFromPayload(guestProfile);
      return guestProfile;
    } catch (ex) {
      logger.error('fetch user profile failed. An error occured.', ex);
      return new Boom(ex.message, { statusCode: ex.code });
    }
  },
  saveNewCCCard: async (credentials, values) => {
    try {
      const agilysys = new Agilysys(credentials);
      let ondTokenPayload;
      try {
        ondTokenPayload = await validateONDToken(values, agilysys);
        if (!ondTokenPayload.user_id) {
          throw new Error('Received a invalid OND token payload');
        }
      } catch (error) {
        logger.error('Error while validating the OND token', error);
        return Boom.badRequest('OND_TOKEN_FAILED');
      }
      const payload = {
        userId: getProfileID(ondTokenPayload),
        name: values.userName,
        cardInfo: [values.cardInfo]
      };
      try {
        const guestProfile = await agilysys.updateGuestProfile(payload);
        removeCCTokenFromPayload(guestProfile);
        return guestProfile;
      } catch (ex) {
        logger.error('Error occured while saving the new CC card.', ex);
        throw ex;
      }
    } catch (ex) {
      logger.error('Error occured while saving the new CC card.', ex);
      if (ex.response && ex.response.status) {
        return new Boom(ex.errors ? JSON.stringify(ex.errors) : ex.message, { statusCode: ex.response.status });
      } else {
        return Boom.badRequest(ex.message);
      }
    }
  },
  deleteUserSavedCard: async (credentials, values) => {
    try {
      const agilysys = new Agilysys(credentials);
      let ondTokenPayload;
      try {
        ondTokenPayload = await validateONDToken(values, agilysys);
        if (!ondTokenPayload.user_id) {
          throw new Error('Received a invalid OND token payload');
        }
      } catch (error) {
        logger.error('Error while validating the OND token', error);
        return Boom.badRequest('OND_TOKEN_FAILED');
      }
      const deleteCard = await agilysys.deleteUserSavedCard(getProfileID(ondTokenPayload), values.uniqueId);
      return deleteCard.data;
    } catch (ex) {
      logger.error('Delete user saved card failed. An error occured.', ex);
      if (ex.response && ex.response.status) {
        return new Boom(ex.errors ? JSON.stringify(ex.errors) : ex.message, { statusCode: ex.response.status });
      } else {
        return Boom.badRequest(ex.message);
      }
    }
  },
  getCardInfoByUniqueId: async (credentials, values) => {
    try {
      const agilysys = new Agilysys(credentials);
      let ondTokenPayload;
      try {
        ondTokenPayload = await validateONDToken(values, agilysys);
        if (!ondTokenPayload.user_id) {
          throw new Error('Received a invalid OND token payload');
        }
      } catch (error) {
        const ondTokenError = new Error('Error while validating the OND token');
        ondTokenError.statusCode = 'OND_TOKEN_FAILED';
        throw ondTokenError;
      }
      const cardInfoResponse = await agilysys.getCardInfoByUniqueId(getProfileID(ondTokenPayload), values.uniqueId);
      return cardInfoResponse.data;
    } catch (ex) {
      logger.error('get user saved card failed. An error occured.', ex);
      const cardInfoError = new Error('get user saved card failed. An error occured.');
      cardInfoError.statusCode = ex.statusCode || 'OND_FETCH_CARD_FAILED';
      throw cardInfoError;
    }
  },
  decryptSamlCookie: async (credentials, values) => {
    try {
      const { samlCookie } = values;
      const decryptedSamlCookie = await Iron.unseal(samlCookie, SAML_COOKIE_PASSWORD, Iron.defaults);
      return decryptedSamlCookie
    } catch (ex) {
      logger.error('issue decrypting cookie');
      throw ex;
    }
  },
  atriumLogin: async (credentials, values) => {
    try {
      const agilysys = new Agilysys(credentials);

      if (values.ond_token) {
        try {
          const ondTokenPayload = await validateONDToken(values, agilysys);
          if (ondTokenPayload.user_id) {
            try {
              const guestProfile = await agilysys.fetchAtriumProfile(getProfileID(ondTokenPayload));

              removeCCTokenFromPayload(guestProfile);
              return decorateGuestProfileResponse(guestProfile, values.ond_token);
            } catch (ex) {
              logger.error('Error occured while fetching atrium user profile.', ex);
              return Boom.badRequest(ex.message);
            }
          } else {
            logger.error('Received a invalid OND token payload');
            return Boom.badRequest('OND_TOKEN_FAILED');
          }
        } catch (ex) {
          logger.error('Error while validating the OND token', ex);
          return Boom.badRequest('OND_TOKEN_FAILED');
        }
      } else {
        try {
          const guestProfile = await createAtriumUserProfile(values, agilysys);
          try {
            const tenantConfig = agilysys.getTenantConfig();
            const clientId = getAuthClientIdByType(tenantConfig, 'atrium');
            const longLiveToken = await agilysys.generateFBLongLiveToken(values, clientId);
            const generatedToken = await generateONDToken(values, longLiveToken.access_token);

            removeCCTokenFromPayload(guestProfile);
            return decorateGuestProfileResponse(guestProfile, generatedToken);
          } catch (ex) {
            logger.error('Error while creating Facebook user', ex);
            return Boom.badRequest(ex.message);
          }
        } catch (ex) {
          logger.error('Error while creating Facebook user', ex);
          return Boom.badRequest(ex.message);
        }
      }
    } catch (err) {
      logger.error('Error while creating Facebook user', err);
      return new Boom(err.message, { statusCode: err.code });
    }
  },
  getAtriumUserProfile: async (credentials, values) => {
    try {
      const agilysys = new Agilysys(credentials);
      let ondTokenPayload;
      try {
        ondTokenPayload = await validateONDToken(values, agilysys);
        if (!ondTokenPayload.user_id) {
          throw new Error('Received a invalid OND token payload');
        }
      } catch (error) {
        logger.error('Error while validating the OND token', error);
        return Boom.badRequest('OND_TOKEN_FAILED');
      }
      const atriumProfile = await agilysys.fetchAtriumProfile(getProfileID(ondTokenPayload));
      removeCCTokenFromPayload(atriumProfile);
      return atriumProfile;
    } catch (ex) {
      logger.error('fetch user profile failed. An error occured.', ex);
      return new Boom(ex.message, { statusCode: ex.code });
    }
  }
};

const getProfileID = (ondTokenPayload) => {
  return ondTokenPayload.user_id + ((ondTokenPayload.app_id === '') ? '' : `_${ondTokenPayload.app_id}`);
};

const validateONDToken = async (values, agilysys) => {
  const jwtKey = await GetJWTSigningKey();
  const decryptedToken = decryptONDToken(values.ond_token, jwtKey);
  const decodedJWTToken = jwt.verify(decryptedToken, jwtKey, { algorithms: ['HS512'] });
  try {
    let validateTokenResponse;
    switch (values.tokenType) {
      case 'facebook':
        validateTokenResponse = await agilysys.validateFBToken(decodedJWTToken.token);
        break;
      case 'google':
        validateTokenResponse = await agilysys.validateGoogleToken(decodedJWTToken.token);
        break;
      case 'atrium':
        validateTokenResponse = await agilysys.validateAtriumToken(decodedJWTToken.token);
        break;
    }

    return {
      ...validateTokenResponse,
      ...decodedJWTToken
    };
  } catch (ex) {
    logger.error('Error occured while validating the facebook token.', ex);
    throw ex;
  }
};

const createGoogleUserProfile = async (values, agilysys) => {
  let guestProfile;
  try {
    const validateTokenResponse = await agilysys.validateGoogleToken(values.token, values.app_id);
    if (validateTokenResponse.id) {
      guestProfile = await agilysys.fetchGuestProfile(`${validateTokenResponse.id}`);
      if (Object.keys(guestProfile).length === 0) {
        const payload = {
          userId: `${validateTokenResponse.id}`,
          name: values.userName,
          socialLoginType: values.tokenType
        };
        try {
          guestProfile = await agilysys.createGuestProfile(payload);
        } catch (ex) {
          logger.error('Error occured while creating guest profile.', ex);
          throw ex;
        }
      }
    }
  } catch (ex) {
    logger.error('Error occured while fetching guest profile.', ex);
    throw ex;
  }
  return guestProfile;
};

const createFBUserProfile = async (values, agilysys) => {
  let guestProfile;
  try {
    const validateTokenResponse = await agilysys.validateFBToken(values.token);
    if (validateTokenResponse.id) {
      try {
        guestProfile = await agilysys.fetchGuestProfile(`${values.user_id}_${values.app_id}`);
        if (Object.keys(guestProfile).length === 0) {
          const payload = {
            userId: `${values.user_id}_${values.app_id}`,
            name: values.userName,
            socialLoginType: values.tokenType
          };
          try {
            guestProfile = await agilysys.createGuestProfile(payload);
          } catch (ex) {
            logger.error('Error occured while creating guest profile.', ex);
            throw ex;
          }
        }
      } catch (ex) {
        logger.error('Error occured while fetching guest profile.', ex);
        throw ex;
      }
    }
  } catch (ex) {
    logger.error('Error occured while validating/creating guest profile.', ex);
    throw ex;
  }
  return guestProfile;
};

const createAtriumUserProfile = async (values, agilysys) => {
  let guestProfile;
  try {
    const validateTokenResponse = await agilysys.validateAtriumToken(values.token);
    if (validateTokenResponse.id) {
      try {
        guestProfile = await agilysys.fetchAtriumProfile(`${values.user_id}_${values.app_id}`);
        if (Object.keys(guestProfile).length === 0) {
          const payload = {
            userId: `${values.user_id}_${values.app_id}`,
            name: values.userName,
            socialLoginType: values.tokenType
          };
          try {
            guestProfile = await agilysys.createGuestProfile(payload);
          } catch (ex) {
            logger.error('Error occured while creating guest profile.', ex);
            throw ex;
          }
        }
      } catch (ex) {
        logger.error('Error occured while fetching guest profile.', ex);
        throw ex;
      }
    }
  } catch (ex) {
    logger.error('Error occured while validating/creating guest profile.', ex);
    throw ex;
  }
  return guestProfile;
}

const removeCCTokenFromPayload = (guestProfile) => {
  if (guestProfile.cardInfo) {
    guestProfile.cardInfo.forEach(element => {
      delete element.token;
    });
  }
};

const decorateGuestProfileResponse = (guestProfile, token) => {
  return {
    status: 'Success',
    ond_token: token,
    userInfo: guestProfile
  };
};

const generateONDToken = async (values, token) => {
  const jwtKey = await GetJWTSigningKey();
  const ondToken = jwt.sign({ 'user_id': values.user_id, 'app_id': (values.tokenType === 'google') ? '' : values.app_id, 'token': token },
    jwtKey, { algorithm: 'HS512' });
  return encryptONDToken(ondToken, jwtKey);
};

const encryptONDToken = (value, jwtKey) => {
  return encrypt({ dataToEncrypt: value, key: jwtKey.toString().trimRight() });
};

const decryptONDToken = (value, jwtKey) => {
  return decrypt({ encryptedData: value, key: jwtKey.toString().trimRight() });
};

const getAuthClientIdByType = (tenantConfig, loginType) => {
  const loginMethods = get(tenantConfig, 'siteAuth.config.loginMethods', []);
  const clientId = loginMethods.find(data => data.type === loginType).clientId;
  return clientId;
};

export default api;
