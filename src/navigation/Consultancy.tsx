import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Card, Text } from "react-native-paper";

export default function Consultancy() {
  return (
    <SafeAreaView style={style.container}>
      <ScrollView>
        <TouchableOpacity>
          <Card style={style.card}>
            <Card.Content>
              <Text variant="titleLarge">Aulas X</Text>
            </Card.Content>
            <Card.Cover
              source={{ uri: "https://picsum.photos/1" }}
              style={style.image}
            />
          </Card>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    display: "flex",
  },
  card: {
    paddingHorizontal: 10,
    paddingBottom: 10,
    margin: 10,
    width: 450,
    height: 200,
    zIndex: 5,
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  image: {
    height: 140,
    width: 425,
    marginVertical: 5,
  },
});
