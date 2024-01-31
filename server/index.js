const express = require("express");
const cors = require('cors')
var morgan = require("morgan");
const app = express();
app.use(express.static("dist"));
app.use(cors());
app.use(express.json());

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

const generateId = () => {
  const id = Math.floor(Math.random() * 100000);
  return id;
};

app.get("/", (req, res) => {
  res.send("<h1>Address Book</h1>");
});

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((note) => note.id === id);
  if (person) res.json(person);
  else res.status(404).end();
});

app.get("/info", (req, res) => {
  res.send(
    `<p>Phonebook has info for ${persons.length} people</p>` +
      `<p>${new Date()}</p>`
  );
});

morgan.token("post", function (req, res) {
  if (req.method === "POST") {
    return `name: ${req.body.content.name}, number: ${req.body.content.number}`;
  }
  return "";
});
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :post")
);

app.post("/api/persons", (req, res) => {
  const person = req.body.content;
  if (!person.name || !person.number)
    return res.status(400).json({ error: "name or number missing" });

  if (persons.find((p) => p.name === person.name))
    return res.status(400).json({ error: "name must be unique" });

  person.id = generateId();
  persons = persons.concat(person);
  res.json(person);
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((person) => person.id !== id);
  res.status(204).end();
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
