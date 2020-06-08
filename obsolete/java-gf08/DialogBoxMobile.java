package gut.client;

import com.google.gwt.dom.client.Document;
import com.google.gwt.dom.client.Element;
import com.google.gwt.dom.client.EventTarget;
import com.google.gwt.dom.client.Touch;
import com.google.gwt.event.dom.client.*;
import com.google.gwt.user.client.Window;
import com.google.gwt.user.client.ui.Anchor;
import com.google.gwt.user.client.ui.DialogBox;
import com.google.gwt.user.client.ui.FlowPanel;
import com.google.gwt.user.client.ui.Grid;
import com.google.gwt.user.client.ui.RootPanel;
import com.google.gwt.user.client.ui.SimplePanel;
import com.google.gwt.user.client.ui.Widget;

/**
 * used by GraffitidialogBox
 * 
 */

public class DialogBoxMobile extends DialogBox {
	private boolean touchIsSupported = TouchEvent.isSupported();
	private Caption caption;
	private boolean dragging, resizing;
	private int dragStartX, dragStartY;
	private int resizeStartX, resizeStartY, oldWidth, oldHeight;
	private int windowWidth, clientLeft, clientTop;
	private Widget saveWidget, emptyWidget;
	private double zoomfactor = 1;
	private double oldZoomfactor = 1;

	// some ideas from WindowBox (gwt-traction, clazzes.org Project)
	private FlowPanel container, controls, resizecontrols;
	private Anchor closeAnchor, plusAnchor, defaultAnchor, minusAnchor, corner;
	private DragTouchHandler myCaptionTouchHandler = new DragTouchHandler();
	// CaptionMouseHandler is not necessary as DialogBox supports dragging with
	// mouse
	private CornerTouchHandler myCornerTouchHandler = new CornerTouchHandler();
	private CornerMouseHandler myCornerMouseHandler = new CornerMouseHandler();

	// **********************************************//
	// ********* touch handlers *********************//
	// **********************************************//

	private class DragTouchHandler implements TouchStartHandler,
			TouchMoveHandler, TouchEndHandler, TouchCancelHandler {

		@Override
		public void onTouchStart(TouchStartEvent event) {
			// DebugPanel.debugPrint("TouchStart...", "Caption");
			if (event.getTouches().length() > 0) {
				Touch touch = event.getTouches().get(0);
				EventTarget target = touch.getTarget();
				if (Element.is(target)) {
					Element element = Element.as(target);
					// DebugPanel.debugPrint(
					// "TouchStart " + x + " " + y, "DialogBoxMobile");
					dragging = true;
					dragStartX = round(touch.getRelativeX(element));
					dragStartY = round(touch.getRelativeY(element));
					oldWidth = saveWidget.getOffsetWidth();
					oldHeight = saveWidget.getOffsetHeight();
					emptyWidget = new SimplePanel();
					emptyWidget.setWidth(oldWidth + "px");
					emptyWidget.setHeight(oldHeight + "px");
//					new ElementZoomHelper_DELETE(emptyWidget.getElement())
//							.setZoom(zoomfactor);
					;
					// int h = (int) (zoomfactor * 100);
					// String zoom = String.valueOf(((double) h) * 0.01);
					// emptyWidget.getElement().getStyle().setProperty("zoom",
					// zoom);
					// emptyWidget.getElement().getStyle()
					// .setProperty("MozTransform", "scale(" + zoom + ")");
					setWidget(emptyWidget);
				}
			}
			event.preventDefault();
		}

		@Override
		public void onTouchMove(TouchMoveEvent event) {
			// DebugPanel.debugPrint("TouchMove...", "Caption");
			if (event.getTouches().length() > 0) {
				Touch touch = event.getTouches().get(0);
				EventTarget target = touch.getTarget();
				if (Element.is(target)) {
					Element element = Element.as(target);
					int x = (int) Math.round(touch.getRelativeX(element));
					int y = (int) Math.round(touch.getRelativeY(element));
					if (dragging) {
						int absX = x + getAbsoluteLeft();
						int absY = y + getAbsoluteTop();
						DebugPanel.debugPrint("absX= " + absX + " absY= "
								+ absY, "DialogBoxMobile");
						if (absX < clientLeft || absX >= windowWidth
								|| absY < clientTop) {
							// DebugPanel.debugPrint("return",
							// "DialogBoxMobile");
							return;
						}
						setPopupPosition(absX - dragStartX, absY - dragStartY);
					}
				}
			}
			event.preventDefault();
		}

		@Override
		public void onTouchEnd(TouchEndEvent event) {
			// DebugPanel.debugPrint("TouchEnd...", "Caption");
			setWidget(saveWidget);
			dragging = false;
			event.preventDefault();
		}

		@Override
		public void onTouchCancel(TouchCancelEvent event) {
			// CommandEventProvider
			// .debugPrint("TouchCancel...", "DialogBoxMobile");
			if (event.getTouches().length() > 0) {
				Touch touch = event.getTouches().get(0);
				EventTarget target = touch.getTarget();
				if (Element.is(target)) {
					// DebugPanel.debugPrint("TouchCancel",
					// "DialogBoxMobile");
				}
			}
			event.preventDefault();
		}
	}

