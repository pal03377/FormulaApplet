/*
 * Copyright 2009 Marc Englund <marc.englundATitmill.com>
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

/* see http://marcenglund.blogspot.de/2009/04/gesture-recognition-in-gwt-and-it-mill.html */
package gut.client;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.Iterator;

public class GestureManager {

	public static final String TAG = "simplegesture";
	public static final String ATTR_MAXDISTANCE = "maxdist";
	public static final String ATTR_RECORD = "rec";
	public static final String ATTR_NORMALIZE = "norm";
	public static final String TARGET_REF = "target";
	public static final String GESTURES_TAG = "gestures";
	public static final String GESTURE_TAG = "gesture";
	public static final String GESTURE_ATTR_MOVES = "moves";

	public static final String VAR_MATCHED = "matched";
	public static final String VAR_MOVED = "moved";
	public static final String VAR_DISTANCE = "dist";

	public static final int FREQUENCY = 20;
	public static final int MIN_MOUSEMOVE = 20;
	public static final int DIRECTIONS = 8;
	public static final int MAXDISTANCE = 20;

	private boolean recording = false; // record-mode
	private int maxDistance = MAXDISTANCE; // Levensthein distance limit
	private boolean moving = false; // tracking a gesture
	// last recorded 'move' data:
	private int lastX = -1;
	private int lastY = -1;
	private long lastMoveTime = 0;

	private boolean normalize = false;
	private int lastMove = -1;
	private String moved = ""; // moves thus far
	// ArrayList of known gestures
	private static ArrayList<Gesture> gestures = new ArrayList<Gesture>();
	// ArrayList of known gestures
	private static ArrayList<Gesture> doublegestures = new ArrayList<Gesture>();
	// gesture listeners
	private static ArrayList<GestureListener> listeners = new ArrayList<GestureListener>();
	private String _id = "<?>";

	public GestureManager() {
		// numbers
		gestures.add(new Gesture("432107654", "0"));
		gestures.add(new Gesture("012345670", "0"));
		gestures.add(new Gesture("77222", "1"));
		gestures.add(new Gesture("222", "1"));
		doublegestures.add(new Gesture("00333-00-1", "2"));
		gestures.add(new Gesture("70123300", "2"));
		gestures.add(new Gesture("0123401234", "3"));
		doublegestures.add(new Gesture("2200-222-1", "4"));
		gestures.add(new Gesture("442201234", "5"));
		doublegestures.add(new Gesture("2201234-000-1", "5"));
		gestures.add(new Gesture("3321076543", "6"));
		gestures.add(new Gesture("00332", "7"));
		doublegestures.add(new Gesture("00333-00-2", "7"));
		gestures.add(new Gesture("012332107655670", "8"));
		gestures.add(new Gesture("56701233210765", "8"));
		gestures.add(new Gesture("3456701233", "9"));
		gestures.add(new Gesture("4321076622345", "9"));

		// small letters
		gestures.add(new Gesture("42207621", "a"));
		doublegestures.add(new Gesture("7012210-43210-1", "a"));
		gestures.add(new Gesture("22226701234", "b"));
		doublegestures.add(new Gesture("2222-01234-2", "b"));
		gestures.add(new Gesture("4321", "c"));
		gestures.add(new Gesture("4321076662221", "d"));
		doublegestures.add(new Gesture("43210-22210-6", "d"));
		gestures.add(new Gesture("0065432107", "e"));
		doublegestures.add(new Gesture("543222-00-3", "f"));
		doublegestures.add(new Gesture("111-333-0", "x"));
		
		// big letters
		doublegestures.add(new Gesture("666222-000-2", "A"));
		gestures.add(new Gesture("44332211", "C"));
		doublegestures.add(new Gesture("444222-000-3", "F"));
		doublegestures.add(new Gesture("222-000-0", "T"));
		gestures.add(new Gesture("111777", "V"));
		
		doublegestures.add(new Gesture("222-000-3", "OPERATOR-PLUS"));
		gestures.add(new Gesture("000", "OPERATOR-MINUS"));
		gestures.add(new Gesture("0000000", "OPERATOR-FRAC"));
		gestures.add(new Gesture("444", "CMD-BACKSPACE"));
		gestures.add(new Gesture("666", "CURSOR-UP"));
		gestures.add(new Gesture("777111", "CURSOR-UP"));
		doublegestures.add(new Gesture("22-1177-3", "CURSOR-DOWN"));
		gestures.add(new Gesture("2226660002", "OPERATOR-ROOT"));
//		gestures.add(new Gesture("111", "->SouthEast"));
//		gestures.add(new Gesture("333", "->SouthWest"));
//		gestures.add(new Gesture("555", "->NorthWest"));
//		gestures.add(new Gesture("777", "->NorthEast"));

		

		// RootPanel root = RootPanel.get();
		// // TODO own event adding (jsni or wait for GWT 1.6?)
		// if (evp == null) {
		// evp = new EventPreview() {
		// public boolean onEventPreview(Event event) {
		// return handleEvent(event);
		// }
		// };
		// DOM.addEventPreview(evp);
		// }
		// // Add a hidden div that represents this component
		// setElement(Document.get().createDivElement());
		//
		// // if (BrowserInfo.get().isIE6()) {
		// // getElement().getStyle().setProperty("overflow", "hidden");
		// // getElement().getStyle().setProperty("height", "0");
		// // }
		// //
		// if(getUserAgent().contains("msie"))
		// {
		// getElement().getStyle().setProperty("overflow", "hidden");
		// getElement().getStyle().setProperty("height", "0");
		// }
	}

