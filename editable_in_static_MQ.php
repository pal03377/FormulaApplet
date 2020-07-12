<?php $title = 'Editable in Static MathQuill';
$liblist = "[ 'mathquill', 'mathquillcss' ]";
include_once 'header.php';
?>
<!-- derived from MathQuill e-math edition -->

<!-- Scripts: jquery, mathquill, bind javascript to HTML -->
<!-- script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script -->
<!-- script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.js"></script -->

<!-- script src="cdnjs.cloudflare.com_ajax_libs_mathquill_0.10.1.js"></script -->
<!-- script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/mathquill/0.10.1/mathquill.js"></script -->
<!-- link rel="stylesheet" href="cdnjs.cloudflare.com_ajax_libs_mathquill_0.10.1.css" -->
<!-- link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/mathquill/0.10.1/mathquill.css" -->

<style type="text/css">
code span {
  font: 150% Verdana, sans-serif;
}
#html-source {
  font-size: 90%;
  white-space: pre-wrap;
  background-color: LightBlue;
}
.mathquill-rendered-math .mathquill-editable {
  min-width: 1cm;
}
.unit {
  color: blue;
}
.mq-editable-field {
  background-color: LightYellow;
}
</style>

</head>
<body>
<h1><?php echo $title; ?></h1>
<h2>gf09</h2>

<span id="fill-in-the-blank">\sqrt{ \MathQuillMathField{x}^2 + \MathQuillMathField{y}^2 }</span>
<script>
 waitfor_mathquill_and_if_ready_then_do(function () {
    prepare_page();
  });

  function prepare_page(){
// <!-- http://docs.mathquill.com/en/latest/Api_Methods/#mqmathfieldhtml_element-config -->
var MQ = MathQuill.getInterface(2);
  var fillInTheBlank = MQ.StaticMath(document.getElementById('fill-in-the-blank'));
  var first = fillInTheBlank.innerFields[0];
  var span= $('.mq-editable-field')[0];
  first = MQ.MathField(span, {handlers:{
    edit: function(){
        console.log( first.latex() );
    }
  }});
  // .latex() // => 'x'
  fillInTheBlank.innerFields[1].latex() // => 'y'
};
</script>

<hr>
<?php include_once 'uses_mathquill.php';?>
<?php include_once 'footer.php';?>