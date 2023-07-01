import debounce from "lodash.debounce";
import { useState, useRef, useEffect, useCallback } from "react";
import { TextInput, StyleSheet } from "react-native";

export default function SearchBar(props) {
  const [searchTerm, setSearchTerm] = useState(props.initialSearchTerm);
  const inputElement = useRef(null);

  const searchDeals = (searchTerm) => {
    props.searchDeals(searchTerm);
    // inputElement.blur(); <-- causes `undefined is not function` error.
  };

  const debouncedSearchDeals = useCallback(debounce(searchDeals, 300), []);

  useEffect(() => {
    debouncedSearchDeals(searchTerm);
  }, [searchTerm]);

  const handleChange = (searchTerm) => {
    setSearchTerm(searchTerm);
  };

  return (
    <TextInput
      ref={inputElement}
      value={searchTerm}
      placeholder="Search All Deals"
      style={styles.input}
      onChangeText={handleChange}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    marginHorizontal: 12,
  },
});
