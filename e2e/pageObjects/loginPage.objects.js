// (C) 2017 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

'use strict';

const Page = require('./page');

class LoginPage extends Page {

    get usernameField() {
        return $('.username');
    }

    get passwordField() {
        return $('.password');
    }

    get submitLoginButton() {
        return $('.submit');
    }

    get healthCheckSummary() {
        return $('.sc-kGXeez'); //need stable identifier
    }

    get manifestBtn() {
        return $('.jplJEP > ul:nth-child(1) > li:nth-child(2) > a:nth-child(1)'); //need stable identifier
    }

    get manifest() {
        return $('.sc-kGXeez'); //need stable identifier
    }
}

module.exports = new LoginPage();