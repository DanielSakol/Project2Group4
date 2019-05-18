// Get references to page elements
let $exampleText = $('#example-text');
let $exampleDescription = $('#example-description');
let $exampleList = $('#example-list');

let $submitBtn = $('#submitBtn');
let $searchBtn = $("#searchBtn");


// The API object contains methods for each kind of request we'll make
let API = {
  saveExample(example) {
    console.log(example);
    return $.ajax({
      headers: {
        "Content-Type": "application/json"
      },
      type: "POST",
      url: "api/examples",
      data: JSON.stringify(example)
    });
  },
  getExamples() {
    return $.ajax({
      url: "api/examples",
      type: "GET"
    });
  },
  deleteExample(id) {
    return $.ajax({
      url: "api/examples/" + id,
      type: "DELETE"
    });
  },
};

// refreshExamples gets new examples from the db and repopulates the list
let refreshExamples = function () {
  API.getExamples().then((data) => {
    var $examples = data.map(function (example) {
      var $a = $("<a>")
        .text(example.text)
        .attr("href", "/example/" + example.id);

      var $li = $("<li>")
        .attr({
          class: "list-group-item",
          "data-id": example.id
        })
        .append($a);

      var $button = $("<button>")
        .addClass("btn btn-danger float-right delete")
        .text("ｘ");

      $li.append($button);

      return $li;
    });
    $exampleList.empty();
    $exampleList.append($examples);
  });
};

// handleFormSubmit is called whenever we submit a new example
// Save the new example to the db and refresh the list
let handleFormSubmit = function (event) {
  event.preventDefault();

  let example = {
    text: $('#fullName').val().trim(),
    description: $('#inputEmail').val().trim(),
  };

  console.log(example);

  if (!(example.text && example.description)) {
    alert('You must enter an example text and description!');
    return;
  }

  API.saveExample(example).then(() => { refreshExamples(); });

  $exampleText.val('');
  $exampleDescription.val('');
};

// handleDeleteBtnClick is called when an example's delete button is clicked
// Remove the example from the db and refresh the list
let handleDeleteBtnClick = function () {
  let idToDelete = $(this)
    .parent()
    .attr('data-id');

  API.deleteExample(idToDelete).then(() => {
    refreshExamples();
  });
};

// Add event listeners to the submit and delete buttons
$submitBtn.on('click', handleFormSubmit);
$exampleList.on('click', '.delete', handleDeleteBtnClick);

