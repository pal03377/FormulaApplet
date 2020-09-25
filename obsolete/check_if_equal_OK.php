<?php $title = 'Check if equal';
$liblist = "[ 'mathquill', 'mathquillcss' ]";
include_once 'header.php';
?>

<script src="/js/lib/parse_brackets5.part1.js"></script>
<script src="/js/lib/parse_brackets5.part2.js"></script>
<script>
  function prepare_page() {
    var MQ = MathQuill.getInterface(2);
    var mathField = new Array();
    var out = '';
    var myTree = new tree();

  $(document).ready(function () {
    $(".formula_applet").each(function () {
      var index = $(".formula_applet").index(this);
      // console.log(index);
      mf = MQ.MathField(this, {
        handlers: {
          edit: function () {
            editHandler(index);
          }
        }
      });
      mathField.push(mf);
    });
    $( '.formula_applet').each(function(){
      console.log(this.id);
      var selector = '#' + this.id+ ' .mq-textarea';
      $( selector ).append($('<img>',{id:this.id+'-img-wrong',src:'css/blitz.svg', width:25, height:50}));
    });
    $(".formula_applet").click(function () {
      var index = $(".formula_applet").index(this);
      editHandler(index);
      $(".formula_applet").removeClass('selected');
      $(this).addClass('selected');
    });
      $( '#treecanvas' ).click( function(event){
          parse(myTree);
          // var tex = tree2TEX(myTree);
         var dummy = value(myTree);
          console.log('value=' + dummy);
      });

    $( '#check' ).click( function(event){
      console.log('check button clicked');
      $(".formula_applet").each(function () {
        var index = $(".formula_applet").index(this);
        mf = mathField[index];
        var tex_1 = deleteSpaceAndRemoveBackslash(mf.latex());
        myTree = new tree();
        myTree.leaf.content = tex_1;
        parse(myTree);
        var tex_2 = deleteSpaceAndRemoveBackslash(tree2TEX(myTree));
         });
    });

    // button.mouseup( function(){button.attr('data-clickstate', 'up')});
  });

    function editHandler(index) {
    mf = mathField[index];
    // var out = mf.latex();
    out = mf.latex();
     myTree = new tree();
     myTree.leaf.content = mf.latex();
    // parse(myTree);
    document.getElementById('output').innerHTML = out + '<br>' + value(myTree);
    // parsetree_init();
    parsetree_counter.setCounter(0);
}
};

waitfor_mathquill_and_if_ready_then_do(function () {
  prepare_page();
});

  // Parse from LaTeX ...
  var link = document.createElement("link");
  link.type = "text/css";
  link.rel = "stylesheet";
  link.href = "/js/lib/formula_applet.css";
  document.getElementsByTagName("head")[0].appendChild(link);

</script>

<link href="css/gf09.css" rel="stylesheet">
</head>

<body>
<h1><?php echo $title; ?></h1>
<h2>gf09</h2>

        <p id="output">output</p>
        <p><button id="check">Check all</button></p>
        <!-- p id="version">version</p -->
        <p class="formula_applet" id="unu683">3,5\textcolor{blue}{\frac{km}{h}}=\ 0,97\textcolor{blue}{\frac{m}{s}}</p><br />
        <p class="formula_applet" id="inv862">3,5 \textcolor{blue}{kWh} = 12,6 \textcolor{blue}{MJ}</p><br />
        <p class="formula_applet" id="ser409">(7,2a - 3,4b)^2 = 51,84a^2-48,96ab + 11,56b^2</p><img src="css/blitz.svg" alt="wrong" style="width:52px;height:52px;"><br />
        <p class="formula_applet" id="ser409">(7,2a - 3,4b)^2 = 51,84a^2-48,96ab + 11,56b^2</p><br />
        <p class="formula_applet" id="con335">\frac{1}{u}-\frac{1}{v}=\frac{v-u}{uv}</p><br />


<?php include_once 'footer.php';?>