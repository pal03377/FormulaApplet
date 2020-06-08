package gut.client;

import java.io.Serializable;

/**
 * @author Rudolf Grossmann
 * @version gf08 24.11 (30. August 2016)
 */

public class Node implements Serializable, Cloneable {
    static final long serialVersionUID = 1708582512581029384L;
    public static String SpaceContent = "s";
    public static String InputFieldContent = "?";
    public static final String PERMIL = "\u2030"; //HTML: hexadecimal: &#x2030; decimal: &#8240; Entity: &permil;
    public static final String EURO = "\u20ac"; // Euro \u20AC
    public static final short KIND_LEAF = 1; //L-Knoten (Blatt)
    public static final short KIND_UNARY_NODE = 2; //U-Knoten (ein Kind)
    public static final short KIND_BINARY_NODE = 3; //B-Knoten (zwei Kinder)
//  static DebugPanel DP = new DebugPanel();

    //Blaetter
    public static final short TYPE_SPACE = 0;
    public static final short TYPE_NUMBER = 1;
    public static final short TYPE_VARIABLE_AZ = 2;
    public static final short TYPE_TEX = 3;
    public static final short TYPE_UNICODE = 4;
    public static final short TYPE_ALMOSTUNIT = 5; // z.B. c, mmo, h, P, da, ...
    public static final short TYPE_UNIT = 6; // z.B cm, mmol, ha, Pa, dag,...
    public static final short TYPE_MESSAGE = 7;
    public static final short TYPE_NO_RESULT = 8; // "Geht nicht"
    public static final short TYPE_ZERO = 29; // f�r Vorzeichen
    public static final short TYPE_SEXAGESIMAL = 33; // 23� 12' 17''
    public static final short TYPE_ALMOSTSEXAGESIMAL = 34; // 23� 12' 17' oder 23� 12
    public static final short TYPE_STRING = 36; // f�r f''(x)
    public static final short TYPE_INFINITY = 37; // u221 \u221E
    public static final short TYPE_NO_BOUNDARY = 43; // expression_output_only
    public static final short TYPE_GENERAL = 45; // expression_output_only

    //U-Knoten (hat ein Kind)
    public static final short TYPE_TERM = 9;
    public static final short TYPE_TERM_EQUALS = 10;
    public static final short TYPE_BRACKET = 12;
    //public static final short TYPE_ABSOLUTE = 13; //deprecated -> wie Bracket!
    public static final short TYPE_SQUAREROOT = 14;
    public static final short TYPE_FUNCTION = 15; //sin, cos, tan, ln, lg <-Name im content
    public static final short TYPE_PERCENT = 35; //z.B. 5% oder 12,7%
    public static final short TYPE_BOUNDARY = 44; // Grenze zwischen output und input

    //B-Knoten (hat zwei Kinder)
    public static final short TYPE_EQUATION = 11;
    public static final short TYPE_TIMES = 16; // content="*" -> visible
    public static final short TYPE_DIVIDED = 17;
    public static final short TYPE_FRACTION = 18;
    public static final short TYPE_MIXEDNUMBER = 19;
    public static final short TYPE_PLUSMINUS = 20;
    public static final short TYPE_LOG = 21;
    public static final short TYPE_HIGHER_ROOT = 22;
    public static final short TYPE_INTEGRAL = 23; //hat Kinder INTEGRAL_FROM_TO und INTEGRAL_ARGUMENT
    public static final short TYPE_INTEGRAL_FROM_TO = 24;
    public static final short TYPE_INTEGRAL_ARGUMENT = 25;
    public static final short TYPE_POWER = 26;
    public static final short TYPE_INDEX = 27;
    public static final short TYPE_REALNUMBER = 28;
    // public static final short TYPE_PHYSICS = 30; //Kinder: REALNUMBER, UNIT          <-deprecated!
    // public static final short TYPE_UNIT = 31; //altes Konzept. Deprecated!
    public static final short TYPE_PERIOD = 32; //Periodenstrich; Kinder: NUMBER/NUMBER.
    public static final short TYPE_LIMIT = 38; //Limes; Kinder: SubLimes/Limes von...(Term).
    // was unter dem Limes steht (vier Varianten):
    public static final short TYPE_TO_INFINITY = 39; //Kinder: Variable/ "geht gegen +/- Unendlich".
    public static final short TYPE_TO_A = 40; //Kinder: Variable/ "geht gegen ...(Term)".
    public static final short TYPE_FROM_RIGHT_TO_A = 41; //Kinder: Variable/ "geht von rechts gegen ...(Term)".
    public static final short TYPE_FROM_LEFT_TO_A = 42; //Kinder: Variable/ "geht von links gegen ...(Term)".

