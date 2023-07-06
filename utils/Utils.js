/* eslint-disable require-jsdoc */
function responseHandler(statusCode, message) {
    const response = {
        statusCode: statusCode,
        body: JSON.stringify({
            message: message,
        }),
    };

    return response;
}

function genericErrorMessage(location, param) {
    const message = {
        statusCode: 400,
        body: JSON.stringify({
            location: location,
            param: param,
            message: `There is a problem with ${param} at ${location}`,
        }),
    };
    return message;
}

function requiredError(location, param) {
    const message = {
        statusCode: 400,
        body: JSON.stringify({
            location: location,
            param: param,
            message: `${param} is required`,
        }),
    };

    return message;
}

module.exports = {
    responseHandler,
    genericErrorMessage,
    requiredError,
};
