import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  Dimensions,
  Animated,
  Easing,
  StyleSheet,
  Text,
  View,
} from "react-native";
import DealList from "./components/DealList";
import DealDetail from "./components/DealDetails";
import SearchBar from "./components/SearchBar";
import ajax from "./api/ajax";

export default function App() {
  const titleXPos = new Animated.Value(0);
  const [deals, setDeals] = useState([]);
  const [dealsFromSearch, setDealsFromSearch] = useState([]);
  const [currentDealID, setCurrentDealID] = useState(null);
  const [activeSearchTerm, setActiveSearchTerm] = useState("");

  const animateTitle = (direction = 1) => {
    const windowWidth = Dimensions.get("window").width - 150;
    Animated.timing(titleXPos, {
      toValue: direction * (windowWidth / 2),
      duration: 1000,
      easing: Easing.ease,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished) {
        animateTitle(-1 * direction);
      }
    });
  };

  useEffect(() => {
    async function getInitDeals() {
      animateTitle();
      let apiResponse = await ajax.fetchInitialDeals();
      setDeals(apiResponse);
    }
    getInitDeals();
  });

  const searchDeals = async (searchTerm) => {
    setDealsFromSearch([]);

    if (searchTerm) {
      let apiResponse = await ajax.fetchDealSearchResults(searchTerm);

      setDealsFromSearch(apiResponse);
      setActiveSearchTerm(searchTerm);
    }
  };

  const setCurrentDeal = (dealId) => {
    setCurrentDealID(dealId);
  };

  const unsetCurrentDeal = () => {
    setCurrentDealID(null);
  };

  const currentDeal = () => {
    return deals.find((deal) => deal.key === currentDealID);
  };

  if (currentDealID) {
    return (
      <View style={styles.main}>
        <DealDetail initialDealData={currentDeal()} onBack={unsetCurrentDeal} />
      </View>
    );
  }

  const dealsToDisplay = dealsFromSearch.length > 0 ? dealsFromSearch : deals;

  if (dealsToDisplay.length > 0) {
    return (
      <View style={styles.main}>
        <SearchBar
          searchDeals={searchDeals}
          initialSearchTerm={activeSearchTerm}
        />
        <DealList deals={dealsToDisplay} onItemPress={setCurrentDeal} />
      </View>
    );
  }

  // Default view to render
  return (
    <Animated.View style={[{ left: titleXPos }, styles.container]}>
      <Text style={styles.header}>Bakesale</Text>
      <StatusBar style="auto" />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  main: {
    marginTop: 30,
  },
  header: {
    fontSize: 40,
  },
});
