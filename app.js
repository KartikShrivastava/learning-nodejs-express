import express from 'express'
// this package(middleware) helps in logging http requests made by server
import morgan from 'morgan'
// var StudentRoute = require('./routes/StudentRoute')
import {studentRouter} from './routes/StudentRoute.js'
// another middleware useful in parsing body of the client http request
import bodyParser from 'body-parser'
import path from 'path'
// a wanky way to get json object from a file
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const students = require('./data/students.json')
// imports used to setup server securely over https connection
import https from 'https'
import fs from 'fs'

// tls https connection options setup
const tlsOptions = {
    key: fs.readFileSync(path.join('key.pem')),
    cert: fs.readFileSync(path.join('cert.pem')),
    passphrase: 'kash'
}

const buildUrl = (version, path) => `/api/${version}/${path}`
const STUDENTS_BASE_URL = buildUrl('v1', 'students')

const PORT = 3000
const TLSPORT = 3003
const server = express()

server.use(morgan('tiny'))
server.use(bodyParser.json())
// express.static let's us serve static content to client(in our case images)
server.use(express.static('public'))
// ejs template engine setup
server.set('views', path.join('views'))
server.set('view engine', 'ejs')

server.use(STUDENTS_BASE_URL, studentRouter)
server.get('/', (req, res) => {
    res.render('index', {
        students: students
    })
})

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

// start https server in different port
https.createServer(tlsOptions, server).listen(TLSPORT, () => {
    console.log(`https server started on port ${TLSPORT}`)
})
