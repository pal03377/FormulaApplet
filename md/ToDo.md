# *ToDo* #

## FormulaApplet as a H5P package
* Investigate if two or more H5P FormulaApplets in one Page (Drupal development)
cause preloaded JavaScript being loaded twice or more.
* Use subject/observer pattern for virtualKeyboard/FormulaApplet.
* Alternative: use jQuery (custom events)
* Use revealing module pattern
* Exercise how to deal with other H5P packages (math, physics)
* Use apps.zum.de and unterrichten.zum.de 
## Coding
* Use JSDoc https://jsdoc.app/
* Use ESLint https://eslint.org/
* Render \cdot as times(cross) if lang=en
* Render , as . if lang=en
* e for Exponent interferes with e for Euler's number.
* Move smaller parts of code (e.g. problem editor) into separate file
    + Divide prepare_page into smaller parts
    * prepare_page needs virtualKeyboard
    * virtualKeyboard needs hammer
    * Divide tex_parser into smaller parts
* <del>use strict</del>
  * broken: sample_task.php, sample_task_and_parse.php, tex_parser.php
* documentation.js
* OOP
* try/catch
* Tests (https://developer.mozilla.org/en-US/docs/Web/API/console/assert)
* Test using tree2tex.js
* Tests using browsers like FireFox, IE, Edge, and using OS like Linux, Android, iOS
* Use https://github.com/requirejs/i18n

## Nice to have
* Transfer this list (ToDo.md) to Issues (GitHub)
* Integral, Limit (virtualKeyboard)
* Block trivial solutions
* Random parameters for varying problems
* condition = ...
* Natural constants like e, c,...
* Node, modules
* Contact Karl Kirst
* Hammer as jQuery plugin
* (TypeScript)
* (Legacy: decode Java Applet Parameters)
* MediaWiki WYSIWYG Editor (expected to be difficult)
* asinh, acosh, atanh
* Complex Numbers
* Vectors
* Check only after pressing Enter
## Online
* Create new MediaWiki Extension named 'FormulaApplet', containing FormulaApplet.php, FormulaApplet.body.php, /i18n
* <del>Verwendung von formelapplet.zum.de klären -> Jan Böhme/UweSchützenmeister</del>
## GitHub
* <del>github gf09 private -> public</del>
* <del>Problem Editor (or better at www.formelapplet.de?)</del> (HowTo missing)
* GitHub Wiki?
* Meaning of different js files
* Instuction: Install with PHP
* License (2nd)
* ToDo (this file)
## [GIT Cheat Sheet](../../git-cheat.php "Spickzettel für GIT")
## www.formelapplet.de
* Problem Editor
* GWK
* Tree (Kategorienbaum)
* Befreundete Seiten
* YouTube HowTo (stabile Version des FA nötig)
* DOC, Usage
* Search with Phuchs
* <del>Link: wiki.formelapplet.de</del>
* Community 
* Support
   