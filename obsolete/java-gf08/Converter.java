package gut.client;

import gut.client.LzwEncoder.CharUnknown;
import gut.client.LzwEncoder.DoNotSend;

import java.util.ArrayList;

import com.google.gwt.core.client.GWT;

// Base64 encode/decode from http://stackoverflow.com/questions/469695/decode-base64-data-in-java
// See also http://www.bennyn.de/programmierung/java/base64-kodieren-und-enkodieren-in-java.html

public class Converter {

	private final static char[] ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".toCharArray();
	private static int[] toInt = new int[128];

	static {
		for (int i = 0; i < ALPHABET.length; i++) {
			toInt[ALPHABET[i]] = i;
		}
	}

	public static byte Hex2Byte(String s) {
		String hex = "0123456789abcdef";
		try {
			int high = hex.indexOf(s.substring(0, 1));
			int low = hex.indexOf(s.substring(1, 2));
			int h = high * 16 + low;
			if (h > 127) {
				h = h - 256;
			}
			return (byte) h;
		} catch (Exception ex) {
			return 0;
		}
	}

	public static String Byte2Hex(byte b) {
		String s = Integer.toHexString((int) b + (b < 0 ? 256 : 0));
		if (s.length() == 1) {
			s = "0" + s;
		}
		return s;
	}

	private static short[] compress(String original) {
		LzwEncoder lzw = new LzwEncoder();
		ArrayList<Short> temp = new ArrayList<Short>();
		original += ".";
		for (int index = 0; index < original.length(); index++) {
			char k = original.charAt(index);
			try {
				short code = lzw.Encode(k);
				temp.add(code);
			} catch (DoNotSend err) {
			} catch (CharUnknown err) {
				GWT.log("Converter: Encode unknown character!");
			}
		}
		short[] result = new short[temp.size()];
		for (int i = 0; i < temp.size(); i++) {
			result[i] = temp.get(i);
		}
		return result;
	}

	private static String inflate(short[] compressed) {
		LzwDecoder lzw = new LzwDecoder();
		StringBuffer result = new StringBuffer();
		for (int index = 0; index < compressed.length; index++) {
			// GWT.log("compressed.length="+compressed.length+" index="+index);
			short code = compressed[index];
			// GWT.log("code="+code);
			try {
				String k = lzw.Decode(code);
				// GWT.log("index="+index+" code="+code+" k="+k);
				result.append(k);
				// GWT.log("result="+result.toString());
			} catch (Error err) {
			}
		}
		return result.toString();
	}

	/**
	 * Translates the specified byte array into Base64 string.
	 * 
	 * @param input 
	 *            the byte array (not null)
	 * @return the translated Base64 string (not null)
	 */
	  private static String encodeBase64(byte[] input) {
		    int size = input.length;
		    char[] ar = new char[((size + 2) / 3) * 4];
		    int a = 0;
		    int i = 0;
		    while (i < size) {
		      byte b0 = input[i++];
		      byte b1 = (i < size) ? input[i++] : 0;
		      byte b2 = (i < size) ? input[i++] : 0;

		      int mask = 0x3F;
		      ar[a++] = ALPHABET[(b0 >> 2) & mask];
		      ar[a++] = ALPHABET[((b0 << 4) | ((b1 & 0xFF) >> 4)) & mask];
		      ar[a++] = ALPHABET[((b1 << 2) | ((b2 & 0xFF) >> 6)) & mask];
		      ar[a++] = ALPHABET[b2 & mask];
		    }
		    switch (size % 3) {
		      case 1:
//		        ar[--a] = '&';
		        ar[--a] = '.';
		      case 2:
//		        ar[--a] = '&';
		        ar[--a] = '.';
		    }
		    return new String(ar);
		  }

	private static short[] byteArray2shortArray(byte[] byteArray) {
	    int len = byteArray.length; //has to be even
	    int len_2 = len / 2;
	    short[] result = new short[len_2];
	    for (int i = 0, j = 0; i < len_2; i++) {
	      byte b1 = byteArray[j++];
	      byte b2 = byteArray[j++];
	      String temp = Byte2Hex(b2) + Byte2Hex(b1);
	      int temp2 = Integer.decode("0x" + temp);
	      short temp3 = (short) temp2;
	      result[i] = temp3;
	    }
	    return result;
	}

