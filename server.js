import express from 'express';
import fs from 'fs';

const getAllPeople = () => {
  return JSON.parse(fs.readFileSync('./database.json')).people;
}
const getPersonById = id => {
  return getAllPeople().find(person => person.id === +id)
}
let chosenPeople = []
let stashed = []
let unchosenPeople = [...getAllPeople()]
/**
 * Selects a random person from the unchosenPeople, removes them from 
 * unchosenPeople, and adds them to chosenPeople.
 * @returns The current/chosen random person
 */
const getRandomPerson = () => {

  //this conditional handles the stashed array
  //once unchosen is empty, it will move on to "stashed"
  //as long as there are people in the stashed array
  if (!unchosenPeople.length && stashed.length){
      unchosenPeople = stashed; 
  }
  let currentPerson = unchosenPeople[Math.floor(Math.random() * unchosenPeople.length)]
  unchosenPeople = unchosenPeople.filter(p => p !== currentPerson);
  //handle our stash thing... 
  if (!stashed.contains(currentPerson)){
      {chosenPeople = [...chosenPeople, currentPerson];}
  return currentPerson;
}


const port = 3001;
const app = express();

app.get('/people', (req, res) => {
  res.send(getAllPeople())
})

app.get('/people/chosen', (req, res) => {
  res.send(chosenPeople);
})
app.get('/people/unchosen', (req, res) => {
  //combines unchosen and stashed people so user just sees unchosen
  let allUnchosenPeople = [...unchosenPeople, ...stashed]
  res.send(allUnchosenPeople);
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

//this is the endpoint that will handle our stashed person
app.post('/people/stash', (req, res) => {
  console.log(req.body);
  let stashedPerson = unchosenPeople.filter(p => p.id == req.body);
  unchosenPeople = unchosenPeople.filter(p => p.id !== req.body);
  stashed.push(stashedPerson);
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