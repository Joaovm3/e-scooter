import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, TextStyle } from 'react-native';
import { ThemedText } from './ThemedText';

interface AnimatedCounterProps {
  value: number;
  formatValue?: (value: number) => string;
  duration?: number;
  style?: TextStyle;
  type?: 'title' | 'subtitle' | 'body';
}

export function AnimatedCounter({
  value,
  formatValue = (val) => val.toFixed(2),
  duration = 500,
  style,
  type,
}: AnimatedCounterProps) {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const previousValue = useRef(0);

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: value,
      duration,
      useNativeDriver: true,
    }).start();
    previousValue.current = value;
  }, [value, duration]);

  const animatedText = animatedValue.interpolate({
    inputRange: [previousValue.current, value],
    outputRange: [previousValue.current, value],
  });

  return (
    <Animated.Text style={[styles.text, style]}>
      {animatedText.interpolate({
        inputRange: [0, value],
        outputRange: [0, value].map((v) => formatValue(v)),
      })}
    </Animated.Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    fontWeight: '600',
    color: '#27272A',
  },
});
