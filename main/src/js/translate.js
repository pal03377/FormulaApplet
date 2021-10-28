"use strict";

import $ from "jquery";
import {
  domLoad
} from "./dom.js";

async function switchTo(lang) {
  await domLoad;
  if(lang == ''){
    lang = 'de';
  }
  console.log('switch to ' + lang);
  formulaAppletLanguage.set(lang);
  $(".tr").css("display", "none");
  $(".tr." + lang).css("display", "inline");
  // save lang
  console.log('save cookie lang=' + lang);
  setCookie('lang', lang, 7);
  var domElem = document.getElementById(lang);
  if (domElem) {
    domElem.click();
    // console.log('trigger click ' + lang);
  }

  $.event.trigger("refreshLatexEvent");
}

/**
 * formulaAppletLanguage hides _lang: no global variable
 * TODO use 
 */
export let formulaAppletLanguage = (function () {
  let _lang = "de";
  return {
    set: function (lang) {
      _lang = lang;
    },
    get: function () {
      return _lang;
    }
  }
})();

var translate = {
  init: false
};

function clickListener(event) {
  var lang = this.id;
  if (event.screenY == 0) {
    // triggered click - do nothing
    // console.log('triggered click - do nothing');
  } else {
    // real click
    switchTo(lang);
  }
}

function addClickListener(lang) {
  var domElem = document.getElementById(lang);
  if (domElem) {
    domElem.addEventListener('click', clickListener);
  }
}

export async function initTranslation() {

  if (!translate.init) {
    // console.log('translate.init START ');
    // make buttons with id=de and id=en clickable
    addClickListener('de');
    addClickListener('en');
    translate.init = true;
    // console.log('translate.init END');
    var lang = formulaAppletLanguage.get();
    switchTo(lang);
  } else {
    // console.log('translate.init SKIPPED');
  }
}

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