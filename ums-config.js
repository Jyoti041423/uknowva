var CONFIG = (function() {
    var PRODUCTION = Object.freeze({
        SEND_OTP_URL: 'https://key-cloak.delhivery.com/auth/realms/delhivery-dev/grant-type/passwordless/otp/',
        VERIFY_OTP_URL: 'https://key-cloak.delhivery.com/auth/realms/delhivery-dev/grant-type/passwordless/otp-verify/',
        GET_GOOGLE_TOKEN : 'https://accounts.google.com/o/oauth2/token',
        GOOGLE_OAUTH_URL : 'https://accounts.google.com/o/oauth2/v2/auth',
        GCLIENT_ID : '645266032061-ftv2h7qcdu1100o1gf8iu82n8src10jr.apps.googleusercontent.com',
        GCLIENT_SECRET : 'YHkf9WQ4bhm2n0tk3maWHkwQ',
        TOKEN_NAME: 'uknowva_token',
        REFRESH_TOKEN_NAME: 'uknowva_refresh_token',
        CLIENT_ID: 'UMS Dashboard',
        SCOPE: 'email',
        REDIRECT_URI : 'http://localhost:8080',
        GSCOPE : 'https://www.googleapis.com/auth/gmail.readonly',
        GINCLUDE_GRANT_SCOPE : true,
        GRESPONSE_TYPE :'code',
        GSTATE : 'state_parameter_passthrough_value',
        GRANT_TYPE: 'authorization_code',
        RESEND_OTP_SEND_TIMER: 20
    });
     
    var DEVELOPMENT = Object.freeze({
        SEND_OTP_URL: 'https://keycloak-dev.delhivery.com/auth/realms/delhivery-dev/grant-type/passwordless/otp/',
        VERIFY_OTP_URL: 'https://keycloak-dev.delhivery.com/auth/realms/delhivery-dev/grant-type/passwordless/otp-verify/',
        GET_GOOGLE_TOKEN : 'https://accounts.google.com/o/oauth2/token',
        GOOGLE_OAUTH_URL : 'https://accounts.google.com/o/oauth2/v2/auth',
        GCLIENT_ID : '645266032061-ftv2h7qcdu1100o1gf8iu82n8src10jr.apps.googleusercontent.com',
        GCLIENT_SECRET : 'YHkf9WQ4bhm2n0tk3maWHkwQ',
        TOKEN_NAME: 'uknowva_token',
        REFRESH_TOKEN_NAME: 'uknowva_refresh_token',
        CLIENT_ID: 'UMS Dashboard',
        SCOPE: 'email',
        REDIRECT_URI : 'http://localhost:8080/',
        GSCOPE : 'https://www.googleapis.com/auth/gmail.readonly',
        GINCLUDE_GRANT_SCOPE : true,
        GRESPONSE_TYPE :'code',
        GSTATE : 'state_parameter_passthrough_value',
        GRANT_TYPE: 'authorization_code',
        RESEND_OTP_SEND_TIMER: 20
    });
    return DEVELOPMENT;
})();