    public static final short POSITION_ROOT = 2005;
    public static final short POSITION_LEFT = 1;
    public static final short POSITION_MIDDLE = 2;
    public static final short POSITION_RIGHT = 3;

    public static final short FROM_LEFT = POSITION_LEFT;
    public static final short FROM_BELOW = POSITION_MIDDLE;
    public static final short FROM_RIGHT = POSITION_RIGHT;
    public static final short FROM_ABOVE = 4;
    
    private static String[] TypeStrings = new String[46];

    private Node Father = null;
    private Node LeftChild = null;
    private Node MiddleChild = null;
    private Node RightChild = null;
    private short Kind = -1;
    private short Type = -1;
    private short Position = POSITION_MIDDLE;
    private String Content = "";
    private double value = 0;
    private boolean way_back = false; //f�r Klammern, Funktionen,...
    // private NodeDimension NodeDim = new NodeDimension(); //nicht mit serialisieren

    //f�r Debugging
    private static int counter = 0;
    public int number;
    private boolean isCursor;


    public Node() {
        TypeStrings[TYPE_SPACE] = "Space";
        TypeStrings[TYPE_NUMBER] = "Number";
        TypeStrings[TYPE_VARIABLE_AZ] = "Variable";
        TypeStrings[TYPE_TEX] = "TEX";
        TypeStrings[TYPE_UNICODE] = "Unicode";
        TypeStrings[TYPE_ALMOSTUNIT] = "Almost Unit";
        TypeStrings[TYPE_UNIT] = "Unit";
        TypeStrings[TYPE_MESSAGE] = "Message";
        TypeStrings[TYPE_NO_RESULT] = "No Result";
        TypeStrings[TYPE_SEXAGESIMAL] = "Sexagesimal";
        TypeStrings[TYPE_ALMOSTSEXAGESIMAL] = "Almost Sexagesimal";
        TypeStrings[TYPE_STRING] = "String";
        TypeStrings[TYPE_INFINITY] = "Infinity";
        TypeStrings[TYPE_NO_BOUNDARY] = "No Boundary";
        TypeStrings[TYPE_TERM] = "Term";
        TypeStrings[TYPE_TERM_EQUALS] = "Term Equals";
        TypeStrings[TYPE_EQUATION] = "Equation";
        TypeStrings[TYPE_TIMES] = "Times";
        TypeStrings[TYPE_DIVIDED] = "Divided";
        TypeStrings[TYPE_FRACTION] = "Fraction";
        TypeStrings[TYPE_BRACKET] = "Bracket";
        TypeStrings[TYPE_SQUAREROOT] = "Square Root";
        TypeStrings[TYPE_FUNCTION] = "Function";
        TypeStrings[TYPE_PERCENT] = "Percent";
        TypeStrings[TYPE_POWER] = "Power";
        TypeStrings[TYPE_INDEX] = "Variable with Index";
        TypeStrings[TYPE_REALNUMBER] = "Real Number";
        TypeStrings[TYPE_ZERO] = "Zero";
        TypeStrings[TYPE_PERIOD] = "Period";
        TypeStrings[TYPE_PLUSMINUS] = "Plus/Minus";
        TypeStrings[TYPE_LOG] = "Logarithm";
        TypeStrings[TYPE_HIGHER_ROOT] = "Higher Root";
        TypeStrings[TYPE_INTEGRAL] = "Integral";
        TypeStrings[TYPE_INTEGRAL_FROM_TO] = "From To";
        TypeStrings[TYPE_INTEGRAL_ARGUMENT] = "Integral Argument";
        TypeStrings[TYPE_LIMIT] = "Limit";
        TypeStrings[TYPE_TO_INFINITY] = "To Infinity";
        TypeStrings[TYPE_TO_A] = "To a";
        TypeStrings[TYPE_FROM_RIGHT_TO_A] = "From Right To a";
        TypeStrings[TYPE_FROM_LEFT_TO_A] = "From Left To a";
        TypeStrings[TYPE_BOUNDARY] = "Boundary";
        TypeStrings[TYPE_GENERAL] = "Allgemein";
        this.Content = SpaceContent;
        this.Kind = Node.KIND_LEAF;
        this.Type = Node.TYPE_SPACE;
        //nur f�r Debugging
        counter++;
        number = counter;
    }