	/**
	 * Adds a GestureListener. When a gesture is matched, or record mode is on,
	 * GestureListener.gestureEvent() will be called with the appropriate data.
	 * 
	 * @param listener
	 *            the listener to add
	 */
	public static void addListener(GestureListener listener) {
		// if (listeners == null) {
		// listeners = new ArrayList<GestureListener>();
		// }
		listeners.add(listener);
	}

	/**
	 * Remove a listener added with {@link #addListener(GestureListener)}.
	 * 
	 * @param listener
	 *            the listener to remove
	 */
	public static void removeListener(GestureListener listener) {
		if (listeners != null) {
			listeners.remove(listener);
		}
	}

	/**
	 * Add a gesture. When the gesture is matched, any listeners added with
	 * {@link #addListener(GestureListener)} will be called.
	 * 
	 * @param gestureName
	 *            the gesture to add
	 * @param movement
	 * 			  a movement like "0123401234"
	 */
	public static void addGesture(String movement, String gestureName) {
		Gesture gest = new Gesture(movement, gestureName);
		if (gestures != null) {
			gestures.add(gest);
			DebugPanel.debugPrint(gest.getMovement()
					+ " added. name=" + gest.getGestureName(), "");
		} else {
			DebugPanel.debugPrint("gestures are null", "");
		}
	}

	/**
	 * Removes a gesture previously added with {@link #addGesture(String, String)}
	 * 
	 * @param gesture
	 *            the gesture to remove
	 */
	public static void removeGesture(String gesture) {
		gestures.remove(gesture);
	}

	/**
	 * Get's an iterator that can be used to iterate over the gestures added
	 * with {@link #addGesture(String, String)}
	 * 
	 * @return the gesture iterator
	 */
	public static Iterator<Gesture> getGestureIterator() {
		return gestures.iterator();
	}

	/**
	 * Sets the Levensthein distance limit for matching a gesture: a distance
	 * below this will be considered a match.
	 * 
	 * @param maxDistance
	 *            the Levensthein distance limit
	 */
	public void setMaxDistance(int maxDistance) {
		this.maxDistance = maxDistance;
	}

	/**
	 * Gets the current Levensthein distance limit for matching gestures. A
	 * distance below this will be considered a match.
	 * 
	 * @return the current Levensthein distance limit
	 */
	public int getMaxDistance() {
		return this.maxDistance;
	}

	/**
	 * Turns the record mode on or off. When record mode is on, listeners will
	 * be called even if no gesture is matched.
	 * 
	 * @param recordMode
	 *            recordmode, true=on
	 */
	public void setRecordMode(boolean recordMode) {
		this.recording = recordMode;
	}

