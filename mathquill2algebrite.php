<?php $title='Test Page - MathQuill (gf09)' ?>
<?php include_once( 'header.php' ); ?>
</head>

<body>
  <p>Type math here: <span id="math-field"></span></p>
  <p id="middle">LaTeX of what you typed: <span id="latex"></span></p>

  <textarea id="output" name="terminal" rows="4" cols="80" style="width:100%;"></textarea>

  <script>
     // https://stackoverflow.com/questions/7486309/how-to-make-script-execution-wait-until-jquery-is-loaded
     function waitfor_jquery(jquery_ready) {
        if (window.jQuery) {
            jquery_ready();
        } else {
            setTimeout(function () { waitfor_jquery(jquery_ready) }, 50);
        }
    }

    waitfor_jquery(function () {
        console.log("jQuery is ready...");
        this.observer = new MutationObserver( function(mutations) {
          console.log( $( 'span#latex' ).text() );
          execute($( 'span#latex' ).text());
        }.bind(this));
        this.observer.observe($( 'span#latex' ).get(0), {characterData: true, childList: true});
    });
     
  // function execute_temp(latexInput) {
  //   console.log('execute ' + latexInput);
  //   const AL= new AlgebraLatex();
  //   console.log( AL );
  //   AL.input = latexInput;
  //   AL.parseLatex;
  //   textToBeExecuted = AL.toMath;
  //   try {
  //       var result;
  //     if (/Algebrite\.[a-z]/.test(textToBeExecuted) || /;[ \t]*$/.test(textToBeExecuted)) {
  //       result = eval(textToBeExecuted);
  //     }
  //     else {
  //       result = Algebrite.run(textToBeExecuted);
  //     }
  //     //alert(result);
  //     $('#output').val(result)
  //   }
  //   catch (err) {
  //     var errDesc = err;
  //     // errorBox.update('<h4>Error!<\/h4><code>' + errDesc + '<\/code>');
  //     // errorBox.show();
  //     console.log('Error: ' +  errDesc );
  //   }
  // }
  function execute(latexInput){
    console.log(latexInput);
  }
</script>

 <?php include_once( 'footer.php' ); ?>