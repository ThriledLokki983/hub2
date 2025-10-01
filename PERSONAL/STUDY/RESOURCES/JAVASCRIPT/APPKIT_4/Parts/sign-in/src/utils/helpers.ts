export function getCookie(user: any) {
    var cookieArr = document.cookie.split(";");
    for(var i = 0; i < cookieArr.length; i++) {
        var cookiePair = cookieArr[i].split("=");
        if(user == cookiePair[0].trim()) {
            return decodeURIComponent(cookiePair[1]);
        }
    }
    return null;
}

export function setCookie(name: any,value: any, days: any) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

export function checkCookie() {
  var csrfToken = getCookie("csrftoken");
  const sessionId = getCookie("sessionid")
  if (csrfToken && sessionId ) {
    return
  }else {
    window.location.href = 'http://localhost:8000/_/login/signin'
  }
}
