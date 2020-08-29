// (C) 2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

"use strict";

const displayProfileAPI = require("../../../backOfficeApiCalls/displayProfileApiBasedOnID")();

//disable scheduled ordering once all tests are done
describe(" backoffice api calls to disable scheduled ordering", function () {
    it("should disable scheduled ordering", async function () {
        await displayProfileAPI.toggleScheduledOrdering(false);
    });
});