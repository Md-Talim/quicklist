import * as Haptics from "expo-haptics";
import { useEffect, useState } from "react";
import {
  FlatList,
  LayoutAnimation,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { ShoppingListItem } from "../components/ShoppingListItem";
import { theme } from "../theme";
import { getFromStorage, saveToStorage } from "../utils/storage";

interface ShoppingListItem {
  id: string;
  name: string;
  lastUpdatedTimestamp: number;
  completedAtTimestamp?: number;
}

const storageKey = "shopping-list";

export default function App() {
  const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>([]);
  const [newItemName, setNewItemName] = useState("");

  useEffect(() => {
    const fetchInitialShoppingList = async () => {
      const data = await getFromStorage(storageKey);
      if (data) {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setShoppingList(data);
      }
    };
    fetchInitialShoppingList();
  }, []);

  const handleSubmit = () => {
    if (newItemName) {
      const id = new Date().toISOString();
      const newShoppingList: ShoppingListItem[] = [
        { id: id, name: newItemName, lastUpdatedTimestamp: Date.now() },
        ...shoppingList,
      ];
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      saveToStorage(storageKey, newShoppingList);
      setShoppingList(newShoppingList);
      setNewItemName("");
    }
  };

  const handleDelete = (idToDelete: string) => {
    const newShoppingList = shoppingList.filter(
      (item) => item.id !== idToDelete
    );
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    saveToStorage(storageKey, newShoppingList);
    setShoppingList(newShoppingList);
  };

  const handleToggleComplete = (idToMarkComplete: string) => {
    const newShoppingList: ShoppingListItem[] = shoppingList.map((item) => {
      if (item.id !== idToMarkComplete) return item;
      if (item.lastUpdatedTimestamp) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      return {
        ...item,
        lastUpdatedTimestamp: Date.now(),
        completedAtTimestamp: item.completedAtTimestamp
          ? undefined
          : Date.now(),
      };
    });
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    saveToStorage(storageKey, newShoppingList);
    setShoppingList(newShoppingList);
  };

  return (
    <FlatList
      data={orderShoppingList(shoppingList)}
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
      renderItem={({ item }) => (
        <ShoppingListItem
          name={item.name}
          onDelete={() => handleDelete(item.id)}
          onToggleComplete={() => handleToggleComplete(item.id)}
          isCompleted={Boolean(item.completedAtTimestamp)}
        />
      )}
    />
  );
}

function orderShoppingList(shoppingList: ShoppingListItem[]) {
  return shoppingList.sort((item1, item2) => {
    if (item1.completedAtTimestamp && item2.completedAtTimestamp) {
      return item2.completedAtTimestamp - item1.completedAtTimestamp;
    }

    if (item1.completedAtTimestamp && !item2.completedAtTimestamp) {
      return 1;
    }

    if (!item1.completedAtTimestamp && item2.completedAtTimestamp) {
      return -1;
    }

    if (!item1.completedAtTimestamp && !item2.completedAtTimestamp) {
      return item2.lastUpdatedTimestamp - item1.lastUpdatedTimestamp;
    }

    return 0;
  });
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
