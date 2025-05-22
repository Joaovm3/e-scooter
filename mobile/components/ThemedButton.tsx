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
import { ThemedView } from './ThemedView';

export type ThemedButtonProps = TouchableOpacityProps & {
  lightColor?: string;
  darkColor?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  type?: 'default' | 'action' | 'primary' | 'secondary';
  size?: number;
  iconColor?: string;
  title: string;
  iconPosition?: 'left' | 'right';
  CustomIcon?: () => JSX.Element;
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
  CustomIcon,
  ...rest
}: ThemedButtonProps) {
  const colorScheme = useColorScheme();
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    'background',
  );

  const defaultTypes = ['default', 'secondary'];
  const defaultTextColor = useThemeColor(
    {
      light: defaultTypes.includes(type) ? '#000' : '#fff', //'#fff'
      dark: defaultTypes.includes(type) ? '#fff' : '#000', //'#fff'
    },
    'text',
  );

  const color = iconColor || defaultTextColor;
  const Icon = CustomIcon ? (
    <CustomIcon />
  ) : (
    <Ionicons name={icon} size={size} color={iconColor} />
  );

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
          <ThemedView style={styles.leftIcon}>{Icon}</ThemedView>
        )}

        <ThemedText style={[styles.text, { color }]} type="defaultSemiBold">
          {title}
        </ThemedText>

        {icon && iconPosition === 'right' && (
          <ThemedView style={styles.rightIcon}>{Icon}</ThemedView>
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
    backgroundColor: 'transparent',
    marginRight: 8,
  },
  rightIcon: {
    backgroundColor: 'transparent',
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
    backgroundColor: '#1294E2',
    borderRadius: 8,
  },
  secondary: {
    // backgroundColor: '#4285F4',
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
  },
});
