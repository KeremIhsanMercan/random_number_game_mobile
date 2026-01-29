import { MaterialIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React, { useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
  const [showInfoModal, setShowInfoModal] = useState(false);

  return (
    <View style={styles.container}>
      {/* Info Button */}
      <TouchableOpacity
        style={styles.infoButton}
        onPress={() => setShowInfoModal(true)}
      >
        <MaterialIcons name="info" size={28} color="white" />
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.title}>20 Number Game</Text>
        <Text style={styles.subtitle}>Choose Your Mode</Text>
      </View>

      <View style={styles.menuContainer}>
        <Link href="/(tabs)/easymode" asChild>
          <TouchableOpacity style={styles.menuButton}>
            <Text style={styles.menuButtonText}>Easy Mode</Text>
            <Text style={styles.menuButtonDesc}>5 Boxes - 1 to 10</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/(tabs)/normalmode" asChild>
          <TouchableOpacity style={styles.menuButton}>
            <Text style={styles.menuButtonText}>Normal Mode</Text>
            <Text style={styles.menuButtonDesc}>10 Boxes - 1 to 100</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/(tabs)/hardmode" asChild>
          <TouchableOpacity style={styles.menuButton}>
            <Text style={styles.menuButtonText}>Hard Mode</Text>
            <Text style={styles.menuButtonDesc}>20 Boxes - 1 to 1000</Text>
          </TouchableOpacity>
        </Link>
      </View>

      {/* Info Modal */}
      <Modal
        visible={showInfoModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowInfoModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>How to Play</Text>

            <View style={styles.ruleSection}>
              <Text style={styles.ruleTitle}>Goal</Text>
              <Text style={styles.ruleText}>
                Fill all boxes with numbers in ascending order from top to
                bottom.
              </Text>
            </View>

            <View style={styles.ruleSection}>
              <Text style={styles.ruleTitle}>Gameplay</Text>
              <Text style={styles.ruleText}>
                - A random number appears{"\n"}- Tap a box to place it{"\n"}-
                Numbers must be in order: smaller numbers above, larger below
                {"\n"}- Empty boxes between numbers are allowed
              </Text>
            </View>

            <View style={styles.ruleSection}>
              <Text style={styles.ruleTitle}>Power-Ups</Text>
              <Text style={styles.ruleText}>
                - <Text style={styles.bold}>Reroll:</Text> Get a new random
                number{"\n"}- <Text style={styles.bold}>Delete:</Text> Remove
                one number from the board{"\n"}-{" "}
                <Text style={styles.bold}>Delete 3:</Text> Remove three random
                numbers
              </Text>
            </View>

            <View style={styles.ruleSection}>
              <Text style={styles.ruleTitle}>Win Condition</Text>
              <Text style={styles.ruleText}>
                Fill all boxes to win! Use power-ups wisely, each can only be
                used once per game.
              </Text>
            </View>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowInfoModal(false)}
            >
              <Text style={styles.closeButtonText}>Got it!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  infoButton: {
    position: "absolute",
    top: 50,
    right: 20,
    backgroundColor: "#2196F3",
    padding: 10,
    borderRadius: 25,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  header: {
    alignItems: "center",
    marginBottom: 60,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: "#666",
  },
  menuContainer: {
    gap: 20,
  },
  menuButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 24,
    paddingHorizontal: 32,
    borderRadius: 16,
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  menuButtonText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  menuButtonDesc: {
    fontSize: 14,
    color: "#fff",
    opacity: 0.9,
  },
  comingSoon: {
    backgroundColor: "#9e9e9e",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    width: "85%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  ruleSection: {
    marginBottom: 16,
  },
  ruleTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4CAF50",
    marginBottom: 6,
  },
  ruleText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  bold: {
    fontWeight: "bold",
    color: "#333",
  },
  closeButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
