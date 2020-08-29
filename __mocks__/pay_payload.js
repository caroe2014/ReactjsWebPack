export const payPayload = {
  'transactionReferenceData': {
    'transactionId': '93ffb3c3-bba2-4bb5-a700-085251297623',
    'token': 'UID:635726574799214095',
    'transactionState': 'Tm8gZHJhZ29ucyEgS2l0dGllcyBhbmQgdW5pY29ybnMh'
  },
  'transactionResponseData': {
    'authorizedAmount': 0,
    'subTotalAmount': 0,
    'tipAmount': 0,
    'totalAmount': 0
  },
  'cardInfo': {
    'cardHolderName': 'testuser',
    'accountNumberMasked': '411112xxxxxx2010',
    'cardIssuer': 'Visa',
    'cardType': 'credit',
    'expirationYearMonth': '201912'
  },
  'gatewayResponseData': {
    'decision': 'ACCEPT',
    'code': '00',
    'message': 'Approved',
    'processorCode': '00',
    'processorMessage': 'APPROVED',
    'avsCode': 'M',
    'processorAvsCode': 'M',
    'authCode': 'OK1234',
    'referenceCode': 'ABC12345',
    'batchId': '1'
  }
};

export const payAgentRequest = {
  'gatewayId': 'freedomPay',
  'industryType': 'retail',
  'configuration': [
    {
      'key': 'freedomPay.storeid',
      'value': '1417877014'
    },
    {
      'key': 'freedomPay.terminalid',
      'value': '2417983014'
    },
    {
      'key': 'freedomPay.tokenType',
      'value': '3'
    }
  ],
  'invoiceData': {
    'invoiceId': '00264',
    'invoiceDate': '2019-03-22T16:57:01.594Z'
  },
  'transactionData': {
    'transactionDate': '2019-03-22T16:57:01.594Z',
    'transactionAmount': '3.30',
    'taxAmount': '0.30',
    'tipAmount': '0',
    'allowPartialTransactionAmount': true
  }
};
