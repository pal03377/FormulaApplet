<?php $title = 'Decode - Encode (gf09)';
$liblist = "['zip', 'mathquill', 'mathquillcss' ]";
include_once 'header.php';
?>

<body>
<h1><?php echo $title; ?></h1>

<script>
  waitfor_libLoader_and_if_ready_then_do( function() {
      waitfor_mathquill_and_if_ready_then_do( init );
  })

  function init(){
    console.log( 'init' );
    var zip = new JSZip();
    zip.file("Hello.txt", "Hello World\n");
    zip.generateAsync({type:"blob"}).then(function(content) { 
      console.log(content);
   });
  }
</script>

 <?php include_once 'footer.php'; ?>