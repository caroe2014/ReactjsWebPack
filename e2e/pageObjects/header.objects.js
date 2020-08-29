const Page = require('./page');

class Header extends Page {

    get buyOnDemand() {
        return $('.Logo');
    }

    get headerComponent() {
        return $('.nav-menu-bar');
    }

    get footerComponent() {
        return $('.footer');
    }

    get headerTextColor() {
        return $('.CartLink');
    }

    get footerTextColor() {
        return $('.footer');
    }

    get appContainer() {
        return $('#appContainer');
    }

    get selectLocationHeader() {
        return $('.select-location-header');
    }

    get homeButton() {
        return $('.home-button-link');
    }

};

module.exports = new Header();