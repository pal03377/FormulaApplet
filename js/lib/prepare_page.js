  var mathField = [];
  var solution_list = [];
  var prepare_page_exists = true;

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

  function prepare_page() {
    console.log('* prepare_page');
    console.log('isAndroid=' + isAndr());
    // <!-- http://docs.mathquill.com/en/latest/Api_Methods/#mqmathfieldhtml_element-config -->

    $(".formula_applet").click(function () {
      $(".formula_applet").removeClass('selected');
      $(this).addClass('selected');
    });


    function check_if_equal(id, a, b) {
      console.log(a + ' ?=? ' + b);
      myTree = new tree();
      myTree.leaf.content = a + '=' + b;
      parse(myTree);
      var almostOne = value(myTree);
      var dif = Math.abs(almostOne - 1);
      if (dif < 0.1) {
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
      if (dif < 0.1) {
        $('#' + id).removeClass('mod_wrong').addClass('mod_ok');
      } else {
        $('#' + id).removeClass('mod_ok').addClass('mod_wrong');
      }
    }

    // obsolete because glue.js is used to load css
    // var link = document.createElement("link");
    // link.type = "text/css";
    // link.rel = "stylesheet";
    // link.href = "./css/gf09.css";
    // document.getElementsByTagName("head")[0].appendChild(link);

    // concerns all formula_applets:
    $("img.mod").remove();
    ($('<img class="mod">')).insertAfter($(".formula_applet"));

    $(document).ready(function () {
      console.log('* document ready');
      var MQ = MathQuill.getInterface(2);

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
        // console.log(mfSource);
        mf = MQ.MathField(mfSource, {});
        mf.config({
          handlers: {
            edit: function () {
              editHandler(id, hasSolution, 'edit');
            },
            enter: function () {
              editHandler(id, hasSolution, 'enter');
            }
          }
        });
        $(mfSource).keydown(function (e) {
          console.log('keydownevent=' + e.keyCode + ' ' + e.which);
          console.log(e);
        });
        mathField.push(mf);
        // console.log(mathField.length);
      });

      function editHandler(id, hasSolution, entermode) {
        var fa = $('#' + id)[0];
        var index = $(".formula_applet").index($('#' + id));
        var mf = mathField[index];
        var mf_container = MQ.StaticMath(fa);
        // console.log(fa);
        var solution = solution_list[index];
        console.log(id + ' index=' + index + ' hasSolution=' + hasSolution + ' mode=' + entermode);
        // console.log(mf.latex() + ' ' + mf_container.latex() + ' ' + solution);

        if (entermode == 'enter') {
          if (hasSolution) {
            out = mf.latex() + ' ' + solution;
            check_if_equal(id, mf.latex(), solution);
          } else {
            out = mf_container.latex();
            check_if_equality(id, mf_container.latex());
          }
          // document.getElementById('output').innerHTML = out;
        }
      };

    });
  }