package gut.client;

import gut.client.DebugPanel;
import gut.client.Expression;
import java.util.Random;
import java.util.Vector;

/**
 * @author Rudolf Grossmann

 * @version gf08 24.11 (30. August 2016)
 * 
 */

public class EquationChecker {
	private static Random rd = new Random();
	private static String error = "";
	private static DefinitionSet defSet = new DefinitionSet();

	public static String getError() {
		return error;
	}

	private static Expression DifferenceOrQuotient(Expression left_op,
			Expression right_op, boolean difference) {
		try {
			Expression result = new Expression();
			result.IndexToRoot();
			// Mit Kopien arbeiten, damit �nderungen nicht die Originale
			// beeinflussen.
			Expression left = left_op.klone();
			left.IndexToRoot();
			Expression right = right_op.klone();
			right.IndexToRoot();

			Node operator = result.getIndexNode().getMiddleChild();
			operator.setKind(Node.KIND_BINARY_NODE);
			if (difference) {
				operator.setType(Node.TYPE_PLUSMINUS);
				operator.setContent("-");
			} else {
				operator.setType(Node.TYPE_DIVIDED);
				operator.setContent(":");
			}
			operator.setLeftChild(left.getIndexNode().getMiddleChild());
			operator.setRightChild(right.getIndexNode().getMiddleChild());
			operator.getLeftChild().setFather(operator);
			operator.getLeftChild().setPosition(Node.POSITION_LEFT);
			operator.getRightChild().setFather(operator);
			operator.getRightChild().setPosition(Node.POSITION_RIGHT);
			return result;
		} catch (Exception ex) {
			DebugPanel
					.debugPrintln("Fehler in Methode DifferenceOrQuotient", 0);
			return null;
		}
	}

	private static double getRandom(String varname) {
		double probability = 0.1; // Circa-Wahrscheinlichkeit f�r
									// "Rand ausgelost"
		Vector<DefinitionInterval> intervals = defSet
				.getDefinitionIntervalsForVar(varname);
		double random = rd.nextGaussian(); // default
		// DebugPanel.debugCls();
		DebugPanel.debugPrintln("varname=" + varname, 3);
		DebugPanel.debugPrintln("random=" + random, 3);
		int numOfIntervals = intervals.size();
		DebugPanel.debugPrintln("numOfIntervals=" + numOfIntervals, 3);
		if (numOfIntervals > 0) {
			// Intervall auslosen
			int indexOfInterval = rd.nextInt(numOfIntervals);
			DefinitionInterval DI = (DefinitionInterval) intervals
					.elementAt(indexOfInterval);
			DebugPanel.debugPrint((indexOfInterval + 1) + " von "
					+ numOfIntervals + ":  ", 3);
			DebugPanel.debugPrint(DI.getVarName() + " aus ", 3);
			if (DI.isContainingMin()) {
				DebugPanel.debugPrint("[ ", 3);
			} else {
				DebugPanel.debugPrint("] ", 3);
			}
			DebugPanel.debugPrint(DI.getMin() + " ; ", 3);
			DebugPanel.debugPrint(DI.getMax() + " ", 3);
			if (DI.isContainingMax()) {
				DebugPanel.debugPrintln("]", 3);
			} else {
				DebugPanel.debugPrintln("[", 3);
			}
			if (Double.isInfinite(DI.getMin())
					|| Double.isInfinite(DI.getMax())) {
				// unendlich
				// DebugPanel.debugPrintln("max oder min ist unendlich",3);
				if (Double.isInfinite(DI.getMin())) {
					// Typ x < 1 oder x <=1
					// DebugPanel.debugPrintln("min=-unendlich",3);
					if (DI.isContainingMax() && rd.nextDouble() < probability) {
						random = DI.getMax();
					} else {
						// random = DI.getMax() - 1000 *
						// Math.abs(nextGaussianWithoutZero());
						random = DI.getMax() - Math.exp(rd.nextGaussian());
					}
				}
				if (Double.isInfinite(DI.getMax())) {
					// Typ 1 < x oder 1 <= x
					// DebugPanel.debugPrintln("max=unendlich",3);
					if (DI.isContainingMin() && rd.nextDouble() < probability) {
						random = DI.getMin();
					} else {
						random = DI.getMin() + Math.exp(rd.nextGaussian());
					}
				}
			} else {
				// endlich
				if (DI.isContainingMin() && rd.nextDouble() < probability) {
					random = DI.getMin();
				} else {
					if (DI.isContainingMax()
							&& ((1 - probability) < rd.nextDouble())) {
						random = DI.getMax();
					} else {
						// Rand nicht ausgelost
						double h = rd.nextDouble();
						if (h == 0 && !DI.isContainingMin()) { // seltener Fall
							h = 1 - h;
						}
						random = DI.getMin() + h * (DI.getMax() - DI.getMin());
					}
				}
			}
		}
		DebugPanel.debugPrintln(varname + " = " + random, 3);
		return random;
	}

