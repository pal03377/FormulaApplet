<!-- load vkbd after hammer -->
<?php $title = 'Auto Include using import/export';
$liblist = "'translate'";
$prefix="../"; 
include_once( $prefix . 'header.php' );
?>

<body>
<h1><?php echo $title; ?></h1>

<script>
function init(){
  initTranslation();
//   $( document ).ready(function() {
    // document.getElementById('output').innerHTML ='<p>Bli Bla Blu.</p>';
//   });
}
</script>

<script type='module'>
    console.log('script module');
    document.body.addEventListener( 'init', auto_init(), false);
    // document.addEventListener( 'init', function(ev){console.log(ev);}, false);
    // document.getElementById('output').innerHTML ='<p>script module</p>';
    import {test_autoinclude} from './auto_include.js';
    var temp = test_autoinclude();
    // document.getElementById('output').innerHTML = temp;

    function auto_init(){
      console.log('auto_init()');
      document.getElementById('output').innerHTML = 'auto_init() executed';
    }
 </script>

<hr />
<div id='output'><p>output</p></div>

<?php include_once ($prefix . 'uses.php');?>
<?php include_once ($prefix . 'footer.php');?>