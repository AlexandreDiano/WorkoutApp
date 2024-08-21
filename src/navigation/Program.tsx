import * as React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WorkoutList from "@screens/Program/List";
import { TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import ProgramDetails from "@screens/Program/Details";
import WorkoutDetails from "@screens/Workout/Details";
import ProgramForm from "@screens/Program/Form";

const Stack = createNativeStackNavigator();

export default function Program() {
  return (
    <Stack.Navigator initialRouteName="Program">
      <Stack.Screen
        name="ProgramList"
        component={WorkoutList}
        options={({ navigation }) => ({
          title: "Program List",
          headerRight: () => (
            <TouchableOpacity
              style={{ marginRight: 20 }}
              onPress={() => navigation.navigate("ProgramForm")}
            >
              <AntDesign name="plus" size={24} color="black" />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="ProgramDetails"
        component={ProgramDetails}
        options={({ navigation }) => ({
          title: "Program Details",
          headerRight: () => (
            <TouchableOpacity
              style={{ marginRight: 20 }}
              onPress={() => navigation.navigate("ExerciseList")}
            >
              <AntDesign name="edit" size={24} color="black" />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="WorkoutDetails"
        options={({ navigation }) => ({
          title: "Workout Details",
          headerRight: () => (
            <TouchableOpacity
              style={{ marginRight: 20 }}
              onPress={() => navigation.navigate("ExerciseList")}
            >
              <AntDesign name="edit" size={24} color="black" />
            </TouchableOpacity>
          ),
        })}
        component={WorkoutDetails}
      />
      <Stack.Screen
        name="ProgramForm"
        options={{ title: "Create Program" }}
        component={ProgramForm}
      />
    </Stack.Navigator>
  );
}
