// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import Api from './api';
import MockAgilysys from '../../test/agilysys.mock';
import Agilysys from '../../agilysys.lib/agilysys.lib';
import envConfig from 'env.config';
import moment from 'moment-timezone';
import Boom from 'boom';
import { _mockConfigHooks } from 'app.config';

/* eslint-disable max-len */

let logger = _mockConfigHooks.logger;
jest.mock('../../agilysys.lib/agilysys.lib');
const mockAgilysys = new MockAgilysys();
Agilysys.mockImplementation(() => mockAgilysys);
const tenantId = '23';
const credentials = { data: 'sample credentials', tenantId: tenantId, tenantConfig: { storeList: [{displayProfileId: '123', businessContextId: '1234'}] } };
const contextId = 'mock-context-id';
const timeZone = 'America/Los_Angeles';
const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const profileId = 'mock-profile-id';

describe('sites api', () => {

  envConfig.tenants = { '23': { tenantId: tenantId } };
  envConfig.tenants[tenantId].stores = { 'mock-context-id': { 'timezone': timeZone } };

  describe('get sites', () => {
    let mockSchedule = {
      'tenantId': tenantId,
      'contextId': contextId,
      tasks: [
        {
          scheduledExpression: '0 1 0 * *',
          properties: {}
        },
        {
          scheduledExpression: '0 0 5 * *',
          properties: {}
        },
        {
          scheduledExpression: '0 0 10 * *',
          properties: {}
        },
        {
          scheduledExpression: '0 0 22 * *',
          properties: {}
        },
        {
          scheduledExpression: '0 58 23 * *',
          properties: {
            TRANSITION_MESSAGE: 'hello'
          }
        }
      ]
    };
    let schedule = JSON.parse(JSON.stringify(mockSchedule));

    it('get sites success action', async () => {
      mockAgilysys.sites = [{ businessContextId: contextId, tenantId: tenantId, displayProfile: { featureConfigurations: {}, displayProfileOptions: { 'WELCOME/BodyImage': '23', welcomeBackgroundImage: 'test.jpg', logoFileName: 'testlogo.jpg', conceptLogo: 'concept.jpg' } }, storeInfo: {address1: '7 street', address2: 'test', city: 'chennai', state: 'TN', zipCode: '600001', storeName: 'SB', timezone: timeZone, logoDetails: {RECEIPT_HEADER: {fileName: '23'}}}, address1: '7 street', address2: 'test', city: 'chennai', state: 'TN', zipCode: '600001', schedule, storeName: 'SB', timezone: timeZone, logoDetails: {RECEIPT_HEADER: {fileName: '23'}} }];
      mockAgilysys.getTenantConfig = jest.fn().mockReturnValueOnce(mockAgilysys.sites[0]);
      let data = await Api.getSites(credentials);
      expect(data).toEqual(mockAgilysys.siteResponse);
    });

    it('get sites success action with stripe config and delete secret key', async () => {
      mockAgilysys.sites = [{ businessContextId: contextId, tenantId: tenantId, displayProfile: { featureConfigurations: {sitePayments: {paymentConfigs: [{type: 'stripe', config: {secretKey: 'Test'}}]}}, displayProfileOptions: { 'WELCOME/BodyImage': '23', welcomeBackgroundImage: 'test.jpg', logoFileName: 'testlogo.jpg', conceptLogo: 'concept.jpg' } }, storeInfo: {address1: '7 street', address2: 'test', city: 'chennai', state: 'TN', zipCode: '600001', storeName: 'SB', timezone: timeZone, logoDetails: {RECEIPT_HEADER: {fileName: '23'}}}, address1: '7 street', address2: 'test', city: 'chennai', state: 'TN', zipCode: '600001', schedule, storeName: 'SB', timezone: timeZone, logoDetails: {RECEIPT_HEADER: {fileName: '23'}} }];
      mockAgilysys.getTenantConfig = jest.fn().mockReturnValueOnce(mockAgilysys.sites[0]);
      let data = await Api.getSites(credentials);
      const stripeConfig = mockAgilysys.sites[0].displayProfile.featureConfigurations.sitePayments.paymentConfigs[0];
      delete stripeConfig.secretKey;
      mockAgilysys.siteResponse[0].pay.stripeConfig = stripeConfig;
      expect(data).toEqual(mockAgilysys.siteResponse);
    });

    it('get sites catch error if site api return undefined', async () => {
      mockAgilysys.sites = undefined;
      mockAgilysys.getTenantConfig = jest.fn().mockReturnValueOnce([{}]);
      let data = await Api.getSites(credentials);
      expect(data).toMatchObject(new Boom('get sites failed'));
    });
  });

  describe('get concepts', () => {
    let curDate = moment(Date());
    let curday = days[curDate.tz(timeZone).day()];
    let mockSchedule = {
      'tenantId': tenantId,
      'contextId': contextId,
      tasks: [
        {
          scheduledExpression: '0 1 0 * * ' + curday,
          properties: {},
          displayProfileState: {
            conceptStates: [{ conceptId: '12' }]
          }
        },
        {
          scheduledExpression: '0 0 5 * * ' + curday,
          properties: {},
          displayProfileState: {
            conceptStates: [{ conceptId: '12' }]
          }
        },
        {
          scheduledExpression: '0 0 10 * * ' + curday,
          properties: {},
          displayProfileState: {
            conceptStates: [{ conceptId: '12' }]
          }
        },
        {
          scheduledExpression: '0 0 22 * * ' + curday,
          properties: {},
          displayProfileState: {
            conceptStates: [{ conceptId: '12' }]
          }
        },
        {
          scheduledExpression: '0 58 23 * * ' + curday,
          properties: {
            TRANSITION_MESSAGE: 'hello'
          },
          displayProfileState: {
            conceptStates: [{ conceptId: '12' }]
          }
        }
      ]
    };
    let schedule = JSON.parse(JSON.stringify(mockSchedule));

    it('get concepts success action', async () => {
      mockAgilysys.schedule = schedule;
      mockAgilysys.profile = {schedule: mockSchedule, displayProfile: {concepts: [{ id: '12', tenantId: '23', name: 'test', description: 'test description', conceptOptions: { onDemandConceptLogo: 'concept.jpg' } }]}};
      let result = [{ 'availableNow': true, 'conceptOptions': {'onDemandConceptLogo': 'concept.jpg'}, 'description': 'test description', 'id': '12', 'menus': undefined, 'image': 'application/api/image/23/mock-context-id/concept.jpg', 'name': 'test', schedule: schedule.tasks }];
      let data = await Api.getConcepts(credentials, contextId, profileId, {});
      delete data[0].availableAt;
      expect(data).toEqual(result);
    });

    it('get concepts success action with ondemand concept name', async () => {
      mockAgilysys.schedule = schedule;
      mockAgilysys.profile = {schedule: mockSchedule, displayProfile: {concepts: [{ id: '12', tenantId: '23', name: 'test', description: 'test description', conceptOptions: { onDemandConceptLogo: 'concept.jpg', onDemandDisplayText: 'test concept' } }]}};
      let result = [{ 'availableNow': true, 'conceptOptions': {'onDemandConceptLogo': 'concept.jpg', onDemandDisplayText: 'test concept'}, 'description': 'test description', 'id': '12', 'menus': undefined, 'image': 'application/api/image/23/mock-context-id/concept.jpg', 'name': 'test concept', schedule: schedule.tasks }];
      let data = await Api.getConcepts(credentials, contextId, profileId, {});
      delete data[0].availableAt;
      expect(data).toEqual(result);
    });

    it('api should return empty array response when task is not available for today', async () => {
      mockSchedule.tasks = [];
      schedule = JSON.parse(JSON.stringify(mockSchedule));
      mockAgilysys.schedule = schedule;
      let data = await Api.getConcepts(credentials, contextId, profileId, {});
      expect(data).toEqual(Boom.resourceGone(`Concepts is unavailable. Check Back Later.`));
    });

    it('catch error if somthing went wrong in the concept api', async () => {
      let data = await Api.getConcepts(credentials, contextId, undefined);
      expect(data).toEqual(new Boom('get concept failed'));
    });

  });

  describe('get Menus', () => {
    let curDate = moment(Date());
    let curday = days[curDate.tz(timeZone).day()];
    let mockSchedule = {
      'tenantId': tenantId,
      'contextId': contextId,
      tasks: [
        {
          scheduledExpression: '0 1 0 * * ' + curday,
          properties: {},
          displayProfileState: {
            conceptStates: [{ conceptId: '12', menuId: '234' }]
          }
        },
        {
          scheduledExpression: '0 0 5 * * ' + curday,
          properties: {},
          displayProfileState: {
            conceptStates: [{ conceptId: '12', menuId: '234' }]
          }
        },
        {
          scheduledExpression: '0 0 10 * * ' + curday,
          properties: {},
          displayProfileState: {
            conceptStates: [{ conceptId: '12', menuId: '234' }]
          }
        },
        {
          scheduledExpression: '0 0 22 * * ' + curday,
          properties: {},
          displayProfileState: {
            conceptStates: [{ conceptId: '12', menuId: '234' }]
          }
        },
        {
          scheduledExpression: '0 58 23 * * ' + curday,
          properties: {
            TRANSITION_MESSAGE: 'hello'
          },
          displayProfileState: {
            conceptStates: [{ conceptId: '12', menuId: '234' }]
          }
        }
      ]
    };
    let schedule = JSON.parse(JSON.stringify(mockSchedule));

    it('get menus success action with single category', async () => {
      mockAgilysys.schedule = schedule;
      mockAgilysys.menus = [{ id: '234', items: { id: '234' } }];
      let data = await Api.getMenus(credentials, contextId, '12', {schedule: mockAgilysys.schedule.tasks, menus: mockAgilysys.menus});
      expect(data).toEqual(mockAgilysys.menuResponseSingleCategory);
    });

    it('get menus success action with multiple category', async () => {
      mockAgilysys.schedule = schedule;
      mockAgilysys.menus = [{
        id: '234',
        categories: [{ items: { id: '234' }, kioskImages: [{ fileNames: ['test-image-xl.jpg', 'test-image-md.jpg'] }] }, { items: { id: '235' }, kioskImages: [{ fileNames: ['test-image-xl.jpg', 'test-image-md.jpg'] }] }]
      }];
      let data = await Api.getMenus(credentials, contextId, '12', {schedule: mockAgilysys.schedule.tasks, menus: mockAgilysys.menus});
      expect(data).toEqual(mockAgilysys.menuResponseMultipleCategory);
    });

    it('get menus success action with single category and modifiers', async () => {
      mockAgilysys.schedule = schedule;
      mockAgilysys.menus = [{ id: '234',
        items: { id: '234',
          childGroups: [{
            isAvailableToGuests: true,
            id: 1,
            displayName: 'choice1',
            maximum: 1
          },
          {
            isAvailableToGuests: true,
            id: 1,
            displayName: 'choice2',
            maximum: 2,
            childItems: [
              {
                id: 3,
                displayText: 'sub-choice1',
                isAvailableToGuests: true,
                price: {amount: 10},
                childGroups: [
                  {
                    id: 3,
                    displayText: 'sub-choice1',
                    price: {amount: 10}
                  }
                ]
              }
            ]
          },
          {
            isAvailableToGuests: false
          }
          ] } }];
      let data = await Api.getMenus(credentials, contextId, '12', {schedule: mockAgilysys.schedule.tasks, menus: mockAgilysys.menus});
      expect(data).toEqual(mockAgilysys.menuResponseWithModifier);
    });

    it('assume today task is not available and check menu is unavailable', async () => {
      jest.spyOn(Boom, 'resourceGone');
      mockSchedule.tasks = [];
      schedule = JSON.parse(JSON.stringify(mockSchedule));
      mockAgilysys.schedule = schedule;
      await Api.getMenus(credentials, contextId, '12', {schedule: mockAgilysys.schedule.tasks, menus: mockAgilysys.menus});
      expect(Boom.resourceGone).toBeCalled();
    });

    it('catch error if somthing went wrong in the menus api', async () => {
      let data = await Api.getMenus(credentials, contextId, undefined);
      expect(logger.fatal).toBeCalled();
      expect(data).toEqual(new Boom("Cannot read property 'schedule' of undefined"));
    });

  });

  describe('get item details', () => {
    it('get item details success action', async () => {
      mockAgilysys.menus = [{
        id: '234',
        items: {
          id: '234'
        }
      }];
      const mockPayload = {
        storePriceLevel: undefined
      };
      let result = { 'amount': '100.00', 'attributes': [], 'description': undefined, 'id': '234', 'image': 'application/api/image/23/mock-context-id/test-image-xl.jpg', 'itemImages': [{ 'fileNames': ['test-image-xl.jpg', 'test-image-md.jpg'] }], 'menuId': '234', 'modifiers': undefined, 'options': [], 'price': { 'amount': '100.00' }, 'thumbnail': 'application/api/image/23/mock-context-id/test-image-md.jpg' };
      let data = await Api.getItemDetails(credentials, contextId, '12', mockPayload);
      expect(data).toEqual(result);
    });

    it('catch error if somthing went wrong in the item details api', async () => {
      mockAgilysys.menus = undefined;
      let data = await Api.getItemDetails(credentials, contextId, '12');
      expect(logger.fatal).toBeCalled();
      expect(data).toEqual(new Boom('get item details failed'));
    });

  });

  describe('get Category Items', () => {
    it('get Category items success action', async () => {
      let data = await Api.getCategoryItems(credentials, contextId, {conceptId: '123', itemIds: ['2', '3']});
      expect(data).toEqual(mockAgilysys.categoryItemsResponse);
    });

    it('catch error if somthing went wrong in the item details api', async () => {
      let data = await Api.getCategoryItems(credentials, contextId, {conceptId: '123', itemIds: []});
      expect(logger.fatal).toBeCalled();
      expect(data).toEqual(new Boom("Cannot read property 'map' of undefined"));
    });

  });

});
