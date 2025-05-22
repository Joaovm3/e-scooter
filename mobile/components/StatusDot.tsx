import React from 'react';
import { StyleSheet } from 'react-native';
import { ThemedView } from './ThemedView';

interface StatusDotProps {
  color: string;
  size?: number;
}

export function StatusDot({ color, size = 8 }: StatusDotProps) {
  return (
    <ThemedView
      style={[
        styles.dot,
        {
          backgroundColor: color,
          width: size,
          height: size,
          borderRadius: size / 2,
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  dot: {
    backgroundColor: '#4CAF50',
  },
});
