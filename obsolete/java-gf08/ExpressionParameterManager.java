package gut.client;

import java.io.Serializable;
// import gut.client.Expression; // only used by getCommonAncestor, causes circle declaration of classes
//import java.util.ArrayList; // only used by getCommonAncestor, causes circle declaration of classes

/**
 * @author Rudolf Grossmann

 * @version gf08 24.11 (30. August 2016)
 * 
 * <p>implements getter/setter methods for root, cursor, index</p>
 * <p>handling of string representation</p>
 * <p>investigation of kind of expression and certain conditions</p>
 * <p>handling of boundary</p>
 * <p>display expression as a tree</p>
 */
public class ExpressionParameterManager implements Serializable {
	
//	DebugPanel DP = new DebugPanel();
	static final long serialVersionUID = 1708582508583344557L;
	private Node Root = new Node();
	private Node Cursor = new Node();
	private Node Index = new Node();
	private short IndexDirection;
	private int nodeNumber = 0;
	private boolean BoundaryExists = false;

	public ExpressionParameterManager() {

		try {
			Root.setContent("root");
			Root.setFather(null);
			Root.setKind(Node.KIND_UNARY_NODE);
			Root.setPosition(Node.POSITION_ROOT);
			Root.setType(Node.TYPE_TERM);

			Node Space = new Node(); // default: type space
			Root.setMiddleChild(Space);
			Space.setPosition(Node.POSITION_MIDDLE);
			Space.setFather(Root);

			Cursor = Space;
			Index = Root;
			IndexDirection = Node.FROM_ABOVE;
		} catch (Exception ex) {
			DebugPanel.debugPrintln("error in method ExpressionParameterManager", 0);
		}
	} // ?

	// ****** getter methods *******
	public boolean BoundaryExists() {
		return BoundaryExists;
	}

	public Node getCursorNode() {
		return Cursor;
	}

	// corresponds to EP_MouseManager.recSubNode in gut04
	public Node getNodeByNumber(int number) {
		Node result = null;
		IndexToRoot();
		do {
			Node n = getIndexNode();
			// System.out.println(n.getNumber());
			if (n.getNumber() == number) {
				result = n;
				// System.out.println("*****found*****");
			}
			IndexToNext(true);
		} while (isIndexRoot() == false);
		return result;
	}

	public boolean setCursorByNumber(int number) {
		boolean success = false;
		Node n = getNodeByNumber(number);
		if (n != null) {
			setCursor(n);
			success = true;
		}
		return success;
	}

	public String getDumpString() {
		String CRLF = "\r\n";
		String result = "";
		IndexToRoot();
		do {
			if (getIndexDirection() == Node.FROM_ABOVE) {
				Node n = getIndexNode();
				result = result + "(" + String.valueOf(n.number) + ") "
						+ n.getContent() + " Typ:"
						+ String.valueOf(n.getType());

				String nu = " father= ";
				if (n.getFather() != null) {
					nu = " Father= " + String.valueOf(n.getFather().number);
				}
				if (n.getLeftChild() != null) {
					nu = nu + " LeftChild= "
							+ String.valueOf(n.getLeftChild().number);
				}
				if (n.getMiddleChild() != null) {
					nu = nu + " MiddleChild= "
							+ String.valueOf(n.getMiddleChild().number);
				}
				if (n.getRightChild() != null) {
					nu = nu + " RightChild= "
							+ String.valueOf(n.getRightChild().number);
				}
				result = result + nu;

				if (n.equals(getCursorNode())) {
					result = result + "  <- Cursor" + CRLF;
				} else {
					result = result + "  " + CRLF;
				}
				// DebugPanel.debugPrint("yup=" + nd.yup, 3);
				// DebugPanel.debugPrintln("  ydown=" + nd.ydown, 3);
				// DebugPanel.debugPrint("  xstart=" + nd.xstart, 3);
				// DebugPanel.debugPrint("  xwidth=" + nd.xwidth, 3);
				// DebugPanel.debugPrint("  x_operator_start=" + nd.x_operator_start,
				// 3);
				// DebugPanel.debugPrintln("  x_operator_width=" + nd.x_operator_width,
				// 3);
				result = result + "************************" + CRLF;
			}
			IndexToNext(true);
		} while (isIndexRoot() == false);
		Node n = getIndexNode();
		result = result + n.getContent() + " Typ:"
				+ String.valueOf(n.getType()) + CRLF;
		return result;
	}

