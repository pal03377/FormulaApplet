<?php 
  $title='Other solutions - Demo ';
  $liblist = "['gf09css' ]";
?>
<?php include_once( '../header.php' ); ?>
<link href="../css/table.css" rel="stylesheet">
</head>

<body>
    <h1><?php echo $title; ?></h1>
    <p><a href='mathquill.php'>MathQuill - Test Page</a></p>
    <p><a href='mathquill_buttons.php'>MathQuill Buttons</a></p>
    <p><a href='algebrite.php'>Algebrite - Test Page</a></p>
    <p><a href='tex2mathquill.php'>TEX &lt;-&gt; MathQuill -&gt; Algebrite</a></p>
    <p><a href='tex2kas.php'>TEX &lt;-&gt; MathQuill -&gt; KAS</a></p>
    <p><a href='kas_compare.php'>KAS Compare</a></p>
    <p><a href='../index.php'>Test page</a></p>
    <hr>
    <table>
    <tr>
      <th scope="col">Library</th>
      <th scope="col">Version</th>
      <th scope="col">Source</th>
      <th scope="col">License</th>
    </tr>
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
    </hr>
  <!-- p id='load_logger' style='font-family: Verdana, Geneva, Tahoma, sans-serif'>Logger:</p -->
  <p><a href="..\development.php">Development</a></p>
  <p><a href="..\index.php">Overview</a></p>
</body>

</html>