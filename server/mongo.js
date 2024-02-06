const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password, name and number as arguments");
  process.exit(1);
}

const generateId = () => {
    const id = Math.floor(Math.random() * 100000);
    return id;
}

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

const url = `mongodb+srv://JoelNoyce:${password}@phonebook.ikwh1sp.mongodb.net/phoneBookApp?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const contactSchema = new mongoose.Schema({
  _id: Number,
  name: String,
  number: String,
});

const Contact = mongoose.model("Contact", contactSchema);



const contact = new Contact({
    _id: generateId(),
    name: name,
    number: number,
    });

    
name && number ? 
contact.save().then((result) => {
  console.log(`added ${name} number ${number} to phonebook`);
  mongoose.connection.close();
}) : null;

Contact.find({}).then((result) => {
  result.forEach((contact) => {
    console.log(contact);
  });
  mongoose.connection.close();
});
