import {
  TouchableOpacity,
  type TouchableOpacityProps,
  StyleSheet,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ThemedText } from './ThemedText';
import { useColorScheme } from 'react-native';

export type ThemedButtonProps = TouchableOpacityProps & {
  lightColor?: string;
  darkColor?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  type?: 'default' | 'action' | 'primary' | 'secondary';
  size?: number;
  iconColor?: string;
  title: string;
  iconPosition?: 'left' | 'right';
};

export function ThemedButton({
  style,
  lightColor,
  darkColor,
  icon,
  type = 'default',
  size = 24,
  iconColor,
  title,
  iconPosition = 'left',
  ...rest
}: ThemedButtonProps) {
  const colorScheme = useColorScheme();
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    'background',
  );

  const defaultTextColor = useThemeColor(
    {
      light: type === 'default' ? '#000' : '#fff', //'#fff'
      dark: type === 'default' ? '#fff' : '#000', //'#fff'
    },
    'text',
  );

  const color = iconColor || defaultTextColor;

  return (
    <TouchableOpacity
      style={[{ backgroundColor }, styles.button, styles[type], style]}
      {...rest}
    >
      <View
        style={[
          styles.content,
          iconPosition === 'right' && styles.reverseContent,
        ]}
      >
        {icon && iconPosition === 'left' && (
          <Ionicons
            name={icon}
            size={size}
            color={color}
            style={styles.leftIcon}
          />
        )}
        <ThemedText style={[styles.text, { color }]} type="defaultSemiBold">
          {title}
        </ThemedText>
        {icon && iconPosition === 'right' && (
          <Ionicons
            name={icon}
            size={size}
            color={color}
            style={styles.rightIcon}
          />
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reverseContent: {
    flexDirection: 'row-reverse',
  },
  text: {
    textAlign: 'center',
  },
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
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
