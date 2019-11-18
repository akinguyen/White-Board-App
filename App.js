import React from "react";
import { StyleSheet, Text, View } from "react-native";

// You can import from local files
import AssetExample from "./components/Main";
// or any pure javascript modules available in npm
export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}> 🔥 WhiteBoard Hack 🔥 </Text>
      <AssetExample />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    width: "100%",
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  title: {
    margin: 2,
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center"
  }
});
