// (C) 2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

'use strict';

const axios = require('axios');
const constants = require('../scripts/constants');

function displayProfileCallHelperModule () {
}

var loginData = {
    'username': process.env.username,
    'password': process.env.password
};

async function fetchXToken () {
    console.log('Login Starting...');
    const loginResponse = await axios.post(`${process.env.backofficeUrl}/user-service/user/tenants/${process.env.tenantId}/users/login`,
        loginData)
        .then(function (response) {
            // console.log(response.data);     //Enable to debug responses
            console.log(response.status);
            return response.data;
        }).catch(function (ex, req) {
            console.log('Request Error...');
            console.log(ex.message);
            throw ex;
        });
    return loginResponse.token;
}

async function fetchDisplayProfileConfig (xtoken) {
    console.log('GET Request Starting...');
    const GETResponse = await axios.get(`${process.env.backofficeUrl}/eos-backend-service/tenants/${process.env.tenantId}/businessContexts/${process.env.storeBusinessContextID}/displayProfiles/${process.env.displayProfileID}`,
        { headers: { 'X-Token': xtoken } })
        .then(function (response) {
            // console.log(response.data);     //Enable to debug responses
            console.log(response.status);
            return response.data;
        }).catch(function (ex, req) {
            console.log('Request Error...');
            console.log(ex.message);
            throw ex;
        });
    return GETResponse;
}

async function putUpdatedConfig (config, xtoken) {
    console.log('PUT Request Starting...');
    const PUTResponse = await axios.put(`${process.env.backofficeUrl}/eos-backend-service/tenants/${process.env.tenantId}/businessContexts/${process.env.storeBusinessContextID}/displayProfiles/${process.env.displayProfileID}`,
        config, { headers: { 'X-Token': xtoken } })
        .then(function (response) {
            // console.log(response.data);      //Enable to debug responses
            console.log(response.status);
            return response.data;
        }).catch(function (ex, req) {
            console.log('Request Error...');
            console.log(ex.message);
            throw ex;
        });
}

