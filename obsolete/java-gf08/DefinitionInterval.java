package gut.client;

import gut.client.DebugPanel;

/**
 * @author Rudolf Grossmann

 * @version gf08 24.11 (30. August 2016)
 */

public class DefinitionInterval {
  private String varName = "x";
  private double min = Double.NEGATIVE_INFINITY;
  private double max = Double.POSITIVE_INFINITY;
  private boolean isContainingMin = false;
  private boolean isContainingMax = false;

  public DefinitionInterval() {
  }

  public DefinitionInterval(String varName, double min, boolean isContainingMin, double max, boolean isContainingMax) {
    this.varName = varName;
    this.min = min;
    this.isContainingMin = isContainingMin;
    this.max = max;
    this.isContainingMax = isContainingMax;
  }

  public String getVarName() {
    return varName;
  }

  public double getMin() {
    return min;
  }

  public double getMax() {
    return max;
  }

  public boolean isContainingMax() {
    return isContainingMax;
  }

  public boolean isContainingMin() {
    return isContainingMin;
  }

  public boolean hasSecondPart() {
    return hasSecondPart();
  }

  public boolean setDefinitionInterval(String interval) {
    boolean success = false;
    DebugPanel.debugPrintln(interval, 3);
    return success;
  }
}
