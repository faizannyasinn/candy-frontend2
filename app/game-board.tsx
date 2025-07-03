import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useGame } from '@/contexts/GameContext';
import GradientButton from '@/components/GradientButton';

const { width } = Dimensions.get('window');
const BOARD_SIZE = Math.min(width - 40, 350);

export default function GameBoardScreen() {
  const { state, eatCandy, leaveRoom } = useGame();

  useEffect(() => {
    if (!state.currentRoom) {
      router.replace('/');
      return;
    }

    // Auto-navigate when game is finished
    if (state.currentRoom.gamePhase === 'finished') {
      router.replace('/game-result');
    }
  }, [state.currentRoom]);

  const handleCandyPress = (candyId: string) => {
    if (!state.currentRoom || state.currentRoom.currentPlayer !== state.playerId) {
      return;
    }
    
    const candy = state.currentRoom.candies.find(c => c.id === candyId);
    if (candy && !candy.eaten) {
      eatCandy(candyId);
    }
  };

  const handleLeaveRoom = () => {
    leaveRoom();
    router.replace('/');
  };

  if (!state.currentRoom) {
    return null;
  }

  const isMyTurn = state.currentRoom.currentPlayer === state.playerId;
  const currentPlayerName = state.currentRoom.players.find(
    p => p.id === state.currentRoom?.currentPlayer
  )?.name || 'Unknown';
  
  const remainingCandies = state.currentRoom.candies.filter(c => !c.eaten);

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#E5E5FF', '#FFE5E5']}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}>
        
        <View style={styles.gameContainer}>
          {/* Game Header */}
          <View style={styles.gameHeader}>
            <Text style={styles.gameTitle}>🍭 CandyBoard</Text>
            
            <View style={[
              styles.turnIndicator,
              isMyTurn ? styles.myTurnIndicator : styles.opponentTurnIndicator
            ]}>
              <Text style={styles.turnText}>
                {isMyTurn ? "🎯 Your Turn" : `⏳ ${currentPlayerName}'s Turn`}
              </Text>
            </View>

            <Text style={styles.candyCount}>
              {remainingCandies.length} candies remaining
            </Text>
          </View>

          {/* Game Board */}
          <View style={styles.boardContainer}>
            <View style={[styles.board, { width: BOARD_SIZE, height: BOARD_SIZE * 1.2 }]}>
              {state.currentRoom.candies.map((candy) => (
                !candy.eaten && (
                  <TouchableOpacity
                    key={candy.id}
                    style={[
                      styles.candyPosition,
                      {
                        left: (candy.x / 300) * BOARD_SIZE,
                        top: (candy.y / 400) * (BOARD_SIZE * 1.2),
                      },
                    ]}
                    onPress={() => handleCandyPress(candy.id)}
                    disabled={!isMyTurn}>
                    <View
                      style={[
                        styles.candy,
                        { backgroundColor: candy.color },
                        !isMyTurn && styles.disabledCandy,
                      ]}
                    />
                  </TouchableOpacity>
                )
              ))}
            </View>
          </View>

          {/* Game Info */}
          <View style={styles.gameInfo}>
            <Text style={styles.instructionText}>
              {isMyTurn 
                ? "🎯 Tap a candy to eat it! Avoid the poison..." 
                : "⏳ Wait for your opponent's move..."
              }
            </Text>
            
            <View style={styles.playersInfo}>
              {state.currentRoom.players.map(player => (
                <View 
                  key={player.id} 
                  style={[
                    styles.playerInfo,
                    player.id === state.currentRoom!.currentPlayer && styles.activePlayer
                  ]}>
                  <Text style={styles.playerInfoName}>
                    {player.name} {player.id === state.playerId && '(You)'}
                  </Text>
                  {player.id === state.currentRoom!.currentPlayer && (
                    <View style={styles.activeIndicator} />
                  )}
                </View>
              ))}
            </View>
          </View>

          {/* Leave Button */}
          <GradientButton
            title="Leave Game"
            onPress={handleLeaveRoom}
            colors={['#95A5A6', '#7F8C8D']}
            style={styles.leaveGameButton}
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
  gameContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  gameHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  gameTitle: {
    fontSize: 24,
    fontFamily: 'Nunito-Bold',
    color: '#2C3E50',
    marginBottom: 16,
  },
  turnIndicator: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  myTurnIndicator: {
    borderWidth: 2,
    borderColor: '#4ECDC4',
  },
  opponentTurnIndicator: {
    borderWidth: 2,
    borderColor: '#FF6B9D',
  },
  turnText: {
    fontSize: 16,
    fontFamily: 'Nunito-SemiBold',
    color: '#2C3E50',
  },
  candyCount: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#7F8C8D',
  },
  boardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  board: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  candyPosition: {
    position: 'absolute',
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
  disabledCandy: {
    opacity: 0.7,
  },
  gameInfo: {
    alignItems: 'center',
    marginTop: 20,
  },
  instructionText: {
    fontSize: 16,
    fontFamily: 'Nunito-Regular',
    color: '#7F8C8D',
    textAlign: 'center',
    marginBottom: 16,
  },
  playersInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  playerInfo: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  activePlayer: {
    borderWidth: 2,
    borderColor: '#4ECDC4',
  },
  playerInfoName: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#2C3E50',
  },
  activeIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4ECDC4',
    marginLeft: 8,
  },
  leaveGameButton: {
    alignSelf: 'center',
    width: '60%',
  },
});