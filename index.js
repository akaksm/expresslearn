// npm init -y for setup
// install express: npm i express
// install dotenv: npm i dotenv
// install nodemon: npm i nodemon
// install mongoose: npm i mongoose


const express = require('express')
require('dotenv').config()
const bodyParser = require('body-parser') // to install: npm i body-parser


require('./database/connection')
const userRoute = require('./routes/userRoute')
const blogRoute = require('./routes/blogRoute')
const commentRoute = require('./routes/commentRoute')
const categoryRoute = require('./routes/categoryRoute')
const { notfound, errorMiddleware } = require('./middleware/errorMiddleware')








const app = express()
const port = process.env.PORT || 6000

// middleware
app.use(bodyParser.json())


// routes
app.use('/api',userRoute)
app.use('/api',blogRoute)
app.use('/api',commentRoute)
app.use('/api',categoryRoute)

// error middleware
app.use(notfound)
app.use(errorMiddleware)

// listen to the port
app.listen(port, ()=>{
    console.log(`Server started on port ${port}`)
})
