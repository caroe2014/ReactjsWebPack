// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import get from 'lodash.get';
const uuidv4 = require('uuid/v4');

export const mapPaymentProcessorPropertiesConfiguration = (config) => {
  return Object.keys(config).map(key => ({
    key,
    value: config[key]
  }));
};

export const getPaymentProperties = (paymentInfo) => {
  let properties = {};
  let employeeId = get(paymentInfo, 'igSettings.onDemandEmployeeId');
  if (employeeId) {
    properties.employeeId = employeeId;
  }
  return properties;
};

export const buildExternalPaymentType = (paymentData) => {
  return {
    paymentData: {
      'id': uuidv4(),
      paymentRequest: {
        tenantId: paymentData.order.tenantId,
        contextId: paymentData.order.contextId,
        paymentAction: {},
        'paymentProviderId': 'EXTERNAL',
        'currencyUnit': get(paymentData.currencyDetails, 'currencyCode', 'USD'),
        'transactionData': {
          'amount': {
            'currencyUnit': get(paymentData.currencyDetails, 'currencyCode', 'USD'),
            'amount': paymentData.subtotal
          },
          'tipAmount': {
            'currencyUnit': get(paymentData.currencyDetails, 'currencyCode', 'USD'),
            'amount': paymentData.tipAmount ? paymentData.tipAmount : '0.00'
          },
          'description': paymentData.transactionId
        }
      },
      paymentResponse: {
        'paymentProviderId': 'EXTERNAL',
        paymentSupport: {
          'amount': {
            'currencyUnit': get(paymentData.currencyDetails, 'currencyCode', 'USD'),
            'amount': paymentData.subtotal
          },
          'tipAmount': {
            'currencyUnit': get(paymentData.currencyDetails, 'currencyCode', 'USD'),
            'amount': paymentData.tipAmount ? paymentData.tipAmount : '0.00'
          },
          'paymentForm': 'EXTERNAL',
          'paymentState': 'CAPTURED',
          'offlineStatus': {
            'offline': false,
            'offlineScopeId': ''
          }
        },
        'properties': {
          'tenderId': paymentData.igSettings.onDemandTenderId,
          'igVerificationCodeId': paymentData.igSettings.onDemandIgVerificationCodeId
        }
      }
    }
  };
};

export const buildBuyCreditCardPayment = (paymentInfo) => {

  paymentInfo.saleData.paymentData.cardInfo.cardHolderName = paymentInfo.saleData.tokenizedData.paymentDetails.cardHolderName;
  paymentInfo.saleData.paymentData.cardInfo.expirationYearMonth = paymentInfo.saleData.tokenizedData.paymentDetails.expirationYearMonth;

  return {
    paymentData: {
      'id': uuidv4(),
      paymentRequest: {
        tenantId: paymentInfo.order.tenantId,
        contextId: paymentInfo.order.contextId,
        paymentAction: {
          type: 'CAPTURE',
          properties: {
            'rguest_buy_order_tenantId': paymentInfo.order.tenantId,
            'rguest_buy_order_contextId': paymentInfo.order.contextId,
            'rguest_buy_order_orderId': paymentInfo.order.orderId
          }
        },
        currencyUnit: paymentInfo.currencyDetails.currencyCode,
        paymentProviderId: 'RGUESTPAY_CREDIT_CARD',
        transactionData: {
          rguestPayAgentTransactionServiceResponse: paymentInfo.saleData.paymentData,
          rguestPayAgentTransactionServiceRequest: {
            requestId: uuidv4(),
            industryType: paymentInfo.saleData.payAgentRequest.industryType,
            gatewayId: paymentInfo.saleData.payAgentRequest.gatewayId,
            configuration: paymentInfo.saleData.payAgentRequest.configuration,
            invoiceData: paymentInfo.saleData.payAgentRequest.invoiceData,
            transactionData: paymentInfo.saleData.payAgentRequest.transactionData,
            offline: false
          }
        },
        properties: getPaymentProperties(paymentInfo)
      },
      paymentResponse: {
        paymentProviderId: 'RGUESTPAY_CREDIT_CARD',
        transactionData: {},
        paymentSupport: {
          amount: {
            currencyUnit: paymentInfo.currencyDetails.currencyCode,
            amount: paymentInfo.saleData.paymentData.transactionResponseData.subTotalAmount
          },
          tipAmount: {
            currencyUnit: paymentInfo.currencyDetails.currencyCode,
            amount: paymentInfo.tipAmount ? paymentInfo.tipAmount : '0.00'
          },
          paymentForm: 'CREDIT_CARD',
          paymentState: 'CAPTURED',
          offlineStatus: {
            offline: false,
            offlineScopeId: ''
          }
        },
        properties: getPaymentProperties(paymentInfo)
      }
    }
  };
};

