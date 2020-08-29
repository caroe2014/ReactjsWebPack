'use strict';

let homePageObjects = require('../pageObjects/homePage.objects');
let cartobjects = require('../pageObjects/cart.objects');
let pageHeader= require('../pageObjects/header.objects');

function HelperPageObject() {
}

function getColor(element, property)  {
    pageHeader.buyOnDemand.waitForVisible();
    let colorObj = (element).getCssProperty(property);
    return colorObj.parsed.hex;
}

HelperPageObject.prototype = Object.create(Object.prototype, {

    clickCart: {
        value() {

            homePageObjects.myCart.waitForVisible();
            homePageObjects.myCart.click();
            cartobjects.cartSummary.waitForVisible();
        }
    },

    waitForSelectLocationPage: {
        value() {
            homePageObjects.selectFirstLocation.waitForVisible();
        }
    },

    clickOnHomeButton: {
        value() {
            pageHeader.homeButton.waitForVisible();
            pageHeader.homeButton.click();
        }
    },

    selectLocation: {
        value(location = 0) {
            homePageObjects.selectFirstLocation.waitForVisible();
            let allLocations = homePageObjects.getAllLocations;
            let locationName = homePageObjects.getLocation(allLocations[location]).getText();
            homePageObjects.selectPickUp(allLocations[location]).click();
            return locationName;
        }
    },

    storeTimeOnLocationPage: {
        value() {
            homePageObjects.storeTiming.waitForVisible();
            return homePageObjects.storeTiming.isVisible();
        }
    },

    siteListVisible: {
        value() {
            homePageObjects.selectALocationHeader.waitForVisible();
            return true;
        }
    },

    getBackGroundColor: {
        value() {
            pageHeader.buyOnDemand.waitForVisible();
            let colorObj = (homePageObjects.appBackGround).getCssProperty('background-color');
            return colorObj.parsed.hex;
        }
    },

    getHeaderColor: {
        value() {
            return getColor(pageHeader.headerComponent, 'background-color');
        }
    },

    getHeaderTextColor: {
        value() {
            return getColor(pageHeader.headerTextColor, 'color');
        }
    },

    getFooter: {
        value() {
            return pageHeader.footerComponent.isVisible();
        }
    },

	getLocationHeaderColor: {
		value() {
			return getColor(homePageObjects.selectLocationText, 'color');
		}
    },

	getLocationNameColorOnHover: {
		value() {
			homePageObjects.locationName.moveToObject();
			browser.pause(100);
			return getColor(homePageObjects.locationName, 'color');
		}
    },

    getBackToScheduledOrderingPage: {
        value() {
            homePageObjects.changeTimeButton.waitForVisible();
            homePageObjects.changeTimeButton.click();
        }
    }
});

module.exports = function () {
    return new HelperPageObject();
};