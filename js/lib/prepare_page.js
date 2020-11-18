  // This is prepare_page.js

  var mathField = [];
  var timeoutIdList = [];
  var solution_list = [];
  var tapList;
  var prepare_page_exists = true;
  var precision = 0.000001;
  var activeMathfieldIndex = '';
  var MQ = MathQuill.getInterface(2);
  
  function base64_zip_decode(code, decode_success) {
    var zip = new JSZip();
    zip.loadAsync(code, {
      base64: true
    }).then(function (data) {
      zip.file("content.txt").async("string").then(function (data) {
        decode_success(data);
      });
    });
  }

  // function isAndr() cannot be moved to glue.js because
  // glue.js is executed but not stored at test.mathebuch-online.de/wiki

  function isAndr() {
    return (navigator.userAgent.toUpperCase().indexOf('ANDROID') !== -1);
  }


  function keyboardEvent(cmd) { // was bridge(cmd)
    var mf = mathField[activeMathfieldIndex];
    var fa = $('.formula_applet')[activeMathfieldIndex];
    var mfSource = $(fa).find('.mq-editable-field')[0];

    if (typeof mf !== 'undefined') {
      console.log(cmd);
      var endsWithSpace = false;
      if ((cmd.substr(cmd.length - 1)) == ' ') {
        endsWithSpace = true;
        // remove space from end of cmd
        cmd = cmd.substring(0, cmd.length - 1);
      }
      if (cmd.startsWith('#')) {
        // remove # from start of cmd
        cmd = cmd.substring(1);
        if (cmd == 'Enter') {
          editHandler(activeMathfieldIndex, 'enter');
        } else {
          mf.keystroke(cmd);
        }
      } else {
        // no #
        mf.typedText(cmd);
        // $(mfSource).click();
        // mf.typedText(' ');
        // mfSource.focus();
      }
      if (endsWithSpace) {
        mf.typedText(' ');
        mf.keystroke('Backspace');
      }
    }
  }

  function check_if_equal(id, a, b) {
    console.log(a + ' ?=? ' + b);
    myTree = new tree();
    myTree.leaf.content = a + '=' + b;
    parse(myTree);
    var almostOne = value(myTree);
    var dif = Math.abs(almostOne - 1);
    console.log('dif=' + dif);
    if (dif < precision) {
      $('#' + id).removeClass('mod_wrong').addClass('mod_ok');
    } else {
      $('#' + id).removeClass('mod_ok').addClass('mod_wrong');
    }
  }

  function check_if_equality(id, equ) {
    myTree = new tree();
    myTree.leaf.content = equ;
    parse(myTree);
    var almostOne = value(myTree);
    var dif = Math.abs(almostOne - 1);
    console.log('dif=' + dif);
    if (dif < precision) {
      $('#' + id).removeClass('mod_wrong').addClass('mod_ok');
    } else {
      $('#' + id).removeClass('mod_ok').addClass('mod_wrong');
    }
  }

  function editHandler(index) {
    var fa = $(".formula_applet")[index];
    // var index = $(".formula_applet").index($('#' + id));
    var mf = mathField[index];
    var mf_container = MQ.StaticMath(fa);
    // console.log(fa);
    var solution = solution_list[index];
    var hasSolution = (typeof solution !== 'undefined');
    var id = $(fa).attr('id'); // name of formula_applet

    // console.log(id + ' index=' + index + ' hasSolution=' + hasSolution + ' mode=' + entermode);
    if (hasSolution) {
      out = mf.latex() + ' ' + solution;
      check_if_equal(id, mf.latex(), solution);
    } else {
      out = mf_container.latex();
      check_if_equality(id, mf_container.latex());
    }
    // document.getElementById('output').innerHTML = out;
  };

  function prepare_page() {
    console.log('call prepare_page');
    console.log('isAndroid=' + isAndr());
    vkbd_init();

    // <!-- http://docs.mathquill.com/en/latest/Api_Methods/#mqmathfieldhtml_element-config -->

    $(".formula_applet").click(function () {
      $(".formula_applet").removeClass('selected');
      $(this).addClass('selected');
      var id = $(this).attr('id');
      activeMathfieldIndex = $(".formula_applet").index($('#' + id));
      // console.log(activeMathfieldIndex);
    });

    // $(".formula_applet").dblclick(function () {
    // // $("span.mq-editable-field span.mq-root-block").dblclick(function () {
    //   console.log('dblclick ' + activeMathfieldIndex);
    // });

    // concerns all formula_applets:
    $("img.mod").remove();
    ($('<img class="mod">')).insertAfter($(".formula_applet"));

    $(document).ready(function () {
      console.log('document.ready()');

      $(".formula_applet").each(function () {
        MQ.StaticMath(this);
        var index = $(".formula_applet").index(this); //0, 1, 2, 3,...
        var id = $(this).attr('id'); // name of formula_applet
        var hasSolution = false;
        if ($(this).attr('data-zip') !== undefined) {
          hasSolution = true;
          var zip = $(this).attr('data-zip');
          // console.log('zip=' + zip);
          base64_zip_decode(zip, function (decoded) {
            // console.log('solution=' + code);
            solution_list[index] = decoded;
          });
        };
        console.log(index + ': ' + id + ' hasSolution=' + hasSolution);
        var mfSource = $(this).find('.mq-editable-field')[0];
        tapList = new Hammer(mfSource);
        tapList.on("doubletap", function (ev) {
          console.log(index + ' ' + ev.type);
          vkbd_show();
        });
        tapList.on("press", function (ev) {
          console.log(index + ' ' + ev.type);
          vkbd_show();
        });
        mf = MQ.MathField(mfSource, {});
        mf.config({
          handlers: {
            edit: function () {
              mfSource.focus();
              // console.log('edit ' + index);
            },
            enter: function () {
              editHandler(index);
            }
          }
        });
        // $(mfSource).keydown(function (e) {
        //   console.log('keydownevent=' + e.keyCode + ' ' + e.which);
        //   console.log(e);
        // });
        mathField.push(mf);
        // https://stackoverflow.com/questions/4080497/how-can-i-listen-for-a-click-and-hold-in-jquery#4080508
        // $(this).on('mousedown', function () {
        //   console.log('mousedown');
        //   timeoutIdList[index] = setTimeout(vkbd_show, 1000);
        // }).on('mouseup mouseleave', function () {
        //   clearTimeout(timeoutIdList[index]);
        // });
        // $(this).on('dblclick', function () {
        //   console.log('dblclick');
        //   vkbd_show();
        // });
      });
    });
  }