<?php
$title = 'Function of function';
$liblist = "['zip' ]";
?>
<?php include_once 'header.php';?>
</head>

<body>
    <h1><?php echo $title; ?></h1>
<script>
    var f = function(x){
        return x*x;
    };
    var g = function(u, v){
        return u+v;
    }
    console.log(f(5));
    console.log(g(17,f(4)));
</script>
<hr>
<?php include_once 'footer.php';?>