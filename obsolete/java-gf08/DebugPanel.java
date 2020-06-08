package gut.client;

import com.google.gwt.core.shared.GWT;
import com.google.gwt.user.client.ui.TextArea;

/**
 * @author Rudolf Grossmann

 * @version gf08 24.11 (30. August 2016)
 * 
 */

@SuppressWarnings("unused")
//TODO activate GWT.log

public class DebugPanel extends TextArea{
	final public static String CRLF = "\r\n";
	private String content="";

	public DebugPanel() {
		
	}

	public static void debugPrint(String message, String id) {
//		GWT.log(message + CRLF);
	}

	public static void debugCls() {
		
	}

	// **********************
	// *** Legacy methods ***
	// **********************

	public static void debugPrint(String s, int mode) {
		GWT.log("D> " + s);
//		Bridge.log(s);
	}

	public static void debugPrintln(String s, int mode) {
		GWT.log("D> " + s);
//		Bridge.log(s);
	}
}
