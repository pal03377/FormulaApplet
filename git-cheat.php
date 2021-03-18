<?php $title = 'ToDo'; $header='';
$liblist = "'translate gf09css'";
$prefix="./"; 
include_once( $prefix . 'header.php' ); 
?>

<script type="module" src="https://cdn.jsdelivr.net/gh/zerodevx/zero-md@2/dist/zero-md.min.js"></script>

<script>
function init(){
    initTranslation();
}
</script>

<h1><?php echo $header; ?></h1>
<p>Do not use this file with GitHub - you will only get the PHP code. Use with local repository and XAMPP.</p>
<zero-md src="./js/lib/Git_Cheat_Sheet.md"></zero-md>
<hr>
<p><a href='https://github.com/gro58/gf09/blob/master/js/lib/ToDo.md'>ToDo</a> (github)</p>
<hr>
<p>This page uses <a href='https://zerodevx.github.io/zero-md/'>zero-md</a></p>
<?php include_once 'version.php';?>
<?php include_once 'footer.php';?>