// translate.js
function switchTo(lang){
    $('.tr').each(function(){
      console.log('hide');
      console.log(this);
      $(this).css('display', 'none');
    })
    $('.tr.de').each(function(){
      var defaultkey = $(this).attr('class');
      if(defaultkey.length > 5){
          var targetkey = '.' + defaultkey.substr(0,2) + '.' + lang +'.' + defaultkey.substr(6);
          var target = $(targetkey);
      } else {
        target = this;
      }
      var disp = $(target).attr('data-disp');
      console.log(targetkey +  ' show as ' + disp);
      $(target).css('display', disp);
    })

    $('a').each(function()
    { 
        // console.log(this.href);
        let h = this.href;
        let split = h.split('?');
        // if (split[1] > 0){
        // preserve other params?
        // }
        let new_href = split[0] + '?lang=' + lang;
        console.log(h + ' -> ' + new_href);
        this.href = new_href;
    });

  }

  //default
  // $(window).on('load', function(){
  //     console.log('window.on.load');
  function initTranslation(){
      // backup of display attribute
      console.log('initTranslation()');
      $('.tr').each(function(){
        var disp = $(this).css('display');
        $(this).attr('data-disp', disp);
        $(this).css('display', 'none');
        // console.log(this);
        console.log(disp);
      })

      // click event for language buttons
      $(function(){
        // $('.btn').button()
        $('#de').on('click', function(){
          console.log('de.click');
          switchTo('de');
        });
        $('#en').on('click', function(){
          switchTo('en');
          console.log('en.click');
        });
      });

      // get current lang
      let url = new URL(document.location.href);
      var lang = url.searchParams.get('lang');
      if(lang == null || lang == ''){
        lang = 'de'; //default
      }
      console.log('lang=' + lang);
      $('#'+lang).click().blur();
      switchTo(lang);

  };