	/**
	 * When record mode is on, listeners will be called even if no gesture is
	 * matched.
	 * 
	 * @return true if record mode is on
	 */
	public boolean isRecordMode() {
		return this.recording;
	}

	/**
	 * When normalizing is on, gestures will not contain multiple consecutive
	 * moves in the same direction. This might be useful if you are not
	 * interested in the size of the gesture - note, however, that you can not
	 * make different length 'sides' when normalizing, e.g you can not
	 * distinguish between a square and a rectangle.
	 * 
	 * @param normalize
	 *            true if the gesture should be normalized.
	 */
	public void setNormalizing(boolean normalize) {
		this.normalize = normalize;
	}

	/**
	 * Checks whether or not normalizing is on.
	 * 
	 * @return true if normalizing is on
	 */
	public boolean isNormalizing() {
		return this.normalize;
	}

	/**
	 * Listener for gesture events.
	 * <p>
	 * When the user has performed a potential gesture, the listener will be
	 * called if 1) a gesture is matched, or 2) record mode is on.
	 * </p>
	 * <p>
	 * When record mode is active, 'matched' will contain the gesture that would
	 * have been matched if record mode was off, if such a gesture exists. One
	 * can choose to replace such a gesture, or just go ahead and add a new one.
	 * Distance will tell exactly how similar the matched gesture is.
	 * </p>
	 */
	public interface GestureListener {
		public void handleGestureEvent(String matched, String name,
				String moved, int distance, boolean recordMode, String id);
	}

	// Privates
	// private boolean handleEvent(Event event) {
	// if (event.getButton() != mouseButton) {
	// return true;
	// }
	// int type = event.getTypeInt();
	// switch (type) {
	// case Event.ONMOUSEDOWN:
	// event.preventDefault();
	// startGesture(event);
	// break;
	// case Event.ONMOUSEUP:
	// stopGesture(event);
	// break;
	// case Event.ONMOUSEMOVE:
	// gesturing(event);
	// break;
	// }
	// return true;
	// }

	// public void stopGesture_DELETE(MouseUpEvent event) {
	// // DebugPanel.debugPrint("stopGesture", "GM");
	// moving = false;
	// addPoint(event.getClientX(), event.getClientY());
	// matchGesture();
	// }
	//
	public void stopGesture() {
		// DebugPanel.debugPrint("stopGesture", "GM");
		moving = false;
		// addPoint(x, y);
		matchGesture();
	}

	public String getGesture() {
		return moved;
	}

	// public void startGesture_DELETE(MouseDownEvent event) {
	// // DebugPanel.debugPrint("startGesture", "GM");
	// event.preventDefault();
	// moving = true;
	// lastMove = -1;
	// lastX = event.getClientX();
	// lastY = event.getClientY();
	// moved = "";
	// lastMoveTime = new Date().getTime();
	// }
	//
	public void startGesture(int x, int y) {
		moving = true;
		lastMove = -1;
		lastX = x;
		lastY = y;
		moved = "";
		lastMoveTime = new Date().getTime();
	}

	// public void gesturing_DELETE(MouseMoveEvent event) {
	// // DebugPanel.debugPrint("gesturing", "GM");
	// long now = new Date().getTime();
	// if (!moving || now - lastMoveTime < FREQUENCY) {
	// return;
	// }
	// lastMoveTime = now;
	// addPoint(event.getClientX(), event.getClientY());
	// }
	//
	public void gesturing(int x, int y, boolean ignoretime) {

		long now = new Date().getTime();
		if (!ignoretime) {

		}
		if (!moving || (now - lastMoveTime < FREQUENCY && !ignoretime)) {
			return;
		}
		lastMoveTime = now;
		addPoint(x, y);
	}

	// private void startGesture(Event event) {
	// moving = true;
	// lastMove = -1;
	// lastX = event.getClientX();
	// lastY = event.getClientY();
	// moved = "";
	// lastMoveTime = new Date().getTime();
	// }
	// private void stopGesture(Event event) {
	// moving = false;
	// addPoint(event.getClientX(), event.getClientY());
	// matchGesture();
	// }
	// private void gesturing(Event event) {
	// long now = new Date().getTime();
	// if (!moving || now - lastMoveTime < Common.FREQUENCY) {
	// return;
	// }
	// lastMoveTime = now;
	// addPoint(event.getClientX(), event.getClientY());
	// }