export const getIframeConfiguration = (displayProfile, useProfitCenterByConcept, concept) => {
  if (useProfitCenterByConcept && concept.conceptOptions.profitCenterId && concept.conceptOptions.clientId) {
    const { clientId, apiUserName, nonce, iFrameTenantID, iFrameUserApi, iFrameApi } = concept.conceptOptions;

    // return in this format to match displayProfile.featureConfigurations format
    return {
      'config': {
        'iframeAuth': {
          clientId,
          apiUserName,
          nonce,
          iFrameTenantID,
          iFrameUserApi,
          iFrameApi
        }
      }
    };
  } else {
    const paymentConfig = get(displayProfile, 'featureConfigurations.sitePayments.paymentConfigs');
    if (paymentConfig) {
      return paymentConfig.find(pay => pay.type === 'rGuestIframe');
    }
  }
};

export const getPaymentOptions = (displayProfile, roomIdList) => {
  let payOptions = [];
  const paymentConfigs = get(displayProfile, 'featureConfigurations.sitePayments.paymentConfigs');
  if (paymentConfigs) {
    payOptions = paymentConfigs.filter(option => option.type !== 'stripe').filter(option => option.type === 'roomCharge' ? option.paymentEnabled && roomIdList : option.paymentEnabled).map(pay => {
      const { config, ...prunedData } = pay;
      return prunedData;
    });
  }
  return payOptions;
};

export const getRoomChargeDetails = (paymentTypesList, roomChargeIds) => {
  return paymentTypesList.filter(paymentType => roomChargeIds.includes(paymentType.id));
};

export const getMemberChargeDetails = (paymentTypesList, memberChargeId) => {
  return paymentTypesList.filter(paymentType => paymentType.tenderId === memberChargeId)[0];
};

export const buildRoomChargeCapturePayload = (paymentInfo) => {
  const roomChargeAccount = paymentInfo.roomChargeData.roomChargeAccountInfo.roomChargeAccounts[0];
  const capturePayload = {
    'tenantId': paymentInfo.tenantId,
    'contextId': paymentInfo.order.contextId,
    'paymentAction': {
      'type': 'CAPTURE',
      'properties': {}
    },
    'paymentProviderId': 'ROOM_CHARGE',
    'transactionData': {
      'roomChargePaymentTransactionRequest': {
        'postingAccount': roomChargeAccount.postingAccount,

        'guestName': paymentInfo.roomChargeData.guestName,
        'roomNumber': paymentInfo.roomChargeData.roomNumber,
        'amount': {
          'paymentAmount': {
            'currencyUnit': paymentInfo.currencyDetails.currencyCode,
            'amount': paymentInfo.roomChargeData.paymentAmount.amount
          },
          'tipAmount': {
            'currencyUnit': paymentInfo.currencyDetails.currencyCode,
            'amount': paymentInfo.roomChargeData.paymentAmount.tipAmount
          },
          'taxAmount': {
            'currencyUnit': paymentInfo.currencyDetails.currencyCode,
            'amount': paymentInfo.order.taxTotalAmount.amount
          }

        },
        'cardPresent': false,
        'properties': {
          'orderId': paymentInfo.order.orderId,
          'tenderId': paymentInfo.roomChargeData.tenderId,
          'checkNumber': paymentInfo.order.orderNumber,
          'terminalId': get(paymentInfo, 'igSettings.onDemandTerminalId'),
          'employeeId': get(paymentInfo, 'igSettings.onDemandEmployeeId'),
          'profitCenterId': get(paymentInfo, 'profitCenterId'),
          'pmsAdapterId': paymentInfo.roomChargeData.pmsAdapterId,
          'accountNumber': roomChargeAccount.postingAccount,
          'mealPeriodId': paymentInfo.mealPeriodId,
          'folioNumber': roomChargeAccount.folioNumber || '',
          'igVerificationCodeId': paymentInfo.roomChargeData.verificationCodeId,
          'sourcePropertyId': get(paymentInfo, 'igSettings.sourcePropertyId'),
          'destinationPropertyId': get(paymentInfo, 'igSettings.destinationPropertyId')
        }
      }
    },
    'properties': {}
  };
  return capturePayload;
};

