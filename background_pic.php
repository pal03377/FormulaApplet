<?php 
  $title='Background Picture ';
  $liblist = "['end' ]";
?>
<?php include_once( 'header.php' ); ?>
<link href="/css/gf09.css" rel="stylesheet">
<script>
 $(document).ready(function(){

  $(".tex-example").append($('<img>',{id:'theImg'}));

  $(".tex-example").click(function () {
      var id = $(this).attr('id');
      editHandler(id);
      //$('#third').append($('<img>',{id:'theImg',src:'css/blitz.svg', width:'12px', height:'25px'}))
  });
});

function editHandler(id) {
    console.log(id);
    var has_ok = ($( '#' + id).hasClass( 'mod_ok'));
    var has_wrong = ($( '#' + id).hasClass( 'mod_wrong'));
    $( '#' + id).removeClass( 'mod_ok' ).removeClass( 'mod_wrong' );
    if (has_ok === false){
      if( has_wrong === true){
        $( '#' + id).addClass( 'mod_ok' );
      } else {
        $( '#' + id).addClass( 'mod_wrong' );
      }
    }
    // else has_ok= true => do nothing
    // if ($( '#' + id).hasClass( 'mod_ask')){
    //   $( '#' + id).removeClass( 'mod_ask').addClass( 'mod_wrong');
    //   console.log('mod_wrong');
    // };
    // if ($( '#' + id).hasClass( 'mod_ok')){
    //   $( '#' + id).removeClass( 'mod_ok').addClass( 'mod_ask');
    //   console.log('mod_ask');
    // };
    // if ($( '#' + id).hasClass( 'mod_wrong')){
    //   $( '#' + id).removeClass( 'mod_wrong').addClass( 'mod_ok');
    //   console.log('mod_ok');
    // };
    // $( '#' + id).append($('<img>',{id:'theImg',src:'css/blitz.svg', width:'12px', height:'25px'}))
}


 //$("<img src='css/blitz.svg' alt='Blitz'>").insertAfter( $("span#third").innerHTML );
  
</script>
</head>

<body>
    <h1><?php echo $title; ?></h1>
    <p><a href='index.php'> gf09 test and demos</a></p>
    <hr>
    <p>Click. clear -> mod_wrong -> mod_ok -> clear </p>
    <p class="tex-example" id="ser409">(7,2a - 3,4b)^2 = 51,84a^2-48,96ab + 11,56b^2</p><br />
    <p class="tex-example mod_ok" id="s83ghx">Bli</p><br />
    <p class="tex-example" id="779wyx">Bla</p><br />
    <p class="tex-example" id="782ggl">Blu</p><br />
  <?php include_once( 'footer.php' ); ?>