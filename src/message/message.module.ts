import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MessageService } from './message.service';
import { MessageGateway } from './message.gateway';
import Message from './entities/message.entity';
import Conversation from './entities/conversation.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Message, Conversation]), AuthModule, UsersModule],
  providers: [MessageService, MessageGateway],
})
export class MessageModule {}
