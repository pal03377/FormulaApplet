<?php 
  $title='Tests';
  $liblist = "'translate gf09css'";
  $prefix="../"; 
  include_once( $prefix . 'header.php' );
?>
 <link href="../css/table.css" rel="stylesheet">
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
    <p><a href='check_precision.php'>Check precision</a></p>
    <p><a href='check_valid_digits.php'>Check valid digits</a></p>
    <p><a href='hammer_test.php'>virtualKeyboard - Virtual Keyboard</a> - uses library 'Hammer'</p>
    <p><a href='check_if_equal.php'>Check if equal</a></p>
    <p><a href='decode_encode.php'>Decode - Encode</a></p>
    <p><a href='check_unit_decomposition.php'>Check Unit Decomposition</a></p>
    <p><a href='tex_parse_only_one.php'>parse only one</a></p>
    <p><a href='auto_include.php'>auto_include</a></p>
    <hr>
    <p><a href='../development/development.php'>Development</a> </p>
    <p><a href='../other/other.php'>Other solutions</a> KAS, Algebrite, MathQuill</p>
    <hr>

<?php include_once ($prefix . 'uses.php');?>
<?php include_once ($prefix . 'footer.php');?>