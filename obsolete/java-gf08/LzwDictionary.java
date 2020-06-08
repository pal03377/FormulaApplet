package gut.client;

/**
 * @author Rudolf Grossmann

 * @version gf08 24.11 (30. August 2016)
 */

import java.util.ArrayList;

// parts from http://www.cs.sfu.ca/CourseCentral/365/li/squeeze/LZW.html

public class LzwDictionary extends ArrayList<String> {

	private static final long serialVersionUID = 7117059928553573179L;

	LzwDictionary() {
		for (int i = 32; i <= 126; i++) {
	        char c = (char)(i);
			this.add("" + c);
		}
	}

	short findEntry(String word) {
		// returns the index number if found, -1 if not
		for (short index = 0; index < this.size(); index++) {
			if (word.equals(this.get(index))) {
				return index;
			}
		}
		return -1;
	}

	String returnEntry(short code) {
		// DebugPanel.debugPrint("this.size="+this.size()+" code="+code, "LzwDictionary");
		if (code >= this.size()) {
			return "";
		} else {
			return this.get(code);
		}
	}
}
