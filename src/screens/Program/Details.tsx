import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import axios from "axios";
import { Card, Text } from "react-native-paper";

export default function ProgramDetails({ navigation }: any) {
  const route = useRoute();

  const { programId, name }: any = route.params;
  useEffect(() => {
    navigation.setOptions({ title: name });
  }, [navigation, name]);

  const [data, setData] = useState([]);
  const fetchPrograms = async () => {
    try {
      const response = await axios.get(
        "http://192.168.100.229:8080/api/v1/program",
        { params: { id: programId } },
      );
      setData(response.data.data);
    } catch (error) {
      alert("There was an error fetching the programs.");
      return null;
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  return (
    <SafeAreaView style={style.container}>
      <ScrollView>
        {data.Workouts?.map((item: any) => (
          <TouchableOpacity
            key={item.Name}
            onPress={() =>
              navigation.navigate("WorkoutDetails", {
                workoutId: item.ID,
                name: item.Name,
                workout: item,
              })
            }
          >
            <Card style={style.card}>
              <Card.Content>
                <Text variant="titleLarge">{item.Name}</Text>
              </Card.Content>
              <Card.Cover
                source={{ uri: "https://picsum.photos/1" }}
                style={style.image}
              />
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
