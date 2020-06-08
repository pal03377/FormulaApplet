package gut.client;

import gut.client.DebugPanel;

/**
 * @author Rudolf Grossmann

 * @version gf08 24.11 (30. August 2016)
 *
 * inserting and deleting nodes
 * 
 * ExpressionUnitManager is inherited by ExpressionBuilder
 */

// ExpressionEvent was used by gut04e, not used by gf06android

public class ExpressionBuilder extends ExpressionCursorMover {

	private static final long serialVersionUID = 3804921935185362090L;

    public void InsertUNodeOverCursor(Node u) {
        try {
            if (u.getKind() == Node.KIND_UNARY_NODE) { //sonst nichts tun
                Node Cursor = getCursorNode();
                Node Father = Cursor.getFather();
                if (Cursor.getPosition() == Node.POSITION_LEFT) {
                    Father.setLeftChild(u);
                    u.setPosition(Node.POSITION_LEFT);
                }
                if (Cursor.getPosition() == Node.POSITION_MIDDLE) {
                    Father.setMiddleChild(u);
                    u.setPosition(Node.POSITION_MIDDLE);
                }
                if (Cursor.getPosition() == Node.POSITION_RIGHT) {
                    Father.setRightChild(u);
                    u.setPosition(Node.POSITION_RIGHT);
                }
                u.setFather(Father);
                u.setMiddleChild(Cursor);
                Cursor.setFather(u);
                Cursor.setPosition(Node.POSITION_MIDDLE);
                setCursor(Cursor); //ist das n�tig?
            } else {
                DebugPanel.debugPrintln("Fehler: Falscher Knoten-Typ (kein U-Knoten)", 1);
            }
        } catch (Exception ex) {
            DebugPanel.debugPrintln("Fehler in Methode InsertUNodeOverCursor", 0);
        }
    }

    public void InsertBNodeOverCursor(Node binarynode, Node leaf) {
        // leaf ist danach Cursor der Expression ex
        try {
            Node Cursor = getCursorNode();
            Node father = Cursor.getFather();
            if (Cursor.getPosition() == Node.POSITION_MIDDLE) {
                father.setMiddleChild(binarynode);
                binarynode.setPosition(Node.POSITION_MIDDLE);
            } else { //father ist B-Knoten
                if (Cursor.getPosition() == Node.POSITION_LEFT) {
                    father.setLeftChild(binarynode);
                    binarynode.setPosition(Node.POSITION_LEFT);
                } else { //POSITION_RIGHT
                    father.setRightChild(binarynode);
                    binarynode.setPosition(Node.POSITION_RIGHT);
                }
            }
            binarynode.setFather(father);

            //neues Blatt immer nach rechts
            binarynode.setRightChild(leaf);
            leaf.setPosition(Node.POSITION_RIGHT);
            leaf.setFather(binarynode);
            binarynode.setLeftChild(Cursor);
            Cursor.setPosition(Node.POSITION_LEFT);
            Cursor.setFather(binarynode);
            setCursor(leaf); //Cursor=leaf geht nicht!
        } catch (Exception ex) {
            DebugPanel.debugPrintln("Fehler in Methode InsertBNodeOverCursor", 0);
        }
    }

    public void InsertBNodeBetweenFatherAndGrandpa(Node binarynode, Node leaf) {
        // Denkbare Vereinfachung: statt Expression exp wird Cursor-Knoten �bergeben...
        try {
            Node father = getCursorNode().getFather();
            if (father.getPosition() == Node.POSITION_ROOT) {
                InsertBNodeOverCursor(binarynode, leaf);
            } else {
                setCursor(father);
                InsertBNodeOverCursor(binarynode, leaf);
            }
        } catch (Exception ex) {
            DebugPanel.debugPrintln("Fehler in Methode InsertBNodeBetweenFatherAndGrandpa", 0);
        }
    }

