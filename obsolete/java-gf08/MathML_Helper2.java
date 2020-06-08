package gut.client;

/**
 * @author Rudolf Grossmann
 * @version gf08 24.11 (30. August 2016)
 */

public class MathML_Helper2 {
	final public static String CRLF = "\r\n";

	private static void add_nodeId(String id, StringBuffer NList) {
		// GWT.log("vor add "+NList.toString());
		if (NList.length() == 0) {
			NList.append("\"");
		} else {
			NList.append("\", \""); // result: ...last_id", "
		}
		NList.append(id);
		// GWT.log("nach add "+ NList);
	}

	public static String getMathML(String faID, Node root, StringBuffer nodeList) {
		nodeList.delete(0, nodeList.length());
		String mathml = "";
		// String mathml = "<span class=\"formula\">\r\n";
		// String mathml = "<math xmlns=\"http://www.w3.org/1998/Math/MathML\"
		// display=\"block\">\r\n";
		mathml += getPart(root, nodeList, faID);
		// mathml += "</span>";
		nodeList.append("\"");
		return mathml;
	}

	private static String getPart(Node nd, StringBuffer nodeList, String _faID) {
		// depth++;
		// DebugPanel.debugPrint(""+depth, 3);
		String result = "";
		short kind = nd.getKind();
		short type = nd.getType();
		String content = nd.getContent();
		String id = _faID + "-" + String.valueOf(nd.getNumber());
		String id_tag = " id=\"" + id + "\">";
		String id_tap = id;
		if (kind == Node.KIND_LEAF) {
			switch (type) {
			case Node.TYPE_SPACE:
				result = "<span class=\"space\"" + id_tag + "&nbsp;</span>";
				add_nodeId(id, nodeList);
				break;
			case Node.TYPE_NUMBER:
				result = "<span class=\"number\"" + id_tag + content + "</span>";
				add_nodeId(id, nodeList);
				break;
			case Node.TYPE_VARIABLE_AZ:
				result = "<span class=\"variable\"" + id_tag + content + "</span>";
				add_nodeId(id, nodeList);
				break;
			/**
			 * case Node.TYPE_TEX: result = "<mi id=\"" + id_tap + "\">" +
			 * content + "</mi>"; break;
			 **/
			case Node.TYPE_UNICODE:
				result = "<span" + id_tag + content + "</span>";
				add_nodeId(id, nodeList);
				break;
			case Node.TYPE_ALMOSTUNIT:
				result = "<span class=\"almostunit\" id=\"" + id_tap + "\">" + content + "</span>";
				add_nodeId(id, nodeList);
				break;
			case Node.TYPE_UNIT:
				result = "<span class=\"unit\" id=\"" + id_tap + "\">" + disassemble(content) + "</span>";
				add_nodeId(id, nodeList);
				break;
			case Node.TYPE_MESSAGE:
				result = "<span class=\"message\" id=\"" + id_tap + "\">" + disassemble(content) + "</span>";
				add_nodeId(id, nodeList);
				break;
			case Node.TYPE_NO_RESULT:
				result = "<span class=\"noresult\" id=\"" + id_tap + "\">" + disassemble(content) + "</span>";
				add_nodeId(id, nodeList);
				break;
			case Node.TYPE_SEXAGESIMAL:
//				GWT.log("content_bli="+content);
				String h = content;
				h = h.replace("g", "&deg;");
//				GWT.log("content_bla="+content);
				result = "<span class=\"sexagesimal\" id=\"" + id_tap + "\">" + h + "</span>";
				add_nodeId(id, nodeList);
				break;
			case Node.TYPE_ALMOSTSEXAGESIMAL:
//				GWT.log("content_bli="+content);
				h = content;
				h = h.replace("g", "&deg;");
//				GWT.log("content_bla="+content);
				result = "<span class=\"almostsexagesimal\" id=\"" + id_tap + "\">" + h + "</span>";
				add_nodeId(id, nodeList);
				break;
			case Node.TYPE_STRING:
				result = "<mrow id=\"" + id_tap + "\">" + disassemble(content) + "</mrow>";
				add_nodeId(id, nodeList);
				break;
			case Node.TYPE_INFINITY:
				result = "<span id=\"" + id_tap + "\">&infin;</span>";
				add_nodeId(id, nodeList);
				break;
			case Node.TYPE_ZERO:
				result = "<span id=\"" + id_tap + "\" class=\"zero\"></span>";
				add_nodeId(id, nodeList);
				break;
			/**
			 * case Node.TYPE_NO_BOUNDARY: result = "<mi id=\"" + id_tap +
			 * "\">no boundary</mi>"; break; case Node.TYPE_GENERAL: result =
			 * "<mi id=\"" + id_tap + "\">general</mi>"; break;
			 **/
			default:
				result = "<span class=\"not yet implemented\" id=\"" + id + "\">" + disassemble(content) + "</span>";
				add_nodeId(id, nodeList);
				break;
			}
		}

		if (kind == Node.KIND_UNARY_NODE) {
			switch (type) {
			case Node.TYPE_TERM:
				result += getPart(nd.getMiddleChild(), nodeList, _faID);
				break;
			case Node.TYPE_TERM_EQUALS:
				result += getPart(nd.getMiddleChild(), nodeList, _faID) + "<span id=\"" + id + "\">=</span>";
				add_nodeId(id, nodeList);
				break;
			case Node.TYPE_BRACKET:
				// TODO add tap_s="false"
				result += "<span id=\"" + id + "-open\">";
				result += content;
				add_nodeId(id, nodeList);
				result += "</span>";
				result += getPart(nd.getMiddleChild(), nodeList, _faID);
				result += "<span id=\"" + id + "-close\">";
				add_nodeId(id, nodeList);
				String haystack = "([<{|";
				int i = haystack.indexOf(content);
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
					DebugPanel.debugPrintln("Falscher Inhalt eines Knoten vom Typ BRACKET", 1);
				}
				}

				result += RightBracket;
				result += "</span>";
				break;
			case Node.TYPE_SQUAREROOT:
				result += "<span class=\"radic_container\"" + id_tag + CRLF;
				result += "<canvas class=\"radic_canvas\"></canvas>" + CRLF;
				result += "<span class=\"nbsp\">&nbsp;</span>" + CRLF;
				result += getPart(nd.getMiddleChild(), nodeList, _faID);
				result += "</span>"; // span container
				add_nodeId(id, nodeList);
				break;
			case Node.TYPE_FUNCTION:
				// result = "<mrow id=\"" + id_tap + "\">" +
				// disassemble(content)
				// + "</mrow><mo>&#x2061;</mo>";
				// 2015-03-23 GRO sin x ->
				// <mi>sin</mi><mo>&#x2061;</mo><mi>x</mi>
				result = "<span class=\"function\" " + id_tag + content + "</span>";
				// + "</span><span>&#x2061;</span>"; // &#x2061; = Function
				// Application - Hä?
				result += getPart(nd.getMiddleChild(), nodeList, _faID);
				add_nodeId(id, nodeList);
				break;
			case Node.TYPE_PERCENT:
				result += getPart(nd.getMiddleChild(), nodeList, _faID);
				result += "<span class=\"percent\"" + id_tag + "&nbsp;"+ nd.getContent() + "</span>";
				add_nodeId(id, nodeList);
				break;
			case Node.TYPE_BOUNDARY:
				result += "<span class=\"boundary\">";
				result += getPart(nd.getMiddleChild(), nodeList, _faID);
				result += "</span>";
				break;
			default:
				result = "unknown type of unode: " + nd.getType();
				break;
			}
		}
		if (kind == Node.KIND_BINARY_NODE) {
			switch (type) {
			case Node.TYPE_EQUATION:
				result += getPart(nd.getLeftChild(), nodeList, _faID);
				result += "<span class=\"equal\"" + id_tag + "=</span>";
				result += getPart(nd.getRightChild(), nodeList, _faID);
				break;
			case Node.TYPE_TIMES:
				result += "<mrow>";
				result += getPart(nd.getLeftChild(), nodeList, _faID);
				if (content.equals("*")) {
					result += "</mrow><mo" + id_tag + "&#x22C5;</mo><mrow>";
					add_nodeId(id, nodeList);
				} else {
					result += "</mrow> <mrow>";
				}
				result += getPart(nd.getRightChild(), nodeList, _faID);
				result += "</mrow>";
				break;
			case Node.TYPE_DIVIDED:
				result += "<mrow>";
				result += getPart(nd.getLeftChild(), nodeList, _faID);
				result += "</mrow><mo" + id_tag + ":</mo><mrow>";
				add_nodeId(id, nodeList);
				result += getPart(nd.getRightChild(), nodeList, _faID);
				result += "</mrow>";
				break;
			case Node.TYPE_FRACTION:
				result += "<span class=\"fraction\"><span class=\"num\">";
				result += getPart(nd.getLeftChild(), nodeList, _faID);
				result += "</span><span class=\"den\">";
				result += getPart(nd.getRightChild(), nodeList, _faID);
				result += "</span></span>";
				break;
			case Node.TYPE_MIXEDNUMBER:
				result += "<mrow" + id_tag;
				add_nodeId(id, nodeList);
				result += getPart(nd.getLeftChild(), nodeList, _faID);
				result += getPart(nd.getRightChild(), nodeList, _faID);
				result += "</mrow>";
				break;
			case Node.TYPE_PLUSMINUS:
				// result += "<mrow>";
				// result += getPart(nd.getLeftChild(), nodeList, _faID);
				// if (nd.getContent().equals("+")) {
				// result += "</mrow><span id=\"" + id_tap +
				// "\">+</span><mrow>";
				// add_nodeId(id, nodeList);
				// }
				// if (nd.getContent().equals("-")) {
				// result += "</mrow><span id=\"" + id_tap +
				// "\">&#x2212;</span><mrow>";
				// add_nodeId(id, nodeList);
				// }
				// result += getPart(nd.getRightChild(), nodeList, _faID);
				// result += "</mrow>";
				result += getPart(nd.getLeftChild(), nodeList, _faID);
				if (nd.getContent().equals("+")) {
					result += "<span class=\"plus\"" + id_tag + "+</span>";
					add_nodeId(id, nodeList);
				}
				if (nd.getContent().equals("-")) {
					result += "<span class=\"minus\"" + id_tag + "&#x2212;</span>";
					add_nodeId(id, nodeList);
				}
				result += getPart(nd.getRightChild(), nodeList, _faID);
				break;
			case Node.TYPE_LOG:
				result = "<span class=\"function\" " + id_tag + "log</span>";
				result += "<sub>" + getPart(nd.getLeftChild(), nodeList, _faID) + "</sub>";
				result += "<span>" + getPart(nd.getRightChild(), nodeList, _faID) + "</span>";
				add_nodeId(id, nodeList);
				break;
			case Node.TYPE_INTEGRAL:
				result = "<span class=\"under\">";
				result += getPart(nd.getLeftChild(), nodeList, _faID);
				result += "</span>";
				result += getPart(nd.getRightChild(), nodeList, _faID);
				add_nodeId(id, nodeList);
				break;
			case Node.TYPE_INTEGRAL_FROM_TO:
				result = "<span class=\"over\" " + id_tag;
				result += "<span class=\"sat\">" + getPart(nd.getRightChild(), nodeList, _faID) + "</span>";
				result += "<span class=\"ker integral\">∫</span>";
				result += "</span>";
				result += "<span class=\"sat\">" + getPart(nd.getLeftChild(), nodeList, _faID) + "</span>";
				add_nodeId(id, nodeList);
				break;
			case Node.TYPE_INTEGRAL_ARGUMENT:
				result += getPart(nd.getLeftChild(), nodeList, _faID);
				result += "<span class=\"integral_argument\">d" + getPart(nd.getRightChild(), nodeList, _faID) + "</span>";
				add_nodeId(id, nodeList);
				break;
			case Node.TYPE_HIGHER_ROOT: // 2015-03-23 GRO
				// result += "<mroot>";
				// result += "<mrow>" + getPart(nd.getRightChild(), nodeList,
				// _faID) + "</mrow>";
				// result += "<mrow>" + getPart(nd.getLeftChild(), nodeList,
				// _faID) + "</mrow>";
				// result += "</mroot>";
				// break;
				// 2015-11-07 GRO
				result += "<span class=\"radic_container\"" + id_tag + CRLF;
				// result += "<span class=\"radic_outer_container\"" + id_tag+
				// CRLF;
				result += "<canvas class=\"radic_canvas\"></canvas>" + CRLF;
				result += "<div class=\"radic_order\">";
				result += getPart(nd.getLeftChild(), nodeList, _faID);
				result += "</div>" + CRLF;
				// result += "<span class=\"radic_inner_container\">"+CRLF;
				result += "<span class=\"nbsp\">&nbsp;</span>" + CRLF;
				// result += "<span class=\"radicand2\">";
				result += getPart(nd.getRightChild(), nodeList, _faID);
				// result += "</span>"; //radicand2
				// result += "</span>"; // inner container
				result += "</span>"; // container
				add_nodeId(id, nodeList);
				break;
			case Node.TYPE_POWER:
				result += getPart(nd.getLeftChild(), nodeList, _faID);
				result += "<sup>" + getPart(nd.getRightChild(), nodeList, _faID) + "</sup>";
				break;
			case Node.TYPE_INDEX:
				result += getPart(nd.getLeftChild(), nodeList, _faID);
				result += "<sub>" + getPart(nd.getRightChild(), nodeList, _faID) + "</sub>";
				break;
			case Node.TYPE_REALNUMBER:
				result += "<span" + id_tag;
				add_nodeId(id, nodeList);
				result += getPart(nd.getLeftChild(), nodeList, _faID);
				// TODO localization
				result += "</span>,<span>";
				result += getPart(nd.getRightChild(), nodeList, _faID);
				result += "</span>";
				break;
			case Node.TYPE_PERIOD:
				if (nd.getLeftChild().getContent().startsWith("empty_pp")){
					result += "<span class=\"empty_preperiod\"" + id_tag;
//					result += "<span></span>";
				} else {
					result += "<span" + id_tag;
					result += getPart(nd.getLeftChild(), nodeList, _faID);
				}
				add_nodeId(id, nodeList);
				// TODO localization
//				result += "</span><span style=\"text-decoration: overline\">";
				result += "</span><span class=\"period\">";
				result += getPart(nd.getRightChild(), nodeList, _faID);
				result += "</span>";
				break;
			case Node.TYPE_LIMIT:
				result += "<span class=\"under\"" + id_tag;
				add_nodeId(id, nodeList);
				result += "<span class=\"ker, italic\">lim</span>";
				// result += "<span class=\"sat\">x → ∞</span>";
				result += "<span class=\"sat\">";
				result += getPart(nd.getLeftChild(), nodeList, _faID);
				result += "</span>";
				result += "</span>";
				result += getPart(nd.getRightChild(), nodeList, _faID);
				break;
			case Node.TYPE_TO_INFINITY:
				result += "<span " + id_tag;
				add_nodeId(id, nodeList);
				result += getPart(nd.getLeftChild(), nodeList, _faID);
				result += "</span><span>→</span>";
				result += getPart(nd.getRightChild(), nodeList, _faID);
				break;
			case Node.TYPE_TO_A:
				result += "<span " + id_tag;
				add_nodeId(id, nodeList);
				result += getPart(nd.getLeftChild(), nodeList, _faID);
				result += "</span><span>→</span>";
				result += getPart(nd.getRightChild(), nodeList, _faID);
				break;
			default:
				result += "<span class=\"not yet implemented\">";
				result += getPart(nd.getLeftChild(), nodeList, _faID);
				result += "</span>?<span>";
				result += getPart(nd.getRightChild(), nodeList, _faID);
				result += "</span>";
				break;
			}
		}
		// depth--;
		// return getSpaces() + result + CRLF;
		return result;
	}

	private static String disassemble(String s) {
		String result = "";
		for (int i = 0; i < s.length(); i++) {
			String letter = s.substring(i, i + 1);
			// result += "<mi>" + letter + "</mi>";
			result += "<span>" + letter + "</span>";
		}
		return result;
	}
}
