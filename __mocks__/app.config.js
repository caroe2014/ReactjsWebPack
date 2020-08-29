import config from '../app.config';

export const _mockConfigHooks = {
  logger: {
    error: jest.fn(),
    info: jest.fn(),
    debug: jest.fn(),
    fatal: jest.fn()
  }
}

config.logger = {
  child: () => _mockConfigHooks.logger
}


export default config;

