import React, { createContext, useContext, useReducer, useEffect } from 'react';

export interface Candy {
  id: string;
  color: string;
  x: number;
  y: number;
  eaten: boolean;
}

export interface Player {
  id: string;
  name: string;
  isHost: boolean;
  poisonCandyId?: string;
  hasSelectedPoison: boolean;
}

export interface GameRoom {
  id: string;
  code: string;
  players: Player[];
  currentPlayer: string;
  candies: Candy[];
  gamePhase: 'waiting' | 'poison-selection' | 'playing' | 'finished';
  winner?: string;
  loser?: string;
  lastUpdated: number;
}

interface GameState {
  currentRoom?: GameRoom;
  playerName: string;
  playerId: string;
  connectionStatus: 'disconnected' | 'connecting' | 'connected' | 'error';
  error?: string;
}

type GameAction =
  | { type: 'SET_PLAYER_NAME'; payload: string }
  | { type: 'SET_CONNECTION_STATUS'; payload: GameState['connectionStatus'] }
  | { type: 'SET_ROOM'; payload: GameRoom }
  | { type: 'UPDATE_ROOM'; payload: Partial<GameRoom> }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'CLEAR_ERROR' }
  | { type: 'LEAVE_ROOM' }
  | { type: 'SELECT_POISON'; payload: string }
  | { type: 'EAT_CANDY'; payload: string }
  | { type: 'SET_GAME_PHASE'; payload: GameRoom['gamePhase'] };

const initialState: GameState = {
  playerName: '',
  playerId: Math.random().toString(36).substr(2, 9),
  connectionStatus: 'disconnected',
};

// Predefined candy colors - 15 distinct colors
const CANDY_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
  '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
  '#F8C471', '#82E0AA', '#F1948A', '#AED6F1', '#D7BDE2'
];

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_PLAYER_NAME':
      return { ...state, playerName: action.payload };
    case 'SET_CONNECTION_STATUS':
      return { ...state, connectionStatus: action.payload };
    case 'SET_ROOM':
      return { ...state, currentRoom: action.payload };
    case 'UPDATE_ROOM':
      return {
        ...state,
        currentRoom: state.currentRoom
          ? { ...state.currentRoom, ...action.payload }
          : undefined,
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload, connectionStatus: 'error' };
    case 'CLEAR_ERROR':
      return { ...state, error: undefined };
    case 'LEAVE_ROOM':
      return { ...state, currentRoom: undefined, connectionStatus: 'disconnected' };
    case 'SELECT_POISON':
      if (!state.currentRoom) return state;
      const updatedPlayers = state.currentRoom.players.map(player =>
        player.id === state.playerId
          ? { ...player, poisonCandyId: action.payload, hasSelectedPoison: true }
          : player
      );
      return {
        ...state,
        currentRoom: {
          ...state.currentRoom,
          players: updatedPlayers,
        },
      };
    case 'EAT_CANDY':
      if (!state.currentRoom) return state;
      const updatedCandies = state.currentRoom.candies.map(candy =>
        candy.id === action.payload ? { ...candy, eaten: true } : candy
      );
      return {
        ...state,
        currentRoom: {
          ...state.currentRoom,
          candies: updatedCandies,
        },
      };
    case 'SET_GAME_PHASE':
      return {
        ...state,
        currentRoom: state.currentRoom
          ? { ...state.currentRoom, gamePhase: action.payload }
          : undefined,
      };
    default:
      return state;
  }
}

const GameContext = createContext<{
  state: GameState;
  createRoom: (playerName: string) => Promise<void>;
  joinRoom: (playerName: string, roomCode: string) => Promise<void>;
  selectPoisonCandy: (candyId: string) => void;
  eatCandy: (candyId: string) => void;
  leaveRoom: () => void;
} | null>(null);

