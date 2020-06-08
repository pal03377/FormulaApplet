package gut.client;

import java.util.HashMap;

/**
 * @author Rudolf Grossmann
 * @version gf08 24.11 (30. August 2016)
 * 
 *          //TODO Get rid of properties in FasEditor
 */

// Every CommandManager possesses an ExpressionPainterParameterManager: Par
// Every FormulaApplet possesses a CommandManager: myCommandManager

public class ExpressionPainterParameterManager {

	// Modes of CombiPanel, named ExpressionPanel (legacy).

	// 0 = Legacy! behave like old ExpressionInputPanel, solution=...
	final public static short CPMODE_input = 0;

	// 1 = CombiPanel manuell, term=ZIP-CM1-...-... -> expression=...
	// solution=...
	// Term unterhalb von boundary mit solution vergleichen.
	// Anwendung: Limes, Integral, f(x)= ...
	final public static short CPMODE_term_solution = 1;

	// 2 = CombiPanel automatisch, term=ZIP-CM2-... -> Gleichung/Ungleichung auf
	// Allgemeing�ltigkeit �berpr�fen.
	final public static short CPMODE_auto = 2;

	// 3 = Legacy! Spezialfall von 1, ohne boundary. term -> expression. Ersetzt
	// ExpressionOutputPanel.
	final public static short CPMODE_output = 3;

	// cursor modes
	final public static short CU_LINE = 1;
	final public static short CU_COLORED_CHAR = 2;
	final public static short CU_RECTANGLE = 3;
	final public static short CU_HOOK = 4;
	final public static short CU_DEBUG = 5;

	// unit detection
	final public static String UNITDETECTIONMODE_MATH = "math";
	final public static String UNITDETECTIONMODE_PHYSICS = "physics";
	final public static String UNITDETECTIONMODE_ASK = "ask";
	final public static String CRLF = "\r\n";

	// parameters not to be saved
//	private short Mode = MODE_Output;
	private short CombiPanelMode = CPMODE_auto;
	private short CursorMode = CU_LINE;
	private static boolean debugPanelVisible = false;
	private DefinitionSet definitionSet = new DefinitionSet();
	private float phase = 2;
	private String _id = "<unknown>";

	private HashMap<String, EP_Parameter> EP_Parameters = new HashMap<String, EP_Parameter>();
	// constants sorted output of EP_Parameters
	final public static String[] theColors = { "Font", "Output", "InputActive", "InputInactive", "Cursor", "AlmostUnit",
			"Unit", "Ok", "Wrong", "Back", "Boundary" };

	final public static String[] theFontMetrics = { "size", "minsize", "xspacing", "fractionlineheight",
			"timesdotradius", "xoffset", "yoffset", "yposition", "yoffsetmin", "boundedwidth",
			"boundedheight" };

	final public static String[] theOthers = { "precision", "condition", "def0", "def1", "def2", "def3", "def4", "def5",
			"def6", "def7", "def8", "def9", "unitmode", "DecimalSeparator", "PowerFactor", "PowerRaise", "yi_factor",
			"unitmode", "lang" };

