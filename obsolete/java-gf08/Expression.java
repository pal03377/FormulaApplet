package gut.client;

import gut.client.DebugPanel;

/**
 * @author Rudolf Grossmann

 * @version gf08 24.11 (30. August 2016)
 * provides setting/deleting boundary, klone, TEX
 * was ExpressionBoundaryManager.java
 */

public class Expression extends ExpressionBuilder {

//	private static final long serialVersionUID = 1661480907008392270L;
	private static final long serialVersionUID = 2486057801418729392L;
	Node Boundary = new Node();

	public boolean isEmpty() {
		boolean empty = false;
		if (getRoot().getMiddleChild().getType() == Node.TYPE_SPACE) {
			empty = true;
		} else {
			if (hasBoundary()) {
				if (getExpressionUnderBoundary().isEmpty()) {
					empty = true;
				}
			}
		}
		return empty;
	}

	public Node getBoundary() {
		return Boundary;
	}

	public boolean hasBoundary() {
		Boundary = new Node("no_boundary", Node.KIND_LEAF,
				Node.TYPE_NO_BOUNDARY);
		boolean found = false;
		IndexToRoot();
		do {
			Node nd = getIndexNode();
			if (nd.getType() == Node.TYPE_BOUNDARY) {
				Boundary = nd;
				found = true;
			}
			IndexToNext(true);
		} while (isIndexRoot() == false && (!found));
		setBoundaryExists(found);
		return found;
	}

	public void insertBoundaryOverCursor() {
		deleteBoundary();
		if (!hasBoundary()) {
			Boundary = new Node("boundary", Node.KIND_UNARY_NODE,
					Node.TYPE_BOUNDARY);
			InsertUNodeOverCursor(Boundary);
		}
	}

	public void deleteBoundary() {
		if (hasBoundary()) {
			/**
			 * @todo maybe necessary in some cases to force brackets!
			 * 
			 */
			// if (Boundary.getMiddleChild().getType() == Node.TYPE_PLUSMINUS) {
			// Boundary.setType(Node.TYPE_BRACKET);
			// Boundary.setContent("(");
			// Boundary = new Node("no_boundary", Node.KIND_LEAF,
			// Node.TYPE_NO_BOUNDARY);
			// }
			// else {
			DeleteUNode(Boundary);
			// }
		}
	}

	public void deleteTermUnderBoundary() {
		if (hasBoundary()) {
			Node space = new Node();
			Boundary.setMiddleChild(space);
			space.setFather(Boundary);
			setCursor(space);
		}
	}

	public Expression getExpressionUnderBoundary() {
		Expression ex = new Expression();
		if (this.hasBoundary()) {
			String representation = getRepresentationBelowNode(getBoundary());
			Node newroot = Node.getNodeFromString(representation);
			ex.setRoot(newroot);
			newroot.setContent("root");
			newroot.setFather(null);
			newroot.setKind(Node.KIND_UNARY_NODE);
			newroot.setPosition(Node.POSITION_ROOT);
			newroot.setType(Node.TYPE_TERM);
			ex.setCursor(newroot.getMiddleChild());
			boolean moved = MoveCursorRight();
			if (moved) {
				MoveCursorLeft();
			}
		}
		return ex;
	}

	public Expression getExpressionOverBoundary() {
		Expression ex = this.klone();
		if (ex.hasBoundary()) {
			Node space = new Node();
			Node boundary = ex.getBoundary();
			boundary.setMiddleChild(space);
			space.setFather(boundary);
			ex.setCursor(space);
		}
//		return ex.klone(); //this lets the cursor be forgotten - BUG in gf06! 
		return ex;
	}

	public Expression klone() {
		Expression cln = new Expression();
		try {
			String rep = getRepresentation();
			cln.setRoot(Node.getNodeFromString(rep));
			cln.getRoot().setPosition(Node.POSITION_ROOT);
		} catch (Exception ex) {
			DebugPanel.debugPrintln("klone-Fehler: " + ex.toString(), 0);
		}
		return cln;
	}

	public void insertSolution(Expression solution) {
		// insert solution into expression.
		if (hasBoundary()) {
			// Node Boundary = getBoundary();
			Node tempRoot = Node
					.getNodeFromString(solution.getRepresentation());
			Boundary.setMiddleChild(tempRoot.getMiddleChild());
			tempRoot.getMiddleChild().setFather(Boundary);
		}
	}

