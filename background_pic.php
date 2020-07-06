<?php 
  $title='Background Picture ';
  $liblist = "['end' ]";
?>
<?php include_once( 'header.php' ); ?>
<link href="css/gf09.css" rel="stylesheet">
<script>
 $(document).ready(function(){
  $(".tex-example").click(function () {
      var id = $(this).attr('id');
      editHandler(id);
      //$('#third').append($('<img>',{id:'theImg',src:'css/blitz.svg', width:'12px', height:'25px'}))
  });
});

function editHandler(id) {
    console.log(id);
    $( '#' + id).addClass( 'mod_wrong');
    // $( '#' + id).append($('<img>',{id:'theImg',src:'css/blitz.svg', width:'12px', height:'25px'}))
    $( '#' + id).append($('<img>',{id:'theImg'}))
}


 //$("<img src='css/blitz.svg' alt='Blitz'>").insertAfter( $("span#third").innerHTML );
  
</script>
</head>

<body>
    <h1><?php echo $title; ?></h1>
    <p><a href='index.php'> gf09 test and demos</a></p>
    <hr>
    <p class="tex-example" id="ser409">(7,2a - 3,4b)^2 = 51,84a^2-48,96ab + 11,56b^2</p><br />
    <p class="tex-example" id="s83ghx">Bli</p><br />
    <p class="tex-example" id="779wyx">Bla</p><br />
    <p class="tex-example" id="782ggl">Blu</p><br />
  <?php include_once( 'footer.php' ); ?>