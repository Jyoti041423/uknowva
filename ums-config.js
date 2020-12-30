var CONFIG = (function() {
    var PRODUCTION = Object.freeze({
        SEND_OTP_URL: 'https://key-cloak.delhivery.com/auth/realms/delhivery-dev/grant-type/passwordless/otp/',
        VERIFY_OTP_URL: 'https://key-cloak.delhivery.com/auth/realms/delhivery-dev/grant-type/passwordless/otp-verify/',
        TOKEN_NAME: 'uknowva_token',
        REFRESH_TOKEN_NAME: 'uknowva_refresh_token',
        ID_TOKEN_NAME: 'uknowva_id_token',
        CLIENT_ID: 'UMS Dashboard',
        SCOPE: 'email',
        REDIRECT_URI : 'http://localhost:8080',
        MOBILE_PREFIX: "+91",
        RESEND_OTP_SEND_TIMER: 20,
        KEYCLOAK_CONFIG: {
            url: "https://key-cloak.delhivery.com/auth/",
            realm: "delhivery",
            clientId: "dlvhrms",
            redirectUri: "http://localhost:8080"
        },
        KEYCLOAK_INIT: {
            onLoad: "login-required",
            flow: "implicit"
        },
        LANDING_PAGE: "landing-page.html"
    });
     
    var DEVELOPMENT = Object.freeze({
        SEND_OTP_URL: 'https://key-cloak.delhivery.com/auth/realms/delhivery/grant-type/passwordless/otp/',
        VERIFY_OTP_URL: 'https://key-cloak.delhivery.com/auth/realms/delhivery/grant-type/passwordless/otp-verify/',
        TOKEN_NAME: 'uknowva_token',
        REFRESH_TOKEN_NAME: 'uknowva_refresh_token',
        ID_TOKEN_NAME: 'uknowva_id_token',
        CLIENT_ID: 'UMS Dashboard',
        SCOPE: 'email',
        REDIRECT_URI : 'http://localhost:8080/',
        RESEND_OTP_SEND_TIMER: 20,
        MOBILE_PREFIX: "+91",
        KEYCLOAK_CONFIG: {
            url: "https://keycloak-dev.delhivery.com/auth/",
            realm: "delhivery-dev",
            clientId: "dlvhrms",
            redirectUri: "http://localhost:8080", 
        },
        LANDING_PAGE: "landing-page.html",
        KEYCLOAK_INIT: {
            onLoad: "login-required",
            flow: "implicit"
        }
    });
    return DEVELOPMENT;
})();