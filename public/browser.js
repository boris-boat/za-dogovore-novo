function itemTemplate(item) {
  return `<li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
  <span class="item-text">${item.text}</span>
  <div>
  <button data-id="${item._id}" class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
  <button data-id="${item._id}" class="delete-me btn btn-danger btn-sm">Delete</button>
  </div>
  </li>`;
}

// Initial Page Load Render
let ourHTML = items
  .map(function (item) {
    return itemTemplate(item);
  })
  .join("");
document.getElementById("item-list").insertAdjacentHTML("beforeend", ourHTML);

// Create Feature
let createField = document.getElementById("create-field");

document.getElementById("create-form").addEventListener("submit", function (e) {
  e.preventDefault();
  axios
    .post("/create-item", { text: createField.value })
    .then(function (response) {
      // Create the HTML for a new item
      document
        .getElementById("item-list")
        .insertAdjacentHTML("beforeend", itemTemplate(response.data));
      createField.value = "";
      createField.focus();
    })
    .catch(function () {
      console.log("Please try again later.");
    });
});

document.addEventListener("click", (e) => {
  //delete feautre
  if (e.target.classList.contains("delete-me")) {
    if (confirm("Do you really want to delete this item")) {
      axios
        .post("/delete-item", { id: e.target.getAttribute("data-id") })
        .then(() => {
          e.target.parentElement.parentElement.remove();
        })
        .catch(() => {
          console.log("erorr u delete formi");
        });
    }
  }
  //update feature
  if (e.target.classList.contains("edit-me")) {
    let userInput = prompt(
      "Enter you desired new text",
      e.target.parentElement.parentElement.querySelector(".item-text").innerHTML
    );
    //axios je da moze da se postuje on the fly bez refresha,2 para:gde ide i sta salje.vraca promise i onda ide then
    if (userInput) {
      axios
        .post("/update-item", {
          text: userInput,
          id: e.target.getAttribute("data-id"),
        })
        .then(() => {
          e.target.parentElement.parentElement.querySelector(
            ".item-text"
          ).innerHTML = userInput;
        })
        .catch(() => {
          console.log("erorr u apdejt formi");
        });
    }
  }
});