	private class CornerTouchHandler implements TouchStartHandler,
			TouchMoveHandler, TouchEndHandler, TouchCancelHandler {

		@Override
		public void onTouchStart(TouchStartEvent event) {
			DebugPanel.debugPrint("TouchStart...", "Corner");
			if (event.getTouches().length() > 0) {
				Touch touch = event.getTouches().get(0);
				EventTarget target = touch.getTarget();
				if (Element.is(target)) {
					Element element = Element.as(target);
					handleCornerMouseDownOrTouchStart(
							touch.getRelativeX(element),
							touch.getRelativeY(element));
				}
			}
			event.preventDefault();
		}

		@Override
		public void onTouchMove(TouchMoveEvent event) {
			// DebugPanel.debugPrint("TouchMove...", "Corner");
			if (event.getTouches().length() > 0) {
				Touch touch = event.getTouches().get(0);
				EventTarget target = touch.getTarget();
				if (Element.is(target)) {
					Element element = Element.as(target);
					handleCornerMouseMoveOrTouchMove(
							touch.getRelativeX(element),
							touch.getRelativeY(element));
				}
			}
			event.preventDefault();
		}

		@Override
		public void onTouchEnd(TouchEndEvent event) {
			handleCornerMouseUpOrTouchDown();
			event.preventDefault();
		}

		@Override
		public void onTouchCancel(TouchCancelEvent event) {
		}
	}

	private class CornerMouseHandler implements MouseDownHandler,
			MouseMoveHandler, MouseUpHandler, MouseOutHandler {

		@Override
		public void onMouseDown(MouseDownEvent event) {
			// DebugPanel.debugPrint("MouseDown...", "Corner");
			handleCornerMouseDownOrTouchStart(event.getClientX(),
					event.getClientY());
			event.preventDefault();
		}

		@Override
		public void onMouseMove(MouseMoveEvent event) {
			// DebugPanel.debugPrint("MouseMove...", "Corner");
			handleCornerMouseMoveOrTouchMove(event.getClientX(),
					event.getClientY());
			event.preventDefault();
		}

		@Override
		public void onMouseUp(MouseUpEvent event) {
			handleCornerMouseUpOrTouchDown();
			event.preventDefault();
		}

		@Override
		public void onMouseOut(MouseOutEvent event) {
		}
	}

	private void handleCornerMouseDownOrTouchStart(int x, int y) {
		resizing = true;
		resizeStartX = round(x);
		resizeStartY = round(y);
		oldZoomfactor = zoomfactor;
		oldWidth = saveWidget.getOffsetWidth();
		oldHeight = saveWidget.getOffsetHeight();
		emptyWidget = new SimplePanel();
		emptyWidget.setWidth(oldWidth + "px");
		emptyWidget.setHeight(oldHeight + "px");
//		new ElementZoomHelper_DELETE(emptyWidget.getElement()).setZoom(zoomfactor);
		// int h = (int) (zoomfactor * 100);
		// String zoom = String.valueOf(((double) h) * 0.01);
		// emptyWidget.getElement().getStyle().setProperty("zoom", zoom);
		// emptyWidget.getElement().getStyle()
		// .setProperty("MozTransform", "scale(" + zoom + ")");
		setWidget(emptyWidget);
	}

	private void handleCornerMouseMoveOrTouchMove(int x, int y) {
		if (resizing) {
			// int width_new = getWidget().getOffsetWidth() + x
			// - resizeStartX;
			// int height_new = getWidget().getOffsetHeight() + y
			// - resizeStartY;
			int width_new = oldWidth + round(x) - resizeStartX;
			int height_new = oldHeight + round(y) - resizeStartY;
			// DebugPanel.debugPrint("width_new= " + width_new
			// + " height_new= " + height_new, "DialogBoxMobile");
			if (width_new < 100 || height_new < 100) {
				// CommandEventProvider
				// .debugPrint("return", "DialogBoxMobile");
				return;
			}
			zoomfactor = oldZoomfactor * width_new / oldWidth;
//			new ElementZoomHelper_DELETE(getWidget().getElement()).setZoom(zoomfactor);
//			new ElementZoomHelper_DELETE(saveWidget.getElement()).setZoom(zoomfactor);
			// int h = (int) (zoomfactor * 100);
			// String zoom = String.valueOf(((double) h) * 0.01);
			// // CommandEventProvider.fireCommandEvent("virtualkeyboard",
			// // "dummy-id", "VKBD_ZOOM_TO-"+zoom, "CMD-");
			// // getWidget().setWidth("" + width_new + "px");
			// // getWidget().setHeight("" + height_new + "px");
			// getWidget().getElement().getStyle().setProperty("zoom", zoom);
			// getWidget().getElement().getStyle()
			// .setProperty("MozTransform", "scale(" + zoom + ")");
			// saveWidget.getElement().getStyle().setProperty("zoom", zoom);
			// saveWidget.getElement().getStyle()
			// .setProperty("MozTransform", "scale(" + zoom + ")");
			sync_zoom();
			// getWidget().setWidth("" + width_new + "px");
			// getWidget().setHeight("" + height_new + "px");
		}
	}

