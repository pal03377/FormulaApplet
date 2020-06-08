package gut.client;

/**
 * @author Rudolf Grossmann

 * @version gf08 24.11 (30. August 2016)
 * <p>
 *          pre_sort creates modifiers BRACKET, OPERATOR,...<br>
 *          and collects abbreviation for greek letters: #al, #be,... <br>
 *          and collects chars for function names sin, cos, tan, ln, lg, log,...
 *          </p>
 */

public class KeyManagerHelper {
//	private String Id = "<unknown>";

	private static String greekLetters = "|#al|#be|#ga|#de|#ep|#ze|#et|#th|#io|#ka|#la|#my|#ny|#xi|#ok|#pi|#rh|#si|#ta|#yp|#ph|#ch|#ps|#om|#OM|";
	private String greekCollector = "";
	private static String theFunctions = "|sin|cos|tan|ln|lg|pi|log|";
	private static String functionCollector = "";

	protected StringPair pre_sort(StringPair modifier_key) {
		// includes greekCollector logic and functionCollector logic
		String modifier = modifier_key.getModifier();
		String key = modifier_key.getCmd();
		if (modifier.endsWith("CHAR-")) {
			String haystack = "()[]{}|";
			if (haystack.indexOf(key) >= 0) {
				modifier = "BRACKET-";
			}
			haystack = "0123456789";
			if (haystack.indexOf(key) >= 0) {
				modifier = "NUMBER-";
			} else if (key.equals("<")) {
				modifier = "KEY-";
				key = "LESS";
			} else if (key.equals(">")) {
				modifier = "KEY-";
				key = "GREATER";
			} else if (key.equals("/")) {
				modifier = "KEY-";
				key = "SLASH";
			} else if (key.equals("?")) {
				modifier = "KEY-";
				key = "QUESTIONMARK";
			} else if (key.equals("\\")) { // must be escaped by \ inside a
											// string.
				modifier = "KEY-";
				key = "BACKSLASH";
			} else if (key.equals("_")) {
				modifier = "KEY-";
				key = "UNDERSCORE";
			} else if (key.equals(",")) {
				modifier = "NUMBER-";
				key = "COMMA";
			} else if (key.equals(";")) {
				modifier = "KEY-";
				key = "SEMICOLON";
			} else if (key.equals(".")) {
				modifier = "NUMBER-";
				key = "POINT";
			} else if (key.equals("~")) {
				modifier = "KEY-";
				key = "TILDE";
			}
		}
		if (modifier.endsWith("KEY-")) {
			String haystack = "|SPACE|EQUAL|PERCENT|MINUTE|AT|DIAMOND|ENTER|DEGREE|";
			if (haystack.indexOf("|" + key + "|") >= 0) {
				modifier = "KEY-";
			}
			haystack = "|PLUS|MINUS|TIMES|DIVIDED|";
			if (haystack.indexOf("|" + key + "|") >= 0) {
				modifier = "OPERATOR-";
			}
			haystack = "|COMMA|POINT|";
			if (haystack.indexOf("|" + key + "|") >= 0) {
				modifier = "NUMBER-";
			}
		}

		/**
		 * @todo EnterDisabled
		 */

		// collect chars for function name
		if (modifier.equals("CHAR-") && key.length() == 1) {
			functionCollector += key;
			// DebugPanel.debugPrintln("fn = " + functionCollector, 3);
			int position = theFunctions.indexOf(("|" + functionCollector + "|")
					.toLowerCase());
			if (position >= 0) {
				String function = theFunctions.substring(position + 1, position
						+ 1 + functionCollector.length());
				// DebugPanel.debugPrintln("function = " + function, 3);
				modifier = "FUNCTION-";
				key = function;
			}
		} else {
			functionCollector = "";
		}

		// collect for greek abbreviations #al #be #ga ...
		if (greekCollector.length() > 0) {
			// collecting...
			if (modifier.equals("CHAR-")) {
				// DebugPanel.debugPrint("continue collecting: ", 3);
				greekCollector = greekCollector + key;
				modifier = "DONE";
				// DebugPanel.debugPrintln(greekCollector, 3);
				if (greekCollector.length() == 3) {
					int position = greekLetters
							.indexOf(("|" + greekCollector + "|").toLowerCase());
					// DebugPanel.debugPrintln("position=" +
					// String.valueOf(position), 3);
					if (position >= 0) {
						position = position / 4;
						if (position >= 17) {
							position += 1; // position 17 (char 962)
											// �berspringen
						}
						if (position == 7) {
							position = 32; // andere Schreibweise f�r Theta
						}
						// DebugPanel.debugPrintln("griech. vorher : " +
						// greekCollector, 3);
						if (greekCollector.equals("#OM")) {
							key = "\u2126"; //
						} else {
							key = String.valueOf((char) (945 + position));
						}
						greekCollector = "";
						modifier = "CHAR-";
					} else {
						// abbreviation #xy not found
						modifier = "STOP";
					}
				}
				if (greekCollector.length() > 3) {
					modifier = "STOP";
				}
			} else {
				// no char
				modifier = "STOP";
			}
		} else {
			if (modifier.equals("KEY-") && key.equals("DIAMOND")) { // #
			// DebugPanel.debugPrint("start collecting", 3);
				greekCollector = "#";
				// DebugPanel.debugPrintln(greekCollector, 3);
				modifier = "DONE";
				key = "";
			}
		}
		if (modifier.equals("STOP")) {
			greekCollector = "";
			// DebugPanel.debugPrintln("STOP collecting",3);
			modifier = "DONE";
			key = "";
		}
		return new StringPair(modifier, key);
	}

