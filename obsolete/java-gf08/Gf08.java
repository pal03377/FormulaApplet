package gut.client;

/**
 * @version gf08 24.11 (30. August 2016)
 * @author Rudolf Grossmann
 *         <p>
 *         called by javaScript bootstrap loader gf08.nocache.js
 *         </p>
 */

import com.google.gwt.core.client.EntryPoint;
import com.google.gwt.dom.client.Element;
import com.google.gwt.dom.client.NodeList;
import com.google.gwt.event.dom.client.KeyDownEvent;
import com.google.gwt.event.dom.client.KeyPressEvent;
import com.google.gwt.user.client.Window;
import com.google.gwt.user.client.ui.RootPanel;
import gut.client.DebugPanel;

/**
 * Entry point classes define <code>onModuleLoad()</code>.
 * 
 * @version gf08 24.11 (30. August 2016)
 */

public class Gf08 implements EntryPoint {

	/**
	 * This is the entry point method.
	 */
	final public static String CRLF = "\r\n";
	private KeyManager bodyKeyManager = new KeyManager();

	// modal=false
	// TODO get rid of unused
	@SuppressWarnings("unused")
	public void onModuleLoad() {
		Bridge.log("onModuleLoad START");
		RootPanel.get().addDomHandler(bodyKeyManager, KeyDownEvent.getType());
		RootPanel.get().addDomHandler(bodyKeyManager, KeyPressEvent.getType());
		boolean createMenu = false;
		boolean isDebug = false;

		try {
			String hostName = Window.Location.getHostName();
			Bridge.log("hostName=" + hostName);
			if (hostName.startsWith("127") || hostName.startsWith("192")) {
				isDebug = true;
			}
		} catch (Exception e) {
			Bridge.log(e.toString());
		}
		NodeList<Element> bodyElementList = RootPanel.getBodyElement().getElementsByTagName("*");
		int count = 0;
		FormulaWidget firstFormulaWidget = null;
		for (int index = 0; index < bodyElementList.getLength(); index++) {
			Element node = bodyElementList.getItem(index);
			if (node.getClassName().startsWith("formelapplet")) {
				String id = "dummie";
				Bridge.log("node.getId()=" + node.getId());
				if (node.getId().startsWith("fa_")) {
					id = node.getId();
					createMenu = true;
				} else {
					id = "fc_" + count;
					count++;
					node.setId(id);
				}
				FormulaWidget fw = new FormulaWidget(node);
				if (firstFormulaWidget == null) {
					firstFormulaWidget = fw;
				}
				Bridge.log("fa.getId()=" + fw.getId());
				String rep = node.getAttribute("representation");
				Bridge.log(id + " representation= " + rep);
				String equation = node.getAttribute("data-equation");
				Bridge.log(id + " data-equation= " + equation);
				if (equation.equals("")) {
					equation = node.getAttribute("equation");
				}
				if (rep.equals("")) {
					Bridge.log("use parameter 'equation'");
					fw.setCombiString(equation, false);
				} else {
					Bridge.log("use parameter 'representation'");
					fw.setCombiString(rep, false);
				}
				RootPanel.get(id).getElement().setInnerHTML("");
				RootPanel.get(id).add(fw);
				fw.getCommandManager().setDirty(true);
				fw.paint();
				String cond = node.getAttribute("condition");
				if (cond.equals("")) {
					cond = node.getAttribute("data-condition");
				}
				if (!cond.equals("")) {
					fw.getPar().setParameter("condition", cond);
				}
				String unitmode = node.getAttribute("unitmode");
				if (unitmode.equalsIgnoreCase("physics")) {
					fw.getPar().setUnitDetectionModePhysics();
				}
				String precisionString = node.getAttribute("precision");
				if (precisionString.equals("")) {
					precisionString = "0";
				}
				double precision = 0;
				try {
					precision = Double.parseDouble(precisionString);
					Bridge.log("id=" + id + " precision=" + precision);
				} catch (Exception e) {
					Bridge.log("id=" + id + " " + e.getLocalizedMessage());
				}
				fw.getPar().setPrecision(precision);
				if (unitmode.equalsIgnoreCase("physics")) {
					fw.getPar().setUnitDetectionModePhysics();
				}
//				Bridge.setInactive(fw.getId());
//				fw.getPar().setInputInactive();

				// read definition sets
				for (int i = 0; i <= 9; i++) {
					String defNr = "def" + i;
					String definitionString = node.getAttribute(defNr);
					if (!definitionString.equals("")) {
						definitionString = definitionString.replace("&lt;", "<");
						Bridge.log(defNr + "=" + definitionString);
						DebugPanel.debugPrint(defNr + "=" + definitionString, id);
						fw.getPar().setParameter(defNr, definitionString);
						try {
							fw.getPar().getDefinitionSet().addCondition(definitionString);
						} catch (Exception ex) {
							DebugPanel.debugPrintln("Fehler beim Parsen von def" + index, 0);
							DebugPanel.debugPrintln(ex.getLocalizedMessage(), 0);
						}
					}
				}
			}
		}
		if (firstFormulaWidget != null) {
			Bridge.setActive(firstFormulaWidget.getId());
//			firstFormulaWidget.getPar().setInputActive();
		}
		Bridge.defineBridgeMethod();
		Bridge.log("CurrentLocale=" + Localizer.getCurrentLocale() + "  JOP_erase_input="
				+ Localizer.getString("JOP_erase_input"));
		Bridge.log("Bridge: isInEditor=" + Bridge.isInEditor());
		if (Bridge.isInEditor()) {
			FaEventProvider.fireFaEvent("ACTIVATE_FC_0");
		}
		Bridge.log("onModuleLoad END");
		String bli = Bridge.getActiveId();
		Bridge.log( bli);
	}
}
