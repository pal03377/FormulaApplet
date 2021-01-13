<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title><?php echo $title; ?></title>
<?php $docroot=$_SERVER['SCRIPT_NAME']; $gf09 = substr($docroot,0,strpos($docroot,'gf09')-1); ?>
<script>
    var liblist=<?php echo $liblist; ?>;
    var isWiki = false;
    var gf09_path = "<?php echo $gf09; ?>" + "/gf09/";
    console.log('Header: gf09_path=' + gf09_path);
</script>
<script id='gluh'></script>
<script>
  document.getElementById('gluh').src = gf09_path + "js/glue.js";
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
