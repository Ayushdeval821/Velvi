/**
 * asyncHandler wraps async route handlers so thrown errors
 * reach Express's global error handler automatically.
 */
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

export default asyncHandler;
