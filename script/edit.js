'use strict';

//Get elements through DOM
const editForm = document.getElementById('container-form');
const editTableEl = document.getElementById('editTable');

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

//Execute render pet list
let petArr = getFromStorage('petData') ? JSON.parse(getFromStorage('petData')) : [];
let petArrImport = JSON.parse(getFromStorage('petDataImport'));

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
  } else {
    //Replace pet with the same Id
    const index = petArr.findIndex(pet => pet.id === petImport.id)
    petArr[index] = petImport;
  }
}

renderEditTableData(petArr);

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


//Render pet list
function renderEditTableData(petArr) {
  editTableEl.innerHTML = '';
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
        <td><button id="delete-btn" type="button" class="btn btn-warning" onclick="startEditPet('${pet.id}')">Edit</button>
        </td>
        </tr >
        `
    editTableEl.appendChild(row);
  }
};

//Edit pet
function startEditPet(petId) {
  //Show edit form
  editForm.classList.remove('hide');

  //Find pet to edit
  let petEdit = petArr.find(pet => pet.id === petId);

  //Display pet information
  idInput.value = petEdit.id;
  nameInput.value = petEdit.name;
  ageInput.value = petEdit.age;
  typeInput.value = petEdit.type;
  weightInput.value = petEdit.weight;
  lengthInput.value = petEdit.length;
  colorInput.value = petEdit.color;
  renderBreedList();
  breedInput.value = petEdit.breed;
  vaccinatedInput.checked = petEdit.vaccinated;
  dewormedInput.checked = petEdit.dewormed;
  sterilizedInput.checked = petEdit.sterilized;

  //Edit pet
  nameInput.addEventListener('input', function () {
    petEdit.name = nameInput.value;
  });

  ageInput.addEventListener('input', function () {
    petEdit.age = ageInput.value;
  });
  typeInput.addEventListener('input', function () {
    petEdit.type = typeInput.value;
  });
  weightInput.addEventListener('input', function () {
    petEdit.weight = weightInput.value;
  });
  lengthInput.addEventListener('input', function () {
    petEdit.length = lengthInput.value;
  });
  colorInput.addEventListener('input', function () {
    petEdit.color = colorInput.value;
  });
  breedInput.addEventListener('input', function () {
    petEdit.breed = breedInput.value;
  });

  vaccinatedInput.addEventListener('input', function () {
    petEdit.vaccinated = vaccinatedInput.checked;
  });
  dewormedInput.addEventListener('input', function () {
    petEdit.dewormed = dewormedInput.checked;
  });
  sterilizedInput.addEventListener('input', function () {
    petEdit.sterilized = sterilizedInput.checked;
  });

  //Submit edit
  submitBtn.addEventListener('click', function (e) {
    e.preventDefault();

    //Validation input data
    const validation = function (petEdit) {
      let checkValidated = true;
      //Check empty input field
      if (petEdit.name.trim() === '' || petEdit.age === '' || petEdit.type === '' || petEdit.weight === ''
        || petEdit.length === '' || petEdit.color === '' || petEdit.breed === '') {
        checkValidated = false;
        alert('Input field must not be empty!')
      } else {

        //Validate age
        if (petEdit.age < 1 || petEdit.age > 15) {
          checkValidated = false;
          alert('Age must be between 1 and 15');
        }

        //Validate weight
        if (petEdit.weight < 1 || petEdit.weight > 15) {
          checkValidated = false;
          alert('Weight must be between 1 and 15');
        }

        //Validate length
        if (petEdit.length < 1 || petEdit.length > 100) {
          checkValidated = false;
          alert('Length must be between 1 and 15');
        }

        //Validate type
        if (petEdit.type === '') {
          checkValidated = false;
          alert('Please select Type!');
        }

        //Validate breed
        if (petEdit.breed === '') {
          checkValidated = false;
          alert('Please select Breed!');
        }
      }
      return checkValidated;
    }
    if (validation(petEdit)) {
      saveToStorage('petData', JSON.stringify(petArr));
      editForm.classList.add('hide');
      renderEditTableData(petArr);
    };
  });
};


