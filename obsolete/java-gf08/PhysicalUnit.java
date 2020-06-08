package gut.client;


/**
 * @author Rudolf Grossmann

 * @version gf08 24.11 (30. August 2016)
 * 
 *          ExpressionUnitManager is inherited by ExpressionEquationChecker
 */

public class PhysicalUnit {
	private String unitString = "";
	private String unitGreek = "";
	private String unitName = "";
	private double power = 1;
	private boolean isUnit = false;
	private boolean hasFactors = false;

	private static final double VALUE_g = 7.003725611783e-2;
	private static final double VALUE_m = 5.933875512401e-1;
	private static final double VALUE_A = 8.049921777482e1;
	private static final double VALUE_s = 9.066344172904e-3;
	private static final double VALUE_C = VALUE_A * VALUE_s;
	private static final double VALUE_e = 1.60217648740e-19 * VALUE_C;
	private static final double VALUE_mol = 3.904471947388e-4;
	private static final double VALUE_min = 60 * VALUE_s;
	private static final double VALUE_h = 60 * VALUE_min;
	private static final double VALUE_d = 24 * VALUE_h;
	private static final double VALUE_N = 1000 * VALUE_g * VALUE_m
			/ (VALUE_s * VALUE_s);
	private static final double VALUE_J = VALUE_N * VALUE_m;
	private static final double VALUE_W = VALUE_J / VALUE_s;
	private static final double VALUE_V = VALUE_W / VALUE_A;
	private static final double VALUE_Ohm = VALUE_V / VALUE_A;
	private static final double VALUE_Pa = VALUE_N / (VALUE_m * VALUE_m);
	private static final double VALUE_bar = 100000 * VALUE_Pa;
	private static final double VALUE_Liter = 0.001 * VALUE_m * VALUE_m
			* VALUE_m;
	private static final double VALUE_Ar = 100 * VALUE_m * VALUE_m;
	private static final double VALUE_Celsius = 7.2209518210337e-3;
	private static final double VALUE_Kelvin = 8.573310992341e2;
	
	public PhysicalUnit(String unit) {
		unitString = unit;
		hasFactors = false;
		// griechische Vorsilbe identifizieren
		if (unitString.length() > 1) { // z.B. ha, dag, mol, mmol, Pa, hPa, mm
			if (unitString.startsWith("da")) { // Deka
				unitGreek = "da";
				unitName = unitString.substring(2);
				power = 10;
			} else { // z.B. ha, mol, mmol, Pa, hPa, mm
				String haystack = "y__z__a__f__p__n__µ__mcd__hk__M__G__T__P__E__Z__Y";
				String greek = unitString.substring(0, 1);
				int position = haystack.indexOf(greek);
				if (position >= 0) {
					unitGreek = greek;
					unitName = unitString.substring(1);
					power = Math.pow(10, position - 24);
				} else {
					DebugPanel.debugPrintln("Vergleich " + greek + " - µ", 3);
					String Mu = String.valueOf((char) (956));
					// DebugPanel.debugPrintln();
					if (greek.toLowerCase().equals("µ".toLowerCase()) || 
							greek.toLowerCase().equals(Mu.toLowerCase())) {
						DebugPanel.debugPrintln("gleich", 3);
						// µ doch noch gefunden
						unitGreek = "µ";
						unitName = unitString.substring(1);
						power = 1e-6;
					} else {
						DebugPanel.debugPrintln("ungleich", 3);
						// keine Vorsilbe gefunden, z.B. bar
						unitGreek = "";
						unitName = unitString;
						power = 1;
					}
				}
			}
		} else {
			// keine Vorsilbe bei L�nge 1, z.B. h, g, s, A
			unitGreek = "";
			unitName = unitString;
			power = 1;
		}
		// griech. Vorsilbe identifiziert. Nun Einheit dazu suchen.
		String knownUnits = "_g_m_s_t_A_V_N_J_W_C_e_T_h_d_\u2126_l_a_"; 
		// klappt nicht mit Ohm
		knownUnits += "Pa_bar_mol_min_°C_K_"; // haystack mit "_" beenden!

		int position = knownUnits.indexOf("_" + unitName + "_");
		if (position >= 0) {
			// alles richtig
			isUnit = true;
		} else {
			// vielleicht Vorsilbe falsch abgetrennt, z.B. m-ol P-a m-in
			position = knownUnits.indexOf(unitGreek + unitName + "_");
			if (position > 0) {
				// alles richtig im zweiten Anlauf
				isUnit = true;
				unitName = unitGreek + unitName;
				unitGreek = "";
				power = 1;
			} else {
				// Vorsilbe doch richtig, aber mehrere Faktoren?
				int index = 0;
				String factor = "";
				isUnit = true; // Optimismus
				if (unitName.length() > 0) {
					do {
						factor = unitName.substring(index, index + 1);
						if (knownUnits.indexOf("_" + factor + "_") < 0) {
							// unbekannter Faktor
							isUnit = false;
						}
						index++;
					} while (isUnit == true && index < unitName.length());
					if (index > 1 && isUnit == true) {
						hasFactors = true;
					}
				} else {
					isUnit = false;
				}
				if (!isUnit) {
					unitName = "<unknown>";
					unitGreek = "<unknown>";
				}
			}
		}
	}

