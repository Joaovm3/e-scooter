import { Redirect, Tabs, usePathname, router, Stack } from 'expo-router';
import React from 'react';
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

export default function TabLayout() {
  const { user } = useAuth();
  if (!user) {
    return <Redirect href="/(sign-out)/login" />;
  }

  const pathname = usePathname();
  const colorScheme = useColorScheme();
  const showBackButton = !['/scan'].includes(pathname);

  const PreviousRouter = () => {
    return (
      <Pressable onPress={() => router.back()} style={styles.previousButton}>
        <IconSymbol
          name="chevron.left"
          size={24}
          color={Colors[colorScheme ?? 'light'].text}
        />
      </Pressable>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <Stack
        screenOptions={({ route }) => ({
          headerTitle: '',
          headerTransparent: true,
          headerLeft: showBackButton ? PreviousRouter : undefined,
        })}
      ></Stack>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
    justifyContent: 'center',
  },
  previousButton: {
    // marginRight: 30,
    // margin: 0,
    // marginLeft: 10,
    // width: 36,
    // height: 36,
    // borderRadius: 18,
    // alignItems: 'center',
    // justifyContent: 'center',
    // backgroundColor: 'rgba(255, 255, 255, 0.1)',
    // backgroundColor: 'red',
  },
});
