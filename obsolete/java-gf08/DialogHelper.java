package gut.client;

import com.google.gwt.core.shared.GWT;
import com.google.gwt.dom.client.Element;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.event.dom.client.KeyCodes;
import com.google.gwt.event.dom.client.KeyDownEvent;
import com.google.gwt.event.dom.client.KeyDownHandler;
import com.google.gwt.user.client.DOM;
import com.google.gwt.user.client.Window;
import com.google.gwt.user.client.ui.Button;
import com.google.gwt.user.client.ui.DialogBox;
import com.google.gwt.user.client.ui.HTML;
import com.google.gwt.user.client.ui.HorizontalPanel;
import com.google.gwt.user.client.ui.Hyperlink;
import com.google.gwt.user.client.ui.SimplePanel;
import com.google.gwt.user.client.ui.TextArea;
import com.google.gwt.user.client.ui.ToggleButton;
import com.google.gwt.user.client.ui.Tree;
import com.google.gwt.user.client.ui.VerticalPanel;

/**
 * DialogHelper differs in gu404 and gf06 because it uses different classes and
 * calls different methods! DialogHelper uses DialogBox
 * 
 * @author Rudolf Grossmann
 * 
 * @version gf08 24.11 (30. August 2016)
 */

public class DialogHelper {
	public static final int ANSWER_YES = 0; // JOptionPane.YES_OPTION;
	public static final int ANSWER_NO = 1; // JOptionPane.NO_OPTION;
	public static final int ANSWER_CANCEL = 2; // JOptionPane.CANCEL_OPTION;
	public static final int ANSWER_ERROR = -1;
	static int result = ANSWER_ERROR;

	public static void showMessage(String msg) {
		if (Bridge.isInEditor()) {
			Element output2 = DOM.getElementById("output2");
			if (output2 ==null){
				showMessage(msg, Localizer.getString("JOP_FormelApplet"));
			} else {
				output2.setInnerHTML(msg);
			}
		} else {
			showMessage(msg, Localizer.getString("JOP_FormelApplet"));
		}
	}

	public static void showMessage(String msg, String title) {
		boolean autoHide = true;
		boolean modal = true;
		final DialogBox dialogbox = new DialogBox(autoHide, modal);
		VerticalPanel DialogBoxContents = new VerticalPanel();
		dialogbox.setText(title);
		HTML message = new HTML(msg);
		ClickHandler listener = new ClickHandler() {
			public void onClick(ClickEvent ev) {
				dialogbox.hide();
			}
		};
		Button button = new Button("Ok", listener);
		SimplePanel buttonHolder = new SimplePanel();
		buttonHolder.add(button);
		DialogBoxContents.add(message);
		DialogBoxContents.add(buttonHolder);
		dialogbox.setWidget(DialogBoxContents);
		dialogbox.setPopupPositionAndShow(new DialogBox.PositionCallback() {
			public void setPosition(int offsetWidth, int offsetHeight) {
				int left = (Window.getClientWidth() - offsetWidth) / 2;
				int top = (Window.getClientHeight() - offsetHeight) / 2;
				dialogbox.setPopupPosition(left, top);
			}
		});
		// set StyleNames of various elements
		// dialogbox.setStyleName("demo-DialogBox");
		// message.setStyleName("demo-DialogBox-message");
		// buttonHolder.setStyleName("demo-DialogBox-footer");
		dialogbox.setStyleName("message-DialogBox", true);
		button.setFocus(true);
	}

