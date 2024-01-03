require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const Person = require('./models/person');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(morgan('tiny'));
app.use(express.static('./dist'));

morgan.token('postData', (request) => JSON.stringify(request.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postData'));

// Yhdistä MongoDB-tietokantaan
const url = process.env.MONGODB_URI;
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
  });

// RESTful API routes
app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons);
  });
});

app.get('/info', (request, response) => {
  Person.countDocuments({}, (err, count) => {
    if (err) {
      console.error('Error getting person count:', err);
      response.status(500).json({ error: 'Internal Server Error' });
    } else {
      response.send(`<p>Phonebook has info for ${count} people</p><p>${new Date()}</p>`);
    }
  });
});

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(note => {
    response.json(note);
  });
});

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
});

app.post('/api/persons', (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({ error: 'content missing' });
  }

  if (persons.find(person => person.name === body.name)) {
    return response.status(400).json({ error: 'name must be unique' });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then(savedPerson => {
    response.json(savedPerson);
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
