"use strict";

import $ from "jquery";
import { domLoad } from "./dom.js";

async function switchTo(lang) {
  await domLoad;
  $(".tr").css("display", "none");
  $(".tr." + lang).css("display", "initial");

  // save lang
  setCookie('lang', lang, 7);
}

let translationIsInitiated = false;

export async function reloadTranslation() {
  var lang = getCookie('lang') || 'de';
  console.log('switch to lang: ' + lang);
  await switchTo(lang);
}

export async function initTranslation() {
  if (!translationIsInitiated) {
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

    translationIsInitiated = true;
    await reloadTranslation();
  }
}

// https://www.w3schools.com/js/js_cookies.asp
function setCookie(cookieName, cookieValue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  var expires = "expires=" + d.toUTCString();
  document.cookie = cookieName + "=" + cookieValue + ";" + expires + ";path=/";
}

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