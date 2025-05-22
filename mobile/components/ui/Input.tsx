import { TextInput, TextInputProps, StyleSheet } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { ThemedText } from '../ThemedText';

interface InputProps extends TextInputProps {
  variant?: 'default' | 'outlined';
  title?: string;
}

export function Input({
  style,
  title,
  variant = 'default',
  ...props
}: InputProps) {
  const colorScheme = useColorScheme() || 'light';

  return (
    <>
      {title && <ThemedText style={styles.title}>{title}</ThemedText>}

      <TextInput
        style={[
          styles.base,
          variant === 'outlined' && styles.outlined,
          {
            color: Colors[colorScheme].text,
            backgroundColor: Colors[colorScheme].background,
            borderColor: Colors[colorScheme].background,
          },
          style,
        ]}
        placeholderTextColor={Colors[colorScheme].tabIconDefault}
        {...props}
      />
    </>
  );
}

const styles = StyleSheet.create({
  title: {
    color: '#52525C',
  },
  base: {
    height: 48,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: 'transparent',
    color: 'red',
  },
  outlined: {
    borderWidth: 1,
  },
});
