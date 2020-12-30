(function (window, undefined) {
  var Cookies = function () {
    var _instance = this;
    var options = {
      path: "",
      domain: "",
      secure: false,
      expires: "",
    };
    this.getSubDomainName = function () {
      let parts = location.hostname.split(".");
      let subdomain = parts.shift();

      if (!parts.length) {
        return "localhost";
      } else if (subdomain === "127") {
        return "127.0.0.1";
      } else {
        return parts.join(".");
      }
    };

    this.getAbsPath = function (sRelPath) {
      var nUpLn,
        sDir = "";
      const sPath = location.pathname.replace(
        /[^\/]*$/,
        sRelPath.replace(/(\/|^)(?:\.?\/+)+/g, "$1")
      );
      for (
        var nEnd, nStart = 0;
        (nEnd = sPath.indexOf("/v2/", nStart)), nEnd > -1;
        nStart = nEnd + nUpLn
      ) {
        nUpLn = /^\/(?:\.\.\/)*/.exec(sPath.slice(nEnd))[0].length;
        sDir = (sDir + sPath.substring(nStart, nEnd)).replace(
          new RegExp("(?:\\/+[^\\/]*){0," + (nUpLn - 1) / 3 + "}$"),
          "/"
        );
      }
      return sDir;
    };

    this.storeCookie = function (name, value, expiry, domain) {
      var expires = "";
      var cookieValue = "";
      if (expiry) {
        expires = `expires=${expiry}`;
      } else {
        var d = new Date();
        d.setTime(d.getTime() + 24 * 60 * 60 * 1000);
        expires = `expires=${d.toUTCString()}`;
      }

      if (typeof value === "object") {
        cookieValue = JSON.stringify(value);
      } else {
        cookieValue = value;
      }

      document.cookie = `${name}=${cookieValue};path=${_instance.getAbsPath(
        "/"
      )};domain=${domain};${expires};`;
    };

    this.getCookie = function (cookieName) {
      var name = `${cookieName}=`,
        ca = document.cookie.split(";");

      for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === " ") {
          c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
          var cookieValue = c.substring(name.length, c.length);

          try {
            if (JSON.parse(cookieValue)) {
              return JSON.parse(cookieValue);
            }
          } catch (e) {
            return cookieValue;
          }
        }
      }
      return null;
    };

    this.deleteCookie = function (cookieName, domain) {
      if (_instance.getCookie(cookieName)) {
        _instance.storeCookie(cookieName, "", new Date(-1), domain);
      }
    };

    this.setTokenExpireTime = function (time) {
      var d = new Date();
      d.setTime(d.getTime() + time * 1000);
      return d.toUTCString();
    };
  };
  if (
    typeof module === "object" &&
    module &&
    typeof module.exports === "object"
  ) {
    module.exports = Cookies;
  } else {
    window.Cookies = Cookies;
    if (typeof define === "function" && define.amd) {
      define("Cookies", [], function () {
        return Cookies;
      });
    }
  }
})(window);
