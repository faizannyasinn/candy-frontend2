import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useGame } from '@/contexts/GameContext';
import GradientButton from '@/components/GradientButton';

export default function GameScreen() {
  const { state, leaveRoom } = useGame();

  useEffect(() => {
    // Auto-navigate based on game state
    if (state.currentRoom) {
      switch (state.currentRoom.gamePhase) {
        case 'waiting':
          router.replace('/waiting-room');
          break;
        case 'poison-selection':
          router.replace('/poison-selection');
          break;
        case 'playing':
          router.replace('/game-board');
          break;
        case 'finished':
          router.replace('/game-result');
          break;
      }
    }
  }, [state.currentRoom]);

  const handleLeaveRoom = () => {
    leaveRoom();
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#E5FFE5', '#E5E5FF']}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}>
        
        <View style={styles.gameContainer}>
          <Text style={styles.title}>🎮 Game Status</Text>
          
          {state.currentRoom ? (
            <View style={styles.statusContainer}>
              <Text style={styles.statusText}>
                You're currently in room: {state.currentRoom.code}
              </Text>
              <Text style={styles.phaseText}>
                Game Phase: {state.currentRoom.gamePhase}
              </Text>
              <Text style={styles.playersText}>
                Players: {state.currentRoom.players.length}/2
              </Text>
              
              <GradientButton
                title="Leave Current Game"
                onPress={handleLeaveRoom}
                colors={['#FF6B6B', '#C44569']}
                style={styles.leaveButton}
              />
            </View>
          ) : (
            <View style={styles.noGameContainer}>
              <Text style={styles.noGameText}>
                No active game found.
              </Text>
              <Text style={styles.instructionText}>
                Go to the Home tab to create or join a game!
              </Text>
              
              <GradientButton
                title="Go to Home"
                onPress={() => router.replace('/(tabs)')}
                colors={['#4ECDC4', '#44A08D']}
                style={styles.homeButton}
              />
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
  gameContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Nunito-Bold',
    color: '#2C3E50',
    marginBottom: 30,
    textAlign: 'center',
  },
  statusContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
    minWidth: 280,
  },
  statusText: {
    fontSize: 16,
    fontFamily: 'Nunito-SemiBold',
    color: '#2C3E50',
    marginBottom: 12,
    textAlign: 'center',
  },
  phaseText: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#7F8C8D',
    marginBottom: 8,
    textAlign: 'center',
  },
  playersText: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#7F8C8D',
    marginBottom: 20,
    textAlign: 'center',
  },
  leaveButton: {
    width: '100%',
  },
  noGameContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
    minWidth: 280,
  },
  noGameText: {
    fontSize: 18,
    fontFamily: 'Nunito-SemiBold',
    color: '#2C3E50',
    marginBottom: 12,
    textAlign: 'center',
  },
  instructionText: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#7F8C8D',
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 20,
  },
  homeButton: {
    width: '100%',
  },
});