package gut.client;

/**
 * @version gf08 24.11 (30. August 2016)
 * @author Rudolf Grossmann

 *         <p>
 *         For tablets, enables input of letters by handwriting
 *         </p>
 */

import java.util.ArrayList;
import com.google.gwt.canvas.client.Canvas;
import com.google.gwt.canvas.dom.client.Context2d;
import com.google.gwt.user.client.Timer;
import com.google.gwt.user.client.ui.SimplePanel;

public class GraffitiPanel extends SimplePanel implements FaEventListener {

	private String Id = "graffitipanel";
	private Canvas myCanvas = Canvas.createIfSupported();
	private Context2d ctx = myCanvas.getContext2d();
	private MouseAndTouchManager myMouseAndTouchManager = new MouseAndTouchManager(
			myCanvas);
	private GestureManager myGestureManager = new GestureManager();
	private int _width = 0, _height = 0;
	private boolean _drawingActive = false;

	private int time_1 = 500;
	private int time_2 = 1000;
	private final static int STATE_READY = 0; // ready for first record
	private final static int STATE_RECORD_1 = 1; // recording first record
	private final static int STATE_WAIT = 2; // wait for second record
	private final static int STATE_RECORD_2 = 3; // recording second record
	private int state = STATE_READY;
	private String gesture_1 = "", gesture_2 = "";
	private int startpoint_1_x = 0, startpoint_1_y = 0, startpoint_2_x = 0,
			startpoint_2_y = 0;
	private int quickanddirty = 0;

	Timer graffitiTimer = new Timer() {
		public void run() {
			// DebugPanel.debugPrint("graffitiTimer", Id);
			do_timer();
		}
	};

//	Timer donthideTimer = new Timer() {
//		public void run() {
//		}
//	};
//
	GraffitiPanel() {
//		CommandEventProvider.addCommandListener(this);
		FaEventProvider.addFaEventListener(this);
		myMouseAndTouchManager.setId(Id);
//		myMouseAndTouchManager.setTouchholdTime(800); // milliseconds
		myMouseAndTouchManager.setGraffitiPanel(true);
		setWidget(myCanvas);
		myCanvas.addFocusHandler(myMouseAndTouchManager);
		myCanvas.addBlurHandler(myMouseAndTouchManager);
//		myCanvas.setFocus(true);
		// ctx.scale(1.000, 1.000);
	}

	public String getId() {
		return Id;
	}

	public void setId(String Id) {
		this.Id = Id;
		myMouseAndTouchManager.setId(Id);
	}

	public void setSize(int width, int height) {
		myCanvas.setSize("" + width + "px", "" + height + "px");
		myCanvas.setCoordinateSpaceWidth(width);
		myCanvas.setCoordinateSpaceHeight(height);
		// DebugPanel.debugPrint("myCanvas.getCoordinateSpaceWidth()="
		// + myCanvas.getCoordinateSpaceWidth(), Id);
		// DebugPanel.debugPrint("myCanvas.getCoordinateSpaceHeight()="
		// + myCanvas.getCoordinateSpaceHeight(), Id);
		_width = width;
		_height = height;
	}

	public int getWidth() {
		return _width;
	}

	public int getHeight() {
		return _height;
	}
	
