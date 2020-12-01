// translate.js
// http://www.script-tutorials.com/how-to-translate-your-site-in-runtime-using-jquery/

var tra = [];
tra['en'] = {
  save: 'Save',
  samples: 'Sample Tasks',
  later: 'for later use in MediaWiki',
  uses: 'FormulaApplet uses jQuery, MathQuill, and Hammer. ',
  moreinfo: 'More info...'
};
tra['de'] = {
  save: 'Speichern',
  samples: 'Aufgaben-Beispiele',
  later: 'zum späteren Gebrauch im MediaWiki',
  uses: 'FormulaApplet benutzt die Bibliotheken jQuery, MathQuill und Hammer. ',
  moreinfo: 'Weitere Informationen...'
};

// put this code into $(document).ready(function() {}
function initTranslation() {
  console.log('initTranslation()');
  // console.log($('.language'));
  // onclick behavior
  $('input.language').on('change', function (ev) {
    console.log(ev);
    // obtain lang = (id of .language button)
    var lang = $(this).attr('id'); // obtain language id
    if(lang == ''){
      lang = 'de';
    }
    console.log(lang);

    if (isWiki) {
      var messages = ['march', 'formelapplet-missing-parameter', 'Wikibasemediainfo-quantity-unit-button-text'];
      // see translate.js
      loadMessages(messages).then(
        function () {
          replaceWithTranslations(lang);
          // doStuff();
        }
      );
    } else {
      replaceWithTranslations(lang);
    }
  });
  // next line has to be erased
  replaceWithTranslations('de');
}

function replaceWithTranslations(lang) {
  console.log('replaceWithTranslations()');
  // translate all translatable elements
  $('.tr').each(function () {
    // obtail key of .tr element
    console.log(this);
    var key = $(this).attr('key');
    var translation = '';
    if (isWiki) {
      translation = mw.msg(key);
    }
    if (translation == '') {
      translation = tra[lang][key];
    }
    console.log(key + ' -> ' + translation);
    $(this).text(translation);
  });
}

// for wiki
// https://en.wikipedia.org/wiki/Translatewiki.net
// you may use the translations of ...\htdocs\wiki\extensions\FormulaApplet\i18n
// and of https://www.mediawiki.org/wiki/Translation

/** @return instance of jQuery.Promise */
function loadMessages(messages) {
  return new mw.Api().get({
    action: 'query',
    meta: 'allmessages',
    ammessages: messages.join('|'),
    amlang: mw.config.get('wgUserLanguage')
  }).then(function (data) {
    $.each(data.query.allmessages, function (i, message) {
      if (message.missing !== '') {
        mw.messages.set(message.name, message['*']);
      }
    });
  });
}