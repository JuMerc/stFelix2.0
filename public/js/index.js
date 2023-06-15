function removeBrandRowEventListener(event) {
  const rowElement = event.target.closest('tr');
  const id = rowElement.getAttribute('data-id');

  const options = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  };
  const url = `/brand/${id}`;

  fetch(url, options)
    .then(function (response) {
      if (response.ok) {
        // Récupérer la ligne à supprimer
        rowElement.remove();
      } else {
        response.json().then(console.log);
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

function removeCategoryRowEventListener(event) {
  
}

function removeBenefitRowEventListener(event) {
  
}

document.addEventListener('DOMContentLoaded', function () {
  // Administration posts remove button listener
  const rows = document.querySelectorAll('.js-post-table-brand tr[data-id]');
  
  if (rows.length > 0) {
      rows.forEach(function (row) {
          row.addEventListener('click', removeBrandRowEventListener);
      });
  }
});