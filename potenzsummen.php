<?php $title = 'Potenzsummen';
$liblist = "[ 'mathquillcss' ]";
include_once 'header.php';
?>

<body>
<h1><?php echo $title; ?></h1>

<script>
// n=16...40
var n=20
var max_base = 50

list = []
for (var base = 0; base < max_base; base++) {
    list[base] = 0;
}

function check(){
    var result = BigInt(max_base**n)
    for (var base = 0; base < max_base; base++) {
        if (list[base] == 1) {
            result = result - BigInt(base**n)
        }
      }
      return result
}

function myAbs( z ){
    if( z < 0 ){
        return -z;
    } else {
        return z;
    }
}

var e = BigInt(max_base**n)
var count = 100
while( e !== 0 ) {
    var e_old = BigInt( e )
    var list_old = list.slice();
    base = Math.trunc( (max_base - 1)  * Math.random() ) + 1

    // console.log( base )
    if(list[base] == 1) {
        list[base] = 0;
        e = e + BigInt(base**n);
    } else {
        list[base] = 1;
        e = e - BigInt(base**n);
    }
    if( myAbs(e) >= myAbs(e_old) ){
        // no improvement
        e = BigInt( e_old );
        list = list_old.slice();
        // console.log( 'no improvement' )
    } else {
        // improvement
        // print( list )
        e_check = check();
        if( e == e_check ){
            // console.log( 'check OK' );
            console.log( e );
        } else {
            console.log( e + ' <> ' +  e_check );
            console.log( e - e_check );
            e = e_check;
        }
        count -=1;
        if(count == 0) {
            console.log( list );
            count = 100;
        }
    }
}
console.log( list );

</script>

 <?php include_once 'footer.php'; ?>