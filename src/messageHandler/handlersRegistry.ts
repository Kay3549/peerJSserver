import type { MessageType } from "../enums.js";
import type { IClient } from "../models/client.js";
import type { IMessage } from "../models/message.js";
import type { Handler } from "./handler.js";

export interface IHandlersRegistry {
	registerHandler(messageType: MessageType, handler: Handler): void;
	handle(client: IClient | undefined, message: IMessage): boolean;
}

export class HandlersRegistry implements IHandlersRegistry {
	private readonly handlers = new Map<MessageType, Handler>();

	public registerHandler(messageType: MessageType, handler: Handler): void {
		if (this.handlers.has(messageType)) return;

		this.handlers.set(messageType, handler);
	}

	public handle(client: IClient | undefined, message: IMessage): boolean {
		const { type } = message;

		const handler = this.handlers.get(type);

		if (!handler) return false;

		return handler(client, message);
	}
}
