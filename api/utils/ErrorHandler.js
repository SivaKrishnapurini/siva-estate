const ErrorHandler = (statusCode, message) => {
    // console.log('getting new messages', statusCode, message)
    const error = new Error()
    error.message = message
    error.statusCode = statusCode
    return error
}

module.exports = ErrorHandler