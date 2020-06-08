package gut.client;

import gut.client.DebugPanel;
import java.util.Enumeration;
import java.util.Vector;

/**
 * @author Rudolf Grossmann

 * @version gf08 24.11 (30. August 2016)
 */

public class DefinitionSet {
    private Vector<DefinitionInterval> definitionIntervals = new Vector<DefinitionInterval>();

    //wird von ExpressionInputPanel verwendet.
    public DefinitionSet() {
    }

    public void addCondition(String def_condition) {
//        DebugPanel.debugPrintln("addCondition: " + def_condition, 3);
        int pos = def_condition.indexOf("|");
        if (pos > 0) {
            makeInterval(def_condition.substring(0, pos));
            makeInterval(def_condition.substring(pos + 1));
        } else {
            makeInterval(def_condition);
        }
    }

    private void makeInterval(String def_condition) {
        DebugPanel.debugPrintln("makeInterval: " + def_condition, 3);
        DefinitionInterval DI = new DefinitionInterval();
        boolean error = true;
        boolean temp_links = false;
        boolean temp_rechts = false;
        double number = Double.NaN;
        String variable = "";
        int pos1 = def_condition.indexOf("<");
        if (pos1 >= 0) {
            String links = def_condition.substring(0, pos1);
            String mitte = "";
            String rechts = def_condition.substring(pos1 + 1);
            if (rechts.startsWith("=")) {
                rechts = rechts.substring(1);
                temp_rechts = true;
            }
//            DebugPanel.debugPrintln("links=" + links, 3);
//            DebugPanel.debugPrintln("rechts=" + rechts, 3);
            int pos2 = rechts.indexOf("<");
            if (pos2 >= 0) {
                mitte = rechts.substring(0, pos2);
                rechts = rechts.substring(pos2 + 1);
                if (rechts.startsWith("=")) {
                    rechts = rechts.substring(1);
                    temp_links = temp_rechts;
                    temp_rechts = true;
                }
                // links-mitte-rechts
//                DebugPanel.debugPrintln("mitte=" + mitte, 3);
//                DebugPanel.debugPrintln("rechts=" + rechts, 3);
                variable = parseVariable(mitte);
                if (variable.equals("")) {
                    DebugPanel.debugPrintln(def_condition + " enth�lt keine Variable in der Mitte", 1);
                } else {
                    // links-mitte-rechts
                    number = parseNumber(links);
                    if (!Double.isNaN(number)) {
                        double number2 = parseNumber(rechts);
                        if (!Double.isNaN(number2)) {
                            DI = new DefinitionInterval(variable, number, temp_links, number2, temp_rechts);
                            error = false;
                        } else {
                            DebugPanel.debugPrintln(def_condition + " enth�lt rechts keine Zahl.", 1);
                        }
                    } else {
                        DebugPanel.debugPrintln(def_condition + " enth�lt links keine Zahl.", 1);
                    }
                }
            } else {
                //nur links-rechts
                number = parseNumber(links);
                if (Double.isNaN(number)) {
                    number = parseNumber(rechts);
                    if (!Double.isNaN(number)) {
                        variable = parseVariable(links);
                        if (!variable.equals("")) {
                            // Fall x < 1 oder x <= 1
                            DI = new DefinitionInterval(variable, Double.NEGATIVE_INFINITY, false, number,
                                                        temp_rechts);
                            error = false;
                        }
                    } else {
                        DebugPanel.debugPrintln(def_condition + " enth�lt keine Zahl.", 1);
                    }
                } else {
                    variable = parseVariable(rechts);
                    if (!variable.equals("")) {
                        // Fall 1 < x oder 1 <= x
                        DI = new DefinitionInterval(variable, number, temp_rechts, Double.POSITIVE_INFINITY, false);
                        error = false;
                    } else {
                        DebugPanel.debugPrintln(def_condition + " enth�lt rechts keine Variable", 1);
                    }

                }
            }
        } else {
            DebugPanel.debugPrintln(def_condition + " enth�lt kein <", 1);
        }
        if (error == false) {
            DebugPanel.debugPrint("Intervall erkannt:  ", 3);
            DebugPanel.debugPrint(DI.getVarName() + "  ", 3);
            DebugPanel.debugPrint(DI.getMin() + "  " + DI.isContainingMin() + "   ", 3);
            DebugPanel.debugPrintln(DI.getMax() + "  " + DI.isContainingMax(), 3);
            definitionIntervals.add(DI);
        }
    }

    private double parseNumber(String numberString) {
        double result;
        try {
            result = Double.parseDouble(numberString.trim());
        } catch (Exception ex) {
            result = Double.NaN;
        }
//        DebugPanel.debugPrint("numberString="+numberString,3);
//        DebugPanel.debugPrintln("   result="+result,3);
        return result;
    }

    private String parseVariable(String varString) {
        String result = varString.trim();
        if (result.length() != 1) {
            result = "";
        }
        return result;
    }

    public Vector<DefinitionInterval> getDefinitionIntervalsForVar(String var) {
        Vector<DefinitionInterval> result = new Vector<DefinitionInterval>();

        DefinitionInterval DI = new DefinitionInterval();
        for (Enumeration<DefinitionInterval> en = definitionIntervals.elements(); en.hasMoreElements(); ) {
            DI = (DefinitionInterval) en.nextElement();
//            DebugPanel.debugPrintln(DI.getVarName(), 3);
            if (DI.getVarName().equals(var)) {
                result.add(DI);
            }
        }
//        DebugPanel.debugPrintln("Anzahl zutreffender Intervalle:" + result.size(), 3);
        return result;
    }
}
