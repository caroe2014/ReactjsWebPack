// (C) 2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

'use strict';

const axios = require('axios');

function backOfficeHelperModule () {
}

var loginData = {
	'username': process.env.username,
	'password': process.env.password
};

let headersGET = {
	'tenantId': process.env.tenantId,
	'domain': process.env.domain
};

async function fetchXToken () {
	console.log('Login Starting...');
	const loginResponse = await axios.post(`${process.env.uri}:443/user-service/user/tenants/${process.env.tenantId}/users/login`,
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

async function fetchOndemandConfig (xtoken) {
	console.log('GET Request Starting...');
	const GETResponse = await axios.get(`${process.env.uri}/eos-backend-service/onDemandConfiguration`,
		{ headers: { ...headersGET, 'X-Token': xtoken } })
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
	const PUTResponse = await axios.put(`${process.env.uri}:443/eos-backend-service/tenants/${process.env.tenantId}/businessContexts/${process.env.businessContextId}/onDemandConfiguration/${process.env.ondemandConfigId}`,
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

backOfficeHelperModule.prototype = Object.create(Object.prototype, {

	changeDesktopBGColor: {
		async value (color) {
			const xtoken = await fetchXToken();
			const config = await fetchOndemandConfig(xtoken);
			const updatedConfig = await changeBackGroundColor(config, color);
			await putUpdatedConfig(updatedConfig, xtoken);
		}

	},

	setIntervalTimeForScheduledOrdering: {
        async value (intervalTime) {
            const xtoken = await fetchXToken();
            const config = await fetchOndemandConfig(xtoken);
            const updatedConfig = await setIntervalTimeForScheduledOrdering(config, intervalTime);
            await putUpdatedConfig(updatedConfig, xtoken);
        }
    },

    setBufferTimeForScheduledOrdering: {
        async value (bufferTime) {
            const xtoken = await fetchXToken();
            const config = await fetchOndemandConfig(xtoken);
            const updatedConfig = await setBufferTimeForScheduledOrdering(config, bufferTime);
            await putUpdatedConfig(updatedConfig, xtoken);
        }
    },


	setScheduledOrderPageTitleTo: {
		async value(titleText) {
			const xtoken = await fetchXToken();
			const config = await fetchOndemandConfig(xtoken);
			const updatedConfig = await changeScheduledOrderingPageTitle(config, titleText);
			await putUpdatedConfig(updatedConfig, xtoken);
		}
	},

	changeHeaderFooterColor: {
		async value (color) {
			const xtoken = await fetchXToken();
			const config = await fetchOndemandConfig(xtoken);
			const updatedConfig = await changeHeaderAndFooterColor(config, color);
			await putUpdatedConfig(updatedConfig, xtoken);
		}
	},

	acceptTip: {
		async value (boolean) {
			const xtoken = await fetchXToken();
			const config = await fetchOndemandConfig(xtoken);
			const updatedConfig = await acceptTip(config, boolean);
			await putUpdatedConfig(updatedConfig, xtoken);
		}
	},

	changeHeaderFooterTextColor: {
		async value (color) {
			const xtoken = await fetchXToken();
			const config = await fetchOndemandConfig(xtoken);
			const updatedConfig = await changeHeaderAndFooterTextColor(config, color);
			await putUpdatedConfig(updatedConfig, xtoken);
		}
	},

	setStoreShowTimingTo: {
		async value (boolean) {
			const xtoken = await fetchXToken();
			const config = await fetchOndemandConfig(xtoken);
			const updatedConfig = await setShowStoreTimingTo(config, boolean);
			await putUpdatedConfig(updatedConfig, xtoken);
		}
	},

	setTextThemeColors: {
		async value(bannerColor, bannerTextColor, titleHeaderColor, buttonControlColor, buttonTextColor) {
			const xtoken = await fetchXToken();
			const config = await fetchOndemandConfig(xtoken);
			const updatedConfig = await changeTextThemeColorsTo(config, bannerColor, bannerTextColor, titleHeaderColor, buttonControlColor, buttonTextColor);
			await putUpdatedConfig(updatedConfig, xtoken);
		}
	}

});

async function changeBackGroundColor (config, color) {
	config.theme.desktop.color = color;
	config.theme.desktop.showImage = 'false';
	return config;
}

async function changeHeaderAndFooterColor (config, color) {
	config.theme.textAndControls.bannerColor = color;
	return config;
}

async function changeHeaderAndFooterTextColor (config, color) {
	config.theme.textAndControls.bannerTextColor = color;
	return config;
}

async function setShowStoreTimingTo (config, boolean) {
	config.showOperationTimes = boolean;
	return config;
}

async function acceptTip (config, boolean) {
	config.tipConfiguration.acceptTips = boolean;
	return config;
}

async function changeTextThemeColorsTo(config, bannerColor, bannerTextColor, titleHeaderColor, buttonControlColor, buttonTextColor) {
	config.theme.textAndControls.bannerColor = bannerColor;
	config.theme.textAndControls.bannerTextColor = bannerTextColor;
	config.theme.textAndControls.titleColor = titleHeaderColor;
	config.theme.textAndControls.buttonControlColor = buttonControlColor;
	config.theme.textAndControls.buttonTextColor = buttonTextColor;
	return config;
}

async function setIntervalTimeForScheduledOrdering(config, intervalTime) {
	config.properties.scheduledOrdering.intervalTime = intervalTime;
	return config;
}

async function setBufferTimeForScheduledOrdering(config, bufferTime) {
	config.properties.scheduledOrdering.bufferTime = bufferTime;
	return config;
}

async function changeScheduledOrderingPageTitle(config, titleText) {
    config.properties.scheduledOrdering.headerText = titleText;
    return config;
}

module.exports = function () {
	return new backOfficeHelperModule();
};
