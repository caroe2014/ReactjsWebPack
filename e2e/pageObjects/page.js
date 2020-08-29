// (C) 2017 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.
'use strict';

class Page {
    open(path) {
        browser.url(path);
    }
}

module.exports = Page;
