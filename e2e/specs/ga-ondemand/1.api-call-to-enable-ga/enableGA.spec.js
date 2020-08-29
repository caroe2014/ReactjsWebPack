// (C) 2020 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

"use strict";

const displayProfileAPI = require("../../../backOfficeApiCalls/displayProfileApiBasedOnID")();

//Prereq for running GA tests
describe(" backoffice api calls to enable GA", function () {
    it("should enable GA ", async function () {
        // disabling other payment types and enabling CC as well since its a standard payment type used across
        await displayProfileAPI.toggleRoomCharge(false);
        await displayProfileAPI.toggleCC(true);
        await displayProfileAPI.toggleStripe(false);
        await displayProfileAPI.toggleLoyalty(false);
        await displayProfileAPI.toggleMemberCharge(false);
        await displayProfileAPI.toggleGA(true);
    });

    it("should set GA method display name ", async function () {
        await displayProfileAPI.setGaMethodName('Employee Account');
    });
});