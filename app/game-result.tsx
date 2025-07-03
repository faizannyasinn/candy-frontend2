import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useGame } from '@/contexts/GameContext';
import GradientButton from '@/components/GradientButton';

export default function GameResultScreen() {
  const { state, leaveRoom } = useGame();
  const scaleAnim = new Animated.Value(0);
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    if (!state.currentRoom) {
      router.replace('/');
      return;
    }

    // Start animations
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handlePlayAgain = () => {
    leaveRoom();
    router.replace('/');
  };

  const handleGoHome = () => {
    leaveRoom();
    router.replace('/');
  };

  if (!state.currentRoom) {
    return null;
  }

  const isWinner = state.currentRoom.winner === state.playerId;
  const isLoser = state.currentRoom.loser === state.playerId;
  const winnerName = state.currentRoom.players.find(p => p.id === state.currentRoom?.winner)?.name;
  const loserName = state.currentRoom.players.find(p => p.id === state.currentRoom?.loser)?.name;

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={isWinner ? ['#E8F5E8', '#F0FFF0'] : ['#FFE5E5', '#FFF0F0']}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}>
        
        <View style={styles.resultContainer}>
          {/* Result Animation */}
          <Animated.View 
            style={[
              styles.resultHeader,
              { transform: [{ scale: scaleAnim }] }
            ]}>
            
            {isWinner ? (
              <>
                <Text style={styles.winnerTitle}>🎉 WINNER! 🎉</Text>
                <Text style={styles.winnerEmoji}>🏆✨🎊</Text>
                <Text style={styles.resultMessage}>
                  Congratulations! You avoided the poison and won the game!
                </Text>
              </>
            ) : (
              <>
                <Text style={styles.loserTitle}>💀 LOSER 💀</Text>
                <Text style={styles.loserEmoji}>😭😵💔</Text>
                <Text style={styles.resultMessage}>
                  Oh no! You ate the poison candy and lost the game!
                </Text>
              </>
            )}
          </Animated.View>

          {/* Game Summary */}
          <Animated.View 
            style={[
              styles.summaryContainer,
              { opacity: fadeAnim }
            ]}>
            <Text style={styles.summaryTitle}>Game Summary</Text>
            
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Winner:</Text>
              <Text style={[styles.summaryValue, styles.winnerText]}>
                🏆 {winnerName} {state.currentRoom.winner === state.playerId && '(You)'}
              </Text>
            </View>
            
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Lost to poison:</Text>
              <Text style={[styles.summaryValue, styles.loserText]}>
                💀 {loserName} {state.currentRoom.loser === state.playerId && '(You)'}
              </Text>
            </View>

            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Candies remaining:</Text>
              <Text style={styles.summaryValue}>
                🍭 {state.currentRoom.candies.filter(c => !c.eaten).length}/15
              </Text>
            </View>
          </Animated.View>

          {/* Action Buttons */}
          <Animated.View 
            style={[
              styles.actionContainer,
              { opacity: fadeAnim }
            ]}>
            <GradientButton
              title="🎮 Play Again"
              onPress={handlePlayAgain}
              colors={['#4ECDC4', '#44A08D']}
              style={styles.actionButton}
            />
            
            <GradientButton
              title="🏠 Go Home"
              onPress={handleGoHome}
              colors={['#95A5A6', '#7F8C8D']}
              style={styles.actionButton}
            />
          </Animated.View>

          {/* Celebration Effects */}
          {isWinner && (
            <View style={styles.celebrationContainer}>
              <Text style={styles.confetti}>🎊</Text>
              <Text style={styles.confetti}>🎉</Text>
              <Text style={styles.confetti}>✨</Text>
              <Text style={styles.confetti}>🏆</Text>
              <Text style={styles.confetti}>🎊</Text>
            </View>
          )}
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  resultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  resultHeader: {
    alignItems: 'center',
    marginBottom: 40,
  },
  winnerTitle: {
    fontSize: 36,
    fontFamily: 'Nunito-Bold',
    color: '#27AE60',
    textAlign: 'center',
    marginBottom: 16,
  },
  loserTitle: {
    fontSize: 36,
    fontFamily: 'Nunito-Bold',
    color: '#E74C3C',
    textAlign: 'center',
    marginBottom: 16,
  },
  winnerEmoji: {
    fontSize: 48,
    textAlign: 'center',
    marginBottom: 16,
  },
  loserEmoji: {
    fontSize: 48,
    textAlign: 'center',
    marginBottom: 16,
  },
  resultMessage: {
    fontSize: 18,
    fontFamily: 'Nunito-Regular',
    color: '#2C3E50',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  summaryContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    marginBottom: 30,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  summaryTitle: {
    fontSize: 20,
    fontFamily: 'Nunito-Bold',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 20,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  summaryLabel: {
    fontSize: 16,
    fontFamily: 'Nunito-Regular',
    color: '#7F8C8D',
  },
  summaryValue: {
    fontSize: 16,
    fontFamily: 'Nunito-SemiBold',
    color: '#2C3E50',
  },
  winnerText: {
    color: '#27AE60',
  },
  loserText: {
    color: '#E74C3C',
  },
  actionContainer: {
    width: '100%',
    alignItems: 'center',
  },
  actionButton: {
    width: '80%',
    marginBottom: 16,
  },
  celebrationContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  confetti: {
    position: 'absolute',
    fontSize: 24,
    top: Math.random() * 600,
    left: Math.random() * 300,
  },
});