const astrosUrl = 'http://api.open-notify.org/astros.json';
const wikiUrl = 'https://en.wikipedia.org/api/rest_v1/page/summary/';
const peopleList = document.getElementById('people');
const btn = document.querySelector('button');

// Handle all fetch requests


async function getPeopleInspace(url) {

  const peopleResponse = await fetch(url)
  const peopleJSON = await peopleResponse.json();


  const profiles = peopleJSON.people.map( async(person) => {  //in this case person is the object inside the array called people and hence to 
    //access the name property we use dot notation person.name
    const craft = person.craft;
    const profileReponse = await fetch(wikiUrl + person.name);
    const profileJSON = await profileReponse.json();

    return {...profileJSON, craft}

  });
  

 return Promise.all(profiles);
}

console.log(getPeopleInspace(astrosUrl))

// Generate the markup for each profile
function generateHTML(data) {
  data.map( person => {
    const section = document.createElement('section');
    peopleList.appendChild(section);
    // Check if request returns a 'standard' page from Wiki
    if (person.type === 'standard') {
      section.innerHTML = `
        <img src=${person.thumbnail.source}>
        <span>${person.craft}</span>
        <h2>${person.title}</h2>
        <p>${person.description}</p>
        <p>${person.extract}</p>
      `;
    } else {
      section.innerHTML = `
        <img src="img/profile.jpg" alt="ocean clouds seen from space">
        <h2>${person.title}</h2>
        <p>Results unavailable for ${person.title}</p>
        ${person.extract_html}
      `;
    }
  });
}

btn.addEventListener('click', (event) => {
  event.target.textContent = "Loading...";

  getPeopleInspace(astrosUrl)
    .then(generateHTML)
    .finally( () => event.target.remove())

});