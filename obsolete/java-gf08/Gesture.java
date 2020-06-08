package gut.client;

public class Gesture implements Comparable<Gesture>{
		private String movement="";
		private String gestureName="<?>";
		private int distance;
		
		Gesture(String mov, String name){
			movement=mov;
			gestureName=name;
		}
		
		public String getMovement() {
			return movement;
		}
		public void setMovement(String movement) {
			this.movement = movement;
		}
		public String getGestureName() {
			return gestureName;
		}
		public void setGestureName(String gestureName) {
			this.gestureName = gestureName;
		}
		public int getDistance() {
			return distance;
		}
		public void setDistance(int distance) {
			this.distance = distance;
		}

		@Override
		public int compareTo(Gesture gest) {
			return this.getDistance() - gest.getDistance();
		}
}
