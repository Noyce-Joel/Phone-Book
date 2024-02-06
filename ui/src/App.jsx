import { useState } from "react";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import Filter from "./components/Filter";

import { useEffect } from "react";
import service from "./services/entries";
import Notification from "./components/Notification";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [search, setSearch] = useState("");
  const [filteredSearch, setFilteredSearch] = useState("");
  const [message, setMessage] = useState(null);
  const [success, setSuccess] = useState(null);
  useEffect(() => {
    service.getAll().then((response) => {
      setPersons(response);
    });
  }, []);
  console.log(persons);

  const handleSubmit = (e) => {
    e.preventDefault();

    const personObject = {
      name: newName,
      number: newNumber,
    };
    const nameExists = persons.some((person) => {
      return person.name === newName;
    });
    console.log(nameExists);
    const numExists = persons.some((person) => {
      return person.number === newNumber;
    });
    if (nameExists) {
      const existingPerson = persons.find((person) => person.name === newName);
      const id = existingPerson.id;
      alert(
        `${newName} is already added to phonebook. Replace the old number with a new one?`
      );
      if (numExists) {
        setMessage(
          `${newNumber} is already assigned to a person in the phonebook.`
        );
        setSuccess(false);
        setTimeout(() => {
          setMessage(null);
          setSuccess(false);
        }, 5000);
        return;
      }
      service
        .updateEntry(id, personObject)
        .then((response) => {
          console.log(response);
          setPersons(
            persons.map((person) =>
              person.id !== id ? person : { ...person, number: newNumber }
            )
          );
          setMessage(`${newName}'s number has been updated.`);
          setSuccess(true);
          setNewName("");
          setNewNumber("");
          setTimeout(() => {
            setMessage(null);
          }, 2000);
        })
        .catch((error) => {
          console.log(error.response.data)
          setMessage(
            "Error updating: The person was already deleted from the server"
          );
          setSuccess(false);
        });
      return;
    }

    if (numExists) {
      setMessage(
        `${newNumber} is already assigned to a person in the phonebook.`
      );
      setSuccess(false);
      setTimeout(() => {
        setMessage(null);
      }, 5000);
      return;
    }

    service
      .createEntry(personObject)
      .then((response) => {
        console.log("posting");
        setPersons(persons.concat(response));
        setMessage(`${newName} has been added to the phonebook.`);
        setSuccess(true);
        setTimeout(() => {
          setMessage(null);
        }, 5000);
      })
      .catch((error) => {
        console.log(error.response.data);
        setMessage(error.response.data.error);
        setSuccess(false);
        setTimeout(() => {
          setMessage(null);
        },5000);
      });

    setNewName("");
    setNewNumber("");
  };

  const handleNameChange = (e) => {
    setNewName(e.target.value);
  };

  const handleNumberChange = (e) => {
    setNewNumber(e.target.value);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      service
        .deleteEntry(id)
        .then(() => {
          setPersons(persons.filter((person) => person.id !== id));
          setMessage("Deleted successfully");
        })
        .catch((error) => {
          console.log(error.response.data);
          setMessage(
            "Error deleting: The person was already deleted from the server"
          );
          setSuccess(false);
        });
    }
  };

  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = persons.filter((person) => {
      return person.name.toLowerCase().includes(searchTerm);
    });
    setSearch(searchTerm);
    setFilteredSearch(filtered);
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} success={success} />
      <Filter search={search} handleSearch={handleSearch} />
      <h2>Add a new</h2>
      <PersonForm
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        handleSubmit={handleSubmit}
      />
      <h2>Numbers</h2>
      <Persons
        search={search}
        filteredSearch={filteredSearch}
        persons={persons}
        handleDelete={handleDelete}
      />
    </div>
  );
};

export default App;
