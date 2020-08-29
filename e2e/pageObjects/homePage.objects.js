const Page = require('./page');

class Home extends Page {


    get myCart() {
        return $('.CartLink');
    }

    get selectFirstLocation() {
        return $('.tile');
    }

    get locationName() {
        return $('.title-hover');
    }

    get selectALocationHeader() {
        return $('div.site-list-container');
    }
    
    get addressOfStore() {
        return $('.address-text');
    }

    get storeTiming() {
        return $('.opens-text');
    }

    get storeStatusInImage() {
        return $('.closed-overlay');
    }

	get selectLocationText() {
		return $('.select-location-header');
	}

    get getAllLocations() {
        return $$('.site-list-container .tile');
    }

    getLocation(locationNumber) {
        return locationNumber.$('.title-hover');
    }

    selectPickUp(locationNumber) {
        return locationNumber.$('button.delivery-button');
    }

    get appBackGround() {
        return $('.sc-bxivhb > div:nth-child(1) > div:nth-child(1)'); //need stable identifier
    }

    get changeTimeButton() {
        return $('.back-link-container');
    }

};

module.exports = new Home();

