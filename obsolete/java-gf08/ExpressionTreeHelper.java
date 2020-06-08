package gut.client;

/**
 * @author Rudolf Grossmann

 * @version gf08 24.11 (30. August 2016)
 */

import gut.client.ExpressionParameterManager;
import gut.client.Node;

import com.google.gwt.user.client.ui.Tree;
import com.google.gwt.user.client.ui.TreeItem;

public class ExpressionTreeHelper {
	static ExpressionParameterManager epm;
	static Node cursor;
	
	public static Tree getExpressionTree(ExpressionParameterManager exp) {
		Tree myTree = new Tree();
		epm = exp;
		cursor = epm.getCursorNode();
		TreeItem root = new TreeItem();
		root.setUserObject(epm.getRoot());
//		root.setText(epm.getRoot().getContent());
		root.setText(epm.getRoot().toString());
		// DefaultMutableTreeNode root = new
		// DefaultMutableTreeNode(exp.getRoot());
		// DefaultTreeModel myTreeModel = new DefaultTreeModel(root);
		myTree.addItem(root);
		addChildrenToParent(root); // recursive

		// JTree myJTree = new JTree(myTreeModel);
		// myJTree.setRootVisible(true);
		// for (int i = 0; i <= myJTree.getRowCount(); ++i) {
		// myJTree.expandRow(i);
		// }
		// TreeSelectionModel tsm = new DefaultTreeSelectionModel();
		// tsm.setSelectionMode(TreeSelectionModel.SINGLE_TREE_SELECTION);
		// myJTree.setSelectionModel(tsm);
		// myJTree.addTreeSelectionListener(new TreeSelectionListener() {
		// public void valueChanged(TreeSelectionEvent ev) {
		// // selection();
		// }
		// });
		return myTree;
	}

	private static void addChildrenToParent(TreeItem parent) {
		Node n = (Node) parent.getUserObject();
//		System.out.println("ANF parent=("+n.getNumber()+") "+ n.getContent());
//		n.setCursor(n.equals(epm.getCursorNode()));
//		parent.setText(n.getContent());
		parent.setText("("+n.getNumber()+") "+ n.toString());
		//TODO Cursor should be handled by Node.toString(), broken
		if (n.equals(cursor)){
			parent.setText(parent.getText() + " <- Cursor");
		}
		Node lc = n.getLeftChild();
		if (lc != null) {
			TreeItem child = new TreeItem();
			child.setUserObject(lc);
			child.setText(lc.getContent());
			parent.addItem(child);
//			System.out.println("lc="+n.getNumber()+") "+ lc.getContent());
			addChildrenToParent(child);
		}
		Node mc = n.getMiddleChild();
		if (mc != null) {
			TreeItem child = new TreeItem();
			child.setUserObject(mc);
			child.setText(mc.getContent());
			parent.addItem(child);
//			System.out.println("mc=("+n.getNumber()+") "+ mc.getContent());
			addChildrenToParent(child);
		}
		Node rc = n.getRightChild();
		if (rc != null) {
			TreeItem child = new TreeItem();
			child.setUserObject(rc);
			child.setText(rc.getContent());
			parent.addItem(child);
//			System.out.println("rc=("+n.getNumber()+") "+ rc.getContent());
			addChildrenToParent(child);
		}
		parent.setState(true);
//		System.out.println("END parent=("+n.getNumber()+") "+ n.getContent());
	}
}
