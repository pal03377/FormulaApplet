<?php $title = 'Sample Task';
$liblist = "[ 'mathquill', 'mathquillcss' ]";
include_once 'header.php';
?>

<script src="/js/lib/parse_brackets5.part1.js"></script>
<script src="/js/lib/parse_brackets5.part2.js"></script>
<script>
  waitfor_mathquill_and_if_ready_then_do(function () {
    prepare_page();
  });

  function prepare_page() {

    // <!-- http://docs.mathquill.com/en/latest/Api_Methods/#mqmathfieldhtml_element-config -->
  var MQ = MathQuill.getInterface(2);
  var lighthouse = MQ.StaticMath(document.getElementById('light-house'));
  // var first = lighthouse.innerFields[0];
  var span= $('.mq-editable-field')[0];
  var first = MQ.MathField(span, {handlers:{
      edit: function(){
        console.log( first.latex() );
    }
  }});
  console.log('first=' + first);

  //   var MQ = MathQuill.getInterface(2);
  //   var mathField = new Array();
  //   var out = '';
  //   var myTree = new tree();

  //   // Parse from LaTeX ...
  var link = document.createElement("link");
  link.type = "text/css";
  link.rel = "stylesheet";
  link.href = "/css/gf09.css";
  document.getElementsByTagName("head")[0].appendChild(link);

  //   $(document).ready(function () {
    
  //   $(".tex-example").each(function () {
  //     var index = $(".tex-example").index(this);
  //     var id = $(this).attr('id');
  //     mf = MQ.MathField(this, {
  //       handlers: {
  //         edit: function () {
  //           console.log(index + ' ' + id);
  //           // editHandler(index);
  //           editHandler(id);
  //         }
  //       }
  //     });
  //     mathField.push(mf);
  //   });
  //   $("img.mod").remove();
  //   ($('<img class="mod">')).insertAfter($(".tex-example"));
  //  });

  //     $(".tex-example").click(function () {
  //     // var index = $(".tex-example").index(this);
  //     var id = $(this).attr('id');
  //     console.log('handler '+id);
  //     editHandler(id);
  //     $(".tex-example").removeClass('selected');
  //     $(this).addClass('selected');
  //   });

  //   // check all
  //   $( '#check' ).click( function(event){
  //     console.log('check button clicked');
  //     $("img.mod").remove();
  //     ($('<img class="mod">')).insertAfter($(".tex-example"));

  //     $(".tex-example").each(function () {
  //       var id = $(this).attr('id');
  //       console.log('id=' + id);
  //       editHandler(id);
  //       });
  //   });

  //   function editHandler(id) {
  //   var index = $(".tex-example").index($( '#' + id));
  //   console.log('id->' + id + ' index=' + index);
  //   mf = mathField[index];
  //   // var out = mf.latex();
  //   out = mf.latex();
  //    myTree = new tree();
  //    myTree.leaf.content = mf.latex();
  //   parse(myTree);
  //   var almostOne = value(myTree);
  //   var dif = Math.abs(almostOne - 1);
  //   if (dif < 0.1){
  //     $( '#' + id).removeClass('mod_wrong').addClass( 'mod_ok' );
  //   } else {
  //     $( '#' + id).removeClass('mod_ok').addClass('mod_wrong');
  //   }
      
  //   document.getElementById('output').innerHTML = out ;
  //   parsetree_counter.setCounter(0);
  // };

};

</script>

<!-- <link href="/css/gf09.css" rel="stylesheet"> -->
</head>

<body>
<h1><?php echo $title; ?></h1>
<h2>for later use in MediaWiki</h2>

        <p id="output">output</p>
        <p><button id="check">Check all</button></p>
        <!-- p id="version">version</p -->
        <p class="tex-example" id="light-house">s=\sqrt{ h^2 + \MathQuillMathField{2hr} }</p><br />
<hr>
<?php include_once 'uses_mathquill.php';?>

<?php include_once 'footer.php';?>