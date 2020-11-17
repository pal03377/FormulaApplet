# *ToDo* #
* Einheiten etc.
    * <s>physikalische Einheiten</s>
    * <s>Grad</s>, Minuten, Sekunden
    * Gemischte Zahlen
    * abs(x), |x|
    exp(x) = e^x
* Objektorientierte Programmierung
    * Vereinheitlichung des Slice-Teils
    * Test und Debugging
    * TypeScript
    * https://stackoverflow.com/questions/950087/how-do-i-include-a-javascript-file-in-another-javascript-file
* Auf Gleichheit testen
    * Paraneter 'solution'
* Legacy: Applet-Parameter decodieren
* try-catch
* definite integral obsolete?
* gf09.css: use glue to load

## MediaWiki updaten
* braucht neuere PHP-Version
* https://faq.1blu.de/content/480/981/de/wie-kann-ich-meine-php-version-aendern-.html
* Neuere Wiki-Version 1.35.10 bei 1blu installieren:
* Archiv muss unter Linux (Subsystem) entpackt werden, 
  da 7-Zip Dateinamen verstümmelt.
* Schwierigkeiten beim Einloggen ins Wiki, behoben durch
  session_save_path("tmp");
  // $wgSessionsInMemcached = true;
  $wgSessionCacheType = CACHE_DB;
  in LocalSettings.php

## Android Bug: Virtuelle Tastatur geht nicht :-(
* Initialisieren mit Space-Delete? FAIL
* Explizites "addKeyListener" FAIL
* Transparentes Textinput-Feld drüberlegen FAIL
* Ein-Pixel-Textinput-Feld daneben (links oben) FAIL
* Virtuelle Tastatur aus Library FAIL - lieber selber machen

## glue2
* Umbenennen glue.js -> glue_old.js und glue2.js -> glue.js OK
* Test im Wiki OK
* Test online mit/ohne Wiki OK
* prepare_page *.js und innerhalb *.php unterscheiden! OK
* Sind Waiter-Funktionen nötig? OK
* Fehlermeldungen testen

## DiesUndDas
* Waiter-Funktionen vereinheitlichen
* other.php, uses.php aktualisieren OK
* VKBD ergänzen (CAPS, Greek) OK
* Koppelung VKBD - MathQuill OK
* VKBD auch im Wiki
* on error, TypeScript
* Problem-Editor, Integral, Limes
* MediaWiki-WYSIWYG-Editor
* Karl Kirst, Maria Eirich, Mandy Schütze
* MediaWiki-Extensions aktualisieren
** GeoGebra: Nur Zbigniew
** FormelApplet durch FormulaApplet ersetzen
* GitHub von privat auf öffentlich

