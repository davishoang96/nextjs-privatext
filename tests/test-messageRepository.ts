import {
    messageRepository,
  } from "../src/repositories/messageRepository";
  
import { Message, PrismaClient } from "@prisma/client";
import { messageDto } from '../src/dtos/messageDto';
  
// Mock PrismaClient
jest.mock('@prisma/client', () => {
    const mockMessageCreate = jest.fn();
    return {
        PrismaClient: jest.fn(() => ({
            message: {
                create: mockMessageCreate,
            },
        })),
    };
});

describe('messageRepository.createMessage', () => {
let prisma: PrismaClient;

beforeEach(() => {
    prisma = new PrismaClient(); // Mocked PrismaClient
    jest.clearAllMocks(); // Reset all mocks before each test
});

it('should create a new message and return it', async () => {
    // Arrange: Set up test data and mock behavior
    const dto: messageDto = {
        uid: 'test-uid',
        content: 'This is a test message',
    };

    const mockMessage: Message = {
        id: 1,
        uid: dto.uid,
        content: dto.content,
        createdAt: new Date(),
    };

    (prisma.message.create as jest.Mock).mockResolvedValue(mockMessage);

    // Act: Call the repository method
    const result = await messageRepository.createMessage(dto);

    // Assert: Verify the behavior and output
    expect(prisma.message.create).toHaveBeenCalledTimes(1);
    expect(prisma.message.create).toHaveBeenCalledWith({
        data: {
            uid: dto.uid,
            content: dto.content,
        },
    });
    expect(result).toEqual(mockMessage);
});

it('should throw an error if Prisma fails', async () => {
        // Arrange: Mock Prisma to throw an error
        const dto: messageDto = {
            uid: 'test-uid',
            content: 'This is a test message',
        };
        const error = new Error('Prisma error');
        (prisma.message.create as jest.Mock).mockRejectedValue(error);

        // Act & Assert: Expect the method to throw the error
        await expect(messageRepository.createMessage(dto)).rejects.toThrow('Prisma error');
            expect(prisma.message.create).toHaveBeenCalledTimes(1);
            expect(prisma.message.create).toHaveBeenCalledWith({
            data: {
                uid: dto.uid,
                content: dto.content,
            },
        });
    });
});
  