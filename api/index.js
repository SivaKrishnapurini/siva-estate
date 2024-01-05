const express = require('express')
const mongodb = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()
const Router = require('./routes/auth.routes.js')
const cookieParser = require('cookie-parser');
const Listing = require('./routes/listing.route.js')

mongodb.connect(process.env.MONGO_DB_URL)
    .then(() => {
        console.log('successfully mongodb connected')
    })
    .catch((error) => {
        console.log(error.message)
    })

const app = express()
app.use(express.json())
app.use(cookieParser())

app.use('/auth/user', Router)
app.use('/listing/datas', Listing)

app.listen(4000, () => {
    console.log('successfully server running')
})

app.use((err, req, res, next) => {
    const message = err.message || "Internal Server Error"
    const statusCode = err.statusCode || 500

    res.status(statusCode).json({
        message,
        statusCode,
        success: false
    })
})