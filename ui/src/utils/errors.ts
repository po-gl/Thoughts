class ResponseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ResponseError';
  }
}

class JSONParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'JSONParseError';
  }
}

export { ResponseError, JSONParseError };
