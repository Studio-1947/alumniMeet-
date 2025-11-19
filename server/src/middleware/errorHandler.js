/**
 * Centralized Express error handler to keep API responses consistent.
 */
const errorHandler = (err, req, res, next) => {
  console.error('API Error:', err);
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Server error';
  res.status(statusCode).json({ message });
};

module.exports = errorHandler;