	private void addPoint(int x, int y) {
		int dx = x - lastX;
		int dy = y - lastY;
		int d2 = dx * dx + dy * dy;
		int min2 = MIN_MOUSEMOVE * MIN_MOUSEMOVE;
		if (d2 > min2) {
			this.addMove(dx, dy);
			lastX = x;
			lastY = y;
		}
	}

	private void addMove(int diffX, int diffY) {
		int sec = (int) Math.round(Math.atan2(diffY, diffX)
				* (DIRECTIONS / 2 / Math.PI));
		if (sec < 0) {
			sec = DIRECTIONS + sec;
		}
		if (!normalize || lastMove != sec) {
			moved += sec;
			lastMove = sec;
		}
	}

	public String matchOneGesture(String gest) {
		if (gest == null || gest.length() == 0) {
			return "<?>";
		}
		int currentDistance = Integer.MAX_VALUE;
		Gesture currentGesture = null;
		if (gestures != null) {
			for (int i = 0; i < gestures.size(); i++) {
				Gesture gesture = gestures.get(i);
				int distance = getLevenshteinDistance(gesture.getMovement(),
						gest);
				gesture.setDistance(distance);
				if (distance <= maxDistance && distance < currentDistance) {
					currentDistance = distance;
					currentGesture = gesture;
				}
			}
		}
		if (currentGesture == null) {
			return "<?>";
		} else {
			return currentGesture.getGestureName();
		}
	}

	public String matchTwoGestures(String gest1, String gest2,
			String directionOfStartpoints) {
		if (gest1 == null || gest1.length() == 0 || gest2 == null
				|| gest2.length() == 0) {
			return "<?>";
		}
		if (directionOfStartpoints.equals("")){
			directionOfStartpoints="0";
		}
		int currentDistance = Integer.MAX_VALUE;
		Gesture currentGesture = null;
		if (doublegestures != null) {
			for (int i = 0; i < doublegestures.size(); i++) {
				Gesture gesture = doublegestures.get(i);
				String movement = gesture.getMovement();
				int position = movement.indexOf("-");
				String movement1 = movement.substring(0, position);
				movement = movement.substring(position + 1);
				position = movement.indexOf("-");
				String movement2 = movement.substring(0, position);
				int sp1 = Integer.parseInt(movement.substring(position + 1));

				int distance1 = getLevenshteinDistance(movement1, gest1);
				int distance2 = getLevenshteinDistance(movement2, gest2);

				int distance = distance1 * distance1 + distance2 * distance2;
				distance1 = getLevenshteinDistance(movement1, gest2);
				distance2 = getLevenshteinDistance(movement2, gest1);
				int distance1221 = distance1 * distance1 + distance2
						* distance2;
				if (distance1221 < distance) { // minimum
					distance = distance1221;
				}

				int sp2 = Integer.parseInt(directionOfStartpoints);
				// 
				int distance3 = Math.abs(sp2 - sp1);
				if (distance3 >= 4) {
					distance3 = distance3 - 4;
				}
				if (distance3 >= 3) {
					distance3 = 1;
				}
				distance = distance + distance3 * distance3;
				gesture.setDistance(distance);
				if (distance <= maxDistance && distance < currentDistance) {
					currentDistance = distance;
					currentGesture = gesture;
				}
			}
		}
		if (currentGesture == null) {
			return "<?>";
		} else {
			return currentGesture.getGestureName();
		}
	}
	
	public ArrayList<Gesture> getSortedGestures(){
		Collections.sort(gestures);
		return gestures;
	}

	public ArrayList<Gesture> getSortedDoubleGestures(){
		Collections.sort(doublegestures);
		return doublegestures;
	}

