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
    <p><a href='mathquill2tex2parser.php'>MathQuill <-> TEX -> Parser</a></p>
    <p><a href='mathquill2tex2tree.php'>MathQuill <-> TEX -> Tree</a> and tree2TEX check</p>
    <p><a href='check_unit_decomposition.php'>Check Unit Decomposition</a></p>
    <p><a href='mathquill2tex2parser_no_feedback.php'>MathQuill -> TEX (without feedback) -> Parser </a></p>
    <p><a href='background_pic.php'>background pictures </a> for 'wrong' and 'ok'</p>
    <p><a href='other.php'>Other solutions</a> KAS, Algebrite, MathQuill</p>
    
	<hr>
    <p>This page uses </p>
  <table>
    <tr>
      <th scope="col">Library</th>
      <th scope="col">Version</th>
      <th scope="col">Source</th>
      <th scope="col">License</th>
    </tr>
    <!--
    <tr>
      <td>require.js</td>
      <td>2.3.6</td>
      <td><a href="https://requirejs.org/docs/start.html">https://requirejs.org/docs/start.html</a></td>
      <td>jQuery Foundation</td>
    </tr>
    -->
    <tr>
      <td>JQuery</td>
      <td>3.4.1</td>
      <td><a href="https://code.jquery.com">https://code.jquery.com</a></td>
      <td>MIT License</td>
    </tr>
    <tr>
      <td>MathQuill</td>
      <td>0.10.1</td>
      <td><a href="https://github.com/mathquill/mathquill">https://github.com/mathquill/mathquill</a></td>
      <td>Mozilla Public License, v. 2.0</td>
    </tr>
    <tr>
      <td>Algebrite</td>
      <td>1.2.1</td>
      <td><a href="https://github.com/davidedc/Algebrite">https://github.com/davidedc/Algebrite</a></td>
      <td>MIT License</td>
    </tr>
    <tr>
      <td>algebra-latex</td>
      <td>1.1.6</td>
      <td><a href="https://github.com/viktorstrate/algebra-latex">https://github.com/viktorstrate/algebra-latex</a><br>
      See also <a href="https://www.npmjs.com/package/algebra-latex">https://www.npmjs.com/package/algebra-latex</a></td>
      <td>MIT License</td>
    </tr>
    <tr>
      <td>Khan/KAS</td>
      <td>0.1.1 (see package.json)</td>
      <td><a href="https://github.com/Khan/KAS">https://github.com/Khan/KAS</a></td>
      <td>MIT License</td>
    </tr>
  </table>
  <?php include_once( 'footer.php' ); ?>