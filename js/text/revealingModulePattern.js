// https://www.codeproject.com/Articles/1164113/Module-and-Revealing-Module-Patterns-in-JavaScript
var revealingModule = (function() {
   var privateVar = "Keep me private";
   var publicVar = "Return me as public";

   function privateFunc() {
      console.log("A private function");
   }

   function publicFunc1() {
      console.log("First public function");
   }

   function publicFunc2() {
      console.log("Second public function");
   }

   return {
      publicProperty: publicVar,
      firstPublicMethod: publicFunc1,
      secondPublicMethod: publicFunc2
   };
}());