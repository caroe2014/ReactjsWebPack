
import * as actions from './sagas';

const initialState = {
  fetchingRoomCharge: false,
  roomChargeDetails: null,
  contextId: '',
  roomChargeError: null,
  hotelName: '',
  wingPrefix: '',
  lastName: '',
  verificationCodeId: '',
  roomNumber: '',
  tenderId: '',
  coverCount: '',
  pmsAdapterId: '',
  inquiryError: false,
  roomChargeInquiry: false,
  retryCount: 0,
  disableProcess: false,
  disableTimeStamp: null,
  roomChargeAccountInfo: null
};

const RoomChargeReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.FETCH_ROOM_CHARGE:
      return {
        ...state,
        contextId: action.siteId
      };
    case actions.GET_ROOM_CHARGE_DETAILS:
      return {
        ...state,
        fetchingRoomCharge: true,
        roomChargeDetails: null,
        roomChargeError: null
      };
    case actions.UPDATE_ROOM_CHARGE_DETAILS:
      return {
        ...state,
        fetchingRoomCharge: false,
        roomChargeDetails: action.roomChargeDetails
      };
    case actions.GET_ROOM_CHARGE_FAILED:
      return {
        ...state,
        fetchingRoomCharge: false,
        roomChargeError: action.error
      };
    case actions.PROCESS_ROOM_CHARGE:
      return {
        ...state,
        hotelName: action.hotelName,
        wingPrefix: action.wingPrefix,
        lastName: action.lastName,
        verificationCodeId: action.verificationCodeId,
        roomNumber: action.roomNumber,
        tenderId: action.tenderId,
        coverCount: action.coverCount,
        pmsAdapterId: action.pmsAdapterId,
        inquiryError: false,
        roomChargeAccountInfo: null,
        roomChargeCapture: false
      };
    case actions.ROOM_CHARGE_INQUIRY_SUCCESS:
      return {
        ...state,
        roomChargeAccountInfo: action.roomChargeAccountInfo,
        roomChargeInquiry: true
      };
    case actions.ROOM_CHARGE_INQUIRY_FAILURE:
      return {
        ...state,
        inquiryError: true,
        retryCount: state.retryCount + 1
      };
    case actions.ROOM_CHARGE_INQUIRY_DISABLE:
      return {
        ...state,
        disableProcess: true,
        disableTimeStamp: action.disableTimeStamp
      };
    case actions.ROOM_CHARGE_INQUIRY_ENABLE:
      return {
        ...state,
        disableProcess: false,
        retryCount: 0,
        inquiryError: false,
        disableTimeStamp: null
      };
    case actions.RESET_ROOM_CHARGE:
      return {
        ...initialState
      };
    case actions.CLEAR_ROOM_CHARGE_ERROR:
      return {
        ...state,
        inquiryError: false
      };
    case actions.REMOVE_ROOM_CHARGE_ACCOUNT_INFO:
      return {
        ...state,
        roomChargeAccountInfo: null,
        fetchingRoomCharge: false,
        roomChargeInquiry: false,
        roomChargeCapture: true
      };
    case actions.CAPTURE_ROOM_CHARGE_PAYMENT_AND_CLOSE_ORDER:
      return {
        ...state,
        fetchingRoomCharge: false,
        roomChargeCapture: false
      };
    case actions.CAPTURE_ROOM_CHARGE_PAYMENT_AND_CLOSE_ORDER_FAILURE:
      return {
        ...state,
        fetchingRoomCharge: false,
        roomChargeInquiry: false,
        roomChargeAccountInfo: null,
        roomChargeCapture: true
      };
    default:
      return state;
  }
};

export default RoomChargeReducer;
