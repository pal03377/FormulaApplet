<?php $title = 'Decode - Encode (gf09)';
$liblist = "['zip']";
include_once 'header.php';
?>

<body>
<h1><?php echo $title; ?></h1>
<h2>See console!</h2>
<p><a href='https://stuk.github.io/jszip/'>JSZip Doc</a></p>

<script>
  function prepare_pg(){
    init();
  }
  
 function init(){
    console.log( 'init' );

   function base64_zip_encode(content, encode_success){
    var zip = new JSZip();
    zip.file("content.txt", content);
    zip.generateAsync({type:"base64"}).then( function(zipcontent){
      encode_success(zipcontent);
    });
  }

  function encode_success(zipcontent){
    console.log(zipcontent);
    base64_zip_decode(zipcontent, decode_success);
  }

  function decode_success(text){
    console.log(text);
  }

  function base64_zip_decode( code, decode_success){
    var zip = new JSZip();
    zip.loadAsync(code, {base64: true}).then(function(data){
      zip.file("content.txt").async("string").then(function (data) {
        decode_success(data);
        // console.log(data);
     });
    });
  }

  function test(string){
    console.log(string);
    base64_zip_encode(string, function(code){
      console.log('code=' + code);
      base64_zip_decode(code, function(data){
        if( string == data){
          data += ' OK';
        } else {
          data += ' ERROR';
        }
        console.log(data);
        // console.log( ' ');
      });
    });
  }

  test('der große Test');
  test('@µß?§$€');
  test('ÄÖÜäöüß\/');
  test('Sonderzeichen.´`\'#*');
  test('\u3176\u316d\u2702\u274b\u274c');
  test('2hr');
  test('49v^2');
 
}

</script>

 <?php include_once 'footer.php';?>