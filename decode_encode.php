<?php $title = 'Decode - Encode (gf09)';
$liblist = "['decode']";
include_once 'header.php';
?>

<body>
<h1><?php echo $title; ?></h1>
<h2>See console!</h2>
<!-- <p>Paste the following lines into the file <em>decode.js</em></p>
<textarea id='permutations' rows=22 cols=213></textarea> -->
<script>

function test(text){
    var encoded = encode(text);
    var decoded = decode(encoded);
    if( text == decoded){
      decoded += ' OK';
    } else {
      decoded += ' ERROR';
    }
    console.log(encoded + '->' + decoded);
  }

  function init(){
    // create_permutations();
    test('ganzVielGeheim');
    test('g=a+n/kNurrBliBlablu');
    test('Leerzeichen Ist Nicht Im Zeichensatz BliBlaBlu');
    test('Auch / und \' und \\ werden codiert, ohne abzustürzen');
    test('Ebenso \r und \n - #erstaunlich!');
    test('der große Test');
    test('@µß?§$€');
    test('ÄÖÜäöüß\/');
    test('Sonderzeichen.´`\'#*');
    test('\u3176\u2702\u274b\u274c\u316d');
    test('2hr');
    test('49v^2');
    test('Besonders lange Strings sind interessant zu codieren, wenn sie Sonderzeichen wie @ und µ und \\ oder " und \" enthalten.');
    test('Ab>cD?');


}

 function init_old(){
    console.log( 'init' );

 
  
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
}

  function decode_encode_permutation(text, perm){
    var result = '';
    for(var i = 0; i< text.length; i++){
      var char = text[i].toString();
      result += perm[char];
    }
    return result;
  }

}





</script>

 <?php include_once 'footer.php';?>