<?php
  $title='Test Page - Tex2MathQuill';
  $liblist = "['mathquill', 'mathquillcss', 'algebrite', 'translate' ]";
  $prefix="../"; 
  include_once( $prefix . 'header.php' );
?>

<body>
  <p>MathQuill: <span id="editable-math"></span></p>
 <textarea id="latex" style="width:80%;vertical-align:top">\frac{d}{dx}\sqrt{x} = 3,5 \unit{\frac{km}{h}} </textarea>
   <p>Algebrite: </p>
  <textarea id="output" name="terminal" rows="4" cols="80" style="width:100%;"></textarea>
  <hr>
  <pre id="math-text">empty</pre>
  <hr>
  <pre id="html-source">empty</pre>
  <hr>
  
  <script>
   
  function init(){
    console.log( 'init' );
    initTranslation();
    var eMath = $('#editable-math')[0]; latexSource = $('#latex'), htmlSource = $('#html-source'), MathText = $('#math-text');
    var MQ = MathQuill.getInterface(2);
    mf = MQ.MathField(eMath, {handlers:{
      edit: function(){
        // console.log(mf.latex());
        latexSource.val(mf.latex());
        MathText.text(mf.text());
        htmlSource.text(printTree(mf.html()));
        runAlgebrite(mf);
      }
    }});
    mf.latex(latexSource.val());

    latexSource.bind('keydown keypress', function() {
    var oldtext = latexSource.val();
    setTimeout(function() {
      var newtext = latexSource.val();
      if(newtext !== oldtext) {
        console.log(newtext);
        mf.latex(newtext);
        //mf.reflow();
      }
    });
  });
 }
      
  function runAlgebrite(mf) {
    textToBeExecuted = mf.text();
    console.log(textToBeExecuted);
    try {
      var result;
      if (/Algebrite\.[a-z]/.test(textToBeExecuted) || /;[ \t]*$/.test(textToBeExecuted)) {
        result = eval(textToBeExecuted);
      }
      else {
        result = Algebrite.run(textToBeExecuted);
      }
      //alert(result);
      $('#output').val(result)
    }
    catch (err) {
      var errDesc = err;
      // errorBox.update('<h4>Error!<\/h4><code>' + errDesc + '<\/code>');
      // errorBox.show();
      console.log('Error: ' +  errDesc );
    }
  }
  
 //print the HTML source as an indented tree. TODO: syntax highlight
function printTree(html) {
  html = html.match(/<[a-z]+|<\/[a-z]+>|./ig);
  if (!html) return '';
  var indent = '\n', tree = [];
  for (var i = 0; i < html.length; i += 1) {
    var token = html[i];
    if (token.charAt(0) === '<') {
      if (token.charAt(1) === '/') { //dedent on close tag
        indent = indent.slice(0,-2);
        if (html[i+1] && html[i+1].slice(0,2) === '</') //but maintain indent for close tags that come after other close tags
          token += indent.slice(0,-2);
      }
      else { //indent on open tag
        tree.push(indent);
        indent += '  ';
      }

      token = token.toLowerCase();
    }

    tree.push(token);
  }
  return tree.join('').slice(1);
}
// window.addEventListener('DOMContentLoaded', (event) => {
//     console.log('DOM fully loaded and parsed');
//     // waitfor_mathquill_and_if_ready_then_do( init );
//     init();
//  });
</script>

<?php include_once ($prefix . 'uses.php');?>
<?php include_once ($prefix . 'footer.php');?>