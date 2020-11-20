<?php $title = 'Problem Editor';
$liblist = "[ 'hammer', 'zip', 'prepare_page', 'mathquill', 'tex_parser', 'mathquillcss', 'gf09css', 'vkbd', 'vkbdcss']";
include_once 'header.php';
?>

<script>

function init(){
  console.log('init...');
  $('#mw-code').click(function(){
    $('#output-code').val(output);
  });
  MQ = MathQuill.getInterface(2);
  vkbd_init();
  var mathFieldSpan = document.getElementById('math-field');
  var mf = MQ.MathField(mathFieldSpan, {
    spaceBehavesLikeTab: true, // configurable
    handlers: {
      edit: function() { // useful event handlers
        var output = mf.latex();
        $('#output-code').val(output);
      }
    }
  });

  var FApp = new FA();
  activeMathfieldIndex = 0;
   
  FApp.mathField = mf;
  FApp.index = 0;
  FApp.id = 'editor';
  console.log(mf);
  mqEditableField = $('#editor').find('.mq-editable-field')[0];
  console.log(mqEditableField);
  FApp.mqEditableField = mqEditableField;
  FApp.hammer = new Hammer(mqEditableField);
  FApp.hammer.on("doubletap", function (ev) {
    vkbd_show();
  });
  FApp.hammer.on("press", function (ev) {
    vkbd_show();
  });
  // var mf = MQ.MathField(mqEditableField, {});
  // mf.config({
  //   handlers: {
  //     edit: function () {
  //       mqEditableField.focus();
  //       // console.log('edit ' + index);
  //     },
  //     enter: function () {
  //       editHandler(index);
  //     }
  //   }
  // });
  console.log('problem_editor activeMathfieldIndex=' + activeMathfieldIndex);
  FAList[activeMathfieldIndex] =FApp;
  console.log('FApp');
  console.log(FApp);
}

</script>

</head>

<body>
<h1><?php echo $title; ?></h1>
<h2>for later use in MediaWiki</h2>
<!-- <div id='keyboard'></div> -->
<p id="output">output</p>
<p><button type="button" id='mw-code'>MediaWiki Applet</button></p>
<textârea class="formula_applet_editor" id="editor"><span id="math-field">17 + 4 = \class{inputfield}{21}</span></textarea>
<hr />
<textarea id='output-code'>Code</textarea>
<hr />
<ul>
  <li>Make whole applet editable</li>
  <li>Button: insert inputfield</li>
  <li>hasSolution checkbox</li>
  <li>Code input field to ZIP</li>
  <li>Complete to MediaWiki applet</li>
</ul>
<?php include_once 'uses.php';?>

<?php include_once 'footer.php';?>