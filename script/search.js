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


//Get pet list
let petArr = getFromStorage('petData') ? JSON.parse(getFromStorage('petData')) : [];
let petArrImport = JSON.parse(getFromStorage('petDataImport')) || [];

//Check if any item of import array is unique
function checkUniqueIdImport(petId) {
  let checkUniqueId = true;
  for (let pet of petArr) {
    if (pet.id === petId) {
      checkUniqueId = false;
    }
  }
  return checkUniqueId;
}

//If unique, add to petArr
for (let petImport of petArrImport) {
  if (checkUniqueIdImport(petImport.id)) {
    petArr.push(petImport);
    saveToStorage('petData', JSON.stringify(petArr));
    removeFromStorage('petDataImport');
  } else {
    //Replace pet with the same Id
    const index = petArr.findIndex(pet => pet.id === petImport.id)
    petArr[index] = petImport;
    saveToStorage('petData', JSON.stringify(petArr));
    removeFromStorage('petDataImport');
  }
};

renderTableData(petArr);

//Filter breed by type
let breedList = getFromStorage('breedData') ? JSON.parse(getFromStorage('breedData')) : [{ id: "1", name: "Dog 1", type: "Dog" }, { id: "2", name: "Cat 1", type: "Cat" }];
const breedDog = breedList.filter(breed => breed.type === 'Dog');
const breedCat = breedList.filter(breed => breed.type === 'Cat');

//Render breed list

function renderBreedListByType(type) {
  breedInput.innerHTML = '';
  for (let breed of type) {
    const option = document.createElement('option');
    option.innerHTML = breed.name;
    breedInput.appendChild(option);
  }
}

function renderBreedList() {
  if (typeInput.value === 'Dog') {
    renderBreedListByType(breedDog);
  }
  if (typeInput.value === 'Cat') {
    renderBreedListByType(breedCat);
  }
};

typeInput.addEventListener('input', renderBreedList);


//Submit find pet
findBtn.addEventListener('click', function () {
  let petSearched = [];
  //Condition when user not input name, type, id, breed
  const checkSearchOnlyCheckBox =
    idInput.value.trim() === ''
    && nameInput.value.trim() === ''
    && typeInput.value === ''
    && breedInput.value === '';

  //Condition when user input name, type, id, breed
  const checkSearchIncludeCheckBox = function (pet) {
    return pet.id.includes(idInput.value.trim())
      && pet.name.toLowerCase().includes(nameInput.value.trim().toLowerCase())
      && pet.type.includes(typeInput.value)
      && pet.breed.includes(breedInput.value)
  };

  //Loop array and have 9 cases for user to choose
  for (const pet of petArr) {
    //Case 1: Search by id, name, type, breed, no tick checkbox
    if (checkSearchIncludeCheckBox(pet)
      && vaccinatedInput.checked === false
      && dewormedInput.checked === false
      && sterilizedInput.checked === false
    ) {
      petSearched.push(pet);
    }

    //Case 2: Search by id, name, type, breed, and tick checkbox exactly
    else if (checkSearchIncludeCheckBox(pet)
      && vaccinatedInput.checked === pet.vaccinated
      && dewormedInput.checked === pet.dewormed
      && sterilizedInput.checked === pet.sterilized
    ) {
      petSearched.push(pet);
    }

    //Case 3: Search by tick vaccinated and dewormed and sterilized
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

    //Case 4: Search by tick vaccinated and dewormed
    else if (checkSearchOnlyCheckBox
      && vaccinatedInput.checked === true
      && pet.vaccinated === true
      && dewormedInput.checked === true
      && pet.dewormed === true
      && sterilizedInput.checked === false
    ) {
      petSearched.push(pet);
    }

    //Case 5: Search by tick vaccinated and sterilized
    else if (checkSearchOnlyCheckBox
      && vaccinatedInput.checked === true
      && pet.vaccinated === true
      && sterilizedInput.checked === true
      && pet.sterilized === true
      && dewormedInput.checked === false
    ) {
      petSearched.push(pet);
    }

    //Case 6: Search by tick dewormed and sterilized
    else if (checkSearchOnlyCheckBox
      && dewormedInput.checked === true
      && pet.dewormed === true
      && sterilizedInput.checked === true
      && pet.sterilized === true
      && vaccinatedInput.checked === false
    ) {
      petSearched.push(pet);
    }

    //Case 7: Search by tick vaccinated only
    else if (checkSearchOnlyCheckBox
      && vaccinatedInput.checked === true
      && dewormedInput.checked === false
      && sterilizedInput.checked === false
      && pet.vaccinated === true
    ) {
      petSearched.push(pet);
    }

    else if (checkSearchOnlyCheckBox
      && vaccinatedInput.checked === true
      && dewormedInput.checked === false
      && sterilizedInput.checked === false
      && pet.vaccinated === true
    ) {
      petSearched.push(pet);
    }

    //Case 8: Search by tick dewormed only
    else if (checkSearchOnlyCheckBox
      && vaccinatedInput.checked === false
      && dewormedInput.checked === true
      && sterilizedInput.checked === false
      && pet.dewormed === true
    ) {
      petSearched.push(pet);
    }

    //Case 9: Search by tick sterilized only
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
        <td><i class="bi bi-square-fill" style="color: ${pet.color};"></i></td>
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