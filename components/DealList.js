import { View, FlatList, StyleSheet } from "react-native";
import DealItem from "./DealItem";

export default function DealList(props) {
  return (
    <View style={styles.list}>
      <FlatList
        data={props.deals}
        renderItem={({ item }) => (
          <DealItem deal={item} onPress={props.onItemPress} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    backgroundColor: "#eee",
    width: "100%",
  },
});
