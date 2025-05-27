import {
  Redirect,
  Tabs,
  usePathname,
  router,
  Stack,
  useGlobalSearchParams,
} from 'expo-router';
import React, { useEffect } from 'react';
import {
  ActivityIndicator,
  Platform,
  Image,
  Pressable,
  StyleSheet,
} from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuth } from '@/contexts/AuthContext';
import { ThemedIconButton } from '@/components/ThemedIconButton';
import { ThemedView } from '@/components/ThemedView';

export default function TabLayout(test: any) {
  const { user } = useAuth();
  if (!user) {
    return <Redirect href="/(sign-out)/login" />;
  }

  const { headerTitle } = useGlobalSearchParams<{ headerTitle: string }>();
  const [title, setTitle] = React.useState<string>(headerTitle || '');
  useEffect(() => {
    setTitle(headerTitle || '');
  }, [headerTitle]);

  const pathname = usePathname();
  const colorScheme = useColorScheme();
  const fullScreenPage = ['/scan'].includes(pathname);

  const PreviousRouter = () => {
    return (
      <Pressable onPress={() => router.back()} style={styles.previousButton}>
        <IconSymbol
          name="chevron.left"
          size={Platform.OS === 'ios' ? 24 : 40}
          color={Colors[colorScheme ?? 'light'].text}
        />
      </Pressable>
    );
  };

  return (
    <ThemedView
      style={[styles.container, !fullScreenPage && styles.containerSpace]}
    >
      <Stack
        screenOptions={({ route }) => ({
          headerTitle: title,
          headerTitleStyle: { fontSize: 20 },
          headerTitleAlign: 'center',
          headerTransparent: fullScreenPage,
          headerShadowVisible: false,
          headerLeft: !fullScreenPage ? PreviousRouter : undefined,
        })}
      ></Stack>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  containerSpace: {
    // margin: 20,
    padding: 20,
    // backgroundColor: 'blue',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  previousButton: {
    // fontSize: 20,
    // marginRight: 30,
    // margin: 0,
    // marginLeft: 10,
    // width: 36,
    // height: 36,
    // borderRadius: 18,
    // alignItems: 'center',
    // justifyContent: 'center',
    // backgroundColor: 'red',
  },
});
