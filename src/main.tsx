import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Personal from "./navigation/Personal";
import Program from "./navigation/Program";
import Consultancy from "./navigation/Consultancy";

const Tab = createBottomTabNavigator();

export default function Main() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen name="Program" component={Program} />
        <Tab.Screen name="Personal" component={Personal} />
        <Tab.Screen name="Consultancy" component={Consultancy} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