	private static void replaceVarsWithRandomValues(Expression exp) {
		try {
			boolean has_variable;
			do {
				has_variable = false;
				double random = 2.7;
				String theVariable = "";
				exp.IndexToRoot();
				do {
					Node nd = exp.getIndexNode();
					if (nd.getType() == Node.TYPE_VARIABLE_AZ
							|| nd.getType() == Node.TYPE_STRING) {
						boolean done = false;
//						if (nd.getContent().equals(String.valueOf((char) 960))) {
						if (nd.getContent().equals("\u03c0")) {
							DebugPanel.debugPrintln("Pi erkannt", 4);
							nd.setValue(Math.PI);
							nd.setType(Node.TYPE_SPACE);
							done = true;
						}
						if (nd.getContent().equals("e")) {
							DebugPanel
									.debugPrintln("Eulersche Zahl erkannt", 4);
							nd.setValue(Math.exp(1));
							nd.setType(Node.TYPE_SPACE);
							done = true;
						}
						if (nd.getContent().equals("�")) {
							DebugPanel.debugPrintln("Grad erkannt", 4);
							nd.setValue(Math.PI / 180);
							nd.setType(Node.TYPE_SPACE);
							done = true;
						}
						if (done == false) {
							if (has_variable == false) {
								theVariable = nd.getContent();
								random = getRandom(theVariable);
								nd.setValue(random);
								nd.setType(Node.TYPE_SPACE);
								has_variable = true;
							} else {
								if (nd.getContent().equals(theVariable)) {
									nd.setValue(random);
									nd.setType(Node.TYPE_SPACE);
								}
							}
						}
					}
					if (nd.getType() == Node.TYPE_NO_RESULT) {
						nd.setValue(47.110178);
					}
					if (nd.getType() == Node.TYPE_GENERAL) {
						nd.setValue(75.972575);
					}
					/*
					 * DebugPanel.debugPrint(String.valueOf(nd.number) + " -> ",
					 * 3); DebugPanel.debugPrint(nd.getContent(), 3);
					 * DebugPanel.debugPrintln("=" +
					 * String.valueOf(nd.getValue()), 3);
					 */
					exp.IndexToNext(true);
				} while (exp.isIndexRoot() == false);
			} while (has_variable == true);
			// nun sind alle Variablen besetzt.
		} catch (Exception ex) {
			DebugPanel.debugPrintln(
					"Fehler in Methode replaceVarsWithRandomValues", 0);
		}
	}

