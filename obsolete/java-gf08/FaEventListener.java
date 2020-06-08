package gut.client;


// uses FaEvent

/**
 * @author Rudolf Grossmann

 * @version gf08 24.11 (30. August 2016)
*/

public interface FaEventListener {
		// Method FaEventReceived() will be overwritten in classes implementing interface FaEventListener
	    public void faEventReceived(FaEvent ev);
}
