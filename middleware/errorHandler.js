const errorHandler = (error, req, res, next) => {
    const statusCode = error.statusCode || 500;
    if (Array.isArray(error.errors)) {
        return res.status(400).json({
            status: 'error',
            message: 'Validation failed',
            errors: error,
        });
    }

    res.status(statusCode).json({
        status: 'error',
        message: error.message || 'Internal Server Error',
    });
};

module.exports = errorHandler;