	/**
	 * @param exp
	 *            Expression - der Term, dessen Wert ermittelt werden soll
	 * @return double - der Wert der Terms. NaN, falls ein Fehler aufgetreten
	 *         ist.
	 */
	private static double ValueOf(Expression exp) {
		try {
			double result = Double.NaN;
			error = "";
			try {

				exp.IndexToRoot();
				do {
					Node nd = exp.getIndexNode();
					// Bl�tter
					if (nd.getKind() == Node.KIND_LEAF) {
						if (nd.getType() == Node.TYPE_NUMBER) {
							if (nd.getContent().equals("empty_pp")) {
								nd.setValue(0);
							} else {
								if (nd.getFather().getType() == Node.TYPE_PERIOD
										&& nd.getPosition() == Node.POSITION_RIGHT) {
									String nines = "99999999999999999999"
											.substring(0, nd.getContent()
													.length());
									nd.setValue(Double.valueOf(nd.getContent())
											.doubleValue()
											/ Double.valueOf(nines)
													.doubleValue());
								} else {
									// nd.getNodeDimension().factor=
									// Double.parseDouble(Node.getContent());
									// //kein Java 1.1.x
									nd.setValue(Double.valueOf(nd.getContent())
											.doubleValue());
								}
							}
						}
						if (nd.getType() == Node.TYPE_SEXAGESIMAL) {
							// DebugPanel.debugPrintln("Sexagesimalzahl auswerten...",3);
							SexagesimalNumber sgn = new SexagesimalNumber(
									nd.getContent());
							// DebugPanel.debugPrintln(sgn.getDMS()+" = "+sgn.getValue(),3);
							nd.setValue(sgn.getValue());
						}

						if (nd.getType() == Node.TYPE_ZERO) {
							nd.setValue(0);
						}

						if (nd.getType() == Node.TYPE_INFINITY) {
							nd.setValue(8.95667048124E267d); // gro�er,
																// zuf�lliger
																// Wert.
						}

						if (nd.getType() == Node.TYPE_UNIT) {
							PhysicalUnit u = new PhysicalUnit(nd.getContent());
							nd.setValue(u.getUnitValue());
						}

						DebugPanel.debugPrint(String.valueOf(nd.number), 4);
						DebugPanel.debugPrint(" Blatt   ", 4);
						DebugPanel.debugPrint(nd.getContent(), 4);
						DebugPanel.debugPrintln(
								" = " + String.valueOf(nd.getValue()), 4);
					}

					// Un�rer Knoten
					if ((nd.getKind() == Node.KIND_UNARY_NODE)
							&& (exp.getIndexDirection() == Node.FROM_BELOW)) {
						nd.setValue(Double.NaN);
						if (nd.getType() == Node.TYPE_BRACKET) {
							if (nd.getContent().equals("|")) {
								nd.setValue(Math.abs(nd.getMiddleChild()
										.getValue()));
							} else {
								nd.setValue(nd.getMiddleChild().getValue());
							}
						}
						if (nd.getType() == Node.TYPE_SQUAREROOT) {
							result = Math.sqrt(nd.getMiddleChild().getValue());
							if (Double.isNaN(result)) {
								error = "Wurzel: Radikand negativ";
								DebugPanel.debugPrintln(error, 2);
							}
							nd.setValue(result);
						}
						if (nd.getType() == Node.TYPE_PERCENT) {
							if (nd.getContent().equals("%")) {
								result = nd.getMiddleChild().getValue() * 0.01;
							}
							if (nd.getContent().equals(Node.PERMIL)) {
								result = nd.getMiddleChild().getValue() * 0.001;
							}
							if (nd.getContent().equals(Node.EURO)) {
								result = nd.getMiddleChild().getValue() * 2.3875647398;
							}
							nd.setValue(result);
						}
						if (nd.getType() == Node.TYPE_FUNCTION) {
							if (nd.getContent().toLowerCase().equals("sin")) {
								nd.setValue(Math.sin(nd.getMiddleChild()
										.getValue()));
							}
							if (nd.getContent().toLowerCase().equals("cos")) {
								nd.setValue(Math.cos(nd.getMiddleChild()
										.getValue()));
							}
							if (nd.getContent().toLowerCase().equals("tan")) {
								result = Math.tan(nd.getMiddleChild()
										.getValue());
								// tritt nicht auf (numerische Ungenauigkeit):
								if (Double.isNaN(result)) {
									error = "Tangens: Definitionsl�cke";
									DebugPanel.debugPrintln(error, 2);
								}
								nd.setValue(result);
							}
							if (nd.getContent().toLowerCase().equals("ln")) {
								result = Math.log(nd.getMiddleChild()
										.getValue());
								if (Double.isNaN(result)) {
									error = "Logarithmus: negatives Argument";
									DebugPanel.debugPrintln(error, 2);
								}
								if (Double.isInfinite(result)) {
									error = "Logarithmus: Null als Argument nicht erlaubt";
									DebugPanel.debugPrintln(error, 2);
								}
								nd.setValue(result);
							}
							if (nd.getContent().toLowerCase().equals("lg")) {
								result = Math.log(nd.getMiddleChild()
										.getValue()) / Math.log(10);
								if (Double.isNaN(result)) {
									error = "Logarithmus: negatives Argument";
									DebugPanel.debugPrintln(error, 2);
								}
								if (Double.isInfinite(result)) {
									error = "Logarithmus: Null als Argument nicht erlaubt";
									DebugPanel.debugPrintln(error, 2);
								}
								nd.setValue(result);
							}
						}

						DebugPanel.debugPrint(String.valueOf(nd.number), 4);
						DebugPanel.debugPrint(" UKnoten ", 4);
						DebugPanel.debugPrint(nd.getContent(), 4);
						DebugPanel.debugPrintln(
								" = " + String.valueOf(nd.getValue()), 4);

						if (Double.isNaN(nd.getValue())) {
							DebugPanel.debugPrintln(
									"noch nicht implementierte UKnoten-Rechenoperation!"
											+ nd.getContent(), 3);
						}
					}

					// Bin�rer Knoten
					if ((nd.getKind() == Node.KIND_BINARY_NODE)
							&& (exp.getIndexDirection() == Node.FROM_RIGHT)) {
						nd.setValue(Double.NaN);
						boolean done = false;
						if (nd.getType() == Node.TYPE_POWER) {
							result = Math.pow(nd.getLeftChild().getValue(), nd
									.getRightChild().getValue());
							if (Double.isNaN(result)) {
								error = "Potenz: negative Basis";
								DebugPanel.debugPrintln(error, 2);
							}
							nd.setValue(result);
							done = true;
						}
						if (nd.getType() == Node.TYPE_TIMES
								|| nd.getType() == Node.TYPE_UNIT
								|| nd.getType() == Node.TYPE_INDEX) {
							nd.setValue(nd.getRightChild().getValue()
									* nd.getLeftChild().getValue());
							done = true;
						}
						if (nd.getType() == Node.TYPE_DIVIDED
								|| nd.getType() == Node.TYPE_FRACTION) {
							result = nd.getLeftChild().getValue()
									/ nd.getRightChild().getValue();
							if (Double.isInfinite(result)) {
								error = Localizer.getString("error_divisionbyzero");
								DebugPanel.debugPrintln(error, 2);
							}
							nd.setValue(result);
							done = true;
						}
						if (nd.getType() == Node.TYPE_PLUSMINUS
								&& nd.getContent().equals("+")) {
							nd.setValue(nd.getLeftChild().getValue()
									+ nd.getRightChild().getValue());
							done = true;
						}
						if (nd.getType() == Node.TYPE_PLUSMINUS
								&& nd.getContent().equals("-")) {
							nd.setValue(nd.getLeftChild().getValue()
									- nd.getRightChild().getValue());
							done = true;
						}
						if (nd.getType() == Node.TYPE_MIXEDNUMBER) {
							nd.setValue(nd.getLeftChild().getValue()
									+ nd.getRightChild().getValue());
							done = true;
						}
						if (nd.getType() == Node.TYPE_PERIOD) {
							int NumberOfDigits = 0;
							if (!nd.getLeftChild().getContent()
									.equals("empty_pp")) {
								NumberOfDigits = nd.getLeftChild().getContent()
										.length();
							}
							// DebugPanel.debugPrint(String.valueOf(NumberOfDigits),3);
							String divideBy = "1"
									+ "00000000000000000000".substring(0,
											NumberOfDigits);
							// DebugPanel.debugPrintln("  ->  divideBy= " +
							// divideBy, 3);
							double divisor = Double.valueOf(divideBy)
									.doubleValue();
							// DebugPanel.debugPrintln("divisor= " +
							// String.valueOf(divisor), 3);
							nd.setValue((nd.getLeftChild().getValue() + nd
									.getRightChild().getValue()) / divisor);
							done = true;
						}

						if (nd.getType() == Node.TYPE_REALNUMBER) {
							if (nd.getRightChild().getType() != Node.TYPE_PERIOD) {
								String h = nd.getLeftChild().getContent();
								if (nd.getLeftChild().getType() == Node.TYPE_ZERO) {
									h = "0";
								}
								h = h + "." + nd.getRightChild().getContent();
								nd.setValue(Double.valueOf(h).doubleValue());
							} else { // Periode samt Vorperiode
								nd.setValue(nd.getLeftChild().getValue()
										+ nd.getRightChild().getValue());
							}
							done = true;
						}

						if (nd.getType() == Node.TYPE_HIGHER_ROOT) {
							double n = nd.getLeftChild().getValue();
							double radikand = nd.getRightChild().getValue();
							result = Math.pow(radikand, 1 / n);
							if (Double.isNaN(result)) {
								error = "Wurzel: negativer Radikand";
							}
							nd.setValue(result);
							done = true;
						}

						if (nd.getType() == Node.TYPE_LOG) {
							double basis = nd.getLeftChild().getValue();
							double arg = nd.getRightChild().getValue();
							result = Math.log(arg);
							if (Double.isNaN(result)) {
								error = "Logarithmus: negatives Argument!";
								DebugPanel.debugPrintln(error, 2);
							} else {
								result = result / Math.log(basis);
								if (Double.isInfinite(result)) {
									error = "Logarithmus: Basis 1 nicht erlaubt";
									DebugPanel.debugPrintln(error, 2);
								}
								if (Double.isNaN(result)) {
									error = "Logarithmus: Basis negativ";
									DebugPanel.debugPrintln(error, 2);
								}
							}
							nd.setValue(result);
							done = true;
						}

						DebugPanel.debugPrint(String.valueOf(nd.number), 4);
						DebugPanel.debugPrint(" BKnoten ", 4);
						DebugPanel.debugPrint(nd.getContent(), 4);
						DebugPanel.debugPrintln(
								" = " + String.valueOf(nd.getValue()), 4);

						if (done == false) {
							DebugPanel
									.debugPrintln(
											"Auswertung von B_Knoten-Type noch nicht implementiert!",
											2);
							nd.setValue(rd.nextGaussian());

						}
					}
					exp.IndexToNext(true);
				} while (exp.isIndexRoot() == false);
				exp.IndexToRoot();
				result = exp.getIndexNode().getMiddleChild().getValue();
				DebugPanel.debugPrintln("Ergebnis= " + String.valueOf(result),
						4);
				return result;
			} catch (Exception ex) {
				DebugPanel.debugPrintln("Fehler in Methode ValueOf", 0);
				DebugPanel.debugPrintln(ex.toString(), 1);
				return Double.NaN;
			}
		} catch (Exception ex) {
			DebugPanel.debugPrintln("Fehler in Methode ValueOf", 0);
			return -99;
		}
	}

