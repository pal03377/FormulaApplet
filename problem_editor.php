<?php $title = 'Problem Editor';
$liblist = "[ 'hammer', 'zip', 'prepare_page', 'mathquill', 'tex_parser', 'mathquillcss', 'gf09css', 'vkbd', 'vkbdcss']";
include_once 'header.php';
?>

<script>

var eraseclass = '';

function init(){
  console.log('init...');
  $('#erase-input').click(function(){
    edithandler();
    //quick and dirty
    if(eraseclass !=='???'){
      mf.latex(eraseclass);
    }
  });
  MQ = MathQuill.getInterface(2);
  vkbd_init();
  // make whole math-field span editable
  var mathFieldSpan = document.getElementById('math-field');
  var mf = MQ.MathField(mathFieldSpan, {
    spaceBehavesLikeTab: true, // configurable
    handlers: {
      edit: function() { // useful event handlers
        edithandler();
        }
    }
  });
  // show output-codes before first edit
  edithandler();

  function edithandler(){
  var output = mf.latex();
    // console.log(output);
    // $('#output-code').val(output); syntax for textarea
    $('#output-code-0').text(output);
    var part1 = '?';
    var part2 = '?';
    var part3 = '?';
    var pos = output.indexOf('class{');
    if(pos > -1){
      part1 = output.substring(0, pos);
      var rest = output.substring(pos+5);
      var temp = find_corresponding_right_bracket(rest, '{');
      if(temp[0] !== 0 || temp[1] !== 1 || temp[3] !== 1){
        console.log('Something went wront at problemeditor.js');
      }
      part2 = rest.substring(1, temp[2]);
      part3 = rest.substring(temp[2] + 1);
    }
    $('#output-code-1').text(part2);
    eraseclass = part1 + part2 + part3;
    // $('#output-code-3').text(part3);
    var zip = new JSZip();
    zip.file("content.txt", part2);
    zip.generateAsync({type:"base64"}).then( function(zipcontent){
      var result = '<p class="formula_applet" id="BliBlaBlu" data-zip="';
      result += zipcontent;
      result += '">';
      result += part1;
      result += '\\MathQuillMathField{}';
      result += part3;
      result += '</p>';
      $('#output-code-2').text(result);
      var wikiresult = '<f_app id=BliBlaBlu data-zip="';
      wikiresult += zipcontent;
      wikiresult += '">';
      wikiresult += part1;
      wikiresult += '{{result}}';
      wikiresult += part3;
      wikiresult += '</f_app>';
      $('#output-code-3').text(wikiresult);
    });
  }

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
  FAList[activeMathfieldIndex] =FApp;
 }
 //End of init()

</script>

</head>

<body>
<h1><?php echo $title; ?></h1>
<h2>for later use in MediaWiki</h2>
<!-- <div id='keyboard'></div> -->
<!-- <p id="output">output</p> -->
<p><button type="button" id='erase-input'>Erase input field</button></p>
<p class="formula_applet" id="editor"><span id="math-field">17 + 4 = \class{inputfield}{21}</span></p>
<hr />
<div><p id='output-code-0'>Code 0</p></div>
<div><p id='output-code-1'>Code 1</p></div>
<div><p id='output-code-2'>Code 2</p></div>
<div><p id='output-code-3'>Code 3</p></div>
<hr>
<h2>ToDo</h2>
<ul>
  <li><s>Make whole applet editable<</s></li>
  <li>Button: insert inputfield</li>
  <li>hasSolution checkbox</li>
  <li><s>Code input field to ZIP</s></li>
  <li><s>Complete to MediaWiki applet</s></li>
</ul>
<?php include_once 'uses.php';?>

<?php include_once 'footer.php';?>