
class mockBoom {
  constructor(name) {
    this.name = name;
  }

  badData() {
    return jest.fn();
  }

  static notFound() {
    return [];
  }

  static badRequest() {
    return {};
  }

  static badData() {
    return jest.fn();
  }

  static serverUnavailable() {
    return {};
  }

  static resourceGone(value) {
    return [];
  }
}

export default mockBoom;