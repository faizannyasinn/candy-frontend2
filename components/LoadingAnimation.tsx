import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
} from 'react-native-reanimated';

export default function LoadingAnimation() {
  const scale1 = useSharedValue(1);
  const scale2 = useSharedValue(1);
  const scale3 = useSharedValue(1);

  useEffect(() => {
    // Staggered pulsing animation
    const animateDot = (scale: any, delay: number) => {
      scale.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 0 }),
          withTiming(1.3, { duration: 600 }),
          withTiming(1, { duration: 600 })
        ),
        -1,
        false
      );
    };

    // Start animations with delays
    setTimeout(() => animateDot(scale1, 0), 0);
    setTimeout(() => animateDot(scale2, 200), 200);
    setTimeout(() => animateDot(scale3, 400), 400);
  }, []);

  const animatedStyle1 = useAnimatedStyle(() => ({
    transform: [{ scale: scale1.value }],
  }));

  const animatedStyle2 = useAnimatedStyle(() => ({
    transform: [{ scale: scale2.value }],
  }));

  const animatedStyle3 = useAnimatedStyle(() => ({
    transform: [{ scale: scale3.value }],
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.dot, styles.dot1, animatedStyle1]} />
      <Animated.View style={[styles.dot, styles.dot2, animatedStyle2]} />
      <Animated.View style={[styles.dot, styles.dot3, animatedStyle3]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginHorizontal: 4,
  },
  dot1: {
    backgroundColor: '#FF6B9D',
  },
  dot2: {
    backgroundColor: '#4ECDC4',
  },
  dot3: {
    backgroundColor: '#45B7D1',
  },
});