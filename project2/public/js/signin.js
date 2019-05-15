console.log("signIn.js running");

// sessionStorage.setItem("uid", null);

let handleSignIn = function (event) {
    event.preventDefault();
    console.log("sign-in requested");
    console.log($("#userEmail").val().trim());
    console.log($("#userPassword").val().trim());
    $.ajax({
        url: "/api/signin",
        method: "POST",
        // has to be a data object
        data: {
            email: $("#userEmail").val().trim(),
            password: $("#userPassword").val().trim()
        }
    }).then(response => {
        console.log(response);
        if (response.uid) {
            sessionStorage.setItem("uid", response.uid);
        } else {
            sessionStorage.setItem("uid", null);
        }
    })
}

$("#signIn").on('click', handleSignIn);