	// Konstruktor
	public ExpressionPainterParameterManager() {
		// colors
		EP_Parameters.put("FontColor", new EP_Parameter("0000ff", true));
		EP_Parameters.put("OutputColor", new EP_Parameter("d0d0d0", true));
		EP_Parameters.put("InputActiveColor", new EP_Parameter("00ffff", true));
		EP_Parameters.put("InputInactiveColor", new EP_Parameter("b0b0b0", true));
		EP_Parameters.put("CursorColor", new EP_Parameter("ff0000", true));
		EP_Parameters.put("BlinkColor", new EP_Parameter("ff0000", true));
		EP_Parameters.put("AlmostUnitColor", new EP_Parameter("c0c000", true));
		EP_Parameters.put("UnitColor", new EP_Parameter("202000", true));
		EP_Parameters.put("OkColor", new EP_Parameter("00ff00", true));
		EP_Parameters.put("WrongColor", new EP_Parameter("ffc800", true));
		EP_Parameters.put("BackColor", new EP_Parameter("002020", true));
		EP_Parameters.put("BoundaryColor", new EP_Parameter("ccffff", true));
		// font metrics
		// EP_Parameters.put("zoomdegree", new EP_Parameter("0", true));
		// //MathML Bayrisch Zell 2015
		EP_Parameters.put("size", new EP_Parameter("60", true));
		EP_Parameters.put("minsize", new EP_Parameter("10", true));
		EP_Parameters.put("xspacing", new EP_Parameter("0", false));
		// (.., false) -> don't save
		EP_Parameters.put("fractionlineheight", new EP_Parameter("0", false));
		EP_Parameters.put("timesdotradius", new EP_Parameter("0", false));
		EP_Parameters.put("xoffset", new EP_Parameter("10", true));
		EP_Parameters.put("yoffset", new EP_Parameter("10", true));
		EP_Parameters.put("yposition", new EP_Parameter("-1", true));
		// yposition -1 -> use yoffset
		EP_Parameters.put("yoffsetmin", new EP_Parameter("10", true));
		EP_Parameters.put("boundedwidth", new EP_Parameter("200", true));
		EP_Parameters.put("boundedheight", new EP_Parameter("100", true));

		// Other
		EP_Parameters.put("precision", new EP_Parameter("0.0000001", true));
		EP_Parameters.put("condition", new EP_Parameter("<empty>", true));
		EP_Parameters.put("def0", new EP_Parameter("<empty>", true));
		EP_Parameters.put("def1", new EP_Parameter("<empty>", true));
		EP_Parameters.put("def2", new EP_Parameter("<empty>", true));
		EP_Parameters.put("def3", new EP_Parameter("<empty>", true));
		EP_Parameters.put("def4", new EP_Parameter("<empty>", true));
		EP_Parameters.put("def5", new EP_Parameter("<empty>", true));
		EP_Parameters.put("def6", new EP_Parameter("<empty>", true));
		EP_Parameters.put("def7", new EP_Parameter("<empty>", true));
		EP_Parameters.put("def8", new EP_Parameter("<empty>", true));
		EP_Parameters.put("def9", new EP_Parameter("<empty>", true));
		EP_Parameters.put("unitmode", new EP_Parameter("math", true));
		EP_Parameters.put("DecimalSeparator", new EP_Parameter(",", true));
		EP_Parameters.put("PowerFactor", new EP_Parameter("0.65", true));
		EP_Parameters.put("PowerRaise", new EP_Parameter("1.05", true));
		EP_Parameters.put("yi_factor", new EP_Parameter("0.35", true));
		EP_Parameters.put("unitmode", new EP_Parameter("math", true));
		EP_Parameters.put("lang", new EP_Parameter("<empty>", false)); // save=false

		// Switches (boolean), not to be saved
		EP_Parameters.put("EditMode", new EP_Parameter("false", false));
		// EP_Parameters.put("EditMode", new EP_Parameter("true", false));
		EP_Parameters.put("bounded", new EP_Parameter("false", false));
		EP_Parameters.put("align_right", new EP_Parameter("false", false));
		EP_Parameters.put("AutoShrink", new EP_Parameter("true", false));
		EP_Parameters.put("CursorVisible", new EP_Parameter("true", false));
		EP_Parameters.put("CursorDoubleClicked", new EP_Parameter("false", false));
		EP_Parameters.put("RCM_editAndTest", new EP_Parameter("false", false));
		// EP_Parameters.put("RCM_enable_limes", new EP_Parameter("false",
		// false));
		EP_Parameters.put("RCM_enable_equation", new EP_Parameter("false", false));
		EP_Parameters.put("restricted", new EP_Parameter("false", false));
		EP_Parameters.put("inApplet", new EP_Parameter("false", false));
		EP_Parameters.put("blinking", new EP_Parameter("false", false));
		EP_Parameters.put("RCM_infinity_allowed", new EP_Parameter("false", false));
		EP_Parameters.put("QuickEditApplet", new EP_Parameter("false", false));
		EP_Parameters.put("ShowWidthHeight", new EP_Parameter("false", false));

		// unique String for every instance of ExpressionPanel
		// identString = String.valueOf(this.hashCode()) + "#"
		// + String.valueOf(rd.nextLong());
	}

	// *********************
	// setter methods
	// *********************

	public void setId(String id) {
		_id = id;
	}

	public void setDebugPanelVisible(boolean truefalse) {
		debugPanelVisible = truefalse;
	}

	// public void setZoomDegree(int number) {
	// EP_Parameter h = (EP_Parameter) EP_Parameters.get("zoomdegree");
	// h.setValue(String.valueOf(number));
	// }
	//
	public void setFontsize(int number) {
		EP_Parameter h = (EP_Parameter) EP_Parameters.get("size");
		h.setValue(String.valueOf(number));
	}