export const buildMemberChargeCapturePayload = (paymentInfo) => {
  const memberChargeAccount = paymentInfo.memberChargeData.memberChargeAccountInfo.roomChargeAccounts[0];
  const capturePayload = {
    'tenantId': paymentInfo.tenantId,
    'contextId': paymentInfo.order.contextId,
    'paymentAction': {
      'type': 'CAPTURE',
      'properties': {}
    },
    'paymentProviderId': 'ROOM_CHARGE',
    'transactionData': {
      'roomChargePaymentTransactionRequest': {
        'postingAccount': memberChargeAccount.postingAccount,
        'guestName': paymentInfo.memberChargeData.guestName,
        'roomNumber': memberChargeAccount.roomNumber,
        'amount': {
          'paymentAmount': {
            'currencyUnit': paymentInfo.currencyDetails.currencyCode,
            'amount': paymentInfo.memberChargeData.paymentAmount.amount
          },
          'tipAmount': {
            'currencyUnit': paymentInfo.currencyDetails.currencyCode,
            'amount': paymentInfo.memberChargeData.paymentAmount.tipAmount
          },
          'taxAmount': {
            'currencyUnit': paymentInfo.currencyDetails.currencyCode,
            'amount': paymentInfo.order.taxTotalAmount.amount
          }

        },
        'cardPresent': false,
        'properties': {
          'orderId': paymentInfo.order.orderId,
          'tenderId': paymentInfo.memberChargeData.tenderId,
          'checkNumber': paymentInfo.order.orderNumber,
          'terminalId': get(paymentInfo, 'igSettings.onDemandTerminalId'),
          'employeeId': get(paymentInfo, 'igSettings.onDemandEmployeeId'),
          'profitCenterId': get(paymentInfo, 'profitCenterId'),
          'pmsAdapterId': paymentInfo.memberChargeData.pmsAdapterId,
          'accountNumber': paymentInfo.memberChargeData.memberNumber,
          'mealPeriodId': paymentInfo.mealPeriodId,
          'folioNumber': memberChargeAccount.folioNumber || '',
          'igVerificationCodeId': paymentInfo.memberChargeData.verificationCodeId,
          'sourcePropertyId': get(paymentInfo, 'igSettings.sourcePropertyId'),
          'destinationPropertyId': get(paymentInfo, 'igSettings.destinationPropertyId')
        }
      }
    },
    'properties': {}
  };
  return capturePayload;
};

export const buildAtriumAuthPayload = (paymentInfo) => {
  const capturePayload = {
    'properties': {
      'tenderId': paymentInfo.atriumAccount.taxableTenderId,
      'igVerificationCodeId': paymentInfo.paymentTenderInfo[paymentInfo.atriumAccount.taxableTenderId].verificationCodeId
    },
    'tenantId': paymentInfo.tenantId,
    'contextId': paymentInfo.contextId,
    'paymentAction': {
      'type': 'AUTHORIZE'
    },
    'paymentProviderId': 'ATRIUM',
    'transactionData': {
      'atriumPaymentRequest': {
        'atriumUrl': paymentInfo.atriumUrl,
        'tenderId': paymentInfo.tenderId,
        'atriumTerminal': {
          'terminalId': paymentInfo.terminalId,
          'terminalCredentialKey': paymentInfo.terminalCredentialKey
        },
        'customer': {
          'customerType': 'campusid',
          'id': paymentInfo.id
        },
        'atriumCurrency': {
          'currencyType': paymentInfo.currency,
          'total': paymentInfo.amountToCharge,
          'tax': paymentInfo.totalTaxAmount
        }
      }
    }
  };
  if (paymentInfo.atriumAccount.limitOnAccount) {
    capturePayload.transactionData.atriumPaymentRequest.atriumCurrency.conversion = {
      'currencyUnit': get(paymentInfo.currencyDetails, 'currencyCode', 'USD'),
      'conversionRate': paymentInfo.atriumAccount.limitOnAccount
    };
  }
  return capturePayload;
};
