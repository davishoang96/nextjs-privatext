import { PrismaClient, Message } from '@prisma/client';

const prisma = new PrismaClient();

export interface createMessageDto {
  uid: string;
  content: string;
}

export const messageRepository = {
  async createMessage(dto: createMessageDto): Promise<Message> {
    const newMessage = await prisma.message.create({
      data: {
        uid: dto.uid,
        content: dto.content,
      },
    });
    return newMessage;
  },
};