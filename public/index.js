let chosenPeopleSection
let unchosenPeopleSection
let currentPersonSection


document.addEventListener('DOMContentLoaded', async () => {
  chosenPeopleSection = document.querySelector('section#chosen-people')
  unchosenPeopleSection = document.querySelector('section#unchosen-people')
  currentPersonSection = document.querySelector('section#current-person')
  let pickAPersonButton = document.querySelector('button#pick-a-person')
  let resetButton = document.querySelector('button#reset')
  let stashButton = document.querySelector('button#stash');

  pickAPersonButton.addEventListener('click', () => fetchRandomPerson())
  resetButton.addEventListener('click', () => reset())
  stashButton.addEventListener('click',() => stashPerson());
  refreshChosenPeople();
  refreshUnchosenPeople();

})

const reset = async () => {
  await fetch('/people/reset', { method: 'POST' })
    .then(res => { if (!res.ok) throw res.status; return res })
    .then(res => res.json())
    .catch(err => console.error("Error resetting the lists", err))
  refreshChosenPeople()
  refreshUnchosenPeople()
}
const fetchRandomPerson = async () => {
  const currentPerson = await fetch('/people/getRandom', { method: 'POST' })
    .then(res => { if (!res.ok) throw res.status; return res })
    .then(res => res.json())
    .catch(err => console.error("Error fetching random person", err))
  currentPersonSection.dataset.id = currentPerson.id;
  currentPersonSection.innerHTML = makeOnePersonSection(currentPerson);
  refreshChosenPeople()
  refreshUnchosenPeople()
}
const fetchUnchosenPeople = async () => await fetch('/people/unchosen')
  .then(res => { if (!res.ok) throw res.status; return res })
  .then(res => res.json())
  .catch(err => console.error("Error fetching unchosenpeople", err))

const fetchChosenPeople = async () => await fetch('/people/chosen')
  .then(res => { if (!res.ok) throw res.status; return res })
  .then(res => res.json())
  .catch(err => console.error("Error fetching chosenpeople", err))

const refreshChosenPeople = async () => {
  const people = await fetchChosenPeople();
  const html = people.reduce((html, p) => html += makeOnePersonSection(p), "")
  chosenPeopleSection.innerHTML = html;
}

const refreshUnchosenPeople = async () => {
  const people = await fetchUnchosenPeople();
  const html = people.reduce((html, p) => html += makeOnePersonSection(p), "")
  unchosenPeopleSection.innerHTML = html;
}

const stashPerson = async () => {
    if (!thereIsACurrentPerson()){
      alert("No person selected to stash!");
    }

  //to-do 
  //hit api endpoint (to be created) that addes this person to stashed array
    await fetch('/people/stash', {method: 'POST', body: currentPersonSection.dataset.id})
    .then(res => { if (!res.ok) throw res.status; return res });
    fetchRandomPerson();
}

const thereIsACurrentPerson = () => {
  return currentPersonSection.dataset.id != "";
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