'use strict';

let loginPageObjects = require('../pageObjects/loginPage.objects');
let homePageObjects = require('../pageObjects/homePage.objects');
let pageHeader= require('../pageObjects/header.objects');
let scheduledOrderingPageObjects = require('../pageObjects/scheduledOrderingPage.objects');


function HelperPageObject() {
}

HelperPageObject.prototype = Object.create(Object.prototype, {
    OpenBrowser: {
        value(isScheduledOrderingEnabled = false) {
            console.log(`Opening browser: ${process.env.uri}`);
            if(process.env.basePath != 'undefined') {
                browser.url(`${process.env.uri}${process.env.basePath}`);
            } else {
                browser.url(process.env.uri);
            }
            console.log("Loaded the url -> " + browser.getUrl());

            if (!isScheduledOrderingEnabled) {
                homePageObjects.selectALocationHeader.waitForVisible();
                console.log("Page Header Found!");
            } else {
                scheduledOrderingPageObjects.outerDiv.waitForVisible();
                console.log("Scheduled order content Found!");
            }
        }
    },

    openApplicationIndexPage: {
        value() {
            if(process.env.basePath != 'undefined') {
                browser.url(`${process.env.uri}${process.env.basePath}`+'/internal/index.html');
            } else {
                browser.url(process.env.uri);
            }
            pageHeader.appContainer.waitForVisible();
            console.log("Loaded the url -> " + browser.getUrl());
        }
    },

    loginSubmit: {
        value() {
            loginPageObjects.usernameField.setValue('username');
            loginPageObjects.passwordField.setValue('password');
            loginPageObjects.submit().click();
        }
    },

    buyOnDemandLogoVisible: {
        value() {
            pageHeader.buyOnDemand.waitForVisible();
            return true;
        }
    },

    locationPageVisible: {
        value() {
            return homePageObjects.selectALocationHeader.waitForVisible();
        }
    },

    isStoreNameVisible: {
        value() {
            return homePageObjects.locationName.waitForVisible();
        }
    },

    isStoreAddressVisible: {
        value() {
            return homePageObjects.addressOfStore.waitForVisible();
        }
    },

    isStoreTimingVisible: {
        value() {
	        homePageObjects.selectALocationHeader.waitForVisible();
            return homePageObjects.storeTiming.isVisible();
        }
    },

    getStoreTimingFromMainPage: {
        value() {
            homePageObjects.storeTiming.waitForVisible();
            return homePageObjects.storeTiming.getText();
        }
    },

    statusImageOverlay: {
        value() {
            return homePageObjects.storeStatusInImage.getText();
        }
    },

    hoverOverLocationTile: {
        value() {
            homePageObjects.locationName.moveToObject();
        }
    },

    getHealthCheckSummary: {
        value() {
            loginPageObjects.healthCheckSummary.waitForVisible();
            return loginPageObjects.healthCheckSummary.getText();
        }
    },

    clickManifest: {
        value() {
            loginPageObjects.manifestBtn.waitForVisible();
            loginPageObjects.manifestBtn.click();
            browser.pause(1000);
        }
    },

    getManifest: {
        value() {
            loginPageObjects.manifest.waitForVisible();
            return loginPageObjects.manifest.getText();
        }
    }
});

module.exports = function () {
    return new HelperPageObject();
};


