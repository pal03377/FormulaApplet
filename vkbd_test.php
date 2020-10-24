<?php $title = 'Test Page - VKBD (gf09)';
// stop: do not wait for mathquill and do not prepare_page
$liblist = "['vkbd', 'stop' ]";
include_once 'header.php';
?>

<body>
<h1><?php echo $title; ?></h1>

<script>
    console.log('Here is vkbd_test.php');
</script>

 <?php include_once 'footer.php'; ?>