import { messageRepository } from "../src/repositories/messageRepository";

import { Message, PrismaClient } from "@prisma/client";
import { messageDto } from "../src/dtos/messageDto";

// Mock PrismaClient
jest.mock("@prisma/client", () => {
	const mockMessageCreate = jest.fn();
	const mockFindUnique = jest.fn();
	return {
		PrismaClient: jest.fn(() => ({
			message: {
				create: mockMessageCreate,
				findUnique: mockFindUnique,
			},
		})),
	};
});

describe("messageRepository.getMessageByUid", () => {
	let prisma: PrismaClient;

	beforeEach(() => {
		prisma = new PrismaClient(); // Mocked PrismaClient
		jest.clearAllMocks(); // Reset mocks before each test
	});

	it("should return a message when a matching uid is found", async () => {
		// Arrange
		const uid = "43q0[9ig34[sdc";
		const mockMessage: Message = {
			id: 1,
			uid,
			content: "This is a test message",
			createdAt: new Date(),
		};

		(prisma.message.findUnique as jest.Mock).mockResolvedValue(mockMessage);

		// Act
		const result = await messageRepository.getMessageByUid(uid);

		// Assert
		expect(prisma.message.findUnique).toHaveBeenCalledTimes(1);
		expect(prisma.message.findUnique).toHaveBeenCalledWith({
			where: {
				uid,
			},
		});
		expect(result).toEqual(mockMessage);
	});

	it("should return null when no matching uid is found", async () => {
		// Arrange
		const uid = "nonexistent-uid";
		(prisma.message.findUnique as jest.Mock).mockResolvedValue(null);

		// Act
		const result = await messageRepository.getMessageByUid(uid);

		// Assert
		expect(prisma.message.findUnique).toHaveBeenCalledTimes(1);
		expect(prisma.message.findUnique).toHaveBeenCalledWith({
			where: {
				uid,
			},
		});
		expect(result).toBeNull();
	});
});

describe("messageRepository.createMessage", () => {
	let prisma: PrismaClient;

	beforeEach(() => {
		prisma = new PrismaClient(); // Mocked PrismaClient
		jest.clearAllMocks(); // Reset all mocks before each test
	});

	it("should create a new message and return it", async () => {
		// Arrange: Set up test data and mock behavior
		const dto: messageDto = {
			uid: "test-uid",
			content: "This is a test message",
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

	it("should throw an error if Prisma fails", async () => {
		// Arrange: Mock Prisma to throw an error
		const dto: messageDto = {
			uid: "test-uid",
			content: "This is a test message",
		};
		const error = new Error("Prisma error");
		(prisma.message.create as jest.Mock).mockRejectedValue(error);

		// Act & Assert: Expect the method to throw the error
		await expect(messageRepository.createMessage(dto)).rejects.toThrow(
			"Prisma error"
		);
		expect(prisma.message.create).toHaveBeenCalledTimes(1);
		expect(prisma.message.create).toHaveBeenCalledWith({
			data: {
				uid: dto.uid,
				content: dto.content,
			},
		});
	});
});
