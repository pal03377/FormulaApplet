package gut.client;

import com.google.gwt.core.client.GWT;

import gut.client.DebugPanel;

/**
 * @author Rudolf Grossmann

 * @version gf08 24.11 (30. August 2016)
 *
 * move cursor right/left
 * handle restriction of movement
 * needs knowledge of boundary
 * 
 * ExpressionCursorMover is inherited by ExpressionBuilder
 */

public class ExpressionCursorMover extends ExpressionParameterManager {
    /**
	 * 
	 */
	private static final long serialVersionUID = -6071591636952757041L;
	private boolean CursorMovementRestricted = true; //true instead of false GRO 2016-01-06
    private boolean defaultIfNoBoundary = false;

    public boolean isCursorMovementRestricted() {
        return CursorMovementRestricted;
    }

    public void setCursorMovementRestricted(boolean truefalse) {
        CursorMovementRestricted = truefalse;
    }

    public void setDefaultCursorMovementRestrictedIfNoBoundary(boolean truefalse) {
        defaultIfNoBoundary = truefalse;
    }

    // TODO isNodeOverBoundary is buggy in gf06 before calling testIfSolution
    // solved Montelparo 2013-08-29. 
    // BoundaryExists() needs update by call of hasBoundary() in FormulaWidget
    public boolean isNodeOverBoundary(Node nd) {
        boolean result = defaultIfNoBoundary;
//        System.out.println("BoundaryExists="+BoundaryExists());
        if (BoundaryExists()) {
            result = true;
            while (result && (nd.getPosition() != Node.POSITION_ROOT)) {
//            	System.out.println("search boundary: "+nd.getNumber()+" "+nd.getContent()+" "+ nd.getTypeString(nd.getType()));
                if (nd.getType() == Node.TYPE_BOUNDARY) {
                    result = false;
                }
                nd = nd.getFather();
            }
        }
        return result;
    }

    public boolean isCursorFixed(Node testnode) {
        boolean CursorFixed = false; // Default f�r InputApplet und combiApplet im Edit-Modus
        GWT.log("isCursorMovementRestricted = "+isCursorMovementRestricted());
        if (isCursorMovementRestricted()) {
            CursorFixed = isNodeOverBoundary(testnode);
            GWT.log("CursorFixed = isNodeOverBoundary(testnode) = "+CursorFixed);
        }
        return CursorFixed;
    }

    public boolean MoveCursorRight() {
        return MoveCursor(true);
    }

    public boolean MoveCursorLeft() {
        return MoveCursor(false);
    }

