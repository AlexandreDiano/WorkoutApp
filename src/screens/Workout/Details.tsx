import React, { useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Card, Text } from "react-native-paper";

interface IRouteParams {
  workoutId: string | number | undefined;
  name: string | undefined;
}

export default function WorkoutDetails() {
  const route = useRoute();
  const navigation = useNavigation();

  const { workoutId, name, workout }: any = route.params;

  useEffect(() => {
    navigation.setOptions({ title: name });
  }, [navigation, name]);

  return (
    <SafeAreaView style={style.container}>
      <ScrollView>
        {workout.Exercises.map((item: any) => (
          <TouchableOpacity key={item.ID}>
            <Card style={style.card}>
              <View style={style.cardRow}>
                <Card.Cover
                  source={{ uri: "https://picsum.photos/1" }}
                  style={style.image}
                />
                <Card.Content style={style.cardContent}>
                  <Text variant="titleLarge">{item.Name}</Text>
                  {/*<Text variant="bodyLarge">35° de Inclinação</Text>*/}
                </Card.Content>
              </View>
            </Card>
          </TouchableOpacity>
        ))}
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
    paddingVertical: 15,
    margin: 10,
    width: 450,
    zIndex: 5,
    justifyContent: "center",
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardContent: {
    flex: 1,
  },
  image: {
    width: 200,
    height: 125,
    marginLeft: 10,
  },
});
