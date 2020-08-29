// (C) 2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.


'use strict';

let loginAction = require('../pageActions/loginPage.actions')();

describe('BUY-35946 & BUY-35947 verify could get health check and manifest version for application', function() {

    it('verify could you get health check summary', function () {
        loginAction.OpenBrowser();
        loginAction.openApplicationIndexPage();
        expect(loginAction.getHealthCheckSummary()).toBe("[\n" +
            "  \"Service is up and reachable\"\n" +
            "]");
    });

    it('verify could you get manifest version', function () {
        loginAction.clickManifest();
        expect(loginAction.getManifest()).toContain("{\n" +
            "  \"version\": \"");
    });

});