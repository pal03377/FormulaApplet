<?php $title = 'Sample Tasks';
$liblist = "[ 'hammer', 'zip', 'prepare_page', 'mathquill', 'tex_parser', 'mathquillcss', 'gf09css', 'vkbd', 'vkbdcss']";
include_once 'header.php';
?>

<script>

function init(){
  console.log('init...');
  $('#erase-input').click(function(){
    var temp = editor_edithandler(editor_mf.latex());
    console.log(temp);
    var erased = temp[0] + temp[1] +temp[2];
    //quick and dirty
    if(erased !=='???'){
      editor_mf.latex(erased);
    }
  });
  $('#develop').on('mouseover', function(ev){
      var before = $('#editor').clone();
      var selection = $(before).find('.mq-selection');
      if (selection.length > 0){
        sel_ind = $(selection).index();
        var siblings = $(selection).siblings();
        var num_of_siblings = siblings.length;
        for (var i = 0; i < sel_ind; i++) {
          console.log( $(siblings)[i] );
        }
        $(selection).remove();
        // console.log('---');
        // console.log( selection );
        // console.log('---');
        for (var i = sel_ind; i < num_of_siblings; i++){
          console.log( $(siblings)[i] );
          $(siblings)[i].remove();
        }
        console.log( before );
        var MQ = MathQuill.getInterface(2);
        var editor_mf = MQ.MathField( before );
        console.log('before: ' + editor_mf.latex() );
       // setTimeout(
        //   function() {
        //     //do something special
        //     console.log( 'replace' );
        //     $('#editor ').replaceWith( $( remember ));
        // }, 2000);
      }
  });
  $('#fa_name').on('input', (function(ev){
    var fa_name = ev.target.value;
    // console.log(fa_name);
      // avoid XSS
    fa_name = fa_name.replace(/</g, '');
    fa_name = fa_name.replace(/>/g, '');
    fa_name = fa_name.replace(/"/g, '');
    fa_name = fa_name.replace(/'/g, '');
    fa_name = fa_name.replace(/&/g, '');
    console.log( fa_name);
    if (fa_name !== ''){
      new_fa_id = fa_name;
      show_editor_results(editor_edithandler(editor_mf.latex()));
    }
  }));
}

</script>

</head>

<body>
<h1><?php echo $title; ?></h1>
<h2>for later use in MediaWiki</h2>
<!-- <div id='keyboard'></div> -->
<p id="output">output</p>
<!-- <p class="formula_applet" id="light-house-0">(r + h)^2 = r^2 + s^2 \Rightarrow</p><br /> -->
<p class="formula_applet" id="light-house" data-zip='UEsDBAoAAAAAAGeNOFFTGYHLAwAAAAMAAAALAAAAY29udGVudC50eHQyaHJQSwECFAAKAAAAAABnjThRUxmBywMAAAADAAAACwAAAAAAAAAAAAAAAAAAAAAAY29udGVudC50eHRQSwUGAAAAAAEAAQA5AAAALAAAAAAA'>s=\sqrt{ h^2 + \MathQuillMathField{} }</p><br />
<p class="formula_applet" id="binom_01">(2u + 7v)^2 = \MathQuillMathField{}</p><br />
<p class="formula_applet" id="binom_02" data-zip='UEsDBAoAAAAAABpEO1HIazOjBQAAAAUAAAALAAAAY29udGVudC50eHQ0OXZeMlBLAQIUAAoAAAAAABpEO1HIazOjBQAAAAUAAAALAAAAAAAAAAAAAAAAAAAAAABjb250ZW50LnR4dFBLBQYAAAAAAQABADkAAAAuAAAAAAA='>(2u + 7v)^2 = 4u^2 + 28uv + \MathQuillMathField{}</p><br />
<p class="formula_applet" id="fraction">\frac{13t^2 - 5t}{t} = \MathQuillMathField{}</p><br />
<p class="formula_applet" id="BliBlaBlu" data-zip="UEsDBAoAAAAAAGqhdFFQFi1AAwAAAAMAAAALAAAAY29udGVudC50eHQyMXhQSwECFAAKAAAAAABqoXRRUBYtQAMAAAADAAAACwAAAAAAAAAAAAAAAAAAAAAAY29udGVudC50eHRQSwUGAAAAAAEAAQA5AAAALAAAAAAA">17x+4x=\MathQuillMathField{}</p>
<hr>
<p><button type="button" id='erase-input'>Erase input field</button></p>
<p><span id='develop'>Develop</span></p>
<p><label for="faname">Id of Formula Applet (4 to 20 characters)</label>
<input type="text" id="fa_name" name="bla_name" required minlength="4" maxlength="20" size="10"></p>
<p class="formula_applet" id="editor"><span id="math-field">17 + 4 = \class{inputfield}{21}</span></p>
<hr />
<div><p id='output-code-0'>Code 0</p></div>
<div><p id='output-code-1'>Code 1</p></div>
<div><p id='output-code-2'>Code 2</p></div>
<div><p id='output-code-3'>Code 3</p></div>
<hr>

<?php include_once 'uses.php';?>

<?php include_once 'footer.php';?>