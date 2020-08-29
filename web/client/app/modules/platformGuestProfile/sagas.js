
import { select, put, call } from 'redux-saga/effects';
import axios from 'axios';
import config from 'app.config';
import moment from 'moment';
import get from 'lodash.get';

export const SET_PLATFORM_PROFILE_NAME_DETAILS = 'SET_PLATFORM_PROFILE_NAME_DETAILS';
export const SHOULD_OPT_IN_PROFILE = 'SHOULD_OPT_IN_PROFILE';
export const GET_PLATFORM_PROFILE = 'GET_PLATFORM_PROFILE';
export const GET_PLATFORM_PROFILE_SUCCESS = 'GET_PLATFORM_PROFILE_SUCCESS';
export const GET_PLATFORM_PROFILE_FAILED = 'GET_PLATFORM_PROFILE_FAILED';
export const CREATE_PLATFORM_PROFILE = 'CREATE_PLATFORM_PROFILE';
export const CREATE_PLATFORM_PROFILE_SUCCESS = 'CREATE_PLATFORM_PROFILE_SUCCESS';
export const CREATE_PLATFORM_PROFILE_FAILED = 'CREATE_PLATFORM_PROFILE_FAILED';
export const UPDATE_PLATFORM_PROFILE_PHONE_NUMBER = 'UPDATE_PLATFORM_PROFILE_PHONE_NUMBER';
export const UPDATE_PLATFORM_PROFILE_EMAIL = 'UPDATE_PLATFORM_PROFILE_EMAIL';
export const UPDATE_PLATFORM_PROFILE_GUEST_NAME = 'UPDATE_PLATFORM_PROFILE_GUEST_NAME';
export const UPDATE_PLATFORM_PROFILE_SUCCESS = 'UPDATE_PLATFORM_PROFILE_SUCCESS';
export const UPDATE_PLATFORM_PROFILE_FAILED = 'UPDATE_PLATFORM_PROFILE_FAILED';
export const RESET_PLATFORM_PROFILE = 'RESET_PLATFORM_PROFILE';
export const UPDATE_PLATFORM_PROFILE_GA = 'UPDATE_PLATFORM_PROFILE_GA';
export const UPDATE_PLATFORM_PROFILE_CC = 'UPDATE_PLATFORM_PROFILE_CC';

const getSendToData = (store) => store.communication.sendToData;
const getCountryCode = (store) => store.communication.smsSelectedCountry.phoneCode;
const getPhoneTimeZoneCode = (store) => store.communication.smsSelectedCountry.value;
const getFirstName = (store) => store.platformGuestProfile.nameCaptureFirstName;
const getLastInitial = (store) => store.platformGuestProfile.nameCaptureLastInitial;
const getCurrentProfile = (store) => store.platformGuestProfile.profile;
const getPlatformGuestProfileConfig = (store) => store.sites.orderConfig.platformGuestProfileConfig;
const shouldOptInProfileFlag = (store) => store.platformGuestProfile.shouldOptIn;

export const setPlatformProfileNameDetails = (firstName, lastInitial) => ({
  type: SET_PLATFORM_PROFILE_NAME_DETAILS,
  firstName,
  lastInitial
});

export const shouldOptInProfile = (shouldOptIn) => ({
  type: SHOULD_OPT_IN_PROFILE,
  shouldOptIn
});

export const getPlatformProfile = (paymentType, number, platformGuestProfileConfig) => ({
  type: GET_PLATFORM_PROFILE,
  paymentType,
  number,
  platformGuestProfileConfig
});

export const getPlatformProfileSuccess = (profile) => ({
  type: GET_PLATFORM_PROFILE_SUCCESS,
  profile
});

export const getPlatformProfileFailed = (error) => ({
  type: GET_PLATFORM_PROFILE_FAILED,
  error
});

export const createPlatformProfile = (paymentType, number, platformGuestProfileConfig) => ({
  type: CREATE_PLATFORM_PROFILE,
  paymentType,
  number,
  platformGuestProfileConfig
});

export const createPlatformProfileSuccess = (profile) => ({
  type: CREATE_PLATFORM_PROFILE_SUCCESS,
  profile
});

export const createPlatformProfileFailed = (error) => ({
  type: CREATE_PLATFORM_PROFILE_FAILED,
  error
});

export const updatePlatformProfileGA = (gaAccountNumber, providerUuid) => ({
  type: UPDATE_PLATFORM_PROFILE_GA,
  gaAccountNumber,
  providerUuid
});

export const updatePlatformProfileCC = (correlationId) => ({
  type: UPDATE_PLATFORM_PROFILE_CC,
  correlationId
});

export const updatePlatformProfileGuestName = () => ({
  type: UPDATE_PLATFORM_PROFILE_GUEST_NAME
});

export const updatePlatformProfilePhoneNumber = () => ({
  type: UPDATE_PLATFORM_PROFILE_PHONE_NUMBER
});

