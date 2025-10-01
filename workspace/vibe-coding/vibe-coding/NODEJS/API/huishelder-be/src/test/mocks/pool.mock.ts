export class MockPool {
  public mockQuery = jest.fn();
  public mockConnect = jest.fn();

  public query = this.mockQuery;

  public connect() {
    return {
      query: this.mockQuery,
      release: jest.fn(),
      on: jest.fn(),
    };
  }

  public reset() {
    this.mockQuery.mockReset();
    this.mockConnect.mockReset();
  }
}
