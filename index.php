<?php 
  $title='Test Page - Formula Applet (gf09) ';
  $liblist = "['stop' ]";
?>
<?php include_once( 'header.php' ); ?>
<link href="css/table.css" rel="stylesheet">
</head>

<body>
    <h1><?php echo $title; ?></h1>
    <p><a href='sample_task.php'>Sample task</a> for later use in MediaWiki</p>
    <p><a href='development.php'>Development</a></p>
    
    <!-- <p><a href='background_pic.php'>background pictures </a> for 'wrong' and 'ok'</p> -->
    
  <hr>
  <p><a href='https://github.com/gro58/gf09'>gf09 at GitHub</a></p>
  <?php include_once 'uses_mathquill.php';?>
  <?php include_once( 'footer.php' ); ?>