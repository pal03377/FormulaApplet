<?php $title = 'Sample Tasks';
$liblist = "[ 'hammer', 'zip', 'prepare_page', 'mathquill', 'tex_parser', 'mathquillcss', 'gf09css', 'vkbd', 'vkbdcss']";
include_once 'header.php';
?>

<script>

function init(){
  console.log('init...');
  // $('#erase-input').click(function(){
  //   var erased = erase_class(editor_mf.latex());
  //   //quick and dirty
  //   if(erased !=='???'){
  //     editor_mf.latex(erased);
  //   }
  // });
  $('#erase-input').on('mousedown',function(ev){
    ev.preventDefault();

    // $('#develop').on('mouseover', function(ev){
    var ori = editor_mf.latex();
    console.log(ori);
    // erase class{inputfield}
    var erased_1 = erase_class(ori);
    console.log(erased_1);
    var replacement = 'µ';
    if (ori.indexOf(replacement) == -1){
      // replacement has to be done before erase of class{...
      editor_mf.typedText(replacement);
      // erase class{inputfield}
      var erased_2 = erase_class(editor_mf.latex());
      console.log(erased_2);
      var part1 = '?';
      var part2 = '?';
      var part3 = '?';
      var pos = erased_2.indexOf(replacement);
      part1 = erased_2.substring(0, pos);
      part3 = erased_2.substring(pos + replacement.length);
      console.log(part1 + '|' + part3);
      // Delete part1 from beginning of erased_1
      // and delete part3 from end of erased_1
      var check = erased_1.substr(0, part1.length);
      if(check !== part1){
        console.log('Something went wrong with replacement of input field');
      }
      erased_1 = erased_1.substring(part1.length);
      console.log(erased_1);
      check = erased_1.substring(erased_1.length-part3.length);
      if(check !== part3){
        console.log('Something went wrong with replacement of input field');
      }
      part2 = erased_1.substring(0, erased_1.length-part3.length);
      console.log(part2);
      var new_latex = part1 + '\\class{inputfield}{' + part2 + '}' + part3;
      console.log(new_latex);
      editor_mf.latex(new_latex);
      // $('#editor').innerHTML = new_latex;
      $('#editor').innerHTML = 'BliBlaBlu';
    }
    // setTimeout(function(){
    //     console.log('Bim');
    //  }, 2000);
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
<p><button type="button" id='erase-input'>Set input field</button></p>
<!-- <p><span id='develop'>Develop</span></p> -->
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