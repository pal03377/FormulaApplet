# *ToDo* #
## Online
* MediaWiki Extension 'FormulaApplet' neu anlegen
* FormulaApplet.php, FormulaApplet.body.php, /i18n
* www.formelapplet.de mit Bootstrap
* github gf09 privat -> public

## Programmierung
* Enhance
  * class{...} <-> \class{inputfield}{...}
    * nicht nötig, da nicht sichtbar. Nur intern im Aufgaben-Editor verwendet.
  <s>* \unit{...} <-> \textfield{blue}{...}</s>
  <s>* string -> enhance -> mf.latex(string_e)</s>
  <s>* string_e = mf.latex() -> simplify -> string</s>
* OOP, TypeScript. Kleinere Code-Teile, z.B. Editor-Code in eigene Datei
* try-catch, on error
* Test und Debugging
* Vereinheitlichung des Slice-Teils ??
* https://stackoverflow.com/questions/950087/how-do-i-include-a-javascript-file-in-another-javascript-file
* Legacy: Applet-Parameter decodieren
* definite integral obsolete?
* Triviale Lösungen sperren
* condition = ...
* glue.js verbessern

* Einheiten etc.
<<<<<<< HEAD
    * <s>physikalische Einheiten</s>
    * <s>Grad, Minuten, Sekunden</s>
    * <s>Gemischte Zahlen</s>
    * abs(x), |x|
    exp(x) = e^x
=======
    * Gemischte Zahlen
    * abs(x), |x| val()
    exp(x) = e^x
* Objektorientierte Programmierung
    * Vereinheitlichung des Slice-Teils
    * Test und Debugging
    * TypeScript
    * https://stackoverflow.com/questions/950087/how-do-i-include-a-javascript-file-in-another-javascript-file
* Legacy: Applet-Parameter decodieren
* try-catch
* definite integral obsolete?
>>>>>>> 00aef9c924b1fd5b09cf4c4f63eab9391b307e28

<s>## MediaWiki updaten (LOG)
* braucht neuere PHP-Version
* https://faq.1blu.de/content/480/981/de/wie-kann-ich-meine-php-version-aendern-.html
* Neuere Wiki-Version 1.35.10 bei 1blu installieren:
* Archiv muss unter Linux (Subsystem) entpackt werden, 
  da 7-Zip Dateinamen verstümmelt.
* Schwierigkeiten beim Einloggen ins Wiki, behoben durch
<<<<<<< HEAD
  session_save_path('tmp');
  // $wgSessionsInMemcached = true;
  $wgSessionCacheType = CACHE_DB;
  in LocalSettings.php</s>


## DiesUndDas
* Waiter-Funktionen vereinheitlichen
* <s>other.php, uses.php aktualisieren OK
* VKBD ergänzen (CAPS, Greek)
* Koppelung VKBD - MathQuill OK
* VKBD auch im Wiki OK</s>
* Problem-Editor OK, Integral, Limes
* MediaWiki-WYSIWYG-Editor
* Karl Kirst, Maria Eirich OK, Mandy Schütze OK
* MediaWiki-Extensions aktualisieren
** GeoGebra: Nur Zbynek OK
** FormelApplet durch FormulaApplet ersetzen OK
* i18n
* Linux mit GUI unter WIN10
* befreundete Seiten


=======
  session_save_path("tmp");
  $wgSessionCacheType = CACHE_DB;
  in LocalSettings.php</s>

## DiesUndDas
* Waiter-Funktionen vereinheitlichen
* Integral, Limes
* MediaWiki-WYSIWYG-Editor (schwer)
* Karl Kirst
* MediaWiki-Extensions aktualisieren
* GitHub von privat auf öffentlich
>>>>>>> 00aef9c924b1fd5b09cf4c4f63eab9391b307e28