	public void setMinFontsize(int number) {
		EP_Parameter h = (EP_Parameter) EP_Parameters.get("minsize");
		h.setValue(String.valueOf(number));
	}

	public void setxSpacing(int number) {
		EP_Parameter h = (EP_Parameter) EP_Parameters.get("xspacing");
		h.setValue(String.valueOf(number));
	}

	public void setFractionLineHeight(int number) {
		EP_Parameter h = (EP_Parameter) EP_Parameters.get("fractionlineheight");
		h.setValue(String.valueOf(number));
	}

	public void setTimesDotRadius(int number) {
		EP_Parameter h = (EP_Parameter) EP_Parameters.get("timesdotradius");
		h.setValue(String.valueOf(number));
	}

	public void setXOffset(int number) {
		EP_Parameter h = (EP_Parameter) EP_Parameters.get("xoffset");
		h.setValue(String.valueOf(number));
	}

	public void setYOffset(int number) {
		EP_Parameter h = (EP_Parameter) EP_Parameters.get("yoffset");
		h.setValueNoRepaint(String.valueOf(number));
	}

	public void setYOffsetMin(int number) {
		EP_Parameter h = (EP_Parameter) EP_Parameters.get("yoffsetmin");
		h.setValue(String.valueOf(number));
	}

	public void setYPosition(int number) {
		EP_Parameter h = (EP_Parameter) EP_Parameters.get("yposition");
		h.setValue(String.valueOf(number));
	}

	public void setBoundedWidth(int number) {
		EP_Parameter h = (EP_Parameter) EP_Parameters.get("boundedwidth");
		h.setValue(String.valueOf(number));
	}

	public void setBoundedHeight(int number) {
		EP_Parameter h = (EP_Parameter) EP_Parameters.get("boundedheight");
		h.setValue(String.valueOf(number));
	}

//TODO delete obsolete code (mode...)
//	public void setMode(short number) {
//		Mode = number;
//		// CommandEventProvider.fireCommandEvent("formulawidget", _id, "PAINT");
//		Bridge.log("fireFaEvent PAINT");
//		FaEventProvider.fireFaEvent("PAINT");
//	}

//	public void setMode_withoutPaint(short number) {
//		Mode = number;
//	}

	public void setCombiPanelMode(short number) {
		CombiPanelMode = number;
	}

	public void setCursorMode(short number) {
		CursorMode = number;
	}

	public void setUnitDetectionModeMath() {
		setParameter("unitmode", UNITDETECTIONMODE_MATH);
	}

	public void setUnitDetectionModePhysics() {
		setParameter("unitmode", UNITDETECTIONMODE_PHYSICS);
	}

	public void setUnitDetectionModeAsk() {
		setParameter("unitmode", UNITDETECTIONMODE_ASK);
	}

	public void setDecimalSeparator(String s) {
		setParameter("DecimalSeparator", s);
	}

	public void setDecimalSeparatorFromLocale() {
		// String language = Localizer.getCurrentLanguage();
		// TODO Localizer
		String language = "de";
		if (language.toLowerCase().startsWith("de")) {
			setDecimalSeparator(",");
		} else {
			setDecimalSeparator(".");
		}
	}

	/**
	 * will be overwritten by EP_InitManager.setEditMode()
	 * 
	 * @param edit
	 *            true if FormulaWidget is in edit mode
	 */
	public void _setEditMode(boolean edit) {
		setBooleanParameter("EditMode", edit);
		if (edit) {
//			setInputActive();
			Bridge.setActive(getId());
		}
	}

	public void setBounded(boolean truefalse) {
		setBooleanParameter("bounded", truefalse);
	}

	public void setAlignRight(boolean truefalse) {
		setBooleanParameter("align_right", truefalse);
	}

	public void setAutoShrink(boolean truefalse) {
		setBooleanParameter("AutoShrink", truefalse);
	}

	public void setCursorVisible(boolean truefalse) {
		// setBooleanParameter("CursorVisible", truefalse); // triggers paint()!

		// next 6 lines do the same but do not trigger paint()
		EP_Parameter h = (EP_Parameter) EP_Parameters.get("CursorVisible");
		if (truefalse) {
			h.setValueNoRepaint("true");
		} else {
			h.setValueNoRepaint("false");
		}
	}

