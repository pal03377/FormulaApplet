package gut.client;

import com.google.gwt.core.client.GWT;

/**
 * @author Rudolf Grossmann
 * 
 * @version gf08 24.11 (30. August 2016)
 */

public class CommandManager implements FaEventListener {

	private ExpressionPainterParameterManager Par = new ExpressionPainterParameterManager();

	// TODO replace abbreviations with corresponding getter methods!
	// abbreviations, legacy!
	private Node Cursor;
	private short type;
	private short CursorPosition;
	private Node Father = new Node();
	private short ftype;
	private Expression exp = new Expression();

	/**
	 * START CommandManagerBasics
	 */

	protected Expression solution = new Expression();
	protected boolean dirty = false;

//TODO Delete obsolete code
//	private boolean isShowingMessage = false;
//	private String message = "";
	private String copyBuffer;

	public void setDirty(boolean isDirty) {
		dirty = isDirty;
		if (isDirty) {
			// System.out.println("dirty=true -> paint!");
			// CommandEventProvider.fireCommandEvent("formulawidget",
			// Par.getId(),
			// "PAINT");
			FaEventProvider.fireFaEvent("PAINT");
		}
	}

	public boolean isDirty() {
		return dirty;
	}

	public Expression getExpression() {
		return exp;
	}

	public void setExpression(Expression e) {
		exp = e;
	}

	public Expression getSolution() {
		return solution;
	}

	public void setSolution(Expression e) {
		solution = e;
	}

	public ExpressionPainterParameterManager getPar() {
		return Par;
	}

	public void setPar(ExpressionPainterParameterManager Par) {
		this.Par = Par;
	}

	//TODO Delete obsolete code

//	public void showAppletMessage(String msg) {
//		isShowingMessage = true;
//		message = msg;
//		setDirty(true);
//		// TODO decide what is nicer...
//		DialogHelper.showMessage(message);
//		DebugPanel.debugPrintln("Message: " + msg, 3);
//	}

//	public void hideAppletMessage() {
//		isShowingMessage = false;
//		setDirty(true);
//	}
//
//	public boolean isShowingAppletMessage() {
//		return isShowingMessage;
//	}
//
//	public String getAppletMessage() {
//		return message;
//	}
//
	public String getId() {
		return Par.getId();
	}

	protected String getCopyBuffer() {
		return copyBuffer;
	}

	protected void setCopyBuffer(String buf) {
		copyBuffer = buf;
	}

	/**
	 * END CommandManagerBasics
	 */

	CommandManager(String id) {
		// Par is an EP_Painter which is identical to
		// ExpressionPainterParameterManager in gf06
		getPar().setId(id);
		// CommandEventProvider.addCommandListener(this);
		FaEventProvider.addFaEventListener(this);
	}

	@Override
	public void faEventReceived(FaEvent ev) {
//		if (getPar().hasFocusID()) {
		if (Bridge.isActive(getId())) {
			String kind = ev.getKind();
			String cmd = ev.getCommand();
			// GWT.log(getPar().getFocusId() + " received " + kind + cmd);
			if (!kind.startsWith("TAP")) {
				execute(kind, cmd);
			}
//			} else if (getPar().getId() == "fc_0" && getPar().getFocusId() == "") {
			} else if (getPar().getId() == "fc_0" && Bridge.getActiveId() == "undefined") {
			String kind = ev.getKind();
			String cmd = ev.getCommand();
			if (kind.startsWith("CMD") && cmd.startsWith("ACTIVATE_FC_0")) {
				Bridge.setActive(getId());
//				getPar().setFocusId(getId());
//				getPar().setInputActive();
			}
		}
	}

	protected void finalize() throws Throwable {
		try {
			// CommandEventProvider.removeCommandListener(this);
			FaEventProvider.removeFaEventListener(this);
			System.out.println("finalized: " + this.toString());
		} finally {
			super.finalize();
		}
	}

	// TODO bug if fraction follows variable

	// public void setExpression(Expression e) {
	// super.setExpression(e);
	// exp = getExpression(); // ugly sync nexessary
	// }

	public void execute(String kind, String cmd) {
//		GWT.log("Id=" + getId());
//		GWT.log("execute: " + kind + cmd);
		Cursor = exp.getCursorNode();
		type = Cursor.getType();
		CursorPosition = Cursor.getPosition();
		Father = Cursor.getFather();
		ftype = Father.getType();
		String knd = kind.toUpperCase();
		boolean done = knd.startsWith("DONE");
		// every key cancels showMessage

		//TODO Delete obsolete code
//		if (isShowingAppletMessage()) {
//			hideAppletMessage();
//			done = true;
//		}
		if (type == Node.TYPE_STRING) {
			done = handleString(knd, cmd);
		}
		if (!done) {
//			GWT.log("default setActive " + getId());
			Bridge.setActive(getId());
			// every (key) event switches to MODE_InputActive
			if (knd.equals("CMD-")) {
				done = handleCommand(cmd);
			} else if (knd.equals("CHAR-")) {
				done = handleVariablesAndOperators(cmd, true, false); // var=true
																		// bracket=false
			} else if (knd.equals("OPERATOR-")) {
				done = handleVariablesAndOperators(cmd, false, false); // var=false
																		// bracket=false
			} else if (knd.equals("BRACKET-")) {
				done = handleBracket(cmd);
			} else if (knd.equals("EQN-")) {
				done = handleEquation(cmd, true); // ask=true
			} else if (knd.equals("KEY-")) {
				done = handleKey(cmd);
			} else if (knd.equals("CURSOR-")) {
				done = handleCursor(cmd);
			} else if (knd.equals("NUMBER-")) {
				done = handleNumber(cmd);
			} else if (knd.equals("FUNCTION-")) {
				done = handleFunction(cmd);
			} else if (knd.equals("LANG-")) {
				// CEP.fireCommandEvent("LANG-",cmd); // causes infinite loop!
				Par.setDecimalSeparatorFromLocale();
				done = true;
			}
			if (!done) {
				DebugPanel.debugPrintln("Not consumed: " + knd + cmd, 3);
			} else {
				DebugPanel.debugPrintln("done: " + knd + cmd, 3);
			}
		}
	}

	private boolean handleCommand(String cmd) {
		boolean done = false;
		// if (cmd.equals("DELETE") && getCursorMode() == CU_LINE) {
		// cmd = "CLEAR_INPUTFIELD";
		// }
		if (cmd.equals("CLEAR_DEBUG")) {
			// ESC key
			DebugPanel.debugCls();
			DebugPanel.debugPrintln(cmd, 3);
			Par.setCursorMode(ExpressionPainterParameterManager.CU_LINE);
			done = true;
		} else if (cmd.equals("BACKSPACE")) {
			done = handleBackspace();
		} else if (cmd.equals("MML")) {
			StringBuffer NodeList = new StringBuffer();
			String h = MathML_Helper2.getMathML(getId(), exp.getRoot(), NodeList);
			h = h.replace("<", "&lt;");
			h = h.replace(">", "&gt;");
			h = h.replace("/mrow&gt;", "/mrow&gt;<br />");
			DialogHelper.showMessage(h);
			// RootPanel.get("debug_paint").getElement().setInnerHTML("<pre>"+h+"</pre>");
			// CommandEventProvider.js_render_my_mathml();
			done = true;

		} else if (cmd.equals("CUT")) {
			done = handleCut();
		} else if (cmd.equals("COPY")) {
			done = handleCopy();
		} else if (cmd.equals("PASTE")) {
			done = handlePaste();
		} else if (cmd.equals("SAVE2COOKIES")) {
			// TODO savecookies
			// saveCookies();
			done = true;
		} else if (cmd.equals("TOGGLE-DECIMALSEPARATOR")) {
			String dsep = Par.getDecimalSeparator();
			if (dsep.equals(",")) {
				Par.setDecimalSeparator(".");
			} else {
				Par.setDecimalSeparator(",");
			}
			DebugPanel.debugPrintln("DecimalSeparator=" + Par.getDecimalSeparator(), 3);
			setDirty(true);
			done = true;

		} else if (cmd.equals("TOGGLE-DEBUGCURSOR")) {
			if (Par.getCursorMode() != ExpressionPainterParameterManager.CU_DEBUG) {
				Par.setCursorMode(ExpressionPainterParameterManager.CU_DEBUG);
			} else {
				Par.setCursorMode(ExpressionPainterParameterManager.CU_LINE);
			}
			setDirty(true);
			done = true;

		} else if (cmd.equals("DELETE")) {
			int rememberCursorMode = Par.getCursorMode();
			if (rememberCursorMode == ExpressionPainterParameterManager.CU_LINE) {
				Par.setCursorMode(ExpressionPainterParameterManager.CU_RECTANGLE);
			}
			if (rememberCursorMode == ExpressionPainterParameterManager.CU_RECTANGLE) {
				Node cursor = exp.getCursorNode();
				boolean deleteAllowed = (Par.isEditMode() || !exp.isNodeOverBoundary(cursor));
				if (deleteAllowed) {
					// TODO better logic to decide if deletion of tree is
					// allowed or not
					Node father = cursor.getFather();
					Node space = new Node();
					if (cursor.getPosition() == Node.POSITION_LEFT) {
						father.setLeftChild(space);
						space.setPosition(Node.POSITION_LEFT);
					}
					if (cursor.getPosition() == Node.POSITION_MIDDLE) {
						father.setMiddleChild(space);
						space.setPosition(Node.POSITION_MIDDLE);
					}
					if (cursor.getPosition() == Node.POSITION_RIGHT) {
						father.setRightChild(space);
						space.setPosition(Node.POSITION_RIGHT);
					}
					// MerkeMarke
					space.setFather(father);
					exp.setCursor(space);
					// TODO setCursorMode
					// setCursorMode(CU_LINE);
					setDirty(true);
					done = true;
				}
			} // End of if (rememberCursorMode == CU_RECTANGLE)

		} else if (cmd.equals("CLEAR_INPUTFIELD")) {
			String msg = Localizer.getString("JOP_erase_input");
			String title = Localizer.getString("JOP_FormelApplet");
			DialogHelper.YesNoDialog(msg, title, "CLEAR_INPUTFIELD_YES", "CLEAR_INPUTFIELD_NO");
		} else if (cmd.equals("CLEAR_INPUTFIELD_YES")) {
			Expression newExp = new Expression();
			try {
				short CP_Mode = Par.getCombiPanelMode();
				if (CP_Mode == ExpressionPainterParameterManager.CPMODE_term_solution
						|| CP_Mode == ExpressionPainterParameterManager.CPMODE_auto) {
					newExp = getExpression().getExpressionOverBoundary();
					// DebugPanel.debugCls();
					// DebugPanel.debugPrintln("*** newExp ***", 3);
					// DebugPanel.debugPrintln(newExp.getDumpString(), 3);
				}
			} catch (Exception e) {
				DebugPanel.debugPrintln(e.getLocalizedMessage(), 0);
			}
			setExpression(newExp);
			// TODO get rid of ugly synchronizing bugs in gf06
			exp = getExpression(); // synchronize exp and
									// CommandManagerShared.exp_private
			Cursor = exp.getCursorNode(); // synchronize
											// CommandManagerShared.Cursor
											// and
											// ExpressionParameterManager.Cursor
			setDirty(true);
			// DebugPanel.debugCls();
			// DebugPanel.debugPrint(getExpression().getDumpString(), 3);

			// functionBuffer.delete(0, functionBuffer.length());
			// key_flavour = 0; //legacy
			// execute("CMD-", "CLEAR_DEBUG");
			done = true;
		} else if (cmd.endsWith("SHOW_VERSION")) { // F1
			showVersion();
			done = true;
		} else if (cmd.equals("INFO")) { // F2
			String CRLF = "<br />\r\n";
			String info = "Formel-Applet-Editor " + VersionProvider.getVersion();
			// boolean isLinux =
			// System.getProperty("os.name").startsWith("Linux") ? true
			// : false;
			// if (isLinux) {
			// info = info + " Linux";
			// } else {
			// info = info + " Win";
			// }
			// TODO isKeyValid()
			boolean PE_restricted = false;
			if (PE_restricted) {
				info = info + " (restricted)";
			} else {
				info = info + " (full)";
			}
			info = info + CRLF + "www.formelapplet.de (c) Rudolf Gro&szlig;mann" + CRLF;
			// +
			// "CSS file fa.css uses some lines of mathquill.css by Jay and Han,
			// licensed with LGPL."
			// + CRLF;
			info += "Unit Detection Mode=" + Par.getUnitDetectionMode() + CRLF;
			info += "Editmode=" + Par.isEditMode() + CRLF;
			info += "CursorMovementRestricted=" + exp.isCursorMovementRestricted() + CRLF;
			info += "Current Locale=" + Localizer.getCurrentLocale() + CRLF;
			info += "inEditor=" + Bridge.isInEditor() + CRLF;
			DialogHelper.showMessage(info, Localizer.getString("JOP_technical_info"));
			done = true;
		} else if (cmd.equals("TEX")) { // F3
			// TODO i18n
			String TexString = exp.getTexRepresentation(",");
			DialogHelper.showMessage(TexString, Localizer.getString("JOP_tex"));
			done = true;
		} else if (cmd.equals("DUMP-TREE")) { // F4
			// DebugPanel.debugPrintln(exp.getDumpString(), 3);
			DialogHelper.showTree(exp); // replaces exp.dumpTree();
			done = true;
			// } else if (cmd.equals("EXPORT2WIKI")) {
			// CommandEventProvider.fireCommandEvent("formulawidget",
			// Par.getId(), "EXPORT2WIKI");
			// done = true;
			// } else if (cmd.equals("EXPORT_B64")) {
			// CommandEventProvider.fireCommandEvent("formulawidget",
			// Par.getId(), "EXPORT_B64");
			// done = true;
		} else if (cmd.equals("GETREPRESENTATION")) { // F9
			DialogHelper.showMessage(exp.getRepresentation());
			DebugPanel.debugCls();
			DebugPanel.debugPrint(exp.getRepresentation(), getId());
			done = true;
			// } else if (cmd.equals("ZOOM_IN")) {
			// CommandEventProvider.fireCommandEvent("formulawidget",
			// Par.getId(),
			// "ZOOM_IN");
			// done = true;
			// } else if (cmd.equals("ZOOM_OUT")) {
			// CommandEventProvider.fireCommandEvent("formulawidget",
			// Par.getId(),
			// "ZOOM_OUT");
			// done = true;
//		} else if (cmd.endsWith("SWITCH_MODE")) {
//			Par.Switch2NextMode();
//			done = true;
		} else if (cmd.equals("DELETE_BOUNDARY")) {
			exp.deleteBoundary();
			setDirty(true);
			done = true;
		} else if (cmd.equals("INSERT_BOUNDARY")) {
			exp.insertBoundaryOverCursor();
			if (Par.getCombiPanelMode() == ExpressionPainterParameterManager.CPMODE_auto) {
				exp.deleteTermUnderBoundary();
				exp.convertQuestionmarks2Spaces();
				Node nd = exp.getCursorNode();
				nd.setContent(Node.InputFieldContent);
				nd.setType(Node.TYPE_VARIABLE_AZ);
			}
			// DebugPanel.debugPrintln(exp.getDumpString(), 3);
			setDirty(true);
			done = true;
			// ******* new in gf06, no corresponding command in gut04 *********
		} else if (cmd.equals("SET_MODE_PHYSICS")) {
			getPar().setUnitDetectionModePhysics();
			setDirty(true);
			done = true;
		} else if (cmd.equals("SET_MODE_MATH")) {
			getPar().setUnitDetectionModeMath();
			//setDirty(true);
			done = true;
		} else if (cmd.equals("SET_DIRTY_TRUE")) {
			//setDirty(true);
			done = true;
		}
		return done;
	}

