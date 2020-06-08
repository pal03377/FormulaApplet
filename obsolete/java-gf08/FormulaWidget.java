package gut.client;

import com.google.gwt.core.shared.GWT;

/**
 * @version gf08 24.11 (30. August 2016)
 * @author Rudolf Grossmann

 *         <p>
 *         replaces formula applet
 *         </p>
 */

import com.google.gwt.dom.client.Element;
import com.google.gwt.user.client.ui.HTML;
import com.google.gwt.user.client.ui.HasHorizontalAlignment;
import com.google.gwt.user.client.ui.HasVerticalAlignment;
import com.google.gwt.user.client.ui.HorizontalPanel;
import com.google.gwt.user.client.ui.RootPanel;
import com.google.gwt.user.client.ui.SimplePanel;

public class FormulaWidget extends HorizontalPanel implements FaEventListener {
	private String _id = "<unknown>";

	private SimplePanel focusw = new SimplePanel();

	// private KeyManager myKeyManager = new KeyManager();
	// KeyManager now used only in Gf08.java as bodyKeyHandler

	private CommandManager myCommandManager;
	private HTML ok_wrong = new HTML();

	public FormulaWidget(Element node) {
		_id = node.getId();
		init(node);
		Bridge.log("FormulaWidget created: " + this.toString());
	}

	private void init(Element node) {
		Bridge.log("FormulaWidget.init() START");
		GWT.log("Wo wird dies hier ausgegeben?");
		// CommandEventProvider.addCommandListener(this);
		FaEventProvider.addFaEventListener(this);
		myCommandManager = new CommandManager(_id);
		// myKeyManager.setId(_id);

		focusw.addStyleName("focuswidget");

		setCellHorizontalAlignment(focusw, HasHorizontalAlignment.ALIGN_LEFT);
		setCellHorizontalAlignment(ok_wrong, HasHorizontalAlignment.ALIGN_LEFT);
		setCellVerticalAlignment(ok_wrong, HasVerticalAlignment.ALIGN_MIDDLE);
		add(focusw);
		add(ok_wrong);
		Bridge.log("CSS_zoom in FormulaWidget.init()");
		Bridge.CSS_zoom(myCommandManager.getPar().getFontsize());
		myCommandManager.testIfSolution();
		if (RootPanel.get("flip-testedit") != null) {
			getPar().setQuickEditApplet(true);
		}
		Bridge.log("isQuickEditApplet=" + getPar().isQuickEditApplet());
		Bridge.log("FormulaWidget.init() END");
	}

	protected void finalize() throws Throwable {
		try {
			// CommandEventProvider.removeCommandListener(this);
			FaEventProvider.removeFaEventListener(this);
			System.out.println("FormulaWidget finalized: " + this.toString());
		} finally {
			super.finalize();
		}
	}

	public void paint() {
		Bridge.log("paint " + _id);
		//TODO Delete obsolete code
//		String html5 = "<empty>";
		StringBuffer NodeList = new StringBuffer();

		//TODO Delete obsolete code
//		if (myCommandManager.isShowingAppletMessage()) {
//			html5 = "<em>";
//			html5 += myCommandManager.getAppletMessage();
//			html5 += "</em>";
//			getElement().setInnerHTML(html5);
//		} else {
			String mathml = MathML_Helper2.getMathML(getId(), myCommandManager.getExpression().getRoot(), NodeList);
			focusw.getElement().setInnerHTML(mathml);
			// handle cursor
			if (getPar().isCursorVisible()) {
				int cursorNumber = myCommandManager.getExpression().getCursorNode().getNumber();
				if (getPar().isCursorDoubleClicked()) {
					Bridge.setCursor2clicked(_id + "-" + cursorNumber);
				} else {
					Bridge.setCursor(_id + "-" + cursorNumber);
				}
			}
//		}

		Bridge.winAdjustRadics();
		Bridge.make_clickable();
		ok_wrong.setHTML("&nbsp;");
		// if (getPar().getMode() == ExpressionPainterParameterManager.MODE_OK)
		// {
		if (Bridge.isOk(getId())) {
			ok_wrong.setHTML("<div class='mod_ok'></div>");
		}
		// if (getPar().getMode() ==
		// ExpressionPainterParameterManager.MODE_Wrong) {
		if (Bridge.isWrong(getId())) {
			ok_wrong.setHTML("<div class='mod_wrong'></div>");
		}
		myCommandManager.setDirty(false);
		try {
			RootPanel.get("expressiontree").clear();
			RootPanel.get("expressiontree")
					.add(ExpressionTreeHelper.getExpressionTree(myCommandManager.getExpression()));
		} catch (Exception e) {
			// TODO: handle exception
		}
		Bridge.log("paint END " + _id);
	} // END paint()

