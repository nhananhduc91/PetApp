'use strict';


// Toggle class active when click on navbar
const sidebarTitleEl = document.getElementById('sidebar-title');
const sidebarEl = document.getElementById('sidebar');
sidebarTitleEl.addEventListener('click', function () {
  sidebarEl.classList.toggle('active');
});

//Get elements through DOM
const submitBtn = document.getElementById('submit-btn');
const idInput = document.getElementById('input-id');
const nameInput = document.getElementById('input-name');
const ageInput = document.getElementById('input-age');
const typeInput = document.getElementById('input-type');
const weightInput = document.getElementById('input-weight');
const lengthInput = document.getElementById('input-length');
const colorInput = document.getElementById('input-color');
const breedInput = document.getElementById('input-breed');
const vaccinatedInput = document.getElementById('input-vaccinated');
const dewormedInput = document.getElementById('input-dewormed');
const sterilizedInput = document.getElementById('input-sterilized');
const deleteBtn = document.getElementById('delete-btn');
const tableBodyEl = document.getElementById('tbody');
const healthyBtn = document.getElementById('healthy-btn');

//On load
//Render pet list
let petArr = getFromStorage('petData') ? JSON.parse(getFromStorage('petData')) : [];
renderTableData(petArr);

//Filter breed by type
let breedList = getFromStorage('breedData') ? JSON.parse(getFromStorage('breedData')) : [];
const breedDog = breedList.filter(breed => breed.type === 'Dog');
const breedCat = breedList.filter(breed => breed.type === 'Cat');

//Render breed list by type
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



//Check healthy pets
let healthyCheck = false;

//Submit event
submitBtn.addEventListener('click', function (e) {
  e.preventDefault();
  //Create data object to validate
  const data = {
    id: idInput.value,
    name: nameInput.value,
    age: parseInt(ageInput.value),
    type: typeInput.value,
    weight: weightInput.value,
    length: lengthInput.value,
    color: colorInput.value,
    breed: breedInput.value,
    vaccinated: vaccinatedInput.checked,
    dewormed: dewormedInput.checked,
    sterilized: sterilizedInput.checked,
    date: new Date().toLocaleDateString(),
  }

  //Validation input data
  const validation = function (data) {
    let checkValidated = true;
    //Check empty input field
    if (data.id.trim() === '' || data.name.trim() === '' || data.age === '' || data.type === '' || data.weight === ''
      || data.length === '' || data.color === '' || data.breed === '') {
      checkValidated = false;
      alert('Input field must not be empty!')
    } else {
      //Validate unique Id
      for (const pet of petArr) {
        if (pet.id === data.id) {
          checkValidated = false;
          alert('Id must be unique!');
        }
      }

      //Validate age
      if (data.age < 1 || data.age > 15) {
        checkValidated = false;
        alert('Age must be between 1 and 15');
      }

      //Validate weight
      if (data.weight < 1 || data.weight > 15) {
        checkValidated = false;
        alert('Weight must be between 1 and 15');
      }

      //Validate length
      if (data.length < 1 || data.length > 100) {
        checkValidated = false;
        alert('Length must be between 1 and 15');
      }

      //Validate type
      if (data.type === '') {
        checkValidated = false;
        alert('Please select Type!');
      }

      //Validate breed
      if (data.breed === '') {
        checkValidated = false;
        alert('Please select Breed!');
      }
    }
    return checkValidated;
  }
  if (validation(data)) {
    petArr.push(data);
    saveToStorage('petData', JSON.stringify(petArr));
    clearInput();
    renderTableData(petArr);
  };
});


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
        <td><button id="delete-btn" type="button" class="btn btn-danger" onclick="deletePet('${pet.id}')">Delete</button>
        </td>
        </tr >
        `
    tableBodyEl.appendChild(row);
  }
};


//Remove selected pet with comfirmation
const deletePet = (petId) => {
  //Confirm before deletePet
  if (confirm(`Are you sure to delete pet ${petId}?`)) {
    const index = petArr.findIndex(pet => pet.id === petId);
    petArr.splice(index, 1);
    saveToStorage('petData', JSON.stringify(petArr));
    renderTableData(petArr);
  }
};


//Clear form after submit
const clearInput = () => {
  idInput.value = '';
  nameInput.value = '';
  ageInput.value = '';
  typeInput.value = '';
  weightInput.value = '';
  lengthInput.value = '';
  colorInput.value = '#000000';
  breedInput.value = '';
  vaccinatedInput.checked = false;
  dewormedInput.checked = false;
  sterilizedInput.checked = false;
}

//Toggle healthy pets and all pets
healthyBtn.addEventListener('click', function () {
  if (!healthyCheck) {
    healthyBtn.textContent = 'Show Healthy Pets';
    const healthyPetArr = petArr.filter(pet => pet.vaccinated && pet.dewormed && pet.sterilized);
    renderTableData(healthyPetArr);
    healthyCheck = true;
  } else {
    healthyBtn.textContent = 'Show All Pets';
    renderTableData(petArr);
    healthyCheck = false;
  }
});

