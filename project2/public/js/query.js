console.log("query.js running");
const searchForm = $('#searchForm');
searchForm.attr('action', searchForm.attr('action') +'/' +sessionStorage.uid);

$("#searchInput").attr('value', () => {
    const pool = ['864563000231',
        '855531002234',
        '611269206432',
        '049022556003',
        '708971925819',
        '074690025032',
        '725439947954'
    ];
    const idx = Math.floor(Math.random() * pool.length)
    return pool[idx];
});

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
        // window.location="/product";
        console.log(response);
        $("#userForm").addClass("hidden");
        $("#display").removeClass("hidden");
        // empty out the product-name/ingredient 
        // take response and append into product-name/ingredient
        $('#product-name').empty();
        $('#product-name').append(JSON.stringify(response.foods[0].food.desc.name))

        let ingStr = response.foods[0].food.ing.desc;
        let ingArr = ingStr.split(',');
        console.log(ingArr);

        $('#product-ingredient').empty();
        ingArr.forEach(v => {
            $('#product-ingredient').append('<tr><td>' + v + '</td><tr>');
        });
        // for (i = 0; i < ingArr.length; i++) {
        //     $('#product-ingredient').append('<tr><td>' + JSON.stringify(ingArr[i]) + '</td><tr>')
        // }
    }).catch(error => {
        console.log(error);
    })
}

// $("#searchBtn").on('click', searchBtnFn);

