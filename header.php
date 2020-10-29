<!doctype html>
<html lang="de">
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title><?php echo $title; ?></title>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
<script src="./js/lib/jquery-3.4.1.min.js"></script>
<script>
   var gf09_path = 'NO WIKI'; //signal for glue.js
   <?php
       $server = $_SERVER[ 'SERVER_NAME' ];
       echo("var server='" . $server . "';\r\n" );
    ?>
    if(server.startsWith('test.grossmann.info')){
        gf09_path = 'NO GF09'; //signal for glue.js
    }
    var liblist=<?php echo $liblist; ?>; 
</script>
<script src="./js/glue.js"></script>  
<meta charset="utf-8">
</head>
