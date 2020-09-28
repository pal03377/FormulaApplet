<?php $title = 'Check if equal';
$liblist = "[ 'mathquill', 'mathquillcss' ]";
include_once 'header.php';
?>

<script src="./js/lib/tex_parser.js"></script>
<script>
  waitfor_mathquill_and_if_ready_then_do(function () {
    prepare_page();
  });

  function prepare_page() {
    var MQ = MathQuill.getInterface(2);
    var mathField = new Array();
    var out = '';
    var myTree = new tree();

    // Parse from LaTeX ...
    var link = document.createElement("link");
    link.type = "text/css";
    link.rel = "stylesheet";
    link.href = "/css/gf09.css";
    document.getElementsByTagName("head")[0].appendChild(link);

    $(document).ready(function () {
    
    $(".formula_applet").each(function () {
      var index = $(".formula_applet").index(this);
      var id = $(this).attr('id');
      mf = MQ.MathField(this, {
        handlers: {
          edit: function () {
            console.log(index + ' ' + id);
            // editHandler(index);
            editHandler(id);
          }
        }
      });
      mathField.push(mf);
    });
    $("img.mod").remove();
    ($('<img class="mod">')).insertAfter($(".formula_applet"));
   });

      $(".formula_applet").click(function () {
      // var index = $(".formula_applet").index(this);
      var id = $(this).attr('id');
      console.log('handler '+id);
      editHandler(id);
      $(".formula_applet").removeClass('selected');
      $(this).addClass('selected');
    });

    // check all
    $( '#check' ).click( function(event){
      console.log('check button clicked');
      $("img.mod").remove();
      ($('<img class="mod">')).insertAfter($(".formula_applet"));

      $(".formula_applet").each(function () {
        var id = $(this).attr('id');
        console.log('id=' + id);
        editHandler(id);
        });
    });

    function editHandler(id) {
    var index = $(".formula_applet").index($( '#' + id));
    console.log('id->' + id + ' index=' + index);
    mf = mathField[index];
    // var out = mf.latex();
    out = mf.latex();
     myTree = new tree();
     myTree.leaf.content = mf.latex();
    parse(myTree);
    var almostOne = value(myTree);
    var dif = Math.abs(almostOne - 1);
    if (dif < 0.1){
      $( '#' + id).removeClass('mod_wrong').addClass( 'mod_ok' );
    } else {
      $( '#' + id).removeClass('mod_ok').addClass('mod_wrong');
    }
      
    document.getElementById('output').innerHTML = out ;
    parsetree_counter.setCounter(0);
  };

};

</script>

<!-- <link href="/css/gf09.css" rel="stylesheet"> -->
</head>

<body>
<h1><?php echo $title; ?></h1>
<h2>gf09</h2>

        <p id="output">output</p>
        <p><button id="check">Check all</button></p>
        <!-- p id="version">version</p -->
        <p class="formula_applet" id="unu683">3,5\textcolor{blue}{\frac{km}{h}}=\ 0,97\textcolor{blue}{\frac{m}{s}}</p><br />
        <p class="formula_applet" id="inv862">3,5 \textcolor{blue}{kWh} = 12,6 \textcolor{blue}{MJ}</p><br />
        <p class="formula_applet" id="utr575">\sin\left(\frac{\pi}{2}\right)=\ \sin\left(90\textcolor{blue}{°}\right)</p><br />
        <p class="formula_applet" id="fal487">(7,2c - 3,4d)^2 = 51,84a^2-48,96ab + 11,56b^2</p><br />
        <p class="formula_applet" id="ser409">(7,2a - 3,4b)^2 = 51,84a^2-48,96ab + 11,56b^2</p><br />
        <p class="formula_applet" id="con335">\frac{1}{u}-\frac{1}{v}=\frac{v-u}{uv}</p><br />

<hr>
<?php include_once 'uses_mathquill.php';?>

<?php include_once 'footer.php';?>