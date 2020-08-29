const Page = require('./page');

class Category extends Page {
    get nameCapture() {
        return $('.name-capture-container');
    }

    get firstNameField() {
        return $('input.firstName');
    }

    get lastInitialField() {
        return $('input.lastInitial');
    }

    get continueButton() {
        return $('.nextBtn');
    }

    get spikButton() {
        return $('.skip-btn');
    }

    get nameCaptureInstruction() {
        return $('.instruction-text');
    }

	get homeButton() {
        return $('.home-button-link');
    }

    get pageTitle() {
        return $('.context-title');
    }
};

module.exports = new Category();