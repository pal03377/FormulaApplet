<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title><?php echo $title; ?></title>
<!-- ?php $docroot=$_SERVER['SCRIPT_NAME']; $gf09 = substr($docroot,0,strpos($docroot,'gf09')-1); ? -->
<!-- ?php $header_dir = dirname($_SERVER['SCRIPT_NAME']); ? -->
<script type="module" id='glue'></script>

<?php 
// https://stackoverflow.com/questions/7431313/php-getting-full-server-name-including-port-number-and-protocol#7431358
function my_server_url()
{
    $server_name = $_SERVER['SERVER_NAME'];

    if (!in_array($_SERVER['SERVER_PORT'], [80, 443])) {
        $port = ":$_SERVER[SERVER_PORT]";
    } else {
        $port = '';
    }

    if (!empty($_SERVER['HTTPS']) && (strtolower($_SERVER['HTTPS']) == 'on' || $_SERVER['HTTPS'] == '1')) {
        $scheme = 'https';
    } else {
        $scheme = 'http';
    }
    return $scheme.'://'.$server_name.$port;
}

$haystack = dirname($_SERVER['PHP_SELF']);
// echo $haystack . '<br />';
if (substr($haystack, -1) !== '/'){
  $haystack .= '/';
}
// retrieve directory containing gf09-tag.txt
$stop = false;
do {
  $needle =  my_server_url() . $haystack . 'gf09.tag';  
  $handle = @fopen($needle, 'r');
  $exists = true;
  if(!$handle){
    $exists = false;
  }
  // echo $needle . ( $exists ? ' existiert' : ' ex. nicht' ) . '<br />';
  if ( $exists ) {
    $stop = true;
    $gf09 = $haystack;
  } else {
    if( strlen($haystack) <= 1){
      $stop = true;
      $gf09 = 'null';
    } else {
      $haystack = dirname($haystack) . "/";
    }
  }
} while ($stop == false);
?>

<script>    
    var isWiki = false;
    var liblist_string=<?php echo $liblist; ?>;
    var liblist = liblist_string.split(' ');
    // var gf09_path = "<!-- ?php echo $gf09; ? -->" + "/gf09/";
    // console.log('Header: gf09_path=' + gf09_path);
    var gf09_path = "<?php echo $gf09; ?>";
    if (gf09_path == 'null'){ gf09_path = null};
    // console.log('gf09_path=' + gf09_path);
    document.getElementById('glue').src = gf09_path + "js/glue.js";
</script>
<meta charset="utf-8">
</head>

<body>
<p id="lang_select">
  <input type="radio" name="lang" class="problemeditor language" id="en"></input>
  <label for="en"><span></span>Englisch </label>
  <br />
  <input type="radio" name="lang" class="problemeditor language" id="de" checked></input>
  <label for="de"><span></span>Deutsch </label>
</P>
