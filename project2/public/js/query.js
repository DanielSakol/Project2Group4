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
        // empty out the product-name/ingredient 
        // take response and append into product-name/ingredient
        $('#product-name').empty(); 
        $('#product-name').append(JSON.stringify(response.foods[0].food.desc.name))

        let ingStr=response.foods[0].food.ing.desc;
        let ingArr=ingStr.split(',');
        console.log(ingArr);
        
        $('#product-ingredient').empty();
        for (i = 0; i < ingArr.length; i++) {
        $('#product-ingredient').append('<tr><td>' + JSON.stringify(ingArr[i]) + '</td><tr>')
        }
        

  


    }).catch(error => {
        console.log(error);
    })
}

$("#searchBtn").on('click', searchBtnFn);