export const updatePlatformProfileEmail = () => ({
  type: UPDATE_PLATFORM_PROFILE_EMAIL
});

export const updateGuestProfilerSuccess = (profile) => ({
  type: UPDATE_PLATFORM_PROFILE_SUCCESS,
  profile
});

export const updateGuestProfileFailed = (error) => ({
  type: UPDATE_PLATFORM_PROFILE_FAILED,
  error
});

export const resetPlatformProfile = () => ({
  type: RESET_PLATFORM_PROFILE
});

export const searchGuestProfileRequest = (payload) => {
  return axios.post(`${config.webPaths.api}platformGuestProfile/searchProfile`, payload);
};

export const createPlatformProfileRequest = (payload) => {
  return axios.post(`${config.webPaths.api}platformGuestProfile/createProfile`, payload);
};

export const updateGuestProfileRequest = (payload) => {
  return axios.put(`${config.webPaths.api}platformGuestProfile/updateProfile`, payload);
};

const updatePhoneNumberOrdinal = (currentProfile, entry) => {
  let phoneNumbers = get(currentProfile, 'gpBusinessCard.phoneNumbers', []);
  phoneNumbers.map(phoneNumber => {
    if (phoneNumber && (phoneNumber.ordinal < entry.ordinal)) {
      phoneNumber.ordinal++;
    }
  });
  entry.ordinal = 0;
};

const updateEmailOrdinal = (currentProfile, entry) => {
  let emailAddresses = get(currentProfile, 'gpBusinessCard.emailAddresses', []);
  emailAddresses.map(email => {
    if (email && (email.ordinal < entry.ordinal)) {
      email.ordinal++;
    }
  });
  entry.ordinal = 0;
};

export function * createNewPhoneNumberEntry (currentProfile, phoneNumberInput) {
  let newEntry = {
    ordinal: 0,
    timeZone: '',
    countryCode: '',
    number: ''
  };
  let countryCode = yield select(getCountryCode);
  let timeZoneCode = yield select(getPhoneTimeZoneCode);
  newEntry.countryCode = '+' + countryCode;
  newEntry.number = phoneNumberInput.slice(countryCode.length + 1);
  newEntry.timeZone = timeZoneCode;
  let phoneNumbers = get(currentProfile, 'gpBusinessCard.phoneNumbers', []);
  phoneNumbers.map(phoneNumber => phoneNumber.ordinal++);
  phoneNumbers.push(newEntry);
};

export function * createNewEmailEntry (currentProfile, emailInput) {
  let newEntry = {
    ordinal: 0,
    emailAddress: emailInput
  };
  let emailAddresses = get(currentProfile, 'gpBusinessCard.emailAddresses', []);
  emailAddresses.map(email => email.ordinal++);
  emailAddresses.push(newEntry);
};

export function * createNewGAMemebershipEntry (currentProfile, gaAccountNumber, providerUuid) {
  let newEntry = {
    ordinal: 0,
    membershipNumber: gaAccountNumber,
    membershipProviderUuid: providerUuid
  };
  let gaMembershipCards = get(currentProfile, 'gpBusinessCard.membershipCards', []);
  gaMembershipCards.map(phoneNumber => phoneNumber.ordinal++);
  gaMembershipCards.push(newEntry);
};

export function * getPlatformProfileAsync (paymentType, number, platformGuestProfileConfig) {
  try {
    let profile;
    let queryParams;
    if (paymentType === 'credit') {
      queryParams = {
        'correlationId': number
      };
    } else if (paymentType === 'GA') {
      queryParams = {
        'membershipNumber': number,
        'membershipProviderCode': platformGuestProfileConfig.membershipProviderConfiguration.GA.membershipProviderCode
      };
    }
    profile = yield call(searchGuestProfileRequest, {queryParams, platformGuestProfileConfig});
    if (profile.data.length > 0) {
      if (profile.data.length > 1) {
        let latest = profile.data.sort((a, b) => (moment(b.createTime).utc() - moment(a.createTime).utc()))[0];
        yield put(getPlatformProfileSuccess(latest));
      } else {
        yield put(getPlatformProfileSuccess(profile.data[0]));
      }
      let shouldOptIn = yield select(shouldOptInProfileFlag);
      if (shouldOptIn) {
        yield call(updatePlatformProfileGuestNameIfNeeded);
      }
    } else {
      yield put(createPlatformProfile(paymentType, number, platformGuestProfileConfig));
    }
  } catch (error) {
    yield put(getPlatformProfileFailed(error));
  }
};

export function * createPlatformProfileAsync (paymentType, number, platformGuestProfileConfig) {
  try {
    let payload = {
      paymentNumber: number,
      paymentType,
      platformGuestProfileConfig
    };
    payload.surName = yield select(getLastInitial);
    payload.givenName = yield select(getFirstName);
    let profile = yield call(createPlatformProfileRequest, payload);
    yield put(createPlatformProfileSuccess(profile.data));
  } catch (error) {
    yield put(createPlatformProfileFailed(error));
  }
};