displayProfileCallHelperModule.prototype = Object.create(Object.prototype, {

    acceptCustomTip: {
        async value(boolean) {
            const xtoken = await fetchXToken();
            const config = await fetchDisplayProfileConfig(xtoken);
            const updatedConfig = await acceptCustomTip(config, boolean);
            await putUpdatedConfig(updatedConfig, xtoken);
        }
    },
    toggleScheduledOrdering: {
        async value(boolean) {
            const xtoken = await fetchXToken();
            const config = await fetchDisplayProfileConfig(xtoken);
            const updatedConfig = await toggleScheduledOrdering(config, boolean);
            await putUpdatedConfig(updatedConfig, xtoken);
        }
    },

    toggleGA: {
        async value(boolean) {
            const xtoken = await fetchXToken();
            const config = await fetchDisplayProfileConfig(xtoken);
            const updatedConfig = await changeGAEnableOrDisable(config, boolean);
            await putUpdatedConfig(updatedConfig, xtoken);
        }
    },

    setGaMethodName: {
        async value(text) {
            const xtoken = await fetchXToken();
            const config = await fetchDisplayProfileConfig(xtoken);
            const updatedConfig = await setGaMethodNameText(config, text);
            await putUpdatedConfig(updatedConfig, xtoken);
        }
    },

    setGaInstructionTextTo: {
        async value(text) {
            const xtoken = await fetchXToken();
            const config = await fetchDisplayProfileConfig(xtoken);
            const updatedConfig = await setGaPaymentInstructionText(config, text);
            await putUpdatedConfig(updatedConfig, xtoken);
        }
    },

    enablePostingAccount: {
        async value(text) {
            const xtoken = await fetchXToken();
            const config = await fetchDisplayProfileConfig(xtoken);
            const updatedConfig = await enablePostingAccount(config, text);
            await putUpdatedConfig(updatedConfig, xtoken);
        }
    },


    toggleCC: {
        async value(boolean) {
            const xtoken = await fetchXToken();
            const config = await fetchDisplayProfileConfig(xtoken);
            const updatedConfig = await changeCCEnableOrDisable(config, boolean);
            await putUpdatedConfig(updatedConfig, xtoken);
        }
    },


    toggleRoomCharge: {
        async value(boolean) {
            const xtoken = await fetchXToken();
            const config = await fetchDisplayProfileConfig(xtoken);
            const updatedConfig = await changeRoomchargeEnableOrDisable(config, boolean);
            await putUpdatedConfig(updatedConfig, xtoken);
        }
    },


    toggleLoyalty: {
        async value(boolean) {
            const xtoken = await fetchXToken();
            const config = await fetchDisplayProfileConfig(xtoken);
            const updatedConfig = await changeLoyaltyEnableOrDisable(config, boolean);
            await putUpdatedConfig(updatedConfig, xtoken);
        }
    },


    toggleStripe: {
        async value(boolean) {
            const xtoken = await fetchXToken();
            const config = await fetchDisplayProfileConfig(xtoken);
            const updatedConfig = await changeStripeEnableOrDisable(config, boolean);
            await putUpdatedConfig(updatedConfig, xtoken);
        }
    },


    toggleMemberCharge: {
        async value(boolean) {
            const xtoken = await fetchXToken();
            const config = await fetchDisplayProfileConfig(xtoken);
            const updatedConfig = await changeMemberChargeEnableOrDisable(config, boolean);
            await putUpdatedConfig(updatedConfig, xtoken);
        }
    },

    setNameCaptureTo: {
        async value(boolean) {
            const xtoken = await fetchXToken();
            const config = await fetchDisplayProfileConfig(xtoken);
            const updatedConfig = await changeNameCaptureFeatureEnabled(config, boolean);
            await putUpdatedConfig(updatedConfig, xtoken);
        }
    },

    acceptTip: {
        async value (boolean) {
            const xtoken = await fetchXToken();
            const config = await fetchDisplayProfileConfig(xtoken);
            const updatedConfig = await changeAcceptTipTo(config, boolean);
		    await putUpdatedConfig(updatedConfig, xtoken);
	    }
    },

    setPhoneNumberCaptureTo: {
        async value(boolean) {
            const xtoken = await fetchXToken();
            const config = await fetchDisplayProfileConfig(xtoken);
            const updatedConfig = await changePhoneNumberCaptureFeature(config, boolean);
            await putUpdatedConfig(updatedConfig, xtoken);
        }
    },

    setTipPercentagesTo: {
        async value (percentages) {
            const xtoken = await fetchXToken();
            const config = await fetchDisplayProfileConfig(xtoken);
            const updatedConfig = await changeTipPercentagesTo(config, percentages);
            await putUpdatedConfig(updatedConfig, xtoken);
        }
    },

    setDeliveryLocationsTo: {
        async value(boolean) {
            const xtoken = await fetchXToken();
            const config = await fetchDisplayProfileConfig(xtoken);
            const updatedConfig = await changeDeliveryLocationsEnabled(config, boolean);
            await putUpdatedConfig(updatedConfig, xtoken);
        }
    },

	setPickUpTo: {
		async value(boolean) {
			const xtoken = await fetchXToken();
			const config = await fetchDisplayProfileConfig(xtoken);
			const updatedConfig = await changePickupDisabled(config, boolean);
			await putUpdatedConfig(updatedConfig, xtoken);
		}
	},

    setPaymentInstructionTextTo: {
        async value (instructionText) {
            const xtoken = await fetchXToken();
            const config = await fetchDisplayProfileConfig(xtoken);
            const updatedConfig = await setPayInstructionTextTo(config, instructionText);
            await putUpdatedConfig(updatedConfig, xtoken);
        }
    },

    setPhoneNumberInstructionTextTo: {
        async value(text) {
            const xtoken = await fetchXToken();
            const config = await fetchDisplayProfileConfig(xtoken);
            const updatedConfig = await changePhoneNumberInstructionTo(config, text);
            await putUpdatedConfig(updatedConfig, xtoken);
        }
    },

    setNameCaptureRequiredTo: {
        async value(boolean) {
            const xtoken = await fetchXToken();
            const config = await fetchDisplayProfileConfig(xtoken);
            const updatedConfig = await changeNameCaptureRequired(config, boolean);
            await putUpdatedConfig(updatedConfig, xtoken);
        }
    },

    setPhoneNumberCaptureRequiredTo: {
        async value(boolean) {
            const xtoken = await fetchXToken();
            const config = await fetchDisplayProfileConfig(xtoken);
            const updatedConfig = await changePhoneNumberRequiredTo(config, boolean);
            await putUpdatedConfig(updatedConfig, xtoken);
        }
    },

    setDeliveryLocationsInstructionTextTo: {
        async value(text) {
            const xtoken = await fetchXToken();
            const config = await fetchDisplayProfileConfig(xtoken);
            const updatedConfig = await changeDeliveryLocationsInstruction(config, text);
            await putUpdatedConfig(updatedConfig, xtoken);
        }
    },


    setDeliveryEntriesCountTo: {
        async value(fieldCount) {
            const xtoken = await fetchXToken();
            const config = await fetchDisplayProfileConfig(xtoken);
            const updatedConfig = await changeDeliveryEntries(config, fieldCount);
            await putUpdatedConfig(updatedConfig, xtoken);
        }
    },

    setFirstDeliveryFieldLabelTo: {
        async value(fieldPosition, data) {
            const xtoken = await fetchXToken();
            const config = await fetchDisplayProfileConfig(xtoken);
            const updatedConfig = await changeFirstDeliveryFieldLabelTo(config, fieldPosition, data);
            await putUpdatedConfig(updatedConfig, xtoken);
        }
    },

    setDeliveryFieldKitchenTo: {
        async value(fieldPosition, data) {
            const xtoken = await fetchXToken();
            const config = await fetchDisplayProfileConfig(xtoken);
            const updatedConfig = await changeDeliveryFieldKitchenTo(config, fieldPosition, data);
            await putUpdatedConfig(updatedConfig, xtoken);
        }
    },

    setDeliveryFieldCharacterRestrictionTo: {
        async value(fieldPosition, data, regex) {
            const xtoken = await fetchXToken();
            const config = await fetchDisplayProfileConfig(xtoken);
            const updatedConfig = await changeDeliveryFieldCharacterRestrictionTo(config, fieldPosition, data, regex);
            await putUpdatedConfig(updatedConfig, xtoken);
        }
    },

    setDeliveryFieldMaxCharLengthTo: {
        async value(fieldPosition, data) {
            const xtoken = await fetchXToken();
            const config = await fetchDisplayProfileConfig(xtoken);
            const updatedConfig = await changeDeliveryFieldMaxCharLengthTo(config, fieldPosition, data);
            await putUpdatedConfig(updatedConfig, xtoken);
        }
    },

    setDeliveryFieldMinCharLengthTo: {
        async value(fieldPosition, data) {
            const xtoken = await fetchXToken();
            const config = await fetchDisplayProfileConfig(xtoken);
            const updatedConfig = await changeDeliveryFieldMinCharLengthTo(config, fieldPosition, data);
            await putUpdatedConfig(updatedConfig, xtoken);
        }
    },

    setNameCaptureInstructionTextTo: {
        async value(text) {
            const xtoken = await fetchXToken();
            const config = await fetchDisplayProfileConfig(xtoken);
            const updatedConfig = await changeNameCaptureInstructionText(config, text);
            await putUpdatedConfig(updatedConfig, xtoken);
        }
    },

    setPickUpTo: {
        async value(boolean) {
            const xtoken = await fetchXToken();
            const config = await fetchDisplayProfileConfig(xtoken);
            const updatedConfig = await changePickupDisabled(config, boolean);
            await putUpdatedConfig(updatedConfig, xtoken);
        }
    }
});

