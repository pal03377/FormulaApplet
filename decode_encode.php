<?php $title = 'Decode - Encode (gf09)';
$liblist = "['zip', 'mathquill', 'mathquillcss' ]";
include_once 'header.php';
?>

<body>
<h1><?php echo $title; ?></h1>
<p><a href='https://stuk.github.io/jszip/'>JSZip Doc</a></p>

<script>
  waitfor_libLoader_and_if_ready_then_do( function() {
      waitfor_mathquill_and_if_ready_then_do( init );
  })

  function init(){
    console.log( 'init' );
    var zip = new JSZip();
    zip.file("Hello.txt", "Hello World\n");
    zip.generateAsync({type:"base64"}).then(function(content) { 
      console.log(content);
    var zip = new JSZip();
    zip.loadAsync(content, {base64: true}).then(function(data){
      console.log(zip.name);
      zip.file("Hello.txt").async("string").then(function (data) {
        console.log(data);
});
    });
   });
  }
</script>

 <?php include_once 'footer.php'; ?>