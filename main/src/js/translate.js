"use strict";

import $ from "jquery";
import { domLoad } from "./dom.js";

async function switchTo(lang) {
  await domLoad;
  console.log('switch to ' + lang);
  $(".tr").css("display", "none");
  $(".tr." + lang).css("display", "initial");
  // save lang
  setCookie('lang', lang, 7);
}

/**
 * trInit hides trVal from being a global variable
 */
let trInit = (function(){
  let trVal= true;
  return {
    setTranslationInitiated: function(truefalse){
      trVal = truefalse;
    },
    isTranslationInitiated: function(){
      return trVal;
    }
  }
})();

trInit.setTranslationInitiated(true);
console.log(trInit.isTranslationInitiated());

// export async function reloadTranslation() {
async function reloadTranslation() {
    var lang = getCookie('lang') || 'de';
  // console.log('switch to lang: ' + lang);
  await switchTo(lang);
}
/**
 * make buttons with id=de and id=en clickable
 * init event handler for reloadTranslationEvent
 * call reloadTranslation for the first time
 */
export async function initTranslation() {
  if (!trInit.translationIsInitiated) {
    // backup of display attribute
    console.debug('initTranslation()');

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

    $(document).on("reloadTranslationEvent", function(){
      reloadTranslation();
    });

    trInit.setTranslationInitiated(true);
    await reloadTranslation();
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
function getCookie(cookieName) {
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