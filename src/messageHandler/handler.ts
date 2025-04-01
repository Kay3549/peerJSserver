import type { IClient } from "../models/client.js";
import type { IMessage } from "../models/message.js";

export type Handler = (
	client: IClient | undefined,
	message: IMessage,
) => boolean;
