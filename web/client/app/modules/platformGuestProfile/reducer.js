import * as actions from './sagas';

const initialState = {
  nameCaptureFirstName: '',
  nameCaptureLastInitial: '',
  shouldOptIn: false,
  isSearchingProfile: false,
  platformGuestProfileConfig: {},
  profile: {},
  error: null
};

const PlatformGuestProfileReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.SET_PLATFORM_PROFILE_NAME_DETAILS:
      return {
        ...state,
        nameCaptureFirstName: action.firstName,
        nameCaptureLastInitial: action.lastInitial
      };
    case actions.SHOULD_OPT_IN_PROFILE:
      return {
        ...state,
        shouldOptIn: action.shouldOptIn
      };
    case actions.GET_PLATFORM_PROFILE:
      return {
        ...state,
        isSearchingProfile: true,
        platformGuestProfileConfig: action.platformGuestProfileConfig
      };
    case actions.GET_PLATFORM_PROFILE_SUCCESS:
      return {
        ...state,
        isSearchingProfile: false,
        profile: action.profile,
        error: null
      };
    case actions.GET_PLATFORM_PROFILE_FAILED:
      return {
        ...state,
        isSearchingProfile: false,
        profile: {},
        error: action.error
      };
    case actions.CREATE_PLATFORM_PROFILE:
      return {
        ...state
      };
    case actions.CREATE_PLATFORM_PROFILE_SUCCESS:
      return {
        ...state,
        profile: action.profile,
        error: null
      };
    case actions.CREATE_PLATFORM_PROFILE_FAILED:
      return {
        ...state,
        profile: {},
        error: action.error
      };
    case actions.UPDATE_PLATFORM_PROFILE_SUCCESS:
      return {
        ...state,
        profile: action.profile,
        error: null
      };
    case actions.UPDATE_PLATFORM_PROFILE_FAILED:
      return {
        ...state,
        profile: {},
        error: action.error
      };
    case actions.RESET_PLATFORM_PROFILE:
      return {
        ...initialState
      };
    default:
      return state;
  }
};

export default PlatformGuestProfileReducer;
