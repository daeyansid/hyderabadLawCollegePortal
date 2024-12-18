exports.sendSuccessResponse = (res, statusCode, message, data = {}) => {
    return res.status(statusCode).json({
      success: true,
      message,
      data
    });
  };
  
  exports.sendErrorResponse = (res, statusCode, message, error = {}) => {
    return res.status(statusCode).json({
      success: false,
      message,
      error
    });
  };
  