<?php $title = 'Check if equal';
$liblist = "[ 'mathquill', 'mathquillcss' ]";
include_once 'header.php';
?>

<script src="/js/lib/parse_brackets5.part1.js"></script>
<script src="/js/lib/parse_brackets5.part2.js"></script>
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
    
    $(".tex-example").each(function () {
      var index = $(".tex-example").index(this);
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
    // $(".tex-example").append($('<img>',{id:'theImg'}));
    // $(".tex-example span.mq-textarea").append($("<div class='mod_ok'>bli</div>"));
    // $(".tex-example span.mq-textarea").append($("<div class='test'></div>"));
    // var inserttext_wrong = '<img class="mod" src="css/blitz.svg" alt="wrong" styblitz le="width:12px;height:25px;"><br />';
    // ($(inserttext_wrong)).insertAfter($(".tex-example.mod_wrong"));
    // var inserttext_ok = '<img class="mod" src="css/haken.svg" alt="ok" style="width:25px;height:25px;"><br />';
    // ($(inserttext_ok)).insertAfter($(".tex-example.mod_ok"));
    $("img.mod").remove();
    ($('<img class="mod">')).insertAfter($(".tex-example"));
    // ($(".tex-example")).append($('<img class="mod">'));
   });

    // $( '.tex-example').each(function(){
    //   var selector = '#' + this.id+ ' .tex-example';
    //   console.log(selector);
    //  $( selector ).append($('<img>',{id:this.id+'-img-wrong', src:'css/blitz.svg', width:25, height:50}));
    // });
    $(".tex-example").click(function () {
      // var index = $(".tex-example").index(this);
      var id = $(this).attr('id');
      editHandler(id);
      $(".tex-example").removeClass('selected');
      $(this).addClass('selected');
    });

    // check all
    $( '#check' ).click( function(event){
      console.log('check button clicked');
      $("img.mod").remove();

      $(".tex-example").each(function () {
        var index = $(".tex-example").index(this);
        mf = mathField[index];
        myTree = new tree();
        // var temp = deleteSpaceAndRemoveBackslash(mf.latex());
        var temp = mf.latex();
        myTree.leaf.content = temp;
        parse(myTree);
        // var tex_2 = deleteSpaceAndRemoveBackslash(tree2TEX(myTree));
        console.log(value(myTree));
         });
    });

    function editHandler(id) {
    var index = $(".tex-example").index($( '#' + id));
    console.log('index=' + index);
    mf = mathField[index];
    // var out = mf.latex();
    out = mf.latex();
     myTree = new tree();
     myTree.leaf.content = mf.latex();
    parse(myTree);
    var almostOne = value(myTree);
    var dif = Math.abs(almostOne - 1);
    if (dif < 0.1){
      $( '#' + id).addClass( 'mod_ok' );
    } else {
      $( '#' + id).addClass('mod_wrong');
    }
      
    // var inserttext_wrong = '<img class="mod" src="css/blitz.svg" alt="wrong" style="width:12px;height:25px;">';
    // ($(inserttext_wrong)).insertAfter($(".tex-example.mod_wrong"));
    // var inserttext_ok = '<img class="mod" src="css/haken.svg" alt="ok" style="width:25px;height:25px;">';
    // ($(inserttext_ok)).insertAfter($(".tex-example.mod_ok"));

  document.getElementById('output').innerHTML = out ;
    // parsetree_init();
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
        <p class="tex-example" id="unu683">3,5\textcolor{blue}{\frac{km}{h}}=\ 0,97\textcolor{blue}{\frac{m}{s}}</p><br />
        <p class="tex-example" id="inv862">3,5 \textcolor{blue}{kWh} = 12,6 \textcolor{blue}{MJ}</p><br />
        <p class="tex-example" id="fal487">(7,2c - 3,4d)^2 = 51,84a^2-48,96ab + 11,56b^2</p><br />
        <p class="tex-example" id="ser409">(7,2a - 3,4b)^2 = 51,84a^2-48,96ab + 11,56b^2</p><br />
        <p class="tex-example" id="con335">\frac{1}{u}-\frac{1}{v}=\frac{v-u}{uv}</p><br />


<?php include_once 'footer.php';?>