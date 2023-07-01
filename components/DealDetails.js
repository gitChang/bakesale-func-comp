import { useEffect, useState } from "react";
import {
  Dimensions,
  Animated,
  PanResponder,
  Linking,
  StyleSheet,
  TouchableOpacity,
  Image,
  Button,
  Text,
  View,
  ScrollView,
} from "react-native";
import ajax from "../api/ajax";
import { priceDisplay } from "../util";

export default function DealDetails(props) {
  const windowWidth = Dimensions.get("window").width;
  const imageXPos = new Animated.Value(0);
  const imagePanResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (evt, gs) => {
      imageXPos.setValue(gs.dx);
    },
    onPanResponderRelease: (evt, gs) => {
      if (Math.abs(gs.dx) > windowWidth * 0.4) {
        const direction = Math.sign(gs.dx);
        // -1 for left, 1 for right
        Animated.timing(imageXPos, {
          toValue: direction * windowWidth,
          duration: 250,
        }).start(() => handleSwipe(-1 * direction));
      } else {
        Animated.spring(imageXPos, {
          toValue: 0,
        }).start();
      }
    },
  });

  const [deal, setDeal] = useState(props.initialDealData);
  const [imageIndex, setImageIndex] = useState(0);

  const handleSwipe = (indexDirection) => {
    if (!deal.media[imageIndex + indexDirection]) {
      Animated.spring(imageXPos, {
        toValue: 0,
      }).start();
      return;
    }

    const nextImage = () => {
      setImageIndex(imageIndex + indexDirection);
    };

    useEffect(() => {
      // Next image animation
      imageXPos.setValue(indexDirection * windowWidth);
      Animated.spring(imageXPos, {
        toValue: 0,
      }).start();
    }, [imageIndex]);
  };

  useEffect(() => {
    async function getFullDeal() {
      let fullDeal = await ajax.fetchDealDetail(deal.key);
      setDeal(fullDeal);
    }
    getFullDeal();
  }, []);

  const openDealUrl = () => {
    Linking.openURL(deal.url);
  };

  return (
    <View style={styles.deal}>
      <TouchableOpacity onPress={props.onBack}>
        <Text style={styles.backLink}>Back</Text>
      </TouchableOpacity>
      <Animated.Image
        {...imagePanResponder.panHandlers}
        source={{ uri: deal.media[imageIndex] }}
        style={[{ left: imageXPos }, styles.image]}
      />
      <View>
        <Text style={styles.title}>{deal.title}</Text>
      </View>
      <ScrollView>
        <View style={styles.footer}>
          <View style={styles.info}>
            <Text style={styles.price}>{priceDisplay(deal.price)}</Text>
            <Text style={styles.cause}>{deal.cause.name}</Text>
          </View>
          {deal.user && (
            <View style={styles.user}>
              <Image source={{ uri: deal.user.avatar }} style={styles.avatar} />
              <Text>{deal.user.name}</Text>
            </View>
          )}
        </View>
        <View style={styles.description}>
          <Text>{deal.description}</Text>
        </View>
        <Button title="Buy this deal!" onPress={openDealUrl} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  deal: {
    marginBottom: 20,
  },
  backLink: {
    marginBottom: 5,
    color: "#22f",
    marginLeft: 10,
  },
  image: {
    width: "100%",
    height: 150,
    backgroundColor: "#ccc",
  },
  title: {
    fontSize: 16,
    padding: 10,
    fontWeight: "bold",
    backgroundColor: "rgba(237, 149, 45, 0.4)",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 15,
  },
  info: {
    alignItems: "center",
  },
  user: {
    alignItems: "center",
  },
  cause: {
    marginVertical: 10,
  },
  price: {
    fontWeight: "bold",
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  description: {
    borderColor: "#ddd",
    borderWidth: 1,
    borderStyle: "dotted",
    margin: 10,
    padding: 10,
  },
});
