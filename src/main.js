// Getting the search input
const searchInput = document.getElementById("search-input");

// Adding an event listener that listens to whenever the user types something into the search bar
searchInput.addEventListener("input", function (e) {
  // Get the value of the input
  const input = e.target.value;
  if(input.length >= 1){
    debouncedCharacterSearch(input)
  }
  console.log(input);

  debouncedCharacterSearch(input);
})

// document.addEventListener("DOMContentLoaded", function(){
//   fetch(`https://swapi.py4e.com/api/people`).then(resp => resp.json()).then(data => {
//     console.log(data)
//    }).catch(e => {
//     console.log(e);
//    })   
// }) Isn't this the same code as below?

const results = document.getElementById("results");
const dialog = document.getElementById("popup-dialog");
const characterTitle = document.getElementById("character-title");
const dialogContent = document.getElementById("dialog-content");
const closeDialogButton = document.getElementById("close-dialog");

function debounce(func, wait) {
  let timeout;

  return function (...args) {
    const context = this;

    clearTimeout(timeout);

    timeout = setTimeout(() => {
      func.apply(context, args);
    }, wait);
  };
}

//Other code
function openCharacterDialog(characterApiUrl) {
  // Open the dialog
  // dialog.close();
  dialog.showModal();

  // Fetch and display data
  fetch(characterApiUrl).then(resp => resp.json()).then(data => {
    characterTitle.innerText = data.name;
    console.log(data);

  // Adding the character data as HTML dynamically
    dialogContent.innerHTML = `
      <p><strong>Height:</strong> ${data.height}</p>
      <p><strong>Mass:</strong> ${data.mass}</p>
      <p><strong>Gender:</strong> ${data.gender}</p>
      `;

  }).catch(err => {
    // If the fetch fails overall, then we will display this message
      dialogContent.innerHTML = 'Failed to load data.';
      displayError();
      console.log(err);
  });  
    
}

// Close the dialog when clicking outside of it
dialog.addEventListener('click', (event) => {
  if (event.target === dialog) {
    dialog.close();
  }
});

//When the dialog closes, we reset it back to it's original state
dialog.addEventListener("close", () => {
  characterTitle.innerText = "";
  dialogContent.innerHTML = "Loading...";
})

// Close the dialog when the close button is clicked within the dialog element
closeDialogButton.addEventListener('click', () => {
  dialog.close();
});



function displayCharacters(characters){
  if(!characters || characters.length === 0) {
    displayError();
    return;
  }
  const listOfCharacterNames = characters.map(character => {
    return `<li><a data-url="${character.url}">${character.name}</a></li>`; 
    }).join(""); 
    results.innerHTML = `<ul class = "characters">${listOfCharacterNames}</ul>`;
    // Get all the characters in the Characters list (as created above)
    const links = document.querySelectorAll('.characters a');
    // For each link, lets add an event listener that listens for the click event.
    links.forEach(link => {
      link.addEventListener('click', () => {
        const characterUrl = link.getAttribute('data-url');
        openCharacterDialog(characterUrl);
      });
    });
}

function displayError() {
  results.innerHTML = "<ul class='characters'><li>The characters you seek are not here</li></ul>"
}


document.addEventListener("DOMContentLoaded", function(){
  fetch(`https://swapi.py4e.com/api/people`).then(resp => resp.json()).then(data => {
   console.log(data)
   displayCharacters(data.results);

  //  const listOfCharacterNames = data.results.map(character => {
  //     return `<li>${character.name}</li>`; 
  //     }).join(""); 
  //     /*I don't know if we went over it, but searched how to get array to become string without comma, and .join
  //     Then I played around placement to figure out since I had problems with results.innerHTML step so I backtracked.
  //     */
  //     results.innerHTML = `<ul class = "characters">${listOfCharacterNames}</ul>`;
    }).catch(e => {
        console.log(e);
        displayError();
    })
  })

  async function searchForCharacter(query) {
    const characterData = await fetch(`https://swapi.py4e.com/api/people?search=${query}`).then(resp => resp.json());

    console.log(characterData);
    //Opening of searchForCharacter function
      if (characterData.count >= 1) {
        displayCharacters(characterData.results)
      } else {
        displayError()
      }
 //Closing of searchForCharacter function
  
  }
  
  const debouncedCharacterSearch = debounce(searchForCharacter, 500)

  document.addEventListener("DOMContentLoaded", function () {
    fetch(`https://swapi.py4e.com/api/people`).then(resp => resp.json()).then(data => {
      //Opening of then block
        if (data.count >= 1) {
          displayCharacters(data.results)
        } else {
          displayError();
        }
        //Closing then block 
      console.log(data)
      displayCharacters(data.results);
    }).catch((err) => {
        console.error(err);
        displayError();
    });
  });




  