// (C) 2020 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

"use strict";

const displayProfileAPI = require("../../../backOfficeApiCalls/displayProfileApiBasedOnID")();

describe(" backoffice api calls to enable GA", function () {
    it("should disable GA ", async function () {
        await displayProfileAPI.toggleGA(false);
    });
});