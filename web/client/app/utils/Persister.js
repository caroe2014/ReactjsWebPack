// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

export default class Persistor {
  constructor (config = {}) {

    this.blockList = config.blockList || [];
    this.restoreList = config.restoreList || [];
    this.key = config.key || 'store';
    this.ttl = config.ttlSeconds * 1000 || 120000;

    this.localStorage = window.localStorage;

    this.isPaused = false;

    this.setState = this.setState.bind(this);
  }

  pause = () => {
    this.isPaused = true;
  }

  persist = () => {
    this.isPaused = false;
  }

  purge = (isRestore = false) => {
    if (isRestore && this.restoreList.length > 0) {
      const stateRestoreData = JSON.stringify({state: this.getStateRestoreData()});
      this.localStorage.setItem(this.key, stateRestoreData);
      return;
    }
    this.localStorage.removeItem(this.key);
  }

  getStateRestoreData () {
    const stateRestoreData = {};
    const localStateObj = this.localStorage.getItem(this.key);
    const state = localStateObj ? JSON.parse(localStateObj) : null;
    if (state !== null && state.state) {
      this.restoreList.map(key => {
        stateRestoreData[key] = state.state[key];
      });
    }
    return stateRestoreData;
  }

  setState = (state) => {

    if (!this.isPaused) {
      let filteredState = {};

      for (const key in state) {
        if (this.blockList.indexOf(key) === -1) {
          filteredState[key] = state[key];
        }
      }

      let localStateObj = {
        ttl: Date.now() + this.ttl,
        state: filteredState
      };

      this.localStorage.setItem(this.key, JSON.stringify(localStateObj));
    }
  }

  getInitialState = () => {
    let localStateObj = this.localStorage.getItem(this.key);
    let state = localStateObj ? JSON.parse(localStateObj) : null;

    if (state && Date.now() < state.ttl) {
      return state.state;
    }
    return this.restoreList.length > 0 ? this.getStateRestoreData() : {};
  }

  middleWare = ({ getState }) => (next) => async (action) => {
    const returnValue = next(action);
    this.setState(getState());
    return returnValue;
  };
}
