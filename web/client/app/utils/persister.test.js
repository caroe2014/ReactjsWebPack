// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import Persister from './Persister';

const dateBackUp = Date;

let persistor;
let timeToReturn = 1000000;

const mockLocalStorage = {
  setItem: jest.fn(),
  removeItem: jest.fn(),
  getItem: jest.fn(() => {
    return JSON.stringify({
      ttl: timeToReturn + 120000,
      state: mockState
    });

  })
};

let mockState = {
  error: {error: true},
  cart: {items: [{id: 1}]}
};

describe('Persister:', () => {
  beforeAll(() => {
    Date = {
      now: () => timeToReturn
    };
  });

  afterAll(() => {
    Date = dateBackUp;
  });

  describe('should init:', () => {

    it('without config', () => {
      persistor = new Persister();
      expect(persistor.blockList).toEqual([]);
      expect(persistor.key).toEqual('store');
      expect(persistor.ttl).toEqual(120000);
    });

    it('with config', () => {
      let config = {
        blockList: ['error'],
        key: 'redux-store',
        ttlSeconds: 1
      };

      persistor = new Persister(config);
      expect(persistor.blockList).toEqual(['error']);
      expect(persistor.key).toEqual('redux-store');
      expect(persistor.ttl).toEqual(1000);
    });

  });

  describe('should', () => {
    beforeEach(() => {
      persistor = new Persister();
      persistor.localStorage = mockLocalStorage;
    });

    it('pause', () => {
      persistor.pause();
      persistor.setState({state: 123});
      expect(persistor.isPaused).toBe(true);
      expect(mockLocalStorage.setItem).not.toHaveBeenCalled();
    });

    it('persist', () => {
      persistor.pause();
      persistor.persist();
      persistor.setState({state: 123});
      expect(persistor.isPaused).toBe(false);
      expect(mockLocalStorage.setItem).toHaveBeenCalled();
    });

    it('purge', () => {
      persistor.purge();
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('store');
    });

    it('setState', () => {
      persistor.setState(mockState);

      let expectedState = JSON.stringify({
        ttl: timeToReturn + 120000,
        state: mockState
      });

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('store', expectedState);
    });

    it('not setState when paused', () => {
      persistor.pause();
      persistor.setState(mockState);
      expect(mockLocalStorage.setItem).toBeCalled();
    });

    it('setState while respecting blockList', () => {
      let copyOfMockState = JSON.parse(JSON.stringify(mockState));
      persistor = new Persister({blockList: ['error']});
      persistor.localStorage = mockLocalStorage;

      persistor.setState(mockState);
      delete copyOfMockState.error;

      let expectedState = JSON.stringify({
        ttl: timeToReturn + 120000,
        state: copyOfMockState
      });

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('store', expectedState);
    });

    it('get intial state within TTL', () => {
      let state = persistor.getInitialState();
      persistor.middleWare('getState');
      expect(mockLocalStorage.getItem).toBeCalledWith('store');
      expect(state).toEqual(mockState);
    });

    it('return empty state after TTL', () => {
      mockLocalStorage.getItem = jest.fn(() => {
        return JSON.stringify({
          ttl: timeToReturn - 120000,
          state: mockState
        });
      });

      let state = persistor.getInitialState();
      expect(mockLocalStorage.getItem).toBeCalledWith('store');
      expect(state).toEqual({});
    });

  });
});
