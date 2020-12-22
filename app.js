function checkValidation(){
    var x = document.forms["loginForm"]["uname"].value;
    var y = document.forms["loginForm"]["password"].value;
    
    if (document.getElementById('uname').value == '' && 
        document.getElementById('password').value == '' ){
      return true
    }
    else{
        return false;
    }
}

function login(){
    var details = {
        'userName': document.forms["loginForm"]["uname"].value ,
        'password': document.forms["loginForm"]["password"].value,
        'grant_type': 'password',
        'client_id' : 'adhoc dashboard',
        'scope' : 'openid'
    };

    var formBody = [];
    for (var property in details) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(details[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");
    
    fetch('https://key-cloak.delhivery.com/auth/realms/delhivery/protocol/openid-connect/token',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formBody
    }).then((reponse) => {
        console.log('result is here' , reponse);
    }).catch((error) => {
        console.log('error is here' , error);
    })
}


function googleLogin(){
    console.log('trying to login using google')
}


function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
  }