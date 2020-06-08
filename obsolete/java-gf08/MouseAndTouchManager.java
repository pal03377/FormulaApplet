package gut.client;

/**
 * @author Rudolf Grossmann

 * @version gf08 24.11 (30. August 2016)
 * mobile
 */

import com.google.gwt.dom.client.Element;
import com.google.gwt.dom.client.EventTarget;
import com.google.gwt.dom.client.Touch;
import com.google.gwt.event.dom.client.*;
import com.google.gwt.user.client.ui.FocusWidget;

// used by GraffitiPanel. No more used by FormulaWidget, which uses JavaScript bridge
public class MouseAndTouchManager implements MouseMoveHandler,
		MouseDownHandler, MouseUpHandler, MouseOutHandler, DoubleClickHandler,
		TouchMoveHandler, TouchStartHandler, TouchEndHandler,
		TouchCancelHandler, FocusHandler, BlurHandler {
	private String Id = "MouseAndTouchManager";
	private String _target = "commandmanager";
	private boolean isMouseButtonPressed = false;
	private int x = 0, y = 0;
//	private int millis = 800;
	private boolean isGraffitiPanel = false;

	MouseAndTouchManager(FocusWidget cv) {
		if (TouchEvent.isSupported()) {
			DebugPanel.debugPrint("+++ Touch supported.", Id);
			cv.addTouchStartHandler(this);
			cv.addTouchMoveHandler(this);
			cv.addTouchEndHandler(this);
			cv.addTouchCancelHandler(this);
		} else {
			DebugPanel.debugPrint("+++ Mouse supported.", Id);
			cv.addMouseMoveHandler(this);
			cv.addMouseDownHandler(this);
			cv.addMouseUpHandler(this);
			cv.addMouseOutHandler(this);
			cv.addDoubleClickHandler(this);
		}
	}
	
	public String getId() {
		return Id;
	}

	public void setId(String s) {
		Id = s;
	}

	private String getTarget() {
		return _target;
	}

	public void setTarget(String target) {
		_target = target;
	}

	public boolean isGraffitiPanel() {
		return isGraffitiPanel;
	}

	public void setGraffitiPanel(boolean truefalse) {
		isGraffitiPanel = truefalse;
		if (isGraffitiPanel) {
			setTarget("graffitipanel");
		}
	}

	
	// ***************************************** //
	// *****  Mouse and Touch Events  ********** //
	// ***************************************** //
	
	@Override
	public void onMouseDown(MouseDownEvent event) {
		x = round(event.getX());
		y = round(event.getY());
		int buttonNumber = event.getNativeButton();
		boolean ctrl = event.isControlKeyDown();
		boolean alt = event.isAltKeyDown();
		boolean shift = event.isShiftKeyDown();
		String modifier = (ctrl ? "CTRL-" : "") + (alt ? "ALT-" : "")
				+ (shift ? "SHIFT-" : "");
		if (modifier.equals("") && buttonNumber == 1) {
//			touchHoldTimer.schedule(getTouchholdTime());
			// DebugPanel.debugPrint("Start touchHoldTimer", Id);
			isMouseButtonPressed = true;
			// DebugPanel.debugPrint("Mouse down " + xy, Id);
			if (isGraffitiPanel()) {
//				CommandEventProvider.fireCommandEvent(getTarget(), Id,
//						"START_DRAWING-",  "CMD-", x, y);
				FaEventProvider.fireFaEvent("START_DRAWING-",  "CMD-", x, y);
			} else {
//				CommandEventProvider.fireCommandEvent("formulawidget", Id,
//						"MOUSEDOWN-", "CMD-", x, y);
				FaEventProvider.fireFaEvent("MOUSEDOWN-",  "CMD-", x, y);
//				CommandEventProvider.fireCommandEvent("commandmanager", Id, 
//						"MOUSE-", "CMD-", x, y);
				FaEventProvider.fireFaEvent("MOUSE-",  "CMD-", x, y);
			}
		}
		event.preventDefault();
	}

	@Override
	public void onTouchStart(TouchStartEvent event) {
		if (event.getTouches().length() > 0) {
			Touch touch = event.getTouches().get(0);
			EventTarget target = touch.getTarget();
			if (Element.is(target)) {
				Element element = Element.as(target);
				x = round(touch.getRelativeX(element));
				y = round(touch.getRelativeY(element));
				isMouseButtonPressed = true;
				DebugPanel.debugPrint("TouchStart " + x+ "|" + y, Id);
//				CommandEventProvider.fireCommandEvent(getTarget(), Id,
//						"START_DRAWING-", "CMD-", x, y);
				FaEventProvider.fireFaEvent("START_DRAWING-",  "CMD-", x, y);
			}
		}
		event.preventDefault();
	}

	@Override
	public void onMouseMove(MouseMoveEvent event) {
		x = round(event.getX());
		y = round(event.getY());
		// notice mouse dragged down with right click
		if (event.getNativeButton() == 2) {
			DebugPanel.debugPrint("move with right click", Id);
		}
		if (isMouseButtonPressed) {
//			CommandEventProvider.fireCommandEvent(getTarget(), Id,
//					"DRAWTO-", "CMD-", x, y);
			FaEventProvider.fireFaEvent("DRAWTO-",  "CMD-", x, y);
		}
		event.preventDefault();
	}

	@Override
	public void onTouchMove(TouchMoveEvent event) {
		if (event.getTouches().length() > 0) {
			Touch touch = event.getTouches().get(0);
			EventTarget target = touch.getTarget();
			if (Element.is(target)) {
				Element element = Element.as(target);
				x = round(touch.getRelativeX(element));
				y = round(touch.getRelativeY(element));
//				CommandEventProvider.fireCommandEvent(getTarget(), Id,
//						"DRAWTO-", "CMD-", x, y);
				FaEventProvider.fireFaEvent("DRAWTO-",  "CMD-", x, y);
			}
		}
		event.preventDefault();
	}

	public void onMouseUp(MouseUpEvent event) {
		x = round(event.getX());
		y = round(event.getY());
		int buttonNumber = event.getNativeButton();
		boolean ctrl = event.isControlKeyDown();
		boolean alt = event.isAltKeyDown();
		boolean shift = event.isShiftKeyDown();
		String modifier = (ctrl ? "CTRL-" : "") + (alt ? "ALT-" : "")
				+ (shift ? "SHIFT-" : "");
		if (modifier.equals("") && buttonNumber == 1) {
			isMouseButtonPressed = false;
//			CommandEventProvider.fireCommandEvent(getTarget(), Id,
//					"STOP_DRAWING-", "CMD-", x, y);
			FaEventProvider.fireFaEvent("STOP_DRAWING-",  "CMD-", x, y);
		}
		event.preventDefault();
	}

	@Override
	public void onTouchEnd(TouchEndEvent event) {
		if (event.getTouches().length() > 0) {
			Touch touch = event.getTouches().get(0);
			EventTarget target = touch.getTarget();
			if (Element.is(target)) {
				Element element = Element.as(target);
				x = round(touch.getRelativeX(element));
				y = round(touch.getRelativeY(element));
//				CommandEventProvider.fireCommandEvent(getTarget(), Id,
//						"STOP_DRAWING-", "CMD-", x, y);
				FaEventProvider.fireFaEvent("STOP_DRAWING-",  "CMD-", x, y);
				DebugPanel.debugPrint("TouchEnd "+ x +"|"+ y, Id);
				isMouseButtonPressed = false;
			}
		} else {
			x = round(x);
			y = round(y);
//			CommandEventProvider.fireCommandEvent(getTarget(), Id,
//					"STOP_DRAWING-", "CMD-", x, y);
			FaEventProvider.fireFaEvent("STOP_DRAWING-",  "CMD-", x, y);
			isMouseButtonPressed = false;
		}
		event.preventDefault();
	}

	// String findPosLeftTop(Element el) {
	// int curleft = 0;
	// int curtop = 0;
	// if (el.getOffsetParent() != null) {
	// boolean done = false;
	// do {
	// curleft += el.getOffsetLeft();
	// curtop += el.getOffsetTop();
	// if (el.getOffsetParent() == null) {
	// done = true;
	// } else {
	// el = el.getOffsetParent();
	// }
	// } while (!done);
	// }
	// return curleft + "|" + curtop;
	// }

	@Override
	public void onDoubleClick(DoubleClickEvent event) {
		DebugPanel.debugPrint("doubleclick", Id);
	}

	@Override
	public void onTouchCancel(TouchCancelEvent event) {
		if (event.getTouches().length() > 0) {
			Touch touch = event.getTouches().get(0);
			EventTarget target = touch.getTarget();
			if (Element.is(target)) {
				Element element = Element.as(target);
				x = round(touch.getRelativeX(element));
				y = round(touch.getRelativeY(element));
				DebugPanel.debugPrint("TouchCancel", Id);
//				CommandEventProvider.fireCommandEvent(getTarget(), Id,
//						"STOP_DRAWING-", "CMD-", x, y);
				FaEventProvider.fireFaEvent("STOP_DRAWING-",  "CMD-", x, y);
			}
		}
		isMouseButtonPressed = false;
//		touchHoldTimer.cancel();
	}

	@Override
	public void onMouseOut(MouseOutEvent event) {
		x = round(event.getX());
		y = round(event.getY());
//		CommandEventProvider.fireCommandEvent(getTarget(), Id,
//				"STOP_DRAWING-", "CMD-", x, y);
		FaEventProvider.fireFaEvent("STOP_DRAWING-",  "CMD-", x, y);
	}

//	public void setTouchholdTime(int t) {
//		millis = t;
//	}
//
//	int getTouchholdTime() {
//		return millis;
//	}

	@Override
	public void onFocus(FocusEvent event) {
		DebugPanel.debugPrint("Focus gained", Id);
	}

	@Override
	public void onBlur(BlurEvent event) {
		DebugPanel.debugPrint("Focus lost (blur)", Id);
		if (getTarget().equalsIgnoreCase("graffitipanel")) {
//			CommandEventProvider.fireCommandEvent(getTarget(), Id,
//					"HIDEGRAFFITIPANEL");
			FaEventProvider.fireFaEvent("HIDEGRAFFITIPANEL");

		}
	}

	private int round(int r) { //this shold not be necessary, but is!
		return (int) Math.round(r);
	}
}