	// if (key.startsWith("EQUATION")) {
	// JOptionPane JOP = new JOptionPane();
	// int answer = JOP.showConfirmDialog(EIP, "Neue Gleichung erstellen?",
	// "Formelapplet", JOP.YES_NO_OPTION,
	// JOP.QUESTION_MESSAGE);
	// if (answer == JOP.YES_OPTION) {
	// }
	// }
	//
	//

	/**
	 * handles input of a variable like a,b,c,... or Alpha, Beta,...
	 * 
	 * @param is_var
	 *            String
	 * @return boolean
	 */
	private boolean handleVariablesAndOperators(String operator, boolean is_var, boolean is_bracket) {
		// cos(2x) bug. 2013-09-10
		// Move cursor from function brackets to function
		if (Cursor.getType() == Node.TYPE_BRACKET) {
			try {
				Node father = Cursor.getFather();
				if (father.getType() == Node.TYPE_FUNCTION) {
					exp.setCursor(father);
					Cursor = exp.getCursorNode();
					type = Cursor.getType();
					CursorPosition = Cursor.getPosition();
					Father = Cursor.getFather();
					ftype = Father.getType();
				}
			} catch (Exception e) {
				// TODO: handle exception
			}
		}

		// Often variables and operators are treated in a similar way!
		boolean done = false;
		// DebugPanel.debugPrintln("VarAndOperator: " + operator, 3);
		// if (operator.equals("g")) {
		// DebugPanel.debugPrintln("g", 3);
		// }
		if (operator.equals("PLUS")) {
			done = handlePlusMinus("+");
			operator = "DONE";
		} else if (operator.equals("MINUS")) {
			done = handlePlusMinus("-");
			operator = "DONE";
		} else if (operator.startsWith("FRAC")) {
			done = handleFraction();
			operator = "DONE";
		} else if (operator.equals("TIMES")) {
			done = handleTimesDivided("*");
			operator = "DONE";
		} else if (operator.startsWith("DIVIDED")) {
			done = handleTimesDivided(":");
			operator = "DONE";
		} else if (operator.startsWith("CREATEINDEX")) {
			done = handleIndex();
			operator = "DONE";
		} else if (operator.startsWith("SQUARE")) {
			execute("CURSOR-", "UP");
			execute("NUMBER-", "2");
			execute("CURSOR-", "RIGHT");
			operator = "DONE";
		} else if (operator.startsWith("EXPONENT")) {
			execute("CURSOR-", "UP");
			operator = "DONE";
		}

		if (operator.equals("INFINITY")) {
			if (exp.isInfinityAllowed()) {
				Cursor.setType(Node.TYPE_INFINITY);
				Cursor.setContent("\u221E");
				setDirty(true);
			} else {
				DialogHelper.showMessage(Localizer.getString("msg_infinity_not_allowed"));
			}
			done = true;
		}

		if (operator.equals("TIMES_TEN")) {
			if (exp.isTimesTenAllowed()) {
				if (Cursor.getFather().getType() == Node.TYPE_REALNUMBER) {
					// Cursor eins hoch
					exp.setCursor(Cursor.getFather());
					Cursor = exp.getCursorNode();
				}
				Node times = new Node("*", Node.KIND_BINARY_NODE, Node.TYPE_TIMES);
				Node ten = new Node("10", Node.KIND_LEAF, Node.TYPE_NUMBER);
				exp.InsertBNodeOverCursor(times, ten);
				// Cursor = "ten"
				Node power = new Node("power", Node.KIND_BINARY_NODE, Node.TYPE_POWER);
				Node space = new Node();
				exp.InsertBNodeOverCursor(power, space);
				setDirty(true);
			} else {
				DialogHelper.showMessage(Localizer.getString("msg_times_ten_not_allowed"));
			}
			done = true;
		}

		if (operator.equals("PERIOD")) {
			if (Father.getType() == Node.TYPE_REALNUMBER) {
				if (type == Node.TYPE_SPACE) {
					Cursor.setContent("empty_pp");
					Cursor.setType(Node.TYPE_NUMBER);
					Node period = new Node("period", Node.KIND_BINARY_NODE, Node.TYPE_PERIOD);
					Node space = new Node();
					exp.InsertBNodeOverCursor(period, space);
				}
				if (type == Node.TYPE_NUMBER) {
					Node period = new Node("period", Node.KIND_BINARY_NODE, Node.TYPE_PERIOD);
					Node space = new Node();
					exp.InsertBNodeOverCursor(period, space);
				}
			}
			done = true;
		}

		if (!done) {
			// Variables a-z, A-Z, LIMIT, INTEGRAL, (HIGHER) ROOT, LOG,...,
			// Bracket
			boolean rightFactor = false;
			// if (key_flavour > 0 && key_flavour != 5) {
			boolean cur_ok = false;
			if (type == Node.TYPE_VARIABLE_AZ || type == Node.TYPE_SQUAREROOT || type == Node.TYPE_SPACE
					|| type == Node.TYPE_INDEX) {
				cur_ok = true;
			}
			if (type == Node.TYPE_BRACKET || type == Node.TYPE_MIXEDNUMBER || type == Node.TYPE_POWER
					|| type == Node.TYPE_HIGHER_ROOT) {
				cur_ok = true;
			}
			if (type == Node.TYPE_FUNCTION || type == Node.TYPE_FRACTION || type == Node.TYPE_ALMOSTUNIT
					|| type == Node.TYPE_UNIT) {
				cur_ok = true;
			}
			if (type == Node.TYPE_NUMBER && Father.getType() != Node.TYPE_REALNUMBER
					&& Father.getType() != Node.TYPE_PERIOD) {
				cur_ok = true;
			}
			rightFactor = (Father.getType() == Node.TYPE_TIMES && CursorPosition == Node.POSITION_RIGHT);
			if (Cursor.isInMixedNumber()) {
				cur_ok = false; // Keine Variablen in gemischten Zahlen
			}
			// In der Basis einer Potenz keine Variable hinzuf�gen, au�er falls
			// Space.
			if (Father.getType() == Node.TYPE_POWER && CursorPosition == Node.POSITION_LEFT
					&& (!(type == Node.TYPE_SPACE))) {
				cur_ok = false;
			}
			// Im Exponenten einer Einheit keine Variable in Space einsetzen.
			if (Father.getType() == Node.TYPE_POWER
					&& (Father.getLeftChild().getType() == Node.TYPE_UNIT
							|| Father.getLeftChild().getType() == Node.TYPE_ALMOSTUNIT)
					&& CursorPosition == Node.POSITION_RIGHT && type == Node.TYPE_SPACE) {
				cur_ok = false;
			}

			if (Father.getType() == Node.TYPE_PERIOD && Cursor.getPosition() == Node.POSITION_RIGHT) {
				// Cursor eins hochsetzen...
				exp.setCursor(Father);
				Cursor = exp.getCursorNode();
				CursorPosition = Cursor.getPosition();
				Father = Cursor.getFather();
				type = Cursor.getType();
			}

			if (Father.getType() == Node.TYPE_REALNUMBER && CursorPosition == Node.POSITION_RIGHT) {
				rightFactor = true; // zwar kein Faktor, aber dieselbe Situation
				cur_ok = true;
			}

			// Vor % keine Variable zulassen, z.B. 4% -> 4x% sperren
			if (Father.getType() == Node.TYPE_PERCENT) {
				cur_ok = false;
			}
			if (Father.getType() == Node.TYPE_REALNUMBER && Father.getFather().getType() == Node.TYPE_PERCENT) {
				cur_ok = false;
			}

			// 234,x und x,234 vermeiden
			if ((Father.getType() == Node.TYPE_REALNUMBER || Father.getType() == Node.TYPE_PERIOD)
					&& type == Node.TYPE_SPACE) {
				cur_ok = false;
			}

			/**
			 * @todo erase obsolete code
			 */
			// seems to be obsolete, replaced by handleFunction()
			// if (key_flavour == 4) { //Funktion
			// if (functionBuffer.indexOf("!") != -1) { //Funktion aus buffer
			// Node grandPa = Father.getFather();
			// Node temp = Father.getLeftChild(); //z.B. "times" vor sin// ALT-
			// tritt eventuell gar nicht auf, da
			// if (temp != null) {
			// //DebugPanel.debugPrintln("tempContent=" + temp.getContent(), 3);
			// //DebugPanel.debugPrintln("tempType=" +
			// String.valueOf(temp.getType()),
			// // 3);
			// }
			// if (operator.length() == 3) {
			// if (operator.equals("LOG")) {
			// Cursor = new Node(); //wird Space
			// Cursor.setFather(Father); //neu erzeugter Knoten hatte zun�chst
			// keinen Vater
			// Node Arg = new Node(); //noch ein Space
			// Arg.setFather(Father);
			// Father.setContent(operator);
			// Father.setKind(Node.KIND_BINARY_NODE);
			// Father.setType(Node.TYPE_LOG);
			// Cursor.setPosition(Node.POSITION_LEFT);
			// Arg.setPosition(Node.POSITION_RIGHT);
			// Father.setLeftChild(Cursor);
			// Father.setRightChild(Arg);
			// //sicherheitshalber:
			// Father.setMiddleChild(null);
			// } else {
			// Cursor = new Node(); //wird Space
			// Cursor.setFather(Father); //neu erzeugter Knoten hatte zun�chst
			// keinen Vater
			// Father.setContent(operator);
			// Father.setKind(Node.KIND_UNARY_NODE);
			// Father.setType(Node.TYPE_FUNCTION);
			// Cursor.setPosition(Node.POSITION_MIDDLE);
			// Father.setMiddleChild(Cursor);
			// //sicherheitshalber:
			// Father.setLeftChild(null);
			// Father.setRightChild(null);
			// }
			// /*
			// DebugPanel.debugPrintln("Father.number= " +
			// String.valueOf(Father.number), 3);
			// DebugPanel.debugPrintln("Cursor.number= " +
			// String.valueOf(Cursor.number), 3);
			// */
			// if (temp.getType() == Node.TYPE_TIMES) {
			// //DebugPanel.debugPrintln("tempType=" +
			// String.valueOf(temp.getType()), 3);
			// //DebugPanel.debugPrintln("FatherContent=" + Father.getContent(),
			// 3);
			// if (Father.getPosition() == Node.POSITION_LEFT) {
			// grandPa.setLeftChild(temp);
			// }
			// if (Father.getPosition() == Node.POSITION_RIGHT) {
			// grandPa.setRightChild(temp);
			// }
			// if (Father.getPosition() == Node.POSITION_MIDDLE) {
			// grandPa.setMiddleChild(temp);
			// }
			// temp.setFather(grandPa);
			// temp.setPosition(Father.getPosition());
			// temp.setRightChild(Father);
			// //DebugPanel.debugPrintln("rechtes Kind von " +
			// String.valueOf(temp.number) + " ist " +
			// String.valueOf(temp.getRightChild().number), 3);
			// Father.setPosition(Node.POSITION_RIGHT);
			// Father.setFather(temp);
			// }
			// } //Ende von if ...length==3
			// //
			// // if (operator.length() == 2) {
			// // /*
			// // if (operator.equals("pi")) {
			// // Cursor.setType(Node.TYPE_VARIABLE_AZ);
			// // Cursor.setContent("pi");
			// // System.out.println("Cursor.setContent('pi')");
			// // } else
			// // */
			// // {
			// // Cursor.setContent(Node.SpaceContent);
			// // Cursor.setType(Node.TYPE_SPACE);
			// // Node func = new Node(key, Node.KIND_UNARY_NODE,
			// Node.TYPE_FUNCTION);
			// // exp.InsertUNodeOverCursor(func);
			// // }
			// //
			// // } //Ende von if ...length==2
			//
			// //ist das Folgende wirklich n�tig?
			// exp.setCursor(Cursor);
			// exp.getCursorNode().setPosition(Cursor.getPosition());
			//
			// setDirty(true);
			// cur_ok = false; // erledigt.
			// }
			if (cur_ok) {
				// endlich einf�gen...
				if (type == Node.TYPE_ALMOSTUNIT || type == Node.TYPE_UNIT) {
					// if (key_flavour == 1) { //Variable
					// if (operator.length() == 1) { //Variable
					if (is_var) { // Variable
						// anf�gen
						String unit = Cursor.getContent() + operator;
						Cursor.setContent(unit);
						PhysicalUnit.checkIfUnitsWanted(Par.getUnitDetectionMode(), exp, getSolution(), Cursor);
						// Nachfrage, ob Einheit oder Produkt von Variablen (1.
						// Stelle von 5)
						if (Cursor.getType() != Node.TYPE_UNIT) {
							if (!Par.getUnitDetectionMode()
									.equals(ExpressionPainterParameterManager.UNITDETECTIONMODE_MATH)) {
								Cursor.setType(Node.TYPE_ALMOSTUNIT);
							}
						}
						operator = "DONE"; // Rest �berspringen
						done = true;
					}
				}

				if (!done && (!operator.startsWith("DONE"))) {
					if (type == Node.TYPE_SPACE) {
						// Cursor ist SPACE
						// if (key_flavour == 1) { //Variable
						// if (operator.length() == 1) { //Variable
						if (is_var) { // Variable
							Cursor.setContent(operator);
							// Variable in SPACE einf�gen
							Cursor.setType(Node.TYPE_VARIABLE_AZ);
							// Z�hler oder Nenner eines Einheiten-Bruches?
							if (Father.getType() == Node.TYPE_FRACTION && Father.getContent().equals("unitfrac")) {
								Cursor.setType(Node.TYPE_ALMOSTUNIT);
								// Nachfrage, ob Einheit oder Produkt von
								// Variablen (2. Stelle von 5)
								PhysicalUnit.checkIfUnitsWanted(Par.getUnitDetectionMode(), exp, getSolution(), Cursor);
							}
							done = true;
							setDirty(true);
							/*
							 * //...damit nach Eingabe von sin x das Plus
							 * richtig funktioniert if (Father.getType() ==
							 * Node.TYPE_FUNCTION) { exp.setCursor(Father); }
							 */
						}
						// if (key_flavour == 3) { //Wurzel (...=2,
						// Klammern/Space wurde schon oben erledigt)
						if (operator.equals("ROOT")) { // Wurzel (...=2,
														// Klammern/Space wurde
														// schon oben erledigt)
							Node root = new Node("squareroot", Node.KIND_UNARY_NODE, Node.TYPE_SQUAREROOT);
							exp.InsertUNodeOverCursor(root);
							done = true;
							setDirty(true);
						}

						if (operator.equals("HIGHER_ROOT")) { // h�here Wurzel
							Cursor.setContent("3");
							Cursor.setType(Node.TYPE_NUMBER);
							Node space = new Node();
							Node root = new Node("higher root", Node.KIND_BINARY_NODE, Node.TYPE_HIGHER_ROOT);
							exp.InsertBNodeOverCursor(root, space);
							done = true;
							setDirty(true);
						}
						// if (key_flavour == 7) { //Logarithmus
						if (operator.equals("LOG")) { // Logarithmus
							// Cursor.setContent("3");
							// Cursor.setType(Node.TYPE_NUMBER);
							Node space = new Node();
							Node log = new Node("log", Node.KIND_BINARY_NODE, Node.TYPE_LOG);
							exp.InsertBNodeOverCursor(log, space);
							// Nun ist der Exponent (space) der Cursor
							// Auf die Basis (Cursor) zur�cksetzen
							exp.setCursor(Cursor);
							done = true;
						}

						// if (key_flavour == 8) { //Limes Typ Summand, z.B.
						// space -> lim(space) oder 2 + space -> 2 + lim(space)
						if (operator.startsWith("LIMES_")) { // Limes Typ
																// Summand, z.B.
																// space ->
																// lim(space)
																// oder 2 +
																// space -> 2 +
																// lim(space)
							Cursor.setContent("x");
							Cursor.setType(Node.TYPE_VARIABLE_AZ);
							Node towards = new Node("a", Node.KIND_LEAF, Node.TYPE_VARIABLE_AZ);
							Node sub_lim = new Node("\u2192", Node.KIND_BINARY_NODE, Node.TYPE_TO_A);
							if (operator.equals("LIMES_2INFTY")) {
								sub_lim.setType(Node.TYPE_TO_INFINITY);
								towards.setContent("\u221E");
							}
							if (operator.equals("LIMES_L2A")) {
								sub_lim.setType(Node.TYPE_FROM_LEFT_TO_A);
							}
							if (operator.equals("LIMES_R2A")) {
								sub_lim.setType(Node.TYPE_FROM_RIGHT_TO_A);
							}
							exp.InsertBNodeOverCursor(sub_lim, towards);
							exp.setCursor(sub_lim);
							Node space = new Node();
							Node lim = new Node("lim", Node.KIND_BINARY_NODE, Node.TYPE_LIMIT);
							exp.InsertBNodeOverCursor(lim, space);
							exp.setCursor(space);
							done = true;
						}
						// if (key_flavour == 9) { //Integral
						if (operator.startsWith("INTEGRAL_")) { // Integral
							// Integral-Konstrukt einf�gen
							Cursor.setContent("int");
							Cursor.setKind(Node.KIND_BINARY_NODE);
							Cursor.setType(Node.TYPE_INTEGRAL);

							Node integral_from_to = new Node("\u222B", Node.KIND_BINARY_NODE,
									Node.TYPE_INTEGRAL_FROM_TO);
							Node from = new Node("a", Node.KIND_LEAF, Node.TYPE_VARIABLE_AZ);
							Node to = new Node("b", Node.KIND_LEAF, Node.TYPE_VARIABLE_AZ);
							if (operator.equals("INTEGRAL_U")) {
								from.setType(Node.TYPE_ZERO);
								to.setType(Node.TYPE_ZERO);
							}
							from.setFather(integral_from_to);
							to.setFather(integral_from_to);
							integral_from_to.setLeftChild(from);
							from.setPosition(Node.POSITION_LEFT);
							integral_from_to.setRightChild(to);
							to.setPosition(Node.POSITION_RIGHT);

							Node integral_argument = new Node("d", Node.KIND_BINARY_NODE, Node.TYPE_INTEGRAL_ARGUMENT);
							Node space = new Node();
							Node d_x = new Node("x", Node.KIND_LEAF, Node.TYPE_VARIABLE_AZ);
							space.setFather(integral_argument);
							d_x.setFather(integral_argument);
							integral_argument.setLeftChild(space);
							space.setPosition(Node.POSITION_LEFT);
							integral_argument.setRightChild(d_x);
							d_x.setPosition(Node.POSITION_RIGHT);

							integral_from_to.setFather(Cursor);
							integral_argument.setFather(Cursor);
							Cursor.setLeftChild(integral_from_to);
							integral_from_to.setPosition(Node.POSITION_LEFT);
							Cursor.setRightChild(integral_argument);
							integral_argument.setPosition(Node.POSITION_RIGHT);

							exp.setCursor(space);
							done = true;
							setDirty(true);
						}
						// key_flavour = 0; //alles erledigt; Fall "kein SPACE"
						// �berspringen
					} else {
						// Cursor ist kein SPACE
						// if (key_flavour > 0) {

						// f�r sin(xy)
						if (type != Node.TYPE_BRACKET && Father.getType() == Node.TYPE_FUNCTION) {
							Node bra = new Node("(", Node.KIND_UNARY_NODE, Node.TYPE_BRACKET);
							exp.InsertUNodeOverCursor(bra);
							done = true;
						}
						// f�r log(xy)
						if (type != Node.TYPE_BRACKET && Father.getType() == Node.TYPE_LOG
								&& Cursor.getPosition() == Node.POSITION_RIGHT) {
							Node bra = new Node("(", Node.KIND_UNARY_NODE, Node.TYPE_BRACKET);
							exp.InsertUNodeOverCursor(bra);
							done = true;
						}
						// f�r a:(bc)
						if (Father.getType() == Node.TYPE_DIVIDED && Cursor.getPosition() == Node.POSITION_RIGHT) {
							Node bra = new Node("(", Node.KIND_UNARY_NODE, Node.TYPE_BRACKET);
							exp.InsertUNodeOverCursor(bra);
							done = true;
						}

						if (is_bracket) { // Klammer anf�gen
							// Space als Faktor erg�nzen
							Node space = new Node();
							Node times = new Node("times", Node.KIND_BINARY_NODE, Node.TYPE_TIMES);
							if (rightFactor || (type == Node.TYPE_FRACTION && Father.getType() == Node.TYPE_MIXEDNUMBER)
									|| (type == Node.TYPE_BRACKET && Cursor.isWayBack()
											&& Father.getType() == Node.TYPE_FUNCTION)) { // f�r
																							// sin(x)y
								exp.InsertBNodeBetweenFatherAndGrandpa(times, space);
								done = true;
							} else {
								exp.InsertBNodeOverCursor(times, space);
								done = true;
							}
							Node bracket = new Node(operator, Node.KIND_UNARY_NODE, Node.TYPE_BRACKET);
							exp.InsertUNodeOverCursor(bracket);
							done = true;
							setDirty(true);
						}

						if (!done) {
							Node leaf = new Node(operator, Node.KIND_LEAF, Node.TYPE_VARIABLE_AZ); // Zu
																									// Testzwecken
																									// erst
																									// mal
																									// Eingabe
																									// als
																									// content

							// Automatisch in den Unit-Modus
							if (exp.isUnitAllowed()) {
								// Nachfrage, ob Einheit oder Produkt von
								// Variablen (3. Stelle von 5)
								PhysicalUnit.checkIfUnitsWanted(Par.getUnitDetectionMode(), exp, getSolution(), leaf);
								PhysicalUnit u = new PhysicalUnit(leaf.getContent());
								if (!u.isUnit()) {
									if (!Par.getUnitDetectionMode()
											.equals(ExpressionPainterParameterManager.UNITDETECTIONMODE_MATH)) {
										leaf.setType(Node.TYPE_ALMOSTUNIT);
									}
								}
							}
							// //Klammer oder Quadratwurzel oder h�here Wurzel
							if (operator.equals("ROOT")) {
								leaf = new Node();
							} // hier Variable einf�gen
							Node times = new Node("times", Node.KIND_BINARY_NODE, Node.TYPE_TIMES);
							if (rightFactor || (type == Node.TYPE_FRACTION && Father.getType() == Node.TYPE_MIXEDNUMBER)
									|| (type == Node.TYPE_BRACKET && Cursor.isWayBack()
											&& Father.getType() == Node.TYPE_FUNCTION)) { // f�r
																							// sin(x)y
								exp.InsertBNodeBetweenFatherAndGrandpa(times, leaf);
								done = true;
							} else {
								exp.InsertBNodeOverCursor(times, leaf);
								done = true;
								// printTree(ex);
								// DebugPanel.debugPrintln("Cursor.getContent()="
								// + Cursor.getContent(), 3);
								// DebugPanel.debugPrintln("exp.getCursorNode().getContent()="
								// + exp.getCursorNode().getContent(), 3);
							}

							// Klammer statt Variable oben erledigt
							// if (key_flavour == 2) { //Klammer
							// Node bracket = new Node(operator,
							// Node.KIND_UNARY_NODE, Node.TYPE_BRACKET);
							// if (operator.equals("|")) {
							// bracket.setType(Node.TYPE_BRACKET);
							// }
							// exp.InsertUNodeOverCursor(bracket);
							// done = true;
							// }
							// if (key_flavour == 3) { //Wurzel
							if (operator.equals("ROOT")) { // Wurzel
								Node br = new Node("w", Node.KIND_UNARY_NODE, Node.TYPE_SQUAREROOT);
								exp.InsertUNodeOverCursor(br);
								done = true;
							}
							// if (key_flavour == 6) { //h�here Wurzel
							if (operator.equals("HIGHER_ROOT")) { // h�here
																	// Wurzel
								leaf.setContent("3");
								leaf.setType(Node.TYPE_NUMBER);
								Node space = new Node();
								Node root = new Node("higher root", Node.KIND_BINARY_NODE, Node.TYPE_HIGHER_ROOT);
								exp.InsertBNodeOverCursor(root, space);
								done = true;
							}
							// if (key_flavour == 7) { //Logarithmus
							if (operator.equals("LOG")) { // Logarithmus
								leaf.setContent(Node.SpaceContent);
								leaf.setType(Node.TYPE_SPACE);
								Node space = new Node();
								Node root = new Node("log", Node.KIND_BINARY_NODE, Node.TYPE_LOG);
								exp.InsertBNodeOverCursor(root, space);
								// Nun ist der Exponent (space) der Cursor
								// Auf die Basis (leaf) zur�cksetzen
								exp.setCursor(leaf);
								done = true;
							}
							// if (key_flavour == 8) { //Limes, Typ Faktor, z.B.
							// 7 -> 7 lim(space) f�r x->a
							if (operator.startsWith("LIMES_")) { // Limes, Typ
																	// Faktor,
																	// z.B. 7 ->
																	// 7
																	// lim(space)
																	// f�r x->a
								leaf.setContent("x");
								leaf.setType(Node.TYPE_VARIABLE_AZ);
								exp.setCursor(leaf);
								Node towards = new Node("a", Node.KIND_LEAF, Node.TYPE_VARIABLE_AZ);
								Node sub_lim = new Node("\u2192", Node.KIND_BINARY_NODE, Node.TYPE_TO_A);
								if (operator.equals("LIMES_2INFTY")) {
									sub_lim.setType(Node.TYPE_TO_INFINITY);
									towards.setContent("\u221E");
								}
								if (operator.equals("LIMES_L2A")) {
									sub_lim.setType(Node.TYPE_FROM_LEFT_TO_A);
								}
								if (operator.equals("LIMES_R2A")) {
									sub_lim.setType(Node.TYPE_FROM_RIGHT_TO_A);
								}
								exp.InsertBNodeOverCursor(sub_lim, towards);
								exp.setCursor(sub_lim);
								Node space = new Node();
								Node lim = new Node("lim", Node.KIND_BINARY_NODE, Node.TYPE_LIMIT);
								exp.InsertBNodeOverCursor(lim, space);
								exp.setCursor(space);
								done = true;
							}

							// if (key_flavour == 9) { // Integral, Typ Faktor,
							// z.B. 7 -> 7 <Integral von a bis b �ber ... dx>
							if (operator.startsWith("INTEGRAL_")) { // Integral,
																	// Typ
																	// Faktor,
																	// z.B. 7 ->
																	// 7
																	// <Integral
																	// von a bis
																	// b �ber
																	// ... dx>
								// Integral-Konstrukt einf�gen
								// Neu-Synchronisation Cursor des KeyManagers -
								// Cursor der Expression n�tig; warum?
								Cursor = exp.getCursorNode();
								Cursor.setContent("int");
								Cursor.setKind(Node.KIND_BINARY_NODE);
								Cursor.setType(Node.TYPE_INTEGRAL);

								Node integral_from_to = new Node("\u222B", Node.KIND_BINARY_NODE,
										Node.TYPE_INTEGRAL_FROM_TO);
								Node from = new Node("a", Node.KIND_LEAF, Node.TYPE_VARIABLE_AZ);
								Node to = new Node("b", Node.KIND_LEAF, Node.TYPE_VARIABLE_AZ);
								if (operator.equals("INTEGRAL_U")) {
									from.setType(Node.TYPE_ZERO);
									to.setType(Node.TYPE_ZERO);
								}
								from.setFather(integral_from_to);
								to.setFather(integral_from_to);
								integral_from_to.setLeftChild(from);
								from.setPosition(Node.POSITION_LEFT);
								integral_from_to.setRightChild(to);
								to.setPosition(Node.POSITION_RIGHT);

								Node integral_argument = new Node("d", Node.KIND_BINARY_NODE,
										Node.TYPE_INTEGRAL_ARGUMENT);
								Node space = new Node();
								Node d_x = new Node("x", Node.KIND_LEAF, Node.TYPE_VARIABLE_AZ);
								space.setFather(integral_argument);
								d_x.setFather(integral_argument);
								integral_argument.setLeftChild(space);
								space.setPosition(Node.POSITION_LEFT);
								integral_argument.setRightChild(d_x);
								d_x.setPosition(Node.POSITION_RIGHT);

								integral_from_to.setFather(Cursor);
								integral_argument.setFather(Cursor);
								Cursor.setLeftChild(integral_from_to);
								integral_from_to.setPosition(Node.POSITION_LEFT);
								Cursor.setRightChild(integral_argument);
								integral_argument.setPosition(Node.POSITION_RIGHT);

								exp.setCursor(space);
								done = true;
								// printTree(ex);
							}
						}
					}
				}
			} // Ende cur_OK
				// } //Ende Variablen, Klammern, Wurzeln
		}
		if (done) {
			setDirty(true);
		}
		return done;
	}

