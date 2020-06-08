package gut.client;

/**
 * @author Rudolf Grossmann

 * @version gf08 24.11 (30. August 2016)
 * mobile
 */

//dragging/sizing is implemented in DialogBoxMobile

public class GraffitiDialogBox extends DialogBoxMobile implements FaEventListener {
	private static GraffitiPanel myGraffitiPanel = new GraffitiPanel();
	private static boolean isHidden = true;

	GraffitiDialogBox(boolean autoHide, boolean modal) {
		super(autoHide, modal, myGraffitiPanel);
		// Corresponding styles of type .VirtualKeyboard-SubStyle
		// See file war/Gf06android.css
		addStyleName("GraffitiDialogBox");
		setTitle("See Help -> GraffitiDialogBox");
		setText("GraffitiDialogBox");
//		CommandEventProvider.addCommandListener(this);
		FaEventProvider.addFaEventListener(this);
		DebugPanel.debugPrint("created", "GraffitiDialogBox");
	}

	@Override
	public void faEventReceived(FaEvent ev) {
		String mod = ev.getKind();
		String cmd = ev.getCommand();
		if (mod.startsWith("CMD")) {
			if (cmd.startsWith("SHOW_VKBD")) {
				setVisible(true);
			} else if (cmd.startsWith("CLOSE_VKBD")) {
				setVisible(false);
			} else if (cmd.startsWith("TOGGLE_VKBD")) {
				setVisible(isHidden());
			} else if (cmd.startsWith("OPEN_VKBD")) {
				if (ev.getX() > 0 || ev.getY() > 0) {
					setPopupPosition(ev.getX(), ev.getY());
				} else {
					setPopupPosition(100, 200);
				}
				setVisible(true);
			}
		}
	}

	public void setVisible(boolean visible) {
		super.setVisible(visible);
		// closeButton.setVisible(visible);
		isHidden = !visible;
	}

	public static boolean isHidden() {
		return isHidden;
	}

	public void doClose() {
		super.doClose();
	}

}
