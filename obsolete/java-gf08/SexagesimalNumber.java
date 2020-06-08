package gut.client;

//import com.google.gwt.core.client.GWT;

import gut.client.DebugPanel;

/**
 * @author Rudolf Grossmann

 * @version gf08 24.11 (30. August 2016)
 */

public class SexagesimalNumber {
	private int degree = 90, deg_decimals = 0, minute = 0, second = 0;
	private String d_string = "0", m_string = "0", s_string = "0";
	private String degree_sign_java = "\u00b0"; 
	// \u00b0 = hex b0, shown as � in console
	private String degree_sign_utf8 = "\uc2b0"; 
	// \uc2b0 converted to hex 3f, shown as ? in console, same as ...="�"
	private String degree_sign_ascii = Character.toString((char) 248); 
	// 248 = hex f8, shown as �

	public SexagesimalNumber() {
		setDMS("0g");
	}

	public SexagesimalNumber(String DMS) {
		setDMS(DMS);
		// System.out.println("degree_sign_inline="+degree_sign_inline+" hex="+toHex(degree_sign_inline));
		// System.out.println("degree_sign_java="+degree_sign_java+" hex="+toHex(degree_sign_java));
		// System.out.println("degree_sign_utf8="+degree_sign_utf8+" hex="+toHex(degree_sign_utf8));
		// System.out.println("degree_sign_ascii="+degree_sign_ascii+" hex="+toHex(degree_sign_ascii));
	}
	
	// private String toHex(String arg) {
	// byte[] b = arg.getBytes();
	// String h = "";
	// for(int i=0; i<b.length; i++){
	// h += Converter.Byte2Hex(b[i]);
	// }
	// return h;
	// }


	public void setDegree(int degree) {
		this.degree = degree;
	}

	public void setDegreeDecimals(int decimals) {
		deg_decimals = decimals;
	}

	public void setMinute(int minute) {
		this.minute = minute;
	}

	public void setSecond(int second) {
		this.second = second;
	}

	public int getDegree() {
		return degree;
	}

	public int getMinute() {
		return minute;
	}

	public int getSecond() {
		return second;
	}

	public String getDMS() {
		if (deg_decimals > 0) {
			minute = 0;
			second = 0;
		}
		String h = "";
		if (degree > 0 || deg_decimals > 0) {
			h = h + String.valueOf(degree);
			if (deg_decimals > 0) {
				// TODO i18n hier Lokalisierung n�tig!
				h = h + "," + String.valueOf(deg_decimals);
			}
			h = h + "g ";
		}
		if (minute > 0) {
			h = h + String.valueOf(minute) + "' ";
		}
		if (second > 0) {
			h = h + String.valueOf(second) + "'' ";
		}
		if (h.length() > 0) {
			if (h.substring(h.length() - 1).equals(" ")) {
				h = h.substring(0, h.length() - 1);
			}
		} else {
			h = "0g";
		}

		// h=h+"<";
		// boolean dummy = setDMS(h);
		return h;
	}

	public double getDegreeValue() {
		double val = degree;
		if (deg_decimals > 0) {
			String h = String.valueOf(degree) + "."
					+ String.valueOf(deg_decimals);
			val = Double.valueOf(h).doubleValue();
			// double lenOfDenom=(double) String.valueOf(deg_decimals).length();
			// val = val + ((double) deg_decimals) / Math.pow(10,lenOfDenom);
		} else {
			val = val + ((double) minute) / 60 + ((double) second) / 3600;
		}
		return val;
	}

	public double getValue() {
		return getDegreeValue() * Math.PI / 180;
	}