async function acceptCustomTip(config, boolean) {
    config.featureConfigurations.tipConfiguration.acceptCustomTip = boolean;
    return config;
}

async function changeNameCaptureFeatureEnabled(config, boolean) {
    config.featureConfigurations.nameCapture.featureEnabled = boolean;
    return config;
}


async function changeAcceptTipTo(config, boolean) {
    config.featureConfigurations.tipConfiguration.acceptTips = boolean;
    return config;
}

async function changeTipPercentagesTo(config, percentages) {
    config.featureConfigurations.tipConfiguration.tips = JSON.parse(percentages);
	return config;
}

async function changePhoneNumberCaptureFeature(config, boolean) {
    config.displayProfileOptions.isSmsEnabled = boolean;
    return config;
}

async function changePhoneNumberInstructionTo(config, text) {
    config.displayProfileOptions.smsInstructionText = text;
    return config;
}

async function changePhoneNumberRequiredTo(config, boolean) {
    config.displayProfileOptions.isMobileNumberRequired = boolean;
    return config;
}

async function changeDeliveryLocationsEnabled(config, boolean) {
    config.featureConfigurations.deliveryDestination.deliverToDestinationEnabled = boolean;
    return config;
}

async function changePickupDisabled(config, boolean) {
	config.featureConfigurations.pickUpConfig.featureEnabled= boolean;
	return config;
}

