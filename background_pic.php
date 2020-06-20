<?php 
  $title='Background Picture ';
  $liblist = "['end' ]";
?>
<?php include_once( 'header.php' ); ?>
<link href="css/gf09.css" rel="stylesheet">
<script>
 $(document).ready(function(){
  // $("button").click(function(){
  //   $("p").slideToggle();
  $("<p>Test</p>").insertAfter( $("<h1>") );
  $('#third').append($('<img>',{id:'theImg',src:'css/blitz.svg', width:'12px', height:'25px'}))
}); //$("<img src='css/blitz.svg' alt='Blitz'>").insertAfter( $("span#third").innerHTML );
  
</script>
</head>

<body>
    <h1><?php echo $title; ?></h1>
    <p><a href='index.php'> gf09 test and demos</a></p>
    <hr>
    <span>Bli<img src='css/haken.svg' width="25" height="25"></span>
    <!-- <span>Bla<img src='css/blitz.svg' alt='Blitz'></span> -->
    <span id="third">Blu</span>
  <?php include_once( 'footer.php' ); ?>