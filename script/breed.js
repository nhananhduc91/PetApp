'use strict';
const breedIdInput = document.getElementById('breed-id');
const breedAdd = document.getElementById('add-breed');
const submitBreedBtn = document.getElementById('submit-breed');
const typeSelect = document.getElementById('select-type');
const tableBreedEl = document.getElementById('breedTable');

let breedArr = getFromStorage('breedData') ? JSON.parse(getFromStorage('breedData')) : [];
renderBreedTable(breedArr);

//Submit add breed
submitBreedBtn.addEventListener('click', function (e) {
  e.preventDefault();
  const breedData = {
    id: breedIdInput.value,
    name: breedAdd.value,
    type: typeSelect.value
  }
  //validation
  const validationBreedData = function (breedData) {
    let checkValidation = true;
    if (breedData.id.trim() === '' || breedData.name.trim() === '' || breedData.type === '') {
      checkValidation = false;
      alert('Input field must not be empty!');
    } else {
      for (const breed of breedArr) {
        if (breed.id === breedData.id) {
          checkValidation = false;
          alert('Id must be unique!');
        }
      }
    }
    return checkValidation;
  }
  if (validationBreedData(breedData)) {
    breedArr.push(breedData);
    saveToStorage('breedData', JSON.stringify(breedArr));
    clearInput();
    renderBreedTable(breedArr);
  }
  console.log(breedData);
})

//Render breed array
function renderBreedTable(breedArr) {
  tableBreedEl.innerHTML = '';
  for (const breed of breedArr) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <tr>
        <th>${breed.id}</th>
        <td>${breed.name}</td>
        <td>${breed.type}</td>
        <td><button id="delete-btn" type="button" class="btn btn-danger" onclick="deleteBreed('${breed.id}')">Delete</button>
        </td>
        </tr >
        `
    tableBreedEl.appendChild(row);
  }
}

//Remove breed
const deleteBreed = (breedId) => {
  //Confirm before deletePet
  if (confirm(`Are you sure to delete breed ${breedId}?`)) {
    const index = breedArr.findIndex(breed => breed.id === breedId);
    breedArr.splice(index, 1);
    saveToStorage('breedData', JSON.stringify(breedArr));
    renderBreedTable(breedArr);
  }
};

//Clear form after submit
const clearInput = () => {
  breedIdInput.value = '';
  breedAdd.value = '';
  typeSelect.value = '';
}

