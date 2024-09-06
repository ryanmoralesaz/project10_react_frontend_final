const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);
    if (err.message === '500') {
        return res.status(500).json({
            success: false,
            errors: ['Internal Server Error']
        });
    }
    if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({
            success: false,
            errors: err.errors.map(e => e.message)
        });
    }

    if (err.status === 404) {
        return res.status(404).json({
            success: false,
            errors: [err.message || 'Resource not found']
        });
    }

    if (err.status === 403) {
        return res.status(403).json({
            success: false,
            errors: [err.message || 'Access denied']
        });
    }

    // Generic 500 error
    const statusCode = err.status || 500;
    res.status(statusCode).json({
        success: false,
        errors: [err.message || 'An unexpected error occurred on the server']
    });
};

module.exports = errorHandler;
