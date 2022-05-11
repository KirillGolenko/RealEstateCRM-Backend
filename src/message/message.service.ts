import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { MessageDto } from './dto/message.dto';
import Conversation from './entities/conversation.entity';
import Message from './entities/message.entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>
  ) {}

  async getAllMessages(conversationData) {
    const conversations = await conversationData.reduce(async (accumulator, current) => {
      const dialog = await this.conversationRepository.findOne(current);
      const acc = await accumulator;
      if (dialog) {
        acc.push(dialog);
      }
      return acc;
    }, Promise.resolve([]));

    if (conversations.length > 0) {
      const messages = await conversations.reduce(async (accumulator, current) => {
        const letters = await this.messageRepository.find({
          conversation: {
            id: current.id,
          },
        });
        const acc = await accumulator;
        if (letters.length > 0) {
          acc.push(...letters);
        }
        return acc;
      }, Promise.resolve([]));

      return messages;
    }
  }

  async createMessageAction(recipientId: number, senderId: number, onlineUsers: any) {
    const sender = await onlineUsers.find((user) => user.userId === senderId);

    if (sender) {
      const recipient = await onlineUsers.find((user) => user.userId === recipientId);

      if (recipient) {
        return recipient.socketId;
      }
    }
  }

  async createConversationAndMessage(senderId: number, messageData: MessageDto) {
    const existingDialog = await this.conversationRepository.findOne({
      sender: senderId,
      recipient: messageData.recipient,
    });

    const newMessage = this.messageRepository.create({ message: messageData.message, author: senderId });
    newMessage.conversation = existingDialog;

    if (!existingDialog) {
      const conversation = this.conversationRepository.create({ sender: senderId, recipient: messageData.recipient });
      const dialog = await this.conversationRepository.save(conversation);
      newMessage.conversation = dialog;
    }

    await this.messageRepository.save(newMessage);

    return newMessage;
  }

  async changeReadStatus(messages: Message[], sender: number) {
    const updateMessages = [];
    for (const message of messages) {
      if (message.author !== sender && !message.read) {
        await this.messageRepository.update({ id: message.id }, { read: true });
      }

      const newMessage = await this.messageRepository.findOne({ id: message.id });
      updateMessages.push(newMessage);
    }
    return updateMessages;
  }

  async checkAmountMessages(recipient: number) {
    const conversation = await this.conversationRepository.find({ recipient });
    if (conversation) {
      let dialog = [];
      dialog = await conversation.reduce(async (accumulator, current) => {
        const letters = await this.messageRepository.find({
          conversation: {
            id: current.id,
          },
        });
        const acc = await accumulator;
        if (letters.length > 0) {
          acc.push(...letters);
        }
        return acc;
      }, Promise.resolve([]));

      if (dialog) {
        const messages = dialog.filter((message) => !message.read);

        if (messages) {
          return messages.length;
        }
      }
    }
  }
}
