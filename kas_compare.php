<?php
  $title='Test Page - KAS Compare';
  $liblist = "['mathquill', 'mathquillcss', 'kas' ]";
  include_once( 'header.php' );
?>

<body>
  <p>Left: <span id="editable-math-left"></span>  Right: <span id="editable-math-right"></span></p>
  <textarea id="latex-left" style="width:40%;vertical-align:top">\frac{1}{u} - \frac{1}{v}</textarea>
  <textarea id="latex-right" style="width:40%;vertical-align:top">\frac{v - u}{uv} </textarea>
   <p>KAS</p>
  <textarea id="output-left" name="terminal" rows="4" cols="80" style="width:100%;">KAS</textarea>
  <textarea id="output-right" name="terminal" rows="4" cols="80" style="width:100%;">KAS</textarea>
  <hr>
  
  <script>
  function waitfor_KAS_and_if_ready_then_do(KAS_ready) {
    // console.log( 'window.jQuery =' + window.jQuery);
    if (typeof KAS !== 'undefined') {
      console.log('KAS is available');
      KAS_ready();
    } else {
      console.log('Waiting for KAS...');
      setTimeout(function () {
        waitfor_KAS_and_if_ready_then_do(KAS_ready)
      }, 50);
    }
  }

  waitfor_libLoader_and_if_ready_then_do( function() {
     waitfor_mathquill_and_if_ready_then_do( function(){
        waitfor_KAS_and_if_ready_then_do( function(){ init();  });
      });
    });
  
  function init(){
    console.log( 'init' );


    var eMathLeft = $('#editable-math-left')[0]; latexLeft = $('#latex-left');
    var eMathRight = $('#editable-math-right')[0]; latexRight = $('#latex-right');
    var MQ = MathQuill.getInterface(2);
    mfLeft = MQ.MathField(eMathLeft, {handlers:{
      edit: function(){
        // console.log(mf.latex());
        latexLeft.val(mfLeft.latex());
        $('#output-left').val(parseKAS(mfLeft));
      }
    }});
    mfRight = MQ.MathField(eMathRight, {handlers:{
      edit: function(){
        // console.log(mf.latex());
        latexRight.val(mfRight.latex());
        $('#output-right').val(parseKAS(mfRight));
      }
    }});

    mfLeft.latex(latexLeft.val());
    $('#output-left').val(parseKAS(mfLeft));
    mfRight.latex(latexRight.val());
    $('#output-right').val(parseKAS(mfRight));

    latexLeft.bind('keydown keypress', function() {
    var oldtext = latexLeft.val();
    setTimeout(function() {
      var newtext = latexLeft.val();
      if(newtext !== oldtext) {
        // console.log(newtext);
        mfLeft.latex(newtext);
        //mf.reflow();
      }
    });
  });
    latexRight.bind('keydown keypress', function() {
    var oldtext = latexRight.val();
    setTimeout(function() {
      var newtext = latexRight.val();
      if(newtext !== oldtext) {
        // console.log(newtext);
        mfRight.latex(newtext);
        //mf.reflow();
      }
    });
  });
 }
      
  function parseKAS(mf) {
    try {
      // console.log(mf.latex());
      var parsed = KAS.parse(mf.latex(), {}).expr;
      var result = parsed.normalize().print() + "\n" + parsed.simplify().normalize().print();
      return result;
    }
    catch (err) {
      var errDesc = err;
      console.log('Error: ' +  errDesc );
    }
  }
 </script>

 <?php include_once( 'footer.php' ); ?>