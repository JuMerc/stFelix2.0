function removeRowEventListener(event, url) {
  const element = event.target.closest('tr');
  const id = element.getAttribute('data-id');

  const options = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  fetch(url + id, options)
    .then(response => {
      if (response.ok) {
        element.remove();
      } else {
        response.json().then(console.log);
      }
    })
    .catch(err => {
      console.log(err);
    });
}

function addEventListeners(selector, url) {
  const elements = document.querySelectorAll(selector);

  elements.forEach(element => {
    element.addEventListener('click', event => removeRowEventListener(event, url));
  });
}

document.addEventListener('DOMContentLoaded', () => {
  addEventListeners('.js-post-table-brand tr[data-id]', '/brand/');
  addEventListeners('.js-post-table-admin tr[data-id]', '/admin/');
  addEventListeners('.js-post-table-category tr[data-id]', '/category/');
  addEventListeners('.js-post-table-benefit tr[data-id]', '/benefit/');
  addEventListeners('.js-post-table-schedule tr[data-id]', '/schedule/');
  addEventListeners('.js-post-table-picture tr[data-id]', '/picture/');
});

let imageContainers = document.querySelectorAll('.image-container');
imageContainers.forEach(function(container) {
  let img = container.querySelector('img');
  img.addEventListener('click', function() {
    let fileInput = container.querySelector('.file-input');
    fileInput.click();
  });
});

