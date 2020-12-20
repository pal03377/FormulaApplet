<?php $title = 'Check valid digits';
$liblist = "['hammer', 'translate', 'prepare_page', 'mathquill', 'tex_parser', 'mathquillcss', 'gf09css', 'vkbd', 'vkbdcss']";
include_once 'header.php';
?>

<body>
<script>
    function init(){
        console.log('init... ');
        console.log(FAList);
        $(document).ready(function () {
                var fa = FAList[0];
                var mf = fa.mathField;
                console.log(mf);
                mf.config({
                    handlers: {
                        edit: function () {
                            console.log('editnew');
                            editHandler2(mf.latex());
                        },
                        enter: function () {
                            console.log('enternew');
                            editHandler2(mf.latex());
                       },
                    }
                });
        })
    }

    function editHandler2(latex){
        document.getElementById('output').innerHTML = latex ;
    }
</script>
<h1><?php echo $title; ?></h1>
<p class="formula_applet" id="check_vd">\text{result} = \MathQuillMathField{}</p><br />
<p id="output">output</p>

<?php include_once 'footer.php';?>