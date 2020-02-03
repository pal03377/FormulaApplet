<?php 
$title='Test Page - Tex2MathQuill';
$liblist = "['mathquill', 'algebrite' ]";
include_once( 'header.php' );
?>


<body>
  <textarea id="latex" style="width:80%;vertical-align:top"></textarea>
    <p>MathQuill: <span id="math-field" class="mathquill-editable">\frac{d}{dx}\sqrt{x}= 3,5 \unit{\frac{km}{h}}</span></p>
  <p>Algebrite: </p>
  <textarea id="output" name="terminal" rows="4" cols="80" style="width:100%;"></textarea>
  <hr>
  <pre id="math-text">empty</pre>
  <hr>
  <pre id="html-source">empty</pre>
  <hr>
  <!-- script type="text/javascript" src="js/lib/mathquill-0.10.1/mathquill.js"></script -->
  <script>
  // TODO: put these waiting functions into glue.js
  
  function waitfor_libLoader_and_if_ready_then_do(ll_ready) {
          if ( libLoaderReady == true ) {
              ll_ready();
          } else {
              console.log( 'waiting for libLoader...' );
              setTimeout(function () { waitfor_libLoader_and_if_ready_then_do(ll_ready) }, 50);
          }
  }

  function waitfor_mathquill_and_if_ready_then_do(mq_ready) {
    // console.log( typeof MathQuill );
    if ( (typeof MathQuill) === "undefined" ) {s
        console.log( 'waiting for MathQuill...' );
        setTimeout(function () { waitfor_mathquill_and_if_ready_then_do(mq_ready) }, 50);
    } else {
       console.log( 'MathQuill ready.' );
       mq_ready();
    }
  }

  waitfor_libLoader_and_if_ready_then_do( function() {
      waitfor_mathquill_and_if_ready_then_do( init );
  }) 
 
  function init(){
    // console.log( 'MQ=' + MQ );
    mathField = document.getElementById( '#math-field' ); latexSource = $('#latex'), htmlSource = $('#html-source'), MathText = $('#math-text');
    MQ = MathQuill.getInterface(2); // for backcompat
    var mathQuillField = MQ.MathField( mathField );
    console.log( 'mathField' );
    console.log( mathField );
	  console.log( 'mathQuillField' );
    console.log( mathQuillField );
	
    mathField.bind('keydown keypress', function() {
      setTimeout(function() {
        var latex = mathQuillField.mathquill('latex');
        latexSource.val(latex);
        htmlSource.text(printTree(mathField.mathquill('html')));
        MathText.text(mathField.mathquill('text'));
      });
    }).keydown().focus();

  latexSource.bind('keydown keypress', function() {
    var oldtext = latexSource.val();
    setTimeout(function() {
      var newtext = latexSource.val();
      if(newtext !== oldtext) {
        mathField.mathquill('latex', newtext);
        htmlSource.text(printTree(mathField.mathquill('html')));
        MathText.text(mathField.mathquill('text'));
		runAlgebrite();
      }
    });
  });
 }
      
  function runAlgebrite() {
    textToBeExecuted = mathField.text();
    try {
      var result;
      if (/Algebrite\.[a-z]/.test(textToBeExecuted) || /;[ \t]*$/.test(textToBeExecuted)) {
        result = eval(textToBeExecuted);
      }
      else {
        result = Algebrite.run(textToBeExecuted);
      }
      //alert(result);
      $('#output').val(result)
    }
    catch (err) {
      var errDesc = err;
      // errorBox.update('<h4>Error!<\/h4><code>' + errDesc + '<\/code>');
      // errorBox.show();
      console.log('Error: ' +  errDesc );
    }
  }
  // console.log( 'libLoader=' + libLoader );
 </script>

 <?php include_once( 'footer.php' ); ?>