	public static void YesNoDialog_toggle(String msg, String title, String yes_command, String no_command) {
		boolean autoHide = true;
		boolean modal = true;
		final DialogBox dialogbox = new DialogBox(autoHide, modal);
		final String yes_cmd = yes_command;
		final String no_cmd = no_command;
		VerticalPanel DialogBoxContents = new VerticalPanel();
		ToggleButtonPanel HorButtons = new ToggleButtonPanel();
		dialogbox.setText(title);
		HTML message = new HTML(msg);
		ClickHandler yes_listener = new ClickHandler() {
			public void onClick(ClickEvent ev) {
				result = ANSWER_YES;
				// DebugPanel.debugPrintln("button clicked:" + result, 3);
				dialogbox.hide();
				FaEventProvider.fireFaEvent(yes_cmd);
			}
		};
		ClickHandler no_listener = new ClickHandler() {
			public void onClick(ClickEvent ev) {
				result = ANSWER_NO;
				// DebugPanel.debugPrintln("button clicked:" + result, 3);
				dialogbox.hide();
				FaEventProvider.fireFaEvent(no_cmd);
			}
		};
		DialogBoxContents.add(message);
		ToggleButton yes_button = new ToggleButton(Localizer.getString("yes"), yes_listener);
		yes_button.addKeyDownHandler(new KeyDownHandler(){
			@Override
			public void onKeyDown(KeyDownEvent event) {
				GWT.log(event.toString());
				if(event.getNativeKeyCode() == KeyCodes.KEY_ENTER || event.getNativeKeyCode() == KeyCodes.KEY_ESCAPE) {
					dialogbox.hide();
					FaEventProvider.fireFaEvent(yes_cmd);
				}
			}
		});
		HorButtons.add(yes_button);
		ToggleButton no_button = new ToggleButton(Localizer.getString("no"), no_listener);
		no_button.addKeyDownHandler(new KeyDownHandler(){
			@Override
			public void onKeyDown(KeyDownEvent event) {
				GWT.log(event.toString());
				if(event.getNativeKeyCode() == KeyCodes.KEY_ENTER || event.getNativeKeyCode() == KeyCodes.KEY_ESCAPE) {
					dialogbox.hide();
					FaEventProvider.fireFaEvent(no_cmd);
				}
			}
		});
		HorButtons.add(no_button);
		DialogBoxContents.add(HorButtons);
		dialogbox.setWidget(DialogBoxContents);
		dialogbox.setStyleName("message-DialogBox", true);
		dialogbox.setPopupPositionAndShow(new DialogBox.PositionCallback() {
			public void setPosition(int offsetWidth, int offsetHeight) {
				int left = (Window.getClientWidth() - offsetWidth) / 2;
				int top = (Window.getClientHeight() - offsetHeight) / 2;
				dialogbox.setPopupPosition(left, top);
			}
		});
		no_button.setDown(true);
	}

	public static void YesNoDialog(String msg, String title, String yes_command, String no_command) {
		boolean autoHide = true;
		boolean modal = true;
		final DialogBox dialogbox = new DialogBox(autoHide, modal);
		final String yes_cmd = yes_command;
		final String no_cmd = no_command;
		VerticalPanel DialogBoxContents = new VerticalPanel();
		HorizontalPanel HorButtons = new HorizontalPanel();
		dialogbox.setText(title);
		HTML message = new HTML(msg);
		ClickHandler yes_listener = new ClickHandler() {
			public void onClick(ClickEvent ev) {
				result = ANSWER_YES;
				// DebugPanel.debugPrintln("button clicked:" + result, 3);
				dialogbox.hide();
				FaEventProvider.fireFaEvent(yes_cmd);
			}
		};
		ClickHandler no_listener = new ClickHandler() {
			public void onClick(ClickEvent ev) {
				result = ANSWER_NO;
				// DebugPanel.debugPrintln("button clicked:" + result, 3);
				dialogbox.hide();
				FaEventProvider.fireFaEvent(no_cmd);
			}
		};

		DialogBoxContents.add(message);
		ToggleButton yes_button = new ToggleButton(Localizer.getString("yes"), yes_listener);
		yes_button.addKeyDownHandler(new KeyDownHandler(){
			@Override
			public void onKeyDown(KeyDownEvent event) {
				GWT.log(event.toString());
				if(event.getNativeKeyCode() == KeyCodes.KEY_ENTER || event.getNativeKeyCode() == KeyCodes.KEY_ESCAPE) {
					dialogbox.hide();
					FaEventProvider.fireFaEvent(yes_cmd);
				}
			}
		});
		HorButtons.add(new SimplePanel(yes_button));
		ToggleButton no_button = new ToggleButton(Localizer.getString("no"), no_listener);
		no_button.addKeyDownHandler(new KeyDownHandler(){
			@Override
			public void onKeyDown(KeyDownEvent event) {
				GWT.log(event.toString());
				if(event.getNativeKeyCode() == KeyCodes.KEY_ENTER || event.getNativeKeyCode() == KeyCodes.KEY_ESCAPE) {
					dialogbox.hide();
					FaEventProvider.fireFaEvent(no_cmd);
				}
			}
		});
		HorButtons.add(new SimplePanel(no_button));
		DialogBoxContents.add(HorButtons);
		dialogbox.setWidget(DialogBoxContents);
		dialogbox.setStyleName("message-DialogBox", true);
		dialogbox.setPopupPositionAndShow(new DialogBox.PositionCallback() {
			public void setPosition(int offsetWidth, int offsetHeight) {
				int left = (Window.getClientWidth() - offsetWidth) / 2;
				int top = (Window.getClientHeight() - offsetHeight) / 2;
				dialogbox.setPopupPosition(left, top);
			}
		});
		no_button.setFocus(true);
	}

