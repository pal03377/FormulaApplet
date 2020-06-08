package gut.client;

/**
 * @author Rudolf Grossmann
 * @version gf08 24.11 (30. August 2016)
 */

public class Bridge {

	// Call Java from JavaScript defining bridge methods

	public static synchronized native void defineBridgeMethod() /*-{
	$wnd.bridgeFireFaEvent = function(command, kind) {
//		// see Java code in gut.client.FaEventProvider
		try {
			return @gut.client.FaEventProvider::fireFaEvent(Ljava/lang/String;Ljava/lang/String;)(command, kind);
		} catch(err) {
			console.log( 'error in Bridge.java:bridgeFireFaEvent' );
		}
//		return true;
	}
	console.log('bridge methods are defined!');
}-*/;
	
	// Call JavaScript/jQuery from Java using native 
	
	public static native void log(String message) /*-{
	    $wnd.console.log("J> " + message);
}-*/;
	
	public static native boolean isInEditor() /*-{
		var result = false;
		try {
			// var inEditor set by resourceloader3
			result = $wnd.inEditor;
		} catch(err) {
			result = false;
		}
		return result;
}-*/;

	public static native void vkbd_on()/*-{
	$wnd.vkbd_on();
}-*/;

	public static native void vkbd_off()/*-{
	$wnd.vkbd_off();
}-*/;

	public static native void vkbd_toggle()/*-{
	$wnd.vkbd_toggle();
}-*/;

// setter methods	
	public static native void setOutput(String id)/*-{
	$wnd.$( "#" + id ).removeClass( "isOutput" ).removeClass( "isActive" ).removeClass( "isInactive" ).removeClass(" isWrong" ).removeClass( "isOk" );
	$wnd.$( "#" + id ).addClass("isOutput");
}-*/;

	public static native void setActive(String id)/*-{
	$wnd.$(".formelapplet.isActive").removeClass("isActive").addClass("isInactive");
	$wnd.$( "#" + id ).removeClass( "isOutput" ).removeClass( "isActive" ).removeClass( "isInactive" ).removeClass(" isWrong" ).removeClass( "isOk" );
	$wnd.$( "#" + id ).addClass("isActive");
	$wnd.$( "#output" ).html( "isActive: " + id );
}-*/;

	public static native void setOk(String id)/*-{
	$wnd.$( "#" + id ).removeClass( "isOutput" ).removeClass( "isActive" ).removeClass( "isInactive" ).removeClass(" isWrong" ).removeClass( "isOk" );
	$wnd.$( "#" + id ).addClass("isOk");
}-*/;

	public static native void setWrong(String id)/*-{
	$wnd.$( "#" + id ).removeClass( "isOutput" ).removeClass( "isActive" ).removeClass( "isInactive" ).removeClass(" isWrong" ).removeClass( "isOk" );
	$wnd.$( "#" + id ).addClass("isWrong");
}-*/;

	public static native void setInactive(String id)/*-{
	$wnd.$( "#" + id ).removeClass( "isOutput" ).removeClass( "isActive" ).removeClass( "isInactive" ).removeClass(" isWrong" ).removeClass( "isOk" );
	$wnd.$( "#" + id ).addClass("isInactive");
}-*/;

//	public static native void setAllInactive()/*-{
//	$wnd.$(".formelapplet").removeClass("isActive");
//}-*/;

// getter methods
	public static native boolean isOutput(String id) /*-{
	var result = false;
	try {
		// var inEditor set by resourceloader3
		result = $wnd.$( "#" + id ).hasClass("isutput");
	} catch(err) {
		result = false;
	}
	return result;
}-*/;

	public static native boolean isActive(String id) /*-{
	var result = false;
	try {
		// var inEditor set by resourceloader3
		result = $wnd.$( "#" + id ).hasClass("isActive");
	} catch(err) {
		result = false;
	}
	return result;
}-*/;

	public static native boolean isInactive(String id) /*-{
	var result = false;
	try {
		// var inEditor set by resourceloader3
		result = $wnd.$( "#" + id ).hasClass("isInactive");
	} catch(err) {
		result = false;
	}
	return result;
}-*/;

	public static native boolean isWrong(String id) /*-{
	var result = false;
	try {
		// var inEditor set by resourceloader3
		result = $wnd.$( "#" + id ).hasClass("isWrong");
	} catch(err) {
		result = false;
	}
	return result;
}-*/;

	public static native boolean isOk(String id) /*-{
	var result = false;
	try {
		// var inEditor set by resourceloader3
		result = $wnd.$( "#" + id ).hasClass("isOk");
	} catch(err) {
		result = false;
	}
	return result;
}-*/;

	public static native void setCursor(String id)/*-{
		$wnd.$("*").removeClass("hasCursor");
		$wnd.$("*").removeClass("hasCursor2clicked");
		$wnd.$( "#" + id ).addClass("hasCursor");
	}-*/;

	public static native void setCursor2clicked(String id)/*-{
		$wnd.$("*").removeClass("hasCursor");
		$wnd.$("*").removeClass("hasCursor2clicked");
		$wnd.$( "#" + id ).addClass("hasCursor2clicked");
	}-*/;
	
// see javascript code in war/js/glue.js
	public static native void make_clickable() /*-{
	// console.log("Bridge.java: make_clickable()");
	$wnd.make_clickable();
}-*/;
	
	public static native void winSetEditMode(String edit) /*-{
	try {
	 	$wnd.setEditMode(edit);
	} catch(err) {
		console.log( 'error in Bridge.java:winSetEditMode' );
	}
}-*/;

	public static native void winAdjustRadics() /*-{
	try {
	 	$wnd.adjustRadics();
	} catch(err) {
		console.log( 'error in Bridge.java:winAdjustRadics' );
	}
}-*/;

	public static native void CSS_zoom(int em) /*-{
	try {
		em2 = (parseFloat(em) / 30) + "em";
		console.log("font-size: " + em2);
		$wnd.$(".formelapplet").css("font-size", em2);
	} catch(err) {
		console.log( 'error in Bridge.java:CSS_zoom' );
	}
}-*/;
	
	public static native void CSS_zoom_inoperative(int em) /*-{
	console.log( 'Bridge.java:CSS_zoom inoperative' );
}-*/;

	public static native String getActiveId() /*-{
	var result = "";
	try {
		// var inEditor set by resourceloader3
		result = $wnd.$( '.isActive' ).attr( 'id' );
	} catch(err) {
		result = err;
	}
//	console.log( 'Bridge.getActiveId=' + result );
	return result;
}-*/;

//	public static native void moduleLoaded() /*-{
//		$wnd.moduleLoaded();
//	}-*/;
}
