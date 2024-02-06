require("dotenv").config();
const express = require("express");
const cors = require("cors");
const Contact = require("./models/contact");
var morgan = require("morgan");
const app = express();

const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next();
};

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error);
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(cors());
app.use(express.static("dist"));
app.use(express.json());
app.use(requestLogger);

app.get("/", (req, res) => {
  res.send("<h1>Address Book</h1>");
});

app.get("/api/contacts", (req, res) => {
  Contact.find({}).then((result) => {
    res.json(result.map((contact) => contact.toJSON()));
  });
});

app.get("/api/contacts/:id", (req, res, next) => {
  Contact.findById(req.params.id)
    .then((contact) => {
      if (contact) res.json(contact);
      else res.status(404).end();
    })
    .catch((error) => {
      next(error);
    });
});

app.get("/api/info", (req, res) => {
  Contact.find({}).then((result) => {
    res.send(
      `<h1>Phonebook has info for ${result.length} people</h1>
      <h2>${new Date()}</h2>`
    );
  });
});

morgan.token("post", function (req, res) {
  if (req.method === "POST") {
    return `name: ${req.body}, number: ${req.body}`;
  }
  return "";
});
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :post")
);

app.post("/api/contacts", (request, response, next) => {
  const body = request.body;

  if (body.name === "" || body.number === "") {
    return response.status(400).json({ error: "content missing" });
  }

  const contact = new Contact({
    name: body.name,
    number: body.number,
  });

  contact
    .save()
    .then((savedContact) => {
      response.json(savedContact);
    })
    .catch((error) => {
      next(error);
    });
});

app.delete("/api/contacts/:id", (req, res) => {
  Contact.findByIdAndDelete(req.params.id)
    .then((result) => {
      res.status(204).end();
    })
    .catch((error) => {
      next(error);
    });
});

app.put("/api/contacts/:id", (req, res, next) => {
  const body = req.body;

  const contact = {
    name: body.name,
    number: body.number
  };

  Contact.findByIdAndUpdate(req.params.id, contact )
    .then((updatedContact) => {
      res.json(updatedContact);
    })
    .catch((error) => next(error));
});

app.use(errorHandler);
app.use(unknownEndpoint);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
