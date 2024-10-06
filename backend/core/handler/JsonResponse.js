const successResponse = (res, code = 200, message, data = {}) => {

    return Object.keys(data).length != 0 ? res.status(code).json({
        "message": message,
        "data": data
    }) : res.status(code).json({
        "message": message
    })
}

const errorResponse = (res, code = 500, message) => {
    res.status(code).json({
        "message": message
    })
}

const validationResponse = (res, code = 409, message, error) => {
    res.status(code).json({
        "message": message,
        "error": error
    })
}

module.exports = {
    successResponse, errorResponse, validationResponse
}