	public static Expression One() {
		Expression ret = new Expression();
		Node nd = ret.getRoot().getMiddleChild();
		nd.setContent("1");
		nd.setType(Node.TYPE_NUMBER);
		return ret;
	}

	public String getTexRepresentation(String DecimalSeparator) {
		int direction = 0;
		short t = 0;
		String c = "";
		Node n = new Node();
		StringBuffer texBuffer = new StringBuffer(100);

		DebugPanel.debugCls();
		IndexToRoot();
		int loop = 2;
		do {
			direction = getIndexDirection();
			n = getIndexNode();
			c = n.getContent();
			t = n.getType();
			if (direction == Node.FROM_ABOVE) {
				// Bl�tter
				if (t == Node.TYPE_SPACE) {
					texBuffer.append("[SPACE]");
				}
				if (t == Node.TYPE_NUMBER || t == Node.TYPE_VARIABLE_AZ) {
					int ch = (int) c.charAt(0);
					if (ch >= 945) {
						String greek = "";
						if (ch == 945) {
							greek = "alpha";
						}
						if (ch == 946) {
							greek = "beta";
						}
						if (ch == 947) {
							greek = "gamma";
						}
						if (ch == 948) {
							greek = "delta";
						}
						if (ch == 949) {
							greek = "epsilon";
						}
						if (ch == 950) {
							greek = "zeta";
						}
						if (ch == 951) {
							greek = "eta";
						}
						if (ch == 977) {
							greek = "vartheta"; // anderer Code!
						}
						if (ch == 953) {
							greek = "iota";
						}
						if (ch == 954) {
							greek = "kappa";
						}
						if (ch == 955) {
							greek = "lambda";
						}
						if (ch == 956) {
							greek = "mu";
						}
						if (ch == 957) {
							greek = "nu";
						}
						if (ch == 958) {
							greek = "xi"; // Omikron siehe unten
						}
						if (ch == 960) {
							greek = "pi";
						}
						if (ch == 961) {
							greek = "rho"; // 962 �berspringen
						}
						if (ch == 963) {
							greek = "sigma";
						}
						if (ch == 964) {
							greek = "tau";
						}
						if (ch == 965) {
							greek = "upsilon";
						}
						if (ch == 966) {
							greek = "varphi";
						}
						if (ch == 967) {
							greek = "chi";
						}
						if (ch == 968) {
							greek = "psi";
						}
						if (ch == 969) {
							greek = "omega";
						}
						if (ch == 959) {
							texBuffer.append("o");
						} else {
							texBuffer.append("{\\");
							texBuffer.append(greek);
							texBuffer.append("}");
						}
						// Sonderbehandlung Omikron
					} else {
						texBuffer.append(c);
					}
				}
				if (t == Node.TYPE_SEXAGESIMAL
						|| t == Node.TYPE_ALMOSTSEXAGESIMAL) {
					String d = c.toString();
					String grad = "^{o}\\\\:";
					String space = "\\\\:\\\\:";
					d = d.replaceAll("� ", grad);
					d = d.replaceAll("�", "^{o}");
					d = d.replaceAll("g ", grad);
					d = d.replaceAll("g", "^{o}");
					d = d.replaceAll(" ", space);
					texBuffer.append("{");
					texBuffer.append(d);
					texBuffer.append("}");
				}
				// U-Knoten
				if (t == Node.TYPE_TERM_EQUALS) {
					texBuffer.append("{");
				}
				if (t == Node.TYPE_BRACKET) {
					if (c.equals("{")) {
						c = "\\{";
					}
					texBuffer.append(c);
				}
				if (t == Node.TYPE_SQUAREROOT) {
					texBuffer.append("\\sqrt{");
				}
				if (t == Node.TYPE_FUNCTION) {
					texBuffer.append("\\");
					texBuffer.append(c);
					texBuffer.append("{");
				}
				// XXX Es fehlen noch weitere Funktionen

				// B-Knoten
				if (t == Node.TYPE_TIMES) {
					texBuffer.append("{");
				}
				if (t == Node.TYPE_DIVIDED) {
					texBuffer.append("{");
				}
				if (t == Node.TYPE_FRACTION) {
					texBuffer.append("\\frac{");
				}
				if (t == Node.TYPE_MIXEDNUMBER) {
					texBuffer.append("{");
				}
				if (t == Node.TYPE_PLUSMINUS) {
					texBuffer.append("{");
				}
				if (t == Node.TYPE_LOG) {
					texBuffer.append("\\log_{");
				}
				if (t == Node.TYPE_HIGHER_ROOT) {
					texBuffer.append("\\sqrt[{");
				}
				if (t == Node.TYPE_POWER) {
					texBuffer.append("{");
				}
				if (t == Node.TYPE_REALNUMBER) {
					texBuffer.append("{");
				}
				if (t == Node.TYPE_PERIOD) {
					texBuffer.append("{");
				}

			}
			if (direction == Node.FROM_BELOW) {
				// nur U-Knoten
				if (t == Node.TYPE_TERM_EQUALS) {
					texBuffer.append("} = {}");
				}
				if (t == Node.TYPE_BRACKET) {
					String haystack = "([<{|";
					int i = haystack.indexOf(n.getContent());
					String RightBracket = ")";
					switch (i) {
					case 0: {
						RightBracket = ")";
						break;
					}
					case 1: {
						RightBracket = "]";
						break;
					}
					case 2: {
						RightBracket = ">";
						break;
					}
					case 3: {
						RightBracket = "\\}";
						break;
					}
					case 4: {
						RightBracket = "|";
						break;
					}
					default: {
						DebugPanel.debugPrintln(
								"Falscher Inhalt eines Knoten vom Typ BRACKET",
								1);
					}
					}
					texBuffer.append(RightBracket);
				}
				if (t == Node.TYPE_SQUAREROOT) {
					texBuffer.append("}");
				}
				if (t == Node.TYPE_FUNCTION) {
					texBuffer.append("}");
				}
				// XXX Es fehlen noch weitere Funktionen

			}
			if (direction == Node.FROM_LEFT) {
				if (t == Node.TYPE_TIMES) {
					if (c.equals("*")) {
						// texBuffer.append("} \\cdot {");
						texBuffer.append("}*{");
					} else {
						texBuffer.append("}{");
					}
				}
				if (t == Node.TYPE_DIVIDED) {
					texBuffer.append("}:{");
				}
				if (t == Node.TYPE_FRACTION) {
					texBuffer.append("}{");
				}
				if (t == Node.TYPE_MIXEDNUMBER) {
					texBuffer.append("}{");
				}
				if (t == Node.TYPE_PLUSMINUS) {
					texBuffer.append("}");
					texBuffer.append(c);
					texBuffer.append("{");
				}
				if (t == Node.TYPE_LOG) {
					texBuffer.append("}{");
				}
				if (t == Node.TYPE_HIGHER_ROOT) {
					texBuffer.append("}]{");
				}
				if (t == Node.TYPE_POWER) {
					texBuffer.append("}^{");
				}
				if (t == Node.TYPE_REALNUMBER) {
					texBuffer.append(DecimalSeparator);
				}
				if (t == Node.TYPE_PERIOD) {
					texBuffer.append("}\\overline{");
				}

			}
			if (direction == Node.FROM_RIGHT) {
				if (t == Node.TYPE_TIMES) {
					texBuffer.append("}");
				}
				if (t == Node.TYPE_DIVIDED || t == Node.TYPE_FRACTION) {
					texBuffer.append("}");
				}
				if (t == Node.TYPE_MIXEDNUMBER) {
					texBuffer.append("}");
				}
				if (t == Node.TYPE_PLUSMINUS) {
					texBuffer.append("}");
				}
				if (t == Node.TYPE_LOG) {
					texBuffer.append("}");
				}
				if (t == Node.TYPE_HIGHER_ROOT) {
					texBuffer.append("}");
				}
				if (t == Node.TYPE_POWER) {
					texBuffer.append("}");
				}
				if (t == Node.TYPE_REALNUMBER) {
					texBuffer.append("}");
				}
				if (t == Node.TYPE_PERIOD) {
					texBuffer.append("}");
				}
			}

			DebugPanel.debugPrintln(n.getContent() + " (" + t + ")  "
					+ direction, 3);
			if (loop == 1) {
				loop = 0;
			}
			if (loop == 2) {
				IndexToNext(true); // vorw�rts
				if (isIndexRoot()) {
					loop = 1;
				}
			}
		} while (loop > 0);
		return texBuffer.toString();
	}
}
