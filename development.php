<?php 
  $title='Development';
  $liblist = "['translate', 'gf09css']";
?>
<?php include_once( 'header.php' ); ?>
<link href="css/table.css" rel="stylesheet">
<!-- <script>
 document.onreadystatechange = function () {
  if (document.readyState == "complete") {
    initTranslation();
  }
}         
</script> -->
<script>
function init(){
  initTranslation();
}
</script>

<body>
    <h1><?php echo $title; ?></h1>
    <p><a href='problem_editor.php'>Problem Editor</a> for later use in MediaWiki</p>
    <p><a href='sample_task.php'>Sample task</a> for later use in MediaWiki</p>
    <p><a href='check_precision.php'>Check precision</a></p>
    <p><a href='check_valid_digits.php'>Check valid digits</a></p>
    <p><a href='hammer_test.php'>VKBD - Virtual Keyboard</a> - uses library 'Hammer'</p>
    <p><a href='tex_parser.php'>TEX Parser</a></p>
    <p><a href='check_if_equal.php'>Check if equal</a></p>
    <p><a href='editable_in_static_MQ.php'>editable_in_static_MQ.php</a></p>
    <p><a href='decode_encode.php'>Decode - Encode</a></p>
    <p><a href='mathquill2tex2parser.php'>MathQuill <-> TEX -> Parser</a></p>
    <p><a href='mathquill2tex2tree.php'>MathQuill <-> TEX -> Tree</a> and tree2TEX check</p>
    <p><a href='check_unit_decomposition.php'>Check Unit Decomposition</a></p>
    <p><a href='mathquill2tex2parser_no_feedback.php'>MathQuill -> TEX (without feedback) -> Parser </a></p>
    <p><a href='other.php'>Other solutions</a> KAS, Algebrite, MathQuill</p>
  <?php include_once( 'footer.php' ); ?>