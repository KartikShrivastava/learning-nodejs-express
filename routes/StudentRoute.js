// backend framework which uses nodejs
import express from 'express'
// provides utilities to add functionality such as searching on json object using props
import _ from 'lodash'
// a wanky way to get json object from a file
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const students = require('../data/students.json')
import path from 'path'
import mongoose from 'mongoose'

// connect to mongodb cloud database(hosted in AWS) using mongoose
const DB_URL = `mongodb+srv://kash:kash@cluster0.gc5wlml.mongodb.net/?retryWrites=true&w=majority`
mongoose.connect(DB_URL)
const db = mongoose.connection
db.once('open', () => {
    console.log("Hurray we are connected to mongodb")
})
// schema for mongoose data access object layer
const StudentSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    course: String
})
// convert mongoose schema into model
const StudentModel = mongoose.model('Student', StudentSchema)

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
