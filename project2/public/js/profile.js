console.log("profile.js running");

if (!sessionStorage.uid || sessionStorage.uid === 'null') {
    console.log("no signed-in user");
    $("#displayName").text("Sign in to see your profile");
}
else {
    const queryJSON = {
        uid: sessionStorage.uid
    };
    $.ajax({
        method: "POST",
        url: "/api/history",
        data: queryJSON
    }).then(response => {
        // console.log(response[0].dataNDBNO);
        console.log(response);
        $("#displayName").text("Hello " + response.fullName);
        let row;
        response.history.forEach(itm => {
            row = $('<tr>');
            row.append($('<td>').text(itm));
            row.appendTo($("#tbody"));
        });
    })
}

// const showProfile = function (event) {
//     event.preventDefault();
//     console.log("profile Icon clicked");
//     if (!sessionStorage.uid || sessionStorage.uid === 'null') {
//         console.log("no signed-in user");
//         $("#displayName").text("Sign in to see your profile");
//     } else {
//         const queryJSON = {
//             uid: sessionStorage.uid
//         };
//         $.ajax({
//             method: "POST",
//             url: "/api/profile",
//             data: queryJSON
//         }).then(response => {
//             console.log(response);
//         })
//     }
// }

// $("#profileIcon").on("click", showProfile);