	private boolean handleBackspace() {
		// TODO handleBackspace() needs re-design
		// DebugPanel.debugCls();
		// DebugPanel.debugPrintln("handleBackspace", 3);
		boolean done = false;
		// DebugPanel.debugPrintln("Par.getCursorMode()=="+Par.getCursorMode(),
		// 3);
		if (Par.getCursorMode() == ExpressionPainterParameterManager.CU_RECTANGLE) {
			// DebugPanel.debugPrintln("CU_RECTANGLE -> DELETE instead of
			// BACKSPACE",
			// 3);
			done = handleCommand("DELETE");
		} else {
			DebugPanel.debugPrintln("Backspace Node type=" + Cursor.getTypeString(type), 3);
			if (type == Node.TYPE_BRACKET) {
				exp.MoveCursorLeft();
				done = true;
			} else {
				if (type == Node.TYPE_SPACE && CursorPosition != Node.POSITION_LEFT) {
					if (ftype == Node.TYPE_PLUSMINUS || ftype == Node.TYPE_FUNCTION || ftype == Node.TYPE_TIMES
							|| ftype == Node.TYPE_DIVIDED || ftype == Node.TYPE_FRACTION || ftype == Node.TYPE_POWER
							|| ftype == Node.TYPE_MIXEDNUMBER || ftype == Node.TYPE_BRACKET
							|| ftype == Node.TYPE_SQUAREROOT || ftype == Node.TYPE_REALNUMBER
							|| ftype == Node.TYPE_PERIOD || ftype == Node.TYPE_HIGHER_ROOT || ftype == Node.TYPE_LOG) {
						// Cursor eins hochsetzen...
						exp.setCursor(Father);
						Cursor = exp.getCursorNode();
						CursorPosition = Cursor.getPosition();
						Father = Cursor.getFather();
						type = Cursor.getType();
					}
					if (ftype == Node.TYPE_UNIT) {
						Node father = Cursor.getFather();
						Node left = father.getLeftChild();
						left.setContent(Node.SpaceContent);
						left.setType(Node.TYPE_SPACE);
						exp.setCursor(left);
						/**
						 * @todo setfromrep
						 */
						// setFromRepresentation
						exp.DeleteBNode(father);
						done = true;
					}
				}

				boolean testInvisibleTimes = false;
				if (type == Node.TYPE_VARIABLE_AZ) {
					Cursor.setContent(Node.SpaceContent);
					Cursor.setType(Node.TYPE_SPACE);
					testInvisibleTimes = true;
					DebugPanel.debugPrintln("testInvisibleTimes = " + testInvisibleTimes, 3);
					done = true;
				}

				if (type == Node.TYPE_NUMBER) {
					// DebugPanel.debugPrintln("delete cipher of number", 3);
					String c = Cursor.getContent();
					if (c.length() > 1) {
						Cursor.setContent(c.substring(0, c.length() - 1));
					} else {
						Cursor.setContent(Node.SpaceContent);
						Cursor.setType(Node.TYPE_SPACE);
						testInvisibleTimes = true;
						// done = true; //wrong place?
					}
					done = true;
				}

				if (type == Node.TYPE_INFINITY) {
					Cursor.setContent(Node.SpaceContent);
					Cursor.setType(Node.TYPE_SPACE);
					testInvisibleTimes = true; // vielleicht unn�tig
					done = true;
				}

				if (type == Node.TYPE_POWER || type == Node.TYPE_INDEX) {
					exp.MoveCursorLeft(); // Cursor in Exponenten/Index bewegen
					done = true;
				}

				if (type == Node.TYPE_PERCENT) {
					Node percent = exp.getCursorNode();
					exp.MoveCursorLeft();
					exp.DeleteUNode(percent);
					done = true;
				}

				if (type == Node.TYPE_UNIT || type == Node.TYPE_ALMOSTUNIT) {
					if (Cursor.getContent().length() > 1) {
						String unit = Cursor.getContent().substring(0, Cursor.getContent().length() - 1);
						Cursor.setContent(unit);
						// Nachfrage, ob Einheit oder Produkt von Variablen (5.
						// Stelle von 5)
						PhysicalUnit.checkIfUnitsWanted(Par.getUnitDetectionMode(), exp, getSolution(), Cursor);
						// if (! UnitHandler.isUnit()) {
						// Cursor.setType(Node.TYPE_ALMOSTUNIT);
						// }
					} else {
						Cursor.setContent(Node.SpaceContent);
						Cursor.setType(Node.TYPE_SPACE);
						Node father = Cursor.getFather();
						Node firstfactor = father.getLeftChild();
						if (father.getType() == Node.TYPE_TIMES && Cursor.getPosition() == Node.POSITION_RIGHT) {
							exp.DeleteBNode(father);
							done = true;
						}
						exp.setCursor(firstfactor);
						if (firstfactor.getType() == Node.TYPE_REALNUMBER) {
							exp.MoveCursorRight();
							done = true;
						}
					}
				}

				if (Cursor.getKind() == Node.KIND_UNARY_NODE) {
					Node child = Cursor.getMiddleChild();
					if (child.getType() == Node.TYPE_SPACE) {
						exp.DeleteUNode(Cursor);
						exp.setCursor(child);
						testInvisibleTimes = true;
						done = true;
					}
				}

				// Integral l�schen
				if (ftype == Node.TYPE_INTEGRAL_ARGUMENT && type == Node.TYPE_SPACE
						&& Cursor.getPosition() == Node.POSITION_RIGHT) {
					// printTree(ex);
					Node newCursor = Father.getFather().getLeftChild().getLeftChild();
					exp.setCursor(newCursor);
					exp.DeleteBNode(Father.getFather().getLeftChild()); // INTEGRAL_FROM_TO
					// printTree(ex);
					exp.DeleteBNode(Father); // INTEGRAL_ARGUMENT
					// printTree(ex);
					exp.DeleteBNode(newCursor.getFather()); // INTEGRAL
					// printTree(ex);
					newCursor.setType(Node.TYPE_SPACE);
					newCursor.setKind(Node.KIND_LEAF);
					newCursor.setContent(Node.SpaceContent);
					done = true;
				}

				// String verk�rzen
				if (type == Node.TYPE_STRING) {
					if (ftype == Node.TYPE_INDEX) {
						String temp = Cursor.getContent();
						if (temp.length() > 0) {
							temp = temp.substring(0, temp.length() - 1);
							Cursor.setContent(temp);
							done = true;
						} else {
							Cursor = new Node();
							Node newCursor = Father.getLeftChild();
							exp.DeleteBNode(Father);
							exp.setCursor(newCursor);
							done = true;
						}
					} else {
						// DebugPanel.debugPrintln("String verk�rzen", 3);
						String temp = Cursor.getContent();
						if (temp.length() > 0) {
							temp = temp.substring(0, temp.length() - 1);
							Cursor.setContent(temp);
							done = true;
						}
					}
				}

				// Neuer Anlauf
				// DebugPanel.debugPrintln("neuer Anlauf", 3);
				type = Cursor.getType();
				Father = Cursor.getFather();
				ftype = Father.getType();

				// Spezialfall unsichtbares Mal / Periode
				if (testInvisibleTimes && ((ftype == Node.TYPE_TIMES && (!(Father.getContent().equals("*"))))
						|| ftype == Node.TYPE_PERIOD)) {
					// Cursor eins hochsetzen...
					// DebugPanel.debugPrintln("Cursor eins hochsetzen...", 3);
					exp.setCursor(Father);
					Cursor = exp.getCursorNode();
					CursorPosition = Cursor.getPosition();
					Father = Cursor.getFather();
					type = Cursor.getType();
					// ...dann wird unsichtbares Mal unten mit weggel�scht
					// ebenso das unsichtbare Periodenzeichen
				}

				if (Cursor.getKind() == Node.KIND_BINARY_NODE) {
					Node rchild = Cursor.getRightChild();
					Node lchild = Cursor.getLeftChild();
					// DebugPanel.debugPrintln("rchild=" + rchild.getContent(),
					// 3);
					// DebugPanel.debugPrintln("lchild=" + lchild.getContent(),
					// 3);
					// DebugPanel.debugPrintln(
					// "rchild.getType()=" + rchild.getType(), 3);
					// Bruch-Teil einer gem. Zahl erst unten l�schen
					if (rchild.getType() == Node.TYPE_SPACE && ftype != Node.TYPE_MIXEDNUMBER) {
						if (type == Node.TYPE_LOG || type == Node.TYPE_HIGHER_ROOT) {
							// DebugPanel.debugPrintln("ReplaceBNodeWithSpace",
							// 3);
							exp.ReplaceBNodeWithSpace(Cursor);
							done = true;
						} else {
							// DebugPanel.debugPrintln("DeleteBNode(Cursor)",
							// 3);
							exp.DeleteBNode(Cursor);
							exp.setCursor(lchild);
							Cursor = exp.getCursorNode();
							CursorPosition = Cursor.getPosition();
							Father = Cursor.getFather();
							type = Cursor.getType();
							if (Cursor.getContent().equals("empty_pp")) {
								Cursor.setContent(Node.SpaceContent);
								Cursor.setType(Node.TYPE_SPACE);
								type = Cursor.getType();
								done = true;
							}
							if (type != Node.TYPE_PERCENT) { // bei Prozent
																// Cursor
																// stehenlassen
								// DebugPanel.debugPrintln("vorher:
								// "+Cursor.getContent(),3);
								// sonst Cursor im Rest-Baum ganz nach rechts
								// bewegen.
								exp.MoveCursorToRightmostLeaf();
								Cursor = exp.getCursorNode();
								// DebugPanel.debugPrintln("nachher:
								// "+Cursor.getContent(),3);
								CursorPosition = Cursor.getPosition();
								Father = Cursor.getFather();
								ftype = Father.getType();
								type = Cursor.getType();
							}
						}
					}
				}

				// Bruch-Teil einer gemischten Zahl l�schen
				if (ftype == Node.TYPE_MIXEDNUMBER && type == Node.TYPE_FRACTION
						&& Cursor.getRightChild().getType() == Node.TYPE_SPACE) {
					Node mixed = Cursor.getFather();
					Node number = mixed.getLeftChild();
					exp.DeleteBNode(Cursor);
					exp.DeleteBNode(mixed);
					exp.setCursor(number);
					done = true;
				}

				// Cursor von unsichtbarem Mal wegbewegen
				if (type == Node.TYPE_TIMES && !Cursor.getContent().equals("*")) {
					exp.MoveCursorLeft();
				}

				// Sexagesimalzahl
				if (type == Node.TYPE_SEXAGESIMAL) {
					// DebugPanel.debugPrintln("Sexagesimal-L�schen",3);
					SexagesimalNumber sgn = new SexagesimalNumber(Cursor.getContent());
					if (sgn.endsWithDegrees()) {
						// hier eventuell noch Komma ber�cksichtigen...
						Cursor.setContent(String.valueOf(sgn.getDegree()));
						Cursor.setType(Node.TYPE_NUMBER);
					}
					if (sgn.endsWithMinutes()) {
						sgn.setMinute(0);
						Cursor.setContent(sgn.getDMS());
					}
					if (sgn.endsWithSeconds()) {
						sgn.setSecond(0);
						Cursor.setContent(sgn.getDMS());
					}
					if (Cursor.getContent().equals("0�")) {
						Cursor.setType(Node.TYPE_SPACE);
						Cursor.setContent(Node.SpaceContent);
					}
					done = true;
				}

				if (type == Node.TYPE_ALMOSTSEXAGESIMAL) {
					SexagesimalNumber sgn = new SexagesimalNumber();
					String temp = Cursor.getContent();
					if (temp.length() > 0) {
						temp = temp.substring(0, temp.length() - 1);
					}
					if (sgn.isAlmostValid(temp)) {
						Cursor.setContent(temp);
					}
					if (sgn.isValid(temp)) {
						sgn.setDMS(temp);
						Cursor.setContent(sgn.getDMS());
						Cursor.setType(Node.TYPE_SEXAGESIMAL);
					}
					done = true;
				}

				// Zero in Space umwandeln
				if (Cursor.getType() == Node.TYPE_ZERO) {
					Cursor.setType(Node.TYPE_SPACE);
					Cursor.setContent(Node.SpaceContent);
					done = true;
				}
			}
		}
		// if (!done) {
		// TODO implement DELETE by setCursorMode CU_RECTANGLE
		// Par.setCursorMode(ExpressionPainterParameterManager.CU_RECTANGLE);
		// }
		setDirty(true);
		return done;
	} // end of backspace

