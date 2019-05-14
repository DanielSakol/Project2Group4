console.log("query.js running");

let searchBtnFn = function (event) {
    event.preventDefault();
    console.log("search button clicked");
    const queryJSON = {
        queryStr: $("#searchInput").val().trim(),
        uid: sessionStorage.uid
    }
    console.log(queryJSON);

    $.ajax({
        method: "POST",
        url: "/api/query",
        data: queryJSON
    }).then(response => {
        console.log(response);
        // add code here to display response json on page
    }).catch(error => {
        console.log(error);
    })
}

$("#searchBtn").on('click', searchBtnFn);