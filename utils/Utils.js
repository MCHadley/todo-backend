function responseHandler(statusCode, message) {
    const response = {
        statusCode: statusCode,
        body: JSON.stringify({
            message: message
        })
    }

    return response
}

module.exports = {
    responseHandler: responseHandler
}