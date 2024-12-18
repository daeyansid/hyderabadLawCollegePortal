const sendSuccessResponse = (res, statusCode, message, data = null) => {
    res.status(statusCode).json({
        success: true,
        message,
        data
    });
};

module.exports = sendSuccessResponse;
