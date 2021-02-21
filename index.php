<?php 
  $title='Formula Applet (gf09) ';
  $liblist = "[ 'gf09css', 'translate' ]";
?>
<?php $prefix="./"; include_once( $prefix . 'header.php' ); ?>
<!-- <meta http-equiv="refresh" content="1; URL=./hiltrud.php"> -->
<link href="css/table.css" rel="stylesheet">
<script>
 function init(){
    // initTranslation();
 }
</script>

<body>
    <h1><?php echo $title; ?></h1>
    <p>Formula Applet - Code Base <?php include_once( 'version.php' ); ?></p>
    <p><a href='sample_task.php'>Sample task</a> part 1 - for later use in MediaWiki</p>
    <p><a href='sample_task2.php'>Sample task</a> part 2 - for later use in MediaWiki</p>
    <p><a href='problem_editor.php'>Problem Editor</a> for later use in MediaWiki</p>
    <p><a href='todo.php'>ToDo</a></p>
    <hr>
    <p><a href='./development/development.php'>Development</a></p>
    <p><a href='./other/other.php'>Other solutions</a> KAS, Algebrite, MathQuill</p>
    <p><a href='./tests/tests.php'>Tests</a></p>
</body>
</html>