	public String getId() {
		return _id;
	}

	// used by MenuManager
	public ExpressionPainterParameterManager getPar() {
		return myCommandManager.getPar();
	}

	// used by ZipConverter
	public CommandManager getCommandManager() {
		return myCommandManager;
	}

	public void setEditMode(boolean edit) {
		// change parameter edit from boolean to String type
		if (edit) {
			Bridge.winSetEditMode("true");
		} else {
			Bridge.winSetEditMode("false");
		}
		// some legacy stuff
		// String h = getCombiString(false);
		String h = getCombiString(true);
		getPar()._setEditMode(edit); // if edit = true: setInputActive()
		boolean noTermButSolution = ((!(h.startsWith("ZIP-CM") || h.startsWith("B64-CM")))
				&& (getPar().getCombiPanelMode() == ExpressionPainterParameterManager.CPMODE_output));
		setCombiString(h, noTermButSolution);
	}

	/**
	 * set expression exp and solution considering isEditMode()
	 * 
	 * @param s
	 *            combiString formed like ZIP-...
	 * @param noTermButSolution
	 *            true if no term but solution
	 */
	public void setCombiString(String s, boolean noTermButSolution) {
		// System.out.println("setCombiString with "+s);
		Expression exp = myCommandManager.getExpression(); // abbreviation
		Expression solution = myCommandManager.getSolution(); // abbreviation
		try {
			boolean mobile = s.startsWith("B64-");
			if (mobile) {
				if (s.startsWith("B64-CM0-")) {
					getPar().setCombiPanelMode(ExpressionPainterParameterManager.CPMODE_input);
					myCommandManager.getExpression().setFromZipString(s.substring(8), true);
					myCommandManager.setSolution(myCommandManager.getExpression().klone());
					myCommandManager.setExpression(new Expression());
					exp = myCommandManager.getExpression(); // ugly sync
					Bridge.setActive(getId());
					// getPar().setInputActive();
					// GWT.log("expression:
					// "+myCommandManager.getExpression().getDumpString());
					// GWT.log("solution:
					// "+myCommandManager.getSolution().getDumpString());
				} else if (s.startsWith("B64-CM1-")) {
					getPar().setCombiPanelMode(ExpressionPainterParameterManager.CPMODE_term_solution);
					String temp = s.substring(8);
					int posOfSeparator = temp.indexOf("-");
					String left_part = temp.substring(0, posOfSeparator);
					String right_part = temp.substring(posOfSeparator + 1);
					exp.setFromZipString(left_part, true);
					solution.setFromZipString(right_part, true);
					// erase underneath boundary just for sure
					if (exp.hasBoundary()) {
						exp = exp.getExpressionOverBoundary();
						exp.hasBoundary(); // boundary suchen
						Node c = exp.getBoundary().getMiddleChild();
						// DebugPanel.debugPrintln(c.getContent(), 3);
						exp.setCursor(c);
						// DebugPanel.debugCls();
						// DebugPanel.debugPrintln(exp.Expr2DumpString(), 3);
						Bridge.setActive(getId());
						// getPar().setInputActive();
						// GRO 2016-01-06:
						exp.setCursorMovementRestricted(true);
					} else {
						// without boundary: only output of equation
						getPar().setCombiPanelMode(ExpressionPainterParameterManager.CPMODE_output);
						Bridge.setOutput(getId());
						// getPar().setOutput();
						exp.setCursorMovementRestricted(true);
					}
				} else if (s.startsWith("B64-CM2-")) {
					getPar().setCombiPanelMode(ExpressionPainterParameterManager.CPMODE_auto);
					exp.setFromZipString(s.substring(8), true);
					if (exp.hasBoundary()) {
						Node c = exp.getBoundary().getMiddleChild();
						exp.setCursor(c);
						if (getPar().isEditMode()) {
							c.setContent(Node.InputFieldContent);
							c.setType(Node.TYPE_VARIABLE_AZ);
						}
					}
				} else if (s.startsWith("B64-CM3-")) {
					getPar().setCombiPanelMode(ExpressionPainterParameterManager.CPMODE_output);
					Bridge.setOutput(getId());
					// getPar().setOutput();
					exp.setFromZipString(s.substring(8), true);
					exp.setDefaultCursorMovementRestrictedIfNoBoundary(true);
					exp.setCursorMovementRestricted(true);
				} else {

				} // End of no ZIP-CM1, no ZIP-CM2-
					// that's it - if no edit mode!

				// If edit mode, do a few corrections:
				if (getPar().isEditMode()) { // replaces gut03:
					// FasEditor.fas2applet()
					if (getPar().getCombiPanelMode() == ExpressionPainterParameterManager.CPMODE_input) {
						myCommandManager.setExpression(myCommandManager.getSolution());
					}
					if (getPar().getCombiPanelMode() == ExpressionPainterParameterManager.CPMODE_term_solution) {
						myCommandManager.getExpression().insertSolution(myCommandManager.getSolution());
					}
				}
			} else {
				// no B64-...
				// representation string?

				// in gf06 version ObjectConverter.ZipString2String is a dummy
				// so setFromZipString(s, false) is identical to
				// setFromRepresentation(s)
				myCommandManager.getExpression().setFromZipString(s.substring(8), false);
			}
			// Update BoundaryExists flag - necessary for representation="[..."
			// Not necessary for term="B64..."
			myCommandManager.getExpression().setBoundaryExists(myCommandManager.getExpression().hasBoundary());
			myCommandManager.setDirty(true);
		} catch (Exception ex) {
			DebugPanel.debugPrint(ex.getLocalizedMessage(), _id);
		}
	}

