  // This is prepare_page.js

  var mathField = [];
  var timeoutIdList = [];
  var solution_list = [];
  var prepare_page_exists = true;
  var precision = 0.000001;
  var activeMathfieldIndex = '';
  var MQ = '';

  // console.log('gluetest says: ' + gluetest);

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

  function bridge(cmd) {
    var mf = mathField[activeMathfieldIndex];
    if (typeof mf !== 'undefined') {
      if (cmd.startsWith('#')) {
        cmd = cmd.substring(1);
        if (cmd == 'Enter') {
          editHandler(activeMathfieldIndex, 'enter');
        } else {
          mf.keystroke(cmd);
        }
      } else {
        mf.typedText(cmd);
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
    MQ = MathQuill.getInterface(2);

    // <!-- http://docs.mathquill.com/en/latest/Api_Methods/#mqmathfieldhtml_element-config -->

    $(".formula_applet").click(function () {
      $(".formula_applet").removeClass('selected');
      $(this).addClass('selected');
      var id = $(this).attr('id');
      activeMathfieldIndex = $(".formula_applet").index($('#' + id));
      console.log(activeMathfieldIndex);
    });

    // $(".formula_applet").dblclick(function () {
    // // $("span.mq-editable-field span.mq-root-block").dblclick(function () {
    //   console.log('dblclick ' + activeMathfieldIndex);
    // });

    // concerns all formula_applets:
    $("img.mod").remove();
    ($('<img class="mod">')).insertAfter($(".formula_applet"));

    $(document).ready(function () {
      console.log('call document ready');

      $(".formula_applet").each(function () {
        MQ.StaticMath(this);
        var index = $(".formula_applet").index(this); //0, 1, 2, 3,...
        var id = $(this).attr('id'); // name of formula_applet
        var hasSolution = false;
        if ($(this).attr('data-zip') !== undefined) {
          hasSolution = true;
          var zip = $(this).attr('data-zip');
          // console.log('zip=' + zip);
          base64_zip_decode(zip, function (code) {
            // console.log('solution=' + code);
            solution_list[index] = code;
          });
        };
        console.log(index + ': ' + id + ' hasSolution=' + hasSolution);
        var mfSource = $(this).find('.mq-editable-field')[0];
        mf = MQ.MathField(mfSource, {});
        mf.config({
          handlers: {
            edit: function () {
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
        // timeoutIdList[index] = 815;
        $(mfSource).on('mousedown', function () {
          console.log('mousedown');
          timeoutIdList[index] = setTimeout(myFunction, 1000);
        }).on('mouseup mouseleave', function () {
          clearTimeout(timeoutIdList[index]);
        });
        $(mfSource).on('dblclick', function() {
          console.log('dblclick');
        });
      });
    });
  }

  function myFunction(){
    vkbd_show();
  }