import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { theme } from "../theme";

interface ShoppingListItemProps {
  name: string;
  isCompleted?: boolean;
}

export function ShoppingListItem({ name, isCompleted }: ShoppingListItemProps) {
  const handleDelete = () => {
    Alert.alert(
      "Are you sure you want to delete this?",
      "It will be gone for good.",
      [
        {
          text: "Yes",
          onPress: () => console.log("Ok, deleting"),
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
    <View
      style={[
        styles.itemContainer,
        isCompleted && styles.completedItemContainer,
      ]}
    >
      <Text style={[styles.itemText, isCompleted && styles.completedItemText]}>
        {name}
      </Text>
      <TouchableOpacity
        style={[styles.button, isCompleted && styles.completedButton]}
        activeOpacity={0.8}
        onPress={handleDelete}
        disabled={isCompleted}
      >
        <Text style={styles.buttonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    paddingHorizontal: 8,
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
  },
  completedItemText: {
    color: theme.colorGray,
    textDecorationLine: "line-through",
  },
  button: {
    padding: 8,
    backgroundColor: theme.colorBlack,
    borderRadius: 8,
  },
  completedButton: {
    backgroundColor: theme.colorGray,
    borderRadius: 8,
  },
  buttonText: {
    color: theme.colorWhite,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
});
