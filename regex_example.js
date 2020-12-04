const regex1 = RegExp('foo.', 'gi');
const str1 = 'table foootball, Foosball and foozdrink';
let array1;

while ((array1 = regex1.exec(str1)) !== null) {
  console.log(`Found ${array1[0]} at ` + array1.index + `. Next starts at ${regex1.lastIndex}.`);
  // expected output: "Found foo. Next starts at 9."
  // expected output: "Found foo. Next starts at 19."
}

