'use strict';

let conceptObjects = require('../pageObjects/conceptPage.objects');
let pageHeader= require('../pageObjects/header.objects');

function HelperPageObject() {
}

HelperPageObject.prototype = Object.create(Object.prototype, {

    fetchLocationFromConceptPage: {
        value() {
            conceptObjects.selectAConceptHeader.waitForVisible();
            return conceptObjects.locationTitle.getText();
        }
    },

    selectAConcept: {
        value(concept = 0) {
            conceptObjects.selectAConceptHeader.waitForVisible();
            let allConcepts = conceptObjects.getAllConcepts;
            let conceptName = conceptObjects.getConcept(allConcepts[concept]).getText();
            conceptObjects.getConcept(allConcepts[concept]).click();
            return conceptName;
        }
    },

    clickChangeLocation: {
        value() {
            conceptObjects.changeLocationButoon.waitForVisible();
            conceptObjects.changeLocationButoon.click();
        }
    },

    getStoreTimingConceptPage: {
        value() {
            conceptObjects.storeTime.waitForVisible();
            return conceptObjects.storeTime.getText();
        }
    },

    isConceptPageVisible: {
        value() {
            return conceptObjects.selectAConceptHeader.waitForVisible();
        }
    },

    getBackGroundColorConceptPage: {
        value() {
	        return getColor(conceptObjects.appBackGround, 'background-color');
        }
    },

    isStoreTimingVisibleConceptPage: {
        value() {
            return conceptObjects.storeTime.isVisible();
        }
    },

	getConceptHeaderColor: {
		value() {
			conceptObjects.selectAConceptHeader.waitForVisible();
			return getColor(conceptObjects.selectAConceptHeader, 'color');
		}
	},

	getConceptNameColorOnHover: {
        value() {
	        let allConcepts = conceptObjects.getAllConcepts;
	        conceptObjects.getConcept(allConcepts[0]).moveToObject();
	        browser.pause(100);
	        return getColor(conceptObjects.getConcept(allConcepts[0]), 'color');
        }
    }

});

function getColor(element, property)  {
	let colorObj = (element).getCssProperty(property);
	return colorObj.parsed.hex;
}

module.exports = function () {
    return new HelperPageObject();
};