<?php $title='Test Page - Render MD (gf09) ';
$liblist = "['gf09css']"; ?>
<?php include_once( 'header.php' ); ?>
  
<script src="https://unpkg.com/showdown/dist/showdown.min.js"></script>
<?php
$file = './js/lib/ToDo.md';
$file = fopen($file,"r");
$result = '';
// $count = 0;
while($row = fgets($file, 4096))
{
    $row = trim($row);
    $row = str_replace("\\", "\\\\", $row);
    $result .= '"' . $row . '"+\n';
    // echo $row."<br/>";
}	
// remove last +
$result = substr($result, 0, strlen($result) - 1);
// echo $result;
?>

<script>
    var converter = new showdown.Converter();
    // start
    text      = <?php echo $result; ?>;
    console.log(text);
    // end
    html      = converter.makeHtml(text);
    console.log(html);
</script>
</head>

<body>
<h1><?php echo $title; ?></h1>
<?php include_once( 'footer.php' ); ?>