	public short getIndexDirection() {
		return IndexDirection;
	}

	public Node getIndexNode() {
		return Index;
	}

	public String getRepresentationBelowNode(Node n){
		nodeNumber = 400;
		String result = RepOfNode(n);
		return result;
	}
	
	public String getRepresentation() {
		return getRepresentationBelowNode(getRoot());
	}
	

	public String getZipString(boolean mobile) {
		String ret = getRepresentation();
		// DebugPanel.debugPrintln("getZipString="+ret,3);
		if (mobile) {
			ret = Converter.RepresentationToBase64(ret);
		}
		return ret;
	}

	public Node getRoot() {
		return Root;
	}

	private String getUnitRepresentation() { // used by isKindOf to decide if
												// unit fits
		String result = "<no unit>";
		Node child = Root.getMiddleChild();
		Node unit = new Node();
		if (child.getType() == Node.TYPE_TIMES && child.getContent().equals("")) {
			unit = child.getRightChild();
		}
		if (child.getType() == Node.TYPE_TIMES
				&& child.getContent().equals("*")) {
			if (child.getRightChild().getType() == Node.TYPE_TIMES) {
				child = child.getRightChild();
				if (child.getLeftChild().getType() == Node.TYPE_POWER
						&& child.getLeftChild().getLeftChild().getContent()
								.equals("10")) {
					unit = child.getRightChild();
				}
			}
		}
		result = getParsedUnitString(unit);
		if (result.indexOf("<no unit>") >= 0) {
			result = "<no unit>";
		}
		return result;
	}

	private String getParsedUnitString(Node unit) { // used by
													// getUnitRepresentation()
		String result = "<no unit>";
		if (unit.getType() == Node.TYPE_FRACTION
				&& unit.getContent().equals("unitfrac")) {
			Node nominator = unit.getLeftChild();
			Node denominator = unit.getRightChild();
			result = getParsedUnitString(nominator) + "/"
					+ getParsedUnitString(denominator);
		}
		if (unit.getType() == Node.TYPE_TIMES && unit.getContent().equals("")) {
			result = getParsedUnitString(unit.getLeftChild());
			result += " " + getParsedUnitString(unit.getRightChild());
		}
		if (unit.getType() == Node.TYPE_POWER) {
			Node exponent = unit.getRightChild();
			String expString = "<no unit>";
			if (exponent.getType() == Node.TYPE_NUMBER) {
				expString = exponent.getContent();
			}
			if (exponent.getType() == Node.TYPE_PLUSMINUS
					&& exponent.getLeftChild().getType() == Node.TYPE_ZERO) {
				expString = exponent.getContent()
						+ exponent.getRightChild().getContent();
			}
			result = getParsedUnitString(unit.getLeftChild());
			result += "^" + expString;
		}
		if (unit.getType() == Node.TYPE_UNIT) {
			result = unit.getContent();
		}
		return result;
	}

	public boolean isInfinityAllowed() {
		boolean result = false;
		if (Cursor.getType() == Node.TYPE_SPACE) {
			int fatherType = Cursor.getFather().getType();
			if (fatherType == Node.TYPE_TO_A) {
				// if (Cursor.getFather().getRightChild().equals(Cursor)) {
				if (Cursor.getPosition() == Node.POSITION_RIGHT) {
					result = true;
				}
			}
			if (Cursor.getFather().equals(Root)) {
				result = true;
			}
			if (fatherType == Node.TYPE_PLUSMINUS) {
				if (Cursor.getFather().getLeftChild().getType() == Node.TYPE_ZERO) {
					short grandPaType = Cursor.getFather().getFather()
							.getType();
					if (grandPaType != Node.TYPE_FROM_LEFT_TO_A
							&& grandPaType != Node.TYPE_FROM_RIGHT_TO_A) {
						result = true;
					}
				}
			}
		}
		return result;
	}

