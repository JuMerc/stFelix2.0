function removePostButtonEventListener(event) {
    const buttonElement = event.target.parentElement;
    const id = buttonElement.getAttribute('data-id');
  
    const options = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    };
  
    const url = `/brands/${id}`;
  
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
  
  // Ajouter l'event listener à tous les boutons de suppression
  const removeButtons = document.querySelectorAll('.js-remove-post-button');
  removeButtons.forEach(button => {
    button.addEventListener('click', removePostButtonEventListener);
  });