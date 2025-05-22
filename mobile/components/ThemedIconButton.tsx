import { Pressable, type PressableProps, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ThemedIconButtonProps extends PressableProps {
  icon?: string;
  CustomIcon?: () => JSX.Element;
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'action' | 'primary' | 'secondary';
  size?: number;
  iconColor?: string;
}

export function ThemedIconButton({
  icon,
  CustomIcon,
  size = 24,
  onPress,
  style,
  lightColor,
  darkColor,
  type = 'default',
  iconColor,
  ...props
}: ThemedIconButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.button, styles[type], style]}
      {...props}
    >
      {CustomIcon ? (
        <CustomIcon />
      ) : (
        <Ionicons name={icon as any} size={size} color={iconColor} />
      )}
    </Pressable>
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
    backgroundColor: '#1294E2',
    borderRadius: 12,
  },
  secondary: {
    backgroundColor: '#4285F4',
    borderRadius: 12,
  },
});