	private boolean handleBracket(String kindOfBracket) {
		boolean done = false;
		type = exp.getCursorNode().getType();
		if (type == Node.TYPE_SPACE) {
			if (Father.getType() != Node.TYPE_REALNUMBER) { // avoid 3.()
				Node bracket = new Node(kindOfBracket, Node.KIND_UNARY_NODE, Node.TYPE_BRACKET);
				exp.InsertUNodeOverCursor(bracket);
				setDirty(true);
				done = true;
			}
		}
		if (type == Node.TYPE_VARIABLE_AZ || type == Node.TYPE_INDEX) {
			// The following code caused the 2x(y) - 7 bug.

			// Node times = new Node("times", Node.KIND_BINARY_NODE,
			// Node.TYPE_TIMES);
			// Node leaf = new Node();
			// exp.InsertBNodeOverCursor(times, leaf);
			// Node bracket = new Node(kindOfBracket, Node.KIND_UNARY_NODE,
			// Node.TYPE_BRACKET);
			// exp.InsertUNodeOverCursor(bracket);
			// epp.setDirty(true);
			// done = true;

			done = handleVariablesAndOperators(kindOfBracket, false, true); // var=false
																			// bracket=true
		}
		if (!done) {
			// is this really necessary?
			handleVariablesAndOperators(kindOfBracket, false, true);
		}
		return done;
	}

