function removeRowEventListener(event, url) {
  const element = event.target.closest("tr") || event.target.closest("fieldset");
  const id = element.getAttribute("data-id");

  const options = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  };

  fetch(url + id, options)
    .then((response) => {
      if (response.ok) {
        element.remove();
      } else {
        response.json().then(console.log);
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

function addEventListeners(selector, url) {
  const elements = document.querySelectorAll(selector);

  elements.forEach((element) => {
    element.addEventListener("click", (event) =>
      removeRowEventListener(event, url)
    );
  });
}

document.addEventListener("DOMContentLoaded", () => {
  addEventListeners(".js-post-table-brand tr[data-id]", "/brand/");
  addEventListeners(".js-post-table-admin tr[data-id]", "/admin/");
  addEventListeners(".js-category button[data-id]", "/category/");
  addEventListeners(".js-benefit button[data-id]", "/benefit/");
  addEventListeners(".js-post-table-schedule tr[data-id]", "/schedule/");
  addEventListeners(".js-post-table-picture tr[data-id]", "/picture/");
});

//Modification d'image du carrousel en appuyant dessu du coté admin
let imageContainers = document.querySelectorAll(".image-container");
imageContainers.forEach(function (container) {
  let img = container.querySelector("img");
  img.addEventListener("click", function () {
    let fileInput = container.querySelector(".file-input");
    fileInput.click();
  });
});

//Dark mode
const togglebuttonDark = document.querySelector(".toggle-checkbox-dark");
const toggleLabel = document.querySelector(".toggle-label-dark");
const toggleHandle = document.querySelector(".toggle-handle-dark");
const body = document.body;
const header = document.querySelector(".header");
const title = document.querySelector(".title");
const footer = document.querySelector(".footer");
const accessibility = document.querySelector(".accessibility");
const dark = document.querySelectorAll(".dark");
const light = document.querySelectorAll(".light");

togglebuttonDark.addEventListener("change", function () {
  body.classList.toggle("dark-mode");
  header.classList.toggle("dark-mode");
  title.classList.toggle("dark-mode");
  footer.classList.toggle("dark-mode");
  accessibility.classList.toggle("dark-mode");
  dark.forEach((item) => item.classList.toggle("dark-mode"));
  light.forEach((item) => item.classList.toggle("dark-mode"));

  if (body.classList.contains("dark-mode")) {
    localStorage.setItem("theme", "dark");
  } else {
    localStorage.setItem("theme", "light");
  }
});
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  body.classList.add("dark-mode");
  header.classList.add("dark-mode");
  title.classList.add("dark-mode");
  footer.classList.add("dark-mode");
  accessibility.classList.add("dark-mode");
  dark.forEach((item) => item.classList.add("dark-mode"));
  light.forEach((item) => item.classList.add("dark-mode"));
  toggleHandle.classList.add("dark-mode");
  toggleHandle.style.left = "29px";
}

//Dyslexic mode
const toggleButtonDys = document.querySelector(".toggle-checkbox-dys");
const elementsToChangeInDysFont = document.querySelectorAll("*:not(i)");

toggleButtonDys.addEventListener("change", function() {
  elementsToChangeInDysFont.forEach((item) => item.classList.toggle("element-with-dys-font"));

  if (Array.from(elementsToChangeInDysFont).some((item) => item.classList.contains("element-with-dys-font"))) {
    localStorage.setItem("font", "dysFont");
  } else {
    localStorage.setItem("font", "normalFont");
  }
});
const savedDysFont = localStorage.getItem("font");
if (savedDysFont === "dysFont") {
  elementsToChangeInDysFont.forEach((item) => item.classList.add("element-with-dys-font"));
}