	/**
	 * get combiString formed like ZIP-... from expression exp and solution
	 * considering isEditMode() This method is placed inside EP_InitManager
	 * class in the gf04 (classic) version.
	 * 
	 * @param mobile
	 *            true if CombiString should be in "mobile style" B64-CMx-...
	 *            used by JavaScript/HTML5 GWT version of "applet"
	 * 
	 * @return CombiString of kind B64-CMx-... or ZIP-CMx-...
	 */

	public String getCombiString(boolean mobile) {
		// gf04: see EP_InitManager
		// replaces Expression2Zip, which replaced applet2fas
		Expression exp = myCommandManager.getExpression(); // abbreviation
		Expression solution = myCommandManager.getSolution(); // abbreviation

		String ret = "<error>";
		int cp_mode = getPar().getCombiPanelMode();
		if (cp_mode == ExpressionPainterParameterManager.CPMODE_input) {
			if (mobile) {
				ret = "B64-CM0-";
			} else {
				ret = "ZIP-CM0-";
			}
			if (getPar().isEditMode()) {
				ret += exp.getZipString(mobile);
			} else {
				ret += solution.getZipString(mobile);
			}
		} else if (cp_mode == ExpressionPainterParameterManager.CPMODE_term_solution) {
			if (mobile) {
				ret = "B64-CM1-";
			} else {
				ret = "ZIP-CM1-";
			}
			ret += exp.getExpressionOverBoundary().getZipString(mobile);
			ret += "-";
			if (getPar().isEditMode()) {
				ret += exp.getExpressionUnderBoundary().getZipString(mobile);
			} else {
				ret += solution.getZipString(mobile);
			}

		} else if (cp_mode == ExpressionPainterParameterManager.CPMODE_auto) {
			if (mobile) {
				ret = "B64-CM2-";
			} else {
				ret = "ZIP-CM2-";
			}
			ret += exp.getExpressionOverBoundary().getZipString(mobile);
		} else if (cp_mode == ExpressionPainterParameterManager.CPMODE_output) {
			if (mobile) {
				ret = "B64-CM3-";
			} else {
				ret = "ZIP-CM3-";
			}
			ret += exp.getZipString(mobile);
		}
		return ret;
	}

	public String getWikiText() {
		// ExpressionPainterParameterManager Par = getPar();
		String s = "&lt;formelapplet usegf06=\"true\" ";
		// Integer.toString() -> String.valueOf()
		s = s.concat("width=\"" + String.valueOf(getPar().getBoundedWidth()) + "\" ");
		s = s.concat("height=\"" + String.valueOf(getPar().getBoundedHeight()) + "\" ");

		// export colors if not default
		for (int index = 0; index < ExpressionPainterParameterManager.theColors.length; ++index) {
			String LongColorName = ExpressionPainterParameterManager.theColors[index] + "Color";
			String defaultValue = getPar().getDefaultParameterString(LongColorName);
			// TODO use fetchStringParameter instead of defaultValue
			// String hexColor = getPar().fetchStringParameter(LongColorName);
			String hexColor = defaultValue;
			if (!getPar().isDefault(LongColorName)) {
				s = s.concat(LongColorName + "=\"" + hexColor + "\" ");
			}
		}
		String h = "unitmode=\"math\" ";
		if (getPar().getUnitDetectionMode().equals(ExpressionPainterParameterManager.UNITDETECTIONMODE_ASK)) {
			h = "unitmode=\"ask\" ";
		}
		if (getPar().getUnitDetectionMode().equals(ExpressionPainterParameterManager.UNITDETECTIONMODE_PHYSICS)) {
			h = "unitmode=\"physics\" ";
		}
		s = s.concat(h);
		s = s.concat("term=\"" + getCombiString(true) + "\" ");
		s = s.concat("/&gt;\r\n");
		return s;
	}

