import React from "react";
import DeleteButton from "./DeleteButton";

function Persons({ search, filteredSearch, persons, handleDelete}) {
  console.log(filteredSearch);
  
  return (
    <>
      {search.length > 0 ? (
        <div>
          {filteredSearch.map((person, idx) => {
            console.log(person); // Add this line
            return (
              <p key={person.name}>
                {person.name} {person.number} <DeleteButton handleDelete={handleDelete} id={person.id} />
              </p>
            );
          })}
        </div>
      ) : (
        <div>
          {persons.map((person) => {
            console.log(person); // Add this line
            return (
              <p key={person.name}>
                {person.name} {person.number} <DeleteButton handleDelete={handleDelete} id={person.id} />
              </p>
            );
          })}
        </div>
      )}
    </>
  );
}

export default Persons;