	private void handleCornerMouseUpOrTouchDown() {
		if (resizing) {
			// DebugPanel.debugPrint("MouseUp: stop resizing.",
			// "Corner");
			setWidget(saveWidget);
			resizing = false;
			oldZoomfactor = zoomfactor;
		}
	}

	// **********************************************//
	// ********* constructor *********************//
	// **********************************************//

	public DialogBoxMobile(boolean autoHide, boolean modal, Widget wg) {
		super(autoHide, modal);

		container = new FlowPanel();
		container.addStyleName("dialogContainer");

		String anchorWidth = "16px";

		plusAnchor = new Anchor();
		plusAnchor.setStyleName("x");
		plusAnchor.addStyleName("p");
		plusAnchor.setWidth(anchorWidth);
		plusAnchor.addClickHandler(new ClickHandler() {
			public void onClick(ClickEvent event) {
				DebugPanel.debugPrint("click", "plusAnchor");
				zoom_plus();
			}
		});
		if (touchIsSupported) {
			plusAnchor.addTouchStartHandler(new TouchStartHandler() {
				public void onTouchStart(TouchStartEvent event) {
					DebugPanel.debugPrint("Touchstart", "plusAnchor");
					zoom_plus();
				}
			});
		}

		defaultAnchor = new Anchor();
		defaultAnchor.setStyleName("x");
		defaultAnchor.addStyleName("d");
		defaultAnchor.setWidth(anchorWidth);
		defaultAnchor.addClickHandler(new ClickHandler() {
			public void onClick(ClickEvent event) {
				DebugPanel.debugPrint("click", "defaultAnchor");
				zoom_one();
			}
		});
		if (touchIsSupported) {
			defaultAnchor.addTouchStartHandler(new TouchStartHandler() {
				public void onTouchStart(TouchStartEvent event) {
					DebugPanel.debugPrint("Touchstart", "defaultAnchor");
					zoom_one();
				}
			});
		}

		minusAnchor = new Anchor();
		minusAnchor.setStyleName("x");
		minusAnchor.addStyleName("m");
		minusAnchor.setWidth(anchorWidth);
		minusAnchor.addClickHandler(new ClickHandler() {
			public void onClick(ClickEvent event) {
				DebugPanel.debugPrint("click", "minusAnchor");
				zoom_minus();
			}
		});
		if (touchIsSupported) {
			minusAnchor.addTouchStartHandler(new TouchStartHandler() {
				public void onTouchStart(TouchStartEvent event) {
					DebugPanel.debugPrint("Touchstart", "minusAnchor");
					zoom_minus();
				}
			});
		}

		closeAnchor = new Anchor();
		closeAnchor.setStyleName("x");
		closeAnchor.addStyleName("c");
		closeAnchor.setWidth(anchorWidth);
		closeAnchor.addClickHandler(new ClickHandler() {
			public void onClick(ClickEvent event) {
				DebugPanel.debugPrint("click", "CloseAnchor");
				doClose();
			}
		});
		if (touchIsSupported) {
			closeAnchor.addTouchStartHandler(new TouchStartHandler() {
				public void onTouchStart(TouchStartEvent event) {
					DebugPanel.debugPrint("Touchstart", "CloseAnchor");
					doClose();
				}
			});
		}

		controls = new FlowPanel();
		controls.setStyleName("dialogControls");

		Grid ctrlGrid = new Grid(1, 5);
		// Grid ctrlGrid = new Grid(1, 3);
		ctrlGrid.setWidget(0, 0, minusAnchor);
		ctrlGrid.setWidget(0, 1, defaultAnchor);
		ctrlGrid.setWidget(0, 2, plusAnchor);
		FlowPanel spacer = new FlowPanel();
		spacer.setPixelSize(100, 10);
		ctrlGrid.setWidget(0, 3, spacer);
		ctrlGrid.setWidget(0, 4, closeAnchor);
		controls.add(ctrlGrid);

		corner = new Anchor();
		corner.setStyleName("r");
		corner.setWidth("30px");
		if (TouchEvent.isSupported()) {
			corner.addDomHandler(myCornerTouchHandler,
					TouchStartEvent.getType());
			corner.addDomHandler(myCornerTouchHandler, TouchMoveEvent.getType());
			corner.addDomHandler(myCornerTouchHandler, TouchEndEvent.getType());
			corner.addDomHandler(myCornerTouchHandler,
					TouchCancelEvent.getType());
		} else {
			corner.addDomHandler(myCornerMouseHandler, MouseDownEvent.getType());
			// corner.addDomHandler(myCornerMouseHandler,
			// MouseMoveEvent.getType());
			RootPanel.get().addDomHandler(myCornerMouseHandler,
					MouseMoveEvent.getType());
			// corner.addDomHandler(myCornerMouseHandler,
			// MouseUpEvent.getType());
			RootPanel.get().addDomHandler(myCornerMouseHandler,
					MouseUpEvent.getType());
			// corner.addDomHandler(myCornerMouseHandler,
			// MouseOutEvent.getType());
		}

		resizecontrols = new FlowPanel();
		resizecontrols.setStyleName("resizeControls");
		resizecontrols.add(corner);

		setWidget(wg);
		caption = getCaption();
		windowWidth = Window.getClientWidth();
		clientLeft = Document.get().getBodyOffsetLeft();
		clientTop = Document.get().getBodyOffsetTop();
		if (touchIsSupported) {
			caption.asWidget().addDomHandler(myCaptionTouchHandler,
					TouchStartEvent.getType());
			caption.asWidget().addDomHandler(myCaptionTouchHandler,
					TouchMoveEvent.getType());
			caption.asWidget().addDomHandler(myCaptionTouchHandler,
					TouchEndEvent.getType());
			caption.asWidget().addDomHandler(myCaptionTouchHandler,
					TouchCancelEvent.getType());
		}

		System.out.println("+++ Touch supported=" + touchIsSupported);
	}

