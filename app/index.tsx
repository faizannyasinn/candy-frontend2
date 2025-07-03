import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useGame } from '@/contexts/GameContext';
import GradientButton from '@/components/GradientButton';

export default function HomeScreen() {
  const [createRoomName, setCreateRoomName] = useState('');
  const [joinRoomName, setJoinRoomName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);

  const { createRoom, joinRoom, state } = useGame();

  const handleCreateRoom = async () => {
    if (!createRoomName.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }

    setIsCreating(true);
    try {
      await createRoom(createRoomName.trim());
      router.push('/waiting-room');
    } catch (error) {
      Alert.alert('Error', 'Failed to create room');
    } finally {
      setIsCreating(false);
    }
  };

  const handleJoinRoom = async () => {
    if (!joinRoomName.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }
    if (!roomCode.trim()) {
      Alert.alert('Error', 'Please enter room code');
      return;
    }

    setIsJoining(true);
    try {
      await joinRoom(joinRoomName.trim(), roomCode.trim().toUpperCase());
      router.push('/poison-selection');
    } catch (error) {
      Alert.alert('Error', 'Failed to join room. Please check the room code.');
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#FFE5E5', '#E5FFE5', '#E5E5FF']}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}>
        
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}>
          
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}>
            
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>🍭 CandyBoard</Text>
              <Text style={styles.subtitle}>Multiplayer Poison Candy Game</Text>
              <Text style={styles.description}>
                Create a room and share the code with a friend, or join an existing room to play together!
              </Text>
            </View>

            {/* Create Room Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Create Room</Text>
              <Text style={styles.sectionDescription}>
                Start a new game and get a room code to share
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your name"
                value={createRoomName}
                onChangeText={setCreateRoomName}
                maxLength={20}
                autoCapitalize="words"
                returnKeyType="done"
                placeholderTextColor="#999999"
              />
              <GradientButton
                title={isCreating ? "Creating..." : "Create Room"}
                onPress={handleCreateRoom}
                disabled={isCreating || !createRoomName.trim()}
                colors={['#FF6B9D', '#C44569']}
                style={styles.button}
              />
            </View>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Join Room Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Join Room</Text>
              <Text style={styles.sectionDescription}>
                Enter a room code from your friend to join their game
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your name"
                value={joinRoomName}
                onChangeText={setJoinRoomName}
                maxLength={20}
                autoCapitalize="words"
                returnKeyType="next"
                placeholderTextColor="#999999"
              />
              <TextInput
                style={styles.input}
                placeholder="Enter room code (e.g., ABC123)"
                value={roomCode}
                onChangeText={(text) => setRoomCode(text.toUpperCase())}
                maxLength={6}
                autoCapitalize="characters"
                returnKeyType="done"
                placeholderTextColor="#999999"
              />
              <GradientButton
                title={isJoining ? "Joining..." : "Join Room"}
                onPress={handleJoinRoom}
                disabled={isJoining || !joinRoomName.trim() || !roomCode.trim()}
                colors={['#4ECDC4', '#44A08D']}
                style={styles.button}
              />
            </View>

            {/* How to Play */}
            <View style={styles.howToPlay}>
              <Text style={styles.howToPlayTitle}>How to Play</Text>
              <Text style={styles.howToPlayText}>
                1. Each player secretly selects a "poison" candy{'\n'}
                2. Take turns eating candies from the board{'\n'}
                3. If you eat your opponent's poison candy, you lose!{'\n'}
                4. Last player standing wins the game
              </Text>
            </View>

            {/* Error Display */}
            {state.error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{state.error}</Text>
              </View>
            )}

            {/* Debug Info */}
            {__DEV__ && (
              <View style={styles.debugContainer}>
                <Text style={styles.debugTitle}>Debug Info</Text>
                <Text style={styles.debugText}>Player ID: {state.playerId}</Text>
                <Text style={styles.debugText}>Connection: {state.connectionStatus}</Text>
                {state.currentRoom && (
                  <Text style={styles.debugText}>Room: {state.currentRoom.code}</Text>
                )}
              </View>
            )}

          </ScrollView>
        </KeyboardAvoidingView>
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
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Nunito-Bold',
    color: '#2C3E50',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'Nunito-SemiBold',
    color: '#7F8C8D',
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#95A5A6',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Nunito-SemiBold',
    color: '#2C3E50',
    marginBottom: 8,
    textAlign: 'center',
  },
  sectionDescription: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#7F8C8D',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 18,
  },
  input: {
    height: 48,
    borderWidth: 2,
    borderColor: '#E8E8E8',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
    fontFamily: 'Nunito-Regular',
    backgroundColor: '#FAFAFA',
    color: '#2C3E50',
  },
  button: {
    marginTop: 8,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#DDD',
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    fontFamily: 'Nunito-SemiBold',
    color: '#999',
  },
  howToPlay: {
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#4ECDC4',
  },
  howToPlayTitle: {
    fontSize: 16,
    fontFamily: 'Nunito-SemiBold',
    color: '#2C3E50',
    marginBottom: 12,
  },
  howToPlayText: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#5D6D7E',
    lineHeight: 20,
  },
  errorContainer: {
    backgroundColor: '#FFE5E5',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B9D',
  },
  errorText: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#C44569',
    textAlign: 'center',
  },
  debugContainer: {
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    padding: 12,
    marginTop: 20,
  },
  debugTitle: {
    fontSize: 12,
    fontFamily: 'Nunito-SemiBold',
    color: '#666',
    marginBottom: 4,
  },
  debugText: {
    fontSize: 10,
    fontFamily: 'Nunito-Regular',
    color: '#666',
  },
});