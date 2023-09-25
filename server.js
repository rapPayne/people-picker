import express from 'express';
import fs from 'fs';

const getAllPeople = () => {
  return JSON.parse(fs.readFileSync('./database.json')).people;
}
const getPersonById = id => {
  return getAllPeople().find(person => person.id === +id)
}
let personInSpotlight
let chosenPeople = []
let unchosenPeople = [...getAllPeople()]
let peopleToRevisit = []
/**
 * Selects a random person from the unchosenPeople, removes them from 
 * unchosenPeople, and adds them to chosenPeople.
 * @returns The current/chosen random person
 */
const getRandomPerson = () => {
  if (personInSpotlight) {
    chosenPeople = [...chosenPeople, personInSpotlight];
  }
  personInSpotlight = unchosenPeople[Math.floor(Math.random() * unchosenPeople.length)]
  unchosenPeople = unchosenPeople.filter(p => p !== personInSpotlight);
  return personInSpotlight;
}
const addPersonToRevisitList = () => {
  peopleToRevisit = [...peopleToRevisit, personInSpotlight]
  personInSpotlight = undefined
}
const getNextPerson = () => {
  if(unchosenPeople.length){
    return getRandomPerson();
  }
  const nextPersonToRevisit = peopleToRevisit.shift();
  return nextPersonToRevisit;
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
  res.send(unchosenPeople);
})
app.get('/people/revisit', (req, res) => {
  res.send(peopleToRevisit);
})
/**
 * Basically starts over.
 * Resets chosenPeople to empty. Resets unchosenPeople to all people.
 */
app.post('/people/reset', (req, res) => {
  chosenPeople = [];
  unchosenPeople = [...getAllPeople()];
  peopleToRevisit = [];
  res.sendStatus(204); // No content.
})
/**
 * Calls getRandomPerson(). Notice that it changes personInSpotlight, chosenPeople, and unchosenPeople
 */
app.post('/people/getNextPerson', (req, res) => {
  const currentPerson = getNextPerson();
  console.log(currentPerson)
  res.send(currentPerson)
})
/**
 * Calls addPersonToRevisitList(). Notice that it changes personInSpotlight and peopleToRevisit
 */
app.post('/person/revisit', (req, res) => {
  //Revisit move the person in the spotlight to the revist list but will not assign the next person to the spotlight so it is possible that the spotlight is empty.
  if (!personInSpotlight) {
    res.status(400).send('There is no one in the spotlight to revisit.')
  } else {
    console.log(`Revisit ${personInSpotlight} at the end.`);
    addPersonToRevisitList();
    res.sendStatus(204); // No content.
  }
})

app.get('/person/getpersonInSpotlight', (req, res) => {
  console.log(personInSpotlight)
  res.send(personInSpotlight)
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