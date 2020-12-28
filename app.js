// const { keycloak } = require("./libraries/keycloak.js");

function setTokenExpireTime(time) {
  var d = new Date();
  d.setTime(d.getTime() + time * 1000);
  return d.toUTCString();
}

function sendOtp() {
  var phone_number = document.getElementById('phone_number').value;
  if (!validateMobileNumber(phone_number)) {
    return toastr.error(ERROR_MESSAGES['INVALID_MOBILE_NUMBER']);
  }
  $.ajax({
    type: 'POST',
    url: CONFIG['SEND_OTP_URL'],
    data: JSON.stringify({ phone_number: '+91' + phone_number }),
    success: onOtpSuccess,
    error: onError,
    contentType: 'application/json',
  });
}

function onOtpSuccess(response) {
  if (response && response['success']) {
    toastr.success(response['success']);
    document.getElementById('otp-send-screen').style.display = 'none';
    document.getElementById('verify-otp-screen').style.display = 'block';
  }
}

function onError(xhr, status, error) {
  if (status !== 'error') {
    return;
  }
  var msgDisplay =
    xhr && xhr['responseText'] ? JSON.parse(xhr['responseText']) : '';
  msgDisplay = msgDisplay['error']
    ? msgDisplay['error']
    : ERROR_MESSAGES['OOPS_SOMETHING_WENT_WRONG'];
  toastr.error(msgDisplay);
}

function verifyOtp() {
  var otpNumber = document.getElementById('otp').value;
  var phone_number = document.getElementById('phone_number').value;
  if (!validateMobileNumber(phone_number)) {
    return toastr.error(ERROR_MESSAGES['INVALID_MOBILE_NUMBER']);
  }
  phone_number = '+91' + phone_number;
  var data = {
    phone_number: phone_number,
    otp: otpNumber,
    client_id: CONFIG['CLIENT_ID'],
    scope: CONFIG['SCOPE'],
  };
  $.ajax({
    type: 'POST',
    url: CONFIG['VERIFY_OTP_URL'],
    data: JSON.stringify(data),
    success: onVerifyOtpSuccess,
    error: onError,
    contentType: 'application/json',
  });
}

function onVerifyOtpSuccess(response) {
  if (response && response['access_token']) {
    var token = JSON.parse(
      window.atob(response['access_token'].split('.')[1])
    );
    store(
      CONFIG['TOKEN_NAME'],
      response['access_token'],
      setTokenExpireTime(token['expires_in']),
      getSubDomainName()
    );
    toastr.success(response['success']);
    window.location = 'landing-page.html';
  }
}

function validateMobileNumber() {
  var phone_number = document.getElementById('phone_number').value;
  var mobileRegex = /^\d{10}$/;
  var regmob = new RegExp(mobileRegex);
  if (!regmob.test(phone_number)) {
    document.getElementById('sendOtp').disabled = true;
    return false;
  }
  document.getElementById('sendOtp').disabled = false;
  return true;
}

function checkValidOtp() {
  var otp = document.getElementById('otp').value;
  if (!isNaN(otp) && otp.length > 3) {
    document.getElementById('verifyOtp').disabled = false;
  } else {
    document.getElementById('verifyOtp').disabled = true;
  }
}

function onAuthClick() {
  const url =
    CONFIG['GOOGLE_OAUTH_URL'] +
    '?scope=' +
    CONFIG['GSCOPE'] +
    '&include_granted_scopes=' +
    CONFIG['GINCLUDE_GRANT_SCOPE'] +
    '&response_type=' +
    CONFIG['GRESPONSE_TYPE'] +
    '&state=' +
    CONFIG['GSTATE'] +
    '&redirect_uri=' +
    CONFIG['REDIRECT_URI'] +
    '&client_id=' +
    CONFIG['GCLIENT_ID'];
  window.open(url, '_self');
}

$(window).load(function () {
  var code = getUrlParameter('code');
  if (code) {
    gmailLogin(code);
  }
});

function gmailLogin(code) {
  var details = {
    code: code,
    client_id: CONFIG['GCLIENT_ID'],
    client_secret: CONFIG['GCLIENT_SECRET'],
    redirect_uri: CONFIG['REDIRECT_URI'],
    grant_type: CONFIG['GRANT_TYPE'],
  };

  var formBody = [];
  for (var property in details) {
    var encodedKey = encodeURIComponent(property);
    var encodedValue = encodeURIComponent(details[property]);
    formBody.push(encodedKey + '=' + encodedValue);
  }
  formBody = formBody.join('&');

  $.post(CONFIG['GET_GOOGLE_TOKEN'], formBody, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
    .done(function onSuccess(response) {
      if (response && response['access_token']) {
        store(
          CONFIG['TOKEN_NAME'],
          response['access_token'],
          setTokenExpireTime(response['expires_in']),
          getSubDomainName()
        );
        toastr.success('Signed In Succesfully');
        window.location = 'landing-page.html';
      }
    })
    .error(function onError(xhr, status, error) {
      if (status !== 'error') {
        return;
      }
      var msgDisplay =
        xhr && xhr['responseText'] ? JSON.parse(xhr['responseText']) : '';
      msgDisplay = msgDisplay['error']
        ? msgDisplay['error']
        : ERROR_MESSAGES['OOPS_SOMETHING_WENT_WRONG'];
      toastr.error(msgDisplay);
    });
}

function getUrlParameter(name) {
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
  var results = regex.exec(location.search);
  return results === null
    ? ''
    : decodeURIComponent(results[1].replace(/\+/g, ' '));
}


function initKeycloak() {
  keycloak = new Keycloak({
    url: 'http://keycloak-dev.delhivery.com/auth/',
    realm: 'Delhivery-dev',
    clientId: 'WMS'
  });
  console.log('in keycloak', keycloak)

 keycloak.init({
  onLoad: 'check-sso',
 silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html'
 }).then(function(authenticated) {
     alert(authenticated ? 'authenticated' : 'not authenticated');
 }).catch(function() {
     alert('failed to initialize');
 });
}
