// middleware/handlePostgresErrors.js
const ERRORS = {
  INVALID_TYPE: "22P02",
  UNIQUE_VIOLATION: "23505",
  FOREIGN_KEY_VIOLATION: "23503",
};

// Uses PostgreSQL error codes to send cleaner error messages to clients
export default function handlePostgresErrors(err, req, res, next) {
  switch (err.code) {
    case ERRORS.INVALID_TYPE:
      return res.status(400).json({ error: err.message });
    case ERRORS.UNIQUE_VIOLATION:
    case ERRORS.FOREIGN_KEY_VIOLATION:
      return res.status(400).json({ error: err.detail });
    default:
      // Let any unknown error bubble up
      return next(err);
  }
}