	public boolean isTimesTenAllowed() {
		boolean result = false;
		if (Cursor.getType() == Node.TYPE_NUMBER) {
			result = true;
			if (Cursor.isInMixedNumber()
					|| Cursor.getFather().getType() == Node.TYPE_PERIOD) {
				result = false;
			}
			if (Cursor.getFather().getType() == Node.TYPE_REALNUMBER
					&& Cursor.getPosition() == Node.POSITION_LEFT) {
				result = false;
			}
		}
		return result;
	}

	/**
	 * 
	 * TODO move isUnitAllowed() to ExpressionUnitManager
	 * @return true if Unit is allowed
	 */
	public boolean isUnitAllowed() {
		boolean result = false;
		if (Cursor.getType() == Node.TYPE_ALMOSTUNIT
				|| Cursor.getType() == Node.TYPE_UNIT) {
			result = true;
		} else if (Cursor.getType() == Node.TYPE_NUMBER) {
			result = true;
			if (Cursor.isInMixedNumber()
					|| Cursor.getFather().getType() == Node.TYPE_PERIOD) {
				result = false;
			}
			if (Cursor.getFather().getType() == Node.TYPE_REALNUMBER
					&& Cursor.getPosition() == Node.POSITION_LEFT) {
				result = false;
			}
		} else if (Cursor.getType() == Node.TYPE_POWER
				&& Cursor.getLeftChild().getContent().equals("10")) {
			result = true;
		} else if (Cursor.getType() == Node.TYPE_POWER
				&& Cursor.getLeftChild().getType() == Node.TYPE_UNIT) {
			result = true;
		}
		return result;
	}

	public boolean isIndexRoot() {
		// boolean r = false;
		// if (Index.equals(Root)) {
		// r = true;
		// }
		// return r;
		return Index.equals(Root);
	}

