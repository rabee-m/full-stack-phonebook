const express = require('express')
const app = express()
const cors = require('cors')
const { response } = require('express')

app.use(express.json())
app.use(cors())
app.use(express.static('build'))


let persons = [
    { 
        "id": 1,
        "name": "Arto Hellas", 
        "number": "040-123456"
      },
      { 
        "id": 2,
        "name": "Ada Lovelace", 
        "number": "39-44-5323523"
      },
      { 
        "id": 3,
        "name": "Dan Abramov", 
        "number": "12-43-234345"
      },
      { 
        "id": 4,
        "name": "Mary Poppendieck", 
        "number": "39-23-6423122"
      }
]

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    const today = new Date();
    let displayDate = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    const displayInfo = `Phonebook has ${persons.length} people On ${displayDate}.`
    response.send(displayInfo)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    const person = persons.find(p => p.id === id);
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    persons = persons.filter(p => p.id !== id)
    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body;
    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'number/name missing'
        })
    }
    
    const duplicateName = persons.find(p => p.name === body.name);
    if (duplicateName) {
        return response.status(400).json({
            error: 'duplicate name'
        })
    }

    const randomId = Math.floor(Math.random() * 100000);
    const person = {
        id: randomId,
        name: body.name,
        number: body.number
    }
    persons = persons.concat(person)
    response.json(person)
})

app.put('/api/persons/:id', (req, res) => {
    const id = Number(request.params.id);
    const body = request.body;

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'number/name missing'
        })
    }
    const person = persons.find(p => p.id === id);
    person.number = body.number

    persons = persons.map(p => p.name === body.name ? person : p)
    response.json(person)
})

const PORT = 3002
app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${PORT}`)
})