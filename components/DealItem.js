import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { priceDisplay } from "../util";

export default function DealItem(props) {
  const handlePress = () => {
    props.onPress(props.deal.key);
  };
  return (
    <TouchableOpacity style={styles.deal} onPress={handlePress}>
      <Image source={{ uri: props.deal.media[0] }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.title}>{props.title}</Text>
        <View style={styles.footer}>
          <Text style={styles.cause}>{props.deal.cause.name}</Text>
          <Text style={styles.price}>{priceDisplay(props.deal.price)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  deal: {
    marginHorizontal: 12,
    marginTop: 12,
  },
  image: {
    width: "100%",
    height: 150,
    backgroundColor: "#ccc",
  },
  info: {
    padding: 10,
    backgroundColor: "#fff",
    borderColor: "#bbb",
    borderWidth: 1,
    borderTopWidth: 0,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  footer: {
    flexDirection: "row",
  },
  cause: {
    flex: 2,
  },
  price: {
    flex: 1,
    textAlign: "right",
  },
});
