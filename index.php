<?php $title='Test Page - Formula Applet (gf09) ' ?>
<?php include_once( 'header.php' ); ?>
<link href="css/table.css" rel="stylesheet">
</head>

<body>
    <h1><?php echo $title; ?></h1>
    <p><a href='mathquill.html'>MathQuill - Test Page</a></p>
    <p><a href='algebrite.php'>Algebrite - Test Page</a></p>
    <p>This page uses </p>

  <table>
    <tr>
      <th scope="col">Library</th>
      <th scope="col">Version</th>
      <th scope="col">Source</th>
      <th scope="col">License</th>
    </tr>
    <tr>
      <td>Loadjs</td>
      <td>3.6.1 - April 11, 2019</td>
      <td><a href="https://github.com/muicss/loadjs">https://github.com/muicss/loadjs</a></td>
      <td>MIT License</td>
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
  </table>
  <?php include_once( 'footer.php' ); ?>