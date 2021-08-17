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

export function initTranslation() {
  if (!translationIsInitiated) {
    // backup of display attribute
    console.log('initTranslation()');
    $('.tr').each(function () {
      var disp = $(this).css('display');
      $(this).attr('data-disp', disp);
      $(this).css('display', 'none');
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
    var lang = getCookie('lang') || "de";
    console.log('switch to lang: ' + lang);
    switchTo(lang);
    translationIsInitiated = true;
  }
};

// https://www.w3schools.com/js/js_cookies.asp
function setCookie(cookie_name, cookie_value, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  var expires = "expires=" + d.toUTCString();
  document.cookie = cookie_name + "=" + cookie_value + ";" + expires + ";path=/";
}

function getCookie(cookie_name) {
  var name = cookie_name + "=";
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