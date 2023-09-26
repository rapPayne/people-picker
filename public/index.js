let chosenPeopleSection
let unchosenPeopleSection
let peopleToRevisitSection
let currentPersonSection
let revisitButton;

document.addEventListener('DOMContentLoaded', async () => {
  chosenPeopleSection = document.querySelector('section#chosen-people')
  unchosenPeopleSection = document.querySelector('section#unchosen-people')
  peopleToRevisitSection = document.querySelector('section#people-to-revisit')
  currentPersonSection = document.querySelector('section#current-person')
  let pickAPersonButton = document.querySelector('button#pick-a-person')
  revisitButton = document.querySelector('button#revisit')
  let resetButton = document.querySelector('button#reset')

  pickAPersonButton.addEventListener('click', () => fetchNextPerson())
  revisitButton.addEventListener('click', () => revisitPersonLater())
  resetButton.addEventListener('click', () => reset())
  refreshChosenPeople();
  refreshUnchosenPeople();
  refreshPeopleToRevisit();
})

const reset = async () => {
  await fetch('/people/reset', { method: 'POST' })
    .then(res => { if (!res.ok) throw res.status; return res })
    .catch(err => console.error("Error resetting the lists", err))
  
  currentPersonSection.innerHTML = "";
  revisitButton.setAttribute("disabled", "");
  refreshChosenPeople()
  refreshUnchosenPeople()
  refreshPeopleToRevisit()
}
const fetchNextPerson = async () => {
  const currentPerson = await fetch('/people/getNextPerson', { method: 'POST' })
    .then(res => { if (!res.ok) throw res.status; return res })
    .then(res => res.json())
    .catch(err => console.error("Error fetching the next person", err));
  currentPersonSection.innerHTML = currentPerson ? makeOnePersonSection(currentPerson) : "";
  revisitButton.removeAttribute("disabled");
  refreshChosenPeople()
  refreshUnchosenPeople()
  refreshPeopleToRevisit()
}
const revisitPersonLater = async () => {
  
  const currentPerson = await fetch('/person/revisit', { method: 'POST' })
  .then(res => { if (!res.ok) throw res.status; return res })
  .then(res => res.json())
  .catch(err => console.error("Error sending the person to be revisited", err))
  refreshPeopleToRevisit()
  refreshUnchosenPeople()
  currentPersonSection.innerHTML = currentPerson ? makeOnePersonSection(currentPerson) : console.log(currentPerson);
 
}
const fetchUnchosenPeople = async () => await fetch('/people/unchosen')
  .then(res => { if (!res.ok) throw res.status; return res })
  .then(res => res.json())
  .catch(err => console.error("Error fetching unchosenpeople", err))

const refreshUnchosenPeople = async () => {
  const people = await fetchUnchosenPeople();
  const html = people ? people.reduce((html, p) => html += makeOnePersonSection(p), "") : ""
  unchosenPeopleSection.innerHTML = html;
}

const fetchChosenPeople = async () => await fetch('/people/chosen')
  .then(res => { if (!res.ok) throw res.status; return res })
  .then(res => res.json())
  .catch(err => console.error("Error fetching chosenpeople", err))

const refreshChosenPeople = async () => {
  const people = await fetchChosenPeople();
  const html = people ? people.reduce((html, p) => html += makeOnePersonSection(p), "") : ""
  chosenPeopleSection.innerHTML = html;
}

const fetchPeopleToRevisit = async () => await fetch('/people/revisit')
  .then(res => { if (!res.ok) throw res.status; return res })
  .then(res => res.json())
  .catch(err => console.error("Error fetching chosenpeople", err))

const refreshPeopleToRevisit = async () => {
  const people = await fetchPeopleToRevisit();
  const html = people ? people.reduce((html, p) => html += makeOnePersonSection(p), "") : ""
  peopleToRevisitSection.innerHTML = html;
}

const makeOnePersonSection = (person) => `
<section class="person">
  <div class="name-and-img">
    <h3>${person.first}</h3>
    <img src="/images/${person.id}.png" alt="" />
  </div>
  <div class="data-table">
    <table>
    <tbody>
    <tr><td>Last</td><td>${person.last}</td></tr>
    <tr><td>Age</td><td>${person.age}</td></tr>
    <tr><td>Email</td><td>${person.email}</td></tr>
    <tr><td>Phone</td><td>${person.phone}</td></tr>
    </tbody>
    </table>
  </div>
</section>
`