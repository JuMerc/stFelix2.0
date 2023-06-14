function removePostButtonEventListener(event) {
    const buttonElement = event.target.closest("tr");
    const id = buttonElement.getAttribute('data-id');
    console.log(buttonElement)
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
          const postElement = document.querySelector(`.js-post-table tr[data-id="${id}"]`);
          postElement.remove();
        } else {
          response.json().then(console.log);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
  
  document.addEventListener('DOMContentLoaded', function () {
    // Administration posts remove button listener
    const postRemoveButtonsList = document.querySelectorAll('.js-remove-post-button');
    
    if (postRemoveButtonsList.length > 0) {
        postRemoveButtonsList.forEach(function (postRemoveButton) {
            postRemoveButton.addEventListener('click', removePostButtonEventListener);
        });
    }
});