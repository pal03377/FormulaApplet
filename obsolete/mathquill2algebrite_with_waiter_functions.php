<?php $title='Test Page - MathQuill2Algebrite (gf09)' ?>
<?php include_once( 'header.php' ); ?>
<!-- header - require - lib.loader - mathquill etc. -->
</head>

<body>
  <p>Type math here: <span id="math-field"></span></p>
  <p id="middle">LaTeX of what you typed: <span id="latex"></span></p>

  <textarea id="output" name="terminal" rows="4" cols="80" style="width:100%;"></textarea>

  <script>

     // https://stackoverflow.com/questions/7486309/how-to-make-script-execution-wait-until-jquery-is-loaded
     function waitfor_jquery_and_if_ready_then_do(jquery_ready) {
        if (window.jQuery) {
            jquery_ready();
        } else {
            console.log( 'waiting for jQuery...' );
            setTimeout(function () { waitfor_jquery_and_if_ready_then_do(jquery_ready) }, 50);
        }
    }

    function waitfor_scripts_and_if_ready_then_do(scripts_ready) {
        if (scriptsReady) {
            scripts_ready();
        } else {
            console.log( 'waiting for scripts...' );
            setTimeout(function () { waitfor_scripts_and_if_ready_then_do(scripts_ready) }, 50);
        }
    }

    // https://learn.jquery.com/using-jquery-core/document-ready/
        waitfor_jquery_and_if_ready_then_do(
          function(){
            console.log("jQuery is ready...");
            $(function () {
            console.log( 'DOM ready.' );
            waitfor_scripts_and_if_ready_then_do(function(){
              mathFieldSpan = $('span#math-field');
              latexSpan = $('span#latex');
              MQ = MathQuill.getInterface(2); // for backcompat
              this.observer = new MutationObserver( function(mutations) {
                console.log( latexSpan.text() );
                execute( latexSpan.text() );
              }.bind(this));
              this.observer.observe(latexSpan.get(0), {characterData: true, childList: true});
            });
          })
        });

     
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
</script>

 <?php include_once( 'footer.php' ); ?>