<?php $title = 'Sample Task';
$liblist = "[ 'zip', 'mathquill', 'mathquillcss' ]";
include_once 'header.php';
?>

<script src="/js/lib/parse_brackets5.part1.js"></script>
<script src="/js/lib/parse_brackets5.part2.js"></script>
<script>
  waitfor_mathquill_and_if_ready_then_do(function () {
    prepare_page();
  });
  mathField = [];

  function base64_zip_decode( code, decode_success){
    var zip = new JSZip();
    zip.loadAsync(code, {base64: true}).then(function(data){
      zip.file("content.txt").async("string").then(function (data) {
        decode_success(data);
        // console.log(data);
     });
    });
  }

  function prepare_page() {
  console.log('**** prepare_page');
    // <!-- http://docs.mathquill.com/en/latest/Api_Methods/#mqmathfieldhtml_element-config -->
  // var lighthouse = MQ.StaticMath(document.getElementById('light-house'));
  $(".formula_applet").each(function () {
  });

  // var zip = document.getElementById('light-house').getAttribute('data-zip');
  // console.log('zip=' + zip);
  // var solution = '';
  // base64_zip_decode(zip, function(data){
  //      console.log('solution=' + data);
  //      solution = data;
  // });
// var first = lighthouse.innerFields[0];
  // var span= $('.mq-editable-field')[0];
  // console.log(span);
  // var first = MQ.MathField(span, {
  // // handlers:{
  // //     edit: function(){
  // //       console.log( first.latex() );
  // //   }
  // // }
  // });
  // first.config(
  //   {
  //   handlers:{
  //     edit: function(){
  //       console.log( first.latex() );
  //     },
  //     enter: function(){
  //       console.log('enter');
  //       check_if_equal(first.latex(), solution);
  //     }
  //   }
  //  }
  // );
  // var solution_zip='UEsDBAoAAAAAAGeNOFFTGYHLAwAAAAMAAAALAAAAY29udGVudC50eHQyaHJQSwECFAAKAAAAAABnjThRUxmBywMAAAADAAAACwAAAAAAAAAAAAAAAAAAAAAAY29udGVudC50eHRQSwUGAAAAAAEAAQA5AAAALAAAAAAA';
  // var solution = '';
  // base64_zip_decode(solution_zip, function(data){
  //      console.log('solution=' + data);
  //      solution = data;
  // });

  function check_if_equal(a, b){
    console.log(a + ' ?=? ' + b);
    myTree = new tree();
    myTree.leaf.content = a + '=' + b;
    parse(myTree);
    var almostOne = value(myTree);
    var dif = Math.abs(almostOne - 1);
    if (dif < 0.1){
      $('#light-house').removeClass('mod_wrong').addClass( 'mod_ok' );
    } else {
      $('#light-house').removeClass('mod_ok').addClass('mod_wrong');
    }

    //document.getElementById('output').innerHTML = out ;
 }

  // var myTree = new tree();

  var link = document.createElement("link");
  link.type = "text/css";
  link.rel = "stylesheet";
  link.href = "/css/gf09.css";
  document.getElementsByTagName("head")[0].appendChild(link);
  
  // concerns all formula_applets:
  $("img.mod").remove();
  ($('<img class="mod">')).insertAfter($(".formula_applet"));

  $(document).ready(function () {
    console.log('**** document ready');
    var MQ = MathQuill.getInterface(2);
  
    $(".formula_applet").each(function () {
      MQ.StaticMath(this);
      var index = $(".formula_applet").index(this); //0, 1, 2, 3,...
      var id = $(this).attr('id'); // name of formula_applet
      var hasSolution = false;
      if( $(this).attr('data-zip') !== undefined) {hasSolution = true};
      console.log(index + ' -> ' + id + ' hasSolution=' + hasSolution ) ;
      var mfSource = $(this).find('.mq-editable-field')[0];
      console.log(mfSource);
      mf = MQ.MathField(mfSource, {});
      mf.config(
        {
          handlers:{
            edit: function(){
              console.log( 'edit' );
              editHandler(id);
            },
            enter: function(){
              console.log( 'enter' );
              editHandler(id);
              // check_if_equal(first.latex(), solution);
            }
          }
        }
      );
      mathField.push(mf);
    });


  //     $(".formula_applet").click(function () {
  //     // var index = $(".formula_applet").index(this);
  //     var id = $(this).attr('id');
  //     console.log('handler '+id);
  //     editHandler(id);
  //     $(".formula_applet").removeClass('selected');
  //     $(this).addClass('selected');
  //   });

  //   // check all
  //   $( '#check' ).click( function(event){
  //     console.log('check button clicked');
  //     $("img.mod").remove();
  //     ($('<img class="mod">')).insertAfter($(".formula_applet"));

  //     $(".formula_applet").each(function () {
  //       var id = $(this).attr('id');
  //       console.log('id=' + id);
  //       editHandler(id);
  //       });
  //   });

    function editHandler(id) {
    var index = $(".formula_applet").index($( '#' + id));
    console.log('id->' + id + ' index=' + index);
    mf = mathField[index];
    out = mf.latex();
    parsetree_counter.setCounter(0);
  };

  });
}

</script>

<!-- <link href="/css/gf09.css" rel="stylesheet"> -->
</head>

<body>
<h1><?php echo $title; ?></h1>
<h2>for later use in MediaWiki</h2>

        <p id="output">output</p>
        <p><button id="check">Check all</button></p>
        <!-- p id="version">version</p -->
        <p class="formula_applet" id="light-house" data-zip='UEsDBAoAAAAAAGeNOFFTGYHLAwAAAAMAAAALAAAAY29udGVudC50eHQyaHJQSwECFAAKAAAAAABnjThRUxmBywMAAAADAAAACwAAAAAAAAAAAAAAAAAAAAAAY29udGVudC50eHRQSwUGAAAAAAEAAQA5AAAALAAAAAAA'>s=\sqrt{ h^2 + \MathQuillMathField{} }</p><br />
        <p class="formula_applet" id="binom_01">(2u + 7v)^2 = \MathQuillMathField{}</p><br />
<hr>
<?php include_once 'uses_mathquill.php';?>

<?php include_once 'footer.php';?>