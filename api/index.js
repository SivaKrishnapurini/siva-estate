const express = require('express')
const mongodb = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()
const Router = require('./routes/auth.routes.js')
const cookieParser = require('cookie-parser');
const Listing = require('./routes/listing.route.js')
const path = require('path')

mongodb.connect(process.env.MONGO_DB_URL)
    .then(() => {
        console.log('successfully mongodb connected')
    })
    .catch((error) => {
        console.log(error.message)
    })

// const __dirname = path.resolve()

const app = express()
app.use(express.json())
app.use(cookieParser())

app.listen(4000, () => {
    console.log('successfully server running')
})


app.use('/auth/user', Router)
app.use('/listing/datas', Listing)

app.use(express.static(path.join(__dirname, '../client/dist')))
// app.use(express.static(path.join(__dirname, '/client/dist')))

app.get('*', (req, res) => {
    // res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'))
    // res.sendFile(path.join(__dirname, '../client', 'dist', 'index.html'))
    res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
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