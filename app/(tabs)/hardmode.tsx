import { MaterialIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
    Animated,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View,
} from "react-native";

export default function HardModeScreen() {
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
  const deleteFlashAnimation = useRef(new Animated.Value(1)).current;
  const boxDeleteAnimations = useRef<{
    [key: number]: { scale: Animated.Value; opacity: Animated.Value };
  }>({}).current;

  // Change this number to increase/decrease firework intensity
  const FIREWORK_COUNT = 30;

  const fireworkAnims = useRef<
    { scale: Animated.Value; opacity: Animated.Value }[]
  >([]).current;

  // Initialize firework animations if needed
  if (fireworkAnims.length === 0) {
    for (let i = 0; i < FIREWORK_COUNT; i++) {
      fireworkAnims.push({
        scale: new Animated.Value(0),
        opacity: new Animated.Value(1),
      });
    }
  }

  const fireworkColors = [
    "#FFD700",
    "#FF69B4",
    "#00CED1",
    "#FF6347",
    "#7B68EE",
    "#32CD32",
    "#FF4500",
    "#1E90FF",
  ];

  const [isGameOver, setIsGameOver] = useState(false);
  const [isGameWon, setIsGameWon] = useState(false);

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
    if (isGameOver || isGameWon) return;

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
    setIsGameWon(false);
    setIsRerollUsed(false);
    setIsDeleteUsed(false);
    setIsDeleteActive(false);
    setIsDelete3Used(false);
    // Reset firework animations
    fireworkAnims.forEach((anim) => {
      anim.scale.setValue(0);
      anim.opacity.setValue(1);
    });
  };

  const handleReroll = (number: number) => {
    if (isGameOver || isGameWon) return;

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
    if (isGameOver || isGameWon) return;

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
      deleteFlashAnimation.setValue(1);
      setIsDeleteActive(false);
      return;
    }

    setIsDeleteActive(true);
  };

  const handleBoxPressWithDelete = (index: number) => {
    if (boxes[index] === null) return;

    if (isDeleteActive) {
      const anim = getBoxDeleteAnimation(index);

      Animated.parallel([
        Animated.sequence([
          Animated.timing(anim.scale, {
            toValue: 1.2,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(anim.scale, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(anim.opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        const newBoxes = [...boxes];
        newBoxes[index] = null;
        setBoxes(newBoxes);
        // Reset delete button opacity immediately
        deleteFlashAnimation.setValue(1);
        setIsDeleteActive(false);
        setIsDeleteUsed(true);
        // Reset animations
        anim.scale.setValue(1);
        anim.opacity.setValue(1);
      });
    }
  };

  // Initialize animations for boxes that need them
  const getBoxDeleteAnimation = (index: number) => {
    if (!boxDeleteAnimations[index]) {
      boxDeleteAnimations[index] = {
        scale: new Animated.Value(1),
        opacity: new Animated.Value(1),
      };
    }
    return boxDeleteAnimations[index];
  };

  const handleDelete3 = () => {
    if (isGameOver || isGameWon) return;

    const filledIndices = boxes
      .map((value, index) => (value !== null ? index : -1))
      .filter((index) => index !== -1);

    if (
      isDelete3Used ||
      filledIndices.length < Math.min(3, filledIndices.length)
    ) {
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
    // Select up to 3 unique random filled indices
    while (indicesToDelete.size < Math.min(3, filledIndices.length)) {
      const randomIndex =
        filledIndices[Math.floor(Math.random() * filledIndices.length)];
      indicesToDelete.add(randomIndex);
    }

    for (let index of indicesToDelete) {
      const anim = getBoxDeleteAnimation(index);

      Animated.parallel([
        Animated.sequence([
          Animated.timing(anim.scale, {
            toValue: 1.2,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(anim.scale, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(anim.opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        const newBoxes = [...boxes];
        indicesToDelete.forEach((index) => {
          newBoxes[index] = null;
        });
        setBoxes(newBoxes);
        setIsDelete3Used(true);
        anim.scale.setValue(1);
        anim.opacity.setValue(1);
      });
    }
  };

  // Flashing animation for delete active state
  useEffect(() => {
    if (isDeleteActive) {
      // Start flashing animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(deleteFlashAnimation, {
            toValue: 0.3,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(deleteFlashAnimation, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    } else {
      // Stop animation and reset
      deleteFlashAnimation.stopAnimation(() => {
        deleteFlashAnimation.setValue(1);
      });
    }
  }, [isDeleteActive, deleteFlashAnimation]);

  useEffect(() => {
    // if there are no valid placements left, set game over
    const hasValidPlacement = boxes.some(
      (box, index) => box === null && isPlaceable(index),
    );

    const allBoxesFilled = boxes.every((box) => box !== null);

    if (allBoxesFilled === true) {
      return;
    }

    if (
      !hasValidPlacement &&
      isRerollUsed === true &&
      isDelete3Used === true &&
      isDeleteUsed === true
    ) {
      setIsGameOver(true);
    }
  }, [boxes, isPlaceable, isRerollUsed, isDelete3Used, isDeleteUsed]);

  // If every box is filled, player wins
  useEffect(() => {
    if (boxes.every((box) => box !== null)) {
      setIsGameWon(true);
    }
  }, [boxes]);

  // Random positions for fireworks - regenerated each win
  const [fireworkPositions, setFireworkPositions] = useState<
    { top: number; left: number }[]
  >([]);

  useEffect(() => {
    if (isGameWon) {
      // Generate new random positions for this win
      const newPositions = Array(FIREWORK_COUNT)
        .fill(0)
        .map(() => ({
          top: Math.random() * 0.5 + 0.1,
          left: Math.random() * 0.7 + 0.05,
        }));
      setFireworkPositions(newPositions);
    }
  }, [isGameWon]);

  useEffect(() => {
    let timeoutIds: ReturnType<typeof setTimeout>[] = [];
    let isActive = true;

    if (isGameWon) {
      // Looping firework animation function
      const animateFirework = (
        scale: Animated.Value,
        opacity: Animated.Value,
        delay: number,
      ) => {
        const animate = () => {
          if (!isActive) return;
          scale.setValue(0);
          opacity.setValue(1);
          const id = setTimeout(() => {
            if (!isActive) return;
            Animated.parallel([
              Animated.timing(scale, {
                toValue: 3,
                duration: 1200,
                useNativeDriver: true,
              }),
              Animated.sequence([
                Animated.timing(opacity, {
                  toValue: 1,
                  duration: 400,
                  useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                  toValue: 0,
                  duration: 800,
                  useNativeDriver: true,
                }),
              ]),
            ]).start(() => {
              if (isActive) animate();
            });
          }, delay);
          timeoutIds.push(id);
        };
        animate();
      };

      // Animate all fireworks with staggered delays
      fireworkAnims.forEach((anim, index) => {
        animateFirework(anim.scale, anim.opacity, index * 400);
      });
    }

    return () => {
      isActive = false;
      timeoutIds.forEach((id) => clearTimeout(id));
    };
  }, [isGameWon, fireworkAnims]);

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
    outputRange: ["#f5f5f5", "#ef0202"], // light gray, red (game over)
  });

  return (
    <Animated.View style={[styles.container, { backgroundColor }]}>
      {/* Fireworks */}
      {isGameWon &&
        fireworkPositions.length > 0 &&
        fireworkAnims.map((anim, index) => {
          const pos = fireworkPositions[index] || { top: 0.3, left: 0.3 };
          return (
            <Animated.View
              key={index}
              style={[
                styles.firework,
                {
                  top: height * pos.top,
                  left: width * pos.left,
                  transform: [{ scale: anim.scale }],
                  opacity: anim.opacity,
                },
              ]}
            >
              <View style={styles.fireworkStars}>
                <MaterialIcons
                  name="star"
                  size={30}
                  color={fireworkColors[index % fireworkColors.length]}
                />
                <MaterialIcons
                  name="star"
                  size={20}
                  color={fireworkColors[(index + 1) % fireworkColors.length]}
                  style={{ position: "absolute", top: -15, left: 10 }}
                />
                <MaterialIcons
                  name="star"
                  size={20}
                  color={fireworkColors[(index + 2) % fireworkColors.length]}
                  style={{ position: "absolute", top: 10, left: -15 }}
                />
                <MaterialIcons
                  name="star"
                  size={15}
                  color={fireworkColors[(index + 3) % fireworkColors.length]}
                  style={{ position: "absolute", top: -10, left: -10 }}
                />
              </View>
            </Animated.View>
          );
        })}
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Hard Mode</Text>
        <View style={styles.currentNumberContainer}>
          <Animated.View
            style={{
              flexDirection: "row",
              alignItems: "center",
              transform: [{ scale: numberRerollAnimation }],
            }}
          >
            <Text style={styles.currentNumberLabel}>Current:</Text>
            <Text style={styles.currentNumber}>
              {isGameWon ? (
                <MaterialIcons name="check" size={24} color="white" />
              ) : (
                String(currentNumber)
              )}
            </Text>
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
              const deleteAnim = getBoxDeleteAnimation(index);
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
                    {number !== null ? (
                      <Animated.View
                        style={{
                          transform: [{ scale: deleteAnim.scale }],
                          opacity: deleteAnim.opacity,
                        }}
                      >
                        <Text style={[styles.boxText, styles.boxTextFilled]}>
                          {String(number)}
                        </Text>
                      </Animated.View>
                    ) : (
                      <Text style={styles.boxText}>{String(index + 1)}</Text>
                    )}
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
            <Text style={styles.infoButtonText}>
              <MaterialIcons name="info" size={24} color="white" />
            </Text>
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
              <Text style={styles.resetButtonText}>
                <MaterialIcons name="autorenew" size={24} color="white" />
              </Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Delete Power Up */}
          <Animated.View
            style={{
              marginTop: 15,
              transform: [{ translateX: shakeAnimationDelete }],
              opacity: isDeleteActive ? deleteFlashAnimation : 1,
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
              <Text style={styles.resetButtonText}>
                <MaterialIcons name="delete" size={24} color="white" />
              </Text>
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
              <Text style={styles.resetButtonText}>
                <MaterialIcons name="delete" size={24} color="white" />
                <MaterialIcons name="delete" size={24} color="white" />
                <MaterialIcons name="delete" size={24} color="white" />
              </Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Main Menu Button */}
          <Link href="/(tabs)" asChild style={{ marginTop: 15 }}>
            <TouchableOpacity style={styles.mainMenuButton}>
              <MaterialIcons name="home" size={20} color="white" />
              <Text style={styles.resetButtonText}>Main Menu</Text>
            </TouchableOpacity>
          </Link>
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
              <Text style={styles.powerUpIcon}>
                <MaterialIcons name="autorenew" size={24} color="black" />
              </Text>
              <View style={styles.powerUpTextContainer}>
                <Text style={styles.powerUpName}>Reroll</Text>
                <Text style={styles.powerUpDesc}>
                  Changes current number to a different random number
                </Text>
              </View>
            </View>

            <View style={styles.powerUpInfo}>
              <Text style={styles.powerUpIcon}>
                <MaterialIcons name="delete" size={24} color="black" />
              </Text>
              <View style={styles.powerUpTextContainer}>
                <Text style={styles.powerUpName}>Delete</Text>
                <Text style={styles.powerUpDesc}>
                  Allows you to select a number on the board to remove
                </Text>
              </View>
            </View>

            <View style={styles.powerUpInfo}>
              <Text style={styles.powerUpIcon}>
                <MaterialIcons name="delete" size={24} color="black" />
                <MaterialIcons name="delete" size={24} color="black" />
                <MaterialIcons name="delete" size={24} color="black" />
              </Text>
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
  firework: {
    position: "absolute",
    zIndex: 1000,
  },
  fireworkStars: {
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    marginTop: 35,
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
    backgroundColor: "#2196F3",
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignItems: "center",
    alignSelf: "flex-end",
    marginBottom: 20,
    minWidth: 40,
  },
  infoButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  resetButton: {
    backgroundColor: "#9C27B0",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    minWidth: 140,
  },
  mainMenuButton: {
    backgroundColor: "#FF5722",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    minWidth: 140,
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
  },
  resetButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  powerUpButton: {
    backgroundColor: "#d2cb00ae",
    paddingVertical: 8,
    paddingHorizontal: 8,
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
