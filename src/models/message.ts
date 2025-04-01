import type { MessageType } from "../enums.js";

export interface IMessage {
	readonly type: MessageType;
	readonly src: string;
	readonly dst: string;
	readonly payload?: string | undefined;
}
