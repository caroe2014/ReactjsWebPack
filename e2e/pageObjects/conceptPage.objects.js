const Page = require('./page');

class Concept extends Page {


    get locationTitle() {
        return $('.context-title');
    }

    get selectAConceptHeader() {
        return $('.select-concept-header');
    }

    get changeLocationButoon() {
        return $('.back-link-container');
    }

    get storeTime() {
        return $('.open-time');
    }

    get getAllConcepts() {
        return $$('.concept-list-container .tile');
    }

    getConcept(conceptNumber) {
        return conceptNumber.$('.title-hover');
    }

    get appBackGround() {
        return $('.sc-bxivhb > div:nth-child(1) > div:nth-child(1)'); //need stable identifier
    }


};

module.exports = new Concept();