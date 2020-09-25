# gf09
## Refactoring of FormulaApplet
* Use of JavaScript instead of Java and GWT. 
* Use of open source libraries
## Use
* XAMPP is necessary for PHP
* Start XAMPP: D:\Users\privat\Documents\xampp_gf09\xampp-control.exe
* Start Apache. MySQL is not used
* Use Browser (e.g. Chrome) with URL http://localhost
* Link in D:\Users\privat\Documents\xampp_gf09\apache\conf\httpd.conf points to E:\gut\gf09 (php, JavaScript source)
## Oder
* Ausführen - Debugging starten mit F5 -> Chrome wird mit localhost gestartet.
## MediaWiki Extension has to
* load JavaScript libraries (using glue.js) and CSS
* render wiki applet to HTML5/MathQuill
* prepare page, e.g. install edit handler for MathQuill