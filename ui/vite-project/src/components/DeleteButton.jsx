import React from 'react';
import service from '../services/entries';

function DeleteButton({ handleDelete, id }) {

    

    return (
        <button onClick={() => handleDelete(id)}>
            Delete
        </button>
    );
}

export default DeleteButton;