    public Node(String Content, short Kind, short Type) {
        this.Content = Content;
        this.Kind = Kind;
        this.Type = Type;
        //nur f�r Debugging
        counter++;
        number = counter;
    }

    // overwritten, for tree view of expression
    public String toString() {
        String content = getContent();
        if (getType() == Node.TYPE_UNIT) {
        	PhysicalUnit unit = new PhysicalUnit(getContent());
            content = unit.getUnitGreek() + " " + unit.getUnitName();
        }
        String ret = "(" + getTypeString(getType()) + ") " + content;
        if (isCursor) {
            ret += " <-Cursor";
        }
        return ret;
    }

    public void setFather(Node n) {
        Father = n;
    }

    public Node getFather() {
        Node ret=new Node();
        if (Father != null){
            ret=Father;
        }
        return ret;
    }

    public void setLeftChild(Node n) {
        LeftChild = n;
    }

    public Node getLeftChild() {
        return LeftChild;
    }

    public void setMiddleChild(Node n) {
        MiddleChild = n;
    }

    public Node getMiddleChild() {
        return MiddleChild;
    }

    public void setRightChild(Node n) {
        RightChild = n;
    }

    public Node getRightChild() {
        return RightChild;
    }

    public void setKind(short k) {
        Kind = k;
    }

    public short getKind() {
        return Kind;
    }

    public void setType(short t) {
        Type = t;
    }

    public short getType() {
        return Type;
    }

    public String getTypeString(int index) {
        return TypeStrings[index];
    }

    public void setPosition(short t) {
        Position = t;
    }

    public short getPosition() {
        return Position;
    }

    public void setContent(String t) {
        Content = t;
    }

    public void setValue(double value) {
        this.value = value;
    }

    public String getContent() {
        return Content;
    }
    
    public double getValue() {
        return this.value;
    }
    
    public int getNumber(){
    	return number;
    }

    public void setWayBack(boolean wb) {
        way_back = wb;
    }

    public boolean isWayBack() {
        return way_back;
    }

    /**
    public void setNodeDimension(NodeDimension nd) {
        NodeDim = nd;
    }

    public NodeDimension getNodeDimension() {
        return NodeDim;
    }
    **/

//    public Object clone() { //vermutlich �berfl�ssig
//        Node n = new Node();
//        try {
//            n = (Node) ObjectConverter.string2object(ObjectConverter.
//                    object2string(this));
//        } catch (Exception ex) {
//            System.out.print("Fehler in Methode Node.clone: ");
//            System.out.println(ex.toString());
//        }
//        return n;
//    }
//
    /**
     * @return a Node of the formula tree
     */
    
    public boolean isInMixedNumber() {
        boolean isInMixed = false;
        try {
            Node father = getFather();
            if (father.getType() == Node.TYPE_MIXEDNUMBER && Position == POSITION_LEFT) {
                isInMixed = true;
            }
            if (father.getType() == Node.TYPE_FRACTION) {
                Node grandpa = father.getFather();
                if (grandpa.getType() == Node.TYPE_MIXEDNUMBER) {
                    isInMixed = true;
                }
            }
        } catch (Exception ex) {
            System.out.print("Fehler in Methode Node.isInMixedNumber: ");
            System.out.println(ex.toString());
        }
        return isInMixed;
    }

    public boolean isSubLimit() {
        boolean result = false;
        if (Type == TYPE_TO_A) {
            result = true;
        }
        if (Type == TYPE_TO_INFINITY) {
            result = true;
        }
        if (Type == TYPE_FROM_LEFT_TO_A) {
            result = true;
        }
        if (Type == TYPE_FROM_RIGHT_TO_A) {
            result = true;
        }
        return result;
    }

