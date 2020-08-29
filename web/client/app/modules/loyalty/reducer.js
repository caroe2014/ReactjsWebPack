// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.
/* eslint-disable max-len */
import * as actions from './sagas';

const initialState = {
  error: null,
  fetching: false,
  cancelLoyalty: false,
  skipLoyaltyRewards: false,
  loyaltyInfo: null,
  loyaltyDetails: null,
  selectedOption: null,
  siteId: null,
  displayProfileId: null,
  loyaltyInfoMap: {},
  cartLoyaltyInfo: null,
  showLoyaltyModal: false,
  loyaltyProcess: {
    loyaltyLinkedAccounts: [],
    showAccountSelection: true,
    isPointAccrued: false,
    isAccountError: false,
    processAccrue: false
  },
  loyaltyInquiryRetryCount: 0,
  hostCompVoucherPayments: [],
  showLoyaltyInquiryError: false,
  loyaltyInquiryError: '',
  processingMultipleActions: false,
  disableLoyaltyInquiry: false,
  disableLoyaltyInquiryTimestamp: null,
  shouldClearAccount: false,
  loyaltyTendersInfo: '',
  checkoutFlag: false
};

const LoyaltyReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.SKIP_LOYALTY_REWARDS:
      let { loyaltyInfoMap } = state;
      if (action.siteId) {
        loyaltyInfoMap[`${action.siteId}-${action.displayProfileId}`] = loyaltyInfoMap[`${action.siteId}-${action.displayProfileId}`];
      } else {
        loyaltyInfoMap = action.loyaltyInfo;
      }
      return {
        ...state,
        fetching: false,
        skipLoyaltyRewards: true,
        loyaltyInfo: null,
        showLoyaltyModal: false,
        error: null,
        loyaltyInfoMap
      };
    case actions.SEND_LOYALTY_INQUIRY:
      return {
        ...state,
        loyaltyInfo: action.loyaltyInquiryInfo,
        selectedOption: action.selectedOption,
        fetching: false,
        skipLoyaltyRewards: false,
        error: null,
        inquiryError: null,
        cancelLoyalty: false,
        loyaltyProcess: {
          ...state.loyaltyProcess,
          showAccountSelection: true,
          isPointAccrued: false,
          isAccountError: false,
          processAccrue: false
        }
      };
    case actions.SENT_LOYALTY_INQUIRY:
      return {
        ...state,
        fetching: true
      };
    case actions.LOYALTY_INQUIRY_SUCCESS:
      return {
        ...state,
        fetching: false,
        processingLoyaltyTransaction: false // TODO
      };
    case actions.LOYALTY_INQUIRY_FAILED:
      return {
        ...state,
        fetching: false,
        processingLoyaltyTransaction: false, // TODO
        error: true,
        inquiryError: true,
        loyaltyProcess: {
          ...state.loyaltyProcess,
          showAccountSelection: false
        },
        loyaltyInquiryError: action.loyaltyInquiryError,
        showLoyaltyInquiryError: true
      };
    case actions.CANCEL_LOYALTY_INFO:
      return {
        ...state,
        loyaltyInfo: null,
        selectedOption: null,
        fetching: false,
        error: null,
        cancelLoyalty: true,
        loyaltyProcess: {
          loyaltyLinkedAccounts: [],
          showAccountSelection: true,
          isPointAccrued: false,
          isAccountError: false,
          processAccrue: false
        }
      };
    case actions.SEND_LOYALTY_INFO:
      return {
        ...state,
        error: null,
        cancelLoyalty: false,
        loyaltyProcess: {
          loyaltyLinkedAccounts: action.clearLoyaltyAccount ? [] : state.loyaltyProcess.loyaltyLinkedAccounts,
          showAccountSelection: true,
          isPointAccrued: false,
          isAccountError: false,
          processAccrue: false
        }
      };
    case actions.LOYALTY_INFO_SENT:
      return {
        ...state,
        fetching: true,
        isAccountEmpty: false,
        error: null,
        loyaltyInquiryError: '',
        showLoyaltyInquiryError: false
      };
    case actions.LOYALTY_INFO_SUCCESS:
      const isAccountEmpty = !action.accountDetails || action.accountDetails.length === 0;
      let { loyaltyLinkedAccounts } = state.loyaltyProcess;
      let newLoyaltyAccount = action.accountDetails;

      loyaltyLinkedAccounts.forEach((accountTiers) => {
        accountTiers.loyaltyAccountTiers.forEach((loyaltyAccount) => {
          const duplicateAccountIndex = newLoyaltyAccount.loyaltyAccountTiers.findIndex(loyaltyAccountTier => loyaltyAccountTier.accountNumber === loyaltyAccount.accountNumber);
          if (duplicateAccountIndex !== -1) {
            newLoyaltyAccount.loyaltyAccountTiers.splice(duplicateAccountIndex, 1);
          }
        });
      });

      if (newLoyaltyAccount.loyaltyAccountTiers.length !== 0) {
        loyaltyLinkedAccounts.push(newLoyaltyAccount);
      }

      return {
        ...state,
        fetching: false,
        loyaltyProcess: {
          ...state.loyaltyProcess,
          loyaltyLinkedAccounts: loyaltyLinkedAccounts,
          showAccountSelection: !isAccountEmpty
        },
        processingLoyaltyTransaction: false, // TODO
        isAccountEmpty,
        error: false,
        loyaltyInquiryRetryCount: 0
      };
    case actions.LOYALTY_INFO_FAILED:
      return {
        ...state,
        fetching: false,
        loyaltyProcess: {
          ...state.loyaltyProcess,
          showAccountSelection: false
        },
        isAccountEmpty: true,
        processingLoyaltyTransaction: false, // TODO
        error: true,
        showLoyaltyInquiryError: true,
        loyaltyInquiryError: action.loyaltyInquiryError,
        loyaltyInquiryRetryCount: state.loyaltyInquiryRetryCount + 1
      };
    case actions.LOAD_LOYALTY_PAGE:
      return {
        ...state,
        fetching: false,
        siteId: action.siteId,
        displayProfileId: action.displayProfileId,
        isLoyaltyEnabled: action.isLoyaltyEnabled,
        loyaltyDetails: action.loyaltySite ? action.loyaltySite.loyaltyDetails : action.loyaltyDetails,
        cartLoyaltyInfo: action.loyaltySite && state.loyaltyInfoMap ? state.loyaltyInfoMap[`${action.siteId}-${action.displayProfileId}`] : null,
        checkoutFlag: action.checkoutFlag,
        error: null
      };
    case actions.SHOW_LOYALTY_MODAL:
      return {
        ...state,
        fetching: false,
        showLoyaltyModal: action.showModal,
        error: null
      };

    case actions.UPDATE_LOYALTY_MAP:
      return {
        ...state,
        fetching: false,
        loyaltyInfoMap: action.loyaltyInfoMap || {},
        error: null
      };
    case actions.CART_LOYALTY_INFO:
      return {
        ...state,
        cartLoyaltyInfo: action.cartLoyaltyInfo || state.loyaltyInfoMap[`${action.siteId}-${action.displayProfileId}`],
        loyaltyProcess: {
          loyaltyLinkedAccounts: action.clearLoyaltyAccount ? [] : state.loyaltyProcess.loyaltyLinkedAccounts,
          showAccountSelection: true,
          isPointAccrued: false,
          isAccountError: false,
          processAccrue: false
        }
      };
    case actions.RESET_LOYALTY_MAP:
      return {
        ...state,
        loyaltyInfoMap: {},
        selectedOption: null,
        loyaltyInfo: null,
        hostCompVoucherPayments: [],
        shouldClearAccount: action.shouldClearAccount
      };
    case actions.SHOULD_CLEAR_LOYALTY_ACCOUNT:
      return {
        ...state,
        shouldClearAccount: false,
        loyaltyInfoMap: {},
        loyaltyInfo: null,
        cartLoyaltyInfo: null,
        loyaltyProcess: {
          loyaltyLinkedAccounts: [],
          showAccountSelection: true,
          isPointAccrued: false,
          isAccountError: false,
          processAccrue: false
        }
      };
    case actions.CLEAR_LOYALTY_STATE:
      return {
        loyaltyInfoMap: {},
        hostCompVoucherPayments: [],
        loyaltyInfo: null,
        selectedOption: null,
        loyaltyDetails: state.loyaltyDetails,
        loyaltyProcess: {
          loyaltyLinkedAccounts: [],
          showAccountSelection: true,
          isPointAccrued: false,
          isAccountError: false,
          processAccrue: false
        },
        removeLoyaltyPaymentError: ''
      };
    case actions.PROCESS_LOYALTY_ACCRUE:
      return {
        ...state,
        loyaltyProcess: {
          ...state.loyaltyProcess,
          processAccrue: true,
          accrueError: false,
          isPointAccrued: false
        }
      };
    case actions.LOYALTY_ACCRUE_SUCCESS:
      return {
        ...state,
        loyaltyProcess: {
          ...state.loyaltyProcess,
          processAccrue: false,
          accrueError: false,
          showAccountSelection: false,
          isPointAccrued: true
        }
      };
    case actions.LOYALTY_ACCRUE_FAILED:
      return {
        ...state,
        loyaltyProcess: {
          ...state.loyaltyProcess,
          processAccrue: false,
          accrueError: true,
          showAccountSelection: true,
          isPointAccrued: false
        }
      };
    case actions.CAPTURE_LOYALTY_POINTS_PAYMENT_SUCCESS:
      loyaltyLinkedAccounts = state.loyaltyProcess.loyaltyLinkedAccounts;
      let loyaltyAccountTierMap = {};

      loyaltyLinkedAccounts.forEach(loyaltyLinkedAccount => {
        loyaltyLinkedAccount.loyaltyAccountTiers.forEach(loyaltyAccountTier => {
          if (loyaltyAccountTier.accountNumber === action.loyaltyPointsAccount.primaryAccountId) {
            loyaltyAccountTierMap = loyaltyAccountTier;
          }
        });
      });

      if (loyaltyAccountTierMap) {
        // eslint-disable-next-line max-len
        let pointsTypeCharged = loyaltyAccountTierMap.pointsSummaries.find(pointsType => pointsType.instrumentType === action.loyaltyPointsAccount.instrumentType);
        pointsTypeCharged.amountToBeCharged = action.amount;
        pointsTypeCharged.paymentResponse = action.paymentResponse;
      }

      return {
        ...state,
        processingMultipleActions: false,
        processingLoyaltyTransaction: false,
        loyaltyPaymentResponse: action.paymentResponse // TODO: is this needed
      };

    case actions.CAPTURE_LOYALTY_POINTS_PAYMENT_FAILURE:
      return {
        ...state,
        processingLoyaltyTransaction: false,
        loyaltyPaymentError: action.error,
        processingMultipleActions: false
      };

    case actions.CAPTURE_LOYALTY_VOUCHER_PAYMENT_SUCCESS:
      const { vouchersProcessed, paymentResponse } = action;

      loyaltyLinkedAccounts = state.loyaltyProcess.loyaltyLinkedAccounts;
      loyaltyAccountTierMap = {};

      loyaltyLinkedAccounts.forEach(loyaltyLinkedAccount => {
        loyaltyLinkedAccount.loyaltyAccountTiers.forEach(loyaltyAccountTier => {
          if (loyaltyAccountTier.accountNumber === vouchersProcessed[0].primaryAccountId) {
            loyaltyAccountTierMap = loyaltyAccountTier;
          }
        });
      });

      if (loyaltyAccountTierMap.voucherSummaries) {
        for (let i = 0; i < vouchersProcessed.length; i++) {
          const currentVoucherProcessed = vouchersProcessed[i];
          let voucher = loyaltyAccountTierMap.voucherSummaries.find(voucher => voucher.voucherId === currentVoucherProcessed.voucherId);
          if (voucher) {
            voucher.amountToBeCharged = currentVoucherProcessed.amount;
            voucher.paymentResponse = paymentResponse[i];
          }
        }
      }

      return {
        ...state,
        processingLoyaltyTransaction: false,
        loyaltyPaymentResponse: paymentResponse,
        loyaltyPaymentError: '',
        processingMultipleActions: false
      };

    case actions.CAPTURE_LOYALTY_VOUCHER_PAYMENT_FAILURE:
      return {
        ...state,
        processingLoyaltyTransaction: false,
        loyaltyPaymentError: action.error,
        processingMultipleActions: false
      };
    case actions.CAPTURE_LOYALTY_POINTS_SPLIT_PAYMENT:
      return {
        ...state,
        processingLoyaltyTransaction: true,
        loyaltyPaymentResponse: '',
        loyaltyPaymentError: ''
      };
    case actions.CAPTURE_LOYALTY_VOUCHER_SPLIT_PAYMENT:
      return {
        ...state,
        processingLoyaltyTransaction: true,
        loyaltyPaymentResponse: '',
        loyaltyPaymentError: ''
      };
    case actions.LOYALTY_TENDERS_INFO_LIST:
      return {
        ...state,
        loyaltyTendersInfo: action.loyaltyTendersInfo
      };
    case actions.CAPTURE_LOYALTY_HOST_COMP_VOUCHER_SPLIT_PAYMENT:
      return {
        ...state,
        processingLoyaltyTransaction: true,
        loyaltyPaymentResponse: '',
        loyaltyPaymentError: ''
      };

    case actions.CAPTURE_LOYALTY_HOST_COMP_VOUCHER_PAYMENT_SUCCESS:
      let { voucherProcessed } = action;
      voucherProcessed.amountToBeCharged = action.amountCharged;
      voucherProcessed.paymentResponse = action.paymentResponse;

      let listOfHostCompVoucherPayments = state.hostCompVoucherPayments;
      listOfHostCompVoucherPayments.push(voucherProcessed);

      return {
        ...state,
        hostCompVoucherPayments: listOfHostCompVoucherPayments,
        loyaltyPaymentResponse: action.paymentResponse,
        processingLoyaltyTransaction: false,
        loyaltyPaymentError: ''
      };

    case actions.CAPTURE_LOYALTY_HOST_COMP_VOUCHER_PAYMENT_FAILURE:
      return {
        ...state,
        processingLoyaltyTransaction: false,
        loyaltyPaymentError: action.error
      };

    case actions.REMOVE_LOYALTY_PAYMENTS:
      return {
        ...state,
        processingLoyaltyTransaction: true
      };

    case actions.REMOVE_AND_PROCESS_LOYALTY_VOUCHER_PAYMENTS:
      return {
        ...state,
        processingLoyaltyTransaction: true,
        processingMultipleActions: true
      };

    case actions.REMOVE_LOYALTY_PAYMENTS_SUCCESS:
      loyaltyLinkedAccounts = state.loyaltyProcess.loyaltyLinkedAccounts;
      let compHostAccountsList = state.hostCompVoucherPayments;
      loyaltyAccountTierMap = {};

      loyaltyLinkedAccounts.forEach(loyaltyLinkedAccount => {
        loyaltyLinkedAccount.loyaltyAccountTiers.forEach(loyaltyAccountTier => {
          if (loyaltyAccountTier.accountNumber === action.loyaltyPayments[0].primaryAccountId) {
            loyaltyAccountTierMap = loyaltyAccountTier;
          } else if (action.removeAll) {
            loyaltyAccountTierMap.pointsSummaries = loyaltyAccountTierMap.pointsSummaries || [];
            loyaltyAccountTierMap.voucherSummaries = loyaltyAccountTierMap.voucherSummaries || [];
            loyaltyAccountTierMap.pointsSummaries.push(...loyaltyAccountTier.pointsSummaries);
            loyaltyAccountTierMap.voucherSummaries.push(...loyaltyAccountTier.voucherSummaries);
          }
        });
      });
      if (loyaltyAccountTierMap) {
        if (action.removeAll) {
          loyaltyAccountTierMap.pointsSummaries && loyaltyAccountTierMap.pointsSummaries.map(voucher => {
            delete voucher.amountToBeCharged;
            delete voucher.paymentResponse;
          });
          loyaltyAccountTierMap.voucherSummaries && loyaltyAccountTierMap.voucherSummaries.map(voucher => {
            delete voucher.amountToBeCharged;
            delete voucher.paymentResponse;
          });
        } else {
          action.loyaltyPayments.forEach(payment => {
            if (payment.isHostComp) {
              compHostAccountsList = compHostAccountsList.filter(voucher => (voucher.voucherId !== payment.voucherId));
            }
            if (!payment.expirationDate) {
              let pointsSummariesDupe = loyaltyAccountTierMap.pointsSummaries;
              let pointsTypeCharged = pointsSummariesDupe.find(pointsType => pointsType.instrumentType === payment.instrumentType);
              if (pointsTypeCharged) {
                delete pointsTypeCharged.amountToBeCharged;
                delete pointsTypeCharged.paymentResponse;
              }
            } else {
              let voucherSummaries = loyaltyAccountTierMap.voucherSummaries;
              let voucherTypeCharged = voucherSummaries.find(voucher => voucher.voucherId === payment.voucherId);
              delete voucherTypeCharged.amountToBeCharged;
              delete voucherTypeCharged.paymentResponse;
            }
          });
        }
      }

      return {
        ...state,
        processingLoyaltyTransaction: false,
        hostCompVoucherPayments: compHostAccountsList,
        removeLoyaltyPaymentResponse: action.isAmountModified ? '' : action.removeLoyaltyPaymentsResponse,
        processingMultipleActions: action.processingMultipleActions || false,
        removeLoyaltyPaymentError: ''
      };
    case actions.REMOVE_LOYALTY_PAYMENTS_FAILED:
      return {
        ...state,
        removeLoyaltyPaymentError: action.error,
        processingLoyaltyTransaction: false,
        removeLoyaltyPaymentResponse: '',
        processingMultipleActions: false
      };
    case actions.GET_LOYALTY_INQUIRY:
      return {
        ...state,
        processingLoyaltyTransaction: false
      };
    case actions.LOYALTY_INQUIRY_DISABLE:
      return {
        ...state,
        disableLoyaltyInquiry: true,
        disableLoyaltyInquiryTimestamp: action.disableTimeStamp,
        loyaltyInquiryError: action.loyaltyInquiryError
      };
    case actions.LOYALTY_INQUIRY_ENABLE:
      return {
        ...state,
        disableLoyaltyInquiry: false,
        loyaltyInquiryRetryCount: 0,
        inquiryError: false, // TODO: where are we going to use this
        disableLoyaltyInquiryTimestamp: null,
        loyaltyInquiryError: ''
      };
    case actions.CAPTURE_LOYALTY_PAYMENT:
      return {
        ...state,
        processingLoyaltyTransaction: true,
        loyaltyPaymentResponse: '',
        loyaltyPaymentError: ''
      };
    case actions.CAPTURE_LOYALTY_PAYMENT_FAILED:
      return {
        ...state,
        processingLoyaltyTransaction: false,
        loyaltyPaymentError: action.error
      };
    case actions.CLEAR_LOYALTY_ERROR:
      return {
        ...state,
        showLoyaltyInquiryError: false,
        loyaltyPaymentError: '',
        loyaltyInquiryError: '',
        removeLoyaltyPaymentError: '',
        inquiryError: ''
      };
    case actions.PROCESS_MULTIPLE_ACTIONS:
      return {
        ...state,
        processingMultipleActions: true
      };
    case actions.PROCESS_LOYALTY_REMOVE_PAYMENT:
      return {
        ...state,
        processingLoyaltyTransaction: true
      };
    default:
      return state;
  }
};

export default LoyaltyReducer;
