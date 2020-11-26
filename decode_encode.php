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
    // test2(string);
  }

  // https://attacomsian.com/blog/javascript-base64-encode-decode
  // https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent
  // https://stackoverflow.com/questions/30106476/using-javascripts-atob-to-decode-base64-doesnt-properly-decode-utf-8-strings
    function encodeUnicode(str) {
    // first we use encodeURIComponent to get percent-encoded UTF-8,
    // then we convert the percent encodings into raw bytes which
    // can be fed into btoa.
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
        function toSolidBytes(match, p1) {
            return String.fromCharCode('0x' + p1);
    }));
  }

  function decodeUnicode(str) {
    // Going backwards: from bytestream, to percent-encoding, to original string.
    return decodeURIComponent(atob(str).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  }

  function test2(string){
    var permutations = init_alpha_permutation();
    console.log(string);
    code = encodeUnicode(string);
    console.log('code1=' + code);
    code = decode_encode_permutation(code, permutations[0]);
    console.log('code2=' + code);
    code = decode_encode_permutation(code, permutations[1]);
    data = decodeUnicode(code);
    if( string == data){
      data += ' OK';
    } else {
      data += ' ERROR';
    }
    console.log(data);
  }

  function init_permutation(n){
    var p = [];
    var q = [];
    for(var i = 0; i<n; i++){
      p[i] = i;
      q[i] = i;
    }
    return [p, q];
  }

  function init_alpha_permutation(){
    // var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    var n = characters.length;
    var p_alpha = [];
    var q_alpha = [];
    for(var i = 0; i< n; i++){
      var char = characters[i].toString();
      p_alpha[char] = char;
      q_alpha[char] = char;
    }
    // console.log(p_alpha);
    var temp = init_permutation(n)
    var p = temp[0];
    var q = temp[1];
    for(var i = 0; i< 50* n; i++){
      random_swap(p, q, n);
    }
    var h = [];
    for(var i = 0; i< n; i++){
      var char = characters[i].toString();
      h[char] = characters[p[i]].toString(); 
    }
    for(var i = 0; i< n; i++){
      var char = characters[i].toString();
      p_alpha[char] = h[char].toString();
    }
    for(var i = 0; i< n; i++){
      var char = characters[i].toString();
      h[char] = characters[q[i]].toString(); 
    }
    for(var i = 0; i< n; i++){
      var char = characters[i].toString();
      q_alpha[char] = h[char].toString();
    }
    return [p_alpha, q_alpha];
    // for(var i = 0; i< n; i++){
    //   var char = characters[i];
    //   console.log(char + '->' + q_alpha[p_alpha[char]])
    // }

}

  function decode_encode_permutation(text, perm){
    var result = '';
    for(var i = 0; i< text.length; i++){
      var char = text[i].toString();
      result += perm[char];
    }
    return result;
  }

  function swap(p , q, i ,j){
    var h = p[i];
    p[i] = p[j];
    p[j] = h;
    var ii= p[i];
    var jj = p[j];
    h = q[ii];
    q[ii] = q[jj];
    q[jj] = h;
  }

  function random_swap(p, q, n){
    var i = Math.floor(Math.random() * n);  
    var j = Math.floor(Math.random() * n);
    swap(p, q, i, j);  
  }

  test('der große Test');
  test('@µß?§$€');
  test('ÄÖÜäöüß\/');
  test('Sonderzeichen.´`\'#*');
  test('\u3176\u316d\u2702\u274b\u274c');
  test('2hr');
  test('49v^2');
  test('Besonders lange Strings sind interessant zu codieren, wenn sie Sonderzeichen wie @ und µ und \\ oder " und \" enthalten.');
  test('Ab>cD?');

  // var test = 'test ';
  // for(var i = 0; i< n; i++){
  //   var x = q[p[i]];
  //   test += x;
  //   test += ' ';
  // }
  // console.log(test);
  
  // var text = 'Kann keine Umlaute aber 3967 enhalten';
  // console.log(text);
  // var perm = init_alpha_permutation();
  // var code = decode_encode_permutation(text, perm[0]);
  // console.log(code);
  // var data = decode_encode_permutation(code, perm[1]);
  // console.log(data);

 }





</script>

 <?php include_once 'footer.php';?>