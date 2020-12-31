<?php $title = 'Test Page - MathQuill Buttons (gf09)';
$liblist = "['mathquill', 'mathquillcss' ]";
include_once 'header.php';
?>

<body>
<h1><?php echo $title; ?></h1>
<p>MathQuill: <span id="editable-math"></span> <br />
<button id="sqrtA" class='button'> Square Root (cmd)</button>
<button id="sqrtB" class='button'> Square Root (typedText)</button>
<button id="integral" class='button'> Integral</button>
<button id="unit" class='button'> Unit</button></p>
<br />
<style>
.button {
  background-color: #AF4C50;
  border: none;
  color: white;
  padding: 5px 15px;
  margin: 5px;
  text-align: center;
  font-size: 16px;
  cursor: pointer;
}

.button:hover {
  background-color: red;
}
</style>

<textarea id="latex" style="width:80%;vertical-align:top">a^2 + b^2</textarea>

<script>
  function init(){
    console.log( 'init' );

    var eMath = $('#editable-math')[0]; latexSource = $('#latex'); 
    sqrt_buttonA = $('#sqrtA'); sqrt_buttonB = $('#sqrtB'); integral_button = $('#integral'); unit_button = $('#unit');

    var MQ = MathQuill.getInterface(2);
    mf = MQ.MathField(eMath, {handlers:{
      edit: function(){
        latexSource.val(mf.latex());
      }
    }});

    sqrt_buttonA.click( function() {
      console.log('sqrt_button A event');
      mf.cmd('\\sqrt');
    });

    sqrt_buttonB.click( function() {
      console.log('sqrt_button B event');
      mf.typedText('\\sqrt ');
    });

    integral_button.click( function() {
      console.log('integral_button event');
      mf.typedText('\\int ');
    });
    unit_button.click( function() {
      console.log('unit_button event');
      var temp = mf.latex();
      temp +='\\unit{ }';
      mf.latex(temp);
   });

    latexSource.bind('keydown keypress', function() {
    var oldtext = latexSource.val();
    setTimeout(function() {
      var newtext = latexSource.val();
      if(newtext !== oldtext) {
        console.log(newtext);
        mf.latex(newtext);
       }
    });
  });

  mf.latex(latexSource.val());
 }

 window.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOM fully loaded and parsed');
    libLoaderReady = true;
 });

 window.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOM fully loaded and parsed');
    waitfor_mathquill_and_if_ready_then_do( init );
 });

</script>

 <?php include_once 'footer.php'; ?>