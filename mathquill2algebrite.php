<?php $title='Test Page - MathQuill2Algebrite (gf09)' ?>
<?php include_once( 'header.php' ); ?>
<!-- header - require - lib.loader - mathquill etc. -->
</head>

<body>
  <p>Type math here: <span id="math-field"></span></p>
  <p id="middle">LaTeX of what you typed: <span id="latex"></span></p>

  <textarea id="output" name="terminal" rows="4" cols="80" style="width:100%;"></textarea>

  <script>
  var libLoader = false;
  function waitfor_libLoader_and_if_ready_then_do(ll_ready) {
          // console.log( 'libLoader=' + libLoader);
          if ( libLoader == true ) {
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
            // console.log( 'init observer.......' );
            init_observer(this);
        }
      ) 
    }
  );

  function init_observer(obj){
      console.log( 'Init Observer' );
      mathFieldSpan = $('span#math-field');
      latexSpan = $('span#latex');
      //MQ = MathQuill.getInterface(2); // for backcompat
      obj.observer = new MutationObserver( function(mutations) {
        console.log( latexSpan.text() );
        execute( latexSpan.text() );
      }.bind(obj));
      obj.observer.observe(latexSpan.get(0), {characterData: true, childList: true});
  }
      
  function execute(latexInput) {
    console.log('execute ' + latexInput);
    // const AL= new AlgebraLatex();
    // AL.parseLatex(latexInput)
    // textToBeExecuted = AL.toMath();
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