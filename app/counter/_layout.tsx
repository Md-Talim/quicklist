import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Link, Stack } from "expo-router";
import { Pressable } from "react-native";
import { theme } from "../../theme";

export default function CounterLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Counter",
          headerRight: () => <HistoryButton />,
        }}
      />
      <Stack.Screen name="history" options={{ title: "History" }} />
    </Stack>
  );
}

function HistoryButton() {
  return (
    <Link href="/counter/history">
      <Pressable hitSlop={20}>
        <FontAwesome5 name="history" size={24} color={theme.colorGray} />
      </Pressable>
    </Link>
  );
}
