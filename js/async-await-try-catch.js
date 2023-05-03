const astrosUrl = 'http://api.open-notify.org/astros.json';
const wikiUrl = 'https://en.wikipedia.org/api/rest_v1/page/summary/';
const peopleList = document.getElementById('people');
const btn = document.querySelector('button');

// Handle all fetch requests

// --> .json() -- the result is not JSON but is instead the result of taking JSON 
              //as input and parsing it to produce a JavaScript object.
async function getJSON(url) {
  try {
    const response = await fetch(url);
    return await response.json(); //this means the func is going to `wait` for response.json()
                                  // to resolve or reject if it rejects is going to throw
                                  // before returning anyhting and any errors throw will be caught
                                  // by the catch clause
  } catch (error) {
    throw error;
  }

} 
async function getPeopleInspace(url) {
  const peopleJSON = await getJSON(url);


  const profiles = peopleJSON.people.map( async(person) => {  //in this case person is the object inside the array called people and hence to 
    //access the name property we use dot notation person.name
    const craft = person.craft;
    const profileJSON = await getJSON(wikiUrl + person.name);

    return {...profileJSON, craft}

  });
  

 return Promise.all(profiles);
}



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
    .catch( e => {
        peopleList.innerHTML = '<h3>Something Went Wrong!<h/3>';e
        console.error(e) // use this so that error message is
                         // formatted in the console
    })
    .finally( () => event.target.remove())

});