<?php $title = 'Sample Task';
$liblist = "[ 'zip', 'prepare_page', 'mathquill', 'tex_parser', 'mathquillcss', 'gf09css' ]";
include_once 'header.php';
?>

<!-- <script src="./js/lib/tex_parser.js"></script> -->
<script>
  waitfor_mathquill_and_if_ready_then_do(function () {
    prepare_page();
  });
</script>
</head>

<body>
<h1><?php echo $title; ?></h1>
<h2>for later use in MediaWiki</h2>

        <p id="output">output</p>
        <!-- <p class="formula_applet" id="light-house-0">(r + h)^2 = r^2 + s^2 \Rightarrow</p><br /> -->
        <p class="formula_applet" id="light-house" data-zip='UEsDBAoAAAAAAGeNOFFTGYHLAwAAAAMAAAALAAAAY29udGVudC50eHQyaHJQSwECFAAKAAAAAABnjThRUxmBywMAAAADAAAACwAAAAAAAAAAAAAAAAAAAAAAY29udGVudC50eHRQSwUGAAAAAAEAAQA5AAAALAAAAAAA'>s=\sqrt{ h^2 + \MathQuillMathField{} }</p><br />
        <p class="formula_applet" id="binom_01">(2u + 7v)^2 = \MathQuillMathField{}</p><br />
        <p class="formula_applet" id="binom_02" data-zip='UEsDBAoAAAAAABpEO1HIazOjBQAAAAUAAAALAAAAY29udGVudC50eHQ0OXZeMlBLAQIUAAoAAAAAABpEO1HIazOjBQAAAAUAAAALAAAAAAAAAAAAAAAAAAAAAABjb250ZW50LnR4dFBLBQYAAAAAAQABADkAAAAuAAAAAAA='>(2u + 7v)^2 = 4u^2 + 28uv + \MathQuillMathField{}</p><br />
        <p class="formula_applet" id="fraction">\frac{13t^2 - 5t}{t} = \MathQuillMathField{}</p><br />
        <form id='test_form' action="">
             <input type="text" id="test_text" name="test_text" size=1></input>
        </form>
        <!-- https://duckduckgo.com/?q=android+keycode+229&ia=web -->
        <style>
        div {
            width: 300px;
            height: 100px;
            border: 1px solid blue;
        }
        </style>
        <div contenteditable="true">
        
        </div>

        <input>
        <br>
        <span id="keycode"></span><br>
        <span id="textInput"></span>
<hr>
<?php include_once 'uses_mathquill.php';?>

<?php include_once 'footer.php';?>