	public static void showTree(Expression exp) {
		boolean autoHide = true;
		boolean modal = true;
		final DialogBox dialogbox = new DialogBox(autoHide, modal);
		VerticalPanel DialogBoxContents = new VerticalPanel();
		dialogbox.setText(Localizer.getString("representation"));
		ClickHandler listener = new ClickHandler() {
			public void onClick(ClickEvent ev) {
				dialogbox.hide();
			}
		};
		Button button = new Button("Ok", listener);
		SimplePanel buttonHolder = new SimplePanel();
		buttonHolder.add(button);
		Tree expressiontree = ExpressionTreeHelper.getExpressionTree(exp);
		DialogBoxContents.add(expressiontree);
		DialogBoxContents.add(buttonHolder);
		dialogbox.setWidget(DialogBoxContents);
		dialogbox.setPopupPositionAndShow(new DialogBox.PositionCallback() {
			public void setPosition(int offsetWidth, int offsetHeight) {
				int left = (Window.getClientWidth() - offsetWidth) / 2;
				int top = (Window.getClientHeight() - offsetHeight) / 2;
				dialogbox.setPopupPosition(left, top);
			}
		});
		dialogbox.setStyleName("message-DialogBox", true);
	}

	public static void showB64(String text) {
		// uses ideas from
		// http://infposs.blogspot.de/2012/10/using-system-clipboard-from-gwt.html
		boolean autoHide = true;
		boolean modal = true;
		final TextArea textBox = new TextArea();
		final DialogBox dialogbox = new DialogBox(autoHide, modal);
		final int textlen = text.length();
		VerticalPanel DialogBoxContents = new VerticalPanel();
		// TODO i18n
		dialogbox.setText("B64");
		ClickHandler listener = new ClickHandler() {
			public void onClick(ClickEvent ev) {
				dialogbox.hide();
			}
		};
		Button button = new Button("Ok", listener);
		SimplePanel buttonHolder = new SimplePanel();
		buttonHolder.add(button);
		textBox.setText(text);
		DialogBoxContents.add(textBox);
		DialogBoxContents.add(buttonHolder);
		dialogbox.setWidget(DialogBoxContents);
		dialogbox.setGlassEnabled(false);
		final String text2 = text;
		String myHTML = "<form><div><textarea name=\"test\" style=\"width: 100%;\">" + text2
				+ "</textarea></div></form>";
		// RootPanel.get("output").clear();
		// RootPanel.get("output").add( myHTML );
		if (Bridge.isInEditor()) {
			DOM.getElementById("output").setInnerHTML(myHTML);
//		} else {
		} 
		dialogbox.setPopupPositionAndShow(new DialogBox.PositionCallback() {
				public void setPosition(int offsetWidth, int offsetHeight) {
					int left = (Window.getClientWidth() - offsetWidth) / 2;
					int top = (Window.getClientHeight() - offsetHeight) / 2;
					dialogbox.setPopupPosition(left, top);
					textBox.setFocus(true);
					textBox.setReadOnly(false);
					textBox.setSize("80em", "10em");
					textBox.selectAll();
					textBox.setSelectionRange(0, textlen);
					@SuppressWarnings("unused")
					Hyperlink myLink = new Hyperlink("B64-String in Adressfeld kopieren", text2);
					// RootPanel.get("b64_link").clear();
					// RootPanel.get("b64_link").add(myLink);
				}
			});
		//		}
	}
}
