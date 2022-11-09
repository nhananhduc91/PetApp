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
};

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
}

renderEditTableData(petArr);

//Filter breed by type
let breedList = getFromStorage('breedData') ? JSON.parse(getFromStorage('breedData')) : [{ id: "1", name: "Dog 1", type: "Dog" }, { id: "2", name: "Cat 1", type: "Cat" }];
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
  breedInput.value = petEdit.breed;
  vaccinatedInput.checked = petEdit.vaccinated;
  dewormedInput.checked = petEdit.dewormed;
  sterilizedInput.checked = petEdit.sterilized;
  renderBreedList();

  //Submit edit
  submitBtn.onclick = function updatePet(e) {
    e.preventDefault();

    //Validation input data
    let checkValidated = true;
    //Check empty input field
    if (nameInput.value.trim() === '' || ageInput.value === '' || typeInput.value === '' || weightInput.value === ''
      || lengthInput.value === '' || colorInput.value === '' || breedInput.value === '') {
      checkValidated = false;
      alert('Input field must not be empty!')
    } else {

      //Validate age
      if (ageInput.value < 1 || ageInput.value > 15) {
        checkValidated = false;
        alert('Age must be between 1 and 15');
      }

      //Validate weight
      if (weightInput.value < 1 || weightInput.value > 15) {
        checkValidated = false;
        alert('Weight must be between 1 and 15');
      }

      //Validate length
      if (lengthInput.value < 1 || lengthInput.value > 100) {
        checkValidated = false;
        alert('Length must be between 1 and 15');
      }

      //Validate type
      if (typeInput.value === '') {
        checkValidated = false;
        alert('Please select Type!');
      }

      //Validate breed
      if (breedInput.value === '') {
        checkValidated = false;
        alert('Please select Breed!');
      }
    }

    if (checkValidated) {
      petEdit.name = nameInput.value;
      petEdit.age = ageInput.value;
      petEdit.type = typeInput.value;
      petEdit.weight = weightInput.value;
      petEdit.length = lengthInput.value;
      petEdit.color = colorInput.value;
      petEdit.breed = breedInput.value;
      petEdit.vaccinated = vaccinatedInput.checked;
      petEdit.dewormed = dewormedInput.checked;
      petEdit.sterilized = sterilizedInput.checked;
      saveToStorage('petData', JSON.stringify(petArr));
      editForm.classList.add('hide');
      renderEditTableData(petArr);
    };
  }
};




