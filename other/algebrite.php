<?php $title='Test Page - Algebrite (gf09) ';
  $liblist = "['algebrite', 'translate' ]";
  $prefix="../"; include_once( $prefix . 'header.php' );
?>
  
  <link rel="stylesheet" href="./Algebrite_files/styles.css">
  <link rel="stylesheet" href="./Algebrite_files/github-light.css">
  <!--[if lt IE 9]>
      <script src="//html5shiv.googlecode.com/svn/trunk/html5.js"></script>
      <![endif]-->

<body>
  <h1>Test Page - Algebrite (gf09)</h1>

  <h3>Sandbox</h3>

  <div style="width:100%;">
    <textarea id="terminal1" name="terminal" rows="2" cols="80" style="width:100%;margin-bottom:-5px;">input</textarea>
    <textarea id="output1" name="terminal" rows="4" cols="80" style="width:100%;"></textarea>
    <!--
    <input name="execute" value="▶" onclick="execute(1);" type="button">
    -->
  </div>
  <br>


  <script src="./Algebrite_files/scale.fix.js"></script>
  <!-- script src="./Algebrite_files/jquery.min.js"></script> -->
  <script src="./Algebrite_files/algebrite.bundle-for-browser.js"></script>
  <script type="text/javascript" language="javascript">
    function init(){
      initTranslation();
    }
   window.onkeypress = LogKey;
    function LogKey(e) {
      if (e.code == 'Enter') {
        var el_id = e.target.id;
        if (el_id == 'terminal1') {
          // console.log( 'Enter on terminal1' );
          execute(1);
          //erase terminal1
          $( '#terminal1' ).val( '' );
        }
      }
    }
    function execute(whichTerminal) {
      // var sandbox = $('sandbox');
      // var jsResult = $('jsResult');
      try {
        var textToBeExecuted = $('#terminal' + whichTerminal).val();
        var result;
        if (/Algebrite\.[a-z]/.test(textToBeExecuted) || /;[ \t]*$/.test(textToBeExecuted)) {
          result = eval(textToBeExecuted);
        }
        else {
          result = Algebrite.run(textToBeExecuted);
        }
        //alert(result);
        $('#output' + whichTerminal).val(result)
      }
      catch (err) {
        var errDesc = err;
        errorBox.update('<h4>Error!<\/h4><code>' + errDesc + '<\/code>');
        errorBox.show();
      }
    }
  </script>
<?php include_once ($prefix . 'uses.php');?>
<?php include_once ($prefix . 'footer.php');?>