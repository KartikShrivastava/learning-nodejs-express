// backend framework which uses nodejs
import express from 'express'
// provides utilities to add functionality such as searching on json object using props
import _ from 'lodash'
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

// let studentsArray = students

studentRouter.get('/', (req, res) => {
    StudentModel.find((err, students) => {
        if(err) res.status(500).send(err)
        res.json(students)
    })
})

studentRouter.get('/:id', (req, res) => {
    StudentModel.findById(req.params.id, (err, student) => {
        if(err)
            res.status(500).send(err)
        if(student)
            res.json(student)
        else
            res.status(404).send(`User with id ${req.params.id} not found`)
    })
})

studentRouter.post('/', (req, res) => {
    const id = new mongoose.Types.ObjectId();
    const studentToPersist = Object.assign({
        _id : id
    }, req.body)

    const student = new StudentModel(studentToPersist)
    student.save().then((err, student) => {
        if(err) {
            res.status(500).send(err)
        }
        res.json(student)
    })
})

studentRouter.put('/', (req, res) => {
    console.log("Handling PUT http request")
    res.end()
})

studentRouter.delete('/', (req, res) => {
    console.log("Handling DELETE http request")
    res.end()
})

// module.exports = studentRouter
export {studentRouter}
