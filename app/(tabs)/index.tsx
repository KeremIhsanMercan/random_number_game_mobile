import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View
} from "react-native";

export default function HomeScreen() {
  const { width, height } = useWindowDimensions();

  // Initialize with a function to ensure it runs correctly on all platforms
  const [currentNumber, setCurrentNumber] = useState(() => {
    return Math.floor(Math.random() * 1000) + 1;
  });
  const [boxes, setBoxes] = useState<(number | null)[]>(Array(20).fill(null));
  const [showInvalidPlacement, setShowInvalidPlacement] = useState(21); // No box is invalid at start

  const shakeAnimations = useRef(
    Array(20)
      .fill(0)
      .map(() => new Animated.Value(0)),
  ).current;
  const shakeAnimationReroll = useRef(new Animated.Value(0)).current;
  const shakeAnimationDelete = useRef(new Animated.Value(0)).current;
  const shakeAnimationDelete3 = useRef(new Animated.Value(0)).current;
  const backgroundColorAnim = useRef(new Animated.Value(0)).current;
  const numberRerollAnimation = useRef(new Animated.Value(1)).current;

  const [isGameOver, setIsGameOver] = useState(false);
  const resetButtonShakeAnim = useRef(new Animated.Value(0)).current;
  const [showInfoModal, setShowInfoModal] = useState(false);

  const [isRerollUsed, setIsRerollUsed] = useState(false);
  const [isDeleteUsed, setIsDeleteUsed] = useState(false);
  const [isDeleteActive, setIsDeleteActive] = useState(false);
  const [isDelete3Used, setIsDelete3Used] = useState(false);

  const isPlaceable = useCallback(
    (index: number) => {
      const isPlaceableUp = (index: number) => {
        if (index === 0) return true;
        let aboveNumber = boxes[index - 1];
        while (aboveNumber === null && index - 1 >= 0) {
          index -= 1;
          if (index - 1 >= 0) {
            aboveNumber = boxes[index - 1];
          } else {
            return true;
          }
        }
        return aboveNumber! <= currentNumber;
      };

      const isPlaceableDown = (index: number) => {
        if (index === boxes.length - 1) return true;
        let belowNumber = boxes[index + 1];
        while (belowNumber === null && index + 1 < boxes.length) {
          index += 1;
          if (index + 1 < boxes.length) {
            belowNumber = boxes[index + 1];
          } else {
            return true;
          }
        }
        return belowNumber! >= currentNumber;
      };

      if (isPlaceableUp(index) && isPlaceableDown(index)) {
        return true;
      }
      return false;
    },
    [boxes, currentNumber],
  );

  const handleBoxPress = (index: number) => {
    if (boxes[index] !== null) return;

    if (isPlaceable(index)) {
      if (boxes[index] === null) {
        const newBoxes = [...boxes];
        newBoxes[index] = currentNumber;
        setBoxes(newBoxes);
        setCurrentNumber(Math.floor(Math.random() * 1000) + 1);
      }
    } else {
      shakeAnimations[index].setValue(0);
      setShowInvalidPlacement(index);
    }
  };

  const resetGame = () => {
    setBoxes(Array(20).fill(null));
    setCurrentNumber(Math.floor(Math.random() * 1000) + 1);
    setIsGameOver(false);
    setIsRerollUsed(false);
    setIsDeleteUsed(false);
    setIsDeleteActive(false);
    setIsDelete3Used(false);
  };

  const handleReroll = (number: number) => {
    if (isRerollUsed) {
      // Reroll can only be used once per game
      // Shake animation to indicate cannot use again
      Animated.sequence([
        Animated.timing(shakeAnimationReroll, {
          toValue: 5,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimationReroll, {
          toValue: -5,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimationReroll, {
          toValue: 5,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimationReroll, {
          toValue: -5,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimationReroll, {
          toValue: 0,
          duration: 50,
          useNativeDriver: true,
        }),
      ]).start();
      return;
    }

    // Reroll animation
    // Add animation sequence
    Animated.sequence([
      Animated.timing(numberRerollAnimation, {
        toValue: 1.3,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(numberRerollAnimation, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    let newNumber: number;

    do {
      newNumber = Math.floor(Math.random() * 1000) + 1;
    } while (newNumber === number);
    setCurrentNumber(newNumber);
    setIsRerollUsed(true);
  };

  const handleDelete = () => {
    const filledIndices = boxes
      .map((value, index) => (value !== null ? index : -1))
      .filter((index) => index !== -1);

    if (isDeleteUsed || filledIndices.length < 1) {
      // Delete can only be used once per game
      // Shake animation to indicate cannot use again
      Animated.sequence([
        Animated.timing(shakeAnimationDelete, {
          toValue: 5,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimationDelete, {
          toValue: -5,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimationDelete, {
          toValue: 5,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimationDelete, {
          toValue: -5,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimationDelete, {
          toValue: 0,
          duration: 50,
          useNativeDriver: true,
        }),
      ]).start();
      return;
    }

    if (isDeleteActive) {
      // If already active, deactivate
      setIsDeleteActive(false);
      return;
    }

    setIsDeleteActive(true);
  };

  const handleBoxPressWithDelete = (index: number) => {
    if (boxes[index] === null) return;

    if (isDeleteActive) {
      const newBoxes = [...boxes];
      newBoxes[index] = null;
      setBoxes(newBoxes);
      setIsDeleteActive(false);
      setIsDeleteUsed(true);
    }
  };

  const handleDelete3 = () => {
    const filledIndices = boxes
      .map((value, index) => (value !== null ? index : -1))
      .filter((index) => index !== -1);

    if (isDelete3Used || filledIndices.length < 3) {
      // Delete Three can only be used once per game
      // Shake animation to indicate cannot use again
      Animated.sequence([
        Animated.timing(shakeAnimationDelete3, {
          toValue: 5,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimationDelete3, {
          toValue: -5,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimationDelete3, {
          toValue: 5,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimationDelete3, {
          toValue: -5,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimationDelete3, {
          toValue: 0,
          duration: 50,
          useNativeDriver: true,
        }),
      ]).start();
      return;
    }

    const indicesToDelete: Set<number> = new Set();
    while (indicesToDelete.size < 3) {
      const randomIndex =
        filledIndices[Math.floor(Math.random() * filledIndices.length)];
      indicesToDelete.add(randomIndex);
    }

    const newBoxes = boxes.map((value, index) =>
      indicesToDelete.has(index) ? null : value,
    );
    setBoxes(newBoxes);
    setIsDelete3Used(true);
  };

  useEffect(() => {
    // if there are no valid placements left, set game over
    const hasValidPlacement = boxes.some(
      (box, index) => box === null && isPlaceable(index),
    );
    if (
      !hasValidPlacement &&
      isRerollUsed === true &&
      isDelete3Used === true &&
      isDeleteUsed === true
    ) {
      setIsGameOver(true);
    }
  }, [boxes, isPlaceable, isRerollUsed, isDelete3Used, isDeleteUsed]);

  useEffect(() => {
    if (isGameOver) {
      // Start continuous slow shake animation
      Animated.timing(backgroundColorAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: false,
      }).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(resetButtonShakeAnim, {
            toValue: -4,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(resetButtonShakeAnim, {
            toValue: 4,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(resetButtonShakeAnim, {
            toValue: -4,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(resetButtonShakeAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    } else {
      backgroundColorAnim.setValue(0);
      // Stop animation and reset position
      resetButtonShakeAnim.stopAnimation();
      resetButtonShakeAnim.setValue(0);
    }
  }, [isGameOver, resetButtonShakeAnim, backgroundColorAnim]);

  useEffect(() => {
    if (showInvalidPlacement !== 21) {
      // Reset animation value
      const currentAnim = shakeAnimations[showInvalidPlacement];

      // Create shake animation
      Animated.sequence([
        Animated.timing(currentAnim, {
          toValue: 5,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(currentAnim, {
          toValue: -5,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(currentAnim, {
          toValue: 5,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(currentAnim, {
          toValue: -5,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(currentAnim, {
          toValue: 0,
          duration: 50,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Reset after animation completes
        setShowInvalidPlacement(21);
      });
    }
  }, [showInvalidPlacement, shakeAnimations]);

  const backgroundColor = backgroundColorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#f5f5f5", "#ef0202"], // from light gray to red
  });

  return (
    <Animated.View style={[styles.container, { backgroundColor }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>20 Number Game</Text>
        <View style={styles.currentNumberContainer}>
          <Animated.View
            style={{
              flexDirection: "row",
              alignItems: "center",
              transform: [{ scale: numberRerollAnimation }],
            }}
          >
            <Text style={styles.currentNumberLabel}>Current:</Text>
            <Text style={styles.currentNumber}>{String(currentNumber)}</Text>
          </Animated.View>
        </View>
      </View>

      {/* Content Area */}
      <View style={styles.contentContainer}>
        {/* Game Grid - Left Side */}
        <View style={styles.gridScrollView}>
          <View style={styles.gridContainer}>
            {boxes.map((number: number | null, index: number) => {
              const isInvalid = showInvalidPlacement === index;
              const animatedStyle = isInvalid
                ? {
                    transform: [{ translateX: shakeAnimations[index] }],
                  }
                : {};

              return (
                <Animated.View key={index} style={animatedStyle}>
                  <TouchableOpacity
                    style={[
                      styles.box,
                      { width: width * 0.25, height: height * 0.031 },
                      number !== null && styles.boxFilled,
                      isInvalid && styles.boxInvalid,
                    ]}
                    onPress={() =>
                      isDeleteActive
                        ? handleBoxPressWithDelete(index)
                        : handleBoxPress(index)
                    }
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.boxText,
                        number !== null && styles.boxTextFilled,
                      ]}
                    >
                      {number !== null ? String(number) : String(index + 1)}
                    </Text>
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </View>
        </View>

        {/* Right Side */}
        <View style={styles.rightSection}>
          {/* Info Button */}
          <TouchableOpacity
            style={styles.infoButton}
            onPress={() => setShowInfoModal(true)}
          >
            <Text style={styles.infoButtonText}>Power Up Info</Text>
          </TouchableOpacity>

          {/* Reset Button */}
          <Animated.View
            style={{
              transform: [
                { translateY: isGameOver ? resetButtonShakeAnim : 0 },
              ],
            }}
          >
            <TouchableOpacity style={styles.resetButton} onPress={resetGame}>
              <Text style={styles.resetButtonText}>Reset Game</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Reroll Power Up */}
          <Animated.View
            style={{
              marginTop: 15,
              transform: [{ translateX: shakeAnimationReroll }],
            }}
          >
            <TouchableOpacity
              style={[
                styles.powerUpButton,
                isRerollUsed && styles.powerUpButtonDisabled,
              ]}
              onPress={() => {
                handleReroll(currentNumber);
              }}
            >
              <Text style={styles.resetButtonText}>&#9861;</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Delete Power Up */}
          <Animated.View
            style={{
              marginTop: 15,
              transform: [{ translateX: shakeAnimationDelete }],
            }}
          >
            <TouchableOpacity
              style={[
                styles.powerUpButton,
                isDeleteActive && styles.deleteActiveButton,
                isDeleteUsed && styles.powerUpButtonDisabled,
              ]}
              onPress={() => {
                handleDelete();
              }}
            >
              <Text style={styles.resetButtonText}>&#9003;</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Delete Three Power Up */}
          <Animated.View
            style={{
              marginTop: 15,
              transform: [{ translateX: shakeAnimationDelete3 }],
            }}
          >
            <TouchableOpacity
              style={[
                styles.powerUpButton,
                isDelete3Used && styles.powerUpButtonDisabled,
              ]}
              onPress={() => {
                handleDelete3();
              }}
            >
              <Text style={styles.resetButtonText}>&#9003;&#9003;&#9003;</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
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
            <Text style={styles.modalTitle}>Power-Ups Guide</Text>

            <View style={styles.powerUpInfo}>
              <Text style={styles.powerUpIcon}>&#9861;</Text>
              <View style={styles.powerUpTextContainer}>
                <Text style={styles.powerUpName}>Reroll</Text>
                <Text style={styles.powerUpDesc}>
                  Changes current number to a different random number
                </Text>
              </View>
            </View>

            <View style={styles.powerUpInfo}>
              <Text style={styles.powerUpIcon}>&#9003;</Text>
              <View style={styles.powerUpTextContainer}>
                <Text style={styles.powerUpName}>Delete</Text>
                <Text style={styles.powerUpDesc}>
                  Removes the selected number from the board
                </Text>
              </View>
            </View>

            <View style={styles.powerUpInfo}>
              <Text style={styles.powerUpIcon}>&#9003;&#9003;&#9003;</Text>
              <View style={styles.powerUpTextContainer}>
                <Text style={styles.powerUpName}>Delete Three</Text>
                <Text style={styles.powerUpDesc}>
                  Removes three random numbers from the board
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowInfoModal(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    marginTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
  },
  currentNumberContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4CAF50",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  currentNumberLabel: {
    fontSize: 16,
    color: "#fff",
    marginRight: 8,
  },
  currentNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  contentContainer: {
    flex: 1,
    flexDirection: "row",
    gap: 15,
  },
  gridScrollView: {
    flex: 1,
  },
  gridContainer: {
    gap: 8.2,
    paddingBottom: 100,
  },
  box: {
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  boxFilled: {
    backgroundColor: "#4CAF50",
    borderColor: "#45a049",
  },
  boxInvalid: {
    borderColor: "#f44336",
    shadowColor: "#f44336",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 8,
  },
  boxText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#9b9b9b4e",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  boxTextFilled: {
    color: "#fff",
  },
  rightSection: {
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 20,
  },
  infoButton: {
    backgroundColor: "#9C27B0",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
    minWidth: 140,
  },
  infoButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  resetButton: {
    backgroundColor: "#2196F3",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    minWidth: 140,
  },
  resetButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  powerUpButton: {
    backgroundColor: "#d2cb00ae",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    width: 140,
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
    width: "80%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  powerUpInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    padding: 12,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
  },
  powerUpIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  powerUpTextContainer: {
    flex: 1,
  },
  powerUpName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  powerUpDesc: {
    fontSize: 13,
    color: "#666",
  },
  closeButton: {
    backgroundColor: "#2196F3",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  powerUpButtonDisabled: {
    backgroundColor: "#b6b6b6c0",
  },
  deleteActiveButton: {
    backgroundColor: "#fff700",
  },
});
