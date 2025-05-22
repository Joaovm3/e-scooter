import { io, Socket } from 'socket.io-client';
import { Platform } from 'react-native';
import { ScooterPosition, ScooterStatus } from '@/types/scooter';

class SocketService {
  private socket: Socket | null = null;
  private positionCallback: ((data: ScooterPosition) => void) | null = null;

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.socket?.connected) {
        resolve();
        return;
      }

      const url = process.env.EXPO_PUBLIC_WEB_SOCKET_URL;

      this.socket = io(url, {
        transports: ['websocket'],
      });

      this.socket.on('connect', () => {
        console.log('[Socket] Connected');
        resolve();
      });

      this.socket.on('connect_error', (error) => {
        console.error('[Socket] Connection error:', error);
        reject(error);
      });

      this.socket.on('scooter-position', (data: ScooterPosition) => {
        console.log('[Socket] Received position:', data);
        if (this.positionCallback) {
          this.positionCallback(data);
        }
      });
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.positionCallback = null;
    }
  }

  async joinScooterRoom(scooterId: string): Promise<void> {
    try {
      if (!this.socket?.connected) {
        await this.connect();
      }

      return new Promise((resolve, reject) => {
        if (!this.socket) {
          reject(new Error('Socket connection failed'));
          return;
        }

        console.log('[Socket] Joining room for scooter:', scooterId);
        this.socket.emit('join-scooter', scooterId);
        resolve();
      });
    } catch (error) {
      console.error('[Socket] Error joining room:', error);
      throw error;
    }
  }

  async leaveScooterRoom(scooterId: string): Promise<void> {
    try {
      if (!this.socket?.connected) {
        throw new Error('Socket not connected');
      }

      console.log('[Socket] Leaving room for scooter:', scooterId);
      this.socket.emit('leave-scooter', scooterId);
    } catch (error) {
      console.error('[Socket] Error leaving room:', error);
      throw error;
    }
  }

  subscribeToScooterPosition(callback: (data: ScooterPosition) => void) {
    this.positionCallback = callback;
  }

  unsubscribeFromScooterPosition() {
    this.positionCallback = null;
  }
}

export const socketService = new SocketService();
