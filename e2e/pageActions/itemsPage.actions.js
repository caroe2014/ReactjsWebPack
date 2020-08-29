'use strict';

let itemsObjects = require('../pageObjects/itemsPage.objects');
let cartObjects = require('../pageObjects/cart.objects');


function HelperPageObject() {
}

HelperPageObject.prototype = Object.create(Object.prototype, {

    fetchCategoryNameFromItemPage: {
        value() {
            itemsObjects.selectAItemHeader.waitForVisible();
            itemsObjects.categoryTitle.waitForVisible();
            return itemsObjects.categoryTitle.getText();
        }
    },

    selectAItem: {
        value(itm = 0) {
            itemsObjects.selectAItemHeader.waitForVisible();
            let Items = itemsObjects.selectAllItems;
            let itemDetails =Items[itm].getText();
            itemsObjects.addToCart(Items[itm]).click();
            return itemDetails;
        }
    },

    getItemDisplayNameText : {
        value(item){
            let Items = itemsObjects.selectAllItems;
            return itemsObjects.getItem(Items[item]).getText();
        }
    },

    itemsPageVisible: {
        value() {
            itemsObjects.selectAItemHeader.waitForVisible();
            return true;
        }
    },

    verifyTotalItemsCount: {
        value() {
            cartObjects.totalItemsCount.waitForVisible();
            return cartObjects.totalItemsCount.getText();
        }
    },

    openCart: {
        value() {
            cartObjects.myCart.click();
            cartObjects.cartSummary.waitForVisible();
        }
    },

    clickPayNow: {
        value() {
            cartObjects.payNowButton.waitForVisible();
            cartObjects.payNowButton.waitForEnabled();
            cartObjects.payNowButton.click();
        }
    },

    clickUndo: {
        value() {
            cartObjects.undoButton.waitForVisible();
            cartObjects.undoButton.waitForEnabled();
            cartObjects.undoButton.click();
        }
    },

    customizeItem: {
        value() {

            itemsObjects.modifiers.waitForVisible();
            let tabs = itemsObjects.getModifierTabs();
            console.log("length tabs "+tabs.length);

            for(let i=1;i<10;i++){
                if(itemsObjects.customTab(i).isVisible())
                {
                    itemsObjects.customTab(i).click();
                    itemsObjects.optionModifier.click();
                    if(i==4) {
                        itemsObjects.scrollRight.click();
                    }
                }
            }

            itemsObjects.addToCartOnItemWithModifier.scroll();
        }
    },

    getBackToCategoryPage: {
        value() {
            itemsObjects.backToCategories.waitForVisible();
            itemsObjects.backToCategories.click();
        }
    },

    clearCart: {
        value() {
            cartObjects.clearButton.waitForVisible();
            cartObjects.clearButton.click();
        }
    },

    cartItemsLength: {
        value() {
            return cartObjects.cartItems.getText();
        }
    },

    cartSummaryText: {
        value() {
            cartObjects.cartEmptyText.waitForVisible();
            return cartObjects.cartEmptyText.getText();
        }
    },

    cartPopUpVisible: {
        value()
        {
            cartObjects.viewCartButton.waitForVisible();
            return true;
        }
    },

    openCartViaCartPopUp: {
        value()
        {
            cartObjects.viewCartButton.waitForVisible();
            cartObjects.viewCartButton.click();
        }
    },

    deleteItemFromCart: {
        value() {
            cartObjects.deleteCartItem.waitForVisible();
            cartObjects.deleteCartItem.click();
        }
    },

    isCartOpen: {
        value() {
            cartObjects.cartSummary.waitForVisible();
            return true;
        }
    },

    isCartBadgeVisible: {
        value() {
            return cartObjects.totalItemsCount.isExisting();
        }
    },

    closeCart: {
        value() {
            cartObjects.cartClose.waitForVisible();
            cartObjects.cartClose.click();
        }
    },

    clickResetToDefault: {
        value() {
            itemsObjects.resetToDefault.waitForVisible();
            itemsObjects.resetToDefault.click();
            browser.pause(1000);    //needed to reduce flakiness as modifiers are not instantly reset or automation too fast.
        }
    },

    clickAddToCartModifiersPage: {
        value() {
            itemsObjects.addToCartOnItemWithModifier.click();
            browser.pause(2000);    //needed to reduce flakiness
        }
    },

    isItemAdded: {
        value() {
            return cartObjects.totalItemsCount.isExisting();
        }
    },

    getPayButtonText: {
        value() {
            cartObjects.payNowButton.waitForVisible();
            cartObjects.payNowButton.waitForEnabled();
            return cartObjects.payNowButton.getText();
        }
    },

    isModalPopupVisible: {
        value() {
            return itemsObjects.modalPopup.waitForVisible();
        }
    },

    clickProceedInModalPopup: {
        value() {
            itemsObjects.proceedButtonModalPopup.waitForVisible();
            itemsObjects.proceedButtonModalPopup.click();
        }
    },

    isItemsClickable: {
        value() {
            return itemsObjects.backToCategories.isClickable();
        }
    },

    isCartClickable: {
        value() {
            return cartObjects.myCart.isClickable();
        }
    },

	getItemHeaderColor: {
		value() {
			itemsObjects.selectAItemHeader.waitForVisible();
			return getColor(itemsObjects.selectAItemHeader, 'color');
		}
	},

	getItemNameColorOnHover: {
		value() {
			let Items = itemsObjects.selectAllItems;
			itemsObjects.getItem(Items[0]).moveToObject();
			browser.pause(100);
			return getColor(itemsObjects.getItem(Items[0]), 'color');
		}
	},

	getAddToCartButtonBackgroundColor: {
        value() {
	        return getColor(itemsObjects.addToCartOnItemWithModifier, 'background');
        }
    },

	getAddToCartButtonTextColor: {
		value() {
			return getColor(itemsObjects.addToCartOnItemWithModifier, 'color');
		}
	},

	getStoreNameColorFromCart: {
        value() {
	        return getColor(cartObjects.storeNameInCart, 'color');
        }
    },

	getPayButtonBackgroundColorFromCart: {
        value() {
            return getColor(cartObjects.payNowButton, 'background-color');
        }
    },

	getPayButtonTextColorFromCart: {
		value() {
			return getColor(cartObjects.payNowButton, 'color');
		}
	},

	itemsModifierPageVisible: {
		value() {
			return itemsObjects.modifiers.waitForVisible();
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