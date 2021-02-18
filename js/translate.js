// translate.js
function switchTo(lang) {
  $('.tr').each(function () {
    // console.log('hide');
    // console.log(this);
    $(this).css('display', 'none');
  })
  $('.tr.de').each(function () {
    var defaultkey = $(this).attr('class');
    // console.log(defaultkey);
    if (defaultkey.length > 5) {
      var targetkey = '.' + defaultkey.substr(0, 2) + '.' + lang + '.' + defaultkey.substr(6);
      targetkey = targetkey.replace(' ', '.');
      var target = $(targetkey);
    } else {
      target = this;
    }
    var disp = $(target).attr('data-disp');
    // console.log(targetkey + ' show as ' + disp);
    $(target).css('display', disp);
  })

  // save lang
  setCookie('lang', lang, 7);
  update_all_more_less();

  // $('a').each(function () {
  //   // console.log(this.href);
  //   let h = this.href;
  //   let split = h.split('?');
  //   // if (split[1] > 0){
  //   // preserve other params?
  //   // }
  //   let new_href = split[0] + '?lang=' + lang;
  //   // console.log(h + ' -> ' + new_href);
  //   this.href = new_href;
  // });

}

//default
//$(window).on('load', function(){
//  initTranslation();
//});
//     console.log('window.on.load');
function initTranslation() {
  if (isWiki){
  }
  // backup of display attribute
  console.log('initTranslation()');
  $('.tr').each(function () {
    var disp = $(this).css('display');
    $(this).attr('data-disp', disp);
    $(this).css('display', 'none');
    // console.log(this);
    // console.log(disp);
  })

  // click event for language buttons
  $(function () {
    // $('.btn').button()
    $('#de').on('click', function () {
      // console.log('de.click');
      switchTo('de');
    });
    $('#en').on('click', function () {
      switchTo('en');
      // console.log('en.click');
    });
  });

  // get current lang
  var lang = null;
  if (isWiki){
    lang = mw.config.get( 'wgUserLanguage' );
    // console.log('wikiLang=' + lang);
  } else {
    // let url = new URL(document.location.href);
    // lang = url.searchParams.get('lang');
    lang = getCookie('lang');
  }
   if (lang == null || lang == '') {
    lang = 'de'; //default
  }
  console.log('switch to lang: ' + lang);
  $('#' + lang).click().blur();
  switchTo(lang);
};

// https://www.w3schools.com/js/js_cookies.asp
function setCookie(cookie_name, cookie_value, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  var expires = "expires="+d.toUTCString();
  document.cookie = cookie_name + "=" + cookie_value + ";" + expires + ";path=/";
}

function getCookie(cookie_name) {
  var name = cookie_name + "=";
  var ca = document.cookie.split(';');
  for(var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

//   function checkCookie() {
//     var user = getCookie("username");
//     if (user != "") {
//       alert("Welcome again " + user);
//     } else {
//       user = prompt("Please enter your name:", "");
//       if (user != "" && user != null) {
//         setCookie("username", user, 365);
//       }
//     }
//   }
