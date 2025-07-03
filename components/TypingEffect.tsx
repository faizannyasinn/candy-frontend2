import React, { useState, useEffect } from 'react';
import { Text, StyleSheet } from 'react-native';

interface TypingEffectProps {
  text: string;
  speed?: number;
  style?: any;
}

export default function TypingEffect({ text, speed = 50, style }: TypingEffectProps) {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timer);
    }
  }, [currentIndex, text, speed]);

  useEffect(() => {
    // Reset when text changes
    setDisplayText('');
    setCurrentIndex(0);
  }, [text]);

  return (
    <Text style={[styles.text, style]}>
      {displayText}
      {currentIndex < text.length && (
        <Text style={styles.cursor}>|</Text>
      )}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontFamily: 'Nunito-Regular',
    fontSize: 16,
    color: '#666666',
  },
  cursor: {
    color: '#FF6B9D',
    fontWeight: 'bold',
  },
});