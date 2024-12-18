const sendErrorResponse = (res, statusCode, message, error = null) => {
    res.status(statusCode).json({
        success: false,
        message,
        error
    });
};

module.exports = sendErrorResponse;
