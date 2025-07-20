import { useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import { ShoppingListItem } from "../components/ShoppingListItem";
import { theme } from "../theme";

interface ShoppingListItem {
  id: string;
  name: string;
}

export default function App() {
  const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>([]);
  const [newItemName, setNewItemName] = useState("");

  const handleSubmit = () => {
    if (newItemName) {
      const id = new Date().toISOString();
      const newShoppingList = [{ id: id, name: newItemName }, ...shoppingList];
      setShoppingList(newShoppingList);
      setNewItemName("");
    }
  };

  return (
    <FlatList
      data={shoppingList}
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 24 }}
      stickyHeaderIndices={[0]}
      ListEmptyComponent={
        <View style={styles.emptyList}>
          <Text>Your shopping list is empty</Text>
        </View>
      }
      ListHeaderComponent={
        <TextInput
          placeholder="E.g. Coffee"
          style={styles.textInput}
          value={newItemName}
          onChangeText={setNewItemName}
          onSubmitEditing={handleSubmit}
        />
      }
      renderItem={({ item }) => <ShoppingListItem name={item.name} />}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colorWhite,
    paddingTop: 12,
  },
  emptyList: {
    alignItems: "center",
    justifyContent: "center",
  },
  textInput: {
    borderWidth: 1,
    borderColor: theme.colorGray,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginHorizontal: 24,
    marginVertical: 24,
    fontSize: 18,
    backgroundColor: theme.colorWhite,
  },
});
