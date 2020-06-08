package gut.client;

import com.google.gwt.core.client.GWT;

public class LzwEncoder {
	private LzwDictionary inputDictionary = new LzwDictionary();
	private StringBuffer buffer = new StringBuffer("");

	public short Encode(char k) throws DoNotSend, CharUnknown {
		short result;
		String entry = "" + buffer + k;
		 // DebugPanel.debugPrint("encode char " + k, "LzwEncode");
		 // DebugPanel.debugPrint("look for entry=" + entry, "LzwEncode");
		if (inputDictionary.findEntry("" + buffer + k) != -1) {
			buffer = buffer.append(k);
			 // DebugPanel.debugPrint("buffer=" + buffer, "LzwEncode");
			 // DebugPanel.debugPrint("doNotSend", "LzwEncode");
			throw new DoNotSend();
		} else {
			inputDictionary.add(entry);
			result = inputDictionary.findEntry("" + buffer);
			if (result != -1) {
				buffer = new StringBuffer("" + k);
				 // DebugPanel.debugPrint("buffer=" + buffer,
				 // "LzwEncode");
				 // DebugPanel.debugPrint("result=" + result,
				 // "LzwEncode");
				return result;
			} else {
				GWT.log("LzwEncode: Did not find " + buffer);
				throw new CharUnknown();
			}
		}
	}

	public class DoNotSend extends Exception {
		private static final long serialVersionUID = 7024724027993361984L;
	}

	public class CharUnknown extends Exception {
		private static final long serialVersionUID = -843545604072541613L;
	}
}