	public void setCursorDoubleClicked(boolean truefalse) {
		setBooleanParameter("CursorDoubleClicked", truefalse);
	}

	public void setRCM_editAndTest(boolean truefalse) {
		setBooleanParameter("RCM_editAndTest", truefalse);
	}

	// Deprecated. Read only
	// public void setRCM_enableLimes(boolean truefalse) {
	// setBooleanParameter("RCM_enable_limes", truefalse);
	// }
	//
	public void setRCM_enableEquation(boolean truefalse) {
		setBooleanParameter("RCM_enable_equation", truefalse);
	}

	public void setRCM_InfinityAllowed(boolean truefalse) {
		setBooleanParameter("RCM_infinity_allowed", truefalse);
	}

	public void setRestricted(boolean truefalse) {
		setBooleanParameter("restricted", truefalse);
	}

	public void setInApplet(boolean truefalse) {
		setBooleanParameter("inApplet", truefalse);
	}

	public void setQuickEditApplet(boolean truefalse) {
		setBooleanParameter("QuickEditApplet", truefalse);
	}

	public void setShowWidthHeight(boolean truefalse) {
		setBooleanParameter("ShowWidthHeight", truefalse);
		// TODO setDirty
		// setDirty(true);
	}

	public void setKeyboardButtonVisible(boolean truefalse) {
		setBooleanParameter("KeyboardButtonVisible", truefalse);
		// TODO setDirty
		// setDirty(true);
	}

	public void setMenuButtonEnabled(boolean truefalse) {
		setBooleanParameter("MenuButtonEnabled", truefalse);
		// TODO setDirty
		// setDirty(true);
	}

	// TODO setBlinking
	// public void setBlinking(boolean truefalse) {
	// setBooleanParameter("blinking", truefalse);
	// if (truefalse) {
	// start_or_continue();
	// } else {
	// stop();
	// }
	// }

	// private void setColorByNumber(short colorname, Color c) {
	// Colors[colorname] = c;
	// setDirty(true);
	// }

	// public void setColorByName(String ShortColorname, Color c) {
	// ShortColorname = ShortColorname.toLowerCase();
	// if (ShortColorname.equals("font")) {
	// setFontColor(c);
	// } else if (ShortColorname.equals("output")) {
	// setOutputColor(c);
	// } else if (ShortColorname.equals("inputactive")) {
	// setInputActiveColor(c);
	// } else if (ShortColorname.equals("inputinactive")) {
	// setInputInactiveColor(c);
	// } else if (ShortColorname.equals("cursor")) {
	// setCursorColor(c);
	// } else if (ShortColorname.equals("blink")) {
	// setBlinkColor(c);
	// } else if (ShortColorname.equals("almostunit")) {
	// setAlmostUnitColor(c);
	// } else if (ShortColorname.equals("unit")) {
	// setUnitColor(c);
	// } else if (ShortColorname.equals("ok")) {
	// setOKColor(c);
	// } else if (ShortColorname.equals("wrong")) {
	// setWrongColor(c);
	// } else if (ShortColorname.equals("back")) {
	// setBackColor(c);
	// } else if (ShortColorname.equals("boundary")) {
	// setBoundaryColor(c);
	// }
	// return;
	// }

	// deprecated
	// private void setSwitchByNumber(short varname, boolean truefalse) {
	// Switches[varname] = truefalse;
	// setDirty(true);
	// }
	//
	public void setPrecision(double prec) {
		setParameter("precision", String.valueOf(prec));
	}

	public void setPowerFactor(double d) {
		setParameter("PowerFactor", String.valueOf(d));
	}

	public void setPowerRaise(double d) {
		setParameter("PowerRaise", String.valueOf(d));
	}

	public void setYiFactor(double d) {
		setParameter("yi_factor", String.valueOf(d));
	}

	public void setDefinitionSet(DefinitionSet ds) {
		definitionSet = ds;
	}

	// *********************
	// getter methods
	// *********************

	public String getId() {
		return _id;
	}

	public static String getInfo() {
		String info = "www.formelapplet.de" + CRLF;
		info += "(c) Rudolf Gro&szlig;mann" + CRLF;
		info += VersionProvider.getVersion();
		// info += CRLF+"getBoundedWidth()="+getBoundedWidth();
		return info;
	}

