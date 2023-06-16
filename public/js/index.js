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
  const rowElement = event.target.closest('tr');
  const id = rowElement.getAttribute('data-id');

  const options = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  };
  const url = `/category/${id}`;

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

function removeBenefitRowEventListener(event) {
  const rowElement = event.target.closest('tr');
  const id = rowElement.getAttribute('data-id');

  const options = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  };
  const url = `/benefit/${id}`;

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

function removeAdminRowEventListener(event) {
  const rowElement = event.target.closest('tr');
  const id = rowElement.getAttribute('data-id');

  const options = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  };
  const url = `/admin/${id}`;

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
function removePictureEventListener(event) {
  const divElement = event.target.closest('div');
  const id = divElement.getAttribute('data-id');
  const options = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  };
  const url = `/picture/${id}`;

  fetch(url, options)
    .then(function (response) {
      if (response.ok) {
        // Récupérer la ligne à supprimer
        divElement.remove();
      } else {
        response.json().then(console.log);
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

document.addEventListener('DOMContentLoaded', function () {
  const brandRows = document.querySelectorAll('.js-post-table-brand tr[data-id]');
  const adminRows = document.querySelectorAll('.js-post-table-admin tr[data-id]');
  const categoryRows = document.querySelectorAll('.js-post-table-category tr[data-id]');
  const benefitRows = document.querySelectorAll('.js-post-table-benefit tr[data-id]');
  const galleryPicture = document.querySelectorAll('.js-post-div-picture div[data-id]')
  if (brandRows.length > 0) {
    brandRows.forEach(function (rows) {
      rows.addEventListener('click', removeBrandRowEventListener);
      });
  }
  if (adminRows.length > 0) {
    adminRows.forEach(function (rows) {
      rows.addEventListener('click', removeAdminRowEventListener);
    });
  }
  if (categoryRows.length > 0) {
    categoryRows.forEach(function (rows) {
      rows.addEventListener('click', removeCategoryRowEventListener);
      });
  }
  if (benefitRows.length > 0) {
    benefitRows.forEach(function (rows) {
      rows.addEventListener('click', removeBenefitRowEventListener);
    });
  }
  if (galleryPicture.length > 0) {
    galleryPicture.forEach(function (divs) {
      divs.addEventListener('click', removePictureEventListener);
    });
  }
});