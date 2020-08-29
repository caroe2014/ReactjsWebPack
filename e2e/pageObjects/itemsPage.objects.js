const Page = require('./page');

class Items extends Page {


    get categoryTitle() {
        return $('.context-title');
    }

    get selectAItemHeader() {
        return $('.select-item-header');
    }

    get selectFirstItem() {
        return $('.tile');
    }

    get selectAllItems() {
        return $$('.item-listcontainer .tile');
    }

    getItem(itemNumber) {
       return itemNumber.$('.add-to-cart-text');
    }

    get scrollRight() {
        return $('.scroll-arrow-right');
    }

    customTab(tabNumber) {
        let element = '.tab_'+tabNumber;
        return $(element);
    }

    get optionModifier() {
        return $('.option_desc');
    }

    addToCart(itemNumber) {
        return itemNumber.$('.add-to-cart-text');
    }

    get addToCartOnItemWithModifier() {
        return $('.add-to-cart-button');
    }
    
    get backToCategories() {
        return $('.back-link-container');
    }

    get modifiers() {
        return $('.modifier-tabs-list');
    }

    getModifierTabs() {
        return $$('.modifier-tabs-list .tab');
    }

    get resetToDefault() {
        return $('.reset-button');
    }

    get modalPopup() {
        return $('.modal-container');  //need stable identifier
    }

    get proceedButtonModalPopup() {
        return $('.modal-continue-button');  //need stable identifier
    }
};

module.exports = new Items();