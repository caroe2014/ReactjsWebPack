// (C) 2020 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

"use strict";

const displayProfileAPI = require("../../../backOfficeApiCalls/displayProfileApiBasedOnID")();

//disable room charge once all tests are done
describe(" backoffice api calls to disable room charge", function () {
    it("should disable scheduled ordering", async function () {
        await displayProfileAPI.toggleRoomCharge(false);
    });
});