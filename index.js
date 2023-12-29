require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
const Person = require('./models/person')

app.use(cors())
app.use(express.json())
app.use(morgan('tiny'))
app.use(express.static('./dist'))

morgan.token('postData', (request) => JSON.stringify(request.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postData'));

let persons = []

app.get('/api/puhelinluettelo.people', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
  });

app.get('/info', (request, response) => {
    response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`);
})
  
  
app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(note => {
    response.json(note)
  })
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id;
  Person.findByIdAndRemove(id)
    .then(() => {
      response.status(204).end();
    })
    .catch(error => {
      console.error('Error deleting person:', error);
      response.status(500).json({ error: 'Internal Server Error' });
    });
})
  
const generateId = () => {
    min = Math.ceil(1);
    max = Math.floor(1000000);
    const id = Math.floor(Math.random() * (max - min) + min)
return id
}

app.post('/api/persons', (request, response) => {
const body = request.body

if (!body.name || !body.number) {
    return response.status(400).json({ 
    error: 'content missing' 
    })}
if (persons.find(person => person.name === body.name)) {
        return response.status(400).json({ 
        error: 'name must be unique' 
        })}


const person = new Person({
    name: body.name,
    number: body.number,
})

person.save().then(savedPerson => {
  response.json(savedPerson)
})
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})