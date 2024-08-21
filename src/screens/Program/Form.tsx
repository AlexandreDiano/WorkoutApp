import React, { useState } from "react";
import {
  FlatList,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { Video } from "expo-av"; // Assuming you're using Expo, this is a simple video player.
import { data } from "../../exercises";
import { AntDesign } from "@expo/vector-icons";
import axios from "axios";

export default function ProgramForm({ navigation }: any) {
  const [programName, setProgramName] = useState("");
  const [programDescription, setProgramDescription] = useState("");
  const [programGoal, setProgramGoal] = useState("");
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [videoModalVisible, setVideoModalVisible] = useState(false);
  const [selectedWorkoutIndex, setSelectedWorkoutIndex] = useState<
    number | null
  >(null);
  const [selectedExercises, setSelectedExercises] = useState<any>({});
  const [isFinalStep, setIsFinalStep] = useState(false); // Tracks whether we are in the final step
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  const handleAddWorkout = () => {
    setWorkouts([...workouts, { name: "", exercises: [] }]);
  };

  const handleRemoveWorkout = (index: number) => {
    const updatedWorkouts = workouts.filter((_, i) => i !== index);
    setWorkouts(updatedWorkouts);
  };

  const handleExerciseSelection = (exerciseId: number, selected: boolean) => {
    if (selectedWorkoutIndex === null) return;

    const updatedSelectedExercises = {
      ...selectedExercises,
      [selectedWorkoutIndex]: {
        ...selectedExercises[selectedWorkoutIndex],
        [exerciseId]: selected
          ? {
              reps: "10", // Default value
              rest: "60", // Default value in seconds
              sets: "3", // Default value
              ...data.find((ex) => ex.id === exerciseId),
            }
          : undefined,
      },
    };

    setSelectedExercises(updatedSelectedExercises);
  };

  const handleOpenModal = (index: number) => {
    setSelectedWorkoutIndex(index);

    const existingExercises = workouts[index]?.exercises || [];
    const exerciseMap = existingExercises.reduce((acc: any, ex: any) => {
      acc[ex.id] = ex;
      return acc;
    }, {});

    setSelectedExercises((prevState: typeof selectedExercises) => ({
      ...prevState,
      [index]: exerciseMap,
    }));

    setModalVisible(true);
    setIsFinalStep(false);
  };

  const handleOpenVideoModal = (videoUrl: string) => {
    setSelectedVideo(videoUrl);
    setVideoModalVisible(true);
  };

  const handleInputChange = (
    exerciseId: number | string,
    field: number | string,
    value: number | string,
  ) => {
    const updatedExercises = {
      ...selectedExercises,
      [selectedWorkoutIndex]: {
        ...selectedExercises[selectedWorkoutIndex],
        [exerciseId]: {
          ...selectedExercises[selectedWorkoutIndex][exerciseId],
          [field]: value,
        },
      },
    };

    setSelectedExercises(updatedExercises);
  };

  const handleProceedToFinalStep = () => {
    if (
      selectedWorkoutIndex !== null &&
      Object.keys(selectedExercises[selectedWorkoutIndex] || {}).length > 0
    ) {
      setIsFinalStep(true);
    } else {
      alert("Please select at least one exercise before proceeding.");
    }
  };

  const handleCloseModal = () => {
    if (selectedWorkoutIndex === null) return;

    const updatedWorkouts = workouts.map((workout, index) => {
      if (index === selectedWorkoutIndex) {
        return {
          ...workout,
          exercises: Object.values(
            selectedExercises[selectedWorkoutIndex] || {},
          ).filter((ex) => ex !== undefined),
        };
      }
      return workout;
    });

    setWorkouts(updatedWorkouts);
    setModalVisible(false);
  };

  const handleCancelSelection = () => {
    if (selectedWorkoutIndex !== null) {
      const updatedSelectedExercises = {
        ...selectedExercises,
        [selectedWorkoutIndex]: {},
      };
      setSelectedExercises(updatedSelectedExercises);
    }
    setModalVisible(false);
  };

  const handleSaveProgram = async () => {
    if (!programName) {
      alert("Please enter a program name.");
      return;
    }

    if (workouts.length === 0) {
      alert("Please add at least one workout to the program.");
      return;
    }

    for (let workout of workouts) {
      if (!workout.name) {
        alert("Each workout must have a name.");
        return;
      }

      if (workout.exercises.length === 0) {
        alert("Each workout must have at least one exercise.");
        return;
      }
    }

    const payload = {
      name: programName,
      description: programDescription,
      goal: programGoal,
      difficulty: "facil",
      workouts: workouts.map((workout) => ({
        name: workout.name,
        exercises: workout.exercises.map((exercise: any) => ({
          id: exercise.id,
          name: exercise.name,
          reps: exercise.reps,
          sets: exercise.sets,
          rest: exercise.rest,
        })),
      })),
    };

    console.log(payload);

    try {
      const response = await axios.post(
        "http://192.168.100.229:8080/api/v1/program",
        payload,
      );
      alert("Program saved successfully!");
      navigation.navigate("ProgramList");
    } catch (error) {
      alert("There was an error saving the program.");
    }
  };

  return (
    <SafeAreaView style={style.container}>
      <ScrollView contentContainerStyle={style.scrollContainer}>
        <TextInput
          label="Program Name"
          style={style.inputFull}
          value={programName}
          onChangeText={(text) => setProgramName(text)}
        />
        <TextInput
          label="Goal"
          style={style.inputFull}
          value={programGoal}
          onChangeText={(text) => setProgramGoal(text)}
        />
        <TextInput
          label="Description"
          style={style.textArea}
          value={programDescription}
          onChangeText={(text) => setProgramDescription(text)}
        />
        {workouts.map((workout, index) => (
          <View key={index} style={style.workoutSection}>
            <View style={style.workoutHeader}>
              <TextInput
                label={`Workout Name ${index + 1}`}
                style={style.input}
                value={workout.name}
                onChangeText={(text) =>
                  setWorkouts(
                    workouts.map((w, i) =>
                      i === index ? { ...w, name: text } : w,
                    ),
                  )
                }
              />
              <Button mode="text" onPress={() => handleRemoveWorkout(index)}>
                <AntDesign name="close" size={24} color="black" />
              </Button>
            </View>
            <Button
              mode="contained"
              onPress={() => handleOpenModal(index)}
              style={style.button}
            >
              <Text>
                {workout.exercises.length > 0
                  ? "Edit Exercises"
                  : "Select Exercises"}
              </Text>
            </Button>
            {workout.exercises.length > 0 && (
              <ScrollView style={style.maxScroll}>
                {workout.exercises.map((exercise: any) => (
                  <View key={exercise.id} style={style.workoutExercise}>
                    <Image
                      source={{ uri: "https://picsum.photos/1" }}
                      style={{
                        width: 100,
                        height: 100,
                        borderRadius: 10,
                        margin: 5,
                      }}
                    />
                    <View>
                      <Text style={style.textBold}>{exercise.name}</Text>
                      <View style={{ flexDirection: "row" }}>
                        <Text>
                          Reps: {exercise.reps} | Sets: {exercise.sets} | Rest:{" "}
                          {exercise.rest} seconds
                        </Text>
                      </View>
                    </View>
                  </View>
                ))}
              </ScrollView>
            )}
          </View>
        ))}
        <Button
          style={style.button}
          icon="plus"
          mode="contained"
          onPress={handleAddWorkout}
        >
          <Text>Add Workout</Text>
        </Button>
      </ScrollView>

      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={style.modalContainer}>
          {!isFinalStep ? (
            <>
              <FlatList
                data={data}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => {
                  const isSelected =
                    selectedExercises[selectedWorkoutIndex]?.[item.id];

                  return (
                    <TouchableOpacity
                      style={[
                        style.exerciseItem,
                        isSelected && style.selectedExerciseItem,
                      ]}
                      onPress={() =>
                        handleExerciseSelection(item.id, !isSelected)
                      }
                    >
                      <TouchableOpacity
                        onPress={() => handleOpenVideoModal(item.video)}
                      >
                        <Image
                          source={{ uri: item.image }}
                          style={style.exerciseImage}
                        />
                      </TouchableOpacity>
                      <Text>{item.name}</Text>
                    </TouchableOpacity>
                  );
                }}
              />
              <Button
                mode="contained"
                onPress={handleProceedToFinalStep}
                style={style.button}
              >
                <Text>Next</Text>
              </Button>
              <Button mode="text" onPress={handleCancelSelection}>
                <Text>Cancel</Text>
              </Button>
            </>
          ) : (
            <ScrollView>
              <Text style={{ textAlign: "center", marginBottom: 20 }}>
                Choose Reps, Sets, and Rest for Each Exercise
              </Text>
              {Object.values(selectedExercises[selectedWorkoutIndex] || {})
                .filter((exercise) => exercise)
                .map((exercise: any) => (
                  <View
                    key={exercise.id}
                    style={{
                      flexDirection: "column",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      marginBottom: 15,
                    }}
                  >
                    {exercise.image && (
                      <Image
                        source={{ uri: exercise.image }}
                        style={{
                          width: 100,
                          height: 100,
                          borderRadius: 10,
                          margin: 5,
                        }}
                      />
                    )}
                    <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                      {exercise.name}
                    </Text>
                    <TextInput
                      label="Reps"
                      style={style.input}
                      keyboardType="numeric"
                      value={exercise.reps}
                      onChangeText={(value) =>
                        handleInputChange(exercise.id, "reps", value)
                      }
                    />
                    <TextInput
                      label="Sets"
                      style={style.input}
                      keyboardType="numeric"
                      value={exercise.sets}
                      onChangeText={(value) =>
                        handleInputChange(exercise.id, "sets", value)
                      }
                    />
                    <TextInput
                      label="Rest (seconds)"
                      style={style.input}
                      keyboardType="numeric"
                      value={exercise.rest}
                      onChangeText={(value) =>
                        handleInputChange(exercise.id, "rest", value)
                      }
                    />
                  </View>
                ))}
              <Button
                mode="contained"
                onPress={handleCloseModal}
                style={style.button}
              >
                <Text>Save and Close</Text>
              </Button>
              <Button mode="text" onPress={handleCancelSelection}>
                <Text>Cancel</Text>
              </Button>
            </ScrollView>
          )}
        </SafeAreaView>
      </Modal>

      <Modal
        visible={videoModalVisible}
        animationType="slide"
        onRequestClose={() => setVideoModalVisible(false)}
      >
        <SafeAreaView style={style.videoModalContainer}>
          {selectedVideo && (
            <Video
              source={{ uri: selectedVideo }}
              rate={1.0}
              volume={1.0}
              isMuted={false}
              shouldPlay
              isLooping
              style={style.videoPlayer}
            />
          )}
          <Button mode="contained" onPress={() => setVideoModalVisible(false)}>
            <Text>Close Video</Text>
          </Button>
        </SafeAreaView>
      </Modal>

      <View style={style.footer}>
        <Button
          mode="contained"
          onPress={handleSaveProgram}
          style={style.saveButton}
        >
          <Text>Save Program</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 10,
  },
  input: {
    width: 380,
    backgroundColor: "transparent",
  },
  inputFull: {
    width: 470,
    backgroundColor: "transparent",
  },
  textArea: {
    width: 470,
    height: 100,
    backgroundColor: "transparent",
  },
  maxScroll: {
    maxHeight: 500,
  },
  workoutExercise: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: 15,
  },
  textBold: {
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  exerciseItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: "#f5f5f5",
  },
  selectedExerciseItem: {
    backgroundColor: "#d3d3d3",
  },
  exerciseImage: {
    width: 200,
    height: 150,
    borderRadius: 5,
    marginRight: 15,
  },
  button: {
    marginVertical: 10,
    borderRadius: 5,
  },

  scrollContainer: {
    paddingBottom: 100, // Ensure space for footer
  },
  workoutSection: {
    marginVertical: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
  },
  workoutHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  videoModalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  videoPlayer: {
    width: "100%",
    height: 300,
    marginBottom: 20,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    alignItems: "center",
  },
  saveButton: {
    width: 450,
    backgroundColor: "#95f694",
    borderRadius: 5,
  },
});
