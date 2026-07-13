import { Feather } from "@expo/vector-icons";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useEffect } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type TabIconName = keyof typeof Feather.glyphMap;

const TAB_ICONS: Record<string, TabIconName> = {
  "ai-teacher": "disc",
  chat: "message-circle",
  home: "home",
  learn: "book-open",
  profile: "user",
};

const ACTIVE_CIRCLE_SIZE = 36;
const BAR_HORIZONTAL_PADDING = 8;

export function AppTabBar({
  descriptors,
  navigation,
  state,
}: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const activeIndex = useSharedValue(state.index);

  const activeRouteName = state.routes[state.index]?.name;
  const activeIconName: TabIconName = activeRouteName
    ? (TAB_ICONS[activeRouteName] ?? "circle")
    : "circle";
  const barWidth = width;
  const tabWidth =
    (barWidth - BAR_HORIZONTAL_PADDING * 2) / state.routes.length;

  useEffect(() => {
    activeIndex.value = withSpring(state.index, {
      damping: 18,
      mass: 0.7,
      stiffness: 180,
    });
  }, [activeIndex, state.index]);

  const circleStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX:
          BAR_HORIZONTAL_PADDING +
          activeIndex.value * tabWidth +
          (tabWidth - ACTIVE_CIRCLE_SIZE) / 2,
      },
    ],
  }));

  return (
    <View
      style={[styles.wrapper, { paddingBottom: Math.max(insets.bottom, 6) }]}
    >
      <View className="relative h-[64px] flex-row border-t border-[#eef0f6] bg-white px-2 pt-1.5">
        <Animated.View
          className="absolute top-1.5 h-9 w-9 items-center justify-center rounded-full bg-lingua-deep-purple"
          pointerEvents="none"
          style={[styles.activeCircle, circleStyle]}
        >
          <Feather
            color="#FFFFFF"
            name={activeIconName}
            size={21}
            strokeWidth={2.8}
          />
        </Animated.View>

        {state.routes.map((route, index) => {
          const options = descriptors[route.key]?.options;
          const isFocused = state.index === index;
          const title =
            options?.title ??
            (typeof options?.tabBarLabel === "string"
              ? options.tabBarLabel
              : route.name);
          const iconName = TAB_ICONS[route.name] ?? "circle";

          function handlePress() {
            const event = navigation.emit({
              canPreventDefault: true,
              target: route.key,
              type: "tabPress",
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          }

          function handleLongPress() {
            navigation.emit({
              target: route.key,
              type: "tabLongPress",
            });
          }

          return (
            <Pressable
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : undefined}
              accessibilityLabel={options?.tabBarAccessibilityLabel}
              className="flex-1 items-center"
              key={route.key}
              onLongPress={handleLongPress}
              onPress={handlePress}
              style={styles.tabButton}
            >
              <View className="h-10 items-center justify-center">
                {!isFocused ? (
                  <Feather
                    color="#7E87A3"
                    name={iconName}
                    size={21}
                    strokeWidth={2.2}
                  />
                ) : null}
              </View>

              {!isFocused ? (
                <Text
                  className="mt-0.5 text-center font-poppins-medium text-[9px] leading-[12px] text-[#7E87A3]"
                  numberOfLines={1}
                >
                  {title}
                </Text>
              ) : null}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  activeCircle: {
    zIndex: 0,
  },
  tabButton: {
    minWidth: 0,
    zIndex: 1,
  },
  wrapper: {
    backgroundColor: "#FFFFFF",
  },
});
