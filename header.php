<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title><?php echo $title; ?></title>
<script>
    var liblist=<?php echo $liblist; ?>;
    var isWiki = false;
</script>
<script src="./js/glue.js"></script>
<meta charset="utf-8">
</head>
<body>
<p id="mode_select">
  <input type="radio" name="lang" class="problemeditor language" id="en"></input>
  <label for="en"><span></span>Englisch </label>
  <br />
  <input type="radio" name="lang" class="problemeditor language" id="de" checked></input>
  <label for="de"><span></span>Deutsch </label>
</P>
