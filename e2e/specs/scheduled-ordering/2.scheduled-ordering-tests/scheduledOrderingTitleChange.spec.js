// (C) 2020 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

'use strict';

const prepareBy = require('../../../pageActions/loginPage.actions')();
const scheduledOrderingPage = require('../../../pageActions/scheduledOrderingPage.actions');
const configChange = require('../../../backOfficeApiCalls/backOfficeApi')();

const titleText = 'Schedule your order now!';

describe('BUY-40399 verify changing the title and see the new title on scheduled ordering page ', function () {
    it('land on browser and verify the text is not the same as expected title text', function() {
        prepareBy.OpenBrowser(true);
        expect(scheduledOrderingPage.isFindFoodButtonVisible()).toBe(true);
        expect(scheduledOrderingPage.getTitleText()).not.toBe(titleText);
    });

    it('change the title', async function() {
        await configChange.setScheduledOrderPageTitleTo(titleText);
        console.log('set the text successfully');
        browser.refresh();
    });

    it('verify the title matches expected text', function() {
        scheduledOrderingPage.verifyTitleText(titleText);
    });

    it('set it to a different text so that next time test case is run, we see a different text at the start', async function() {
        await configChange.setScheduledOrderPageTitleTo('Schedule your order for pick up');
        console.log('set the text to a different text successfully');
        browser.refresh();
    });

    it('verify the text is not the same as expected title text used for this test case', function() {
        expect(scheduledOrderingPage.getTitleText()).not.toBe(titleText);
    });
});