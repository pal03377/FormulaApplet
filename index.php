<?php 
  $title='Test Page - Formula Applet (gf09) ';
  $liblist = "['end' ]";
?>
<?php include_once( 'header.php' ); ?>
<link href="css/table.css" rel="stylesheet">
</head>

<body>
    <h1><?php echo $title; ?></h1>
    <p><a href='tex_parser.php'>TEX Parser</a></p>
    <p><a href='check_if_equal.php'>Check if equal</a></p>
    <p><a href='editable_in_static_MQ.php'>editable_in_static_MQ.php</a></p>
    <p><a href='decode_encode.php'>Decode - Encode</a></p>
    <p><a href='mathquill2tex2parser.php'>MathQuill <-> TEX -> Parser</a></p>
    <p><a href='mathquill2tex2tree.php'>MathQuill <-> TEX -> Tree</a> and tree2TEX check</p>
    <p><a href='check_unit_decomposition.php'>Check Unit Decomposition</a></p>
    <p><a href='mathquill2tex2parser_no_feedback.php'>MathQuill -> TEX (without feedback) -> Parser </a></p>
    <p><a href='decode_encode.php'>Test JSZip (see console)</a></p>
    <!-- <p><a href='background_pic.php'>background pictures </a> for 'wrong' and 'ok'</p> -->
    <p><a href='other.php'>Other solutions</a> KAS, Algebrite, MathQuill</p>
    
  <hr>
  <p><a href='https://github.com/gro58/gf09'>gf09 at GitHub</a></p>
  <?php include_once 'uses_mathquill.php';?>
  <?php include_once( 'footer.php' ); ?>