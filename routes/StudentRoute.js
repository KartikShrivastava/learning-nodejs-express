// backend framework which uses nodejs
import express from 'express'
// provides utilities to add functionality such as searching on json object using props
import _ from 'lodash'
// a wanky way to get json object from a file
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const students = require('../data/students.json')

const studentRouter = express.Router()

studentRouter.get('/', (req, res) => {
    res.json(students)
})

studentRouter.get('/:id', (req, res) => {
    const id = req.params.id
    const student = _.find(students, (student) => student.id == id)
    if(student) {
        res.json(student)
    } else {
        res.json(`User not found with id ${id}.`)
    }
})

studentRouter.post('/', (req, res) => {
    console.log("Handling POST http request")
    res.end()
})

studentRouter.put('/', (req, res) => {
    console.log("Handling PUT http request")
    res.end()
})

studentRouter.delete('/', (req, res) => {
    console.log("Handling DELETE http request")
    res.end()
})

studentRouter.param('id', (req, res, next, id) => {
    if(isNaN(id)) {
        next(`${id} is not a valid number.`)
    }
    else {
        next()
    }
})

// module.exports = studentRouter
export {studentRouter}