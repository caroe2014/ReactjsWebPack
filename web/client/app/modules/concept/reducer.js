// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import * as actions from './sagas';

const initialState = {
  fetching: false,
  raw: null,
  list: [],
  error: null,
  conceptId: -1,
  digitalMenuError: false
};

const ConceptReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.GET_CONCEPT:
      return {
        ...state,
        conceptId: action.conceptId
      };
    case actions.SET_CONCEPT_OPTIONS:
      return {
        ...state,
        conceptOptions: action.conceptOptions,
        conceptId: action.conceptId,
        igPosConfig: action.igPosConfig
      };
    case actions.FETCHING_CONCEPT:
      return {
        ...state,
        list: [],
        fetching: true
      };
    case actions.GET_CONCEPT_SUCCEEDED:
      return {
        ...state,
        fetching: false,
        raw: action.concepts,
        list: action.concepts,
        error: null,
        digitalMenuError: false
      };
    case actions.GET_CONCEPT_FAILED:
      return {
        ...state,
        fetching: false,
        list: [],
        error: action.error,
        conceptId: -1,
        digitalMenuError: action.digitalMenuError
      };
    default:
      return state;
  }
};

export default ConceptReducer;
