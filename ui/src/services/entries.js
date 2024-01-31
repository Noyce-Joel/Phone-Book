import axios from 'axios' 

const baseUrl = 'http://localhost:3001/api/persons'

const getAll = () => {
    const req = axios.get(baseUrl)
    return req.then(response => response.data)
}

const createEntry = newObject => {
    const req = axios.post(baseUrl, newObject)
    return req.then(response => response.data)
}
const updateEntry = (id, newObject) => {
    const req = axios.put(`${baseUrl}/${id}`, newObject)
    return req.then(response => response.data)
}

const deleteEntry = (id) => {
    const req = axios.delete(`${baseUrl}/${id}`)
    return req.then(response => response.data)
    
    
}

export default { getAll, createEntry, updateEntry, deleteEntry }