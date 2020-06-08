package gut.client;

/**
 * @author Rudolf Grossmann

 * @version gf08 24.11 (30. August 2016)
 *
 * File was generated automatically by
 * sync_properties.ahk - DO NOT EDIT
 */

	public class Localizer {

	// wrapper 	for JavaScript jQuery.i18n
	public static native String getString(String key)/*-{
		var result = false;
		temp = 'Localizer: ' + key;
		try {
			result = $wnd.jQuery.i18n.prop( key );
			// result = eval( key );
		} catch(err) {
			result = '<' + temp + ' causes error ' + err + '>';
		}
		console.log(temp + ' -> ' + result);
		return result;
	}-*/;

//	public static String getCurrentLocale_bak(){
//		return LocaleInfo.getCurrentLocale().getLocaleName();
//	}
	
	public static native String getCurrentLocale()/*-{
	result = 'no result';	
	try {
//			console.log( $wnd.jQuery.i18n );
 			result = $wnd.jQuery.i18n.properties.language;
	} catch(err) {
		console.log('Error in Localizer.getCurrentLocale() ' + err);
	}
	return result;
}-*/;

}
