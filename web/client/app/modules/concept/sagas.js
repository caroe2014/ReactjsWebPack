// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import { call, put, select } from 'redux-saga/effects';
import axios from 'axios';
import config from 'app.config';
import i18n from 'web/client/i18n';
import { getScheduleTime } from 'web/client/app/modules/scheduleorder/sagas';

const getTenantId = (store) => store.app.config.tenantId;
const getProfileId = (store) => store.sites.displayProfileId; // eslint-disable-line max-len
const getSelectedSiteId = (store) => store.sites.selectedId;
const getScheduledDay = (store) => store.scheduleorder.scheduleOrderData && store.scheduleorder.scheduleOrderData.daysToAdd; // eslint-disable-line max-len
const getDigitalMenuId = (store) => store.app.digitalMenuId;

export const GET_CONCEPT = 'GET_CONCEPT';
export const SET_CONCEPT_OPTIONS = 'SET_CONCEPT_OPTIONS';
export const FETCHING_CONCEPT = 'FETCHING_CONCEPT';
export const GET_CONCEPT_SUCCEEDED = 'GET_CONCEPT_SUCCEEDED';
export const GET_CONCEPT_FAILED = 'GET_CONCEPT_FAILED';
export const SET_APP_ERROR = 'SET_APP_ERROR';

export const getConcepts = (siteId, displayProfileId) => ({
  type: GET_CONCEPT,
  siteId,
  displayProfileId
});
export const setConceptOptions = (conceptOptions, conceptId, igPosConfig) => ({
  type: SET_CONCEPT_OPTIONS,
  conceptOptions,
  conceptId,
  igPosConfig
});
export const fetchingConcepts = () => ({
  type: FETCHING_CONCEPT
});
export const getConceptsFailed = (error, digitalMenuId = false) => ({
  type: GET_CONCEPT_FAILED,
  digitalMenuError: digitalMenuId,
  error
});
export const getConceptsSucceeded = (concepts) => ({
  type: GET_CONCEPT_SUCCEEDED,
  concepts
});

export const setAppError = (error, key) => ({
  type: SET_APP_ERROR,
  error,
  key
});

export const fetchConcepts = (tenantId, siteId, profileId, scheduleTime, scheduledDay) =>
  axios.post(`${config.webPaths.api}sites/${tenantId}/${siteId}/concepts/${profileId}`, {
    scheduleTime, scheduledDay
  })
    .then(response => response.data)
    .catch(err => {
      throw err;
    });

export const setProfileNamespace = (profileId) => {
  i18n.setDefaultNamespace(`profile-${profileId}`);
};

export function * fetchConceptsIfNeeded () {
  const tenantId = yield select(getTenantId);
  const selectedSiteId = yield select(getSelectedSiteId);
  const profileId = yield select(getProfileId);
  const digitalMenuId = yield select(getDigitalMenuId);
  if (!tenantId) {
    yield put(getConceptsFailed('Missing Tenant ID', !!digitalMenuId));
  } else if (selectedSiteId < 0) {
    yield put(getConceptsFailed('Missing Site ID', !!digitalMenuId));
  } else {
    try {
      setProfileNamespace(profileId);
      let concept;
      const scheduledDay = yield select(getScheduledDay);
      const scheduleTime = yield call(getScheduleTime);
      yield put(fetchingConcepts());
      concept = yield call(fetchConcepts, tenantId, selectedSiteId, profileId, scheduleTime, scheduledDay); // eslint-disable-line max-len
      if (!concept || concept.length === 0) {
        yield put(getConceptsFailed('No concepts available'));
        yield put(setAppError(new Error('No concepts available now. Please try again later.'), 'ERROR_NO_CONCEPTS_AVAILABLE')); // eslint-disable-line max-len
      } else {
        yield put(getConceptsSucceeded(concept));
      }
    } catch (ex) {
      yield put(getConceptsFailed(ex, !!digitalMenuId));
      if (!digitalMenuId) {
        yield put(setAppError(new Error('Failed to fetch concepts, please try again after few minutes'), 'ERROR_FAILED_FETCH_CONCEPTS')); // eslint-disable-line max-len
      }
    }
  }
}