	private boolean handleNumber(String digit) {
		GWT.log("handleNumber");
		GWT.log("Cursor.getContent()=" + Cursor.getContent());
		boolean done = false;
		if (digit.equals("POINT") || digit.equals("COMMA")) {
			if (type == Node.TYPE_NUMBER || (type == Node.TYPE_SPACE && Par.getDecimalSeparator().equals("."))) {
				// 123,446,789 verhindern.
				// Keine Kommazahlen in gemischten Zahlen
				// System.out.println("Hier kommt das Komma");
				if (Father.getType() != Node.TYPE_REALNUMBER && Father.getType() != Node.TYPE_PERIOD
						&& Cursor.isInMixedNumber() == false) {
					// System.out.println("Komma erlaubt");
					Node space = new Node(); // per Default-Konstruktor Space
					if (type == Node.TYPE_SPACE) {
						// allow English style with suppressed leading zero,
						// e.g. .6
						Cursor.setType(Node.TYPE_ZERO); // do not render space
						Cursor.setContent(Node.SpaceContent);
					}
					Node real = new Node(",", Node.KIND_BINARY_NODE, Node.TYPE_REALNUMBER);
					exp.InsertBNodeOverCursor(real, space);
					setDirty(true);
					done = true;
				}
			}
			if (type == Node.TYPE_STRING) {
				if (digit.equalsIgnoreCase("COMMA")) {
					Cursor.setContent(Cursor.getContent() + ",");
				}
				if (digit.equalsIgnoreCase("POINT")) {
					Cursor.setContent(Cursor.getContent() + ".");
				}
			}
		} else {
			if (type == Node.TYPE_SPACE) {
				boolean append = true;

				if (Father.getType() == Node.TYPE_INTEGRAL_ARGUMENT && Cursor.getPosition() == Node.POSITION_RIGHT) {
					// Bei Integral ...dx z.B. d5 verhindern
					append = false;
				}
				if (Father.getType() == Node.TYPE_FRACTION && Father.getContent().equals("unitfrac")) {
					// Zahlen bei Einheiten-Br�chen sperren
					append = false;
				}
				if (append == true) {
					Cursor.setType(Node.TYPE_NUMBER);
					Cursor.setContent(digit);
					exp.setCursor(Cursor);
					// DebugPanel.debugPrint(Cursor.getContent()+" in ", 3);
					// DebugPanel.debugPrintln(String.valueOf(Cursor.number),
					// 3);
					done = true;
					setDirty(true);
				}
			}
			if (!done && type == Node.TYPE_NUMBER) {
				String temp = Cursor.getContent() + digit;
				if (temp.length() <= 20) {
					Cursor.setContent(temp);
				} else {
					DebugPanel.debugPrintln("Zahl zu lang", 1);
				}
				done = true;
				setDirty(true);
			}

			if (type == Node.TYPE_SEXAGESIMAL || type == Node.TYPE_ALMOSTSEXAGESIMAL) {
				SexagesimalNumber sgn = new SexagesimalNumber();
				GWT.log("Cursor.getContent()=" + Cursor.getContent());
				String temp = Cursor.getContent() + digit;
				// GWT.log("sexagesimal temp="+temp);
				if (sgn.isAlmostValid(temp)) {
					Cursor.setContent(temp);
					// GWT.log("isAlmostValid=true");
					Cursor.setType(Node.TYPE_ALMOSTSEXAGESIMAL);
					done = true;
					setDirty(true);
				}
			}
		}
		return done;
	}

	// TODO make "public" not necessary (like in gf06)
	// handleEquation is called in InputApplet (gut04)
	public boolean handleEquation(String command, boolean ask) {
		boolean done = false;
		if (ask == true) {
			String title = Localizer.getString("JOP_new_term");
			String question = "";
			if (command.startsWith("EQUATION")) {
				question = Localizer.getString("JOP_new_equation");
			} else {
				question = Localizer.getString("JOP_new_term");
			}
			DialogHelper.YesNoDialog(question, title, command + "_YES", command + "_NO");
		} else {
			FaEventProvider.fireFaEvent(command + "_YES");
		}
		if (command.endsWith("_YES")) {
			if (command.startsWith("NEW_TERM")) {
				Expression newterm = new Expression();
				setExpression(newterm);
				done = true;
				Par.setCombiPanelMode(ExpressionPainterParameterManager.CPMODE_input);
				setDirty(true);
			} else if (command.startsWith("EQUATION_")) {
				Expression newEquation = new Expression();
				Node leftSide = newEquation.getCursorNode();
				if (command.startsWith("EQUATION_TEXTTERM")) {
					leftSide.setContent("f '(x)");
					leftSide.setType(Node.TYPE_STRING);
				} else {
					leftSide.setContent(Node.SpaceContent);
					leftSide.setType(Node.TYPE_SPACE);
				}
				Node equ_node = new Node("=", Node.KIND_BINARY_NODE, Node.TYPE_EQUATION);
				Node rightSide = new Node();
				if (command.toUpperCase().startsWith("EQUATION_MANU")
						|| command.toUpperCase().startsWith("EQUATION_TEXTTERM")) {
					Par.setCombiPanelMode(ExpressionPainterParameterManager.CPMODE_term_solution);
				}
				if (command.toUpperCase().startsWith("EQUATION_AUTO")) {
					Par.setCombiPanelMode(ExpressionPainterParameterManager.CPMODE_auto);
				}
				newEquation.InsertBNodeOverCursor(equ_node, rightSide);
				// rightSide ist Cursor
				newEquation.insertBoundaryOverCursor();
				newEquation.setCursor(leftSide);
				setExpression(newEquation);
				getExpression().hasBoundary();
				DebugPanel.debugCls();
				setDirty(true);
				done = true;
				// TODO command editmode_on
				// CommandEventProvider.fireCommandEvent("FASEDITOR",
				// "expressionpanel", "editmode_on", "");
			}

		}
		return done;
	}