// Simple in-memory storage for demo purposes
const rooms = new Map<string, GameRoom>();

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const generateCandies = (): Candy[] => {
    const candies: Candy[] = [];
    const boardWidth = 300;
    const boardHeight = 400;
    const candyRadius = 25;
    
    for (let i = 0; i < 15; i++) {
      let x, y;
      let attempts = 0;
      
      // Generate random position ensuring no overlap
      do {
        x = Math.random() * (boardWidth - candyRadius * 2) + candyRadius;
        y = Math.random() * (boardHeight - candyRadius * 2) + candyRadius;
        attempts++;
      } while (
        attempts < 50 && 
        candies.some(candy => {
          const distance = Math.sqrt((candy.x - x) ** 2 + (candy.y - y) ** 2);
          return distance < candyRadius * 2.5; // Minimum distance between candies
        })
      );
      
      candies.push({
        id: `candy-${i}`,
        color: CANDY_COLORS[i],
        x,
        y,
        eaten: false,
      });
    }
    
    return candies;
  };

  const createRoom = async (playerName: string) => {
    dispatch({ type: 'SET_PLAYER_NAME', payload: playerName });
    dispatch({ type: 'SET_CONNECTION_STATUS', payload: 'connecting' });
    dispatch({ type: 'CLEAR_ERROR' });
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const roomCode = Math.random().toString(36).substr(2, 6).toUpperCase();
      const room: GameRoom = {
        id: Math.random().toString(36).substr(2, 9),
        code: roomCode,
        players: [
          {
            id: state.playerId,
            name: playerName,
            isHost: true,
            hasSelectedPoison: false,
          },
        ],
        currentPlayer: state.playerId,
        candies: generateCandies(),
        gamePhase: 'waiting',
        lastUpdated: Date.now(),
      };
      
      rooms.set(roomCode, room);
      dispatch({ type: 'SET_ROOM', payload: room });
      dispatch({ type: 'SET_CONNECTION_STATUS', payload: 'connected' });
      
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to create room' });
    }
  };

  const joinRoom = async (playerName: string, roomCode: string) => {
    dispatch({ type: 'SET_PLAYER_NAME', payload: playerName });
    dispatch({ type: 'SET_CONNECTION_STATUS', payload: 'connecting' });
    dispatch({ type: 'CLEAR_ERROR' });
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const room = rooms.get(roomCode.toUpperCase());
      if (!room) {
        throw new Error('Room not found. Please check the room code.');
      }
      
      if (room.players.length >= 2) {
        throw new Error('Room is full. Maximum 2 players allowed.');
      }
      
      // Check if player is already in the room
      const existingPlayer = room.players.find(p => p.id === state.playerId);
      if (existingPlayer) {
        // Player is rejoining
        dispatch({ type: 'SET_ROOM', payload: room });
        dispatch({ type: 'SET_CONNECTION_STATUS', payload: 'connected' });
        return;
      }
      
      const updatedRoom: GameRoom = {
        ...room,
        players: [
          ...room.players,
          {
            id: state.playerId,
            name: playerName,
            isHost: false,
            hasSelectedPoison: false,
          },
        ],
        gamePhase: 'poison-selection',
        lastUpdated: Date.now(),
      };
      
      rooms.set(roomCode.toUpperCase(), updatedRoom);
      dispatch({ type: 'SET_ROOM', payload: updatedRoom });
      dispatch({ type: 'SET_CONNECTION_STATUS', payload: 'connected' });
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to join room';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
    }
  };

  const selectPoisonCandy = (candyId: string) => {
    if (!state.currentRoom) return;
    
    const updatedPlayers = state.currentRoom.players.map(player =>
      player.id === state.playerId
        ? { ...player, poisonCandyId: candyId, hasSelectedPoison: true }
        : player
    );
    
    const updatedRoom = {
      ...state.currentRoom,
      players: updatedPlayers,
      lastUpdated: Date.now(),
    };
    
    // Check if both players have selected poison
    if (updatedPlayers.every(p => p.hasSelectedPoison)) {
      updatedRoom.gamePhase = 'playing';
    }
    
    rooms.set(state.currentRoom.code, updatedRoom);
    dispatch({ type: 'SET_ROOM', payload: updatedRoom });
  };

  const eatCandy = (candyId: string) => {
    if (!state.currentRoom || state.currentRoom.currentPlayer !== state.playerId) return;
    
    const updatedCandies = state.currentRoom.candies.map(candy =>
      candy.id === candyId ? { ...candy, eaten: true } : candy
    );
    
    // Check if eaten candy is someone's poison
    const poisonOwner = state.currentRoom.players.find(p => p.poisonCandyId === candyId);
    
    let updatedRoom: GameRoom;
    
    if (poisonOwner) {
      // Current player ate poison candy - they lose
      updatedRoom = {
        ...state.currentRoom,
        candies: updatedCandies,
        gamePhase: 'finished',
        loser: state.playerId,
        winner: poisonOwner.id,
        lastUpdated: Date.now(),
      };
    } else {
      // Switch turns
      const otherPlayer = state.currentRoom.players.find(p => p.id !== state.playerId);
      updatedRoom = {
        ...state.currentRoom,
        candies: updatedCandies,
        currentPlayer: otherPlayer?.id || state.playerId,
        lastUpdated: Date.now(),
      };
    }
    
    rooms.set(state.currentRoom.code, updatedRoom);
    dispatch({ type: 'SET_ROOM', payload: updatedRoom });
  };

  const leaveRoom = () => {
    if (state.currentRoom) {
      const room = rooms.get(state.currentRoom.code);
      if (room) {
        const currentPlayer = room.players.find(p => p.id === state.playerId);
        if (currentPlayer?.isHost || room.players.length === 1) {
          // Host is leaving or last player - delete the room
          rooms.delete(state.currentRoom.code);
        } else {
          // Guest is leaving - remove from players list
          const updatedRoom = {
            ...room,
            players: room.players.filter(p => p.id !== state.playerId),
            gamePhase: 'waiting' as const,
            lastUpdated: Date.now(),
          };
          rooms.set(state.currentRoom.code, updatedRoom);
        }
      }
    }
    dispatch({ type: 'LEAVE_ROOM' });
  };

  return (
    <GameContext.Provider
      value={{
        state,
        createRoom,
        joinRoom,
        selectPoisonCandy,
        eatCandy,
        leaveRoom,
      }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}