console.log("signin.js running");

let signinBtn = $("#signin");

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
    })
}

signinBtn.on('click', handleSignIn);