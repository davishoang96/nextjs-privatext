import { NextApiRequest, NextApiResponse } from "next";
import { messageDto } from "../../dtos/messageDto";
import { messageRepository } from "../../repositories/messageRepository";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method === "POST") {
		try {
			const { uid, content } = req.body;

			// Validate request body
			if (!uid || !content) {
				return res
					.status(400)
					.json({ error: "uid and content are required." });
			}

			const dto: messageDto = { uid, content };

			// Save the message
			const newMessage = await messageRepository.createMessage(dto);
			return res.status(201).json(newMessage);
		} catch (error: any) {
			console.error("Error saving message:", error);
			return res
				.status(500)
				.json({ error: "Failed to save the message." });
		}
	} else {
		res.setHeader("Allow", ["POST"]);
		return res
			.status(405)
			.json({ error: `Method ${req.method} not allowed.` });
	}
}