	private boolean handlePlusMinus(String plusminus) {
		/**
		 * @todo method handlePlusMinus() needs re-design
		 */
		// Plus oder Minus wurde eingegeben
		boolean done = false;
		Node OldCursor = exp.getCursorNode();
		// nur in speziellen F�llen an Variable oder Zahlen Space als Summand
		// dranh�ngen

		// Cursortyp muss passen
		boolean cursor_ok = false;
		if (type == Node.TYPE_NUMBER && Father.getType() != Node.TYPE_REALNUMBER) {
			cursor_ok = true;
		}
		if (type == Node.TYPE_VARIABLE_AZ) {
			cursor_ok = true;
		}
		if (type == Node.TYPE_FRACTION && Cursor.getContent().equals("unitfrac")) {
			cursor_ok = true;
		}
		if (type == Node.TYPE_SEXAGESIMAL) {
			cursor_ok = true;
		}
		if (type == Node.TYPE_NUMBER) {
			if (Father.getType() == Node.TYPE_PERIOD && Cursor.getPosition() == Node.POSITION_RIGHT) {
				// Cursor eins hochsetzen...
				exp.setCursor(Father);
				Cursor = exp.getCursorNode();
				CursorPosition = Cursor.getPosition();
				Father = Cursor.getFather();
				type = Cursor.getType();
			}
			if (Father.getType() == Node.TYPE_REALNUMBER && Cursor.getPosition() == Node.POSITION_RIGHT) {
				// Cursor eins hochsetzen...
				exp.setCursor(Father);
				Cursor = exp.getCursorNode();
				CursorPosition = Cursor.getPosition();
				Father = Cursor.getFather();
				type = Cursor.getType();
				cursor_ok = true;
			}
		}
		if (type == Node.TYPE_PERCENT) {
			cursor_ok = true;
		}
		if (type == Node.TYPE_POWER || type == Node.TYPE_HIGHER_ROOT || type == Node.TYPE_LOG
				|| type == Node.TYPE_INDEX) {
			cursor_ok = true;
		}
		if (type == Node.TYPE_BRACKET && Cursor.isWayBack() == true) {
			cursor_ok = true;
		}
		if (type == Node.TYPE_FRACTION) {
			cursor_ok = true;
		}
		if (type == Node.TYPE_SQUAREROOT) {
			cursor_ok = true;
		}
		if (Father.getType() == Node.TYPE_FUNCTION
				|| (Father.getType() == Node.TYPE_LOG && Cursor.getPosition() == Node.POSITION_RIGHT)) {
			if (!(type == Node.TYPE_BRACKET && Cursor.isWayBack() == false)) {
				// Cursor eins hochsetzen...
				exp.setCursor(Father);
				Cursor = exp.getCursorNode();
				CursorPosition = Cursor.getPosition();
				Father = Cursor.getFather();
				type = Cursor.getType();
				cursor_ok = true;
			}
		}

		if (type == Node.TYPE_FRACTION && Father.getType() == Node.TYPE_MIXEDNUMBER) {
			// Cursor eins hochsetzen...
			exp.setCursor(Father);
			Cursor = exp.getCursorNode();
			CursorPosition = Cursor.getPosition();
			Father = Cursor.getFather();
			type = Cursor.getType();
			cursor_ok = true;
		}

		if (type == Node.TYPE_UNIT) {
			if (Father.getType() == Node.TYPE_FRACTION) {
				cursor_ok = false;
			} else {
				cursor_ok = true;
			}
		}

		if (Father.getType() == Node.TYPE_INTEGRAL_ARGUMENT && Cursor.getPosition() == Node.POSITION_RIGHT) {
			// Cursor war x von Integral...dx; Cursor eins hochsetzen...
			exp.setCursor(Father);
			Cursor = exp.getCursorNode();
			CursorPosition = Cursor.getPosition();
			Father = Cursor.getFather();
			type = Cursor.getType();
			cursor_ok = true;
			// Cursor ist nun INTEGRAL_ARGUMENT
		}

		boolean father_ok = false;

		if (cursor_ok == true) {
			// auch der Vater muss passen...

			// Fall 1.1: Cursor ist z.B. ein Radikand (Vater U-Knoten)
			// Fall 1.2: Cursor ist Nenner/Z�hler
			// Fall 1.3: Cursor ist Exponent
			// Fall 1.4: Cursor ist in h�herer Wurzel
			// Fall 1.5: Cursor ist in Basis des Logarithmus
			// Fall 1.6: Cursor ist in "from" oder "to" eines Integrals.
			// Damit wird Integral von/bis <Variable/Zahl/Wurzel/...> + space
			// m�glich.
			// Fall 1.7: Cursor ist in Integrandenfunktion.
			// Damit wird Integral ... �ber ( <Variable/Zahl/Wurzel/...> + space
			// ) m�glich.
			// Fall 1.8: Cursor ist linke/rechte Seite einer Gleichung
			if (Father.getKind() == Node.KIND_UNARY_NODE || Father.getType() == Node.TYPE_FRACTION
					|| (Father.getType() == Node.TYPE_POWER && Cursor.getPosition() == Node.POSITION_RIGHT)
					|| Father.getType() == Node.TYPE_HIGHER_ROOT
					|| (Father.getType() == Node.TYPE_LOG && Cursor.getPosition() == Node.POSITION_LEFT)
					|| Father.getType() == Node.TYPE_INTEGRAL_FROM_TO
					|| (Father.getType() == Node.TYPE_INTEGRAL_ARGUMENT && Cursor.getPosition() == Node.POSITION_LEFT)
					|| Father.getType() == Node.TYPE_EQUATION) {
				// gemischte Zahlen sperren, Prozent sperren
				if (Cursor.isInMixedNumber() == false && Father.getType() != Node.TYPE_PERCENT
						&& (Father.getType() != Node.TYPE_FUNCTION)) { // Funktionen
																		// werden
																		// in
																		// Fall
																		// 6
																		// erledigt
																		// (03.08.2003)

					// Klammern-Automatik f�r Integralfunktion,
					// <Variable/Zahl/Wurzel/...> + space
					if (Father.getType() == Node.TYPE_INTEGRAL_ARGUMENT && Cursor.getPosition() == Node.POSITION_LEFT) {
						Node bra = new Node("(", Node.KIND_UNARY_NODE, Node.TYPE_BRACKET);
						exp.InsertUNodeOverCursor(bra);
					}

					// father_ok nicht auf true - muss von Hand erledigt werden
					// zwischenVaterUndOpa passt hier leider nicht, sondern
					// ausbau2!

					// test if father boundary (cursor in inputfield)
					if (type != Node.TYPE_BRACKET && Father.getType() == Node.TYPE_BOUNDARY
							&& Father.getFather().getType() != Node.TYPE_EQUATION) {
						Node bra = new Node("(", Node.KIND_UNARY_NODE, Node.TYPE_BRACKET);
						exp.InsertUNodeOverCursor(bra);
						// bra is Cursor
						exp.setCursor(bra.getMiddleChild());
					}
					Node space = new Node();
					Node plusminusNode = new Node(plusminus, Node.KIND_BINARY_NODE, Node.TYPE_PLUSMINUS);
					exp.InsertBNodeOverCursor(plusminusNode, space);
					done = true;
					father_ok = false; // sicher ist sicher...
				}
			}

			// Fall 1.8, erm�glicht Integral...dx + space
			if (Father.getType() == Node.TYPE_INTEGRAL && type == Node.TYPE_INTEGRAL_ARGUMENT) {
				// gemischte Zahlen sperren, Prozent sperren
				// Klammern-Automatik f�r Integralfunktion,
				// <Variable/Zahl/Wurzel/...> + space
				Node space = new Node();
				Node plusminusNode = new Node(plusminus, Node.KIND_BINARY_NODE, Node.TYPE_PLUSMINUS);
				exp.InsertBNodeBetweenFatherAndGrandpa(plusminusNode, space);
				done = true;
				father_ok = false; // sicher ist sicher...
			}

			// Fall2: Space dranh�ngen an Summen, besserer Code vom 30.7.2001
			if ((Father.getType() == Node.TYPE_TIMES || Father.getType() == Node.TYPE_DIVIDED)
					&& Cursor.getPosition() == Node.POSITION_RIGHT && (!(type == Node.TYPE_FRACTION))) { // Cursor
																											// ist
																											// Zahl/Variable,
																											// Vater
																											// ist
																											// Maltyp,
																											// aber
																											// kein
																											// Bruch.
																											// Nun
																											// den
																											// Opa
																											// untersuchen.
				Node curGrandpa = Father.getFather();
				// Fall 2.1 - der komplizierte allgemeine Fall
				if (curGrandpa.getType() == Node.TYPE_PLUSMINUS && Father.getPosition() == Node.POSITION_RIGHT) { // Der
																													// Opa
																													// passt
																													// auch
																													// noch
																													// dazu
					// Trick: Index eine Ebene hochsetzen, statt zwischen Opa
					// und Uropa einzuf�gen!
					exp.setCursor(Father);
					Cursor = exp.getCursorNode();
					father_ok = true;
				}
				// Fall 2.2, noch ein Fall f�r den Opa
				if (curGrandpa.getKind() == Node.KIND_UNARY_NODE) {
					father_ok = true;
				}

				// Fall 2.3 - fast vergessen
				if (curGrandpa.getType() == Node.TYPE_PLUSMINUS && Father.getPosition() == Node.POSITION_LEFT) {
					father_ok = true;
				}

				// Fall 2.4 Cursor ist rechter Faktor in einem Exponenten
				// (22.8.2001)
				if (curGrandpa.getType() == Node.TYPE_POWER && Father.getPosition() == Node.POSITION_RIGHT) {
					father_ok = true;
				}

				// Fall 2.5 Opa ist h�here Wurzel, also Vater Radikand oder das
				// "n" der n-ten Wurzel.
				if (curGrandpa.getType() == Node.TYPE_HIGHER_ROOT) {
					father_ok = true;
				}

				// Fall 2.5 Opa ist allg. Logarithmus, also Vater Basis oder
				// Log.-Argument
				if (curGrandpa.getType() == Node.TYPE_LOG) {
					father_ok = true;
				}

				// Fall 2.6 Opa ist INTEGRAL_FROM_TO, Vater also "from" oder
				// "to"
				// Damit wird Integral von/bis <Produkt> + space m�glich
				if (curGrandpa.getType() == Node.TYPE_INTEGRAL_FROM_TO) {
					father_ok = true;
				}

				// Fall 2.7 Opa ist INTEGRAL_ARGUMENT
				// Damit wird Integral ... �ber <Produkt> + space m�glich
				if (curGrandpa.getType() == Node.TYPE_INTEGRAL_ARGUMENT && Father.getPosition() == Node.POSITION_LEFT) {
					// Vater ist Integralfunktion
					father_ok = true;
					// Klammern-Automatik
					Node bra = new Node("(", Node.KIND_UNARY_NODE, Node.TYPE_BRACKET);
					exp.InsertUNodeBetweenFatherAndGrandpa(bra);
				}
				// Fall 2.8 Opa ist Gleichung, Vater also linke/rechte
				// Gleichungsseite
				if (curGrandpa.getType() == Node.TYPE_EQUATION) {
					father_ok = true;
				}
			}
			// Das war der komplizierte Fall, nun kommt noch der einfachere
			// Fall 3
			if (Father.getType() == Node.TYPE_PLUSMINUS && Cursor.getPosition() == Node.POSITION_RIGHT) { // Cursor
																											// ist
																											// Zahl/Variable,
																											// Vater
																											// ist
																											// PlusMinustyp.
																											// getPosition()
																											// passt
																											// auch.
				father_ok = true;
			}

			// Fall 4 - auch das noch
			if (Father.getType() == Node.TYPE_PLUSMINUS && Cursor.getPosition() == Node.POSITION_LEFT) { // Cursor
																											// ist
																											// Zahl/Variable,
																											// Vater
																											// ist
																											// PlusMinustyp.
				// father_ok nicht auf true - muss von Hand erledigt werden
				// zwischenVaterUndOpa passt hier leider nicht, sondern ausbau2!
				Node space = new Node();
				Node plusminusNode = new Node(plusminus, Node.KIND_BINARY_NODE, Node.TYPE_PLUSMINUS);
				exp.InsertBNodeOverCursor(plusminusNode, space);
				done = true;
				father_ok = false; // sicher ist sicher...
			}

			// Fall 5
			if ((Father.getType() == Node.TYPE_TIMES || Father.getType() == Node.TYPE_DIVIDED)
					&& Cursor.getPosition() == Node.POSITION_RIGHT && (!(type == Node.TYPE_FRACTION))) { // Cursor
																											// ist
																											// Zahl/Variable,rechter
																											// Faktor,
																											// Vater
																											// ist
																											// Maltyp,
																											// aber
																											// kein
																											// Bruch.
																											// Nun
																											// den
																											// Opa
																											// untersuchen.
				Node curGrandpa = Father.getFather();
				if (curGrandpa.getType() == Node.TYPE_TIMES || curGrandpa.getType() == Node.TYPE_FRACTION) {
					// Cursor steht am Ende eines Produkts im Z�hler oder Nenner
					// eines Bruchs
					father_ok = true;
				}
			}
		}

		// hoffentlich keinen Fall vergessen...

		// gemischte Zahlen sperren
		if (Cursor.isInMixedNumber() == true) {
			father_ok = false;
		}

		// Prozent sperren
		if (Father.getType() == Node.TYPE_PERCENT) {
			// DebugPanel.debugPrintln("Vater ist %!", 3);
			father_ok = false;
		}

		if (type == Node.TYPE_FRACTION && Cursor.getContent().equals("unitfrac")
				&& Father.getType() == Node.TYPE_TIMES) {
			father_ok = true;
		}

		if (father_ok == true) {
			// test if grandpa is boundary (cursor in inputfield)
			if (type != Node.TYPE_BRACKET && Father.getFather().getType() == Node.TYPE_BOUNDARY
					&& Father.getFather().getFather().getType() != Node.TYPE_EQUATION) {
				Node bra = new Node("(", Node.KIND_UNARY_NODE, Node.TYPE_BRACKET);
				exp.InsertUNodeBetweenFatherAndGrandpa(bra);
			}
			Node space = new Node();
			Node plusminusNode = new Node(plusminus, Node.KIND_BINARY_NODE, Node.TYPE_PLUSMINUS);
			exp.InsertBNodeBetweenFatherAndGrandpa(plusminusNode, space);
			done = true;
		}

		// Interpretation als Vorzeichen
		boolean sign = false;
		if (type == Node.TYPE_SPACE) {
			int fatherType = Father.getType();
			if (fatherType == Node.TYPE_BRACKET) {
				sign = true;
			}
			if (fatherType == Node.TYPE_EQUATION) {
				sign = true;
			}
			if (fatherType == Node.TYPE_BOUNDARY) {
				sign = true;
			}
			if (fatherType == Node.TYPE_HIGHER_ROOT) {
				sign = true;
			}
			if (fatherType == Node.TYPE_SQUAREROOT) {
				sign = true;
			}
			if (Father.getPosition() == Node.POSITION_ROOT || Father.getType() == Node.TYPE_EQUATION) {
				sign = true; // Eingabe beginnt mit Vorzeichen
			}
			if (fatherType == Node.TYPE_FRACTION && Cursor.isInMixedNumber() == false) {
				sign = true; // Z�hler oder Nenner
			}
			if (fatherType == Node.TYPE_POWER && CursorPosition == Node.POSITION_RIGHT) {
				sign = true; // Vorzeichen in Exponenten erlauben
			}
			// Limes, diverse Typen, Vorzeichen bei x -> ... erlauben
			if ((fatherType == Node.TYPE_TO_A || fatherType == Node.TYPE_FROM_LEFT_TO_A
					|| fatherType == Node.TYPE_FROM_RIGHT_TO_A) && CursorPosition == Node.POSITION_RIGHT) {
				sign = true;
			}
			// Integral von -a bis -b �ber -<Term> dx erlauben
			if (fatherType == Node.TYPE_INTEGRAL_FROM_TO
					|| (fatherType == Node.TYPE_INTEGRAL_ARGUMENT && Cursor.getPosition() == Node.POSITION_LEFT)) {
				sign = true;
			}
		}
		if (sign == true) {
			Cursor.setType(Node.TYPE_ZERO);
			Cursor.setContent("zero");
			Node plusminusNode = new Node(plusminus, Node.KIND_BINARY_NODE, Node.TYPE_PLUSMINUS);
			Node space = new Node();
			exp.InsertBNodeOverCursor(plusminusNode, space);
			done = true;
		}
		if (done) {
			setDirty(true);
		} else {
			exp.setCursor(OldCursor);
		}
		return done;
	} // Ende von "Plus oder Minus wurde eingegeben"

