import { PrismaClient, Message } from '@prisma/client';
import { messageDto } from '../dtos/messageDto';

const prisma = new PrismaClient();

export const messageRepository = {
  async createMessage(dto: messageDto): Promise<Message> {
    const newMessage = await prisma.message.create({
      data: {
        uid: dto.uid,
        content: dto.content,
      },
    });
    return newMessage;
  },
};