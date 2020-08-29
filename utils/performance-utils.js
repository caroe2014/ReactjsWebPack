// const {
//   performance,
//   PerformanceObserver
// } = require('perf_hooks');

// import config from 'app.config';
// import path from 'path';
// import newrelic from 'newrelic';

// const logger = config.logger.child({ component: path.basename(__filename) });


export const markResponse = (requestUrl) => {
  // if (!requestUrl.includes('assets') && !requestUrl.includes('.png') && !requestUrl.includes('.jpg')) {
  //   performance.mark(requestUrl + "-end");
  //   performance.measure(requestUrl, requestUrl + "-init", requestUrl + "-end");

  // }
}

export const markRequest = (requestUrl) => {
  // performance.mark(requestUrl + "-init");
}

export const startObserver = () => {
  // const obs = new PerformanceObserver((list) => {
  //   list.getEntries().forEach(entry => {  
  //     recordNewRelicMetric(entry.name, entry.duration);
  //   });
  // });
  // obs.observe({ entryTypes: ['measure'], buffered: true});  //we want to react 
}


export const recordNewRelicMetric = (name, value) => {
  // logger.debug(`Performance Metric: ${name} - ${value}`);
  // newrelic.recordMetric(name, value);
}