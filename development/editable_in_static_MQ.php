<?php $title = 'Editable in Static MathQuill';
$liblist = "[ 'mathquill', 'mathquillcss', 'translate' ]";
$prefix="../"; 
include_once( $prefix . 'header.php' ); 
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
 // waitfor_mathquill_and_if_ready_then_do(function () {
// init();
  // });

  function init(){
    initTranslation();
// <!-- http://docs.mathquill.com/en/latest/Api_Methods/#mqmathfieldhtml_element-config -->
  var MQ = MathQuill.getInterface(2);
  var fillInTheBlank = MQ.StaticMath(document.getElementById('fill-in-the-blank'));
  var temp = fillInTheBlank.innerFields[0];
  var span= $('.mq-editable-field')[0];
  var first = MQ.MathField(span, {
    // handlers:{
    //   edit: function(){
    //     console.log('edithandler');
    //     // console.log( first.latex() );
    //   },  
    //   enter: function(){
    //     console.log('enter');
    //     // console.log( first.latex() );
    //   }  
    // }
  });
  first.config(
    {
    handlers:{
      edit: function(){
        console.log( first.latex() );
      },  
      enter: function(){
        console.log('enter');
      }  
    }
  }
  );
  // .latex() // => 'x'
  fillInTheBlank.innerFields[1].latex() // => 'y'
  console.log('page prepared');

  var answerSpan = document.getElementById('answer');
  var answerMathField = MQ.MathField(answerSpan, {
    handlers: {
      edit: function() {
        var enteredMath = answerMathField.latex(); // Get entered math in LaTeX format
        console.log(enteredMath);
      }
    }
  });
};

</script>

<hr>
<!-- http://docs.mathquill.com/en/latest/Getting_Started/#editable-math-fields -->
<p><span id="answer">x=</span></p>

<hr>
<?php include_once ($prefix . 'uses.php');?>
<?php include_once ($prefix . 'footer.php');?>