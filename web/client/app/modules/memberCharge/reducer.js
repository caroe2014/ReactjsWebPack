
import * as actions from './sagas';

const initialState = {
  fetchingMemberCharge: false,
  memberChargeError: null,
  lastName: '',
  memberNumber: '',
  tenderId: '',
  contextId: '',
  verificationCodeId: '',
  coverCount: '',
  pmsAdapterId: '',
  inquiryError: false,
  retryCount: 0,
  disableProcess: false,
  disableTimeStamp: null,
  memberChargeInquiry: false,
  memberChargeAccountInfo: null
};

const MemberChargeReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.FETCH_MEMBER_CHARGE:
      return {
        ...state,
        contextId: action.siteId
      };
    case actions.GET_MEMBER_CHARGE_DETAILS:
      return {
        ...state,
        fetchingMemberCharge: true,
        memberChargeError: null
      };
    case actions.UPDATE_MEMBER_CHARGE_DETAILS:
      return {
        ...state,
        fetchingMemberCharge: false,
        tenderId: action.tenderId,
        verificationCodeId: action.verificationCodeId
      };
    case actions.GET_MEMBER_CHARGE_FAILED:
      return {
        ...state,
        fetchingMemberCharge: false,
        memberChargeError: action.error
      };
    case actions.PROCESS_MEMBER_CHARGE:
      return {
        ...state,
        lastName: action.lastName,
        memberNumber: action.memberNumber,
        tenderId: action.tenderId,
        coverCount: action.coverCount,
        pmsAdapterId: action.pmsAdapterId,
        inquiryError: false,
        memberChargeAccountInfo: null,
        memberChargeCapture: false
      };
    case actions.MEMBER_CHARGE_INQUIRY_SUCCESS:
      return {
        ...state,
        memberChargeAccountInfo: action.memberChargeAccountInfo,
        memberChargeInquiry: true
      };
    case actions.MEMBER_CHARGE_INQUIRY_FAILURE:
      return {
        ...state,
        inquiryError: true,
        retryCount: state.retryCount + 1
      };
    case actions.MEMBER_CHARGE_INQUIRY_DISABLE:
      return {
        ...state,
        disableProcess: true,
        disableTimeStamp: action.disableTimeStamp
      };
    case actions.MEMBER_CHARGE_INQUIRY_ENABLE:
      return {
        ...state,
        disableProcess: false,
        retryCount: 0,
        inquiryError: false,
        disableTimeStamp: null
      };
    case actions.CLEAR_MEMBER_CHARGE_ERROR:
      return {
        ...state,
        inquiryError: false
      };
    case actions.RESET_MEMBER_CHARGE:
      return {
        ...initialState
      };
    case actions.REMOVE_MEMBER_CHARGE_ACCOUNT_INFO:
      return {
        ...state,
        memberChargeAccountInfo: null,
        fetchingMemberCharge: false,
        memberChargeInquiry: false,
        memberChargeCapture: true
      };
    case actions.CAPTURE_MEMBER_CHARGE_PAYMENT_AND_CLOSE_ORDER:
      return {
        ...state,
        fetchingMemberCharge: false,
        memberChargeCapture: false
      };
    case actions.CAPTURE_MEMBER_CHARGE_PAYMENT_AND_CLOSE_ORDER_FAILURE:
      return {
        ...state,
        fetchingMemberCharge: false,
        memberChargeInquiry: false,
        memberChargeCapture: true,
        memberChargeAccountInfo: null
      };
    default:
      return state;
  }
};

export default MemberChargeReducer;
