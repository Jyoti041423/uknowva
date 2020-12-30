(function (window, undefined) {
  var MainApp = function () {
    var _instance = this;

    this.sendOtp = function () {
      var phone_number = document.getElementById("phone_number").value;
      if (!_instance.validateMobileNumber(phone_number)) {
        return toastr.error(ERROR_MESSAGES["INVALID_MOBILE_NUMBER"]);
      }
      $.ajax({
        type: "POST",
        url: CONFIG["SEND_OTP_URL"],
        data: JSON.stringify({
          phone_number: CONFIG["MOBILE_PREFIX"] + phone_number,
        }),
        success: _instance.onOtpSuccess,
        error: _instance.onError,
        contentType: "application/json",
      });
    };

    this.onOtpSuccess = function (response) {
      if (response && response["success"]) {
        toastr.success(response["success"]);
        document.getElementById("otp-send-screen").style.display = "none";
        document.getElementById("verify-otp-screen").style.display = "block";

        // resend otp functionality
        _instance.enableResendOtpOption();
      }
    };

    this.onError = function (xhr, status, error) {
      if (status !== "error") {
        return;
      }
      var msgDisplay =
        xhr && xhr["responseText"] ? JSON.parse(xhr["responseText"]) : "";
      msgDisplay = msgDisplay["error"]
        ? msgDisplay["error"]
        : ERROR_MESSAGES["OOPS_SOMETHING_WENT_WRONG"];
      toastr.error(msgDisplay);
    };

    this.verifyOtp = function () {
      var otpNumber = document.getElementById("otp").value;
      var phone_number = document.getElementById("phone_number").value;
      if (!_instance.validateMobileNumber(phone_number)) {
        return toastr.error(ERROR_MESSAGES["INVALID_MOBILE_NUMBER"]);
      }
      phone_number = CONFIG["MOBILE_PREFIX"] + phone_number;
      var data = {
        phone_number: phone_number,
        otp: otpNumber,
        client_id: CONFIG["CLIENT_ID"],
        scope: CONFIG["SCOPE"],
      };
      $.ajax({
        type: "POST",
        url: CONFIG["VERIFY_OTP_URL"],
        data: JSON.stringify(data),
        success: _instance.onVerifyOtpSuccess,
        error: _instance.onError,
        contentType: "application/json",
      });
    };

    this.onVerifyOtpSuccess = function (response) {
      if (response && response["access_token"]) {
        var token = JSON.parse(
          window.atob(response["access_token"].split(".")[1])
        );
        cookies.storeCookie(
          CONFIG["TOKEN_NAME"],
          response["access_token"],
          cookies.setTokenExpireTime(token["expires_in"]),
          cookies.getSubDomainName()
        );
        cookies.storeCookie(
          CONFIG["REFRESH_TOKEN_NAME"],
          response["refresh_token"],
          cookies.setTokenExpireTime(token["expires_in"]),
          cookies.getSubDomainName()
        );

        toastr.success(response["success"]);
        window.location = CONFIG["LANDING_PAGE"];
      }
    };

    this.validateMobileNumber = function () {
      var phone_number = document.getElementById("phone_number").value;
      var mobileRegex = /^\d{10}$/;
      var regmob = new RegExp(mobileRegex);
      if (!regmob.test(phone_number)) {
        document.getElementById("sendOtp").disabled = true;
        return false;
      }
      document.getElementById("sendOtp").disabled = false;
      return true;
    };

    this.checkValidOtp = function () {
      var otp = document.getElementById("otp").value;
      if (!isNaN(otp) && otp.length > 3) {
        document.getElementById("verifyOtp").disabled = false;
      } else {
        document.getElementById("verifyOtp").disabled = true;
      }
    };

    this.checkAuthenticated = function () {
      var id_token = _instance.getHashSegment("id_token");
      var access_token = _instance.getHashSegment("access_token");
      var expires_in = _instance.getHashSegment("expires_in");
      if (id_token && access_token && expires_in) {
        cookies.storeCookie(
          CONFIG["TOKEN_NAME"],
          access_token,
          cookies.setTokenExpireTime(expires_in),
          cookies.getSubDomainName()
        );

        cookies.storeCookie(
          CONFIG["ID_TOKEN_NAME"],
          id_token,
          cookies.setTokenExpireTime(expires_in),
          cookies.getSubDomainName()
        );
        window.location = CONFIG["LANDING_PAGE"];
        return;
      }
      // checking for cookies
      id_token = cookies.getCookie(CONFIG["ID_TOKEN_NAME"]);
      access_token = cookies.getCookie(CONFIG["TOKEN_NAME"]);
      var refresh_token = cookies.getCookie(CONFIG["REFRESH_TOKEN_NAME"]);
      if (access_token && (id_token || refresh_token)) {
        window.location = CONFIG["LANDING_PAGE"];
      }
    };

    this.getUrlParameter = function (name) {
      name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
      var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
      var results = regex.exec(location.search);
      return results === null
        ? ""
        : decodeURIComponent(results[1].replace(/\+/g, " "));
    };

    this.getHashSegment = function (name) {
      var hashSegment = window.location.href.split("#").pop();
      name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
      var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
      var results = regex.exec(hashSegment);
      return results === null
        ? ""
        : decodeURIComponent(results[1].replace(/\+/g, " "));
    };

    this.enableResendOtpOption = function () {
      var timeleft = CONFIG["RESEND_OTP_SEND_TIMER"];
      document.getElementById("resend-otp").style.display = "block";
      var downloadTimer = setInterval(function () {
        if (timeleft <= 0) {
          clearInterval(downloadTimer);
          document.getElementById("countdown").innerHTML =
            HTML_TEXT["RESEND_OTP_TEXT"];
        } else {
          document.getElementById("countdown").innerHTML = HTML_TEXT[
            "OTP_RETRY_TEXT"
          ].replace("{{timeleft}}", timeleft);
        }
        timeleft -= 1;
      }, 1000);
    };

    this.initKeycloak = function () {
      var id_token = _instance.getUrlParameter("id_token");
      var access_token = _instance.getUrlParameter("access_token");
      var id_token = _instance.getHashSegment("id_token");
      var access_token = _instance.getHashSegment("access_token");
      var expires_in = _instance.getHashSegment("expires_in");
      keycloak.init(CONFIG["KEYCLOAK_INIT"]);

      if (access_token && expires_in) {
        keycloak.token = access_token;

        cookies.storeCookie(
          CONFIG["TOKEN_NAME"],
          access_token,
          cookies.setTokenExpireTime(expires_in),
          cookies.getSubDomainName()
        );
      }
    };

    this.keycloakLogin = function () {
      _instance.initKeycloak();
    };

    this.logout = function () {
      cookies.deleteCookie(CONFIG["TOKEN_NAME"], cookies.getSubDomainName());
      cookies.deleteCookie(
        CONFIG["REFRESH_TOKEN_NAME"],
        cookies.getSubDomainName()
      );
      cookies.deleteCookie(CONFIG["ID_TOKEN_NAME"], cookies.getSubDomainName());
      keycloak.clearToken();
      window.location.href = "index.html";
    };
  };

  if (
    typeof module === "object" &&
    module &&
    typeof module.exports === "object"
  ) {
    module.exports = MainApp;
  } else {
    window.MainApp = MainApp;
    if (typeof define === "function" && define.amd) {
      define("MainApp", [], function () {
        return MainApp;
      });
    }
  }
})(window);

$(window).load(function () {
  keycloak = new Keycloak(CONFIG["KEYCLOAK_CONFIG"]);
  cookies = new Cookies();
  MainApp = new MainApp();
});