	public boolean isKindOf(String kindOf) { // condition = kindOf
		DebugPanel.debugPrintln("kindOf  vor replace = " + kindOf, 4);
		kindOf = kindOf.replaceAll("_", "");
		DebugPanel.debugPrintln("kindOf nach replace = " + kindOf, 4);
		boolean result = false;
		Node child = Root.getMiddleChild();
		int type = child.getType();
		if (kindOf.equals("squareroot")) {
			if (type == Node.TYPE_SQUAREROOT) {
				result = true;
			}
		}

		if (kindOf.equals("nosquareroot")) {
			if (type != Node.TYPE_SQUAREROOT) {
				result = true;
			}
		}

		if (kindOf.equals("product")) {
			if (type == Node.TYPE_TIMES
					&& (!child.getLeftChild().getContent().equals("1"))
					&& (!child.getRightChild().getContent().equals("1"))) {
				result = true;
			}
		}

		if (kindOf.equals("sum")) {
			if (type == Node.TYPE_PLUSMINUS
					&& (!child.getLeftChild().getContent().equals("0"))
					&& (!child.getRightChild().getContent().equals("0"))) {
				result = true;
			}
		}

		if (kindOf.equals("productofbrackets")) {
			if (type == Node.TYPE_TIMES
					&& child.getLeftChild().getType() == Node.TYPE_BRACKET
					&& child.getRightChild().getType() == Node.TYPE_BRACKET) {
				result = true;
			}
		}

		if (kindOf.startsWith("unit:")) {
			String unit = kindOf.substring(5);
			if (getUnitRepresentation().equals(unit)) {
				result = true;
			}
		}

		if (kindOf.equals("naturalnumber")) {
			if (type == Node.TYPE_NUMBER) {
				result = true;
			}
		}

		// Vorzeichen ignorieren f�r die folgenden content-Typen
		if (type == Node.TYPE_PLUSMINUS
				&& child.getLeftChild().getType() == Node.TYPE_ZERO
				&& child.getContent().equals("-")) {
			child = child.getRightChild();
			type = child.getType();
		}

		if (kindOf.equals("fraction")) {
			if (type == Node.TYPE_FRACTION || type == Node.TYPE_NUMBER
					|| type == Node.TYPE_MIXEDNUMBER) {
				result = true;
			}
		}

		if (kindOf.equals("reducedfraction")) {
			if (type == Node.TYPE_NUMBER) {
				result = true;
			}
			if (type == Node.TYPE_FRACTION || type == Node.TYPE_MIXEDNUMBER) {
				if (type == Node.TYPE_MIXEDNUMBER) {
					child = child.getRightChild();
				}
				int zaehler = Integer.parseInt(child.getLeftChild()
						.getContent());
				int nenner = Integer.parseInt(child.getRightChild()
						.getContent());
				if (GGT(zaehler, nenner) == 1) {
					result = true;
				}
			}
		}

		if (kindOf.equals("realnumber")) { // schlie�t nat�rliche Zahlen und
											// periodische Dezimalbr�che mit
											// ein.
			if (type == Node.TYPE_REALNUMBER || type == Node.TYPE_NUMBER) {
				result = true;
			}
		}

		if (kindOf.equals("wholenumber")) {
			if (type == Node.TYPE_NUMBER) {
				result = true;
			}
		}

		if (kindOf.equals("periodicnumber")) { // periodischer Dezimalbruch
			if (type == Node.TYPE_PLUSMINUS
					&& child.getLeftChild().getType() == Node.TYPE_ZERO
					&& child.getContent().equals("-")) {
				type = child.getRightChild().getType();
			}
			if (type == Node.TYPE_REALNUMBER
					&& child.getRightChild().getType() == Node.TYPE_PERIOD) {
				result = true;
			}
		}
		return result;
	}

	// *********************************
	// ****** setter methods *******
	// *********************************
	public void setCursor(Node n) {
		Cursor = n;
	}

	public void setBoundaryExists(boolean truefalse) {
		BoundaryExists = truefalse;
	}

	public void setRoot(Node n) {
		Root = n;
	}

	private void setFromRepresentation(String rep) {
		Root = Node.getNodeFromString(rep);
		Root.setPosition(Node.POSITION_ROOT);
		setCursor(Root.getMiddleChild());
	}

	public void setFromZipString(String representation, boolean mobile) {
		try {
			if (mobile) {
				representation = Converter.Base64ToRepresentation(representation);
			}
			setFromRepresentation(representation);
		} catch (Exception ex) {
			DebugPanel.debugPrint("Error in method setFromZipString", 0);
			DebugPanel.debugPrintln(ex.toString(), 0);
		}
	}

	public void setIndexDirection(short d) {
		IndexDirection = d;
	}

	public void setIndexNode(Node n) {
		Index = n;
	}

	public void setKindOfTerm() {
		Root.setType(Node.TYPE_TERM);
		Root.setContent("root");
	}

	public void setKindOfTermEquals() {
		Root.setType(Node.TYPE_TERM_EQUALS);
		Root.setContent("=");
	}

	// Index-Bewegungen
	public void IndexToRoot() {
		Index = Root;
		IndexDirection = Node.FROM_ABOVE;
	}