	protected StringPair translateShortcuts(StringPair modifier_cmd) {
		String modifier = modifier_cmd.getModifier();
		String cmd = modifier_cmd.getCmd();
		String result = cmd;
		if (modifier.equals("KEY-")) {
			if (cmd.equals("F1")) {
				result = "CMD-SHOW_VERSION";
			}
			if (cmd.equals("F2")) {
				result = "CMD-INFO";
			}
			if (cmd.equals("F3")) {
				result = "CMD-TEX";
			}
			if (cmd.equals("F4")) {
				result = "CMD-DUMP-TREE";
			}
			if (cmd.equals("F7")) {
				result = "CMD-TOGGLE-DECIMALSEPARATOR";
			}
			if (cmd.equals("F8")) {
				result = "CMD-TOGGLE-DEBUGCURSOR";
			}
			if (cmd.equals("F9")) {
				result = "CMD-GETREPRESENTATION";
			}
			if (cmd.equals("F12")) {
				result = "CMD-REPAINT";
			}
			if (cmd.equals("DEL")) {
				result = "CMD-DELETE";
			}
			if (cmd.equals("BACKSPACE")) {
				result = "CMD-BACKSPACE";
			}
			if (cmd.equals("ESC")) {
				result = "CMD-CLEAR_DEBUG";
			}
			if (cmd.equals("PAGEUP")) {
				result = "CMD-ZOOM_IN";
			}
			if (cmd.equals("PAGEDOWN")) {
				result = "CMD-ZOOM_OUT";
			}
			if (cmd.equals("UP")) {
				modifier = "CURSOR-";
			}
			if (cmd.equals("DOWN")) {
				modifier = "CURSOR-";
			}
			if (cmd.equals("RIGHT")) {
				modifier = "CURSOR-";
			}
			if (cmd.equals("LEFT")) {
				modifier = "CURSOR-";
			}
			if (cmd.equals("ESCAPE")) {
				result = "CMD-CLEAR_DEBUG";
			}
		}

		if (modifier.equals("SHIFT-")) {
			if (cmd.equals("F1")) {
				result = "CMD-SWITCH_MODE";
			}
			if (cmd.equals("UP")) {
				result = "OPERATOR-TIMES_TEN";
			}
			if (cmd.equals("DEL")) {
				result = "CMD-CLEAR_INPUTFIELD";
			}
			if (cmd.equals("ESCAPE")) {
				result = "CMD-CLEAR_DEBUG";
			}
		}

		if (modifier.equals("KEY-")) {
			if (cmd.equals("SLASH")) {
				result = "OPERATOR-FRAC";
			}
		}

		if (modifier.equals("ALT-SHIFT-")) {
			if (cmd.equals("PERCENT")) {
				result = "KEY-PERMIL";
			}
		}

		if (modifier.equals("CTRL-")) {
			if (cmd.equals("PLUS")) {
				result = "CMD-ZOOM_IN";
			}
			if (cmd.equals("MINUS")) {
				result = "CMD-ZOOM_OUT";
			}
			if (cmd.equals("INS")) {
				result = "CMD-INSERT_BOUNDARY";
			}
			if (cmd.equals("DEL")) {
				result = "CMD-DELETE_BOUNDARY";
			}
			if (cmd.equals("DOWN")) {
				result = "OPERATOR-CREATEINDEX";
			}
			/**
			 * @todo localisation of shortcuts
			 */
			if (cmd.equals("A")) {
				result = "EQN-EQUATION_AUTO";
			}
			if (cmd.equals("B")) {
				result = "OPERATOR-FRAC";
			}
			if (cmd.equals("E")) {
				result = "CMD-EDIT";
			}
			if (cmd.equals("H")) {
				result = "OPERATOR-HIGHER_ROOT";
			}
			if (cmd.equals("L")) {
				result = "OPERATOR-LOG";
			}
			if (cmd.equals("M")) {
				result = "EQN-EQUATION_MANU";
			}
			if (cmd.equals("N")) {
				result = "KEY-NO_RESULT";
			}
			if (cmd.equals("P")) {
				result = "OPERATOR-PERIOD";
			}
			if (cmd.equals("R")) {
				result = "OPERATOR-ROOT";
			}
			if (cmd.equals("T")) {
				result = "CMD-TEST";
			}
			if (cmd.equals("U")) {
				result = "OPERATOR-INFINITY";
			}
			// 2012-02-22 Cut, Copy, Paste
			if (cmd.equals("C")) {
				result = "CMD-COPY";
			}
			if (cmd.equals("V")) {
				result = "CMD-PASTE";
			}
			if (cmd.equals("X")) {
				result = "CMD-CUT";
			}
		}

		if (modifier.equals("ALT-")) {
			if (cmd.equals("B")) {
				result = "OPERATOR-INTEGRAL_B";
			}
			if (cmd.equals("I")) {
				result = "OPERATOR-INTEGRAL_B";
			}
			if (cmd.equals("L")) {
				result = "OPERATOR-LIMES_2A";
			}
			if (cmd.equals("N")) {
				result = "KEY-NO_RESULT";
			}
			if (cmd.equals("U")) {
				result = "OPERATOR-INTEGRAL_U";
			}
			if (cmd.equals("W")) {
				result = "OPERATOR-ROOT";
			}
			if (cmd.equals("DOWN")) {
				result = "OPERATOR-CREATEINDEX";
			}
		}

		if (modifier.equals("ALT-SHIFT-")) {
			if (cmd.equals("L")) {
				result = "OPERATOR-LIMES_L2A";
			}
			if (cmd.equals("R")) {
				result = "OPERATOR-LIMES_R2A";
			}
		}
		if (modifier.equals("SHIFT-")) {
			if (cmd.equals("DOWN")) {
				result = "OPERATOR-CREATEINDEX";
			}
		}

		int pos = result.indexOf("-");
		if (pos >= 0) {
			modifier = result.substring(0, pos + 1);
			result = result.substring(pos + 1);
		}

		return new StringPair(modifier, result);
	}

//	public String getId() {
//		return Id;
//	}
//
//	public void setId(String Id) {
//		this.Id = Id;
//	}

	protected class StringPair {
		private String modifier = "";
		private String cmd = "";

		// no setter methods; use constructor instead
		public StringPair(String m, String c) {
			modifier = m;
			cmd = c;
		}

		public String getModifier() {
			return modifier;
		}

		public String getCmd() {
			return cmd;
		}
	}
}
