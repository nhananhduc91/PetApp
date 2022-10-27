'use strict';
//Get elements through DOM
const findBtn = document.getElementById('find-btn');
const idInput = document.getElementById('input-id');
const nameInput = document.getElementById('input-name');
const typeInput = document.getElementById('input-type');
const breedInput = document.getElementById('input-breed');
const vaccinatedInput = document.getElementById('input-vaccinated');
const dewormedInput = document.getElementById('input-dewormed');
const sterilizedInput = document.getElementById('input-sterilized');
const tableBodyEl = document.getElementById('tbody');


//get pet list
let petArr = getFromStorage('petData') ? JSON.parse(getFromStorage('petData')) : [];
renderTableData(petArr);

//Filter breed by type
let breedList = getFromStorage('breedData') ? JSON.parse(getFromStorage('breedData')) : [];
//Render breed list

function renderBreedList() {
  for (let breed of breedList) {
    const option = document.createElement('option');
    option.innerHTML = breed.name;
    breedInput.appendChild(option);
  }
};

renderBreedList()

//Submit find pet
findBtn.addEventListener('click', function () {
  let petSearched = [];
  //Condition when user not input name, type, id, breed
  const checkSearchOnlyCheckBox =
    idInput.value.trim() === ''
    && nameInput.value.trim() === ''
    && typeInput.value === ''
    && breedInput.value === '';

  //Loop array and have 6 cases for user to choose
  for (const pet of petArr) {
    //Case 1: Search by id, name, type, breed, no tick checkbox
    if (pet.id.includes(idInput.value.trim())
      && pet.name.toLowerCase().includes(nameInput.value.trim().toLowerCase())
      && pet.type.includes(typeInput.value)
      && pet.breed.includes(breedInput.value)
      && vaccinatedInput.checked === false
      && dewormedInput.checked === false
      && sterilizedInput.checked === false
    ) {
      petSearched.push(pet);
    }

    //Case 1: Search by tick vaccinated and dewormed and sterilized
    else if (checkSearchOnlyCheckBox
      && vaccinatedInput.checked === true
      && pet.vaccinated === true
      && dewormedInput.checked === true
      && pet.dewormed === true
      && sterilizedInput.checked === true
      && pet.sterilized === true
    ) {
      petSearched.push(pet);
    }

    //Case 1: Search by tick vaccinated and dewormed
    else if (checkSearchOnlyCheckBox
      && vaccinatedInput.checked === true
      && pet.vaccinated === true
      && dewormedInput.checked === true
      && pet.dewormed === true
      && sterilizedInput.checked === false
    ) {
      petSearched.push(pet);
    }

    //Case 2: Search by tick vaccinated and sterilized
    else if (checkSearchOnlyCheckBox
      && vaccinatedInput.checked === true
      && pet.vaccinated === true
      && sterilizedInput.checked === true
      && pet.sterilized === true
      && dewormedInput.checked === false
    ) {
      petSearched.push(pet);
    }

    //Case 3: Search by tick dewormed and sterilized
    else if (checkSearchOnlyCheckBox
      && dewormedInput.checked === true
      && pet.dewormed === true
      && sterilizedInput.checked === true
      && pet.sterilized === true
      && vaccinatedInput.checked === false
    ) {
      petSearched.push(pet);
    }

    //Case 4: Search by tick vaccinated only
    else if (checkSearchOnlyCheckBox
      && vaccinatedInput.checked === true
      && dewormedInput.checked === false
      && sterilizedInput.checked === false
      && pet.vaccinated === true
    ) {
      petSearched.push(pet);
    }

    //Case 5: Search by tick dewormed only
    else if (checkSearchOnlyCheckBox
      && vaccinatedInput.checked === false
      && dewormedInput.checked === true
      && sterilizedInput.checked === false
      && pet.dewormed === true
    ) {
      petSearched.push(pet);
    }

    //Case 6: Search by tick sterilized only
    else if (checkSearchOnlyCheckBox
      && vaccinatedInput.checked === false
      && dewormedInput.checked === false
      && sterilizedInput.checked === true
      && pet.sterilized === true
    ) {
      petSearched.push(pet);
    }
  }




  renderTableData(petSearched);
})

//Render pet array
function renderTableData(petArr) {
  tableBodyEl.innerHTML = '';
  for (const pet of petArr) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <tr>
        <th>${pet.id}</th>
        <td>${pet.name}</td>
        <td>${pet.age}</td>
        <td>${pet.type}</td>
        <td>${pet.weight} kg</td>
        <td>${pet.length} cm</td>
        <td>${pet.breed}</td>
        <td><i class="bi bi-square-fill" style={{color: ${pet.color}}}></i></td>
        <td>${pet.vaccinated === true ? `<i class="bi bi-check-circle-fill"></i>` : `<i class="bi bi-x-circle-fill"></i>`}</td >
        <td>${pet.dewormed === true ? `<i class="bi bi-check-circle-fill"></i>` : `<i class="bi bi-x-circle-fill"></i>`}</td>
        <td>${pet.sterilized === true ? `<i class="bi bi-check-circle-fill"></i>` : `<i class="bi bi-x-circle-fill"></i>`}</td>
        <td>${pet.date}</td>
        </td>
        </tr >
        `
    tableBodyEl.appendChild(row);
  }
};