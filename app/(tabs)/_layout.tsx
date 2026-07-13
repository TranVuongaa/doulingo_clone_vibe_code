import { Tabs } from "expo-router";

import { AppTabBar } from "@/components/app-tab-bar";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
      }}
      tabBar={(props) => <AppTabBar {...props} />}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
        }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          title: "Learn",
        }}
      />
      <Tabs.Screen
        name="ai-teacher"
        options={{
          title: "AI Teacher",
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "Chat",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
        }}
      />
    </Tabs>
  );
}
