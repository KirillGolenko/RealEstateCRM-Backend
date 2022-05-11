import { Body, Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { AuthService } from 'src/auth/auth.service';
import { MessageService } from './message.service';
import { MessageDto } from './dto/message.dto';
import { ITyping } from './interface/typing.interface';
import Message from './entities/message.entity';

@WebSocketGateway({ cors: true })
export class MessageGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly messageService: MessageService, private readonly authService: AuthService) {}

  private _logger: Logger = new Logger(MessageGateway.name);
  private _usersOnline = [];

  @WebSocketServer() wss: Server;

  afterInit(server: Server) {
    this._logger.log('MessageGetaway initialized!');
  }

  async handleConnection(socket: Socket) {
    if (!socket.handshake.headers.authorization) {
      socket.disconnect();
      return;
    }
    const user = await this.authService.getUserByToken(socket.handshake?.headers?.authorization);

    if (!user) {
      socket.disconnect();
      return;
    }

    const userConnect = this._usersOnline.find((item) => item.userId === user.id);

    if (!userConnect) {
      this._usersOnline.push({ userId: user.id, socketId: socket.id });
      this._logger.log(`User connected:  ${user.id}`);
    } else {
      socket.disconnect();
    }
  }

  async handleDisconnect(socket: Socket) {
    const user = await this.authService.getUserByToken(socket.handshake.headers.authorization);

    if (!user) {
      return 'User not found';
    }

    this._usersOnline = this._usersOnline.filter((value) => value.userId !== user.id);
  }

  @SubscribeMessage('typing')
  async handleTyping(@ConnectedSocket() socket: Socket, @Body() typingParams: ITyping): Promise<any> {
    const user = await this.authService.getUserByToken(socket.handshake.headers.authorization);
    const recipientSocetId = await this.messageService.createMessageAction(
      typingParams.userId,
      user.id,
      this._usersOnline
    );

    this.wss.to(recipientSocetId).emit('display', JSON.stringify(typingParams.typing));
  }

  @SubscribeMessage('get-users-online-to-server')
  async handleUsersOnline(): Promise<any> {
    this.wss.emit('get-users-online-to-client', this._usersOnline);
  }

  @SubscribeMessage('update-status-message-to-server')
  async handleViewMessages(@ConnectedSocket() socket: Socket, @MessageBody() messages: Message[]): Promise<any> {
    const user = await this.authService.getUserByToken(socket.handshake.headers.authorization);

    const messagesUpdate = await this.messageService.changeReadStatus(messages, user.id);

    this.wss.emit('update-status-message-to-client', messagesUpdate);
  }

  @SubscribeMessage('new-message-to-server')
  async handleNewMessage(@ConnectedSocket() socket: Socket, @MessageBody() messageDto: MessageDto): Promise<any> {
    const user = await this.authService.getUserByToken(socket.handshake.headers.authorization);
    const message = await this.messageService.createConversationAndMessage(user.id, messageDto);

    const recipientSocetId = await this.messageService.createMessageAction(
      messageDto.recipient,
      user.id,
      this._usersOnline
    );

    const amountUnreadMessages = await this.messageService.checkAmountMessages(messageDto.recipient);

    this.wss.emit('new-message-to-client', message);
    this.wss.to(recipientSocetId).emit('notification-to-client', amountUnreadMessages);
  }

  @SubscribeMessage('get-messages-conversation-to-server')
  async handleMessagesConversation(@ConnectedSocket() socket: Socket, @MessageBody() userId: number): Promise<any> {
    const user = await this.authService.getUserByToken(socket.handshake.headers.authorization);

    const messages = await this.messageService.getAllMessages([
      { sender: user.id, recipient: userId },
      { sender: userId, recipient: user.id },
    ]);

    this.wss.emit('get-messages-conversation-to-client', messages);
  }

  @SubscribeMessage('no-notification-to-server')
  async handleNotification(@ConnectedSocket() socket: Socket, @MessageBody() userId: number): Promise<any> {
    const user = await this.authService.getUserByToken(socket.handshake.headers.authorization);

    const recipientSocetId = await this.messageService.createMessageAction(userId, user.id, this._usersOnline);

    this.wss.to(recipientSocetId).emit('notification-to-client', 0);
  }
}