	public void IndexToNext(boolean forward) {
		try {
			if (!(isIndexRoot() && (IndexDirection == Node.FROM_BELOW))) {

				// Index erst am Schluss ver�ndern!
				Node Result = null;
				short ResultDirection = 0;
				if (Index.getKind() == Node.KIND_LEAF) {
					Result = Index.getFather();
					ResultDirection = Index.getPosition();
				}

				if (Index.getKind() == Node.KIND_UNARY_NODE) {
					if (IndexDirection == Node.FROM_ABOVE) {
						Result = Index.getMiddleChild();
						ResultDirection = Node.FROM_ABOVE;
					} else { // FROM_BELOW
						Result = Index.getFather();
						ResultDirection = Index.getPosition();
					}
				}

				if (Index.getKind() == Node.KIND_BINARY_NODE) { // kompliziertester
																// Fall
					if (forward) {
						if (IndexDirection == Node.FROM_ABOVE) {
							Result = Index.getLeftChild();
							ResultDirection = Node.FROM_ABOVE;
						}
						if (IndexDirection == Node.FROM_LEFT) {
							Result = Index.getRightChild();
							ResultDirection = Node.FROM_ABOVE;
						}
						if (IndexDirection == Node.FROM_RIGHT) {
							Result = Index.getFather();
							ResultDirection = Index.getPosition();
						}
					} else {
						if (IndexDirection == Node.FROM_ABOVE) {
							Result = Index.getRightChild();
							ResultDirection = Node.FROM_ABOVE;
						}
						if (IndexDirection == Node.FROM_RIGHT) {
							Result = Index.getLeftChild();
							ResultDirection = Node.FROM_ABOVE;
						}
						if (IndexDirection == Node.FROM_LEFT) {
							Result = Index.getFather();
							ResultDirection = Index.getPosition();
						}
					}
				}
				// DebugPanel.debugPrint("komme von..."+String.valueOf(this.getIndexDirection()),3);
				// DebugPanel.debugPrint(" Bewege Index von "+String.valueOf(Index.number),3);
				Index = Result;
				IndexDirection = ResultDirection;
				// DebugPanel.debugPrint(" nach "+String.valueOf(Index.number),3);
				// DebugPanel.debugPrintln("  neue Richtung "+String.valueOf(this.getIndexDirection()),3);
			}
		} catch (Exception ex) {
			DebugPanel.debugPrintln("Fehler in Methode IndexToNext", 0);
		}
	}

	public void convertQuestionmarks2Spaces() {
		IndexToRoot();
		do {
			Node nd = getIndexNode();
			if (nd.getType() == Node.TYPE_VARIABLE_AZ) {
				if (nd.getContent().equals(Node.InputFieldContent)) {
					nd.setType(Node.TYPE_SPACE);
					nd.setContent(Node.SpaceContent);
				}
			}
			IndexToNext(true);
		} while (isIndexRoot() == false);
	}

	String RepOfNode(Node node) {
		String content = node.getContent();
		// Klammern maskieren
		if (content.equals("(")) {
			content = "rka";
		}
		if (content.equals(")")) {
			content = "rkz";
		}
		if (content.equals("[")) {
			content = "eka";
		}
		if (content.equals("]")) {
			content = "ekz";
		}

		String result = "";
		String klammer = "(" + nodeNumber + ")";
		nodeNumber++;
		if (node.getKind() == Node.KIND_BINARY_NODE) {
			result = "[" + String.valueOf(300 + node.getType()) + content + "]"
					+ klammer;
			result = result + RepOfNode(node.getLeftChild()) + klammer;
			result = result + RepOfNode(node.getRightChild()) + klammer;
		}
		if (node.getKind() == Node.KIND_UNARY_NODE) {
			result = "[" + String.valueOf(200 + node.getType()) + content + "]"
					+ klammer;
			result = result + RepOfNode(node.getMiddleChild()) + klammer;
		}
		if (node.getKind() == Node.KIND_LEAF) {
			result = "[" + String.valueOf(100 + node.getType()) + content + "]";
		}
		return result;
	}



	private int GGT(int a, int b) { // used by isKindOf to decide if fraction is
									// reduced
		a = Math.abs(a);
		b = Math.abs(b);
		int max = Math.max(a, b);
		b = Math.min(a, b);
		a = max;
		int rest = 0;
		do {
			rest = a % b;
			a = b;
			b = rest;
		} while (rest > 0);
		return a;
	}
}
