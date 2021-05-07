## MediaWiki updaten (LOG)
* braucht neuere PHP-Version
* https://faq.1blu.de/content/480/981/de/wie-kann-ich-meine-php-version-aendern-.html
* Neuere Wiki-Version 1.35.10 bei 1blu installieren:
* Archiv muss unter Linux (Subsystem) entpackt werden, 
  da 7-Zip Dateinamen verstümmelt.
* Schwierigkeiten beim Einloggen ins Wiki, behoben durch
  session_save_path('tmp');
  $wgSessionCacheType = CACHE_DB;
  in LocalSettings.php
  