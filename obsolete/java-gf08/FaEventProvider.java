package gut.client;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

// import com.google.gwt.core.shared.GWT;

/**
 * @author Rudolf Grossmann
 * @version gf08 24.11 (30. August 2016)
 */

// command targets has to implement interface FaEventListener
// and overwrite method FaEventReceived(FaEventEvent ev)
// Examples for targets: DebugPanel, FaEventManager, ...
//
public class FaEventProvider {
	private static List<FaEventListener> FaEventListeners = new ArrayList<FaEventListener>();

	public FaEventProvider() {
	}

	public static synchronized void addFaEventListener(FaEventListener listener) {
		System.out.println("FaEventlistener registered: "
				+ listener.getClass().getName());
		FaEventListeners.add(listener);
	}

	public static synchronized void removeFaEventListener(
			FaEventListener listener) {
		FaEventListeners.remove(listener);
	}

	public static synchronized void fireFaEvent(String command, String kind, int x, int y, String source) {
		// GWT.log("*** FaEevent fired: " + kind + command);
		FaEvent ev = new FaEvent(command, kind, x, y, source);
		Iterator<FaEventListener> it = FaEventListeners.iterator();
		// send the event to all FaEventListeners
		while (it.hasNext()) {
			it.next().faEventReceived(ev);
		}
	}

	// abbreviations for convenience //
	public static synchronized void fireFaEvent(String command, String kind, int x, int y) {
		String knd = kind.toUpperCase();
		String cmd = command;
		if (!(knd.startsWith("CHAR") || knd.startsWith("FUNCTION"))) {
			cmd = command.toUpperCase();
		}
		fireFaEvent(cmd, knd, x, y,	"<unknown source>");
	}

	public static synchronized void fireFaEvent(String command, String kind) {
		fireFaEvent(command, kind, 0, 0);
	}
	
	public static synchronized void fireFaEvent(String command) {
		fireFaEvent(command, "CMD-");
	}

}
