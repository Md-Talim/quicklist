import { Entypo } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { theme } from "../theme";

interface ShoppingListItemProps {
  name: string;
  isCompleted?: boolean;
  onDelete: () => void;
  onToggleComplete: () => void;
}

export function ShoppingListItem({
  name,
  isCompleted,
  onDelete,
  onToggleComplete,
}: ShoppingListItemProps) {
  const handleDelete = () => {
    Alert.alert(
      "Are you sure you want to delete this?",
      "It will be gone for good.",
      [
        {
          text: "Yes",
          onPress: () => onDelete(),
          style: "destructive",
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ]
    );
  };

  return (
    <Pressable
      style={[
        styles.itemContainer,
        isCompleted && styles.completedItemContainer,
      ]}
      onPress={onToggleComplete}
    >
      <View style={styles.row}>
        <Entypo
          name={isCompleted ? "check" : "circle"}
          size={24}
          color={isCompleted ? theme.colorGray : theme.colorBlue}
        />
        <Text
          numberOfLines={1}
          style={[styles.itemText, isCompleted && styles.completedItemText]}
        >
          {name}
        </Text>
      </View>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handleDelete}
        disabled={isCompleted}
      >
        <AntDesign
          name="closecircle"
          size={24}
          color={isCompleted ? theme.colorGray : theme.colorRed}
        />
      </TouchableOpacity>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colorBlue,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  completedItemContainer: {
    backgroundColor: theme.colorLightGray,
    borderBottomColor: theme.colorLightGray,
    color: theme.colorGray,
  },
  itemText: {
    fontSize: 18,
    fontWeight: 200,
    flex: 1,
  },
  completedItemText: {
    color: theme.colorGray,
    textDecorationLine: "line-through",
  },
  row: {
    flexDirection: "row",
    gap: 8,
    flex: 1,
  },
});
