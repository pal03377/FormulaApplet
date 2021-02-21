<?php $title = 'ToDo'; $header='';
$liblist = "[ 'translate', 'gf09css']";
$prefix="./"; 
include_once( $prefix . 'header.php' ); 
?>

<!-- <?php $todomd = file_get_contents('./js/lib/todo.md'); ?> -->
<script type="module" src="https://cdn.jsdelivr.net/gh/zerodevx/zero-md@2/dist/zero-md.min.js"></script>

<script>
function init(){
    initTranslation();
}
</script>

<h1><?php echo $header; ?></h1>
<p>This page uses <a href='https://zerodevx.github.io/zero-md/'>zero-md</a></p>
<hr>
<p><a href='https://github.com/gro58/gf09/blob/master/js/lib/ToDo.md'>ToDo</a> (github)</p>
<zero-md src="./js/lib/ToDo.md"></zero-md>
<hr>

<?php include_once 'version.php';?>
<?php include_once 'footer.php';?>