	@Override
	public void faEventReceived(FaEvent ev) {
		String mod = ev.getKind();
		String cmd = ev.getCommand();
			System.out.println("*graffitipanel* cmd="+cmd+" mod="+mod+" x="+ev.getX()+" y="+ev.getY());

			/* START Drawing */
			if (cmd.startsWith("START_DRAWING")) {
				DebugPanel.debugPrint("start drawing", Id);
				quickanddirty = 0;
				int x = ev.getX();
				int y = ev.getY();

				if (state == STATE_READY) {
					DebugPanel.debugPrint("clear graffitipanel", Id);
					ctx.clearRect(0, 0, _width, _height);
//					ctx.setFillStyle("yellow");
//					ctx.fillRect(0, 0, _width, _height);
//					ctx.stroke();
				}

				ctx.beginPath();
				ctx.setLineCap("round");
				ctx.setStrokeStyle("blue");
				ctx.moveTo(x, y);
				setDrawingActive(true);
				if (state == STATE_READY) {
					startpoint_1_x = x;
					startpoint_1_y = y;
					graffitiTimer.schedule(time_1);
					setState(STATE_RECORD_1);
					myGestureManager.startGesture(x, y);
				}
				if (state == STATE_WAIT) {
					startpoint_2_x = x;
					startpoint_2_y = y;
					graffitiTimer.cancel();
					setState(STATE_RECORD_2);
					myGestureManager.startGesture(x, y);
				}
			}

			/* CONTINUE Drawing */
			if (cmd.startsWith("DRAWTO")) {
				if (quickanddirty == 0) {
					DebugPanel.debugPrint("continue drawing", Id);
				}
				quickanddirty += 1;
				int x = ev.getX();
				int y = ev.getY();

				if (isDrawingActive()) {
					ctx.lineTo(x, y);
					ctx.stroke();
					myGestureManager.gesturing(x, y, false); // ignoretime=false
					if (state == STATE_RECORD_1) {
						graffitiTimer.schedule(time_1); // restart
					}
				}
			}

			/* STOP Drawing */
			if (cmd.startsWith("STOP_DRAWING")) {
				if (isDrawingActive()) {
					DebugPanel.debugPrint("stop drawing by mouseup", Id);
					quickanddirty = 0;
					ctx.closePath();
					setDrawingActive(false);
					if (state == STATE_RECORD_1) {
						graffitiTimer.cancel();
						graffitiTimer.schedule(time_2);
						myGestureManager.stopGesture();
						gesture_1 = myGestureManager.getGesture();
						setState(STATE_WAIT);
					}
					if (state == STATE_RECORD_2) {
						graffitiTimer.cancel();
						myGestureManager.stopGesture();
						gesture_2 = myGestureManager.getGesture();
						myGestureManager.startGesture(startpoint_1_x,
								startpoint_1_y);
						myGestureManager.gesturing(startpoint_2_x,
								startpoint_2_y, true); // ignoretime=true
						String s1_s2 = myGestureManager.getGesture();
						setState(STATE_READY);
						DebugPanel.debugCls();
						DebugPanel.debugPrint("gesture_1="
								+ gesture_1, Id);
						DebugPanel.debugPrint("gesture_2="
								+ gesture_2, Id);
						DebugPanel.debugPrint("s1_s2=" + s1_s2, Id);
						String match = myGestureManager.matchTwoGestures(
								gesture_1, gesture_2, s1_s2);
						DebugPanel.debugPrint("match(2)="+match, Id);
						ArrayList<Gesture> doublegestures = myGestureManager
								.getSortedDoubleGestures();
						String h = "";
						for (int i = 0; i < doublegestures.size(); i++) {
							Gesture gesture = doublegestures.get(i);
							// DebugPanel.debugPrint(
							// " " + gesture.getDistance() + " "
							// + gesture.getGestureName(), Id);
							h = h + gesture.getGestureName() + " ";
						}
						DebugPanel.debugPrint(h, Id);
						drawMatch(match);
						execute(match);
					}
				}
			}
	}

	private void do_timer() {
		DebugPanel.debugPrint("stop drawing by timer", Id);
		quickanddirty = 0;
		setState(STATE_READY);
		myGestureManager.stopGesture();
		setDrawingActive(false);
		gesture_1 = myGestureManager.getGesture();
		// DebugPanel.debugCls();
		String match = myGestureManager.matchOneGesture(gesture_1);
		DebugPanel.debugPrint("match(1)="+match, Id);
		ArrayList<Gesture> gestures = myGestureManager.getSortedGestures();
		String h = "";
		for (int i = 0; i < gestures.size(); i++) {
			Gesture gesture = gestures.get(i);
			// DebugPanel.debugPrint(" " + gesture.getDistance() + " "
			// + gesture.getGestureName(), Id);
			h = h + gesture.getGestureName() + " ";
		}
		DebugPanel.debugPrint(h, Id);
		drawMatch(match);
		execute(match);
	}

	private void drawMatch(String match) {
		ctx.clearRect(0, 0, _width, _height);
		ctx.save();
		ctx.setFont("24px Verdana");
		if (!match.equals("<?>")) {
			ctx.setFillStyle("blue");
		} else {
			match = "?";
			ctx.setFillStyle("red");
		}
		ctx.fillText(match, _width / 2 - 20, _height / 2);
		ctx.restore();
	}

	private void execute(String match) {
		if (match.length() == 1) {
			String haystack = "0123456789";
			if (haystack.indexOf(match) >= 0) {
				DebugPanel.debugPrint("*** NUMBER-" + match, Id);
//				CommandEventProvider.fireCommandEvent("commandmanager", Id,
//						match, "NUMBER-");
				FaEventProvider.fireFaEvent(match,"NUMBER-");
			}
			haystack = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
			if (haystack.indexOf(match) >= 0) {
//				CommandEventProvider.fireCommandEvent("commandmanager", Id,
//						match, "CHAR-");
				FaEventProvider.fireFaEvent(match,"CHAR-");
			}
		} else {
			int position = match.indexOf("-");
			String modifier = match.substring(0, position + 1);
			String command = match.substring(position + 1);
//			CommandEventProvider.fireCommandEvent("commandmanager", Id,
//					command, modifier);
			FaEventProvider.fireFaEvent(command, modifier);
		}
	}

	private void setDrawingActive(boolean drawingActive) {
		_drawingActive = drawingActive;
	}

	private boolean isDrawingActive() {
		return _drawingActive;
	}

	private void setState(int state) {
		this.state = state;
		String message = "";
		switch (state) {
		case STATE_READY:
			message = "READY";
			break;
		case STATE_RECORD_1:
			message = "RECORD_1";
			break;
		case STATE_RECORD_2:
			message = "RECORD_2";
			break;
		case STATE_WAIT:
			message = "WAIT";
			break;
		default:
			message = "unknown";
			break;
		}
		DebugPanel.debugPrint("Graffitipanel STATE= " + message, Id);
	}

}