	  private static byte[] shortArray2byteArray(short[] shortArray) {
		    int len = shortArray.length;
		    int len_2 = len * 2;
		    byte[] result = new byte[len_2];
		    for (int i = 0, j = 0; i < len; i++) {
		      short temp = shortArray[i];
		      System.out.println(""+i+" temp="+temp);
		      String temp2 = "00000000"+Integer.toHexString(temp);
		      System.out.println(""+i+" temp2="+temp2);
		      String b1 = temp2.substring(temp2.length()-2, temp2.length()); 
		      System.out.println(""+i+" b1="+b1);
		      String b2 = temp2.substring(temp2.length()-4, temp2.length()-2);
		      System.out.println(""+i+" b2="+b2);
		      result[j++] = Hex2Byte(b1);
		      result[j++] = Hex2Byte(b2);
		    }
		    for (int j = 0; j < result.length; j++) {
		      System.out.println(""+j+" res="+result[j]);
		    }
		    return result;
		  }

	/**
	 * Translates the specified Base64 string into a byte array.
	 * 
	 * @param s
	 *            the Base64 string (not null)
	 * @return the byte array (not null)
	 */
	private static byte[] decodeBase64(String s) {
//	    int delta = s.endsWith("&&") ? 2 : s.endsWith("&") ? 1 : 0;
	    int delta = s.endsWith("..") ? 2 : s.endsWith(".") ? 1 : 0;
	    byte[] buffer = new byte[s.length() * 3 / 4 - delta];
	    int mask = 0xFF;
	    int index = 0;
	    for (int i = 0; i < s.length(); i += 4) {
	      int c0 = toInt[s.charAt(i)];
	      int c1 = toInt[s.charAt(i + 1)];
	      buffer[index++] = (byte) (((c0 << 2) | (c1 >> 4)) & mask);
	      if (index >= buffer.length) {
	        return buffer;
	      }
	      int c2 = toInt[s.charAt(i + 2)];
	      buffer[index++] = (byte) (((c1 << 4) | (c2 >> 2)) & mask);
	      if (index >= buffer.length) {
	        return buffer;
	      }
	      int c3 = toInt[s.charAt(i + 3)];
	      buffer[index++] = (byte) (((c2 << 6) | c3) & mask);
	    }
	    return buffer;
	}

	private static String mask(String s) {
		StringBuffer result = new StringBuffer();
		for (int index = 0; index < s.length(); index++) {
			char c = s.charAt(index);
			int code = (int) c;
			if (code < 128) {
				result.append(c);
			} else {
				String hex = "0000" + Integer.toHexString(code);
				//hex = "$u~" + hex.substring(hex.length() - 4, hex.length());
				hex = "$u\u007e" + hex.substring(hex.length() - 4, hex.length());
				// DebugPanel.debugPrint(c + " hex=" + hex, "Converter");
				result.append(hex);
			}
		}
		return result.toString();
	}

	private static String unmask(String s) {
		StringBuffer result = new StringBuffer();
		int pos = 0;
		// while ((pos = s.indexOf("$u~")) >= 0) {
		while ((pos = s.indexOf("$u\u007e")) >= 0) {
			result.append(s.substring(0, pos));
			String hex = s.substring(pos + 3, pos + 7);
			int i = Integer.parseInt(hex, 16);
			char c = (char) i;
			result.append(c);
			//DebugPanel.debugPrint(hex + " -> " + c, "Converter");
			s = s.substring(pos + 7);
		}
		result.append(s);
		return result.toString();
	}
	
	public static String RepresentationToBase64(String rep) {
		// GWT.log("representation="+rep);
		String h = mask(rep);
		// GWT.log("masked="+h);
		h = encodeBase64(shortArray2byteArray(compress(h)));
		// GWT.log("base64="+h);
	    return h;
	    //return encodeBase64(shortArray2byteArray(compress(mask(rep))));
	}
	
	public static String Base64ToRepresentation(String base64) {
		// GWT.log("base64="+base64);
		String h = 	inflate(byteArray2shortArray(decodeBase64(base64)));
		// GWT.log("decoded="+h);
		h = unmask(h);
		// GWT.log("unmasked="+h);
		return h;
//	    return unmask(inflate(byteArray2shortArray(decodeBase64(base64))));
	}
}