	private static boolean isZero(Expression difference) {
		boolean isZero = true;
		try {
			Expression exp;
			try {
				for (int i = 0; i < 5; i++) {
					exp = difference.klone();
					replaceVarsWithRandomValues(exp);
					double result = ValueOf(exp);
					DebugPanel.debugPrintln(
							"Differenz: " + String.valueOf(result), 2);
					if (Math.abs(result) > 1.0e-12 || Double.isNaN(result)) {
						isZero = false;
						i = 5;
					}
				}
			} catch (Exception ex) {
				DebugPanel.debugPrintln("Fehler in Methode isZero", 0);
				DebugPanel.debugPrintln(ex.toString(), 3);
				isZero = false;
			}
		} catch (Exception ex) {
			DebugPanel.debugPrint("Fehler in Methode isZero", 0);
			DebugPanel.debugPrintln(ex.toString(), 0);
		}
		return isZero;
	}

	private static boolean isOne(Expression quo, double precision, DefinitionSet defSet) {
		/**
		 * @todo accept precision given as number of digits
		 *
		 */

		boolean isOne = true;
		try {
			double rel_error;
			Expression qu;
			try {
				for (int i = 0; i < 5; i++) {
					qu = quo.klone();
					replaceVarsWithRandomValues(qu);
					rel_error = Math.abs(ValueOf(qu) - 1);
					DebugPanel.debugPrintln(i + ". relativer Fehler: "
							+ rel_error, 3);
					if (rel_error > precision || Double.isNaN(rel_error)) {
						isOne = false;
						i = 5;
					}
				}
			} catch (Exception ex) {
				DebugPanel.debugPrint("Fehler in Methode isOne", 0);
				DebugPanel.debugPrintln(ex.toString(), 3);
				isOne = false;
			}
		} catch (Exception ex) {
			DebugPanel.debugPrint("Fehler in Methode isOne", 0);
			DebugPanel.debugPrintln(ex.toString(), 0);
		}
		return isOne;
	}

