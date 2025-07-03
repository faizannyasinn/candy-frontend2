import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useGame } from '@/contexts/GameContext';
import GradientButton from '@/components/GradientButton';

export default function PoisonSelectionScreen() {
  const { state, selectPoisonCandy, leaveRoom } = useGame();
  const [selectedCandyId, setSelectedCandyId] = useState<string | null>(null);
  const [hasConfirmed, setHasConfirmed] = useState(false);

  useEffect(() => {
    if (!state.currentRoom) {
      router.replace('/');
      return;
    }

    // Auto-navigate when both players have selected poison
    if (state.currentRoom.gamePhase === 'playing') {
      router.replace('/game-board');
    }
  }, [state.currentRoom]);

  const handleCandySelect = (candyId: string) => {
    if (hasConfirmed) return;
    setSelectedCandyId(candyId);
  };

  const handleConfirmSelection = () => {
    if (!selectedCandyId) return;
    
    selectPoisonCandy(selectedCandyId);
    setHasConfirmed(true);
  };

  const handleLeaveRoom = () => {
    leaveRoom();
    router.replace('/');
  };

  if (!state.currentRoom) {
    return null;
  }

  const currentPlayer = state.currentRoom.players.find(p => p.id === state.playerId);
  const otherPlayer = state.currentRoom.players.find(p => p.id !== state.playerId);
  const bothSelected = state.currentRoom.players.every(p => p.hasSelectedPoison);

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#E5FFE5', '#E5E5FF']}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}>
        
        <View style={styles.selectionContainer}>
          <Text style={styles.title}>🎯 Choose Your Poison</Text>
          
          <Text style={styles.instruction}>
            {hasConfirmed 
              ? "Waiting for your opponent to choose..."
              : "Select ONE candy as your poison candy. Keep it secret!"
            }
          </Text>

          {/* Status indicators */}
          <View style={styles.statusContainer}>
            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>You:</Text>
              <View style={[
                styles.statusIndicator,
                currentPlayer?.hasSelectedPoison ? styles.statusReady : styles.statusWaiting
              ]}>
                <Text style={styles.statusText}>
                  {currentPlayer?.hasSelectedPoison ? '✓ Ready' : '⏳ Choosing'}
                </Text>
              </View>
            </View>
            
            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>{otherPlayer?.name}:</Text>
              <View style={[
                styles.statusIndicator,
                otherPlayer?.hasSelectedPoison ? styles.statusReady : styles.statusWaiting
              ]}>
                <Text style={styles.statusText}>
                  {otherPlayer?.hasSelectedPoison ? '✓ Ready' : '⏳ Choosing'}
                </Text>
              </View>
            </View>
          </View>

          {/* Candy Grid */}
          <View style={styles.candyGrid}>
            {state.currentRoom.candies.map((candy, index) => (
              <TouchableOpacity
                key={candy.id}
                style={[
                  styles.candyItem,
                  selectedCandyId === candy.id && styles.selectedCandy,
                  hasConfirmed && styles.disabledCandy,
                ]}
                onPress={() => handleCandySelect(candy.id)}
                disabled={hasConfirmed}>
                <View
                  style={[
                    styles.candy,
                    { backgroundColor: candy.color },
                    selectedCandyId === candy.id && styles.selectedCandyInner,
                  ]}
                />
                {selectedCandyId === candy.id && !hasConfirmed && (
                  <Text style={styles.poisonLabel}>☠️ POISON</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Action Buttons */}
          <View style={styles.actionContainer}>
            {!hasConfirmed ? (
              <GradientButton
                title="Confirm Poison Selection"
                onPress={handleConfirmSelection}
                disabled={!selectedCandyId}
                colors={['#FF6B6B', '#C44569']}
                style={styles.confirmButton}
              />
            ) : bothSelected ? (
              <View style={styles.readyContainer}>
                <Text style={styles.readyText}>🎮 Both players ready!</Text>
                <Text style={styles.readySubtext}>Starting game...</Text>
              </View>
            ) : (
              <View style={styles.waitingContainer}>
                <Text style={styles.waitingText}>⏳ Waiting for opponent...</Text>
              </View>
            )}

            <GradientButton
              title="Leave Game"
              onPress={handleLeaveRoom}
              colors={['#95A5A6', '#7F8C8D']}
              style={styles.leaveButton}
            />
          </View>
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
  selectionContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Nunito-Bold',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 16,
  },
  instruction: {
    fontSize: 16,
    fontFamily: 'Nunito-Regular',
    color: '#7F8C8D',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
  },
  statusItem: {
    alignItems: 'center',
  },
  statusLabel: {
    fontSize: 14,
    fontFamily: 'Nunito-SemiBold',
    color: '#2C3E50',
    marginBottom: 8,
  },
  statusIndicator: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    minWidth: 80,
    alignItems: 'center',
  },
  statusReady: {
    backgroundColor: '#D5EDDA',
  },
  statusWaiting: {
    backgroundColor: '#FFF3CD',
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Nunito-SemiBold',
    color: '#2C3E50',
  },
  candyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 30,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  candyItem: {
    margin: 8,
    alignItems: 'center',
  },
  candy: {
    width: 50,
    height: 50,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 4,
  },
  selectedCandy: {
    transform: [{ scale: 1.1 }],
  },
  selectedCandyInner: {
    borderWidth: 3,
    borderColor: '#FF6B6B',
  },
  disabledCandy: {
    opacity: 0.6,
  },
  poisonLabel: {
    fontSize: 10,
    fontFamily: 'Nunito-Bold',
    color: '#FF6B6B',
    marginTop: 4,
    textAlign: 'center',
  },
  actionContainer: {
    alignItems: 'center',
  },
  confirmButton: {
    width: '80%',
    marginBottom: 16,
  },
  readyContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  readyText: {
    fontSize: 18,
    fontFamily: 'Nunito-Bold',
    color: '#27AE60',
    marginBottom: 4,
  },
  readySubtext: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#7F8C8D',
  },
  waitingContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  waitingText: {
    fontSize: 16,
    fontFamily: 'Nunito-SemiBold',
    color: '#F39C12',
  },
  leaveButton: {
    width: '60%',
  },
});