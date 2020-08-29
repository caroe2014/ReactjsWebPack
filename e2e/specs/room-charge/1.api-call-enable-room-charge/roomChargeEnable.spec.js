// (C) 2020 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

"use strict";

const displayProfileAPI = require("../../../backOfficeApiCalls/displayProfileApiBasedOnID")();

//Prereq for running room charge tests
describe(" backoffice api calls to enable room charge", function () {
    it("should enable scheduled ordering", async function () {
       await displayProfileAPI.toggleRoomCharge(true);
    });
});