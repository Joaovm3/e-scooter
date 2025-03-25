import { TextInput, TextInputProps, StyleSheet } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

interface InputProps extends TextInputProps {
  variant?: 'default' | 'outlined';
}

export function Input({ style, variant = 'default', ...props }: InputProps) {
  const colorScheme = useColorScheme() || 'light';

  return (
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
  );
}

const styles = StyleSheet.create({
  base: {
    height: 48,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: 'transparent',
  },
  outlined: {
    borderWidth: 1,
  },
});
