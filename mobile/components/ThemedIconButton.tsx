import {
  TouchableOpacity,
  type TouchableOpacityProps,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useColorScheme } from 'react-native';

export type ThemedIconButtonProps = TouchableOpacityProps & {
  lightColor?: string;
  darkColor?: string;
  icon: keyof typeof Ionicons.glyphMap;
  type?: 'default' | 'action' | 'primary' | 'secondary';
  size?: number;
  iconColor?: string;
};

export function ThemedIconButton({
  style,
  lightColor,
  darkColor,
  icon,
  type = 'default',
  size = 24,
  iconColor,
  ...rest
}: ThemedIconButtonProps) {
  const colorScheme = useColorScheme();
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    'background',
  );

  const defaultIconColor = useThemeColor(
    {
      light: type === 'default' ? '#000' : '#fff',
      dark: type === 'default' ? '#fff' : '#000',
    },
    'text',
  );

  const color = iconColor || defaultIconColor;

  return (
    <TouchableOpacity
      style={[{ backgroundColor }, styles.button, styles[type], style]}
      {...rest}
    >
      <Ionicons name={icon} size={size} color={color} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  default: {
    backgroundColor: 'transparent',
  },
  action: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 24,
  },
  primary: {
    backgroundColor: '#0a7ea4',
    borderRadius: 12,
  },
  secondary: {
    backgroundColor: '#4285F4',
    borderRadius: 12,
  },
});
