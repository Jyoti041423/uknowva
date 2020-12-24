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

function signIn(){
    var oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';
    var form = document.createElement('form');
    form.setAttribute('method', 'GET');
    form.setAttribute('action', oauth2Endpoint);
  
    var params = {'client_id': '645266032061-ftv2h7qcdu1100o1gf8iu82n8src10jr.apps.googleusercontent.com',
                  'redirect_uri': 'localhost:8080',
                  'response_type': 'token',
                  'scope': 'https://www.googleapis.com/auth/drive.metadata.readonly',
                  'include_granted_scopes': 'true',
                  'state': 'pass-through value'
                 };
  
    for (var p in params) {
      var input = document.createElement('input');
      input.setAttribute('type', 'hidden');
      input.setAttribute('name', p);
      input.setAttribute('value', params[p]);
      form.appendChild(input);
    }
  
    document.body.appendChild(form);
    form.submit().then((response)=>{
      console.log('form response', response);
    }).then((error)=>{
      console.log('form error', error);
    });
}

function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    console.log('profile of userrr', profile);
    document.cookie = "user_profile ="+ profile
  }


  function onAuthClick(){
      const url ='https://accounts.google.com/o/oauth2/v2/auth?scope=https://www.googleapis.com/auth/gmail.readonly&'
                  +'include_granted_scopes=true&response_type=code&state=state_parameter_passthrough_value&'
                  +'redirect_uri=http://localhost:8080&client_id=645266032061-ftv2h7qcdu1100o1gf8iu82n8src10jr.apps.googleusercontent.com'
       window.open(url,'_self')
    }

    window.onload= function(){
        if(window.location.href.indexOf('code')>1){
        const code = new URLSearchParams(window.location.search).get('code');
        console.log('code is here', code)
        gmailLogin(code);
        }
    }

    function gmailLogin(code) {
        var details = {
            'code': code,
            'client_id':'645266032061-ftv2h7qcdu1100o1gf8iu82n8src10jr.apps.googleusercontent.com',
            'client_secret':'YHkf9WQ4bhm2n0tk3maWHkwQ',
            'redirect_uri': 'http://localhost:8080',
            'grant_type':'authorization_code'
        };
    
        var formBody = [];
        for (var property in details) {
          var encodedKey = encodeURIComponent(property);
          var encodedValue = encodeURIComponent(details[property]);
          formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");

       $.post("https://accounts.google.com/o/oauth2/token", 
        formBody,{headers: { 'Content-Type': 'application/x-www-form-urlencoded' }},
           ).done(function(result1){
           console.log('result 1', result1.access_token)
           document.cookie = "access_token=" + result1.access_token;
          })
    }