	private boolean handleFraction() {
		// ein Bruch wurde eingegeben

		boolean append = false;
		if (type == Node.TYPE_NUMBER || type == Node.TYPE_SPACE) {
			append = true;
		}
		if (Cursor.isInMixedNumber() == true) {
			append = false;
		}
		if (Father.getType() == Node.TYPE_REALNUMBER) {
			append = false;
		}

		if (exp.isUnitAllowed() && append == false) {
			// Nur in vorher ausgeschlossenen F�llen Unit-Fraction als Faktor
			// hinzuf�gen.
			if (Cursor.getType() == Node.TYPE_ALMOSTUNIT && Cursor.getFather().getType() == Node.TYPE_TIMES) {
				// z.B. 5 -> 5 km/h
				Node nominator = exp.getCursorNode();
				nominator.setType(Node.TYPE_SPACE);
				nominator.setContent(Node.SpaceContent);
				Node denominator = new Node();
				Node fraction = new Node("unitfrac", Node.KIND_BINARY_NODE, Node.TYPE_FRACTION);
				exp.InsertBNodeOverCursor(fraction, denominator);
				exp.setCursor(nominator);
			} else {
				if (Cursor.getFather().getType() == Node.TYPE_REALNUMBER) {
					// Cursor eins hoch
					exp.setCursor(Cursor.getFather());
					Cursor = exp.getCursorNode(); // abbreviation
				}
				if (Cursor.getType() == Node.TYPE_POWER && Cursor.getPosition() == Node.POSITION_RIGHT
						&& Cursor.getFather().getType() == Node.TYPE_TIMES) {
					// Cursor eins hoch
					exp.setCursor(Cursor.getFather());
					Cursor = exp.getCursorNode();
				}
				Node times = new Node("", Node.KIND_BINARY_NODE, Node.TYPE_TIMES); // unsichtbar
				Node nominator = new Node();
				exp.InsertBNodeOverCursor(times, nominator);
				exp.setCursor(nominator);
				Node denominator = new Node();
				Node fraction = new Node("unitfrac", Node.KIND_BINARY_NODE, Node.TYPE_FRACTION);
				exp.InsertBNodeOverCursor(fraction, denominator);
				exp.setCursor(nominator);
			}
			append = true;
		} else {
			String udm = Par.getUnitDetectionMode();
			if (append == true) {
				// das erste Einf�gen ist nur bei gemischter Zahl n�tig
				if (type == Node.TYPE_NUMBER) {
					if (udm.equals(ExpressionPainterParameterManager.UNITDETECTIONMODE_ASK)) {
						String msg = Localizer.getString("JOP_fraction_is_unit");
						String title = Localizer.getString("JOP_formula_applet");
						DialogHelper.YesNoDialog(msg, title, "UDM_YES", "UDM_NO");
						int answer = DialogHelper.ANSWER_YES; // TODO yesno_dialog
						if (answer == DialogHelper.ANSWER_YES) {
							udm = ExpressionPainterParameterManager.UNITDETECTIONMODE_PHYSICS;
						} else {
							udm = ExpressionPainterParameterManager.UNITDETECTIONMODE_MATH;
						}
					}
					if (udm.equals(ExpressionPainterParameterManager.UNITDETECTIONMODE_MATH)) {
						Node numerator = new Node();
						Node mixednumber = new Node("plus", Node.KIND_BINARY_NODE, Node.TYPE_MIXEDNUMBER);
						exp.InsertBNodeOverCursor(mixednumber, numerator);
					} else {
						if (udm.equals(ExpressionPainterParameterManager.UNITDETECTIONMODE_PHYSICS)) {
							Node rightFactor = new Node();
							Node times = new Node("", Node.KIND_BINARY_NODE, Node.TYPE_TIMES);
							exp.InsertBNodeOverCursor(times, rightFactor);
						}
					}
				} // end of type == Node.TYPE_NUMBER
			} // end of if (append == true)

			Node temp = exp.getCursorNode(); // Z�hler ist momentan Cursor,
												// merken

			Node denominator = new Node();
			Node rz2 = new Node("frac", Node.KIND_BINARY_NODE, Node.TYPE_FRACTION);
			if (udm.equals(ExpressionPainterParameterManager.UNITDETECTIONMODE_PHYSICS) && type == Node.TYPE_NUMBER) {
				rz2.setContent("unitfrac");
			}

			exp.InsertBNodeOverCursor(rz2, denominator);
			// Nenner ist nun Cursor
			// Cursor = temp; //Z�hler soll Cursor sein
			exp.setCursor(temp);
		}
		return append;
	}

	private boolean handleTimesDivided(String timesdivided) {
		// Mal oder geteilt durch wurde eingegeben 16.8.2001

		boolean append = false;
		boolean rightFactor = false;
		// 1. Bedingung: Cursortyp muss passen
		if (type == Node.TYPE_NUMBER || type == Node.TYPE_VARIABLE_AZ || type == Node.TYPE_PERCENT) {
			append = true;
		}
		if (type == Node.TYPE_BRACKET || type == Node.TYPE_LOG) {
			append = true;
		}

		// if (key.equals("*") && type == Node.TYPE_SPACE && Father.getType() ==
		// Node.TYPE_UNIT &&
		// Cursor.getPosition() == Node.POSITION_RIGHT) {
		// if (Father.getLeftChild().getContent().equals("m")) {
		// // milli in Meter uminterpretieren
		// Father.getLeftChild().setContent("");
		// Cursor.setContent("m");
		// Cursor.setType(Node.TYPE_UNITNAME);
		// type = Cursor.getType();
		// }
		// }
		//
		if (type == Node.TYPE_UNIT) {
			// Cursor eins hochsetzen...
			// exp.setCursor(Father);
			// Cursor = exp.getCursorNode();
			// CursorPosition = Cursor.getPosition();
			// Father = Cursor.getFather();
			// type = Cursor.getType();
			append = true;
		}

		if (type == Node.TYPE_SQUAREROOT || type == Node.TYPE_HIGHER_ROOT) {
			append = true;
		}
		if (type == Node.TYPE_POWER || type == Node.TYPE_FRACTION || type == Node.TYPE_HIGHER_ROOT
				|| type == Node.TYPE_LOG || type == Node.TYPE_INDEX) {
			append = true;
		}
		if (Cursor.isInMixedNumber() == true) {
			append = false;
		}
		if (Father.getType() == Node.TYPE_PERIOD && Cursor.getPosition() == Node.POSITION_RIGHT) {
			// Cursor eins hochsetzen...
			exp.setCursor(Father);
			Cursor = exp.getCursorNode();
			CursorPosition = Cursor.getPosition();
			Father = Cursor.getFather();
			type = Cursor.getType();
		}
		if (Father.getType() == Node.TYPE_REALNUMBER && CursorPosition == Node.POSITION_LEFT) {
			append = false; // * nicht in Vorkomma-Teil einf�gen
		}
		if (Father.getType() == Node.TYPE_PERIOD) {
			append = false; // * nicht in Vorperiode/Nachperiode einf�gen
		}
		if (Father.getType() == Node.TYPE_POWER && Cursor.getPosition() == Node.POSITION_LEFT) {
			append = false; // * nicht in Basis einf�gen
		}

		if (append == true) {
			rightFactor = (Father.getType() == Node.TYPE_TIMES && Cursor.getPosition() == Node.POSITION_RIGHT);

			if (rightFactor && !timesdivided.equals("*")) {
				append = false; // dann doch nicht append, um z.B. ab:s zu
								// vermeiden
			}

			// Hier folgt ein St�ck verflixte Logik!
			if (Father.getType() == Node.TYPE_FRACTION && Cursor.getPosition() == Node.POSITION_RIGHT) { // Cursor
																											// ist
																											// Nenner
				rightFactor = false; // wider besseres Wissen!
			}

			if (Father.getType() == Node.TYPE_MIXEDNUMBER) {
				rightFactor = true;
			}

			if (type == Node.TYPE_BRACKET && Father.getType() == Node.TYPE_FUNCTION) {
				rightFactor = true;
			}

			if (type == Node.TYPE_BRACKET && Father.getType() == Node.TYPE_LOG) {
				if (Cursor.getPosition() == Node.POSITION_RIGHT) {
					rightFactor = true;
				}
			}

			// Spezialfall Kommazahl
			if (Father.getType() == Node.TYPE_REALNUMBER && CursorPosition == Node.POSITION_RIGHT) {
				append = true;
				rightFactor = true;
			}

			// 3% ->3*_% sperren, 3,5% -> 3,5*_% sperren
			if (Father.getType() == Node.TYPE_PERCENT) {
				append = false;
			}
			if (Father.getType() == Node.TYPE_REALNUMBER && Father.getFather().getType() == Node.TYPE_PERCENT) {
				append = false;
			}
		}

		if (append == true) {
			// Klammern-Automatik. Falls Cursor Klammer ist, au�er Kraft setzen
			// (z.B. bei sin(2x)).
			short t = Father.getType();
			if (((t == Node.TYPE_FUNCTION || t == Node.TYPE_LOG) && type != Node.TYPE_BRACKET)
					|| t == Node.TYPE_DIVIDED) {
				Node bra = new Node("(", Node.KIND_UNARY_NODE, Node.TYPE_BRACKET);
				exp.InsertUNodeOverCursor(bra);
			}

			Node space = new Node();
			Node times_divided = new Node("*", Node.KIND_BINARY_NODE, Node.TYPE_TIMES);
			if (timesdivided.equals(":")) {
				times_divided.setType(Node.TYPE_DIVIDED);
				times_divided.setContent(":");
			}
			// je nachdem, ob Cursor rechter Faktor ist...
			if (rightFactor == true) {
				exp.InsertBNodeBetweenFatherAndGrandpa(times_divided, space);
			} else {
				exp.InsertBNodeOverCursor(times_divided, space);
			}
		}
		// Ende von "Mal oder geteilt..."
		return true;
	}

	private boolean handleFunction(String functionName) {
		boolean done = false;
		if (functionName.toUpperCase().startsWith("VKBD_")) {
			functionName = functionName.substring(5).toLowerCase();
			exp.getCursorNode().setContent(Node.SpaceContent);
			exp.getCursorNode().setType(Node.TYPE_SPACE);
			Node function = new Node(functionName, Node.KIND_UNARY_NODE, Node.TYPE_FUNCTION);
			// InsertUNodeOverCursor fires an expressionEvent in gut04
			// causing setDirty(true)
			exp.InsertUNodeOverCursor(function);
		} else {
			if (functionName.length() >= 3) {
				execute("CMD-", "BACKSPACE");
			}
			exp.getCursorNode().setContent(Node.SpaceContent);
			exp.getCursorNode().setType(Node.TYPE_SPACE);
			Node function = new Node(functionName, Node.KIND_UNARY_NODE, Node.TYPE_FUNCTION);
			// InsertUNodeOverCursor fires an expressionEvent in gut04
			// causing setDirty(true)
			exp.InsertUNodeOverCursor(function);
		}
		done = true;
		setDirty(true); // necessary in gf06
		return done;
	}

	private boolean handleKey(String key) {
		DebugPanel.debugPrint("handleKey " + key, Par.getId());
		boolean done = false;
		if (key.equals("ENTER")) {
			GWT.log("KEY-ENTER");
			if (Par.isEditMode()) {
				FaEventProvider.fireFaEvent("EXPORT2WIKI");
			} else {
				testIfSolution();
			}
			done = true;
		} else if (key.equals("DEGREE")) {
			if (Par.getUnitDetectionMode().equals(ExpressionPainterParameterManager.UNITDETECTIONMODE_PHYSICS)) {
				handleVariablesAndOperators("\u00b0", true, false); // \u00b0 ?
			} else {
				if (type == Node.TYPE_SEXAGESIMAL) {
					done = false;
					SexagesimalNumber sgn = new SexagesimalNumber(Cursor.getContent());
					if (sgn.endsWithDegrees()) {
						sgn.setMinute(sgn.getDegree());
						sgn.setDegree(0);
						sgn.setDegreeDecimals(0);
						Cursor.setContent(sgn.getDMS());
						done = true;
					}
					if (done == false && sgn.endsWithMinutes()) {
						sgn.setSecond(sgn.getMinute());
						sgn.setMinute(0);
						Cursor.setContent(sgn.getDMS());
						done = true;
					}
					if (done == false && sgn.endsWithSeconds()) {
						sgn.setDegree(sgn.getSecond());
						sgn.setSecond(0);
						// DebugPanel.debugPrintln("DMS=" + sgn.getDMS(), 3);
						Cursor.setContent(sgn.getDMS());
						done = true;
					}
				}
				if (type == Node.TYPE_NUMBER && Cursor.isInMixedNumber() == false) {
					if (Cursor.getFather().getType() != Node.TYPE_REALNUMBER) {
						SexagesimalNumber sgn = new SexagesimalNumber(Cursor.getContent() + "\u00b0");
						Cursor.setType(Node.TYPE_SEXAGESIMAL);
						Cursor.setContent(sgn.getDMS());
					} else {
						Node father = Cursor.getFather();
						String real = father.getLeftChild().getContent() + father.getContent()
								+ father.getRightChild().getContent();
						// DebugPanel.debugPrintln("realcontent=" + real, 3);
						exp.ReplaceBNodeWithSpace(father);
						Cursor = exp.getCursorNode();
						Cursor.setContent(real + "\u00b0");
						Cursor.setType(Node.TYPE_SEXAGESIMAL);
					}
					setDirty(true);
				}
			}
		} // end of key.equals("DEGREE")

		if (key.equals("MINUTE")) {
			SexagesimalNumber sgn = new SexagesimalNumber();
			String temp = Cursor.getContent() + "'";
			boolean valid = false;
			if (sgn.isValid(temp)) {
				valid = true;
			} else {
				if (sgn.isValid(temp + "'")) { // temp wird nicht ver�ndert!
					valid = true;
				}
			}
			if (Cursor.getFather().getType() == Node.TYPE_REALNUMBER || Cursor.isInMixedNumber() == true) {
				valid = false;
			}
			if (valid) {
				if (sgn.isValid(temp)) {
					sgn.setDMS(temp);
					Cursor.setContent(sgn.getDMS());
					Cursor.setType(Node.TYPE_SEXAGESIMAL);
				} else { // z.B. 12� 23' 34'
					Cursor.setContent(temp);
					Cursor.setType(Node.TYPE_ALMOSTSEXAGESIMAL);
				}
				setDirty(true);
				done = true;
			}
		}

		if (key.equals("PERCENT") || key.equals("PERMIL") || key.equals("EURO")) {
			String content = "%";
			if (key.equals("PERMIL")) {
				content = Node.PERMIL;
			}
			if (key.equals("EURO")) {
				content = Node.EURO;
			}
			if (Father.getType() == Node.TYPE_REALNUMBER) {
				if (Father.getFather().getType() != Node.TYPE_PERCENT) { // 2,5%%
																			// vermeiden
					Node percent = new Node(content, Node.KIND_UNARY_NODE, Node.TYPE_PERCENT);
					exp.setCursor(Father);
					Cursor = exp.getCursorNode();
					exp.InsertUNodeOverCursor(percent);
					exp.setCursor(percent);
					Cursor = exp.getCursorNode();
				}
			} else {
				if (type == Node.TYPE_NUMBER) {
					if (Father.getType() != Node.TYPE_PERCENT) { // 2%%
																	// vermeiden
						Node percent = new Node(content, Node.KIND_UNARY_NODE, Node.TYPE_PERCENT);
						exp.InsertUNodeOverCursor(percent);
						exp.setCursor(percent);
						Cursor = exp.getCursorNode();
					}
				}
			}
			setDirty(true);
			done = true;
		}

		if (key.equals("NO_RESULT")) {
			String message = Localizer.getString("RCM_no_result");
			// exp.getCursorNode().setContent("geht nicht");
			exp.getCursorNode().setContent(message);
			exp.getCursorNode().setKind(Node.KIND_LEAF);
			exp.getCursorNode().setType(Node.TYPE_NO_RESULT);
			setDirty(true);
			done = true;
		}

		if (key.equals("GENERAL")) {
			String message = Localizer.getString("RCM_general");
			// exp.getCursorNode().setContent("allgemeing�ltig");
			exp.getCursorNode().setContent(message);
			exp.getCursorNode().setKind(Node.KIND_LEAF);
			exp.getCursorNode().setType(Node.TYPE_GENERAL);
			setDirty(true);
			done = true;
		}

		return done;
	}

