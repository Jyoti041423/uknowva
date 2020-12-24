var options = {
    path: '',
    domain: '',
    secure: false,
    expires: ''
  };

function getSubDomainName() {
    let parts = location.hostname.split('.');
    let subdomain = parts.shift();

    if (!parts.length) {
        return 'localhost';
    } else if (subdomain === '127') {
        return '127.0.0.1';
    } else {
        return parts.join('.');
    }
}

function getAbsPath(sRelPath) {
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
}

function store(name, value, expiry, domain) {
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

  document.cookie = `${name}=${cookieValue};path=${this.getAbsPath(
    "/"
  )};domain=${domain};${expires};`;
}

function get(cookieName) {
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
}


function del(cookieName, domain) {
  if (this.get(cookieName)) {
    this.store(cookieName, "", new Date(-1), domain);
  }
}