	private void matchGesture() {
		if (moved == null || moved.length() == 0) {
			return;
		}
		int currentDistance = Integer.MAX_VALUE;
		Gesture currentGesture = null;
		if (gestures != null) {
			for (int i = 0; i < gestures.size(); i++) {
				Gesture gesture = gestures.get(i);
				int distance = getLevenshteinDistance(gesture.getMovement(),
						moved);
				if (distance <= maxDistance && distance < currentDistance) {
					currentDistance = distance;
					currentGesture = gesture;
				}
			}
		}
		if (recording || currentGesture != null) {
			fireGestureEvent(currentGesture.getMovement(),
					currentGesture.getGestureName(), moved, currentDistance,
					recording, _id);
		}
	}

	private void fireGestureEvent(String matched, String name, String moved,
			int distance, boolean recordMode, String id) {
		if (listeners != null) {
			for (Iterator<GestureListener> it = listeners.iterator(); it
					.hasNext();) {
				GestureListener listener = it.next();
				listener.handleGestureEvent(matched, name, moved, distance,
						recordMode, id);
			}
		}
	}

	/**
	 * 
	 * Calculates the Levenshtein Distance between two strings. From Jakarta
	 * Commons Lang, StringUtils:
	 * <p>
	 * Chas Emerick has written an implementation in Java, which avoids an
	 * OutOfMemoryError which can occur when my Java implementation is used with
	 * very large strings.<br>
	 * This implementation of the Levenshtein distance algorithm is from <a
	 * href="http://www.merriampark.com/ldjava.htm">http://www
	 * .merriampark.com/ldjava.htm</a>
	 * </p>
	 * 
	 * @param s
	 *            first string
	 * @param t
	 *            second string
	 * @return the Levenshtein Distance between the first and second string
	 */
	public static int getLevenshteinDistance(String s, String t) {
		if (s == null || t == null) {
			throw new IllegalArgumentException("Strings must not be null");
		}
		/*
		 * The difference between this impl. and the previous is that, rather
		 * than creating and retaining a matrix of size s.length()+1 by
		 * t.length()+1, we maintain two single-dimensional arrays of length
		 * s.length()+1. The first, d, is the 'current working' distance array
		 * that maintains the newest distance cost counts as we iterate through
		 * the characters of String s. Each time we increment the index of
		 * String t we are comparing, d is copied to p, the second int[]. Doing
		 * so allows us to retain the previous cost counts as required by the
		 * algorithm (taking the minimum of the cost count to the left, up one,
		 * and diagonally up and to the left of the current cost count being
		 * calculated). (Note that the arrays aren't really copied anymore, just
		 * switched...this is clearly much better than cloning an array or doing
		 * a System.arraycopy() each time through the outer loop.)
		 * 
		 * Effectively, the difference between the two implementations is this
		 * one does not cause an out of memory condition when calculating the LD
		 * over two very large strings.
		 */
		int n = s.length(); // length of s
		int m = t.length(); // length of t
		if (n == 0) {
			return m;
		} else if (m == 0) {
			return n;
		}
		if (n > m) {
			// swap the input strings to consume less memory
			String tmp = s;
			s = t;
			t = tmp;
			n = m;
			m = t.length();
		}
		int p[] = new int[n + 1]; // 'previous' cost array, horizontally
		int d[] = new int[n + 1]; // cost array, horizontally
		int _d[]; // placeholder to assist in swapping p and d
		// indexes into strings s and t
		int i; // iterates through s
		int j; // iterates through t
		char t_j; // jth character of t
		int cost; // cost
		for (i = 0; i <= n; i++) {
			p[i] = i;
		}
		for (j = 1; j <= m; j++) {
			t_j = t.charAt(j - 1);
			d[0] = j;
			for (i = 1; i <= n; i++) {
				cost = s.charAt(i - 1) == t_j ? 0 : 1;
				// minimum of cell to the left+1, to the top+1, diagonally left
				// and up +cost
				d[i] = Math.min(Math.min(d[i - 1] + 1, p[i] + 1), p[i - 1]
						+ cost);
			}
			// copy current distance counts to 'previous row' distance counts
			_d = p;
			p = d;
			d = _d;
		}
		// our last action in the above loop was to switch d and p, so p now
		// actually has the most recent cost counts
		return p[n];
	}

	public String getId() {
		return _id;
	}

	public void setId(String s) {
		_id = s;
	}
}
