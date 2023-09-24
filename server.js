import express from 'express';
import fs from 'fs';

const getAllPeople = () => {
  return JSON.parse(fs.readFileSync('./database.json')).people;
}
const getPersonById = id => {
  return getAllPeople().find(person => person.id === +id)
}
let chosenPeople = []
let unchosenPeople = [...getAllPeople()]
let pickedPeople = [];

/**
 * Selects a random person from the unchosenPeople, removes them from 
 * unchosenPeople, and adds them to chosenPeople.
 * @returns The current/chosen random person
 */
const getRandomPerson = () => {
  if(unchosenPeople.length === 0) {
    unchosenPeople = [...pickedPeople];
    pickedPeople = [];
  }

  let currentPerson = unchosenPeople[Math.floor(Math.random() * unchosenPeople.length)];
  unchosenPeople = unchosenPeople.filter(p => p !== currentPerson);
  pickedPeople = [...pickedPeople, currentPerson];
  chosenPeople = [...chosenPeople, currentPerson];
  return currentPerson;
};



const port = 3001;
const app = express();

app.get('/people', (req, res) => {
  res.send(getAllPeople())
})

app.get('/people/chosen', (req, res) => {
  res.send(chosenPeople);
})
app.get('/people/unchosen', (req, res) => {
  res.send(unchosenPeople);
})
/**
 * Basically starts over.
 * Resets chosenPeople to empty. Resets unchosenPeople to all people.
 */
app.post('/people/reset', (req, res) => {
  chosenPeople = [];
  unchosenPeople = [...getAllPeople()];
  res.sendStatus(204); // No content.
})
/**
 * Calls getRandomPerson(). Notice that it changes chosenPeople and unchosenPeople
 */
app.post('/people/getRandom', (req, res) => {
  const currentPerson = getRandomPerson();
  console.log(currentPerson)
  res.send(currentPerson)
})

app.get('/people/:id', (req, res) => {
  const { id } = req.params;
  const person = getPersonById(id);
  if (!person)
    res.status(404).send(`Person ${id} was not found.`)
  res.send(person);
})




app.use(express.static("./public"));

app.listen(port, () => {
  console.log(`listening for HTTP requests on port ${port}`);
})