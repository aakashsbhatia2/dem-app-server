export class ApiError extends Error {
  constructor(definition, message = definition.message) {
    super(message);
    this.code = definition.code;
    this.status = definition.status;
  }
}

export function sendError(res, error) {
  return res.status(error.status).json({ error: error.message, code: error.code });
}
