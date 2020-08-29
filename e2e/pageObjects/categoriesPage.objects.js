const Page = require('./page');

class Category extends Page {


    get conceptTitle() {
        return $('.context-title');
    }

    get selectACategoryHeader() {
        return $('.select-category-header');
    }

    get backToConceptsButton() {
        return $('.back-link-container');
    }

    get getAllCategories() {
        return $$('.category-list-container .tile');
    }

    getCategory(categoryNumber) {
        return categoryNumber.$('.title-hover');
    }
};

module.exports = new Category();