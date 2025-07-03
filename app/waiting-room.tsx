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
import LoadingAnimation from '@/components/LoadingAnimation';
import TypingEffect from '@/components/TypingEffect';

export default function WaitingRoomScreen() {
  const { state, leaveRoom } = useGame();

  useEffect(() => {
    if (!state.currentRoom) {
      router.replace('/');
      return;
    }

    // Auto-navigate when second player joins
    if (state.currentRoom.gamePhase === 'poison-selection') {
      router.replace('/poison-selection');
    }
  }, [state.currentRoom]);

  const handleLeaveRoom = () => {
    leaveRoom();
    router.replace('/');
  };

  if (!state.currentRoom) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#FFE5E5', '#E5FFE5']}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}>
        
        <View style={styles.waitingContainer}>
          <Text style={styles.title}>🍭 Waiting Room</Text>
          
          <View style={styles.roomCodeContainer}>
            <Text style={styles.roomCodeLabel}>Share this room code:</Text>
            <Text style={styles.roomCode}>{state.currentRoom.code}</Text>
            <Text style={styles.roomCodeSubtext}>
              Your friend needs this code to join!
            </Text>
          </View>

          <LoadingAnimation />

          <TypingEffect
            text="Waiting for your opponent to join the game..."
            speed={80}
            style={styles.waitingText}
          />

          <View style={styles.playersContainer}>
            <Text style={styles.playersTitle}>
              Players ({state.currentRoom.players.length}/2)
            </Text>
            {state.currentRoom.players.map(player => (
              <View key={player.id} style={styles.playerItem}>
                <Text style={styles.playerName}>
                  {player.name} {player.id === state.playerId && '(You)'}
                </Text>
                {player.isHost && <Text style={styles.hostBadge}>HOST</Text>}
              </View>
            ))}
            
            {state.currentRoom.players.length < 2 && (
              <View style={styles.playerItem}>
                <Text style={styles.emptySlot}>Waiting for player...</Text>
              </View>
            )}
          </View>

          <GradientButton
            title="Leave Room"
            onPress={handleLeaveRoom}
            colors={['#FF6B6B', '#C44569']}
            style={styles.leaveButton}
          />
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
  waitingContainer: {
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
  },
  roomCodeContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginBottom: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    minWidth: 280,
  },
  roomCodeLabel: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#7F8C8D',
    marginBottom: 8,
  },
  roomCode: {
    fontSize: 32,
    fontFamily: 'Nunito-Bold',
    color: '#FF6B9D',
    letterSpacing: 4,
    marginBottom: 8,
  },
  roomCodeSubtext: {
    fontSize: 12,
    fontFamily: 'Nunito-Regular',
    color: '#95A5A6',
    textAlign: 'center',
  },
  waitingText: {
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 16,
    color: '#7F8C8D',
  },
  playersContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  playersTitle: {
    fontSize: 16,
    fontFamily: 'Nunito-SemiBold',
    color: '#2C3E50',
    marginBottom: 12,
    textAlign: 'center',
  },
  playerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  playerName: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#2C3E50',
  },
  emptySlot: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#BDC3C7',
    fontStyle: 'italic',
  },
  hostBadge: {
    fontSize: 10,
    fontFamily: 'Nunito-Bold',
    color: '#FF6B9D',
    backgroundColor: '#FFE5E5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  leaveButton: {
    marginTop: 40,
    width: '80%',
  },
});