	public static boolean isEqual(Expression left, Expression right, double precision,
			DefinitionSet ds) {
		defSet = ds;
		boolean LeftEqualsRight = false;
		try {
			if (precision == 0) {
				Expression difference = DifferenceOrQuotient(left, right, true);
				if (isZero(difference) == true) {
					DebugPanel.debugPrintln("Differenz Null", 3);
					LeftEqualsRight = true;
				} else {
					DebugPanel.debugPrintln("Differenz ungleich Null", 3);
					LeftEqualsRight = false;
				}
			} else { // precision != 0
				if (isZero(right)) { // avoid division by zero
					right = DifferenceOrQuotient(right, Expression.One(), true);
					left = DifferenceOrQuotient(left, Expression.One(), true);
				}
				Expression quotient = DifferenceOrQuotient(left, right, false);
				if (isOne(quotient, precision, defSet) == true) {
					DebugPanel.debugPrintln("Quotient Eins", 3);
					LeftEqualsRight = true;
				} else {
					DebugPanel.debugPrintln("Quotient ungleich Eins", 3);
					LeftEqualsRight = false;
				}

			} // Ende precision !=0
		} catch (Exception ex) {
			DebugPanel.debugPrint("Fehler in Methode isEqual", 0);
			DebugPanel.debugPrintln(ex.toString(), 0);
		}
		return LeftEqualsRight;
	}

	/**
	private static double nextGaussianWithoutZero() {
		double h = 0;
		do {
			h = rd.nextGaussian();
		} while (h == 0);
		return h;
	}
	**/

}