	@Override
	public void faEventReceived(FaEvent ev) {
		String kind = ev.getKind();
		if (Bridge.isWrong(getId())) {
			if (kind.startsWith("CMD")) {
				String cmd = ev.getCommand();
				if (cmd.startsWith("PAINT")) {
					paint();
				}
			}
		}
		if (Bridge.isOk(getId())) {
			if (kind.startsWith("CMD")) {
				String cmd = ev.getCommand();
				if (cmd.startsWith("PAINT")) {
					paint();
				}
			}
		}

		// if (getPar().hasFocusID()) {
		if (Bridge.isActive(getId())) {
			if (kind.startsWith("CMD")) {
				String cmd = ev.getCommand();
				if (cmd.startsWith("PAINT")) {
					paint();
				}
				if (cmd.startsWith("EDIT")) {
					GWT.log("FormulaWidget: EDIT " + getId());
					addStyleName("editmode");
					setEditMode(true);
					myCommandManager.getExpression().setCursorMovementRestricted(false);
					Bridge.make_clickable();

				}
				if (cmd.startsWith("TEST")) {
					GWT.log("FormulaWidget: TEST " + getId());
					removeStyleName("editmode");
					setEditMode(false);
					myCommandManager.getExpression().setCursorMovementRestricted(true);
					Bridge.make_clickable();
				}

				if (cmd.startsWith("ZOOM_IN")) {
					int new_fontsize = (int) (myCommandManager.getPar().getFontsize() * 1.25);
					myCommandManager.getPar().setFontsize(new_fontsize);
					Bridge.CSS_zoom(new_fontsize);
				}
				if (cmd.startsWith("ZOOM_OUT")) {
					int new_fontsize = (int) (myCommandManager.getPar().getFontsize() * 0.8);
					if (new_fontsize >= myCommandManager.getPar().getMinFontsize()) {
						myCommandManager.getPar().setFontsize(new_fontsize);
						Bridge.CSS_zoom(new_fontsize);
					}
				}
				if (cmd.startsWith("EXPORT2WIKI")) {
					DebugPanel.debugCls();
					DebugPanel.debugPrint("export to wiki", _id);
					String wikitext = getWikiText();
					DebugPanel.debugPrint(wikitext, _id);
					String myHTML = "<form><div><textarea name=\"test\" style=\"width: 100%;\">" + wikitext
							+ "</textarea></div></form>";
					DialogHelper.showMessage(myHTML);
				}
				if (cmd.startsWith("EXPORT_B64")) {
					DialogHelper.showB64(getCombiString(true));
				}
			}
		}

		if (kind.toUpperCase().startsWith("TAP")) {
			String combined_id = ev.getCommand();
//			Bridge.log("combined_id=" + combined_id);
			int position = combined_id.indexOf("-");
			String identifier = combined_id.substring(0, position).toLowerCase();
			String num = combined_id.substring(position + 1);
//			Bridge.log("FaEvent received id=" + identifier + " number=" + num + " event.type=" + kind);
			if (getId().equalsIgnoreCase(identifier)) {
				if (!Bridge.isOutput(getId())) {
					int number = Integer.parseInt(num);
					Expression exp = myCommandManager.getExpression();
					Node MouseNode = exp.getNodeByNumber(number);
					// do not invoke paint()!
					if (kind.startsWith("TAP2")) {
						getPar().setCursorDoubleClicked(true); // why?
						// Bridge.vkbd_on();
						Bridge.vkbd_toggle();
					} else {
						Bridge.setCursor(_id + "-" + MouseNode.getNumber());
					}
					// experimental look and feel
					if (kind.startsWith("TAPHOLD")) {
						Bridge.vkbd_toggle();
					}
					exp.setCursor(MouseNode);

					getPar().setCursorMode(ExpressionPainterParameterManager.CU_LINE);
					Bridge.setActive(getId());
				}
				// getPar().setFocusId(getId());
				// getPar().setInputActive();
				// evokes setDirty(true) which evokes paint()
			}
		}
	}
}