    private boolean MoveCursor(boolean right) {
    	DebugPanel.debugPrint("MoveCursor right="+right, "MoveCursor");
        boolean move = false;
        try {
            Node memCursor = getCursorNode();
            Node oldCursor = getCursorNode();
            Node newCursor = null;
            //DebugPanel.debugcls();
            //DebugPanel.debugPrintln("right= " + String.valueOf(right), 3);

            //Bewegung beginnen; dabei "from" nicht benutzen, sondern nur den
            //Typ und Zustand des Knotens und right=true/false
            short from = 4711;

            //Bl�tter
            if (oldCursor.getKind() == Node.KIND_LEAF) {
//            DebugPanel.debugPrintln("oldCursor.getContent = " + oldCursor.getContent(), 3);
                newCursor = oldCursor.getFather();
//            DebugPanel.debugPrintln("newCursor.getContent = " + newCursor.getContent(), 3);
                from = oldCursor.getPosition();
            }

            //B-Knoten, Default-Verhalten (f�r Plus/Minus, Mal/Geteilt
            if (oldCursor.getKind() == Node.KIND_BINARY_NODE) {
                if (right) {
                    newCursor = oldCursor.getRightChild();
                    from = Node.FROM_ABOVE;
                } else {
                    newCursor = oldCursor.getLeftChild();
                    from = Node.FROM_ABOVE;
                }
            }
            //Spezialfall Bruch oder Potenz oder h�here Wurzel oder Index
            if (oldCursor.getType() == Node.TYPE_FRACTION || oldCursor.getType() == Node.TYPE_POWER ||
                oldCursor.getType() == Node.TYPE_HIGHER_ROOT || oldCursor.getType() == Node.TYPE_INDEX) {
                if (right) {
                    newCursor = oldCursor.getFather();
                    from = oldCursor.getPosition();
                } else {
                    newCursor = oldCursor.getRightChild();
                    from = Node.FROM_ABOVE;
                }
            }
            //Logarithmus
            if (oldCursor.getType() == Node.TYPE_LOG) {
                if (right) {
                    newCursor = oldCursor.getLeftChild();
                    from = Node.FROM_ABOVE;
                } else {
                    newCursor = oldCursor.getFather();
                    from = oldCursor.getPosition();
                }
            }

            //U-Knoten
            if (oldCursor.getKind() == Node.KIND_UNARY_NODE) {
                //Default, richtig f�r Funktionen...
                if (right) {
                    newCursor = oldCursor.getMiddleChild();
                    from = Node.FROM_ABOVE;
                } else {
                    newCursor = oldCursor.getFather();
                    from = oldCursor.getPosition();
                }

                if (oldCursor.getType() == Node.TYPE_PERCENT) {
                    if (right) {
                        newCursor = oldCursor.getFather();
                        from = oldCursor.getPosition();
                    } else {
                        newCursor = oldCursor.getMiddleChild();
                        from = Node.FROM_ABOVE;
                    }
                }

                if ("([{<|".indexOf(oldCursor.getContent()) >= 0) {
                    if ((right && !oldCursor.isWayBack()) || (!right && oldCursor.isWayBack())) {
                        newCursor = oldCursor.getMiddleChild();
                        from = Node.FROM_ABOVE;
                    } else {
                        newCursor = oldCursor.getFather();
                        from = oldCursor.getPosition();
                    }
                }

                if (oldCursor.getType() == Node.TYPE_SQUAREROOT) {
                    if ((right && oldCursor.isWayBack() == false) || (!right && oldCursor.isWayBack() == true)) {
                        newCursor = oldCursor.getMiddleChild();
                        from = Node.FROM_ABOVE;
                    } else {
                        newCursor = oldCursor.getFather();
                        from = oldCursor.getPosition();
                    }
                }
            }

            //Bewegung fortsetzen, bis Stop-Bedingung eintritt oder Root erreicht ist.
            move = true;
            boolean stop = false;
            do {

                // An Bl�ttern (Variablen, Zahlen) halten
                //DebugPanel.debugPrintln(String.valueOf(newCursor.number),3);
                //DebugPanel.debugPrintln("newCursor.getKind()= "+String.valueOf(newCursor.getKind()),3);
                if (newCursor.getKind() == Node.KIND_LEAF && newCursor.getContent() != "empty_pp" && //empty pre-period
                    newCursor.getType() != Node.TYPE_ZERO) {
                    stop = true;
                }

                //An Plus- und Minuszeichen, sichtbarem Mal und geteilt halten
                if (newCursor.getKind() == Node.KIND_BINARY_NODE &&
                    (newCursor.getType() == Node.TYPE_PLUSMINUS ||
                     (newCursor.getType() == Node.TYPE_TIMES && newCursor.getContent().equals("*")) ||
                     newCursor.getType() == Node.TYPE_DIVIDED)) {
                    if (right == true && from == Node.FROM_LEFT) {
                        stop = true;
                    }
                    if (right == false && from == Node.FROM_RIGHT) {
                        stop = true;
                    }
                }

                if (newCursor.getType() == Node.TYPE_FRACTION) {
                    if (right == true && from == Node.FROM_RIGHT) {
                        stop = true;
                    }
                    if (right == false && from == Node.FROM_ABOVE) {
                        stop = true;
                    }
                }

                if (newCursor.getType() == Node.TYPE_LOG) {
                    if (right == true && from == Node.FROM_ABOVE) {
                        stop = true;
                    }
                    if (right == false && from == Node.FROM_LEFT) {
                        stop = true;
                    }
                }

                //Klammern
                if (newCursor.getType() == Node.TYPE_BRACKET) {
                    if ((right == true && from == Node.FROM_ABOVE) ||
                        (right == false && from == Node.FROM_BELOW)) {
                        newCursor.setWayBack(false);
                        DebugPanel.debugPrintln("right=" + String.valueOf(right) + " �ffnende Klammer: " +
                                   newCursor.getContent(), 5);
                    }

                    if ((right == false && from == Node.FROM_ABOVE) ||
                        (right == true && from == Node.FROM_BELOW)) {
                        newCursor.setWayBack(true);
                        DebugPanel.debugPrintln("right=" + String.valueOf(right) + "schlie�ende Klammer: " +
                                   newCursor.getContent(), 5);
                    }
                    stop = true; // bei Klammern halten
                }

                //Potenz, Index
                if (newCursor.getType() == Node.TYPE_POWER || newCursor.getType() == Node.TYPE_HIGHER_ROOT ||
                    newCursor.getType() == Node.TYPE_INDEX) {
                    if (right == true && from == Node.FROM_RIGHT) {
                        stop = true;
                    }
                    if (right == false && from == Node.FROM_ABOVE) {
                        stop = true;
                    }
                }

                //Funktion
                if (newCursor.getType() == Node.TYPE_FUNCTION) {
                    if ((from == Node.FROM_BELOW && right == false) || (from == Node.FROM_ABOVE && right == true)) {
                        stop = true;
                        newCursor.setWayBack(false);
                    } else {
                        newCursor.setWayBack(true);
                    }
                }

                //Quadratwurzel
                if (newCursor.getType() == Node.TYPE_SQUAREROOT) {
                    if ((from == Node.FROM_BELOW && right == false) || (from == Node.FROM_ABOVE && right == true)) {
                        newCursor.setWayBack(false);
                    } else {
                        stop = true;
                        newCursor.setWayBack(true);
                    }
                }

                //Prozent
                if (newCursor.getType() == Node.TYPE_PERCENT) {
                    if ((from == Node.FROM_ABOVE && right == false) || (from == Node.FROM_BELOW && right == true)) {
                        stop = true;
                    }
                }

                //Sp�testens bei Root halten
                if (newCursor.getPosition() == Node.POSITION_ROOT) {
                    stop = true;
                    move = false;
                }

                //Cursor weiter bewegen, wenn keine Stop-Bedingung eingetreten ist
                if (!stop) {
                    // weiter bewegen...
                    oldCursor = newCursor;
                    //Bl�tter
                    if (oldCursor.getKind() == Node.KIND_LEAF) {
                        newCursor = oldCursor.getFather();
                        from = oldCursor.getPosition();
                    }

                    //U-Knoten
                    if (oldCursor.getKind() == Node.KIND_UNARY_NODE) {
                        if (from == Node.FROM_ABOVE) {
                            newCursor = oldCursor.getMiddleChild();
                        } else {
                            newCursor = oldCursor.getFather();
                            from = oldCursor.getPosition();
                        }
                    }

                    if (oldCursor.getKind() == Node.KIND_BINARY_NODE) {
                        short newFrom = 1958;
                        //DebugPanel.debugPrintln("oldfrom=" + String.valueOf(from), 3);
                        if (right) {
                            if (from == Node.FROM_ABOVE) {
                                newCursor = oldCursor.getLeftChild();
                                newFrom = Node.FROM_ABOVE;
                            }
                            if (from == Node.FROM_LEFT) {
                                newCursor = oldCursor.getRightChild();
                                newFrom = Node.FROM_ABOVE;
                            }
                            if (from == Node.FROM_RIGHT) {
                                newCursor = oldCursor.getFather();
                                newFrom = oldCursor.getPosition();
                            }
                        } else {
                            if (from == Node.FROM_ABOVE) {
                                newCursor = oldCursor.getRightChild();
                                newFrom = Node.FROM_ABOVE;
                            }
                            if (from == Node.FROM_RIGHT) {
                                newCursor = oldCursor.getLeftChild();
                                newFrom = Node.FROM_ABOVE;
                            }
                            if (from == Node.FROM_LEFT) {
                                newCursor = oldCursor.getFather();
                                newFrom = oldCursor.getPosition();
                            }
                        }
                        from = newFrom;
                        //DebugPanel.debugPrintln("newfrom=" + String.valueOf(from), 3);
                    }
                }

                DebugPanel.debugPrint(String.valueOf(oldCursor.number) + "(" + oldCursor.getContent() + ")", 4);
                DebugPanel.debugPrint(" >> " + String.valueOf(newCursor.number) + "(" + newCursor.getContent() + ")", 4);
                DebugPanel.debugPrintln(" from= " + String.valueOf(from), 4);
            } while (!stop);

//            DebugPanel.debugPrintln("CursorFixed="+exp.isCursorFixed(newCursor),3);
            if (isCursorFixed(newCursor)) {
                move = false;
            }

            if (move) {
                setCursor(newCursor);
                //DebugPanel.debugPrintln("--------", 3);
            } else {
                setCursor(memCursor);
            }
        } catch (Exception ex) {
            DebugPanel.debugPrintln("Fehler in Methode MoveCursor", 0);
            move = false;
        }
    	DebugPanel.debugPrint("move="+move, "");
    	return move;
    }

    public void MoveCursorToRightmostLeaf() {
        try {
            Node NewCursor = getCursorNode();
            //DebugPanel.debugprintln("CursorMover: von  "+NewCursor.getContent(),3);
            Node OldCursor = null;
            boolean stop = false;
            do {
                OldCursor = NewCursor;
                if (OldCursor.getKind() == Node.KIND_BINARY_NODE) {
                    NewCursor = OldCursor.getRightChild();
                }
                if (OldCursor.getKind() == Node.KIND_UNARY_NODE) {
                    NewCursor = OldCursor.getMiddleChild();
                }
                if (OldCursor.getKind() == Node.KIND_LEAF) {
                    stop = true;
                }
            } while (stop == false); setCursor(NewCursor);
            //DebugPanel.debugprintln("CursorMover: nach "+NewCursor.getContent(),3);
        } catch (Exception ex) {
            DebugPanel.debugPrintln("Fehler in Methode MoveCursorToRightmostLeaf", 0);
        }
    }
}
