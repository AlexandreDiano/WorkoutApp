import React, { useCallback, useState } from "react";
import {
  Alert,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, Card, Text } from "react-native-paper";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";

export default function ProgramList({ navigation }: any) {
  const [data, setData] = useState([]);
  const [selectedItems, setSelectedItems] = useState<Set<any>>(new Set());
  const [isDeletionMode, setIsDeletionMode] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPrograms = async () => {
    try {
      const response = await axios.get(
        "http://192.168.100.229:8080/api/v1/programs",
      );
      setData(response.data.data);
    } catch (error) {
      alert("There was an error fetching the programs.");
    }
  };

  // Fetch data whenever the screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchPrograms();
    }, []),
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchPrograms();
    setRefreshing(false);
  };

  const handleLongPress = (item: any) => {
    if (!isDeletionMode) {
      setIsDeletionMode(true); // Enter deletion mode
    }
    toggleSelection(item.ID);
  };

  const handlePress = (item: any) => {
    if (isDeletionMode) {
      toggleSelection(item.ID);
    } else {
      navigation.navigate("ProgramDetails", {
        programId: item.ID,
        name: item.Name,
      });
    }
  };

  const toggleSelection = (id: any) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }

      if (newSet.size === 0) {
        setIsDeletionMode(false);
      }

      return newSet;
    });
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Programs",
      "Are you sure you want to delete the selected programs?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              const idsToDelete = Array.from(selectedItems);

              for (const id of idsToDelete) {
                await axios.delete(
                  "http://192.168.100.229:8080/api/v1/program",
                  {
                    params: { id },
                  },
                );
              }

              const updatedData = data.filter(
                (item) => !selectedItems.has(item.ID),
              );
              setData(updatedData);

              setSelectedItems(new Set());
              setIsDeletionMode(false);

              alert("Programs deleted successfully!");
            } catch (error) {
              console.error("Error deleting programs:", error);
              alert("There was an error deleting the programs.");
            }
          },
          style: "destructive",
        },
      ],
    );
  };

  const handleCancel = () => {
    setSelectedItems(new Set()); // Clear selection
    setIsDeletionMode(false); // Exit deletion mode
  };

  return (
    <SafeAreaView style={style.container}>
      {isDeletionMode && (
        <View style={style.deleteBar}>
          <Button
            mode="contained"
            onPress={handleDelete}
            style={style.deleteButton}
          >
            Delete Selected
          </Button>
          <Button mode="text" onPress={handleCancel} style={style.cancelButton}>
            Cancel
          </Button>
        </View>
      )}
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {data.map((item: any) => (
          <TouchableOpacity
            key={item.ID}
            onPress={() => handlePress(item)}
            onLongPress={() => handleLongPress(item)}
            style={{
              backgroundColor: selectedItems.has(item.ID) ? "#ddd" : "#fff",
            }}
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
  deleteBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    padding: 10,
    backgroundColor: "#f5f5f5",
  },
  deleteButton: {
    flex: 1,
    marginRight: 5,
  },
  cancelButton: {
    flex: 1,
    marginLeft: 5,
  },
});
