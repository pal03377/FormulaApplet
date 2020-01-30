var n = 26; // n<=30
var n_squared = n * n;
var x = [];
var y = [];
var lowerBound = [0, 10, 72, 816, 3800, 16902, 52528, 155840, 381672, 902550, 1883244, 3813912, 7103408, 12958148, 22225500, 37474816, 60291180, 95730984, 146469252, 221736200, 325763172, 474261920, 673706892, 949783680, 1311600000, 1799572164, 2425939956, 3252444776, 4294801980, 5643997650];
var lb = lowerBound[ n - 1 ];
var score = 0; //dummy
var best_eval = 9000000000;

// Check browser support
// https://www.w3schools.com/html/html5_webstorage.asp
if (typeof(Storage) !== "undefined") {
  // Store
  localStorage.setItem("n", "" + n);
  // document.getElementById("out").innerHTML = "n=" + localStorage.getItem("n");
} else {
  document.getElementById("out").innerHTML = "Sorry, your browser does not support Web Storage...";
}

// generate arrays x[] and y[]
var index = 0;
for (var yy = 0; yy<n; yy++){
	for (var xx = 0; xx<n; xx++){
		x[index] = xx;
		y[index] = yy;
		// console.log('xx=' + xx +' yy=' + yy + ' index=' + index);
		// console.log('x=' + x[index] +' y=' + y[index] + ' index=' + index);
		index++;
	}
}

// generate arrays item[] and position[]
var item = [];
var best_item = [];
var position = [];
var best_position=[];
for (var index=0; index < n_squared; index++){
	// init: do not permute
	item[index] = index;
	position[index] = index;
}

function swap(item_1, item_2){
	// no classical swap with temporary variable
	// we need
	// console.log('swap ' + item_1 + ' ' + item_2);
	var pos_1 = position[item_1];
	var pos_2 = position[item_2];
	position[item_1] = pos_2;
	position[item_2] = pos_1;
	var save = item[pos_1];
	item[pos_1] = item[pos_2];
	item[pos_2] = save;

	// pos_1 = position[item_1];
	// pos_2 = position[item_2];
	// console.log('item[' + pos_1 + ']=' + item[pos_1]);
	// console.log('item[' + pos_2 + ']=' + item[pos_2]);
	// console.log('position[' + item[pos_1] + ']=' + position[item[pos_1]]);
	// console.log('position[' + item[pos_2] + ']=' + position[item[pos_2]]);
}

// permutation 
// swap(70, 89);
// swap(71, 89);
// 70->89->71  89->70  71->89


// generate HTML for output
function matrix(it){
	var alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^";
	var matrix = '';
	var posn = 0;
	for (var yy = 0; yy<n; yy++){
		matrix += '(';
		for (var xx = 0; xx<n; xx++){
			var token = alpha[x[it[posn]]] + alpha[y[it[posn]]];
			matrix += token;
			if (xx < n-1) {
				matrix += ', ';
			}
			posn++;
		}
		matrix += ')';
		if (yy < n-1) {
			//matrix += ',</pre></br><pre>';
			matrix += ',</br>';
		}
	}
	return matrix;
}

function hor_vert_distance( x1, x2 ) {
	var d = x2 - x1;
	if ( d < 0 ) {
		d = -d;
	}
	if (2 * d > n) {
		d = n - d;
	}
	return d;
}

// generate array of squared distances - for sake of speed
// length is n^2*n^2. This is 900 * 900 = 810000 for n=30.
var square_dist = [];
for (var i=0; i < n_squared; i++){
	square_dist[i] = [];
	for (var j=0; j < i; j++){
		var hor_dist = hor_vert_distance( x[i], x[j] );
		var vert_dist = hor_vert_distance( y[i], y[j] );
		var square = hor_dist*hor_dist + vert_dist*vert_dist;
		square_dist[i][j] = square;
		square_dist[j][i] = square;
		//console.log('i=' + i +' j=' + j + ' square: ' + square);
	}
}

