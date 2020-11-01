<?php
  $title='Test Page - Tex2KAS';
  $liblist = "['mathquill', 'mathquillcss', 'kas']";
  include_once( 'header.php' );
?>

<body>
  <p>MathQuill: <span id="editable-math"></span></p>
  <p>LaTeX:</p>
  <!-- textarea id="latex" style="width:80%;vertical-align:top">\frac{d}{dx}\sqrt{x} = 3.5 \textcolor{blue}{\frac{km}{h}} </textarea -->
  <textarea id="latex" style="width:80%;vertical-align:top">\frac{d}{dx}\sqrt{x} = 3.5\frac{km}{h} </textarea>
   <p>KAS: Printed Representation</p>
  <textarea id="output" name="terminal" rows="4" cols="80" style="width:100%;">KAS</textarea>
  <hr>
  
  <script>
    function init(){
    console.log( 'init' );


    var eMath = $('#editable-math')[0]; latexSource = $('#latex');
    var MQ = MathQuill.getInterface(2);
    mf = MQ.MathField(eMath, {handlers:{
      edit: function(){
        // console.log(mf.latex());
        latexSource.val(mf.latex());
        parseKAS(mf);
      }
    }});

    mf.latex(latexSource.val());
    parseKAS(mf);

    latexSource.bind('keydown keypress', function() {
    var oldtext = latexSource.val();
    setTimeout(function() {
      var newtext = latexSource.val();
      if(newtext !== oldtext) {
        // console.log(newtext);
        mf.latex(newtext);
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
      $('#output').val(result);
    }
    catch (err) {
      var errDesc = err;
      console.log('Error: ' +  errDesc );
    }
  }

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

  window.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOM fully loaded and parsed');
    waitfor_mathquill_and_if_ready_then_do( function(){
        waitfor_KAS_and_if_ready_then_do( function(){ init();  });
      });
   });

 </script>

 <?php include_once( 'footer.php' ); ?>