# 20 Number Game ??

A strategic mobile puzzle game built with React Native and Expo where players must place randomly generated numbers in ascending order across 20 slots.

## ?? Game Overview

### How to Play

1. You'll be given a random number between 1-1000
2. Place this number in one of the 20 available slots
3. Numbers must be placed in ascending order - each number must be greater than numbers below it and less than numbers above it
4. After placing a number, you'll receive a new random number
5. The game ends when no valid placement exists and all power-ups are used

### Power-Ups

- **?? Reroll** (1x per game): Changes the current number to a different random number
- **? Delete** (1x per game): Removes a selected number from the board (click power-up, then click a filled box)
- **??? Delete Three** (1x per game): Randomly removes three numbers from the board

### Visual Features

- Empty slots display their position number (1-20) for easy reference
- Invalid placements trigger a shake animation with red highlight
- Power-ups turn gray when used
- Background turns red when game is over
- Number display animates when reroll is used

## ??? Technologies & Concepts Learned

### React Native Fundamentals

- **Hooks**: `useState`, `useEffect`, `useRef`, `useCallback`
- **Platform APIs**: `useWindowDimensions` for responsive layouts
- **Touch handling**: `TouchableOpacity` with gesture detection
- **Scrollable views**: `ScrollView` for vertical content

### Animation

- **Animated API**: Creating smooth, performant animations
- **Transform animations**: Translate (shake effect) and scale (pulse effect)
- **Animation sequences**: Chaining multiple animations
- **Animation loops**: Continuous looping animations for game over state
- **Interpolation**: Color transitions for background effects
- **useNativeDriver**: Leveraging native thread for 60fps animations

### State Management

- **Complex state**: Managing game board with arrays
- **Derived state**: Computing valid placements from current state
- **State dependencies**: Using `useCallback` to prevent unnecessary re-renders
- **Conditional logic**: Game over detection based on multiple conditions

### UI/UX Design

- **Responsive design**: Dynamic sizing based on screen dimensions
- **Visual feedback**: Shake animations, color changes, and disabled states
- **Modal dialogs**: Info modal with game instructions
- **Conditional styling**: Style arrays with conditional classes
- **Color psychology**: Using colors to indicate states (green=success, red=error, gray=disabled)

### Game Logic & Algorithms

- **Validation algorithms**: Checking valid number placements
- **Randomization**: Generating random numbers and selecting random indices
- **Set operations**: Using Set for efficient duplicate prevention
- **Array manipulation**: Mapping, filtering, and updating immutable arrays

### Code Organization

- **Component structure**: Single-file component with clear sections
- **Style management**: StyleSheet for optimized styling
- **Reusable animations**: Centralized animation refs and sequences
- **Function composition**: Breaking down complex logic into smaller functions

### TypeScript

- **Type safety**: Typed state with `(number | null)[]`
- **Type annotations**: Function parameters and return types
- **Generic types**: Working with TypeScript in React Native

### Mobile Development Patterns

- **Touch optimization**: `activeOpacity` for better touch feedback
- **Safe areas**: Proper padding and margins for different devices
- **Edge-to-edge content**: Utilizing full screen space
- **Performance optimization**: Using native driver for animations

## ?? Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- Android Studio (for Android emulator) or Xcode (for iOS simulator)

### Installation

1. Clone the repository

```bash
git clone <repository-url>
cd random_number_game_mobile
```
