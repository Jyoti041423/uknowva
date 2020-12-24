
function googleLogin() {
  console.log("trying to login using google");
}

function setTokenExpireTime(time) {
  var d = new Date();
  d.setTime(d.getTime() + (time * 1000));
  return d.toUTCString();
}

function onSignIn(googleUser) {
  var profile = googleUser.getBasicProfile();
  console.log("ID: " + profile.getId()); // Do not send to your backend! Use an ID token instead.
  console.log("Name: " + profile.getName());
  console.log("Image URL: " + profile.getImageUrl());
  console.log("Email: " + profile.getEmail()); // This is null if the 'email' scope is not present.
}

function sendOtp() {
  var phone_number = document.getElementById("phone_number").value;
  if (!validateMobileNumber(phone_number)) {
    return toastr.error(ERROR_MESSAGES['INVALID_MOBILE_NUMBER']);
  }
  $.ajax({
    type: "POST",
    url: CONFIG['SEND_OTP_URL'],
    data: JSON.stringify({ phone_number: "+91" + phone_number }),
    success: onOtpSuccess,
    error: otpError,
    contentType: "application/json",
  });
}

function onOtpSuccess(response) {
  debugger;
  if (response && response["success"]) {
    toastr.success(response["success"]);
    document.getElementById('otp-send-screen').style.display="none";
    document.getElementById('verify-otp-screen').style.display="block";
  }
}

function otpError(xhr, status, error) {
  if (status !== "error") {
    return;
  }
  var msgDisplay =
    xhr && xhr["responseText"] ? JSON.parse(xhr["responseText"]) : "";
  msgDisplay = msgDisplay["error"]
    ? msgDisplay["error"]
    : ERROR_MESSAGES['OOPS_SOMETHING_WENT_WRONG'];
  toastr.error(msgDisplay);
}

function verifyOtp() {
  var otpNumber = document.getElementById("otp").value;
  var phone_number = document.getElementById("phone_number").value;
  if (!validateMobileNumber(phone_number)) {
    return toastr.error(ERROR_MESSAGES['INVALID_MOBILE_NUMBER']);
  }
  phone_number = "+91" + phone_number;
  var data = {
    phone_number: phone_number,
    otp: otpNumber,
    client_id: CONFIG['CLIENT_ID'],
    scope: CONFIG['SCOPE'],
  };
  $.ajax({
    type: "POST",
    url: CONFIG['VERIFY_OTP_URL'],
    data: JSON.stringify(data),
    success: onVerifyOtpSuccess,
    error: otpError,
    contentType: "application/json",
  });
}

function onVerifyOtpSuccess(response) {
  if (response && response["access_token"]) {
    var token = JSON.parse(window.atob(tokenResponse['access_token'].split('.')[1]));
    store('jd_token', response['access_token'], setTokenExpireTime(token['expires_in']), getSubDomainName());
    toastr.success(response["success"]);
    window.location = 'landing-page.html';
  }
}

function validateMobileNumber() {
  var phone_number = document.getElementById("phone_number").value;
  console.log(phone_number);
  var mobileRegex = /^\d{10}$/;
  var regmob = new RegExp(mobileRegex);
  if (!regmob.test(phone_number)) {
    document.getElementById("sendOtp").disabled = true;
    return false;
  }
  document.getElementById("sendOtp").disabled = false;
  return true;
}

function checkValidOtp() {
  var otp = document.getElementById("otp").value;
  if (!isNaN(otp) && otp.length > 3) {
    document.getElementById("verifyOtp").disabled = false;
  } else {
    document.getElementById("verifyOtp").disabled = true;
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
      console.log('url is', url);
      window.open(url,'_self')
      if(window.location.href!='localhost:8080' && window.location.href.indexOf('&code=')>1){
          const queryString = window.location.search;
          const urlParams = new URLSearchParams(queryString);
          const code = urlParams.get('code')
          console.log(code);
          gmailLogin(code);
      }
      // gmailLogin('4/0AY0e-g4IZYBzINXjovfDlaM9BLvlqrDcmLlpGlszmGGwQhOPlK5pOFwiRMmHweMQJ1n_dA');

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
      
      fetch('https://accounts.google.com/o/oauth2/token',{
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


 function _onSignInCallback(data) {
    console.log(data);
    console.log(window.location.search);
  }


  $(window).load(function() {
    var code = getUrlParameter('code');
    console.log('------');
    console.log(code);
    if (code) {
      gmailLogin(code);
    }
  });


function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

