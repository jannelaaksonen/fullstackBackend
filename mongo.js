const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', noteSchema);

if (process.argv.length === 3) {
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person);
    });
    mongoose.connection.close();
  });
}

if (process.argv.length > 3) {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  });

  person.save().then(result => {
    console.log(`Added ${process.argv[3]} number ${process.argv[4]} to phonebook`);
    mongoose.connection.close();
  });
}

const password = process.argv[2];

const url = `mongodb+srv://jannelaaksonen:${password}@cluster0.ijjekgr.mongodb.net/puhelinluettelo?retryWrites=true&w=majority`;

mongoose.set('strictQuery', false);
mongoose.connect(url);
