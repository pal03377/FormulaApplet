<?php 
  $title='Development';
  $liblist = "['gf09css' ]";
?>
<?php include_once( 'header.php' ); ?>
<link href="css/table.css" rel="stylesheet">
</head>

<body>
    <h1><?php echo $title; ?></h1>
    <p><a href='problem_editor.php'>Problem Editor</a></p>
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