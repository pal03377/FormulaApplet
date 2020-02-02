<?php $title='Test Page - Tex2MathQuill' ?>
<?php include_once( 'header.php' ); ?>
<!-- header - require - lib.loader - mathquill etc. -->
</head>

<body>
  <p>LaTeX: <span id="latex"></span></p>
  <p>MathQuill Eingabe: <span id="math-field" class="mathquill-editable">\frac{d}{dx}\sqrt{x}= 3,5 \unit{\frac{km}{h}}</span></p>
  <p>Algebrite Ausgabe: </p>
  <textarea id="output" name="terminal" rows="4" cols="80" style="width:100%;"></textarea>
  <hr>
  <pre id="math-text">empty</pre>
  <hr>
  <pre id="html-source">empty</pre>
  <hr>

  <script>
  // TODO: put these waiting functions into lib-loader.js
  
  function waitfor_libLoader_and_if_ready_then_do(ll_ready) {
          // console.log( 'libLoader=' + libLoad.libLoaderReady);
          if ( libLoad.libLoaderReady == true ) {
              ll_ready();
          } else {
              // console.log( 'waiting for libLoader...' );
              setTimeout(function () { waitfor_libLoader_and_if_ready_then_do(ll_ready) }, 50);
          }
  }

  // https://stackoverflow.com/questions/7486309/how-to-make-script-execution-wait-until-jquery-is-loaded
  function waitfor_jquery_and_if_ready_then_do(jquery_ready){
    // console.log( 'window.jQuery =' + window.jQuery);
    if (window.jQuery) {
        // console.log( 'jQuery is available' );
        jquery_ready();
    } else {
        // console.log( 'Waiting for jQuery...' );
        setTimeout(function () { waitfor_jquery_and_if_ready_then_do(jquery_ready) }, 50);
    }
  }

  // waitfor_jquery_and_if_ready_then_do( waitfor_libLoader_and_if_ready_then_do( init_observer(this) ) );
  waitfor_jquery_and_if_ready_then_do( function(){
      waitfor_libLoader_and_if_ready_then_do( function() {
            init();
      }) 
  });

  function init(){
    var mathField = $('#math-field'), latexSource = $('#latex'), htmlSource = $('#html-source'), MathText = $('#math-text');
	
    mathField.bind('keydown keypress', function() {
      setTimeout(function() {
        var latex = mathField.mathquill('latex');
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