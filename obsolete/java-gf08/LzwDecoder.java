package gut.client;

/**
 * @author Rudolf Grossmann

 * @version gf08 24.11 (30. August 2016)
 */

public class LzwDecoder {
	LzwDictionary outputDictionary = new LzwDictionary();
	StringBuffer buffer = new StringBuffer("");

	public String Decode(short k) {
		String entry;

		if (buffer.length() == 0) {
			buffer = new StringBuffer(outputDictionary.returnEntry(k));
			return (buffer.toString());
		} else {
			entry = new String(outputDictionary.returnEntry(k));
			// remove this conditional to cause LZW bug
			if (entry.length() == 0) {
				entry = new String(buffer.toString() + buffer.charAt(0));
			}
			outputDictionary.add("" + buffer + entry.charAt(0));
			// DebugPanel.debugPrint("outputDictionary.size="+outputDictionary.size(), "LzwDecoder");
			buffer = new StringBuffer(entry);
			return entry;
		}
	}
}