	public boolean isValid(String DMS) {
//		GWT.log("Validierung von " + DMS);
		boolean valid = true;
		StringBuffer h = new StringBuffer(30);
		String allowed = degree_sign_ascii + degree_sign_java
				+ degree_sign_utf8 + "0123456789,.g' ";
		String ch = "";
		// Leerzeichen entfernen, auf unerlaubte Zeichen pr�fen
		for (int i = 0; i < DMS.length(); i++) {
			ch = DMS.substring(i, i + 1);
			if (!ch.equals(" ")) {
				if (allowed.indexOf(ch) == -1) {
					valid = false;
				} else {
					// replace � with g
					if (ch.equals(degree_sign_ascii)
							|| ch.equals(degree_sign_java)
							|| ch.equals(degree_sign_utf8)) {
						h.append("g");
					} else {
						h.append(ch);
					}
				}
			}
		}
		if (valid) {
			// '' durch s ersetzen, damit nicht '' statt ' gefunden wird.
			if (h.length() > 1
					&& h.substring(h.length() - 2, h.length()).equals("''")) {
				h.delete(h.length() - 2, h.length());
				h.append("s");
			}
			// DebugPanel.println("h=" + h, 3);
			// in drei Teile zerlegen
			d_string = "0";
			m_string = "0";
			s_string = "0";
			int position = 0;
			position = h.toString().indexOf("g");
			if (position != -1) {
				d_string = h.substring(0, position);
				h.delete(0, position + 1);
			}
			position = h.toString().indexOf("'");
			if (position != -1) {
				m_string = h.substring(0, position);
				h.delete(0, position + 1);
			}
			position = h.toString().indexOf("s");
			if (position != -1) {
				s_string = h.substring(0, position);
				h.delete(0, position + 1);
			}
			// DebugPanel.print("   Zerlegung: ", 3);
			// DebugPanel.println("d=" + d_string + " m=" + m_string + " s=" +
			// s_string, 3);

			if (h.length() > 0) {
				valid = false;
			}
			if (isNoNumber(d_string)) {
				valid = false;
			}
			if (isNoNumber(m_string)) {
				valid = false;
			}
			if (isNoNumber(s_string)) {
				valid = false;
			}
			if (d_string.indexOf(".") >= 0 || d_string.indexOf(",") >= 0) {
				if (!(m_string.equals("0") && s_string.equals("0"))) {
					valid = false;
				}
			}
		}
//		GWT.log("...ergibt " + valid);
		return valid;
	}

	public boolean setDMS(String DMS) {
//		GWT.log("***************************");
//		GWT.log("DMS=" + DMS);
//		GWT.log("isAlmostValid=" + isAlmostValid(DMS));
		boolean valid = isValid(DMS);
//		GWT.log("Nach Validierung:");
//		GWT.log("d=" + d_string + " m=" + m_string + " s=" + s_string);
		if (valid) {
			try {
				int position = d_string.indexOf(",");
				if (position == -1) {
					position = d_string.indexOf(".");
				}
				if (position == -1) {
//					GWT.log("d_string="+d_string);
					this.degree = Integer.valueOf(d_string).intValue();
//					GWT.log("setDMS degree="+degree);
					deg_decimals = 0;
				} else {
					degree = Integer.valueOf(d_string.substring(0, position))
							.intValue();
					deg_decimals = Integer.valueOf(
							d_string.substring(position + 1)).intValue();
				}
				minute = Integer.valueOf(m_string).intValue();
				second = Integer.valueOf(s_string).intValue();
			} catch (Exception ex) {
				DebugPanel.debugPrintln("Fehler in Methode setDMS", 1);
				DebugPanel.debugPrintln(ex.toString(), 1);
				valid = false;
			}
		}
		if (!valid) {
			degree = 0;
			deg_decimals = 0;
			minute = 0;
			second = 0;
		}
		return valid;
	}

	public boolean isAlmostValid(String DMS) {
//		GWT.log(DMS);
		boolean valid = false;
		if (isValid(DMS + "'")) {
			valid = true;
		} else {
			if (isValid(DMS + "''")) {
				valid = true;
			}
		}
//		GWT.log(" isAlmostValid=" + valid);
		return valid;
	}

	public boolean endsWithSeconds() {
		boolean ews = false;
		if (second > 0) {
			ews = true;
		}
		return ews;
	}

	public boolean endsWithMinutes() {
		boolean ewm = false;
		if (!endsWithSeconds() && minute > 0) {
			ewm = true;
		}
		return ewm;
	}

	public boolean endsWithDegrees() {
		boolean ewd = false;
		if (!(endsWithSeconds() || endsWithMinutes())) {
			ewd = true;
		}
		return ewd;
	}

	private boolean isNoNumber(String number) {
		boolean nan = false;
		String ch = "";
		if (number.length() == 0) {
			nan = true;
		} else {
			for (int i = 0; i < number.length(); i++) {
				ch = number.substring(i, i + 1);
				if ("0123456789,.".indexOf(ch) == -1) {
					nan = true;
				}
			}
		}
		return nan;
	}
}