	private boolean handleIndex() {
		boolean done = false;
		if (type == Node.TYPE_VARIABLE_AZ) {
			Node index = new Node("", Node.KIND_BINARY_NODE, Node.TYPE_INDEX);
			Node string = new Node("", Node.KIND_LEAF, Node.TYPE_STRING);
			exp.InsertBNodeOverCursor(index, string);
			done = true;
		}
		return done;
	}

	private boolean handleString(String mod, String cmd) {
		boolean done = false;
		if (mod.equals("CHAR-") || mod.equals("NUMBER-") || mod.equals("BRACKET-")) {
			if (!(cmd.startsWith("POINT") || cmd.startsWith("COMMA"))) {
				Cursor.setContent(Cursor.getContent() + cmd);
				setDirty(true);
				done = true;
			}
		}
		if (mod.equals("CTRL-") && cmd.equals("SPACE")) {
			Cursor.setContent(Cursor.getContent() + " ");
			setDirty(true);
			done = true;
		}
		if (mod.equals("KEY-") && cmd.equals("MINUTE")) {
			Cursor.setContent(Cursor.getContent() + "'");
			setDirty(true);
			done = true;
		}
		return done;
	}

	private boolean handleCut() {

		return false;
	}

	private boolean handleCopy() {
		String temp = exp.getRepresentationBelowNode(exp.getCursorNode());
		setCopyBuffer(temp);
		DebugPanel.debugPrintln("COPY: " + temp, 3);
		return true;
	}

	private boolean handlePaste() {
		String temp = getCopyBuffer();
		boolean done = false;
		if (!temp.equals("")) {
			Node cursor = exp.getCursorNode();
			Node father = cursor.getFather();
			if (cursor.getType() == Node.TYPE_SPACE) {
				Node newNode = Node.getNodeFromString(temp);
				if (cursor.getPosition() == Node.POSITION_LEFT) {
					father.setLeftChild(newNode);
					newNode.setPosition(Node.POSITION_LEFT);
				}
				if (cursor.getPosition() == Node.POSITION_MIDDLE) {
					father.setMiddleChild(newNode);
					newNode.setPosition(Node.POSITION_MIDDLE);
				}
				if (cursor.getPosition() == Node.POSITION_RIGHT) {
					father.setRightChild(newNode);
					newNode.setPosition(Node.POSITION_RIGHT);
				}
				newNode.setFather(father);
				setDirty(true);
				done = true;
			}
		}
		return done;
	}

	private boolean handleCursor(String direction) {
		boolean done = false;
		if (direction.equals("LEFT")) {
			exp.MoveCursorLeft();
			setDirty(true);
			done = true;
		}
		if (direction.equals("RIGHT")) {
			exp.MoveCursorRight();
			setDirty(true);
			done = true;
		}
		if (direction.equals("UP")) { // ein Exponent wird eingegeben
			if (type == Node.TYPE_STRING && ftype == Node.TYPE_INDEX) {
				exp.MoveCursorRight();
				done = true;
			}

			boolean append = false;
			if (type == Node.TYPE_NUMBER || type == Node.TYPE_VARIABLE_AZ) {
				append = true;
			}
			if (type == Node.TYPE_BRACKET) {
				append = true;
			}
			if (type == Node.TYPE_INDEX) {
				append = true;
			}
			if (type == Node.TYPE_UNIT) {
				append = true;
				/**
				 * @todo check if next line is necessary
				 */
				PhysicalUnit u = new PhysicalUnit(Cursor.getContent());
				if (u.hasFactors()) {
					String h = Cursor.getContent();
					String left = h.substring(0, h.length() - 1);
					String right = h.substring(h.length() - 1);
					// DebugPanel.debugPrintln("left=" + left, 3);
					// DebugPanel.debugPrintln("right=" + right, 3);
					// DebugPanel.debugPrintln("leftIsUnit=" + exp.isUnit(left),
					// 3);
					// DebugPanel.debugPrintln("rightIsUnit=" +
					// exp.isUnit(right), 3);
					PhysicalUnit u_left = new PhysicalUnit(left);
					PhysicalUnit u_right = new PhysicalUnit(right);
					if (u_left.isUnit() && u_right.isUnit()) {
						Cursor.setContent(left);
						Node times = new Node("", Node.KIND_BINARY_NODE, Node.TYPE_TIMES);
						Node rightFactor = new Node(right, Node.KIND_LEAF, Node.TYPE_UNIT);
						exp.InsertBNodeOverCursor(times, rightFactor);
					} else {
						// this should not happen - just for sure
						Node brackets = new Node("(", Node.KIND_UNARY_NODE, Node.TYPE_BRACKET);
						exp.InsertUNodeOverCursor(brackets);
						exp.setCursor(brackets);
					}
				}
			}
			if (Cursor.isInMixedNumber() == true) {
				append = false;
			}
			if (Father.getType() == Node.TYPE_REALNUMBER && CursorPosition == Node.POSITION_LEFT) {
				// avoid 3,7 -> 3^4 ,7
				append = false;
			}
			if (Father.getType() == Node.TYPE_REALNUMBER && CursorPosition == Node.POSITION_RIGHT) {
				// avoid 3,7 -> 3, 7^4
				exp.setCursor(Father);
			}
			if (Father.getType() == Node.TYPE_POWER && CursorPosition == Node.POSITION_LEFT) {
				append = false;
			}
			if (Father.getType() == Node.TYPE_INDEX && CursorPosition == Node.POSITION_LEFT) {
				exp.setCursor(Father);
				// append = false;
			}
			if (type == Node.TYPE_SPACE && Father.getType() == Node.TYPE_POWER
					&& Cursor.getPosition() == Node.POSITION_RIGHT) {
				if (Father.getFather().getType() == Node.TYPE_FRACTION && Father.getPosition() == Node.POSITION_RIGHT) {
					// Potenz steht im Nenner, Exponent ist Space
					exp.DeleteBNode(Father);
					exp.MoveCursorLeft(); // Cursor nach links
					exp.MoveCursorLeft(); // Cursor nach links
					done = true;
				} else {
					// Exponent ist space, eventuell aus Versehen eingegeben.
					// key = "BS"; //bewirkt L�schen des Exponenten
					handleBackspace(); // bewirkt L�schen des Exponenten
					done = true;
				}
			}
			if (append == true) {
				Node exponent = new Node();
				Node power = new Node("^", Node.KIND_BINARY_NODE, Node.TYPE_POWER);
				exp.InsertBNodeOverCursor(power, exponent);
				done = true;
			}

			// Integral. "from" enth�lt Space. Cursor umlenken nach rechts statt
			// oben
			if (Father.getType() == Node.TYPE_INTEGRAL_FROM_TO && type == Node.TYPE_SPACE
					&& Cursor.getPosition() == Node.POSITION_LEFT) {
				exp.MoveCursorRight();
				done = true;
			}

		} // Ende von "UP" bzw. Exponent

		if (direction.equals("DOWN")) {
			Node oldPosition = exp.getCursorNode();
			boolean move = true, stop = false;
			do {
				move = exp.MoveCursorRight();
				if (exp.getCursorNode().getFather().getType() == Node.TYPE_FRACTION
						&& exp.getCursorNode().getPosition() == Node.POSITION_RIGHT) {
					stop = true;
				}
				if (exp.getCursorNode().getType() == Node.TYPE_POWER) {
					stop = true;
				}
			} while (move == true && stop == false);
			if (move == false) {
				exp.setCursor(oldPosition);
			} else {
				setDirty(true);
				done = true;
			}
			if (Father.getType() == Node.TYPE_INTEGRAL_FROM_TO
					&& (type == Node.TYPE_SPACE || type == Node.TYPE_VARIABLE_AZ)
					&& Cursor.getPosition() == Node.POSITION_RIGHT) {
				// "to" enth�lt Space oder Variable. Cursor umlenken nach links
				// statt unten
				exp.MoveCursorLeft();
				done = true;
			}
		}
		if (done) {
			Par.setCursorDoubleClicked(false);
		}
		return done;
	}

	// // TODO showVersion
	// void showVersion_alt(){
	// final DialogBox dialogbox = new DialogBox(true, true); // autoHide=true
	// // modal=true
	// // dialogbox.setStyleName("demo-DialogBox");
	// VerticalPanel DialogBoxContents = new VerticalPanel();
	// dialogbox.setText("Versions-Info");
	// HTML message = new HTML(VersionProvider.getVersion());
	// // message.setStyleName("demo-DialogBox-message");
	// ClickHandler listener = new ClickHandler() {
	// public void onClick(ClickEvent ev) {
	// dialogbox.hide();
	// }
	// };
	// Button button = new Button("Ok", listener);
	// SimplePanel holder = new SimplePanel();
	// holder.add(button);
	// // holder.setStyleName("demo-DialogBox-footer");
	// DialogBoxContents.add(message);
	// DialogBoxContents.add(holder);
	// dialogbox.setWidget(DialogBoxContents);
	// dialogbox.setPopupPositionAndShow(new DialogBox.PositionCallback() {
	// public void setPosition(int offsetWidth, int offsetHeight) {
	// int left = (Window.getClientWidth() - offsetWidth) / 2;
	// int top = (Window.getClientHeight() - offsetHeight) / 2;
	// dialogbox.setPopupPosition(left, top);
	// }
	// });
	// // JOptionPane.showMessageDialog(this, getInfo(),
	// // Localizer.getString("JOP_FormelApplet"),
	// // JOptionPane.INFORMATION_MESSAGE);
	// }

	void showVersion() {
		DialogHelper.showMessage(VersionProvider.getVersion(), "Versions-Info");
		// DialogHelper.showMessage(getSolution().getRepresentation(),
		// "Solution: Representation");

		// DialogHelper.showMessage(ExpressionPainterParameterManager.getInfo(),
		// "Versions-Info");
	}

	public void testIfSolution() {
		if (!Par.isEditMode()) {
			double precision = Par.getPrecision();
			DefinitionSet defSet = Par.getDefinitionSet();

			if (!getExpression().isEmpty()) {
				DebugPanel.debugPrintln("precision=" + String.valueOf(precision), 3);
				boolean isSolution = false;

//				if (Par.getCombiPanelMode() == ExpressionPainterParameterManager.MODE_Output) {
				if (Bridge.isInactive(getId())) {
					isSolution = EquationChecker.isEqual(getExpression(), getSolution(), precision, defSet);
				}
//				if (Par.getCombiPanelMode() == ExpressionPainterParameterManager.MODE_InputActive) {
					if (Bridge.isActive(getId())) {
					Expression subBoundary = getExpression().getExpressionUnderBoundary();
					isSolution = EquationChecker.isEqual(subBoundary, getSolution(), precision, defSet);
				}
//					if (Par.getCombiPanelMode() == ExpressionPainterParameterManager.MODE_InputInactive) {
					if (Bridge.isInactive(getId())) {
					Node Equation = getExpression().getRoot().getMiddleChild();
					if (Equation.getType() == Node.TYPE_EQUATION) {
						Expression temp = getExpression().klone();
						temp.deleteBoundary();
						temp.setCursor(temp.getRoot().getMiddleChild().getLeftChild());
						temp.insertBoundaryOverCursor();
						Expression leftSide = temp.getExpressionUnderBoundary();
						temp = getExpression().klone();
						temp.deleteBoundary();
						temp.setCursor(temp.getRoot().getMiddleChild().getRightChild());
						temp.insertBoundaryOverCursor();
						Expression rightSide = temp.getExpressionUnderBoundary();
						isSolution = EquationChecker.isEqual(leftSide, rightSide, precision, defSet);
					}
				}
				if (isSolution) {
					try {
						String condition = Par.getParameterString("condition");
						DebugPanel.debugPrintln(condition, 3);
						if (condition.equals("<not found>") || condition.equals("<empty>")) {
							Bridge.setOk(getId());
							FaEventProvider.fireFaEvent("PAINT");
//							Par.setOK();
						} else {
							Expression ex = getExpression().klone();
							if (Par.getCombiPanelMode() == ExpressionPainterParameterManager.CPMODE_term_solution
									|| Par.getCombiPanelMode() == ExpressionPainterParameterManager.CPMODE_auto) {
								ex = ex.getExpressionUnderBoundary();
							}
							boolean accepted = ex.isKindOf(condition);
							DebugPanel.debugPrintln(condition + " accepted= " + accepted, 3);
							if (accepted) {
								Bridge.setOk(getId());
								FaEventProvider.fireFaEvent("PAINT");
//								Par.setOK();
							} else {
								if (condition.startsWith("unit:")) {
									condition = "demanded_unit";
								} else {
									condition = condition.replaceAll("_", "");
								}
								String message = Localizer.getString("no_" + condition);
								DialogHelper.showMessage(message);
								Bridge.setWrong(getId());
//								Par.setWrong();
							}
						}
					} catch (Exception ex) {
						DebugPanel.debugPrint("Fehler in Methode testIfSolution", 0);
						DebugPanel.debugPrintln(ex.toString(), 0);
					}
				} else {
					Bridge.setWrong(getId());
					FaEventProvider.fireFaEvent("PAINT");
//					Par.setWrong();
					String error = EquationChecker.getError();
					GWT.log("error=" + error);
					if (!error.equals("")) {
						DialogHelper.showMessage(error);
//						showAppletMessage(error);
					}
				}
			} else {
				DebugPanel.debugPrintln("Term leer", 3);
			}
		}
	}
}
