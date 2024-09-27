package com.stardustpath.stardustpath.common.utils;

public class StringUtils {
    public static String padLeft(int length, char filler, String string) {
        return String.format("%" + length + "s", string).replace(' ', filler);
    }
}
