import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

interface GradientButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  colors?: string[];
  style?: any;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

export default function GradientButton({
  title,
  onPress,
  disabled = false,
  colors = ['#FF6B9D', '#C44569'],
  style,
}: GradientButtonProps) {
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    if (disabled) return;
    scale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedTouchable
      style={[styles.container, style, animatedStyle]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      activeOpacity={0.9}>
      <AnimatedLinearGradient
        colors={disabled ? ['#CCCCCC', '#999999'] : colors}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}>
        <Text style={[styles.text, disabled && styles.disabledText]}>
          {title}
        </Text>
      </AnimatedLinearGradient>
    </AnimatedTouchable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  gradient: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Nunito-SemiBold',
    textAlign: 'center',
  },
  disabledText: {
    color: '#666666',
  },
});