	public float getPhase() {
		return phase;
	}

	// public String getIdentString() {
	// DebugPanel.debugPrintln("identString=" + identString, 3);
	// return identString;
	// }

	boolean getDebugPanelVisible() {
		return debugPanelVisible;
	}

	// int getZoomDegree() {
	// String h = getParameterString("zoomdegree");
	// return Integer.parseInt(h);
	// }
	//
	int getFontsize() {
		String h = getParameterString("size");
		return Integer.parseInt(h);
	}

	int getMinFontsize() {
		String h = getParameterString("minsize");
		return Integer.parseInt(h);
	}

	int getxSpacing() {
		String h = getParameterString("xspacing");
		return Integer.parseInt(h);
	}

	int getFractionLineHeight() {
		String h = getParameterString("fractionlineheight");
		return Integer.parseInt(h);
	}

	int getTimesDotRadius() {
		String h = getParameterString("timesdotradius");
		return Integer.parseInt(h);
	}

	int getXOffset() {
		String h = getParameterString("xoffset");
		return Integer.parseInt(h);
	}

	int getYOffset() {
		String h = getParameterString("yoffset");
		return Integer.parseInt(h);
	}

	int getYOffsetMin() {
		String h = getParameterString("yoffsetmin");
		return Integer.parseInt(h);
	}

	int getYPosition() {
		String h = getParameterString("yposition");
		return Integer.parseInt(h);
	}

	public int getBoundedWidth() {
		String h = getParameterString("boundedwidth");
		return Integer.parseInt(h);
	}

	public int getBoundedHeight() {
		String h = getParameterString("boundedheight");
		return Integer.parseInt(h);
	}

//	public short getMode() {
//		return Mode;
//	}
//
	public short getCombiPanelMode() {
		return CombiPanelMode;
	}

	public short getCursorMode() {
		return CursorMode;
	}

	public String getUnitDetectionMode() {
		return getParameterString("unitmode");
	}

	public String getLanguageForQuickEditApplet() {
		return getParameterString("lang");
	}

	public String getDecimalSeparator() {
		return getParameterString("DecimalSeparator");
	}

	public boolean isEditMode() {
		return getBooleanParameter("EditMode");
	}

	public boolean isBounded() {
		return getBooleanParameter("bounded");
	}

	public boolean isAlignRight() {
		return getBooleanParameter("align_right");
	}

	// public boolean isDirty() {
	// return dirty;
	// }
	//
	public boolean isAutoShrink() {
		return getBooleanParameter("AutoShrink");
	}

	public boolean isCursorVisible() {
		return getBooleanParameter("CursorVisible");
	}

	public boolean isCursorDoubleClicked() {
		return getBooleanParameter("CursorDoubleClicked");
	}

	public boolean isRCM_editAndTest() {
		return getBooleanParameter("RCM_editAndTest");
	}

	public boolean isRCM_enableEquation() {
		return getBooleanParameter("RCM_enable_equation");
	}

	public boolean isRCM_InfinityAllowed() {
		return getBooleanParameter("RCM_infinity_allowed");
	}

	public boolean isRestricted() {
		return getBooleanParameter("restricted");
	}

	public boolean isInApplet() {
		return getBooleanParameter("inApplet");
	}

	public boolean isQuickEditApplet() {
		return getBooleanParameter("QuickEditApplet");
	}

	public boolean isShowWidthHeight() {
		return getBooleanParameter("ShowWidthHeight");
	}

	public boolean isKeyboardButtonVisible() {
		return getBooleanParameter("KeyboardButtonVisible");
	}

	public boolean isMenuButtonEnabled() {
		return getBooleanParameter("MenuButtonEnabled");
	}

	public boolean isBlinking() {
		return getBooleanParameter("blinking");
	}

	public double getPrecision() {
		double ret = 0;
		try {
			String h = getParameterString("precision");
			if (h.equals("<not found>")) {
				ret = 0;
			} else {
				ret = Double.parseDouble(h);
			}
		} catch (Exception ex) {
			DebugPanel.debugPrintln(ex.getLocalizedMessage(), 3);
		}
		return ret;
	}

	public double getPowerFactor() {
		return getDoubleParameter("PowerFactor");
	}

	public double getPowerRaise() {
		return getDoubleParameter("PowerRaise");
	}

	public double getYiFactor() {
		return getDoubleParameter("yi_factor");
	}

