package gut.client;

import com.google.gwt.dom.client.NativeEvent;
import com.google.gwt.event.dom.client.KeyDownEvent;
import com.google.gwt.event.dom.client.KeyDownHandler;
import com.google.gwt.event.dom.client.KeyPressEvent;
import com.google.gwt.event.dom.client.KeyPressHandler;

/**
 * @version gf08 24.11 (30. August 2016)
 * @author Rudolf Grossmann

 *         <p>
 *         combination of former KeyManagerShared.java and KeyManager.java
 *         </p>
 */

// TODO mobile: Alt-a
// TODO classic: BACKSLASH

public class KeyManager extends KeyManagerHelper implements KeyDownHandler,
		KeyPressHandler {

	@Override
	public void onKeyDown(KeyDownEvent ev) {
		NativeEvent nev = ev.getNativeEvent();
		int keyCode = nev.getKeyCode();
		DebugPanel.debugPrint("KeyDownEvent: keyCode=" + keyCode
				+ " Character=<" + String.valueOf((char) keyCode) + ">",
				"KeyManager");
		boolean consumed = manageKeyCodeEvent(true, nev.getCtrlKey(),
				nev.getAltKey(), nev.getShiftKey(), keyCode);

		// First KeyDownEvent, second KeyPressEvent
		// If event is consumed by onKeyDown(), then onKeyPress is never reached
		// because of ev.StopPropagation().
		if (consumed) {
			ev.preventDefault();
			ev.stopPropagation();
		}
	}

	@Override
	public void onKeyPress(KeyPressEvent ev) {
		NativeEvent nev = ev.getNativeEvent();
		String character = String.valueOf(ev.getCharCode());
		DebugPanel.debugPrint("KeyPressEvent: Character=<" + character + ">",
				"KeyManager");
		// int unicode = ev.getUnicodeCharCode(); not used - DELETE
		boolean consumed = manageKeyCharacterEvent(true, nev.getCtrlKey(),
				nev.getAltKey(), nev.getShiftKey(), character);
		if (consumed) {
			ev.preventDefault();
			ev.stopPropagation();
		}
	}

	boolean manageKeyCharacterEvent(boolean mobile, boolean ctrl, boolean alt,
			boolean shift, String ch) {
		// \u00c4=� \u00d6=� \u00dc=� \u00e4=� \u00f6=� \u00fc=�
		// characters = "01...WXYZ������" doesn' t work.
		final String characters = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ\u00c4\u00d6\u00dc\u00e4\u00f6\u00fc";
		String key = "";
		int position = characters.indexOf(ch);
		// Allow: a, Shift-a = A
		// Deny: ALT-A, CTRL-A, ALT-SHIFT-A, CTRL-SHIFT-A, CTRL-ALT-A,
		// CTRL-ALT-SHIFT-A,...
		if (position >= 0 && !ctrl && !alt) {
			key = ch;
		}

		// Character Names ;
		if (key.isEmpty()) {
			if (ch.equals("+")) {
				key = "PLUS";
			} else if (ch.equals("-")) {
				key = "MINUS";
			} else if (ch.equals("*")) {
				key = "TIMES";
			} else if (ch.equals("/")) {
				key = "FRACTION";
			} else if (ch.equals(":")) {
				key = "DIVIDE";
			} else if (ch.equals(" ")) {
				key = "SPACE";
			} else if (ch.equals(",")) {
				key = "COMMA";
			} else if (ch.equals(".")) {
				key = "POINT";
			} else if (ch.equals("=")) {
				key = "EQUALS";
			} else if (ch.equals(";")) {
				key = "SEMICOLON";
				// } else if (ch.equals("�")) {
			} else if (ch.equals("\u00b0")) {
				key = "DEGREE";
			} else if (ch.equals("!")) {
				key = "EXCLAMATION";
			} else if (ch.equals("%")) {
				key = "PERCENT";
			} else if (ch.equals("&")) {
				key = "AMPERSAND";
			} else if (ch.equals("(")) {
				key = "BRACKET_LEFT";
			} else if (ch.equals(")")) {
				key = "BRACKET_RIGHT";
			} else if (ch.equals("[")) {
				key = "SQUARE_LEFT";
			} else if (ch.equals("]")) {
				key = "SQUARE_RIGHT";
			} else if (ch.equals("{")) {
				key = "CURLY_LEFT";
			} else if (ch.equals("}")) {
				key = "CURLY_RIGHT";
			} else if (ch.equals("<")) {
				key = "LESS";
			} else if (ch.equals(">")) {
				key = "GREATER";
			} else if (ch.equals("#")) {
				key = "DIAMOND";
			} else if (ch.equals("'")) {
				key = "MINUTE";
			} else if (ch.equals("~")) {
				key = "TILDE";
			} else if (ch.equals("_")) {
				key = "UNDERSCORE";
			} else if (ch.equals("\\")) {
				key = "BACKSLASH";
			} else if (ch.equals("|")) {
				key = "PIPE";
				// \u00B5 = 181 = � (Micro)
				// \u03BC = 956 = � (Greek small letter mu)
			} else if (ch.equals("\u00B5") || ch.equals("\u03BC")) {
				key = "MU";
			} else if (ch.equals("@")) {
				key = "AT";
				// \u20AC = �
			} else if (ch.equals("\u20AC")) {
				key = "EURO";
			} else if (ch.equals("?")) {
				key = "QUESTION";
				// \u00df = 223 = �
			} else if (ch.equals("\u00df")) {
				key = "SZLIG";
			}
		}

		boolean consumed = false;
		if (!key.isEmpty()) {
			String modifier = (ctrl ? "CTRL-" : "") + (alt ? "ALT-" : "");
			sendCommand(modifier, key); // output to debug
			consumed = true;
		} else {
			// output to debug panel
			// CommandEventProvider.fireCommandEvent(this, "",
			// "not consumed by ManageKeyCharacterEvent <" + ch + ">",
			// "debug");
		}
		return consumed;
	}

	// ***************************************************************************
	// ** manageKeyCodeEvent using keyCode *****************
	// ***************************************************************************
	boolean manageKeyCodeEvent(boolean mobile, boolean ctrl, boolean alt,
			boolean shift, int keyCode) {
		String key = "";
		// Allow: ALT-A, CTRL-A, ALT-SHIFT-A, CTRL-SHIFT-A, CTRL-ALT-A,
		// CTRL-ALT-SHIFT-A,...
		// Deny: a and SHIFT-a = A
		if (ctrl || alt) {
			// A-Z
			if (65 <= keyCode && keyCode <= 90) {
				int index = keyCode - 65;
				key = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".substring(index, index + 1);
			}

			// supress CTRL-ALT-M, -Q, -E because MU, AT, EURO are handled by
			// manageCharacterKeyEvent
			if (ctrl && alt && !shift) {
				if (key.equals("M") || key.equals("Q") || key.equals("E")) {
					key = "";
				}
			}
		}

		// Function keys
		if (key.isEmpty() && 112 <= keyCode && keyCode <= 123) {
			int Index = keyCode - 112;
			if (Index < 9) {
				key = "F" + "123456789".substring(Index, Index + 1);
			} else {
				Index -= 9;
				key = "F" + "101112".substring(2 * Index, 2 * Index + 2);
			}
		}

		// Navigation keys
		if (key.isEmpty()) {
			switch (keyCode) {
			// case KeyCodes.KEY_BACKSPACE: would be nice syntax, but not
			// shareable,
			// would need import com.google.gwt.event.dom.client.KeyCodes;

			// ev.getKeyCode() differs (classic Java/ mobile GWT)

			case 8:
				key = "BACKSPACE";
				break;
			case 46:
				if (mobile) {
					key = "DELETE";
				}
				break;
			case 127: // classic
				if (!mobile) {
					key = "DELETE";
				}
				break;
			case 40:
				key = "DOWN";
				break;
			case 35:
				key = "END";
				break;
			case 10: // classic
				if (!mobile) {
					key = "ENTER";
				}
				break;
			case 13: // mobile
				if (mobile) {
					key = "ENTER";
				}
				break;
			case 27:
				key = "ESCAPE";
				break;
			case 36:
				key = "HOME";
				break;
			case 45: // mobile
				if (mobile) {
					key = "INSERT";
				}
				break;
			case 155: // classic
				if (!mobile) {
					key = "INSERT";
				}
				break;
			case 37:
				key = "LEFT";
				break;
			case 34:
				key = "PAGEDOWN";
				break;
			case 33:
				key = "PAGEUP";
				break;
			case 39:
				key = "RIGHT";
				break;
			case 9:
				key = "TAB";
				break;
			case 38:
				key = "UP";
				break;
			case 130: // classic
				// DEGREE is handled by manageCharacterKeyEvent
				if (!mobile && !shift) {
					key = "CARET"; // ^
				}
				break;
			case 220: // mobile
				if (mobile && !shift) {
					key = "CARET";
				}
				break;
			default:
				key = "";
			}
		}

		boolean consumed = false;
		String modifier = (ctrl ? "CTRL-" : "") + (alt ? "ALT-" : "")
				+ (shift ? "SHIFT-" : "");
		if (!key.isEmpty()) {
			sendCommand(modifier, key);
			consumed = true;
		} else {
			// key is empty
			// output to debug panel: event has happened, but is not consumed
			// no debug output if keyCode =16, 17, 18: ALT, SHIFT, CTRL
			if (keyCode < 16 || 18 < keyCode) {
				DebugPanel.debugPrint("not consumed by ManageKeyCodeEvent: "
						+ modifier + key + " keyCode=" + keyCode,
						"KeyManagerShared");
			}

			// this replacement caused buggy code: a,A,... not noticed
			// because consumed=true causes an ev.stopPropagation()
			// and keypressed is not reached! Montelparo 2013-08-30

			// if (keyCode < 16 || 18 < keyCode) {
			// consumed= true;
			// } else {
			// DebugPanel.debugPrint("not consumed by ManageKeyCodeEvent: "
			// + modifier + key + " keyCode=" + keyCode,
			// "KeyManagerShared");
			//
			// }

		}
		return consumed;
	}

	private void sendCommand(String modifier, String key) {
		// CommandEventProvider.fireCommandEvent(this,
		// "","before unifying: modifier="+modifier+" key="+key, "debug");
		// unify modifier to CTRL-ALT-SHIFT- or CHAR-<letter> or
		// KEY-<nameOfKey>
		// System.out.println("before unifying "+modifier+key);

		// KEY-CURLY... -> BRACKET-{
		boolean key_modified = false;
		if (key.equalsIgnoreCase("BRACKET_LEFT")) {
			key = "(";
			key_modified = true;
		} else if (key.equalsIgnoreCase("BRACKET_RIGHT")) {
			key = ")";
			key_modified = true;
		} else if (key.equalsIgnoreCase("SQUARE_LEFT")) {
			key = "[";
			key_modified = true;
		} else if (key.equalsIgnoreCase("SQUARE_RIGHT")) {
			key = "]";
			key_modified = true;
		} else if (key.equalsIgnoreCase("CURLY_LEFT")) {
			key = "{";
			key_modified = true;
		} else if (key.equalsIgnoreCase("CURLY_RIGHT")) {
			key = "}";
			key_modified = true;
		} else if (key.equalsIgnoreCase("PIPE")) {
			key = "|";
			key_modified = true;
		}
		if (key_modified) {
			modifier = "BRACKET-";
		}
		if (modifier.equals("")) {
			if (key.length() == 1) {
				modifier = "CHAR-";
			} else {
				modifier = "KEY-";
				key = key.toUpperCase();
			}
		} else {
			key = key.toUpperCase();
		}

		// System.out.println("after unifying "+modifier+key);
		StringPair command = new StringPair(modifier, key);

		// pre_sort creates modifiers BRACKET, OPERATOR,...
		// and collects abbreviation for greek letters: #al, #be,...
		// and collects chars for function names sin, cos, tan, ln, lg, log,...
		command = pre_sort(command);
		// TODO Localization of shortcuts
		// create shortcuts for commands, functions and so on. Collect greek and
		// function shortcuts.
		command = translateShortcuts(command);
		if (!command.getModifier().endsWith("DONE")) {
				FaEventProvider.fireFaEvent(command.getCmd(), command.getModifier());
		}
	}
}
