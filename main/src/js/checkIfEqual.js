import parse, {
    FaTree,
    findCorrespondingRightBracket,
    evaluateTree,
    fillWithValues,
    checkScientificNotation
} from "./texParser.js";

/**
 * 
 * @param {string } id string ('name') identifying the Formula Applet
 * @param {string} a left side of equation 
 * @param {string} b right side of equation
 * @param {*} dsList  list of definition sets to be considered
 * assembles an equation a = b from left side a uns right side b, then checks if a = b is true
 * @see checkIfEquality
 */
function checkIfEqual(id, a, b, dsList) {
    var equ = a + '=' + b;
    checkIfEquality(id, equ, dsList);
}

/**
 * 
 * @param {string} id string ('name') identifying the Formula Applet
 * @param {*} equ TEX string representing an equation to be chqcke
 * @param {*} dsList list of definition sets to be considered
 * adds class mod_wrong or mod_ok to applet
 * should be broke in two parts
 * equ -> boolean ok/wrong -> add class to applet
 * @see checkIfEqual
 */

function checkIfEquality(id, equ, dsList) {
    console.log(equ);
    var myTree = parse(equ);
    myTree = fillWithRandomValAndCheckDefSets(myTree, dsList);
    var almostOne = evaluateTree(myTree);
    var dif = Math.abs(almostOne - 1);
    var fApp = getFAppFromId(id);
    var precision = fApp.precision;
    if (dif < precision) {
        $('#' + id).removeClass('mod_wrong').addClass('mod_ok');
    } else {
        $('#' + id).removeClass('mod_ok').addClass('mod_wrong');
    }
}

function fillWithRandomValAndCheckDefSets(treeVar, dsList) {
    var rememberTree = JSON.stringify(treeVar);
    if (dsList.length == 0) {
        fillWithValues(treeVar);
        return treeVar;
    } else {
        // start watchdog
        var success = false;
        var start = new Date();
        var timePassedMilliseconds = 0;
        while (!success && timePassedMilliseconds < 2000) {
            var tree2 = new FaTree();
            tree2 = JSON.parse(rememberTree);
            fillWithValues(tree2);
            var variableValueList = tree2.variableValueList;
            // CheckDefinitionSets
            for (var i = 0; i < dsList.length; i++) {
                var definitionset = parse(dsList[i]);
                fillWithValues(definitionset, variableValueList);
                var value = evaluateTree(definitionset);
                success = ((value > 0) || typeof value == 'undefined');
                if (!success) {
                    // short circuit
                    i = dsList.length;
                    // restore leafs with value = undefined
                }
            }
            var now = new Date();
            timePassedMilliseconds = now.getTime() - start.getTime();
        }
        if (!success) {
            tree2.hasValue = false;
            tree2.variableValueList = [];
        }
        return tree2;
    }
}