	public DefinitionSet getDefinitionSet() {
		return definitionSet;
	}

	boolean getBooleanParameter(String key) {
		boolean ret = false;
		try {
			String h = ((EP_Parameter) EP_Parameters.get(key)).getValue();
			ret = h.toLowerCase().equals("true");
		} catch (Exception ex) {
			DebugPanel.debugPrintln("EP_Parameter " + key + " not found.", 1);
		}
		return ret;
	}

	int getIntegerParameter(String key) {
		int ret = -99;
		try {
			String h = ((EP_Parameter) EP_Parameters.get(key)).getValue();
			ret = Integer.parseInt(h);
		} catch (Exception ex) {
			DebugPanel.debugPrintln("IntegerParameter " + key + " not found.", 1);
		}
		return ret;
	}

	double getDoubleParameter(String key) {
		double ret = -99;
		try {
			String h = ((EP_Parameter) EP_Parameters.get(key)).getValue();
			// DebugPanel.debugPrintln("vorher:" + h, 3);
			ret = Double.parseDouble(h);
			// DebugPanel.debugPrintln("nachher:" + String.valueOf(ret), 3);
		} catch (Exception ex) {
			DebugPanel.debugPrintln("EP_DoubleParameter " + key + " not found.", 1);
		}
		return ret;
	}

	public String getParameterString(String key) {
		EP_Parameter h = new EP_Parameter("<empty>", false);
		String ret = "<empty>";
		try {
			h = (EP_Parameter) EP_Parameters.get(key);
			ret = h.getValue();
		} catch (Exception ex) {
			DebugPanel.debugPrintln("EP_Parameter " + key + " not found.", 1);
		}
		return ret;
	}

	public String getDefaultParameterString(String key) {
		EP_Parameter h = new EP_Parameter("<empty>", false);
		String ret = "<empty>";
		try {
			h = (EP_Parameter) EP_Parameters.get(key);
			ret = h.getDefaultValue();
		} catch (Exception ex) {
			DebugPanel.debugPrintln("EP_Parameter " + key + " not found.", 1);
		}
		return ret;
	}

	void setParameter(String key, String value) {
		try {
			EP_Parameter h = (EP_Parameter) EP_Parameters.get(key);
			h.setValue(value); // this triggers paint();
			// CommandEventProvider.fireCommandEvent("commandmanager", getId(),
			// "SET_DIRTY_TRUE");
		} catch (Exception ex) {
			DebugPanel.debugPrintln("EP_Parameter " + key + " not found.", 1);
		}
	}

	void setBooleanParameter(String key, boolean value) {
		if (value) {
			setParameter(key, "true");
		} else {
			setParameter(key, "false");
		}
	}

	public boolean isDefault(String key) {
		boolean ret = false;
		try {
			EP_Parameter h = (EP_Parameter) EP_Parameters.get(key);
			ret = h.isDefault();
		} catch (Exception ex) {
			DebugPanel.debugPrintln(ex.getLocalizedMessage(), 0);
		}
		return ret;
	}

	class EP_Parameter {
		String _value = "<empty>";
		String _defValue = "<empty>";
		boolean _save = true;

		EP_Parameter(String defValue, boolean save) {
			_value = defValue;
			_defValue = defValue;
			_save = save;
		}

		public void setValue(String value) {
			_value = value;
			// CommandEventProvider
			// .fireCommandEvent("formulawidget", _id, "PAINT");
			FaEventProvider.fireFaEvent("PAINT");
		}

		public void setValueNoRepaint(String value) {
			_value = value;
		}

		public void setDefaultValue(String defValue) {
			_defValue = defValue;
		}

		public void setSave(boolean save) {
			_save = save;
		}

		public String getValue() {
			return _value;
		}

		public String getDefaultValue() {
			return _defValue;
		}

		public boolean isSave() {
			return _save;
		}

		public boolean isDefault() {
			return _value.equals(_defValue);
		}
	}

	// TODO callJScript
	// public boolean callJScript(String js_code) {
	// boolean success = false;
	// if (isInApplet()) {
	// try {
	// URL url = new URL("javascript:" + js_code);
	// hostingApplet.getAppletContext().showDocument(url);
	// } catch (Exception ex) {
	// DebugPanel.debugPrintln(ex.getLocalizedMessage(), 0);
	// }
	// }
	// return success;
	// }
}
