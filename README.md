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
## Unify XAMPP
* Move the data of xampp_gf09 into xampp_gf09_wiki/htdocs/gf09
* Not copy the data of xampp_gf09 but using a symlink: mklink /D gf09 E:\gut\gf09. 
* See D:\Users\privat\Documents\xampp_gf09_wiki\htdocs\make-gf09-link.txt
* xampp_gf09 is moved to D:\Users\privat\Schrott
* For the wiki's javascript: use D:\Users\privat\Documents\xampp_gf09_wiki\htdocs\wiki\extensions\FormulaApplet\js linked to E:\gut\gf09\js
* Changes at E:\gut\gf09 are now shown at xampp without need to copy
* Disadvantage: the *.php files of gf09 are no longer in the root dir of the browser, but at localhost/gf09/. Some fiddling will be necessary.

## GIT
* cmd
* E:
* cd \gut\gf09
* git status
* git log --graph --decorate
* 