    public void InsertUNodeBetweenFatherAndGrandpa(Node unarynode) {
        if (unarynode.getKind() == Node.KIND_UNARY_NODE) {
            try {
                Node oldCursor = getCursorNode();
                Node father = getCursorNode().getFather();
                if (father.getPosition() == Node.POSITION_ROOT) {
                    InsertUNodeOverCursor(unarynode);
                } else {
                    setCursor(father);
                    InsertUNodeOverCursor(unarynode);
                }
                setCursor(oldCursor);
            } catch (Exception ex) {
                DebugPanel.debugPrintln("Fehler in Methode InsertUNodeBetweenFatherAndGrandpa", 0);
                DebugPanel.debugPrintln(ex.getLocalizedMessage(), 0);
            }
        } else {
            DebugPanel.debugPrintln("�bergebener Knoten ist nicht vom Typ 'unary'", 0);
        }
    }

    public void DeleteUNode(Node unode) {
        try {
            Node father = unode.getFather();
            Node child = unode.getMiddleChild();
            child.setFather(father);
            if (unode.getPosition() == Node.POSITION_LEFT) {
                father.setLeftChild(child);
                child.setPosition(Node.POSITION_LEFT);
            }
            if (unode.getPosition() == Node.POSITION_MIDDLE) {
                father.setMiddleChild(child);
                child.setPosition(Node.POSITION_MIDDLE);
            }
            if (unode.getPosition() == Node.POSITION_RIGHT) {
                father.setRightChild(child);
                child.setPosition(Node.POSITION_RIGHT);
            }
            unode = null;
        } catch (Exception ex) {
            DebugPanel.debugPrint("Fehler in Methode DeleteUNode", 0);
            DebugPanel.debugPrintln(ex.toString(), 0);
        }
    }

    public void DeleteBNode(Node bnode) {
        Node father = bnode.getFather();
        Node child = bnode.getLeftChild();
        child.setFather(father);
        if (bnode.getPosition() == Node.POSITION_LEFT) {
            father.setLeftChild(child);
            child.setPosition(Node.POSITION_LEFT);
        }
        if (bnode.getPosition() == Node.POSITION_MIDDLE) {
            father.setMiddleChild(child);
            child.setPosition(Node.POSITION_MIDDLE);
        }
        if (bnode.getPosition() == Node.POSITION_RIGHT) {
            father.setRightChild(child);
            child.setPosition(Node.POSITION_RIGHT);
        }
        bnode = null;
    }

    public void ReplaceBNodeWithSpace(Node bnode) {
        Node father = bnode.getFather();
        Node space = new Node();
        space.setFather(father);
        if (bnode.getPosition() == Node.POSITION_LEFT) {
            father.setLeftChild(space);
            space.setPosition(Node.POSITION_LEFT);
        }
        if (bnode.getPosition() == Node.POSITION_MIDDLE) {
            father.setMiddleChild(space);
            space.setPosition(Node.POSITION_MIDDLE);
        }
        if (bnode.getPosition() == Node.POSITION_RIGHT) {
            father.setRightChild(space);
            space.setPosition(Node.POSITION_RIGHT);
        }
        setCursor(space);
        bnode = null;
    }

    public void Node2Variables(Node nd) {
        if (nd.getType() == Node.TYPE_ALMOSTUNIT || nd.getType() == Node.TYPE_UNIT) {
            nd.setType(Node.TYPE_VARIABLE_AZ);
            setCursor(nd);
            // mehrbuchstabige Variable in Produkt wandeln
            String s = getCursorNode().getContent();
            DebugPanel.debugPrintln("s=" + s, 3);
            while (s.length() > 1) {
                String left_letter = s.substring(0, 1);
                getCursorNode().setContent(left_letter);
                DebugPanel.debugPrintln("left_letter=" + left_letter, 3);
                s = s.substring(1); // eine Variable k�rzer
                DebugPanel.debugPrintln("s=" + s, 3);
                Node times = new Node("times", Node.KIND_BINARY_NODE, Node.TYPE_TIMES);
                Node leaf = new Node(s, Node.KIND_LEAF, Node.TYPE_VARIABLE_AZ);
                InsertBNodeOverCursor(times, leaf);
                // leaf ist neuer Cursor
//                ex.dumpTree();
            }
        }
    }
}
