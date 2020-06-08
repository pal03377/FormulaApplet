package gut.client;

import java.util.EventObject;

/**
 *
 * <p>FaEvent, based on CommandEvent</p>
 *
 * <p>Passing commands from one object to another. </p>
 * <p>Used to pass commands from embedded objects to embedding objects,<br>
 * e.g. from RightClickMenu or ExPanel to Editor or InputApplet.</p>
 * <p>Sender (source) has to use method FaEventProvider.FireCommandEvent().</p>
 * <p>A target class has to implement a FaEventListener by implementing the method EventReceived() and</p> 
 * <p>adding itself as FaEventListener by doing FaEventProvider.addFaEventListener(this) in the constructor</p>
 *
 * @author Rudolf Grossmann

 * @version gf08 24.11 (30. August 2016)
 */

public class FaEvent extends EventObject {
	private static final long serialVersionUID = -5678787569493633886L;
	private String _command, _kind;
	private int _x, _y;

	public FaEvent(String command, String kind, int x, int y, String source) {
		super(source);
		_command = command;
		_kind = kind;
		_x = x;
		_y = y;
	}
	
	public String getCommand() {
		return _command;
	}

	public String getKind() {
		return _kind;
	}

	public int getX() {
		return _x;
	}

	public int getY() {
		return _y;
	}
}
