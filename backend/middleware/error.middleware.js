const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode ? res.statusCode : 500

    res.status(statusCode)

    res.json({
        success: false,
        error: {
            message: err.message,
            details: err,
            stack: process.env.NODE_ENV === 'production' ? null : err.stack
        }
    })
}

export default errorHandler