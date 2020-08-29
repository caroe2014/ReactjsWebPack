// (C) 2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

"use strict";

const displayProfileAPI = require("../../../backOfficeApiCalls/displayProfileApiBasedOnID")();

//Prereq for running scheduled ordering tests
describe(" backoffice api calls to enable scheduled ordering", function () {
    it("should enable scheduled ordering", async function () {
       await displayProfileAPI.toggleScheduledOrdering(true);
    });
});