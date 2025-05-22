import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';

@Injectable()
@WebSocketGateway(3002, {
  cors: {
    origin: '*',
  },
  transport: ['websocket'],
})
export class ScooterTrackingGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  private server: Server;

  constructor() {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join-scooter')
  handleJoinRoom(client: Socket, scooterId: string) {
    if (!scooterId) return;
    client.join(`scooter-${scooterId}`);
    console.log(`Client ${client.id} joined room: scooter-${scooterId}`);
  }

  @SubscribeMessage('leave-scooter')
  handleLeaveRoom(client: Socket, scooterId: string) {
    client.leave(`scooter-${scooterId}`);
    console.log(`Client ${client.id} left room: scooter-${scooterId}`);
  }

  emit(topic: string, message: any) {
    try {
      this.server.emit(topic, message);
    } catch (error: unknown) {
      console.log({ error });
    }
  }

  emitToScooter(scooterId: string, event: string, data: any) {
    console.log('emitiu', `scooter-${scooterId}`, event, data);
    this.server.to(`scooter-${scooterId}`).emit(event, data);
  }
}
