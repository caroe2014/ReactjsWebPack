'use strict';

let categoryPageObject = require('../pageObjects/categoriesPage.objects');


function HelperPageObject() {
}

HelperPageObject.prototype = Object.create(Object.prototype, {

    fetchConceptNameFromCategoriesPage: {
        value() {
            categoryPageObject.conceptTitle.waitForVisible();
            return categoryPageObject.conceptTitle.getText();
        }
    },

    selectACategory: {
        value(category = 0) {
            categoryPageObject.selectACategoryHeader.waitForVisible();
            let allCategories = categoryPageObject.getAllCategories;
            let categoryName = categoryPageObject.getCategory(allCategories[category]).getText();
            categoryPageObject.getCategory(allCategories[category]).click();
            return categoryName;
        }
    },

    categoryPageVisible: {
        value() {
            categoryPageObject.selectACategoryHeader.waitForVisible();
            return true;
        }
    },

    getBackToConceptPage: {
        value() {
            categoryPageObject.backToConceptsButton.waitForVisible();
            categoryPageObject.backToConceptsButton.click();
        }
    },

	getCategoryHeaderColor: {
		value() {
			categoryPageObject.selectACategoryHeader.waitForVisible();
			return getColor(categoryPageObject.selectACategoryHeader, 'color');
		}
	},

	getCategoryNameColorOnHover: {
		value() {
			let allCategories = categoryPageObject.getAllCategories;
			categoryPageObject.getCategory(allCategories[0]).moveToObject();
			browser.pause(100);
			return getColor(categoryPageObject.getCategory(allCategories[0]), 'color');
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