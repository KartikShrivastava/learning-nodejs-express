// backend framework which uses nodejs
import express from 'express'
// provides utilities to add functionality such as searching on json object using props
import _ from 'lodash'
// a wanky way to get json object from a file
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const students = require('../data/students.json')
import path from 'path'

const studentRouter = express.Router()

let studentsArray = students

studentRouter.get('/', (req, res) => {
    res.json(studentsArray)
})

studentRouter.get('/:id', (req, res) => {
    const id = req.params.id
    const student = _.find(studentsArray, (student) => student.id == id)
    if(student) {
        res.json(student)
    } else {
        res.json(`User not found with id ${id}.`)
    }
})

// download static content
studentRouter.get('/download/images/:imageName', (req, res)=>{
    var myPath = path.join('public', 'images', req.params.imageName)
    res.download(myPath)
})

studentRouter.post('/', (req, res) => {
    console.log("Handling POST http request")
    console.log(req.body)
    studentsArray.push(req.body)
    res.status(200).send('OK')
})

studentRouter.put('/', (req, res) => {
    console.log("Handling PUT http request")
    res.end()
})

studentRouter.delete('/', (req, res) => {
    console.log("Handling DELETE http request")
    res.end()
})

// validation on /id param
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
