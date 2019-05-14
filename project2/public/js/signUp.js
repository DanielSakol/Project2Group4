console.log("signUp.js running");
sessionStorage.setItem("uid", null);

let handleSignUp = function (event) {
    event.preventDefault();
    console.log("sign-up requested");
    console.log($("#fullName").val().trim());
    console.log($("#userName").val().trim());
    console.log($("#userEmail").val().trim());
    console.log($("#userPswd").val().trim());

    $.ajax({
        url: "/api/signup",
        method: "POST",
        // has to be an object named data
        data: {
            fullName: $("#fullName").val().trim(),
            userName: $("#userName").val().trim(),
            userEmail: $("#userEmail").val().trim(),
            userPswd: $("#userPswd").val().trim()
        }
    }).then(response => {
        console.log('response received.');
        console.log(response);
        // console.log(response.uid);
        if (response.uid) {
            sessionStorage.setItem("uid", response.uid);
        } else {
            sessionStorage.setItem("uid", null);
        }
    })
}

$("#signUp").on('click', handleSignUp);