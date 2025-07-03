import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Switch,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Settings as SettingsIcon, Volume2, Vibrate, Info } from 'lucide-react-native';
import { useGame } from '@/contexts/GameContext';

export default function SettingsScreen() {
  const { state } = useGame();
  const [soundEnabled, setSoundEnabled] = React.useState(true);
  const [hapticEnabled, setHapticEnabled] = React.useState(Platform.OS !== 'web');

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#E5E5FF', '#FFE5E5']}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}>
        
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <SettingsIcon size={32} color="#2C3E50" />
            <Text style={styles.title}>Settings</Text>
          </View>

          {/* Player Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Player</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Name:</Text>
              <Text style={styles.infoValue}>
                {state.playerName || 'Not set'}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Player ID:</Text>
              <Text style={styles.infoValue}>{state.playerId}</Text>
            </View>
          </View>

          {/* Game Settings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Game Settings</Text>
            
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Volume2 size={20} color="#7F8C8D" />
                <Text style={styles.settingLabel}>Sound Effects</Text>
              </View>
              <Switch
                value={soundEnabled}
                onValueChange={setSoundEnabled}
                trackColor={{ false: '#DDD', true: '#4ECDC4' }}
                thumbColor={soundEnabled ? '#FFFFFF' : '#F4F3F4'}
              />
            </View>

            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Vibrate size={20} color="#7F8C8D" />
                <Text style={styles.settingLabel}>Haptic Feedback</Text>
              </View>
              <Switch
                value={hapticEnabled}
                onValueChange={setHapticEnabled}
                trackColor={{ false: '#DDD', true: '#4ECDC4' }}
                thumbColor={hapticEnabled ? '#FFFFFF' : '#F4F3F4'}
                disabled={Platform.OS === 'web'}
              />
            </View>
          </View>

          {/* Connection Status */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Connection</Text>
            <View style={styles.statusRow}>
              <View style={[
                styles.statusIndicator,
                { backgroundColor: getStatusColor(state.connectionStatus) }
              ]} />
              <Text style={styles.statusText}>
                {getStatusText(state.connectionStatus)}
              </Text>
            </View>
            
            {state.currentRoom && (
              <View style={styles.roomInfo}>
                <Text style={styles.roomInfoLabel}>Current Room:</Text>
                <Text style={styles.roomInfoValue}>{state.currentRoom.code}</Text>
              </View>
            )}
          </View>

          {/* About */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <View style={styles.aboutRow}>
              <Info size={20} color="#7F8C8D" />
              <View style={styles.aboutText}>
                <Text style={styles.aboutTitle}>CandyBoard v1.0.0</Text>
                <Text style={styles.aboutDescription}>
                  A cozy multiplayer mobile game where players take turns selecting candies on a shared board.
                </Text>
              </View>
            </View>
          </View>

          {/* Game Rules */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>How to Play</Text>
            <View style={styles.rulesContainer}>
              <Text style={styles.ruleText}>1. Create or join a room with a friend</Text>
              <Text style={styles.ruleText}>2. Take turns selecting candies on the board</Text>
              <Text style={styles.ruleText}>3. Each turn has a 30-second time limit</Text>
              <Text style={styles.ruleText}>4. Use touch gestures to interact with candies</Text>
              <Text style={styles.ruleText}>5. Have fun and enjoy the sweet gameplay!</Text>
            </View>
          </View>

        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'connected':
      return '#4ECDC4';
    case 'connecting':
      return '#FFD93D';
    case 'error':
      return '#FF6B6B';
    default:
      return '#DDD';
  }
}

function getStatusText(status: string): string {
  switch (status) {
    case 'connected':
      return 'Connected';
    case 'connecting':
      return 'Connecting...';
    case 'error':
      return 'Connection Error';
    default:
      return 'Disconnected';
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Nunito-Bold',
    color: '#2C3E50',
    marginTop: 10,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Nunito-SemiBold',
    color: '#2C3E50',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#7F8C8D',
  },
  infoValue: {
    fontSize: 14,
    fontFamily: 'Nunito-SemiBold',
    color: '#2C3E50',
    flex: 1,
    textAlign: 'right',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontFamily: 'Nunito-Regular',
    color: '#2C3E50',
    marginLeft: 12,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  statusText: {
    fontSize: 16,
    fontFamily: 'Nunito-Regular',
    color: '#2C3E50',
  },
  roomInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  roomInfoLabel: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#7F8C8D',
  },
  roomInfoValue: {
    fontSize: 16,
    fontFamily: 'Nunito-Bold',
    color: '#FF6B9D',
  },
  aboutRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  aboutText: {
    flex: 1,
    marginLeft: 12,
  },
  aboutTitle: {
    fontSize: 16,
    fontFamily: 'Nunito-SemiBold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  aboutDescription: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#7F8C8D',
    lineHeight: 20,
  },
  rulesContainer: {
    paddingLeft: 8,
  },
  ruleText: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#2C3E50',
    marginBottom: 8,
    lineHeight: 20,
  },
});