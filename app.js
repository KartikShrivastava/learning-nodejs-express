import express from 'express'
// this package helps in logging http requests made by server
import morgan from 'morgan'
// var StudentRoute = require('./routes/StudentRoute')
import {studentRouter} from './routes/StudentRoute.js'

const buildUrl = (version, path) => `/api/${version}/${path}`
const STUDENTS_BASE_URL = buildUrl('v1', 'students')

const PORT = 3000
const server = express()

server.use(morgan('tiny'))

server.use(STUDENTS_BASE_URL, studentRouter)

// get route handler with multiple handlers
server.get('/route-handlers', (req, res, next) => {
    // beginning of route handler
    res.send('it will pass')
    next()
}, (req, res, next) => {
    console.log("second handler")
    next()
}, (req, res) => {
    console.log("third handler")
})

server.listen(PORT, () => {
    console.log(`server started on port ${PORT}`)
})