	private static double getUnitNameValue(String unit_name) {
		double result = Double.POSITIVE_INFINITY;
		if (!unit_name.equals("<unknown>")) {
			if (unit_name.equals("g")) {
				result = VALUE_g;
			}
			if (unit_name.equals("m")) {
				result = VALUE_m;
			}
			if (unit_name.equals("A")) {
				result = VALUE_A;
			}
			if (unit_name.equals("s")) {
				result = VALUE_s;
			}
			if (unit_name.equals("C")) {
				result = VALUE_C;
			}
			if (unit_name.equals("e")) {
				result = VALUE_e;
			}
			if (unit_name.equals("t")) { // Tonne
				result = VALUE_g * 1000000;
			}
			if (unit_name.equals("mol")) {
				result = VALUE_mol;
			}
			if (unit_name.equals("min")) {
				result = VALUE_min;
			}
			if (unit_name.equals("h")) {
				result = VALUE_h;
			}
			if (unit_name.equals("d")) {
				result = VALUE_d;
			}
			if (unit_name.equals("N")) {
				result = VALUE_N;
			}
			if (unit_name.equals("J")) {
				result = VALUE_J;
			}
			if (unit_name.equals("W")) {
				result = VALUE_W;
			}
			if (unit_name.equals("V")) {
				result = VALUE_V;
			}
			if (unit_name.equals("\u2126")) {
				result = VALUE_Ohm;
			}
			if (unit_name.equals("Pa")) {
				result = VALUE_Pa;
			}
			if (unit_name.equals("bar")) {
				result = VALUE_bar;
			}
			if (unit_name.equals("l")) {
				result = VALUE_Liter;
			}
			if (unit_name.equals("a")) {
				result = VALUE_Ar;
			}
			if (unit_name.equals("°C")) {
				result = VALUE_Celsius;
			}
			if (unit_name.equals("K")) {
				result = VALUE_Kelvin;
			}
		}
		if (Double.isInfinite(result)) {
			// mehrere Faktoren
			result = 1;
			String factor = "";
			for (int index = 0; index < unit_name.length(); index++) {
				factor = unit_name.substring(index, index + 1);
				result = result * getUnitNameValue(factor);
			}
		}
		return result;

	}

	public double getUnitValue() {
		double result = power * getUnitNameValue(unitName);
		return result;
	}

	public boolean isUnit() {
		return isUnit;
	}

	public String getUnitGreek() {
		return unitGreek;
	}

	public String getUnitName() {
		return unitName;
	}

	public boolean hasFactors() {
		return hasFactors;
	}


	public static void checkIfUnitsWanted(String unitDetectionMode,
			Expression exp, Expression solution, Node nd) {
		if (unitDetectionMode
				.equals(ExpressionPainterParameterManager.UNITDETECTIONMODE_MATH)) {
			solution.Node2Variables(nd);
		} else {
			PhysicalUnit u = new PhysicalUnit(nd.getContent());
			if (u.isUnit()) {
				if (unitDetectionMode
						.equals(ExpressionPainterParameterManager.UNITDETECTIONMODE_PHYSICS)) {
					nd.setType(Node.TYPE_UNIT);
				}
				if (unitDetectionMode
						.equals(ExpressionPainterParameterManager.UNITDETECTIONMODE_ASK)) {
					String msg = nd.getContent()
							+ " ist physikalische Einheit?";
					String title = Localizer.getString("JOP_FormelApplet");
					// TODO yesno_dialog
					DialogHelper.YesNoDialog(msg, title, "", "");
					int answer = DialogHelper.ANSWER_YES;
					if (answer == DialogHelper.ANSWER_YES) {
						nd.setType(Node.TYPE_UNIT);
					} else {
						solution.Node2Variables(nd);
					}
				}
			} else {
				if (unitDetectionMode
						.equals(ExpressionPainterParameterManager.UNITDETECTIONMODE_PHYSICS)) {
					nd.setType(Node.TYPE_ALMOSTUNIT);
				}
			}
		}
	}
}
