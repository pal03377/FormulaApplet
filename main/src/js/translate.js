"use strict";

import $ from "jquery";
import {
  domLoad
} from "./dom.js";

async function switchTo(lang) {
  await domLoad;
  console.log('switch to ' + lang);
  formulaAppletLanguage.set(lang);
  $(".tr").css("display", "none");
  // $(".tr." + lang).css("display", "initial");
  $(".tr." + lang).css("display", "");
  // save lang
  setCookie('lang', lang, 7);
  // $("#" + lang)[0].prop('checked', true);
  $.event.trigger("refreshLatexEvent");
}

/**
 * formulaAppletLanguage hides _isTranslationInitiated: no global variable
 */
export let formulaAppletLanguage = (function () {
  let _lang = "de";
  return {
    set: function (lang) {
      console.log('set lang to ' + lang);
      _lang = lang;
    },
    get: function () {
      console.log('get lang: ' + _lang);
      return _lang;
    }
  }
})();

var translate = {
  init: false
};

// rememberInit.setTranslationInitiated(true);
// initTranslation(); called by preparePage & mainLicense
// console.log('translate.init =' + translate.init);

// export async function clickLanguage() {
async function clickLanguage() {
  // var lang = getCookie('lang') || 'de';
  // console.log('switch to lang: ' + lang);
  // await switchTo(lang);
  await domLoad;
  var lang = formulaAppletLanguage.get();
  var element = document.getElementById(lang);
  console.log(element);
  $(element).prop("checked",true).trigger("change");
  switchTo(lang);
  // $( 'input[name="lang"]:radio:first' ).click();
}

/**
 * make buttons with id=de and id=en clickable
 * init event handler for clickLanguageEvent
 * call clickLanguage for the first time
 */
export async function initTranslation() {
  // if (!rememberInit.isTranslationInitiated()) {
  console.log('translate.init =' + translate.init);

  if (!translate.init) {
    // backup of display attribute
    // console.debug('initTranslation()');

    // click event for language buttons
    $(function () {
      // $('.btn').button()
      $('#de').on('click', function () {
        switchTo('de');
      });
      $('#en').on('click', function () {
        switchTo('en');
      });
    });

    $(document).on("clickLanguageEvent", function () {
      clickLanguage();
    });

    // rememberInit.setTranslationInitiated(true);
    translate.init = true;
    console.log('translate.init =' + translate.init);
    await clickLanguage();
  }
}

/**
 * rememberLanguage hides _lang: no global variable
 */
// export async function rememberLanguage() {
//   var lang;
//   return lang;
// }

// export var formulaAppletLanguage = {
//   lang: "de"
// };

/**
 * 
 * @param {string} cookieName name of cookie    
 * @param {string} cookieValue value of cookie
 * @param {number} exdays number of days after which the cookie becomes invalid (is expiring)
 * @see https://www.w3schools.com/js/js_cookies.asp
 * @see getCookie
 */
function setCookie(cookieName, cookieValue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  var expires = "expires=" + d.toUTCString();
  document.cookie = cookieName + "=" + cookieValue + ";" + expires + ";path=/";
}

/**
 * 
 * @param {string} cookieName name of cookie
 * @returns {string} value of cookie
 * @see setCookie
 */
export function getCookie(cookieName) {
  var name = cookieName + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
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