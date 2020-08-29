// (C) 2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

'use strict';

const scheduledOrderingWarningModalText = {
    areYouSureText: 'Are you sure?',
    abandoningText: 'You will abandon all the items in your cart.',
    yesButton: 'YES',
    cancelButton: 'CANCEL',
    closeButton: '✕'
};

const genericAuthorizationText = {
    gaAccountErrorText: 'No accounts found. Check the account info you entered.',
    gaPaymentLabel: 'Employee Account',
    gaModalInstructionText: 'Enter details associated to your work account.'
};

class CommonStrings {
    constructor() {
        this.scheduledOrderingWarningModalText = scheduledOrderingWarningModalText;
        this.genericAuthorizationText = genericAuthorizationText;
    }
}

module.exports = new CommonStrings();