async function changeDeliveryLocationsInstruction(config, text) {
    config.featureConfigurations.deliveryDestination.instructionText = text;
    return config;
}

async function changeDeliveryEntries(config, fieldCount) {
    if(fieldCount==2) {
        config.featureConfigurations.deliveryDestination.deliveryDestinationEntries = JSON.parse(constants.devileryDestination2Entries);
    }
    if(fieldCount==3) {
        config.featureConfigurations.deliveryDestination.deliveryDestinationEntries = JSON.parse(constants.devileryDestination3Entries);
    }
    return config;
}

async function changeFirstDeliveryFieldLabelTo(config, fieldPosition, data) {
    config.featureConfigurations.deliveryDestination.deliveryDestinationEntries[fieldPosition].fieldName = data;
    return config;
}

async function changeDeliveryFieldKitchenTo(config, fieldPosition, data) {
    config.featureConfigurations.deliveryDestination.deliveryDestinationEntries[fieldPosition].kitchenText = data;
    return config;
}

async function changeDeliveryFieldCharacterRestrictionTo(config, fieldPosition, data, regex) {
    config.featureConfigurations.deliveryDestination.deliveryDestinationEntries[fieldPosition].characterRestriction = data;
    config.featureConfigurations.deliveryDestination.deliveryDestinationEntries[fieldPosition].validationRegEx = regex;
    return config;
}

async function changeDeliveryFieldMaxCharLengthTo(config, fieldPosition, data) {
    config.featureConfigurations.deliveryDestination.deliveryDestinationEntries[fieldPosition].characterMaxLength = data;
    return config;
}

async function changeDeliveryFieldMinCharLengthTo(config, fieldPosition, data) {
    config.featureConfigurations.deliveryDestination.deliveryDestinationEntries[fieldPosition].characterMinLength = data;
    return config;
}

async function changeNameCaptureRequired(config, boolean) {
    config.featureConfigurations.nameCapture.guestNameRequired = boolean;
    return config;
}

async function changeNameCaptureInstructionText(config, text) {
    config.featureConfigurations.nameCapture.guestNameInstructionText = text;
    return config;
}

async function toggleScheduledOrdering(config, boolean) {
    config.featureConfigurations.scheduleOrdering.featureEnabled = boolean;
    return config;
}

async function setPayInstructionTextTo (config, instructionText) {
    config.featureConfigurations.sitePayments.instructionText = instructionText;
    return config;
}

async function changePickupDisabled(config, boolean) {
    config.featureConfigurations.pickUpConfig.featureEnabled= boolean;
    return config;
}


async function changeLoyaltyEnableOrDisable(config, boolean) {
    config.featureConfigurations.sitePayments.paymentConfigs[5].paymentEnabled = boolean;
    return config;
}

async function changeStripeEnableOrDisable(config, boolean) {
    config.featureConfigurations.sitePayments.paymentConfigs[4].paymentEnabled = boolean;
    return config;
}

async function changeGAEnableOrDisable(config, boolean) {
    config.featureConfigurations.sitePayments.paymentConfigs[3].paymentEnabled = boolean;
    return config;
}

async function enablePostingAccount(config, text) {
    config.featureConfigurations.sitePayments.paymentConfigs[3].secondaryVerificationType = text;
    return config;
}

async function changeRoomchargeEnableOrDisable(config, boolean) {
    config.featureConfigurations.sitePayments.paymentConfigs[2].paymentEnabled = boolean;
    return config;
}

async function changeMemberChargeEnableOrDisable(config, boolean) {
    config.featureConfigurations.sitePayments.paymentConfigs[1].paymentEnabled = boolean;
    return config;
}

async function changeCCEnableOrDisable(config, boolean) {
    config.featureConfigurations.sitePayments.paymentConfigs[0].paymentEnabled = boolean;
    return config;
}

async function setGaMethodNameText(config, text) {
    config.featureConfigurations.sitePayments.paymentConfigs[3].displayLabel = text;
    return config;
}

async function setGaPaymentInstructionText(config, text) {
    config.featureConfigurations.sitePayments.paymentConfigs[3].instructionText = text;
    return config;
}

module.exports = function () {
    return new displayProfileCallHelperModule();
};