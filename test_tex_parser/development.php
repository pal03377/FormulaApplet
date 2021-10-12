<?php
  $title='Development';
  $liblist = "'translate gf09css'";
  $prefix="../"; 
  include_once( $prefix . 'header.php' ); 
?>
<link href="../css/table.css" rel="stylesheet">
<script>
function init(){
  initTranslation();
}
</script>

<body>
    <h1><?php echo $title; ?></h1>
    <p><a href='tex_parser.php'>TEX Parser</a></p>
    <p><a href='editable_in_static_MQ.php'>editable_in_static_MQ.php</a></p>
    <p><a href='mathquill2tex2parser.php'>MathQuill <-> TEX -> Parser</a></p>
    <!-- <p><a href='formulaapplet2tex2tree.php'>FormulaApplet -> TEX -> Tree</a></p> -->
    <!-- <p><a href='mathquill2tex2tree.php'>MathQuill <-> TEX -> Tree</a> and tree2TEX check</p> -->
    <p><a href='tex2parser(text).php'>TEX -> Parser</a> (tree as text) </p>
    <p><a href='tex_parse_only_one.php'>tex_parse_only_one</p>
    <p><a href='sample_task_and_parse.php'>sample_task_and_parse</p>
    <hr>
    <p><a href='../tests/tests.php'>Tests</a> </p>
    <p class='tr en oth'><a href='../other/other.php'>Other solutions</a> KAS, Algebrite, MathQuill</p>
    <p class='tr de oth'><a href='../other/other.php'>Andere Ansätze</a> KAS, Algebrite, MathQuill</p>
<?php include_once ($prefix . 'uses.php');?>
<?php include_once ($prefix . 'footer.php');?>

