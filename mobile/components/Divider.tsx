import React from 'react';
import { StyleSheet } from 'react-native';
import { ThemedView } from './ThemedView';

interface DividerProps {
  marginVertical?: number;
  color?: string;
}

export function Divider({ marginVertical = 10, color = 'gray' }: DividerProps) {
  return (
    <ThemedView
      style={[
        styles.divider,
        {
          marginVertical,
          borderBottomColor: color,
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  divider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    width: '100%',
  },
});
