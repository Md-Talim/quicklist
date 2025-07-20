import { useState } from "react";
import { ScrollView, StyleSheet, TextInput, View } from "react-native";
import { ShoppingListItem } from "../components/ShoppingListItem";
import { theme } from "../theme";

interface ShoppingListItem {
  id: string;
  name: string;
}

const initialShoppingList: ShoppingListItem[] = [
  { id: "1", name: "Coffee" },
  { id: "2", name: "Tea" },
  { id: "3", name: "Sugar" },
];

export default function App() {
  const [shoppingList, setShoppingList] =
    useState<ShoppingListItem[]>(initialShoppingList);

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
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 24 }}
      stickyHeaderIndices={[0]}
    >
      <TextInput
        placeholder="E.g. Coffee"
        style={styles.textInput}
        value={newItemName}
        onChangeText={setNewItemName}
        onSubmitEditing={handleSubmit}
      />
      <View>
        {shoppingList.map((item) => (
          <ShoppingListItem key={item.id} name={item.name} />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colorWhite,
    paddingTop: 12,
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