    public static Node getNodeFromString(String rep) {
//    	DebugPanel.debugPrintln("getnodefromstring: "+rep,3);
        Node result = new Node();
        String[] parts = getPartsOfRep(rep);
        String kind = parts[0];
        result.setType(Short.parseShort(parts[1]));
        result.setContent(parts[2]);

        if (kind.equals("1")) {
            result.setKind(Node.KIND_LEAF);
        }

        if (kind.equals("2")) {
            result.setKind(Node.KIND_UNARY_NODE);
            Node middleChild = getNodeFromString(parts[3]);
            result.setMiddleChild(middleChild);
            middleChild.setFather(result);
            middleChild.setPosition(Node.POSITION_MIDDLE);
            // Klammer-Maskierung r�ckg�ngig machen
            if (result.getType() == Node.TYPE_BRACKET) {
                String content = result.getContent();
//                DebugPanel.debugPrintln("BRACKET-Knoten Inhalt vorher:" + content,
//                                3);
                if (content.equals("rka")) {
                    result.setContent("(");
                }
                if (content.equals("rkz")) {
                    result.setContent(")");
                }
                if (content.equals("eka")) {
                    result.setContent("[");
                }
                if (content.equals("ekz")) {
                    result.setContent("]");
                }
//                DebugPanel.debugPrintln("BRACKET-Knoten Inhalt nachher:" + result.getContent(),
//                                3);
            }
        }

        if (kind.equals("3")) {
            result.setKind(Node.KIND_BINARY_NODE);
            Node leftChild = getNodeFromString(parts[3]);
            result.setLeftChild(leftChild);
            leftChild.setFather(result);
            leftChild.setPosition(Node.POSITION_LEFT);
            Node rightChild = getNodeFromString(parts[4]);
            result.setRightChild(rightChild);
            rightChild.setFather(result);
            rightChild.setPosition(Node.POSITION_RIGHT);
        }
//        DebugPanel.debugPrintln("---", 3);
//        DebugPanel.debugPrintln("kind=" + result.getKind(), 3);
//        DebugPanel.debugPrintln("type=" + result.getType(), 3);
//        DebugPanel.debugPrintln("content=" + result.getContent(), 3);

        return result;
    }

    private static String[] getPartsOfRep(String rep) {
//    DebugPanel.debugPrintln("rep="+rep,3);
        String[] result = new String[5];
        result[0] = "kind";
        result[1] = "type";
        result[2] = "content";
        result[3] = "leftormiddlechild";
        result[4] = "rightchild";
        String h = "", klammer = "";
        try {
            int index = rep.indexOf("]");
            if (index < 4) {
                result[1] = "numbererror";
            }
            h = rep.substring(1, index);
            result[0] = h.substring(0, 1);
            result[1] = h.substring(1, 3);
            result[2] = h.substring(3);
            h = rep.substring(index + 1);
            if (result[0].startsWith("1")) { // Leaf Node
                result[3] = "";
                result[4] = "";
            } else {
                index = h.indexOf(")");
                if (index < 4) {
                    result[1] = "bracketnumbererror";
                }
                klammer = h.substring(0, index + 1);

                if (result[0].startsWith("2")) { // Unary Node
                    int endindex = h.indexOf(klammer, 3);
                    if (endindex < 0) {
                        result[1] = "bracketnumbererror";
                    } else {
                        result[3] = h.substring(index + 1, endindex);
                        result[4] = "";
                    }
                }
                if (result[0].startsWith("3")) { // Binary Node
                    int middleindex = h.indexOf(klammer, 3);
                    int endindex = h.indexOf(klammer, middleindex + 1);
                    if (middleindex < 0 || endindex < 0) {
                        result[1] = "bracketnumbererror";
                    } else {
                        result[3] = h.substring(index + 1, middleindex);
                        result[4] = h.substring(middleindex + klammer.length(), endindex);
                    }
                }
            }

        } catch (Exception ex) {
            System.out.println("Fehler in Node.getPartsOfRep");
            System.out.println(ex.toString());
        }
        return result;
    }

    public void setCursor(boolean truefalse) {
        this.isCursor = truefalse;
    }
}