// calculate sum of distance products
function sum_of_distance_products(){
	var sum = 0;
	for (var i=0; i < n_squared; i++){
		for (var j=0; j < i; j++){
			sum += square_dist[i][j] * square_dist[position[i]][position[j]];
		}
	}
	// console.log(' sum: ' + sum);
	return sum;
}

function improve() {
	var i_rand = Math.floor((Math.random() * n_squared));
	var j_rand = Math.floor((Math.random() * n_squared));
	swap (i_rand, j_rand);
	var sum = sum_of_distance_products();
	var better = -1;
	if (sum < score) {
		// improvement
		better = score - sum;
		score = sum;
	} else {
		// swap back
		swap (i_rand, j_rand); // maybe not necessary
	}
	return [better, score];
}

function improvement_loop(max_loops){
	var done = false;
	var loop_count = 0;
	do {
		loop_count++;
		var improvement = improve();
		if (improvement[0] > 0) {
			// console.log('counter=' + loop_count + ' score=' + improvement[1]);
			done = true;
		} else {
			// no improvement
			if (loop_count > max_loops) {
				done = true;
				loop_count = -1;
			}
		}
		// console.log('loop=' + loop);
	}while (!done);
	return [loop_count, improvement[1]]; // loop count, score
} 

function repeat_improvements_until_series_of_fails(){
// repeat improvement loops until series of fails get too much
	var fails = 0;
	// do not use var score
	score = 90000000000;
	do {
		var temp = improvement_loop(1000);
		var loop_count = temp[0];
		score = temp[1];
		var eval = score - lb;
		//console.log('loop_count=' + loop_count + ' score=' + score + ' evaluation=' + eval);
		if (loop_count == -1){
			fails++;
		} else {
			fails = 0;
		}
	} while(fails < 30);
	var eval = score - lowerBound[n-1];
	//console.log(' score=' + score + ' evaluation=' + eval);
	// remember best
	if (eval < best_eval){
		best_eval = eval;
		best_item = item.slice();
		best_position = position.slice();
		// localStorage.setItem("score", ' score=' + score + ' evaluation=' + eval + ' best=' + best_eval);
		// localStorage.setItem("matrix", matrix(item));
		localStore.setItem("n", JSON.stringify(n));
		localStore.setItem("items", JSON.stringify(item));
		localStore.setItem("positions", JSON.stringify(position));
		localStore.setItem("evaluation", JSON.stringify(eval));
	}
	console.log(' score=' + score + ' evaluation=' + eval + ' best=' + best_eval);
} 

for (var numoftry = 0; numoftry < 50; numoftry++){
	// new start
	for (var index=0; index < n_squared; index++){
		// init: do not permute
		item[index] = index;
		position[index] = index;
	}
	// random start
	for (var index=0; index < n_squared; index++){
		var i_rand = Math.floor((Math.random() * n_squared));
		var j_rand = Math.floor((Math.random() * n_squared));
		swap (i_rand, j_rand);
	}

	console.log('numoftry=' + numoftry);
	repeat_improvements_until_series_of_fails();
	
}

var out = document.getElementById('output');
var no_output = (typeof out == 'undefined' || out == null);
if (no_output){
	console.log('no output');
} else {
	item = best_item;
	position = best_position;
	sum = sum_of_distance_products();
	var eval = sum - lb;
	var temp = '<p> n=' + n + '</p>';
	temp += '<p>' + matrix(item) + '</p>';
	temp += '<p>' + sum + '-' +  lb + '=' + eval + '</p>';
	out.innerHTML = temp;
}


if (document.readyState === 'complete') {
	fireOnReady();
} else {
    document.addEventListener("DOMContentLoaded", fireOnReady);
}

function fireOnReady() {
	var out = document.getElementById('output');
	var sum = sum_of_distance_products();
	var lb = lowerBound[ n - 1 ];
	var eval = sum - lb;
	out.innerHTML = matrix(item) + '<p>' + sum + '-' +  lb + '=' + eval + '</p>';
}