	protected void zoom_minus() {
		zoomfactor = zoomfactor * 0.8;
		oldZoomfactor = zoomfactor;
//		new ElementZoomHelper_DELETE(getWidget().getElement()).setZoom(zoomfactor);
		//
		// int h = (int) (zoomfactor * 100);
		// String zoom = String.valueOf(((double) h) * 0.01);
		// getWidget().getElement().getStyle().setProperty("zoom", zoom);
		// getWidget().getElement().getStyle()
		// .setProperty("MozTransform", "scale(" + zoom + ")");
		sync_zoom();
	}

	protected void zoom_one() {
		zoomfactor = 1;
		oldZoomfactor = zoomfactor;
//		new ElementZoomHelper_DELETE(getWidget().getElement()).setZoom(zoomfactor);
		// int h = (int) (zoomfactor * 100);
		// String zoom = String.valueOf(((double) h) * 0.01);
		// getWidget().getElement().getStyle().setProperty("zoom", zoom);
		// getWidget().getElement().getStyle()
		// .setProperty("MozTransform", "scale(" + zoom + ")");
		sync_zoom();
	}

	protected void zoom_plus() {
		zoomfactor = zoomfactor * 1.25;
		oldZoomfactor = zoomfactor;
//		new ElementZoomHelper_DELETE(getWidget().getElement()).setZoom(zoomfactor);
		// int h = (int) (zoomfactor * 100);
		// String zoom = String.valueOf(((double) h) * 0.01);
		// getWidget().getElement().getStyle().setProperty("zoom", zoom);
		// getWidget().getElement().getStyle()
		// .setProperty("MozTransform", "scale(" + zoom + ")");
		sync_zoom();
	}

	@Override
	public void setWidget(Widget widget) {
		// avoid to save emptyWidget as saveWidget
		if (!resizing && !dragging) {
			saveWidget = widget;
		}
		if (container.getWidgetCount() == 0) {
			// setup
			container.add(controls);
			super.setWidget(container);
		} else {
			// remove the old one
			while (container.getWidgetCount() > 1) {
				container.remove(1);
			}
		}
		// add the new widget
		container.add(widget);
		// if (touchIsSupported){
		container.add(resizecontrols);
		// }
	}

	@Override
	public Widget getWidget() {
		// container has widgets "controls" and "widget" and "resizecontrols",
		// see setWidget()
		return container.getWidget(1);
	}

	public void setCloseIconVisible(boolean visible) {
		closeAnchor.setVisible(visible);
	}

	/**
	 * Returns the FlowPanel that contains the controls. More controls can be
	 * added directly to this.
	 * @return FlowPanel containing control elements
	 */
	public FlowPanel getControlPanel() {
		return controls;
	}

	public void sync_zoom() {
		// called when zoomfactor changes. Override at child class!
	}

	private int round(int r) { // this shold not be necessary, but is!
		return (int) Math.round(r);
	}

	// will be overwriten in VirtualKeyboard
	public void doClose() {
		setVisible(false);
	}

}
