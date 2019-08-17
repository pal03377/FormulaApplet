<?php $title='Test Page' ?>
<?php include_once( 'header.php' ); ?>
<script>
console.log( 'test');
const AlgebraLatex = require(['algebra-latex']);

// Parse from LaTeX ...
const latexInput = '\\frac{1}{\\sqrt{2}}\\cdot x=10';
const AL = new AlgebraLatex();
var bli = AL['parseLatex'];
console.log(bli);
const algebraObj = AL.parseLatex();

// ... or parse from regular math string
// const mathInput = '1/sqrt(2)*x=10'
// const algebraObj = new AlgebraLatex().parseMath(mathInput)

console.log(algebraObj.toMath()) // output: 1/sqrt(2)*x=10
console.log(algebraObj.toLatex()) // output: \frac{1}{\sqrt{2}}\cdot x=10
</script>
</head>

<body>
<h1><?php echo $title; ?></h1>

<h2>Header </h2>

<?php include_once( 'footer.php' ); ?>