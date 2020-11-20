  // This is prepare_page.js

  var mathField = [];
  var timeoutIdList = [];
  var tapList;
  var prepare_page_exists = true;
  var precision = 0.000001;
  var activeMathfieldIndex = '';
  var MQ = '';
  var FAList = [];
  class FA {
    constructor() {
      this.index = '';
      this.id = '';
      this.formula_applet = '';
      this.hasSolution = '';
      this.solution = '';
      this.mqEditableField = '';
      this.mathField = '';
      this.hammer = '';
    }
  }

  function prepare_page() {
    // waits for MathQuill to load
    $("img.mod").remove();
    ($('<img class="mod">')).insertAfter($(".formula_applet"));
    $(document).ready(function () {
      mathQuillify();
    })
  }

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
    console.log('prepare_page activeMathfieldIndex=' + activeMathfieldIndex);
    var FApp = FAList[activeMathfieldIndex];
    var mf = FApp.mathField;
    // var fa = FApp.formula_applet;
    // var mqEditableField = FApp.mqEditableField;

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
        // $(mqEditableField).click();
        // mf.typedText(' ');
        // mqEditableField.focus();
      }
      if (endsWithSpace) {
        mf.typedText(' ');
        mf.keystroke('Backspace');
      }
    }
  }

  function check_if_equal(id, a, b) {
    console.log(a + ' ?=? ' + b);
    var equ = a + '=' + b;
    check_if_equality(id, equ);
    // myTree = new tree();
    // myTree.leaf.content = a + '=' + b;
    // parse(myTree);
    // var almostOne = value(myTree);
    // var dif = Math.abs(almostOne - 1);
    // console.log('dif=' + dif);
    // if (dif < precision) {
    //   $('#' + id).removeClass('mod_wrong').addClass('mod_ok');
    // } else {
    //   $('#' + id).removeClass('mod_ok').addClass('mod_wrong');
    // }
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
    var mf = FAList[index].mathField;
    var mf_container = MQ.StaticMath(FAList[index].formula_applet);
    // console.log(fa);
    var solution = FAList[index].solution;
    var hasSolution = FAList[index].hasSolution;
    var id = FAList[index].id; // name of formula_applet

    // console.log(id + ' index=' + index + ' hasSolution=' + hasSolution + ' mode=' + entermode);
    if (hasSolution) {
      // out = mf.latex() + ' ' + solution;
      check_if_equal(id, mf.latex(), solution);
    } else {
      // out = mf_container.latex();
      check_if_equality(id, mf_container.latex());
    }
    // document.getElementById('output').innerHTML = out;
  };

  function storeSolution(sol, ind) {
    console.log(ind + ' solution: ' + sol);
    FAList[ind].solution = sol;
  }

  function mathQuillify() {
    MQ = MathQuill.getInterface(2);
    vkbd_init();
    $(".formula_applet").each(function () {
      MQ.StaticMath(this);
      var index = $(".formula_applet").index(this);
      // console.log(index);
      FApp = new FA();
      FApp.index = index;
      FApp.id = $(this).attr('id') // name of formula_applet
      $(this).click(function () {
        $(".formula_applet").removeClass('selected');
        $(this).addClass('selected');
        var id = $(this).attr('id');
        activeMathfieldIndex = $(".formula_applet").index($('#' + id));
        // console.log(activeMathfieldIndex);
      });
      if ($(this).attr('data-zip') !== undefined) {
        FApp.hasSolution = true;
        var zip = $(this).attr('data-zip');
        base64_zip_decode(zip, function (decoded) {
          storeSolution(decoded, index);
        });
      } else {
        FApp.hasSolution = false;
      };
      var mqEditableField = $(this).find('.mq-editable-field')[0];
      FApp.mqEditableField = mqEditableField;
      FApp.hammer = new Hammer(mqEditableField);
      FApp.hammer.on("doubletap", function (ev) {
        console.log(index + ' ' + ev.type);
        vkbd_show();
      });
      FApp.hammer.on("press", function (ev) {
        console.log(index + ' ' + ev.type);
        vkbd_show();
      });
      var mf = MQ.MathField(mqEditableField, {});
      mf.config({
        handlers: {
          edit: function () {
            mqEditableField.focus();
            // console.log('edit ' + index);
          },
          enter: function () {
            editHandler(index);
          }
        }
      });
      FApp.mathField = mf;
      FApp.formula_applet = this;
      FAList[index] = FApp;
      // console.log(index);
      console.log(FApp);

    });
  }

  // function prepare_page_old() {
  //   console.log('call prepare_page');
  //   console.log('isAndroid=' + isAndr());
  //   MQ = MathQuill.getInterface(2);
  //   vkbd_init();

  //   // <!-- http://docs.mathquill.com/en/latest/Api_Methods/#mqmathfieldhtml_element-config -->

  //   $(".formula_applet").click(function () {
  //     $(".formula_applet").removeClass('selected');
  //     $(this).addClass('selected');
  //     var id = $(this).attr('id');
  //     activeMathfieldIndex = $(".formula_applet").index($('#' + id));
  //     // console.log(activeMathfieldIndex);
  //   });

  //   // $(".formula_applet").dblclick(function () {
  //   // // $("span.mq-editable-field span.mq-root-block").dblclick(function () {
  //   //   console.log('dblclick ' + activeMathfieldIndex);
  //   // });

  //   // concerns all formula_applets:
  //   $("img.mod").remove();
  //   ($('<img class="mod">')).insertAfter($(".formula_applet"));

  //   $(document).ready(function () {
  //     console.log('document.ready()');

  //     $(".formula_applet").each(function () {
  //       MQ.StaticMath(this);
  //       var index = $(".formula_applet").index(this); //0, 1, 2, 3,...
  //       var id = $(this).attr('id'); // name of formula_applet
  //       var hasSolution = false;
  //       if ($(this).attr('data-zip') !== undefined) {
  //         hasSolution = true;
  //         var zip = $(this).attr('data-zip');
  //         // console.log('zip=' + zip);
  //         base64_zip_decode(zip, function (decoded) {
  //           // console.log('solution=' + code);
  //           solution_list[index] = decoded;
  //         });
  //       };
  //       console.log(index + ': ' + id + ' hasSolution=' + hasSolution);
  //       var mqEditableField = $(this).find('.mq-editable-field')[0];
  //       tapList = new Hammer(mqEditableField);
  //       tapList.on("doubletap", function (ev) {
  //         console.log(index + ' ' + ev.type);
  //         vkbd_show();
  //       });
  //       tapList.on("press", function (ev) {
  //         console.log(index + ' ' + ev.type);
  //         vkbd_show();
  //       });
  //       mf = MQ.MathField(mqEditableField, {});
  //       mf.config({
  //         handlers: {
  //           edit: function () {
  //             mqEditableField.focus();
  //             // console.log('edit ' + index);
  //           },
  //           enter: function () {
  //             editHandler(index);
  //           }
  //         }
  //       });
  //       // $(mqEditableField).keydown(function (e) {
  //       //   console.log('keydownevent=' + e.keyCode + ' ' + e.which);
  //       //   console.log(e);
  //       // });
  //       mathField.push(mf);
  //       // https://stackoverflow.com/questions/4080497/how-can-i-listen-for-a-click-and-hold-in-jquery#4080508
  //       // $(this).on('mousedown', function () {
  //       //   console.log('mousedown');
  //       //   timeoutIdList[index] = setTimeout(vkbd_show, 1000);
  //       // }).on('mouseup mouseleave', function () {
  //       //   clearTimeout(timeoutIdList[index]);
  //       // });
  //       // $(this).on('dblclick', function () {
  //       //   console.log('dblclick');
  //       //   vkbd_show();
  //       // });
  //     });
  //   });
  // }