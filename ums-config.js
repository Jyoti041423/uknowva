var CONFIG = (function() {
    var configLoad;
    var PRODUCTION = Object.freeze({
        SEND_OTP_URL: "https://keycloak-dev.delhivery.com/auth/realms/delhivery-dev/grant-type/passwordless/otp/",
        VERIFY_OTP_URL: "https://keycloak-dev.delhivery.com/auth/realms/delhivery-dev/grant-type/passwordless/otp-verify/",
        TOKEN_NAME: 'darwin_token',
        REFRESH_TOKEN_NAME: 'darwin_refresh_token',
        CLIENT_ID: "UMS Dashboard",
        SCOPE: "email"
    });
    
    
    var DEVELOPMENT = Object.freeze({
        SEND_OTP_URL: "https://keycloak-dev.delhivery.com/auth/realms/delhivery-dev/grant-type/passwordless/otp/",
        VERIFY_OTP_URL: "https://keycloak-dev.delhivery.com/auth/realms/delhivery-dev/grant-type/passwordless/otp-verify/",
        TOKEN_NAME: 'darwin_token',
        REFRESH_TOKEN_NAME: 'darwin_refresh_token',
        CLIENT_ID: "UMS Dashboard",
        SCOPE: "email"
    });
    return DEVELOPMENT;
})();