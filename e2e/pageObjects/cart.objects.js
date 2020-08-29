const Page = require('./page');

class Cart extends Page {

    get myCart() {
        return $('.CartLink');
    }

    get cartSummary() {
        return $('.my-cart-header');
    }

    get cartClose() {
        return $('.cart-close-button');
    }

    get totalItemsCount() {
        return $('.cart-badge');
    }
    
    get totalPrice() {
        return $('.net-pay-text');
    }

    get payNowButton() {
        return $('.pay-cart-button');
    }

    get undoButton() {
        return $('.undo-button');
    }

    get allCartItems() {
        return $$('.cart-container .item-display-box');
    }

    getItemDisplayNameInCart(itemNumber) {
        return itemNumber.$('.item-display-name');
    }

    get clearButton() {
        return $('.clear-cart-button')
    }

    get cartItems() {
        return $('.cart-count-text');
    }

    get viewCartButton() {
        return $('.view-cart-button');
    }

    get cartEmptyText() {
        return $('.cart-container');
    }

    get deleteCartItem() {
        return $('#cart-delete-1');
    }

    get pickUpTime() {
        return $('.ready-time-container .ready-time');
    }

	get storeNameInCart() {
		return $('.store-name');
	}
};

module.exports = new Cart();