import { NextApiRequest, NextApiResponse } from "next";
import { messageDto } from "../../dtos/messageDto";
import { messageRepository } from "../../repositories/messageRepository";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { query: { uid }, } = req;

	if (req.method !== "GET") {
		return res.status(405).json({ message: "Method Not Allowed" });
	}

	if (!uid || typeof uid !== "string") {
		return res.status(400).json({ message: "Invalid UID" });
	}

	const message = await messageRepository.getMessageByUid(uid);
    if (!message) {
		return res.status(404).json({ message: "Message not found" });
	}

    const dto: messageDto = {
        uid: message.uid,
        content: message.content,
    };

    return res.status(200).json(message);
}
