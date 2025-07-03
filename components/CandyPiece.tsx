import React from 'react';
import { TouchableOpacity, StyleSheet, Platform } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import { Candy } from '@/contexts/GameContext';

interface CandyPieceProps {
  candy: Candy;
  onPress: (candyId: string) => void;
  disabled?: boolean;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export default function CandyPiece({ candy, onPress, disabled }: CandyPieceProps) {
  const scale = useSharedValue(1);
  const glowOpacity = useSharedValue(candy.selected ? 1 : 0);

  const handlePress = () => {
    if (disabled) return;
    
    // Haptic feedback
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    onPress(candy.id);
  };

  const pressGesture = Gesture.Tap()
    .onBegin(() => {
      scale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
    })
    .onFinalize(() => {
      scale.value = withSpring(1, { damping: 15, stiffness: 300 });
    });

  const longPressGesture = Gesture.LongPress()
    .minDuration(300)
    .onStart(() => {
      glowOpacity.value = withTiming(0.8, { duration: 200 });
    })
    .onEnd(() => {
      glowOpacity.value = withTiming(candy.selected ? 1 : 0, { duration: 200 });
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  React.useEffect(() => {
    glowOpacity.value = withTiming(candy.selected ? 1 : 0, { duration: 300 });
  }, [candy.selected]);

  const gesture = Gesture.Exclusive(longPressGesture, pressGesture);

  return (
    <GestureDetector gesture={gesture}>
      <AnimatedTouchable
        style={[styles.container, animatedStyle]}
        onPress={handlePress}
        disabled={disabled}
        activeOpacity={0.9}>
        
        {/* Glow effect for preview/selection */}
        <Animated.View style={[styles.glow, glowStyle]} />
        
        {/* Candy piece */}
        <Animated.View
          style={[
            styles.candy,
            { backgroundColor: candy.color },
            candy.selected && styles.selected,
          ]}
        />
        
        {/* Selection indicator */}
        {candy.selected && (
          <Animated.View style={styles.selectionRing} />
        )}
      </AnimatedTouchable>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  candy: {
    width: 60,
    height: 60,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 4,
  },
  selected: {
    borderWidth: 3,
    borderColor: '#FF6B9D',
  },
  glow: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FFD700',
    shadowColor: '#FFD700',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
  },
  selectionRing: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: '#FF6B9D',
    backgroundColor: 'transparent',
  },
});