require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const app = express()
const Note = require('./models/note')
const generateId = () => {
    const maxId = notes.length > 0
        ? Math.max(...notes.map(n => n.id))
        : 0
    return maxId + 1
}
const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}

app.use(cors())
app.use(express.json())
app.use(express.static('dist'))
app.use(requestLogger)

app.get('/api/notes', (request, response) => {
    Note.find({}).then(notes => {
        response.json(notes)
    })
})
app.get('/api/notes/:id', (request, response) => {
    Note.findById(request.params.id).then(note => {
        response.json(note)
    })
})
app.post('/api/notes', (request, response) => {
    const body = request.body
    if (body.content === undefined) {
        return response.status(400).json({error: 'content missing'})
    }
    const note = new Note({
        content: body.content,
        important: Boolean(body.important) || false,
    })
    note.save().then(savedNote => {
        response.json(savedNote)
    })
})
app.put('/api/notes/:id', (request, response)=>{
    response.status(405).send({error: 'Method Not Allowed'})
})
app.delete('/api/notes/:id', (request, response) => {
    /*const id = Number(request.params.id)
    notes = notes.filter(note => note.id !== id)

    response.status(204).end()*/
    response.status(405).send({error: 'Method Not Allowed'})
})
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})