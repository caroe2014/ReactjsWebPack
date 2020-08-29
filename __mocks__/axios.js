
const mockAxios = jest.fn(() => Promise.resolve({data: {}}));
mockAxios.create = () => mockAxios;
mockAxios.get = jest.fn(() => Promise.resolve({data: {}}));
mockAxios.post = jest.fn(() => Promise.resolve({data: {}}));
mockAxios.put = jest.fn(() => Promise.resolve({data: {}}));
mockAxios.delete = jest.fn(() => Promise.resolve({data: {}}));
mockAxios.interceptors = {
  response: {
    use: jest.fn()
  },
  request: {
    use: jest.fn()
  }
};

export default mockAxios;
