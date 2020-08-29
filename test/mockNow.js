// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

export default class MockNow {
  constructor () {
    this.realNow = Date.now;
  }
  setTime (dateToMock) {
    Date.now = () => new Date(dateToMock);
  }
  reset () {
    Date.now = this.realNow;
  }
}
