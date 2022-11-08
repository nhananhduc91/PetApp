'use strict';

const importBtn = document.getElementById('import-btn');
const fileContent = document.getElementById("file-content");
importBtn.addEventListener('click', function () {
  const file = document.getElementById("input-file").files[0];
  if (file) {
    let reader = new FileReader();
    reader.readAsText(file, "UTF-8");
    reader.onload = function (e) {
      const petDataImport = e.target.result;
      saveToStorage('petDataImport', petDataImport);
      alert('Data imported successful!');
      window.location.href = ('../index.html');
    }
    reader.onerror = function () {
      fileContent.innerHTML = "error reading file";
    }
  } else {
    alert('No file chosen!')
  }
});

