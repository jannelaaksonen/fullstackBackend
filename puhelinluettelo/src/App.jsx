import { useState, useEffect } from 'react'
import noteService from './services/notes'
import './index.css'

// filtterin käsittely
const Filter = (props) => {
  return (
    <div>Filter shown with <input
          value={props.newFilter}
          onChange={props.addNewFilter}/>
    </div>
  )
}

const Message = ({ message }) => {
  if (message === null) {
    return null
  }
  return (
  <div className='message'>{message}</div>
  )

}

const ErrorMessage = ({ errorMessage }) => {
  if (errorMessage === null) {
    return null
  }
  return (
  <div className='errorMessage'>{errorMessage}</div>
  )

}

// uuden henkilön lisäys
const PersonForm = (props) => {
  return (
    <form onSubmit={props.addNewPerson}>
    <div>Name: <input 
    value={props.newName}
    onChange={props.handleNewPerson}
    /></div>
    <div>Number: <input 
    value={props.newPhoneNumber}
    onChange={props.handleNewPhoneNumber}
    />
    </div>
    <div><button type="submit">add</button></div>
</form>)
}

// esitetään filtteröidyt nimet
const Filtered = (props) => {
  return (
  <ul>
  {props.filteredPersons.map(person => (
    <li key={person.id}>
        {person.name} {person.number}
        <button type="button" onClick={() => props.handleRemove(person.id)}>delete</button>
    </li>
    ))}
    </ul>
)}


const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newPhoneNumber, setNewPhonenumber] = useState('')
  const [newFilter, setFilter] = useState('')
  const [message, setMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  // haetaan henkilötiedot palvelimelta
  useEffect(() => {
    noteService
      .getAll()
      .then(response => {
        setPersons(response.data)
      })
  }, [])

  // uuden henkilön lisäys ja tarkistus ettei nimi ole jo luettelossa
  const addNewPerson = (event) => {
    event.preventDefault();  
    const existingPerson = persons.find(person => person.name === newName);

  if (existingPerson && window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)){
    // puhelinnumeron päivitys
    noteService
      .update(existingPerson.id, { name: newName, number: newPhoneNumber })
      .then(response => {
        setPersons(persons.map(p =>
          p.id === existingPerson.id ? { ...p, name: newName, number: newPhoneNumber } : p
        ));
    setMessage(`Updated ${newName}'s number`)
    setTimeout(() => {
      setMessage(null)
    }, 3000)
      })
  } else {
      const personObject = {
        name: newName,
        number: newPhoneNumber
      }
      setPersons(persons.concat(personObject));
      setNewName('')
      setNewPhonenumber('')

      noteService
      .create(personObject)
      .then(response => {
        console.log(response)
      })
      setMessage(`Added ${newName}`)
      setTimeout(() => {
      setMessage(null)
      }, 3000)
    }
  }; 

  
  // uuden henkilön nimen käsittely
  const handleNewPerson = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  // uuden henkilön puhelinnumeron käsittely
  const handleNewPhoneNumber = (event) => {
    console.log(event.target.value)
    setNewPhonenumber(event.target.value)
  }
  // filtterin käsittely
  const addNewFilter = (event) => {
    console.log(event.target.value)
    setFilter(event.target.value)
  }
  // suodatetaan esitettävistä nimistä ne, jotka sisältävät filtterin
  const filteredPersons = persons.filter(person => {
    const nameMatches = person.name.toLowerCase().includes(newFilter.toLowerCase());
    const numberMatches = person.number.toLowerCase().includes(newFilter.toLowerCase());
    return nameMatches || numberMatches;
  });

  // poistetaan henkilö
  const handleRemove = (id) => {
    const person = persons.find(p => p.id === id)
    if (window.confirm(`Delete ${person.name}?`)) {
      noteService
      .remove(id)
      .then(response => {
        setPersons(persons.filter(p => p.id !== id))
        setMessage(`Deleted ${person.name}`)
        setTimeout(() => {
        setMessage(null)
      }, 3000)
      })
      .catch(error => {
        console.error(error)
        setErrorMessage(`Can't delete ${person.name}`)
        setTimeout(() => {
        setErrorMessage(null)
      }, 3000)
    })
  }
      }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter newFilter={newFilter} addNewFilter={addNewFilter}/>
      <Message message={message}/>
      <ErrorMessage errorMessage={errorMessage}/>
      <div>
        <h2>Add a new</h2>
        <PersonForm addNewPerson={addNewPerson} newName={newName} handleNewPerson={handleNewPerson} newPhoneNumber={newPhoneNumber} handleNewPhoneNumber={handleNewPhoneNumber}/>
      </div>
      <h2>Numbers</h2>
      <Filtered filteredPersons={filteredPersons} handleRemove={handleRemove}/>
    </div>
  )

}

export default App