export function * updatePlatformProfileGuestNameIfNeeded () {
  let currentProfile = yield select(getCurrentProfile);
  let surName = yield select(getLastInitial);
  let givenName = yield select(getFirstName);
  let isProfileModified = false;
  if (surName && currentProfile.gpBusinessCard.surname !== surName) {
    isProfileModified = true;
    currentProfile.gpBusinessCard.surname = surName;
  }
  if (givenName && currentProfile.gpBusinessCard.givenName !== givenName) {
    isProfileModified = true;
    currentProfile.gpBusinessCard.givenName = givenName;
  }
  if (isProfileModified) {
    yield put(updatePlatformProfileGuestName());
  }
}

export function * updatePlatformProfileGuestNameAsync () {
  let currentProfile = yield select(getCurrentProfile);
  if (currentProfile) {
    try {
      let payload = {};
      payload.platformGuestProfileConfig = yield select(getPlatformGuestProfileConfig);
      payload.profile = currentProfile;
      let result = yield call(updateGuestProfileRequest, payload);
      yield put(updateGuestProfilerSuccess(result.data));
    } catch (error) {
      yield put(updateGuestProfileFailed(error));
    }
  }
};

export function * updatePlatformProfilePhoneNumberAsync () {
  let currentProfile = yield select(getCurrentProfile);
  if (currentProfile) {
    try {
      let payload = {};
      payload.platformGuestProfileConfig = yield select(getPlatformGuestProfileConfig);
      let phoneNumberInput = yield select(getSendToData);
      let phoneNumbers = get(currentProfile, 'gpBusinessCard.phoneNumbers', []);
      let timeZoneCode = yield select(getPhoneTimeZoneCode);
      let availablePhone = phoneNumbers.find(phone => phoneNumberInput === phone.countryCode.concat(phone.number) && timeZoneCode === phone.timeZone); // eslint-disable-line max-len
      if (availablePhone && availablePhone.ordinal !== 0) {
        yield call(updatePhoneNumberOrdinal, currentProfile, availablePhone);
      } else if (!availablePhone) {
        yield call(createNewPhoneNumberEntry, currentProfile, phoneNumberInput);
      } else {
        return;
      }
      payload.profile = currentProfile;
      let result = yield call(updateGuestProfileRequest, payload);
      yield put(updateGuestProfilerSuccess(result.data));
    } catch (error) {
      yield put(updateGuestProfileFailed(error));
    }
  }
};

export function * updatePlatformProfileEmailAsync () {
  let currentProfile = yield select(getCurrentProfile);
  if (currentProfile) {
    try {
      let payload = {};
      payload.platformGuestProfileConfig = yield select(getPlatformGuestProfileConfig);
      let emailInput = yield select(getSendToData);
      let currentProfile = yield select(getCurrentProfile);
      let emails = get(currentProfile, 'gpBusinessCard.emailAddresses', []);
      let availableEmail = emails.find(email => emailInput === email.emailAddress.toString());
      if (availableEmail && availableEmail.ordinal !== 0) {
        yield call(updateEmailOrdinal, currentProfile, availableEmail);
      } else if (!availableEmail) {
        yield call(createNewEmailEntry, currentProfile, emailInput);
      } else {
        return;
      }
      payload.profile = currentProfile;
      let result = yield call(updateGuestProfileRequest, payload);
      yield put(updateGuestProfilerSuccess(result.data));
    } catch (error) {
      yield put(updateGuestProfileFailed(error));
    }
  }
};

export function * updatePlatformProfileGAAsync (gaAccountNumber, providerUuid) {
  let currentProfile = yield select(getCurrentProfile);
  if (currentProfile) {
    try {
      let payload = {};
      payload.platformGuestProfileConfig = yield select(getPlatformGuestProfileConfig);
      yield call(createNewGAMemebershipEntry, currentProfile, gaAccountNumber, providerUuid);
      payload.profile = currentProfile;
      let result = yield call(updateGuestProfileRequest, payload);
      yield put(updateGuestProfilerSuccess(result.data));
    } catch (error) {
      yield put(updateGuestProfileFailed(error));
    }
  }
};

export function * updatePlatformProfileCCAsync (correlationId) {
  let currentProfile = yield select(getCurrentProfile);
  if (currentProfile) {
    try {
      let payload = {};
      payload.platformGuestProfileConfig = yield select(getPlatformGuestProfileConfig);
      currentProfile.correlationIds.push(correlationId);
      payload.profile = currentProfile;
      let result = yield call(updateGuestProfileRequest, payload);
      yield put(updateGuestProfilerSuccess(result.data));
    } catch (error) {
      yield put(updateGuestProfileFailed(error));
    }
  }
};
