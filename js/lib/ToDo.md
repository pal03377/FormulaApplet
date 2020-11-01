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
* Initialisieren mit Space-Delete?
* Explizites "addKeyListener"
* Transparentes Textinput-Feld drüberlegen
* Ein-Pixel-Textinput-Feld daneben (links oben)
* Virtuelle Tastatur aus Library

## glue2
* Umbenennen glue.js -> glue_old.js und glue2.js -> glue.js OK
* Test im Wiki
* Test online mit/ohne Wiki
* prepare_page *.js und innerhalb *.php unterscheiden!
* Sind Waiter-Funktionen nötig?
* Fehlermeldungen testen
