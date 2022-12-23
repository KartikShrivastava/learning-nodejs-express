import express from 'express'

// can't import json directly in nodejs 14+ while using type module in package.json, and they say nodejs is straightforward, bs buggy mess
// import students from './data/students.json'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const students = require('./data/students.json')

import _ from 'lodash'

const buildUrl = (version, path) => `/api/${version}/${path}`

const PORT = 3000
const server = express()
const STUDENTS_BASE_URL = buildUrl('v1', 'students')

server.get(STUDENTS_BASE_URL, (req, res) => {
    res.json(students)
})

server.get(`${STUDENTS_BASE_URL}/:id`, (req, res) => {
    const id = req.params.id
    const student = _.find(students, (student) => student.id == id)
    if(student) {
        res.json(student)
    } else {
        res.json(`User not found with id ${id}.`)
    }
})

server.post(STUDENTS_BASE_URL, (req, res) => {
    console.log("Handling POST http request")
    res.end()
})

server.put(STUDENTS_BASE_URL, (req, res) => {
    console.log("Handling PUT http request")
    res.end()
})

server.delete(STUDENTS_BASE_URL, (req, res) => {
    console.log("Handling DELETE http request")
    res.end()
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